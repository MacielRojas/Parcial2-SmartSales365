from abc import ABC, abstractmethod

class ImageService(ABC):
    @abstractmethod
    def save_image(self, image_file, folder='galeria')->str:
        '''
        Guarda la imagen en la carpeta indicada
        output: str - url de la imagen
        image_file: archivo de la imagen
        folder: carpeta de la imagen
        '''
        pass

    @abstractmethod
    def delete_image(self, url)->dict:
        '''
        Elimina la imagen de la carpeta indicada
        output: dict ejmplo: {'result': 'ok'}
        public_id: identificador de la imagen ejemplo: 'galeria/imagen.jpg'
        '''
        pass