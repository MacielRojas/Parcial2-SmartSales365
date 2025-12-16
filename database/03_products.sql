-- INSERTAR 100 PRODUCTOS
DO $$
DECLARE
    i INTEGER;
    product_id INTEGER;
    categoria_id INTEGER;
    precios INTEGER[] := ARRAY[500, 800, 1200, 1500, 2000, 2500, 3000, 3500, 4000, 5000, 6000, 8000, 10000, 12000, 15000];
    marcas TEXT[] := ARRAY['Samsung', 'Apple', 'Xiaomi', 'Huawei', 'LG', 'Sony', 'Dell', 'HP', 'Lenovo', 'Asus', 'Acer', 'JBL', 'Bose', 'Logitech'];
    nombres TEXT[] := ARRAY['Pro', 'Max', 'Plus', 'Lite', 'Ultra', 'Premium', 'Standard', 'Deluxe', 'Gaming', 'Office', 'Home', 'Travel'];
    fecha_base TIMESTAMP;
BEGIN
    FOR i IN 1..100 LOOP
        product_id := 500 + i;
        categoria_id := 501 + (random() * 9)::INTEGER;
        fecha_base := NOW() - (random() * INTERVAL '365 days');
        
        INSERT INTO app_api_producto (
            id, nombre, precio, stock, codigo, marca, categoria_id, 
            created_at, updated_at, deleted_at
        ) VALUES (
            product_id,
            marcas[1 + (random() * 13)::INTEGER] || ' ' || 
            CASE 
                WHEN categoria_id = 501 THEN 'Galaxy S' || (20 + (random() * 5)::INTEGER)
                WHEN categoria_id = 502 THEN 'Laptop ' || nombres[1 + (random() * 11)::INTEGER]
                WHEN categoria_id = 503 THEN 'Headphones ' || nombres[1 + (random() * 11)::INTEGER]
                WHEN categoria_id = 504 THEN 'Monitor ' || (24 + (random() * 10)::INTEGER) || '″'
                ELSE 'Product ' || product_id
            END,
            precios[1 + (random() * 14)::INTEGER],
            (random() * 200)::INTEGER + 10,
            'PROD' || LPAD(product_id::TEXT, 5, '0'),
            marcas[1 + (random() * 13)::INTEGER],
            categoria_id,
            fecha_base,
            fecha_base,
            NULL
        );
    END LOOP;
END $$;

-- INSERTAR ALGUNOS DESCUENTOS
INSERT INTO app_api_descuento (id, tipo, producto_id, valor, fecha_inicio, fecha_fin, created_at, updated_at, deleted_at)
SELECT 
    500 + row_number() OVER (),
    CASE WHEN random() > 0.7 THEN 'fijo' ELSE 'porcentaje' END,
    id,
    CASE 
        WHEN random() > 0.7 THEN (random() * 500)::INTEGER + 50
        ELSE (random() * 30)::INTEGER + 5
    END,
    NOW() - INTERVAL '5 days',
    NOW() + INTERVAL '30 days',
    NOW(),
    NOW(),
    NULL
FROM app_api_producto 
WHERE random() > 0.7
LIMIT 20;

-- INSERTAR GALERÍAS
INSERT INTO app_api_galeria (id, producto_id, imagen, created_at, updated_at, deleted_at)
SELECT 
    500 + row_number() OVER (),
    id,
    'https://ejemplo.com/imagenes/producto-' || id || '.jpg',
    NOW(),
    NOW(),
    NULL
FROM app_api_producto 
WHERE random() > 0.2;
