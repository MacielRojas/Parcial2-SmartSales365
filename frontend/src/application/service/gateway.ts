export interface Gateway {
    get(url: string, headers?: Record<string, any>, file?: boolean): Promise<any>;
    post(url: string, data: Record<string, any>, headers?: Record<string, any>, file?: boolean): Promise<any>;
    put(url: string, id: string, data: Record<string, any>, headers?: Record<string, any>, file?: boolean): Promise<any>;
    delete(url: string, headers?: Record<string, any>): Promise<any>;
}