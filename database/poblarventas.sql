-- Script con valores de pago más realistas
DO $$
DECLARE
    user_record RECORD;
    product_record RECORD;
    carrito_id INT;
    pago_id INT;
    venta_id INT;
    i INT;
    j INT;
    fecha_venta DATE;
    monto INT;
    cantidad INT;
    payment_methods TEXT[] := ARRAY['visa', 'mastercard', 'amex', 'paypal', 'stripe'];
    payment_status TEXT[] := ARRAY['succeeded', 'completed', 'approved'];
BEGIN
    RAISE NOTICE 'Iniciando creación de 500 ventas...';
    
    FOR i IN 1..500 LOOP
        BEGIN
            -- Seleccionar usuario aleatorio
            SELECT id INTO user_record 
            FROM app_api_user 
            WHERE is_active = true 
            ORDER BY random() 
            LIMIT 1;
            
            -- Crear fecha aleatoria en 2024
            fecha_venta := DATE '2024-01-01' + (floor(random() * 365))::INT;
            
            -- Crear carrito
            INSERT INTO app_api_carrito (usuario_id, total, created_at, updated_at)
            VALUES (user_record.id, 0, fecha_venta, fecha_venta)
            RETURNING id INTO carrito_id;
            
            monto := 0;
            
            -- Agregar productos al carrito (1-4 productos)
            FOR j IN 1..(1 + floor(random() * 4))::INT LOOP
                -- Seleccionar producto aleatorio
                SELECT id, precio INTO product_record
                FROM app_api_producto 
                WHERE stock > 0 
                ORDER BY random() 
                LIMIT 1;
                
                -- Cantidad aleatoria 1-3
                cantidad := 1 + floor(random() * 3)::INT;
                
                -- Insertar detalle
                INSERT INTO app_api_detallecarrito (carrito_id, producto_id, cantidad, created_at, updated_at)
                VALUES (carrito_id, product_record.id, cantidad, fecha_venta, fecha_venta);
                
                -- Sumar al total
                monto := monto + (product_record.precio * cantidad);
                
                -- Actualizar stock
                UPDATE app_api_producto 
                SET stock = stock - cantidad 
                WHERE id = product_record.id;
            END LOOP;
            
            -- Actualizar total del carrito
            UPDATE app_api_carrito 
            SET total = monto 
            WHERE id = carrito_id;
            
            -- Crear pago con valores realistas
            INSERT INTO app_api_pago (
                monto, 
                moneda, 
                estado, 
                carrito_id, 
                payment_method_id, 
                payment_intent, 
                created_at, 
                updated_at
            )
            VALUES (
                monto, 
                'BOB', 
                'aprobado', 
                carrito_id,
                'card_' || substr(md5(random()::text), 1, 16),  -- Ej: card_1A2b3C4d5E6f7G8h
                'pi_' || substr(md5(random()::text), 1, 24),     -- Ej: pi_1A2b3C4d5E6f7G8h9I0j1K2l
                fecha_venta, 
                fecha_venta
            )
            RETURNING id INTO pago_id;
            
            -- Crear venta
            INSERT INTO app_api_venta (carrito_id, pago_id, created_at, updated_at)
            VALUES (carrito_id, pago_id, fecha_venta, fecha_venta);
            
            -- Mostrar progreso
            IF i % 50 = 0 THEN
                RAISE NOTICE 'Ventas creadas: %', i;
            END IF;
            
        EXCEPTION
            WHEN OTHERS THEN
                RAISE NOTICE 'Error en venta %: %', i, SQLERRM;
        END;
    END LOOP;
    
    RAISE NOTICE 'Proceso completado. 500 ventas creadas.';
    
    -- Estadísticas
    SELECT COUNT(*) INTO i FROM app_api_venta WHERE EXTRACT(YEAR FROM created_at) = 2024;
    RAISE NOTICE 'Ventas totales 2024: %', i;
    
END $$;
