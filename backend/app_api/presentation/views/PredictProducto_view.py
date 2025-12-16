# views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from app_api.application.usecases.mlmodelpredictproducto_usecase import (
    MLModelPredictProductoUseCase)

class ProductoPredictView(APIView):
    """
    API para predicciones de ventas por producto
    """
    
    def get(self, request):
        """
        Obtiene predicciones de ventas para todos los productos o productos específicos
        Ejemplo: /api/predict-productos/?productos=1,2,3
        """
        try:
            producto_ids_param = request.GET.get('productos', '')
            
            if producto_ids_param:
                producto_ids = [int(id) for id in producto_ids_param.split(',')]
            else:
                producto_ids = None
            
            usecase = MLModelPredictProductoUseCase()
            resultado = usecase.predict_ventas_productos(producto_ids)
            
            if resultado['success']:
                return Response({
                    'success': True,
                    'predictions': resultado['predictions'],
                    'total_productos': resultado['total_productos']
                })
            else:
                return Response({
                    'success': False,
                    'error': resultado['error']
                }, status=status.HTTP_400_BAD_REQUEST)
                
        except Exception as e:
            return Response({
                'success': False,
                'error': f'Error interno: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def post(self, request):
        """
        Entrena el modelo de predicción por productos
        """
        try:
            usecase = MLModelPredictProductoUseCase()
            resultado = usecase.train_producto_model()
            
            if resultado['success']:
                return Response({
                    'success': True,
                    'score': resultado['score'],
                    'productos_entrenados': resultado['productos_entrenados'],
                    'model_name': resultado['model_name']
                })
            else:
                return Response({
                    'success': False,
                    'error': resultado['error']
                }, status=status.HTTP_400_BAD_REQUEST)
                
        except Exception as e:
            return Response({
                'success': False,
                'error': f'Error interno: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Agregar a urls.py
# path('api/predict-productos/', ProductoPredictView.as_view(), name='predict-productos'),