# debug_sklearn.py
import sklearn
import joblib
import numpy as np
from sklearn.ensemble import RandomForestRegressor

print("=== DIAGNÓSTICO SKLEARN ===")
print(f"scikit-learn version: {sklearn.__version__}")
print(f"joblib version: {joblib.__version__}")

# Crear datos de prueba simples
X = np.array([[1, 2], [3, 4], [5, 6], [7, 8], [9, 10]])
y = np.array([1, 2, 3, 4, 5])

print(f"Datos de prueba - X: {X.shape}, y: {y.shape}")

# Probar el modelo directamente
try:
    model = RandomForestRegressor(n_estimators=5, random_state=42)
    print("✅ Modelo creado exitosamente")
    
    model.fit(X, y)
    print("✅ Modelo entrenado exitosamente")
    
    predictions = model.predict(X)
    print(f"✅ Predicciones: {predictions}")
    
    score = model.score(X, y)
    print(f"✅ Score: {score}")
    
except Exception as e:
    print(f"❌ Error: {e}")
    import traceback
    traceback.print_exc()