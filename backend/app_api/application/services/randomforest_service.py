from abc import ABC, abstractmethod

class RandomForestService(ABC):
    @abstractmethod
    def train(self, X, y, test_size=0.2, random_state=42):
        '''
        Entrenar el modelo
        X: Datos de entrenamiento
        y: Etiquetas de entrenamiento
        test_size: Tamaño de la muestra de prueba
        random_state: Semilla para la aleatoriedad
        example:
        X = [[1, 2], [3, 4], [5, 6], [7, 8], [9, 10]]
        y = [0, 1, 0, 1, 0]
        test_size = 0.2
        random_state = 42 
        '''
        pass

    @abstractmethod
    def predict(self, X):
        '''
        Realizar predicciones
        X: Datos de prueba
        example:
        X = [[1, 2], [3, 4], [5, 6], [7, 8], [9, 10]]
        '''
        pass

    @abstractmethod
    def evaluate(self, X, y)-> float:
        '''
        Evaluar el rendimiento del modelo
        X: Datos de prueba
        y: Etiquetas de prueba
        example:
        X = [[1, 2], [3, 4], [5, 6], [7, 8], [9, 10]]
        y = [0, 1, 0, 1, 0]
        '''
        pass