# ejemplos para pedir prediccion de datos a la api

{
    "user_id": 1,
    "productos": [
        {
            "producto_id": 5,
            "cantidad": 2
        }
    ]
}

{
    "user_id": 2,
    "productos": [
        {
            "producto_id": 1,
            "cantidad": 1
        },
        {
            "producto_id": 3,
            "cantidad": 3
        },
        {
            "producto_id": 7,
            "cantidad": 2
        }
    ]
}

# respuestas esperadas 
{
    "success": True,
    "prediccion": {
        "monto_estimado": 2450.50,
        "moneda": "USD",
        "confianza": "alta",
        "user_id": 1,
        "total_productos": 3,
        "total_items": 6
    }
}

# curl 
# Ejemplo 1
'''
curl -X POST http://localhost:8000/api/predict-venta/ \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 1,
    "productos": [
      {"producto_id": 1, "cantidad": 2},
      {"producto_id": 3, "cantidad": 1}
    ]
  }'

# Ejemplo 2  
curl -X POST http://localhost:8000/api/predict-venta/ \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 2,
    "productos": [
      {"producto_id": 5, "cantidad": 3}
    ]
  }'
'''