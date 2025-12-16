from app_api.application.services.ia_service import IAService
from decouple import config
import openai

class OpenAIService(IAService):

    def __init__(self):
        self.client = openai.api_key=config('OPENAI_API_KEY')


    def text_to_sql(self, prompt)->str:
        try:
            path = "app_api/models.py"
            with open(path, "r") as f:
                modelcontext = f.read()
            prompt_ai=f"""
            eres un asistente experto en SQL. 
            Usa la siguiente estructura de base de datos para generar consultas seguras:
            {modelcontext}
            intruccion del usuario: {prompt}
            Genera solo una sentencia SQL valida de tipo SELECT anadiendo el prefijo 'app_api_' a cada tabla que llegues a utilizar, por ejemplo
            de la tabla User se genera app_api_user, sin comentarios ni texto adicional
            """
            response = openai.ChatCompletion.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "user", "content": prompt_ai}
                ]
            )
            
            sql = response
            return f"{sql}".strip()
        except Exception as e:
            raise Exception(f"No se pudo realizar la conversion: {e}")
        