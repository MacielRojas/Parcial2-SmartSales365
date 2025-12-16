from app_api.application.services.image_service import ImageService
import cloudinary
import cloudinary.uploader
from decouple import config

cloudinary.config(
    cloud_name=config('CLOUD_NAME'),
    api_key=config('CLOUD_API_KEY'),
    api_secret=config('CLOUD_API_SECRET'),
)

class CloudinaryService(ImageService):
    def __init__(self):
        pass

    def save_image(self, image_file, folder='galeria')->str:
        try:
            result = cloudinary.uploader.upload(image_file, folder=folder)
            return result["secure_url"]
        except Exception as e:
            raise Exception(f"No se pudo guardar el registro: {e}")
    
    def delete_image(self, url)->dict:
        try:
            url = url.split("/")[-1]
            return cloudinary.uploader.destroy(f'galeria/{url}')
        except Exception as e:
            raise Exception(f"No se pudo eliminar el registro: {e}")