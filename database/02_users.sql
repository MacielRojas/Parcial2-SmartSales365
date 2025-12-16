-- INSERTAR 50 USUARIOS
DO $$
DECLARE
    i INTEGER;
    user_id INTEGER;
    fecha_base TIMESTAMP;
BEGIN
    FOR i IN 1..50 LOOP
        user_id := 500 + i;
        fecha_base := NOW() - (random() * INTERVAL '365 days');
        
        INSERT INTO app_api_user (
            id, password, last_login, is_superuser, username, 
            first_name, last_name, email, is_staff, is_active,
            date_joined, born_date, gender, created_at, updated_at, deleted_at
        ) VALUES (
            user_id,
            'pbkdf2_sha256$600000$abc123xyz456$hashedpassword1234567890abcdef',
            NULL,
            FALSE,
            'usuario' || user_id,
            'Nombre' || user_id,
            'Apellido' || user_id,
            'usuario' || user_id || '@ejemplo.com',
            FALSE,
            TRUE,
            fecha_base,
            (CURRENT_DATE - (random() * 10950)::INTEGER),
            CASE WHEN random() > 0.5 THEN 'Masculino' ELSE 'Femenino' END,
            fecha_base,
            fecha_base,
            NULL
        );

        -- Asignar rol de cliente
        INSERT INTO app_api_userrol (id, user_id, rol_id, created_at, updated_at, deleted_at)
        VALUES (500 + i, user_id, 501, NOW(), NOW(), NULL);
    END LOOP;
END $$;
