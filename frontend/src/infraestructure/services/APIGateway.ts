import type { Gateway } from "../../application/service/gateway";

export class APIGateway implements Gateway {
    private baseUrl: string;

    constructor() {
        this.baseUrl = `${import.meta.env.VITE_API_URL}/api/`;
    }

    private async refreshAccessToken(): Promise<string | null> {
        const refresh = localStorage.getItem("refresh");
        if (!refresh) return null;

        try {
            const response = await fetch(`${this.baseUrl}token/refresh/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ refresh }),
            });

            if (!response.ok) throw new Error("No se pudo refrescar el token");

            const data = await response.json();
            const newAccess = data.access;
            if (newAccess) {
                localStorage.setItem("access", newAccess);
                return newAccess;
            }
        } catch (err) {
            console.error("Error al refrescar el token:", err);
        }

        // Si no se pudo refrescar, elimina los tokens
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        return null;
    }

    private async request(
        method: string,
        url: string,
        data?: Record<string, any>,
        headers?: Record<string, any>,
        file?: boolean,
    ): Promise<any> {
        const access = localStorage.getItem("access") ?? "";
        const authHeader: Record<string, any> = access ? { Authorization: `Bearer ${access}` } : {};

        const options : RequestInit= {
            method,
            headers: {
                "Content-Type": "application/json",
                ...authHeader,
                ...headers,
            },
        };

        if (data) options.body = JSON.stringify(data);

        let response = await fetch(`${this.baseUrl}${url}`, options);

        // 👇 Si el token expiró, intenta refrescar y reintentar
        if (response.status === 401) {
            const newAccess = await this.refreshAccessToken();
            if (newAccess) {
                const retryHeaders = {
                    ...options.headers,
                    Authorization: `Bearer ${newAccess}`,
                };
                response = await fetch(`${this.baseUrl}${url}`, {
                    ...options,
                    headers: retryHeaders,
                });
            }
        }

        // Si aún así no funciona, lanza error
        if (!response.ok) {
            const text = await response.text();
            throw new Error(`Error ${method} ${url}: ${response.status} ${text}`);
        }
        if (file) return await response.blob();
        return await response.json();
    }

    // 👇 Métodos públicos simplificados usando request()
    async get(url: string, headers?: Record<string, any>, file?: boolean) {
        return this.request("GET", url, undefined, headers, file);
    }

    async post(url: string, data: Record<string, any>, headers?: Record<string, any>, file?: boolean) {
        return this.request("POST", url, data, headers, file);
    }

    async put(url: string, id: string, data: Record<string, any>, headers?: Record<string, any>, file?: boolean) {
        return this.request("PUT", url, { id, ...data }, headers, file);
    }

    async delete(url: string, headers?: Record<string, any>) {
        return this.request("DELETE", url, undefined, headers);
    }
}
