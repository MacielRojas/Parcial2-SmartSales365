from google import genai
from app_api.application.services.ia_service import IAService
from decouple import config

class GoogleIAService(IAService):
    def __init__(self):
        self.client = genai.Client(api_key=config('GOOGLE_API_KEY'))
        
    def text_to_sql(self, prompt)->str:
        try:
            path = "app_api/models.py"
            with open(path,'r') as f:
                modelcontext = f.read()
                response = self.client.models.generate_content(
                    model="gemini-2.0-flash-lite",
                    contents=[
                        {
                            "text": f"""
                            eres un asistente experto en SQL (postgresql). 
                            Usa la siguiente estructura de base de datos para generar consultas seguras:
                            {modelcontext}
                            intruccion del usuario: {prompt}
                            Genera solo una sentencia SQL valida de tipo SELECT anadiendo el prefijo 'app_api_' a cada tabla que llegues a utilizar (ej: tabla User -> app_api_user), 
                            sin inferir valores para campos, sin comentarios ni texto adicional
                            """
                        }
                    ]
                )
                if not response or not response.text:
                    raise Exception("No se pudo convertir a sql")

                return response.text.replace('```sql','').replace('```','').strip()
        except Exception as e:
            raise Exception(f"No se pudo convertir a sql: {e}")
        

    def predict(self, prompt):
        try:
            path = "app_api/models.py"
            with open(path, 'r') as f:
                modelcontext = f.read()
                response = self.client.models.generate_content(
                    model='gemini-2.0-flash-lite',
                    contents=[
                        {
                            "text": f""" eres una ia experto en random forest progressor, quiero que devuelvas 
                                        el id y nombre del producto sacalo del texto que te mandare
                                        productos con su prediccion de ventas, fecha de prediccion, id del producto y su nombre
                                        usa este model para guiarte de los campos y tablas que hay:
                                        {modelcontext}
                                        hazme la prediccion de estos datos de este texto:
                                          {prompt}
                                        su salida hazlo un json que sea compatible con esto 
                                        export interface PredictionData {{
  producto_id: number;
  producto_nombre: string;
  prediccion_ventas: number;
  confianza: number;
  fecha_prediccion: string;
}}
                                    """
                        }
                    ]
                )
                if not response or not response.text:
                    raise Exception('No se pudo ejecutar el prompt')
                return response.text.replace('```json','').replace('```','').strip()
        except Exception as e:
            raise Exception(f"Datos incoherentes: {e}")
        
    def text_to_carrito(self, prompt)->str:
        try:
            response = self.client.models.generate_content(
                model="gemini-2.0-flash-lite",
                contents=[
                    {
                        "text": f"""
                        eres un asistente experto en SQL (postgresql).
                        """
                    }
                ]
            )
            if not response or not response.text:
                raise Exception("No se pudo convertir a sql")

            return response.text.replace('```sql','').replace('```','').strip()
        except Exception as e:
            raise Exception(f"No se pudo convertir a sql: {e}")