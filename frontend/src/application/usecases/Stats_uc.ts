import type { Gateway } from "../service/gateway";

export class StatsUseCase {
    api: Gateway;
    constructor(api: Gateway) {
        this.api = api
    }

    async get_stats(): Promise<any> {
        try {
            const ventas = await this.api.post(`reportes/sql/`, {
                "stringsql":"select sum(p.monto) from app_api_venta as v, app_api_pago as p where v.pago_id = p.id",
                "params": null,
            });
            const usuarios = await this.api.post(`reportes/sql/`, {
                "stringsql":"select count(id) from app_api_user",
                "params": null,
            });
            const productos = await this.api.post(`reportes/sql/`, {
                "stringsql":"select count(id) from app_api_producto",
                "params": null,
            });
            if (ventas.status < 200 || ventas.status >= 300){
                throw Error(`Error obteniendo ventas: ${ventas.status}`);
            }
            if (usuarios.status < 200 || usuarios.status >= 300){
                throw Error(`Error obteniendo usuarios: ${usuarios.status}`);
            }
            if (productos.status < 200 || productos.status >= 300){
                throw Error(`Error obteniendo productos: ${productos.status}`);
            }
            const ventasmesnro = await this.api.post(`reportes/sql/`, {
                "stringsql":"select sum(p.monto) from app_api_venta as v, app_api_pago as p where extract(month from v.created_at) = extract(month from now()) and v.pago_id = p.id",
                "params": null,
            });
            const ventasnroo = ventas.obj as {sum: number}[];
            const usuarionroo = usuarios.obj as {count: number}[];
            const productonroo = productos.obj as {count: number}[];
            // obtener los 10 productos mas vendidos
            let productosreporte = await this.api.post(`reportes/sql/`, {
                "stringsql": "select p.nombre, count(p.id) from app_api_producto as p, app_api_detallecarrito as d, app_api_carrito as c, app_api_venta as v where p.id = d.producto_id and c.id = d.carrito_id and c.id = v.carrito_id group by p.id order by count(p.id) desc limit 10",
                "params": null
            });

            let productospop = productosreporte.obj as {nombre: string, count: number}[];
            let pop = productospop.map((e)=>{
                return {
                    producto: e.nombre,
                    ventas: e.count
                }
            });
            // reporte para obtener ventas por categoria 
            // y devuelve 10 nombres de categoria y cantidad de ventas
            let ventaporcategoria = await this.api.post(`reportes/sql/`, {
                "stringsql":"select c.nombre, count(c.id) from app_api_categoria as c, app_api_producto as p, app_api_detallecarrito as d, app_api_carrito as cr, app_api_venta as v where c.id = p.categoria_id and p.id = d.producto_id and d.carrito_id = cr.id and cr.id = v.carrito_id group by c.id order by count(c.id) desc limit 10", 
                "params": null
            });
            let ventasporcategoria = ventaporcategoria.obj as {nombre: string, count: number}[];
            let catpop = ventasporcategoria.map((e)=>{
                return {
                    categoria: e.nombre,
                    ventas: e.count
                }
            });

            let totalventaspormes = await this.api.post(`reportes/sql/`, {
                "stringsql":"select extract(month from v.created_at) as mes, sum(p.monto) from app_api_venta as v, app_api_pago as p where v.pago_id = p.id group by mes order by mes",
                "params": null
            });
            let meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
            let totalventas = totalventaspormes.obj as {mes: number, sum: number}[];
            let ventaspor = totalventas.map((e)=>{
                return {
                    mes: meses[e.mes-1],
                    ventas: e.sum/100
                }
            });

            return {
                total_ventas: ventasnroo[0].sum/100,
                total_usuarios: usuarionroo[0].count,
                total_productos: productonroo[0].count,
                ventas_mes_actual: ventasmesnro.obj[0].sum/100,
                crecimiento_ventas: 0,
                productos_populares: pop,
                ventas_por_categoria: catpop,
                ventas_por_mes: ventaspor,
            };
        } catch (error) {
            throw Error(`Error obteniendo stats: ${error}`);
        }
    }

    async get_predictions(): Promise<any> {
        try {
            const response  = await this.api.get('especiales/estadisticas/predictproducto/');

            if (response == null){
                throw Error(`Error obteniendo predictions`);
            }
            // lista = ;
            return response.predictions || [];
        } catch (error) {
            throw Error(`Error obteniendo predictions: ${error}`);
        }
    }
}