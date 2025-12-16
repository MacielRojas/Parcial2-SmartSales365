-- Script para poblar solo la tabla de ventas con 500 registros
-- Primero limpiamos las tablas relacionadas con ventas

TRUNCATE TABLE 
    app_api_factura,
    app_api_venta,
    app_api_pago,
    app_api_detallecarrito,
    app_api_carrito
RESTART IDENTITY;

-- 1. CREAR CARRITOS (500 carritos)
DO $$
DECLARE
    i INTEGER;
    carrito_id INTEGER;
    usuario_id INTEGER;
    total_carrito INTEGER;
    num_productos INTEGER;
    j INTEGER;
    detalle_id INTEGER := 0;
    fecha_compra TIMESTAMP;
BEGIN
    FOR i IN 1..500 LOOP
        carrito_id := i;
        
        -- Seleccionar usuario existente (si no hay, usar uno por defecto)
        SELECT id INTO usuario_id 
        FROM app_api_user 
        WHERE deleted_at IS NULL 
        ORDER BY random() 
        LIMIT 1;
        
        -- Si no hay usuarios, crear uno temporal
        IF usuario_id IS NULL THEN
            INSERT INTO app_api_user (
                username, email, password, first_name, last_name, 
                is_active, is_staff, is_superuser, date_joined
            ) VALUES (
                'usuario_temp', 'temp@ejemplo.com', 'temp123', 
                'Usuario', 'Temporal', true, false, false, NOW()
            ) RETURNING id INTO usuario_id;
        END IF;
        
        -- Fecha aleatoria en los últimos 12 meses
        fecha_compra := NOW() - (random() * INTERVAL '365 days');
        
        -- INSERTAR CARRITO (inicialmente con total 0)
        INSERT INTO app_api_carrito (
            id, usuario_id, total, descuento, created_at, updated_at, deleted_at
        ) VALUES (
            carrito_id, usuario_id, 0, NULL, fecha_compra, fecha_compra, NULL
        );

        -- INSERTAR DETALLES DEL CARRITO (1-4 productos por carrito)
        total_carrito := 0;
        num_productos := 1 + (random() * 3)::INTEGER;
        
        FOR j IN 1..num_productos LOOP
            detalle_id := detalle_id + 1;
            
            DECLARE
                producto_id INTEGER;
                precio_producto INTEGER;
                cantidad INTEGER;
                subtotal INTEGER;
            BEGIN
                -- Seleccionar producto existente
                SELECT id, precio INTO producto_id, precio_producto 
                FROM app_api_producto 
                WHERE deleted_at IS NULL 
                AND stock > 0
                ORDER BY random() 
                LIMIT 1;
                
                -- Si no hay productos, usar uno por defecto
                IF producto_id IS NULL THEN
                    INSERT INTO app_api_producto (
                        nombre, precio, stock, codigo, marca, categoria_id
                    ) VALUES (
                        'Producto Temporal', 1000, 100, 'TEMP001', 'Marca Temp', 1
                    ) RETURNING id, precio INTO producto_id, precio_producto;
                END IF;
                
                -- Cantidad entre 1 y 3
                cantidad := 1 + (random() * 2)::INTEGER;
                subtotal := precio_producto * cantidad;
                total_carrito := total_carrito + subtotal;
                
                -- INSERTAR DETALLE
                INSERT INTO app_api_detallecarrito (
                    carrito_id, producto_id, cantidad, descuento, 
                    created_at, updated_at, deleted_at
                ) VALUES (
                    carrito_id, producto_id, cantidad, NULL,
                    fecha_compra, fecha_compra, NULL
                );
            END;
        END LOOP;

        -- ACTUALIZAR TOTAL DEL CARRITO
        UPDATE app_api_carrito 
        SET total = total_carrito, updated_at = fecha_compra
        WHERE id = carrito_id;
    END LOOP;
END $$;

-- 2. CREAR PAGOS (500 pagos)
DO $$
DECLARE
    i INTEGER;
    carrito_id INTEGER;
    pago_id INTEGER;
    total_carrito INTEGER;
    fecha_compra TIMESTAMP;
BEGIN
    FOR i IN 1..500 LOOP
        carrito_id := i;
        pago_id := i;
        
        -- Obtener datos del carrito
        SELECT total, created_at 
        INTO total_carrito, fecha_compra
        FROM app_api_carrito 
        WHERE id = carrito_id;

        -- INSERTAR PAGO (90% aprobados, 5% pendientes, 5% rechazados)
        INSERT INTO app_api_pago (
            monto, moneda, estado, carrito_id, payment_method_id, payment_intent,
            created_at, updated_at, deleted_at
        ) VALUES (
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
    END LOOP;
END $$;

-- 3. CREAR VENTAS (500 ventas)
DO $$
DECLARE
    i INTEGER;
    carrito_id INTEGER;
    pago_id INTEGER;
    venta_id INTEGER;
    fecha_compra TIMESTAMP;
    estado_pago TEXT;
BEGIN
    FOR i IN 1..500 LOOP
        carrito_id := i;
        pago_id := i;
        venta_id := i;
        
        -- Obtener fecha del carrito y estado del pago
        SELECT c.created_at, p.estado 
        INTO fecha_compra, estado_pago
        FROM app_api_carrito c
        JOIN app_api_pago p ON p.carrito_id = c.id
        WHERE c.id = carrito_id AND p.id = pago_id;

        -- INSERTAR VENTA (solo crear venta sin importar estado del pago)
        INSERT INTO app_api_venta (
            carrito_id, pago_id, created_at, updated_at, deleted_at
        ) VALUES (
            carrito_id, pago_id, 
            fecha_compra + INTERVAL '10 minutes',
            fecha_compra + INTERVAL '10 minutes',
            NULL
        );
    END LOOP;
END $$;

-- 4. CREAR FACTURAS (solo para ventas con pago aprobado)
DO $$
DECLARE
    i INTEGER;
    venta_id INTEGER;
    fecha_compra TIMESTAMP;
    estado_pago TEXT;
BEGIN
    FOR i IN 1..500 LOOP
        venta_id := i;
        
        -- Verificar si el pago fue aprobado
        SELECT p.estado, v.created_at 
        INTO estado_pago, fecha_compra
        FROM app_api_venta v
        JOIN app_api_pago p ON p.id = v.pago_id
        WHERE v.id = venta_id;

        -- INSERTAR FACTURA solo si el pago fue aprobado
        IF estado_pago = 'aprobado' THEN
            INSERT INTO app_api_factura (
                venta_id, fecha_expendida, nit, created_at, updated_at, deleted_at
            ) VALUES (
                venta_id, 
                fecha_compra + INTERVAL '1 day',
                CASE 
                    WHEN random() > 0.3 THEN '123456789'
                    ELSE NULL
                END,
                fecha_compra + INTERVAL '1 day',
                fecha_compra + INTERVAL '1 day',
                NULL
            );
        END IF;
    END LOOP;
END $$;

-- 5. ACTUALIZAR STOCK DE PRODUCTOS
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
    'Carritos: ' || COUNT(*)::TEXT as carritos,
    'Detalles: ' || COUNT(*)::TEXT as detalles,
    'Pagos: ' || COUNT(*)::TEXT as pagos,
    'Ventas: ' || COUNT(*)::TEXT as ventas,
    'Facturas: ' || COUNT(*)::TEXT as facturas
FROM app_api_carrito c,
    (SELECT COUNT(*) FROM app_api_detallecarrito) as d,
    (SELECT COUNT(*) FROM app_api_pago) as p,
    (SELECT COUNT(*) FROM app_api_venta) as v,
    (SELECT COUNT(*) FROM app_api_factura) as f;

-- RESUMEN DE VENTAS POR MES (para verificar datos para gráficos)
SELECT 
    TO_CHAR(v.created_at, 'YYYY-MM') as mes,
    COUNT(*) as total_ventas,
    SUM(c.total) as ingresos_totales,
    ROUND(AVG(c.total)::NUMERIC, 2) as promedio_venta
FROM app_api_venta v
JOIN app_api_carrito c ON v.carrito_id = c.id
GROUP BY TO_CHAR(v.created_at, 'YYYY-MM')
ORDER BY mes;
