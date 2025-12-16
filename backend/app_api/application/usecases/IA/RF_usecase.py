from app_api.application.repositories.MLmodel_repository import MLmodelRepository
from app_api.application.services.randomforest_service import RandomForestService
from app_api.domain.entities.MLmodel_entity import MLmodelEntity

class RFUseCase:
    def __init__(self, repository: MLmodelRepository, rf_service : RandomForestService,):
        self.repository = repository
        self.rf_service = rf_service

    def train(self, X, y,):
        '''
        Realizar predicciones
        X: Datos de prueba
        y: Etiquetas de prueba
        data: Datos
        example:
        X = [[1, 2], [3, 4], [5, 6], [7, 8], [9, 10]]
        y = [0, 1, 0, 1, 0]
        '''
        try:
            return self.rf_service.train(X, y,)
        except Exception as e:
            raise Exception(f"No se pudo entrenar el modelo: {e}")
    
    def predict(self, X):
        '''
        Realizar predicciones
        X: Datos de prueba
        example:
        X = [[1, 2], [3, 4], [5, 6], [7, 8], [9, 10]]
        '''
        try:
            return self.rf_service.predict(X)
        except Exception as e:
            raise Exception(f"No se pudo realizar las predicciones: {e}")