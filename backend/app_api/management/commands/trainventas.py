from django.core.management.base import BaseCommand
from app_api.application.usecases.mlmodeltrain import MLModelPredictUseCase

class Command(BaseCommand):
    help = "Entrena y guarda el modelo de ventas en la base de datos"

    def handle(self, *args, **options):
        self.stdout.write('Entrenando el modelo de ventas...')
        try:
            model = MLModelPredictUseCase()
            resultado = model.train_save_data()
            if resultado['success']:
                self.stdout.write(self.style.SUCCESS(f'Modelo de ventas entrenado y guardado correctamente\n'
                                                    f'Score: {resultado["score"]}\n'
                                                    f'Samples: {resultado["samples"]}\n'
                                                    f'Model name: {resultado["model_name"]}\n'))
            else:
                self.stdout.write(self.style.ERROR(f'Error al entrenar el modelo de ventas: {resultado["error"]}\n'))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Error al entrenar el modelo de ventas: {str(e)}\n'))