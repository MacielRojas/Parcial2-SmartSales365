import io
import os
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.model_selection import train_test_split
import joblib
from typing import Any
from app_api.application.repositories.MLmodel_repository import MLmodelRepository

class SklearnRandomForestService:
    def __init__(self, model_type: str = 'classifier', model_params: dict|None = None):
        self.model_type = model_type
        self.model_params = model_params or {}
        self.model = None
        self.feature_columns = []
        self.metadata = {}
        self.is_trained = False  # Nuevo flag para verificar entrenamiento

        print(f"🔧 Inicializando modelo {model_type} con parámetros: {self.model_params}")
        
        if model_type == 'classifier':
            self.model = RandomForestClassifier(**self.model_params)
        elif model_type == 'regressor':
            self.model = RandomForestRegressor(**self.model_params)
        else:
            raise ValueError('Invalid model_type')
        
        print("✅ Modelo scikit-learn inicializado correctamente")

    def train(self, X, y, test_size=0.2, random_state=42):
        try:
            print(f"📊 Iniciando entrenamiento - X: {X.shape}, y: {y.shape}")
            
            # Convertir a numpy arrays si es necesario
            if not isinstance(X, np.ndarray):
                X = np.array(X, dtype=np.float64)
            if not isinstance(y, np.ndarray):
                y = np.array(y, dtype=np.float64)
                
            print(f"📊 Datos convertidos - X: {X.shape}, y: {y.shape}")

            # Verificar que no hay NaN o infinitos
            if np.any(np.isnan(X)) or np.any(np.isnan(y)):
                raise Exception("Los datos contienen valores NaN")
            if np.any(np.isinf(X)) or np.any(np.isinf(y)):
                raise Exception("Los datos contienen valores infinitos")

            # Dividir datos
            X_train, X_test, y_train, y_test = train_test_split(
                X, y, test_size=test_size, random_state=random_state
            )
            print(f"✅ Datos divididos - Train: {X_train.shape}, Test: {X_test.shape}")

            # CORRECCIÓN: Verificar modelo de forma segura
            if self.model is None:
                raise Exception("El modelo no está inicializado")

            print("🎯 Entrenando modelo Random Forest...")
            # Entrenar el modelo
            self.model.fit(X_train, y_train)
            self.is_trained = True  # Marcar como entrenado
            print("✅ Modelo entrenado exitosamente")

            # Actualizar metadatos
            feature_count = X_train.shape[1] if hasattr(X_train, 'shape') else len(X_train[0])
            
            self.metadata.update({
                'training_date': pd.Timestamp.now().isoformat(),
                'samples_trained': len(X_train),
                'feature_count': feature_count,
                'test_size': test_size,
                'random_state': random_state,
                'model_type': self.model_type,
                'is_trained': True
            })
            print(f"📝 Metadatos actualizados")

        except Exception as e:
            print(f"❌ Error durante el entrenamiento: {e}")
            import traceback
            traceback.print_exc()
            raise Exception(f"El modelo no se pudo entrenar: {e}")

    def predict(self, X) -> Any:
        try:
            # CORRECCIÓN: Usar el flag is_trained en lugar de verificar el modelo directamente
            if not self.is_trained or self.model is None:
                raise Exception("El modelo no está entrenado o no existe")
            
            # Convertir datos de entrada
            if not isinstance(X, np.ndarray):
                X = np.array(X, dtype=np.float64)
                
            return self.model.predict(X)
        except Exception as e:
            raise Exception(f"El modelo no se pudo predecir: {e}")

    def save_bd(self, repository: MLmodelRepository, model_name):
        try:
            # CORRECCIÓN: Usar is_trained para verificar
            if not self.is_trained or self.model is None:
                raise Exception("El modelo no está entrenado para guardar")
            
            print("💾 Guardando modelo en base de datos...")
            model_bytes = io.BytesIO()
            
            model_package = {
                'model': self.model,
                'model_type': self.model_type,
                'model_params': self.model_params,
                'feature_columns': self.feature_columns,
                'metadata': self.metadata,
                'is_trained': self.is_trained  # Guardar el flag
            }
            
            joblib.dump(model_package, model_bytes)
            model_bytes.seek(0)
            
            # Usar la entidad correcta
            from app_api.domain.entities.MLmodel_entity import MLmodelEntity
            model = repository.get(name=model_name)

            if (not isinstance(model, list)):
                model = [model]
            
            entidad = model[0]
            if not model[0]:
                entidad = MLmodelEntity(
                    id=None,
                    name=model_name,
                    model_data=model_bytes.getvalue(),
                    version="1.0.0",
                    description="Modelo de Random Forest"
                )

            result = repository.save(entidad)
            
            print("✅ Modelo guardado en base de datos")
            return result
            
        except Exception as e:
            raise Exception(f"El modelo no se pudo guardar en BD: {e}")

    def load_bd(self, repository: MLmodelRepository, model_name):
        try:
            print("📂 Cargando modelo desde base de datos...")
            obj = repository.get(name=model_name)  # o repository.get_latest()
            if not isinstance(obj, list):
                obj = [obj]
            print(obj)
            model_bytes = io.BytesIO(obj[0].model_data)
            model_package = joblib.load(model_bytes)
            
            # Restaurar estado
            self.model = model_package['model']
            self.model_type = model_package['model_type']
            self.model_params = model_package['model_params']
            self.feature_columns = model_package['feature_columns']
            self.metadata = model_package['metadata']
            self.is_trained = model_package.get('is_trained', True)  # Cargar el flag
            
            print("✅ Modelo cargado desde base de datos")
            
        except Exception as e:
            raise Exception(f"El modelo no se pudo cargar desde BD: {e}")

    def evaluate(self, X, y) -> float:
        try:
            # CORRECCIÓN: Usar is_trained para verificar
            if not self.is_trained or self.model is None:
                raise Exception("El modelo no está entrenado")
            
            # Convertir datos si es necesario
            if not isinstance(X, np.ndarray):
                X = np.array(X, dtype=np.float64)
            if not isinstance(y, np.ndarray):
                y = np.array(y, dtype=np.float64)
                
            score = self.model.score(X, y)
            print(f"📈 Score R²: {score:.4f}")
            return float(score)
        except Exception as e:
            raise Exception(f"El modelo no se pudo evaluar: {e}")
        
    def set_feature_columns(self, feature_columns):
        self.feature_columns = feature_columns
        print(f"🏷️ Características establecidas: {len(feature_columns)}")

    def get_metadata(self):
        return self.metadata.copy()
    
    def is_model_trained(self):
        """Método seguro para verificar si el modelo está entrenado"""
        return self.is_trained and self.model is not None