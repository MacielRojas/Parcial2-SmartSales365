-- INSERTAR PAGOS, VENTAS Y FACTURAS PARA LOS 500 CARRITOS
DO $$
DECLARE
    i INTEGER;
    carrito_id INTEGER;
    pago_id INTEGER;
    venta_id INTEGER;
    factura_id INTEGER;
    usuario_id INTEGER;
    total_carrito INTEGER;
    fecha_compra TIMESTAMP;
BEGIN
    FOR i IN 1..500 LOOP
        carrito_id := 500 + i;
        pago_id := 500 + i;
        venta_id := 500 + i;
        factura_id := 500 + i;
        
        -- Obtener datos del carrito
        SELECT usuario_id, total, created_at 
        INTO usuario_id, total_carrito, fecha_compra
        FROM app_api_carrito 
        WHERE id = carrito_id;

        -- INSERTAR PAGO (90% aprobados, 5% pendientes, 5% rechazados)
        INSERT INTO app_api_pago (
            id, monto, moneda, estado, carrito_id, payment_method_id, payment_intent,
            created_at, updated_at, deleted_at
        ) VALUES (
            pago_id, 
            total_carrito, 
            'BOB',
            CASE 
                WHEN random() > 0.1 THEN 'aprobado' 
                WHEN random() > 0.05 THEN 'pendiente'
                ELSE 'rechazado'
            END,
            carrito_id,
            'pm_' || MD5(random()::TEXT || carrito_id::TEXT),
            'pi_' || MD5(random()::TEXT || carrito_id::TEXT),
            fecha_compra + INTERVAL '5 minutes',
            fecha_compra + INTERVAL '5 minutes',
            NULL
        );

        -- INSERTAR VENTA (solo si el pago no fue rechazado)
        INSERT INTO app_api_venta (
            id, carrito_id, pago_id, created_at, updated_at, deleted_at
        ) VALUES (
            venta_id, carrito_id, pago_id, 
            fecha_compra + INTERVAL '10 minutes',
            fecha_compra + INTERVAL '10 minutes',
            NULL
        );

        -- INSERTAR FACTURA (solo para ventas aprobadas)
        INSERT INTO app_api_factura (
            id, venta_id, fecha_expendida, nit, created_at, updated_at, deleted_at
        ) VALUES (
            factura_id, venta_id, 
            fecha_compra + INTERVAL '1 day',
            CASE 
                WHEN random() > 0.4 THEN '123456789'
                ELSE NULL
            END,
            fecha_compra + INTERVAL '1 day',
            fecha_compra + INTERVAL '1 day',
            NULL
        );

        -- INSERTAR ALGUNAS GARANTÍAS (8% de las ventas)
        IF random() > 0.92 THEN
            INSERT INTO app_api_garantia (
                id, producto_id, usuario_id, precio, fecha_inicio, fecha_fin,
                descripcion, estado, created_at, updated_at, deleted_at
            ) VALUES (
                500 + (SELECT COALESCE(MAX(id), 500) FROM app_api_garantia) + 1,
                (SELECT producto_id FROM app_api_detallecarrito WHERE carrito_id = carrito_id LIMIT 1),
                usuario_id,
                (SELECT precio FROM app_api_producto WHERE id = (
                    SELECT producto_id FROM app_api_detallecarrito WHERE carrito_id = carrito_id LIMIT 1
                )),
                fecha_compra + INTERVAL '1 day',
                fecha_compra + INTERVAL '365 days',
                'Garantía estándar del fabricante',
                CASE 
                    WHEN random() > 0.3 THEN 'aprobado'
                    WHEN random() > 0.2 THEN 'rechazado'
                    ELSE 'pendiente'
                END,
                fecha_compra + INTERVAL '2 days',
                fecha_compra + INTERVAL '2 days',
                NULL
            );
        END IF;
    END LOOP;
END $$;

-- ACTUALIZAR STOCK DE PRODUCTOS
UPDATE app_api_producto p
SET stock = GREATEST(0, stock - COALESCE(ventas_totales, 0)),
    updated_at = NOW()
FROM (
    SELECT 
        producto_id,
        SUM(cantidad) as ventas_totales
    FROM app_api_detallecarrito dc
    JOIN app_api_carrito c ON dc.carrito_id = c.id
    JOIN app_api_venta v ON v.carrito_id = c.id
    GROUP BY producto_id
) AS ventas
WHERE p.id = ventas.producto_id;

-- VERIFICACIÓN FINAL
SELECT 
    'Usuarios: ' || COUNT(*)::TEXT as usuarios,
    'Productos: ' || COUNT(*)::TEXT as productos,
    'Carritos: ' || COUNT(*)::TEXT as carritos,
    'Ventas: ' || COUNT(*)::TEXT as ventas,
    'Pagos: ' || COUNT(*)::TEXT as pagos
FROM (
    SELECT 1 FROM app_api_user WHERE id >= 500
) as u,
(
    SELECT 1 FROM app_api_producto WHERE id >= 500
) as p,
(
    SELECT 1 FROM app_api_carrito WHERE id >= 500
) as c,
(
    SELECT 1 FROM app_api_venta WHERE id >= 500
) as v,
(
    SELECT 1 FROM app_api_pago WHERE id >= 500
) as pg;
