from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from app_api.application.usecases.reports.TextReport import TextReportUseCase
from app_api.infraestructure.services.IA.GoogleAI_service import GoogleIAService

class NLPView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        ''' Vista para NLP para el carrito '''
        if not request.data:
            return Response({'error': 'No se recibieron datos'}, status=status.HTTP_400_BAD_REQUEST)

class NLPReportesView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        ''' Vista para NLP para reportes '''
        try:
            if not request.data:
                return Response({'error': 'No se recibieron datos'}, status=status.HTTP_400_BAD_REQUEST)
            data = request.data
            if not data.get('consulta'):
                return Response({'error': 'No se recibieron datos'}, status=status.HTTP_400_BAD_REQUEST)

            textreportuc = TextReportUseCase(
                ia_service=GoogleIAService(),
            )
            response = textreportuc.execute(data.get('consulta'))
            return Response({"consulta": response}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': f"No se pudo generar el reporte: {e}"}, status=status.HTTP_400_BAD_REQUEST)
        
