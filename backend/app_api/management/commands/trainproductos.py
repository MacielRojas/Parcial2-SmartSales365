# management/commands/trainproductos.py
from django.core.management.base import BaseCommand
from app_api.application.usecases.mlmodelpredictproducto_usecase import (
    MLModelPredictProductoUseCase)

class Command(BaseCommand):
    help = 'Entrena el modelo de predicción por productos'
    
    def handle(self, *args, **options):
        self.stdout.write('🚀 Entrenando modelo de predicción por productos...')
        
        try:
            usecase = MLModelPredictProductoUseCase()
            resultado = usecase.train_producto_model()
            
            if resultado['success']:
                self.stdout.write(
                    self.style.SUCCESS(
                        f'✅ Modelo de productos entrenado!\n'
                        f'   📊 Productos entrenados: {resultado["productos_entrenados"]}\n'
                        f'   🎯 Score R²: {resultado["score"]:.4f}'
                    )
                )
            else:
                self.stdout.write(
                    self.style.ERROR(f'❌ Error: {resultado["error"]}')
                )
                
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'💥 Error fatal: {e}')
            )