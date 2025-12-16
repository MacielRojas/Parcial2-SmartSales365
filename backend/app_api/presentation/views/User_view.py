from app_api.application.usecases.User_usecase import UserUseCase
from app_api.infraestructure.repositories.djangoUser_repository import DjangoUserRepository
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from app_api.infraestructure.services.auth.djangohasher import DjangoHasher
from app_api.application.usecases.UserRol_usecase import UserRolUseCase
from app_api.infraestructure.repositories.djangoUserRol_repository import DjangoUserRolRepository
from app_api.infraestructure.repositories.djangoRol_repository import DjangoRolRepository
from app_api.application.usecases.Rol_usecase import RolUseCase

class UserView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, id=None):
        obj_crud = UserUseCase(repository=DjangoUserRepository(), hasher=DjangoHasher())
        try:
            query_params = request.query_params.dict()
            if id:
                query_params['id'] = id
            obj = obj_crud.get(**query_params)
            if isinstance(obj, list):
                data = []
                for item in obj:
                    item = {"rol": self.getrol_by_user(item.id), **item.__dict__}
                    data.append(item)
            else:
                data = obj.__dict__
            return Response({'obj': data}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_404_NOT_FOUND)

    def post(self, request):
        if not request.data:
             return Response({"error": "No se recibieron datos"}, status=status.HTTP_400_BAD_REQUEST)
        # inicializo el userusecase
        obj_crud = UserUseCase(repository=DjangoUserRepository(), hasher=DjangoHasher())

        data = request.data
        if isinstance(data, list):
            created = []
            failed = []
            for idx, item in enumerate(data):
                try:
                    obj = obj_crud.create(username=item.get('username'), email=item.get('email'), born_date=item.get('born_date'), gender=item.get('gender'), first_name=item.get('first_name'), last_name=item.get('last_name'), password=item.get('password'))
                    if obj:
                        # asignar rol
                        rol = []
                        if obj.id:
                            self.setrol(obj.id, item.get('rol'))
                            # obtener roles
                            rol = self.getrol_by_user(obj.id)
                            # devolver user + rol
                        created.append({'index': idx, 'obj': {'rol': rol, **obj.__dict__}})
                    else:
                        failed.append({'index': idx, 'error': 'No se pudo crear el registro'})
                except Exception as e:
                    failed.append({'index': idx, 'error': str(e)})
            if created and not failed:
                return Response({'created': created}, status=status.HTTP_201_CREATED)
            elif created and failed:
                multi_status = getattr(status, 'HTTP_207_MULTI_STATUS', status.HTTP_200_OK)
                return Response({'created': created, 'failed': failed}, status=multi_status)
            else:
                return Response({'failed': failed}, status=status.HTTP_400_BAD_REQUEST)
        try:
            obj = obj_crud.create(username=data.get('username'), email=data.get('email'), born_date=data.get('born_date'), gender=data.get('gender'), first_name=data.get('first_name'), last_name=data.get('last_name'), password=data.get('password'))

            # asignar rol
            rol = []
            if obj.id:
                self.setrol(obj.id, data.get('rol'))
                rol = self.getrol_by_user(obj.id)
            obj = {'rol': rol, **obj.__dict__}

            return Response({'obj': obj}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request):
        if not request.data:
             return Response({"error": "No se recibieron datos"}, status=status.HTTP_400_BAD_REQUEST)
        # inicializo el userusecase
        obj_crud = UserUseCase(repository=DjangoUserRepository(), hasher=DjangoHasher())

        data = {}
        for key, value in request.data.items():
            if key != 'id':
                data[key] = value
        try:
            obj = obj_crud.update(request.data.get('id'), **data)
            # actualizo el rol si existe
            rol = []
            if obj.id and request.data.get('rol'):
                self.setrol(obj.id, request.data.get('rol'))
                rol = self.getrol_by_user(obj.id)
            obj = {'rol': rol, **obj.__dict__}
            return Response({'obj': obj}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, id=None):
        obj_crud = UserUseCase(repository=DjangoUserRepository(), hasher=DjangoHasher())
        try:
            if not id:
                id = request.query_params.get('id')
            obj = obj_crud.delete(id=id)
            if obj:
                return Response({'success': obj}, status=status.HTTP_200_OK)
            return Response({'success': obj}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
    def setrol(self, userid, rols):
        try:
            # inicializo el userrol usecase
            user_rol_crud = UserRolUseCase(repository=DjangoUserRolRepository())

            # inicializo el repository
            rol_repo = DjangoRolRepository()
            
            user_rol = user_rol_crud.get(user=userid)

            # borro todos los roles
            if user_rol and isinstance(user_rol, list):
                for rol in user_rol:
                    user_rol_crud.delete(id=rol.id)

            # asigno nuevos roles
            if (isinstance(rols, list)):
                for rol in rols:
                    # obtengo el rol por su nombre
                    rolobj = rol_repo.get_by_nombre(nombre=rol)

                    if rolobj and rolobj.id:
                        user_rol_crud.create(user=userid, rol=rolobj.id)
                    # si no exite no hace nada por ahora
            else:
                # obtengo el rol por su nombre
                rolobj = rol_repo.get_by_nombre(nombre=rols)

                if rolobj and rolobj.id:
                    user_rol_crud.create(user=userid, rol=rolobj.id)
                # si no exite no hace nada por ahora

        except Exception as e:
            raise Exception(f"No se pudo asignar el rol: {e}")
        
    def getrol_by_user(self, userid):
        try:
            # inicializo el userrol usecase
            user_rol_crud = UserRolUseCase(repository=DjangoUserRolRepository())
            rol_crud = RolUseCase(repository=DjangoRolRepository())
            user_roles = user_rol_crud.get(user=userid)
            roles = []
            if user_roles and isinstance(user_roles, list):
                for userrol in user_roles:
                    rol = rol_crud.get(id=userrol.rol)
                    if rol and isinstance(rol, list):
                        roles.append(rol[0].nombre)
            return roles
        except Exception as e:
            raise Exception(f"No se pudo obtener los roles: {e}")