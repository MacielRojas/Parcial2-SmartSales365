import numpy as np
from datetime import datetime
from django.db.models import Sum, Count, Avg
from app_api.infraestructure.services.IA.sklearn_rf_service import SklearnRandomForestService
from app_api.infraestructure.repositories.djangoMLmodel_repository import DjangoMLmodelRepository
from app_api.models import Venta, Carrito, DetalleCarrito, Pago, User, Producto

class MLModelPredictUseCase:
    def prepare_training_data(self):
        """Prepara datos de entrenamiento usando directamente los modelos Django"""
        try:
            print("📊 Preparando datos de entrenamiento...")
            
            # Obtener ventas directamente del modelo
            ventas = Venta.objects.all().select_related(
                'carrito', 
                'pago',
                'carrito__usuario'
            ).prefetch_related(
                'carrito__detallecarrito_set',
                'carrito__detallecarrito_set__producto',
                'carrito__detallecarrito_set__producto__categoria'
            )
            
            print(f"📈 Ventas encontradas: {ventas.count()}")
            
            features = []
            targets = []
            
            for i, venta in enumerate(ventas):
                try:
                    print(f"🔍 Procesando venta {i+1}/{ventas.count()}: ID {venta.id}")
                    
                    carrito = venta.carrito
                    pago = venta.pago
                    usuario = carrito.usuario
                    
                    # Obtener detalles del carrito
                    detalles = DetalleCarrito.objects.filter(carrito=carrito).select_related('producto', 'producto__categoria')
                    
                    if not detalles.exists():
                        print(f"⚠️  No hay detalles para carrito {carrito.id}")
                        continue
                    
                    # CALCULAR CARACTERÍSTICAS CORRECTAMENTE
                    total_productos = detalles.count()  # Número de productos diferentes
                    total_cantidad = detalles.aggregate(total=Sum('cantidad'))['total'] or 0
                    
                    if total_cantidad == 0:
                        print(f"⚠️  Carrito {carrito.id} tiene cantidad 0")
                        continue
                    
                    # Calcular monto total de productos y precio promedio
                    monto_total_productos = sum(det.cantidad * det.producto.precio for det in detalles)
                    precio_promedio = monto_total_productos / total_cantidad
                    
                    # Encontrar producto más vendido en esta venta
                    producto_mas_vendido = detalles.order_by('-cantidad').first()
                    categoria_id = producto_mas_vendido.producto.categoria.id if producto_mas_vendido.producto.categoria else 0 # type: ignore
                    
                    # Calcular edad del usuario
                    edad = self._calcular_edad(usuario.born_date) if usuario.born_date else 30
                    
                    # Características temporales
                    fecha_venta = venta.created_at
                    dia_semana = fecha_venta.weekday()
                    mes = fecha_venta.month
                    es_fin_de_semana = 1 if dia_semana >= 5 else 0
                    
                    # Historial del usuario (ventas anteriores a esta fecha)
                    historial_ventas = Venta.objects.filter(
                        carrito__usuario=usuario,
                        created_at__lt=fecha_venta,
                        pago__estado='aprobado'
                    ).count()
                    
                    # Crear vector de características
                    feature_vector = [
                        float(total_productos),           # Número de productos diferentes
                        float(total_cantidad),            # Cantidad total de items
                        float(precio_promedio),           # Precio promedio por item
                        float(categoria_id),              # Categoría del producto más vendido
                        float(dia_semana),                # Día de la semana (0-6)
                        float(mes),                       # Mes (1-12)
                        float(es_fin_de_semana),          # Es fin de semana (0/1)
                        float(edad),                      # Edad del usuario
                        float(historial_ventas),          # Historial de compras del usuario
                        float(pago.monto),                # Monto total (target histórico)
                    ]
                    
                    # Verificar que no hay valores inválidos
                    if any(np.isnan(x) or np.isinf(x) for x in feature_vector):
                        print(f"⚠️  Características inválidas en venta {venta.id}")
                        continue
                    
                    features.append(feature_vector)
                    targets.append(float(pago.monto))  # Target: monto de la venta
                    
                    if i < 3:  # Mostrar primeras muestras
                        print(f"  ✅ Muestra {i}: {[round(x, 2) for x in feature_vector]} -> {pago.monto}")
                        
                except Exception as e:
                    print(f"❌ Error procesando venta {venta.id}: {e}")
                    import traceback
                    traceback.print_exc()
                    continue
            
            if not features:
                raise Exception("No se pudieron extraer características válidas de las ventas")
            
            X = np.array(features, dtype=np.float64)
            y = np.array(targets, dtype=np.float64)
            
            print(f"✅ Datos preparados: {X.shape[0]} muestras, {X.shape[1]} características")
            print(f"📊 Rango de target: {y.min():.2f} - {y.max():.2f}")
            return X, y
            
        except Exception as e:
            print(f"❌ Error general en prepare_training_data: {e}")
            import traceback
            traceback.print_exc()
            return np.array([]), np.array([])
    
    def _calcular_edad(self, born_date):
        """Calcula la edad basada en la fecha de nacimiento"""
        if not born_date:
            return 30
        today = datetime.today()
        return today.year - born_date.year - ((today.month, today.day) < (born_date.month, born_date.day))
    
    def train_save_data(self, test_size=0.2, random_state=42):
        try:
            print("🚀 Iniciando entrenamiento del modelo...")
            X, y = self.prepare_training_data()
            
            if len(X) == 0:
                raise Exception("No hay datos suficientes para entrenar el modelo")
            
            print(f"📊 Datos listos: {X.shape[0]} muestras, {X.shape[1]} características")
            
            # Configurar modelo
            rf_service = SklearnRandomForestService(
                model_type='regressor', 
                model_params={
                    'n_estimators': 100,
                    'max_depth': 15,
                    'random_state': random_state,
                    'n_jobs': -1,
                    'min_samples_split': 5,
                    'min_samples_leaf': 2
                }
            )
            
            # Establecer nombres de características
            feature_columns = [
                'total_productos', 'total_cantidad', 'precio_promedio',
                'categoria_principal', 'dia_semana', 'mes', 'es_fin_de_semana',
                'edad_usuario', 'historial_ventas', 'monto_historico'
            ]
            rf_service.set_feature_columns(feature_columns)
            
            # Entrenar modelo
            print("🎯 Entrenando modelo Random Forest...")
            rf_service.train(X, y, test_size=test_size, random_state=random_state)
            
            # Evaluar modelo
            score = rf_service.evaluate(X, y)
            print(f"📈 Score R² del modelo: {score:.4f}")
            
            # Guardar en base de datos
            print("💾 Guardando modelo en base de datos...")
            rf_service.save_bd(repository=DjangoMLmodelRepository(), model_name='RandomForest_Ventas')
            
            return {
                'success': True,
                'score': float(score),
                'samples': len(X),
                'features': X.shape[1],
                'model_name': 'RandomForest_Ventas'
            }
            
        except Exception as e:
            print(f"❌ Error en train_save_data: {e}")
            import traceback
            traceback.print_exc()
            return {
                'success': False,
                'error': str(e)
            }
    
    def load_and_predict(self, X):
        """Carga el modelo y hace predicciones"""
        try:
            print("🔮 Cargando modelo para predicción...")
            
            # Inicializar servicio
            rf_service = SklearnRandomForestService(
                model_type='regressor',
                # model_params={'n_estimators': 100}
            )
            
            # Cargar modelo desde BD
            rf_service.load_bd(repository=DjangoMLmodelRepository(), model_name='RandomForest_Ventas')
            
            # Convertir datos de entrada
            if not isinstance(X, np.ndarray):
                X = np.array(X, dtype=np.float64)
            
            # Hacer predicción
            predictions = rf_service.predict(X)
            
            return {
                'success': True,
                'predictions': predictions.tolist() if hasattr(predictions, 'tolist') else predictions,
                'metadata': rf_service.get_metadata()
            }
            
        except Exception as e:
            print(f"❌ Error en load_and_predict: {e}")
            import traceback
            traceback.print_exc()
            return {
                'success': False,
                'error': str(e)
            }
    
    def predict_single_venta(self, user_id, productos_data):
        """Predice el monto de una venta potencial usando datos reales"""
        try:
            # Obtener usuario
            usuario = User.objects.get(id=user_id)
            
            # Preparar características para la nueva venta
            feature_vector = self._prepare_prediction_features(usuario, productos_data)
            
            # Hacer predicción
            resultado = self.load_and_predict([feature_vector])
            
            if resultado['success']:
                return {
                    'success': True,
                    'monto_predicho': round(float(resultado['predictions'][0]), 2),
                    'confianza': self._calcular_confianza(resultado['predictions'][0])
                }
            else:
                return resultado
                
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }
    
    def _prepare_prediction_features(self, usuario, productos_data):
        """Prepara características para una predicción en tiempo real"""
        try:
            # Calcular características del carrito actual
            total_productos = len(productos_data)
            total_cantidad = sum(p['cantidad'] for p in productos_data)
            
            # Calcular monto total y precio promedio
            montos_productos = []
            categorias = []
            
            for producto_data in productos_data:
                producto = Producto.objects.get(id=producto_data['producto_id'])
                cantidad = producto_data['cantidad']
                montos_productos.append(producto.precio * cantidad)
                categorias.append(producto.categoria.id if producto.categoria else 0)
            
            monto_total = sum(montos_productos)
            precio_promedio = monto_total / total_cantidad if total_cantidad > 0 else 0
            
            # Categoría principal (la más frecuente)
            categoria_principal = max(set(categorias), key=categorias.count) if categorias else 0
            
            # Características temporales
            hoy = datetime.now()
            dia_semana = hoy.weekday()
            mes = hoy.month
            es_fin_de_semana = 1 if dia_semana >= 5 else 0
            
            # Edad del usuario
            edad = self._calcular_edad(usuario.born_date) if usuario.born_date else 30
            
            # Historial del usuario
            historial_ventas = Venta.objects.filter(
                carrito__usuario=usuario,
                pago__estado='aprobado'
            ).count()
            
            # Crear vector de características (sin monto_historico para predicción)
            feature_vector = [
                float(total_productos),
                float(total_cantidad),
                float(precio_promedio),
                float(categoria_principal),
                float(dia_semana),
                float(mes),
                float(es_fin_de_semana),
                float(edad),
                float(historial_ventas),
                0.0  # monto_historico no disponible para predicción futura
            ]
            
            return feature_vector
            
        except Exception as e:
            print(f"❌ Error preparando características de predicción: {e}")
            # Retornar vector por defecto en caso de error
            return [1.0, 1.0, 100.0, 1.0, datetime.now().weekday(), datetime.now().month, 0, 30.0, 0, 0.0]
    
    def _calcular_confianza(self, prediccion):
        """Calcula la confianza basada en el rango de la predicción"""
        if prediccion < 50:
            return "baja"
        elif prediccion < 200:
            return "media"
        else:
            return "alta"
    
    def get_model_info(self):
        """Obtiene información del modelo guardado"""
        try:
            rf_service = SklearnRandomForestService(model_type='regressor')
            rf_service.load_bd(repository=DjangoMLmodelRepository(), model_name='RandomForest_Ventas')
            
            metadata = rf_service.get_metadata()
            return {
                'success': True,
                'metadata': metadata,
                'feature_columns': rf_service.feature_columns
            }
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }