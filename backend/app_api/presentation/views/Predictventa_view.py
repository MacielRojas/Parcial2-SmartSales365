# views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from app_api.application.usecases.mlmodeltrain import MLModelPredictUseCase

class PredictVentaView(APIView):
    def post(self, request):
        """
        Predice el monto de una venta potencial
        
        Ejemplo de datos a enviar:
        {
            "user_id": 1,
            "productos": [
                {
                    "producto_id": 1,
                    "cantidad": 2
                },
                {
                    "producto_id": 3, 
                    "cantidad": 1
                }
            ]
        }
        """
        try:
            # Validar datos de entrada
            user_id = request.data.get('user_id')
            productos_data = request.data.get('productos', [])
            
            if not user_id:
                return Response({
                    'success': False,
                    'error': 'El campo user_id es requerido'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            if not productos_data or not isinstance(productos_data, list):
                return Response({
                    'success': False,
                    'error': 'El campo productos debe ser una lista no vacía'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Validar cada producto
            for producto in productos_data:
                if 'producto_id' not in producto or 'cantidad' not in producto:
                    return Response({
                        'success': False,
                        'error': 'Cada producto debe tener producto_id y cantidad'
                    }, status=status.HTTP_400_BAD_REQUEST)
                
                if producto['cantidad'] <= 0:
                    return Response({
                        'success': False,
                        'error': 'La cantidad debe ser mayor a 0'
                    }, status=status.HTTP_400_BAD_REQUEST)
            
            # Usar el caso de uso para predecir
            usecase = MLModelPredictUseCase()
            resultado = usecase.predict_single_venta(user_id, productos_data)
            
            if resultado['success']:
                return Response({
                    'success': True,
                    'prediccion': {
                        'monto_estimado': resultado['monto_predicho'],
                        'moneda': 'USD',
                        'confianza': resultado.get('confianza', 'media'),
                        'user_id': user_id,
                        'total_productos': len(productos_data),
                        'total_items': sum(p['cantidad'] for p in productos_data)
                    }
                }, status=status.HTTP_200_OK)
            else:
                return Response({
                    'success': False,
                    'error': resultado['error']
                }, status=status.HTTP_400_BAD_REQUEST)
                
        except Exception as e:
            return Response({
                'success': False,
                'error': f'Error interno del servidor: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)