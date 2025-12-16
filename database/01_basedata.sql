-- 1. LIMPIAR TODO PRIMERO
TRUNCATE TABLE 
    app_api_factura, 
    app_api_venta, 
    app_api_pago, 
    app_api_detallecarrito, 
    app_api_carrito,
    app_api_garantia,
    app_api_mantenimiento,
    app_api_galeria,
    app_api_descuento,
    app_api_userrol,
    app_api_rolpermiso,
    app_api_producto,
    app_api_categoria,
    app_api_rol,
    app_api_permiso,
    app_api_user
RESTART IDENTITY CASCADE;

-- 2. INSERTAR CATEGORÍAS
INSERT INTO app_api_categoria (id, nombre, descripcion, created_at, updated_at, deleted_at) VALUES
(501, 'Smartphones', 'Teléfonos inteligentes y accesorios', NOW(), NOW(), NULL),
(502, 'Laptops', 'Computadoras portátiles y notebooks', NOW(), NOW(), NULL),
(503, 'Auriculares', 'Audífonos y headphones', NOW(), NOW(), NULL),
(504, 'Monitores', 'Monitores y pantallas', NOW(), NOW(), NULL),
(505, 'Tablets', 'Tablets y iPads', NOW(), NOW(), NULL),
(506, 'Smartwatches', 'Relojes inteligentes', NOW(), NOW(), NULL),
(507, 'Consolas', 'Consolas de videojuegos', NOW(), NOW(), NULL),
(508, 'Cámaras', 'Cámaras fotográficas', NOW(), NOW(), NULL),
(509, 'Audio', 'Equipos de audio', NOW(), NOW(), NULL),
(510, 'Accesorios', 'Accesorios tecnológicos', NOW(), NOW(), NULL);

-- 3. INSERTAR PERMISOS
INSERT INTO app_api_permiso (id, nombre, descripcion, created_at, updated_at, deleted_at) VALUES
(501, 'ver_productos', 'Permiso para ver productos', NOW(), NOW(), NULL),
(502, 'comprar_productos', 'Permiso para comprar productos', NOW(), NOW(), NULL),
(503, 'gestionar_inventario', 'Permiso para gestionar inventario', NOW(), NOW(), NULL);

-- 4. INSERTAR ROLES
INSERT INTO app_api_rol (id, nombre, descripcion, created_at, updated_at, deleted_at) VALUES
(501, 'Cliente', 'Usuario cliente del sistema', NOW(), NOW(), NULL),
(502, 'Administrador', 'Administrador del sistema', NOW(), NOW(), NULL);

-- 5. INSERTAR ROL_PERMISOS
INSERT INTO app_api_rolpermiso (id, rol_id, permiso_id, created_at, updated_at, deleted_at) VALUES
(501, 501, 501, NOW(), NOW(), NULL),
(502, 501, 502, NOW(), NOW(), NULL),
(503, 502, 501, NOW(), NOW(), NULL),
(504, 502, 502, NOW(), NOW(), NULL),
(505, 502, 503, NOW(), NOW(), NULL);
