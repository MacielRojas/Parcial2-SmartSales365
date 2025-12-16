-- INSERTAR 500 CARRITOS Y SUS DETALLES
DO $$
DECLARE
    i INTEGER;
    carrito_id INTEGER;
    usuario_id INTEGER;
    total_carrito INTEGER;
    num_productos INTEGER;
    j INTEGER;
    detalle_id INTEGER := 500;
    fecha_compra TIMESTAMP;
BEGIN
    FOR i IN 1..500 LOOP
        carrito_id := 500 + i;
        
        -- Seleccionar usuario aleatorio (entre 501 y 550)
        usuario_id := 501 + (random() * 49)::INTEGER;
        
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
                -- Seleccionar producto aleatorio (entre 501 y 600)
                producto_id := 501 + (random() * 99)::INTEGER;
                
                -- Obtener precio del producto
                SELECT precio INTO precio_producto 
                FROM app_api_producto 
                WHERE id = producto_id;
                
                -- Cantidad entre 1 y 3
                cantidad := 1 + (random() * 2)::INTEGER;
                subtotal := precio_producto * cantidad;
                total_carrito := total_carrito + subtotal;
                
                -- INSERTAR DETALLE
                INSERT INTO app_api_detallecarrito (
                    id, carrito_id, producto_id, cantidad, descuento, 
                    created_at, updated_at, deleted_at
                ) VALUES (
                    detalle_id, carrito_id, producto_id, cantidad, NULL,
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
