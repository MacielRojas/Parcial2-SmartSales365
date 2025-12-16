from app_api.application.services.randomforest_service import RandomForestService
from app_api.application.services.ia_service import IAService

class IAPrediccionUseCase:
    def __init__(self, ia_service: RandomForestService, ):
        self.ia_service = ia_service

    def predict(self, data):
        ''' Genera una predicción a partir de datos X para devolver un Y'''
        try:
            if (data):
                return self.ia_service.predict(**data)
            else:
                return None
        except Exception as e:
            raise Exception(f"No se pudo realizar la predicción: {e}")
        
    def train(self, data):
        try:
            return self.ia_service.train(**data)
        except Exception as e:
            raise Exception(f"No se pudo realizar el entrenamiento: {e}")
        
    def evaluate(self, data):
        try:
            return self.ia_service.evaluate(**data)
        except Exception as e:
            raise Exception(f"No se pudo realizar la evaluación: {e}")

class IARegressor:
    def __init__(self, ia_service: IAService):
        self.ia_service = ia_service

    def execute(self, texto):
        try:
            return self.ia_service.predict(texto)
        except Exception as e:
            raise Exception(f'No se pudo ejecutar el usecase: {e}')