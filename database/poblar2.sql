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
    current_carrito_id INTEGER;
    current_usuario_id INTEGER;
    total_carrito INTEGER;
    num_productos INTEGER;
    j INTEGER;
    detalle_id INTEGER := 0;
    fecha_compra TIMESTAMP;
BEGIN
    FOR i IN 1..500 LOOP
        current_carrito_id := i;
        
        -- Seleccionar usuario existente
        SELECT id INTO current_usuario_id 
        FROM app_api_user 
        WHERE deleted_at IS NULL 
        ORDER BY random() 
        LIMIT 1;
        
        -- Si no hay usuarios, crear uno temporal
        IF current_usuario_id IS NULL THEN
            INSERT INTO app_api_user (
                username, email, password, first_name, last_name, 
                is_active, is_staff, is_superuser, date_joined
            ) VALUES (
                'usuario_temp', 'temp@ejemplo.com', 'temp123', 
                'Usuario', 'Temporal', true, false, false, NOW()
            ) RETURNING id INTO current_usuario_id;
        END IF;
        
        -- Fecha aleatoria en los últimos 12 meses
        fecha_compra := NOW() - (random() * INTERVAL '365 days');
        
        -- INSERTAR CARRITO (inicialmente con total 0)
        INSERT INTO app_api_carrito (
            usuario_id, total, descuento, created_at, updated_at, deleted_at
        ) VALUES (
            current_usuario_id, 0, NULL, fecha_compra, fecha_compra, NULL
        );

        -- Obtener el ID del carrito recién insertado
        SELECT currval(pg_get_serial_sequence('app_api_carrito', 'id')) INTO current_carrito_id;

        -- INSERTAR DETALLES DEL CARRITO (1-4 productos por carrito)
        total_carrito := 0;
        num_productos := 1 + (random() * 3)::INTEGER;
        
        FOR j IN 1..num_productos LOOP
            detalle_id := detalle_id + 1;
            
            DECLARE
                current_producto_id INTEGER;
                precio_producto INTEGER;
                cantidad INTEGER;
                subtotal INTEGER;
            BEGIN
                -- Seleccionar producto existente
                SELECT id, precio INTO current_producto_id, precio_producto 
                FROM app_api_producto 
                WHERE deleted_at IS NULL 
                AND stock > 0
                ORDER BY random() 
                LIMIT 1;
                
                -- Si no hay productos, usar uno por defecto
                IF current_producto_id IS NULL THEN
                    INSERT INTO app_api_producto (
                        nombre, precio, stock, codigo, marca, categoria_id
                    ) VALUES (
                        'Producto Temporal', 1000, 100, 'TEMP001', 'Marca Temp', 1
                    ) RETURNING id, precio INTO current_producto_id, precio_producto;
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
                    current_carrito_id, current_producto_id, cantidad, NULL,
                    fecha_compra, fecha_compra, NULL
                );
            END;
        END LOOP;

        -- ACTUALIZAR TOTAL DEL CARRITO
        UPDATE app_api_carrito 
        SET total = total_carrito, updated_at = fecha_compra
        WHERE id = current_carrito_id;
    END LOOP;
END $$;

-- 2. CREAR PAGOS (500 pagos)
DO $$
DECLARE
    i INTEGER;
    current_carrito_id INTEGER;
    current_total_carrito INTEGER;
    current_fecha_compra TIMESTAMP;
BEGIN
    -- Recorrer todos los carritos creados
    FOR current_carrito_id IN SELECT id FROM app_api_carrito ORDER BY id
    LOOP
        -- Obtener datos del carrito
        SELECT total, created_at 
        INTO current_total_carrito, current_fecha_compra
        FROM app_api_carrito 
        WHERE id = current_carrito_id;

        -- INSERTAR PAGO (90% aprobados, 5% pendientes, 5% rechazados)
        INSERT INTO app_api_pago (
            monto, moneda, estado, carrito_id, payment_method_id, payment_intent,
            created_at, updated_at, deleted_at
        ) VALUES (
            current_total_carrito, 
            'BOB',
            CASE 
                WHEN random() > 0.1 THEN 'aprobado' 
                WHEN random() > 0.05 THEN 'pendiente'
                ELSE 'rechazado'
            END,
            current_carrito_id,
            'pm_' || MD5(random()::TEXT || current_carrito_id::TEXT),
            'pi_' || MD5(random()::TEXT || current_carrito_id::TEXT),
            current_fecha_compra + INTERVAL '5 minutes',
            current_fecha_compra + INTERVAL '5 minutes',
            NULL
        );
    END LOOP;
END $$;

-- 3. CREAR VENTAS (500 ventas)
DO $$
DECLARE
    current_carrito_id INTEGER;
    current_pago_id INTEGER;
    current_fecha_compra TIMESTAMP;
    current_estado_pago TEXT;
BEGIN
    -- Recorrer todos los pagos creados
    FOR current_carrito_id, current_pago_id IN 
        SELECT c.id, p.id 
        FROM app_api_carrito c 
        JOIN app_api_pago p ON p.carrito_id = c.id 
        ORDER BY c.id
    LOOP
        -- Obtener fecha del carrito y estado del pago
        SELECT c.created_at, p.estado 
        INTO current_fecha_compra, current_estado_pago
        FROM app_api_carrito c
        JOIN app_api_pago p ON p.id = current_pago_id
        WHERE c.id = current_carrito_id;

        -- INSERTAR VENTA
        INSERT INTO app_api_venta (
            carrito_id, pago_id, created_at, updated_at, deleted_at
        ) VALUES (
            current_carrito_id, current_pago_id, 
            current_fecha_compra + INTERVAL '10 minutes',
            current_fecha_compra + INTERVAL '10 minutes',
            NULL
        );
    END LOOP;
END $$;

-- 4. CREAR FACTURAS (solo para ventas con pago aprobado)
DO $$
DECLARE
    current_venta_id INTEGER;
    current_fecha_compra TIMESTAMP;
    current_estado_pago TEXT;
BEGIN
    -- Recorrer todas las ventas
    FOR current_venta_id IN SELECT id FROM app_api_venta ORDER BY id
    LOOP
        -- Verificar si el pago fue aprobado
        SELECT p.estado, v.created_at 
        INTO current_estado_pago, current_fecha_compra
        FROM app_api_venta v
        JOIN app_api_pago p ON p.id = v.pago_id
        WHERE v.id = current_venta_id;

        -- INSERTAR FACTURA solo si el pago fue aprobado
        IF current_estado_pago = 'aprobado' THEN
            INSERT INTO app_api_factura (
                venta_id, fecha_expendida, nit, created_at, updated_at, deleted_at
            ) VALUES (
                current_venta_id, 
                current_fecha_compra + INTERVAL '1 day',
                CASE 
                    WHEN random() > 0.3 THEN '123456789'
                    ELSE NULL
                END,
                current_fecha_compra + INTERVAL '1 day',
                current_fecha_compra + INTERVAL '1 day',
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
