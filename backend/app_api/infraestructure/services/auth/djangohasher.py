from app_api.application.services.auth.hasher import Hasher
from django.contrib.auth.hashers import make_password, check_password as check

class DjangoHasher(Hasher):
    def hash(self, password: str)-> str:
        return make_password(password)
    
    def verify(self, password: str, hashed_password: str)-> bool:
        return check(password, hashed_password)