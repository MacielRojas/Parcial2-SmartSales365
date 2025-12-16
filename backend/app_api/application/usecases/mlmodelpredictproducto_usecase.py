# application/usecases/MLmodel_predict_producto_usecase.py
import numpy as np
from django.utils import timezone
from datetime import datetime, timedelta
import random
from django.db.models import Count, Sum, Avg, Q
from app_api.infraestructure.services.IA.sklearn_rf_service import SklearnRandomForestService
from app_api.infraestructure.repositories.djangoMLmodel_repository import DjangoMLmodelRepository
from app_api.models import Producto, Venta, DetalleCarrito, Categoria

class MLModelPredictProductoUseCase:
    def __init__(self):
        self.model_repository = DjangoMLmodelRepository()
    
    def prepare_producto_training_data(self):
        """Prepara datos históricos de ventas por producto"""
        try:
            print("📊 Preparando datos de entrenamiento por producto...")
            
            # Obtener todos los productos que han sido vendidos
            productos_vendidos = Producto.objects.filter(
                detallecarrito__carrito__venta__isnull=False
            ).distinct()
            
            print(f"📈 Productos con ventas históricas: {productos_vendidos.count()}")
            
            features = []
            targets = []
            producto_info = []
            
            # Fecha de referencia - usar múltiples puntos en el tiempo
            fecha_actual = timezone.now()
            puntos_entrenamiento = []
            
            # Crear múltiples puntos de entrenamiento en los últimos 6 meses
            for meses_atras in [6, 4, 2, 0]:
                punto_fecha = fecha_actual - timedelta(days=30 * meses_atras)
                puntos_entrenamiento.append(punto_fecha)
            
            for producto in productos_vendidos:
                try:
                    print(f"  🔍 Procesando: {producto.nombre}")
                    
                    # Obtener todas las ventas del producto
                    ventas_producto = Venta.objects.filter(
                        carrito__detallecarrito__producto=producto
                    ).select_related('carrito', 'pago').order_by('created_at')
                    
                    total_ventas = ventas_producto.count()
                    print(f"    📦 Ventas totales: {total_ventas}")
                    
                    if total_ventas < 3:  # Mínimo 3 ventas para tener datos temporales
                        print(f"    ⚠️  Saltando - menos de 3 ventas")
                        continue
                    
                    # Usar múltiples puntos de entrenamiento por producto
                    for fecha_referencia in puntos_entrenamiento:
                        # Verificar que hay datos antes y después de la fecha de referencia
                        ventas_antes = ventas_producto.filter(
                            created_at__lt=fecha_referencia
                        ).count()
                        
                        ventas_despues = ventas_producto.filter(
                            created_at__gte=fecha_referencia,
                            created_at__lt=fecha_referencia + timedelta(days=30)
                        ).count()
                        
                        if ventas_antes < 1 or ventas_despues < 1:
                            continue
                        
                        # Características del producto
                        precio = producto.precio
                        categoria_id = producto.categoria.id if producto.categoria else 0
                        
                        # Obtener stock histórico (aproximado)
                        stock_historico = self._estimar_stock_historico(producto, fecha_referencia)
                        
                        # Estadísticas históricas (PERIODO ANTERIOR - últimos 30 días antes de referencia)
                        ventas_periodo_anterior = ventas_producto.filter(
                            created_at__range=[
                                fecha_referencia - timedelta(days=30), 
                                fecha_referencia
                            ]
                        ).count()
                        
                        # Ventas históricas totales (antes del período anterior)
                        ventas_periodo_historico = ventas_producto.filter(
                            created_at__lt=fecha_referencia - timedelta(days=30)
                        ).count()
                        
                        # Promedio de cantidad vendida por venta (histórico)
                        resultado_avg = DetalleCarrito.objects.filter(
                            producto=producto,
                            carrito__venta__isnull=False,
                            carrito__venta__created_at__lt=fecha_referencia
                        ).aggregate(avg=Avg('cantidad'))
                        avg_cantidad = resultado_avg['avg'] or 1.0
                        
                        # Total vendido históricamente
                        resultado_total = DetalleCarrito.objects.filter(
                            producto=producto,
                            carrito__venta__isnull=False,
                            carrito__venta__created_at__lt=fecha_referencia
                        ).aggregate(total=Sum('cantidad'))
                        total_vendido_historico = resultado_total['total'] or 0
                        
                        # TARGET: Ventas en el período POSTERIOR (30 días después de referencia)
                        ventas_periodo_posterior = ventas_despues
                        
                        print(f"    📊 Ref: {fecha_referencia.date()}, Anterior: {ventas_periodo_anterior}, Posterior: {ventas_periodo_posterior}")
                        
                        # Características temporales
                        mes_referencia = fecha_referencia.month
                        es_temporada_alta = 1 if mes_referencia in [11, 12, 5, 6] else 0
                        
                        # Feature vector
                        feature_vector = [
                            float(precio),
                            float(categoria_id),
                            float(stock_historico),
                            float(ventas_periodo_anterior),
                            float(ventas_periodo_historico),
                            float(avg_cantidad),
                            float(total_vendido_historico),
                            float(mes_referencia),
                            float(es_temporada_alta),
                            float(fecha_referencia.weekday()),
                        ]
                        
                        # TARGET: Ventas del PERIODO POSTERIOR
                        target = float(ventas_periodo_posterior)
                        
                        # Solo añadir si tenemos datos significativos
                        if ventas_periodo_anterior > 0 or ventas_periodo_historico > 0:
                            features.append(feature_vector)
                            targets.append(target)
                            producto_info.append({
                                'producto_id': producto.id,
                                'nombre': producto.nombre,
                                'fecha_referencia': fecha_referencia,
                                'ventas_anterior': ventas_periodo_anterior,
                                'ventas_posterior': ventas_periodo_posterior,
                                'target': target
                            })
                            
                            print(f"    ✅ Añadido - {ventas_periodo_anterior} → {target}")
                    
                except Exception as e:
                    print(f"❌ Error procesando producto {producto.id}: {e}")
                    import traceback
                    traceback.print_exc()
                    continue
            
            if len(features) < 10:  # Si no hay suficientes datos reales
                print("⚠️ Pocos datos reales, generando datos sintéticos adicionales...")
                X_synth, y_synth, info_synth = self._generate_synthetic_training_data()
                if len(X_synth) > 0:
                    features.extend(X_synth.tolist() if hasattr(X_synth, 'tolist') else X_synth)
                    targets.extend(y_synth.tolist() if hasattr(y_synth, 'tolist') else y_synth)
                    producto_info.extend(info_synth)
            
            if not features:
                print("❌ No se pudieron extraer características de los productos")
                return self._generate_synthetic_training_data()
            
            X = np.array(features, dtype=np.float64)
            y = np.array(targets, dtype=np.float64)
            
            print(f"✅ Datos preparados: {X.shape[0]} muestras, {X.shape[1]} características")
            print(f"🎯 Estadísticas de targets: min={y.min()}, max={y.max()}, mean={y.mean():.2f}")
            print(f"📊 Distribución targets: {np.unique(y, return_counts=True)}")
            
            return X, y, producto_info
            
        except Exception as e:
            print(f"❌ Error general en prepare_producto_training_data: {e}")
            import traceback
            traceback.print_exc()
            return self._generate_synthetic_training_data()
    
    def _estimar_stock_historico(self, producto, fecha_referencia):
        """Estima el stock histórico de un producto en una fecha dada"""
        try:
            # Ventas antes de la fecha de referencia
            ventas_antes = DetalleCarrito.objects.filter(
                producto=producto,
                carrito__venta__isnull=False,
                carrito__venta__created_at__lt=fecha_referencia
            ).aggregate(total=Sum('cantidad'))['total'] or 0
            
            # Stock actual + ventas históricas = stock aproximado inicial
            stock_estimado = producto.stock + ventas_antes
            
            # Ajustar por compras/reposiciones (estimación simple)
            # Asumir que se repone cuando el stock baja del 20%
            stock_max_estimado = max(producto.stock * 3, 100)  # Estimación conservadora
            
            return min(stock_estimado, stock_max_estimado)
            
        except Exception as e:
            print(f"⚠️ Error estimando stock histórico: {e}")
            return producto.stock or 50
    
    def _generate_synthetic_training_data(self):
        """Genera datos de entrenamiento sintéticos cuando no hay suficientes datos reales"""
        try:
            print("🎲 Generando datos de entrenamiento sintéticos...")
            
            productos = Producto.objects.all()[:20]
            
            features = []
            targets = []
            producto_info = []
            
            for producto in productos:
                # Generar múltiples muestras por producto
                for _ in range(3):
                    precio = producto.precio or random.randint(50, 500)
                    categoria_id = producto.categoria.id if producto.categoria else random.randint(1, 5)
                    stock_actual = producto.stock or random.randint(10, 100)
                    
                    # Ventas del período anterior (NO cero)
                    ventas_anterior = random.randint(1, 25)
                    
                    # Ventas históricas
                    ventas_historico = random.randint(5, 50)
                    
                    # Promedio de cantidad
                    avg_cantidad = random.uniform(1.0, 3.0)
                    
                    # Total histórico
                    total_historico = random.randint(10, 100)
                    
                    # TARGET: Relación más realista con ventas anteriores
                    # Incluir casos donde ventas posteriores son mayores
                    factor_variacion = random.choice([0.5, 0.8, 1.0, 1.2, 1.5, 2.0])
                    ventas_posterior = max(1, int(ventas_anterior * factor_variacion))
                    
                    # Características temporales
                    mes_actual = random.randint(1, 12)
                    es_temporada_alta = 1 if mes_actual in [11, 12, 5, 6] else 0
                    
                    feature_vector = [
                        float(precio),
                        float(categoria_id),
                        float(stock_actual),
                        float(ventas_anterior),  # ¡IMPORTANTE! No cero
                        float(ventas_historico),
                        float(avg_cantidad),
                        float(total_historico),
                        float(mes_actual),
                        float(es_temporada_alta),
                        float(random.randint(0, 6)),
                    ]
                    
                    target = float(ventas_posterior)
                    
                    features.append(feature_vector)
                    targets.append(target)
                    producto_info.append({
                        'producto_id': producto.id,
                        'nombre': producto.nombre,
                        'sintetico': True,
                        'ventas_anterior': ventas_anterior,
                        'ventas_posterior': ventas_posterior
                    })
            
            X = np.array(features, dtype=np.float64)
            y = np.array(targets, dtype=np.float64)
            
            print(f"✅ Datos sintéticos generados: {X.shape[0]} muestras")
            print(f"🎯 Rango de targets sintéticos: {y.min()} - {y.max()}")
            
            return X, y, producto_info
            
        except Exception as e:
            print(f"❌ Error generando datos sintéticos: {e}")
            return np.array([]), np.array([]), []
    
    def train_producto_model(self):
        """Entrena el modelo de predicción por producto"""
        try:
            print("🚀 Entrenando modelo de predicción por producto...")
            
            X, y, producto_info = self.prepare_producto_training_data()
            
            if len(X) == 0:
                raise Exception("No hay datos suficientes para entrenar el modelo")
            
            # Configurar modelo con parámetros mejorados
            rf_service = SklearnRandomForestService(
                model_type='regressor',
                model_params={
                    'n_estimators': 200,
                    'max_depth': 15,
                    'min_samples_split': 3,
                    'min_samples_leaf': 2,
                    'random_state': 42,
                    'n_jobs': -1
                }
            )
            
            feature_columns = [
                'precio', 'categoria_id', 'stock_actual', 'ventas_30_dias',
                'ventas_90_dias', 'avg_cantidad', 'total_historico',
                'mes_proximo', 'es_temporada_alta', 'dia_semana'
            ]
            rf_service.set_feature_columns(feature_columns)
            
            # Entrenar modelo
            rf_service.train(X, y, test_size=0.2)
            
            # Evaluar modelo
            score = rf_service.evaluate(X, y)
            print(f"📈 Score del modelo de productos: {score:.4f}")
            
            # Verificar predicciones de entrenamiento
            y_pred = rf_service.predict(X)
            print(f"🔍 Predicciones de ejemplo: {y_pred[:10]}")
            print(f"🔍 Targets reales: {y[:10]}")
            
            # Guardar modelo
            rf_service.save_bd(
                repository=self.model_repository,
                model_name='producto_predictor'
            )
            
            return {
                'success': True,
                'score': float(score),
                'muestras_entrenamiento': len(X),
                'model_name': 'producto_predictor'
            }
            
        except Exception as e:
            print(f"❌ Error entrenando modelo de productos: {e}")
            return {
                'success': False,
                'error': str(e)
            }
    
    def predict_ventas_productos(self, producto_ids=None):
        """Predice ventas para una lista de productos"""
        try:
            print("🔮 Prediciendo ventas por producto...")
            
            rf_service = SklearnRandomForestService(model_type='regressor')
            rf_service.load_bd(repository=self.model_repository, model_name='producto_predictor')
            
            if producto_ids:
                productos = Producto.objects.filter(id__in=producto_ids)
            else:
                productos = Producto.objects.filter(stock__gt=0)
            
            predictions = []
            
            for producto in productos:
                try:
                    features = self._prepare_producto_features(producto)
                    
                    if features is None:
                        # Si no se pueden preparar características, usar predicción por categoría
                        prediccion_cantidad = self._predict_por_categoria(producto)
                    else:
                        prediccion_cantidad = rf_service.predict([features])[0]
                    
                    # Asegurar predicción positiva y realista
                    prediccion_cantidad = max(0.1, float(prediccion_cantidad))
                    
                    # Redondear a decimal razonable
                    prediccion_cantidad = round(prediccion_cantidad, 1)
                    
                    monto_estimado = prediccion_cantidad * producto.precio
                    confianza = self._calcular_confianza_producto(producto, prediccion_cantidad)
                    
                    predictions.append({
                        'producto_id': producto.id,
                        'producto_nombre': producto.nombre,
                        'producto_precio': float(producto.precio),
                        'categoria': producto.categoria.nombre if producto.categoria else 'Sin categoría',
                        'stock_actual': producto.stock,
                        'prediccion_ventas': prediccion_cantidad,
                        'monto_estimado': round(monto_estimado, 2),
                        'confianza': confianza,
                        'fecha_prediccion': timezone.now().isoformat()
                    })
                    
                    print(f"📊 Prediccion para {producto.nombre}: {prediccion_cantidad} ventas")
                    
                except Exception as e:
                    print(f"❌ Error prediciendo producto {producto.id}: {e}")
                    continue
            
            return {
                'success': True,
                'predictions': predictions,
                'total_productos': len(predictions)
            }
            
        except Exception as e:
            print(f"❌ Error en predict_ventas_productos: {e}")
            return {
                'success': False,
                'error': str(e)
            }
    
    def _prepare_producto_features(self, producto):
        """Prepara características para un producto específico para PREDICCIÓN"""
        try:
            ahora = timezone.now()
            
            # Estadísticas históricas - usar ventas reales
            ventas_ultimos_30_dias = Venta.objects.filter(
                carrito__detallecarrito__producto=producto,
                created_at__gte=ahora - timedelta(days=30)
            ).count()
            
            # Si no hay ventas recientes, usar ventas históricas ajustadas
            if ventas_ultimos_30_dias == 0:
                ventas_totales = Venta.objects.filter(
                    carrito__detallecarrito__producto=producto
                ).count()
                
                # Estimación conservadora basada en ventas históricas
                if ventas_totales > 0:
                    # Promedio mensual histórico
                    primera_venta = Venta.objects.filter(
                        carrito__detallecarrito__producto=producto
                    ).order_by('created_at').first()
                    
                    if primera_venta:
                        dias_historia = (ahora - primera_venta.created_at).days
                        if dias_historia > 0:
                            ventas_ultimos_30_dias = max(1, (ventas_totales * 30) // dias_historia)
            
            ventas_historico = Venta.objects.filter(
                carrito__detallecarrito__producto=producto,
                created_at__lt=ahora - timedelta(days=30)
            ).count()
            
            # Promedio de cantidad vendida
            resultado_avg = DetalleCarrito.objects.filter(
                producto=producto,
                carrito__venta__isnull=False
            ).aggregate(avg=Avg('cantidad'))
            avg_cantidad = resultado_avg['avg'] or 1.0
            
            # Total vendido
            resultado_total = DetalleCarrito.objects.filter(
                producto=producto,
                carrito__venta__isnull=False
            ).aggregate(total=Sum('cantidad'))
            total_vendido_historico = resultado_total['total'] or 0
            
            # Características temporales
            mes_proximo = (ahora.month % 12) + 1
            es_temporada_alta = 1 if mes_proximo in [11, 12, 5, 6] else 0
            
            features = [
                float(producto.precio),
                float(producto.categoria.id if producto.categoria else 0),
                float(producto.stock),
                float(ventas_ultimos_30_dias),  # ¡IMPORTANTE! Asegurar que no sea 0
                float(ventas_historico),
                float(avg_cantidad),
                float(total_vendido_historico),
                float(mes_proximo),
                float(es_temporada_alta),
                float(ahora.weekday()),
            ]
            
            print(f"    📊 {producto.nombre}: ventas_30d={ventas_ultimos_30_dias}, histórico={ventas_historico}")
            
            return features
            
        except Exception as e:
            print(f"❌ Error preparando características: {e}")
            return None
    
    def _predict_por_categoria(self, producto):
        """Predicción fallback basada en categoría"""
        try:
            if producto.categoria:
                # Promedio de ventas de productos en la misma categoría
                productos_categoria = Producto.objects.filter(categoria=producto.categoria)
                ventas_totales = 0
                count = 0
                
                for prod in productos_categoria:
                    ventas = Venta.objects.filter(
                        carrito__detallecarrito__producto=prod
                    ).count()
                    if ventas > 0:
                        ventas_totales += ventas
                        count += 1
                
                if count > 0:
                    return max(1, ventas_totales / count / 3)  # Estimación conservadora
            
            return random.uniform(1.0, 5.0)  # Predicción base aleatoria
            
        except:
            return random.uniform(1.0, 3.0)
    
    def _calcular_confianza_producto(self, producto, prediccion):
        """Calcula la confianza de la predicción"""
        try:
            ventas_30_dias = Venta.objects.filter(
                carrito__detallecarrito__producto=producto,
                created_at__gte=timezone.now() - timedelta(days=30)
            ).count()
            
            ventas_totales = Venta.objects.filter(
                carrito__detallecarrito__producto=producto
            ).count()
            
            if ventas_totales >= 10 and ventas_30_dias > 0:
                return 'alta'
            elif ventas_totales >= 5:
                return 'media'
            else:
                return 'baja'
                
        except:
            return 'media'