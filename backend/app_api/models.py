from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class TimestampModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        abstract = True

class User(TimestampModel, AbstractUser):
    id = models.AutoField(primary_key=True)
    username = models.CharField(max_length=50)
    # django maneja la password
    # password = models.CharField(max_length=50)
    email = models.EmailField(max_length=50, unique=True)
    born_date = models.DateField(null=True, blank=True)
    gender = models.CharField(max_length=10, null=True, blank=True)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    is_active = models.BooleanField(default=True)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['born_date', 'gender', 'first_name', 'last_name', 'password']

    def __str__(self):
        return self.username


class Categoria(TimestampModel):
    id = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=50)
    descripcion = models.TextField(null=True, blank=True)

    def __str__(self):
        return self.nombre

class Producto(TimestampModel):
    id = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=50)
    precio = models.IntegerField(default=0)
    stock = models.PositiveIntegerField(default=0)
    codigo = models.CharField(max_length=10, unique=True)
    marca = models.CharField(max_length=50)
    categoria = models.ForeignKey(Categoria, on_delete=models.CASCADE)

    def __str__(self):
        return self.nombre
    
class Carrito(TimestampModel):
    id = models.AutoField(primary_key=True)
    usuario = models.ForeignKey(User, on_delete=models.CASCADE)
    total = models.IntegerField(default=0)
    descuento = models.IntegerField(null=True, blank=True)

    def __str__(self):
        return f"Carrito de {self.usuario.username}"

class DetalleCarrito(TimestampModel):
    id = models.AutoField(primary_key=True)
    carrito = models.ForeignKey(Carrito, on_delete=models.CASCADE)
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE)
    cantidad = models.IntegerField(default=1)
    descuento = models.IntegerField(null=True, blank=True)

    def __str__(self):
        return f"Detalle de {self.producto.nombre} en el carrito de {self.carrito.usuario.username}"
    
class Pago(TimestampModel):
    ESTADO = (
        ('pendiente', 'Pendiente'),
        ('aprobado', 'Aprobado'),
        ('rechazado', 'Rechazado'),
    )
    id = models.AutoField(primary_key=True)
    monto = models.IntegerField(default=0)
    moneda = models.CharField(max_length=5, default='USD')

    estado = models.CharField(max_length=20, choices=ESTADO, default='pendiente')
    carrito = models.ForeignKey(Carrito, on_delete=models.CASCADE)
    payment_method_id = models.CharField(max_length=255, default='0')
    payment_intent = models.CharField(max_length=255, default='0')

    def __str__(self):
        return f"Pago para el carrito de {self.carrito.usuario.username}"

class Descuento(TimestampModel):
    TIPOS = (
        ('porcentaje', 'Porcentaje'),
        ('fijo', 'Fijo'),
    )
    id = models.AutoField(primary_key=True)
    tipo = models.CharField(choices=TIPOS, max_length=10, default='porcentaje')
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE)
    valor = models.IntegerField(default=0)
    fecha_inicio = models.DateField(null=True, blank=True)
    fecha_fin = models.DateField(null=True, blank=True)

    def __str__(self):
        return f"Descuento para el producto {self.producto.nombre}"
    
class Rol(TimestampModel):
    id = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=50)
    descripcion = models.TextField(null=True, blank=True)

    def __str__(self):
        return self.nombre

class Permiso(TimestampModel):
    id = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=50)
    descripcion = models.TextField(null=True, blank=True)

    def __str__(self):
        return self.nombre
    
class RolPermiso(TimestampModel):
    id = models.AutoField(primary_key=True)
    rol = models.ForeignKey(Rol, on_delete=models.CASCADE)
    permiso = models.ForeignKey(Permiso, on_delete=models.CASCADE)

    def __str__(self):
        return f"Permiso {self.permiso.nombre} para el rol {self.rol.nombre}"
    
class UserRol(TimestampModel):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    rol = models.ForeignKey(Rol, on_delete=models.CASCADE)

    def __str__(self):
        return f"Rol {self.rol.nombre} para el usuario {self.user.username}"

class MLmodel(TimestampModel):
    ''' Modelo django para almacenar modelos de machine learning serializados'''
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100, unique=True)
    version = models.CharField(max_length=100)
    # aqui se guarda el modelo serializado (.joblib o .pkl)
    model_data = models.BinaryField()
    description = models.TextField(null=True, blank=True)

    def __str__(self):
        return self.name
    
class Venta(TimestampModel):
    id = models.AutoField(primary_key=True)
    carrito = models.ForeignKey(Carrito, on_delete=models.CASCADE)
    pago = models.ForeignKey(Pago, on_delete=models.CASCADE)

    def __str__(self):
        return f"Venta para el carrito de {self.carrito.usuario.username}"

class Factura(TimestampModel):
    id = models.AutoField(primary_key=True)
    venta = models.ForeignKey(Venta, on_delete=models.CASCADE)
    fecha_expendida = models.DateField(null=True, blank=True)
    nit = models.CharField(max_length=50, null=True, blank=True)

    def __str__(self):
        return f"Factura para la venta de {self.venta.carrito.usuario.username}"
    
class Garantia(TimestampModel):
    ESTADOS = (
        ('pendiente', 'Pendiente'),
        ('aprobado', 'Aprobado'),
        ('rechazado', 'Rechazado'),
    )
    id = models.AutoField(primary_key=True)
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE)
    usuario = models.ForeignKey(User, on_delete=models.CASCADE)
    precio = models.IntegerField(default=0)
    fecha_inicio = models.DateField(null=True, blank=True)
    fecha_fin = models.DateField(null=True, blank=True)
    descripcion = models.TextField(null=True, blank=True)
    estado = models.CharField(max_length=20, default='pendiente')

    def __str__(self):
        return f"Garantia para el producto {self.producto.nombre} del cliente {self.usuario.username}"
    
class Mantenimiento(TimestampModel):
    ESTADOS = (
        ('pendiente', 'Pendiente'),
        ('realizado', 'Realizado'),
        ('rechazado', 'Rechazado'),
    )
    id = models.AutoField(primary_key=True)
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE)
    precio = models.IntegerField(default=0)
    fecha_programada = models.DateField(null=True, blank=True)
    estado = models.CharField(max_length=20, default='pendiente')
    usuario = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return f"Mantenimiento para el producto {self.producto.nombre} del cliente {self.usuario.username}"
    
class Galeria(TimestampModel):
    id = models.AutoField(primary_key=True)
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE)
    # no se guarda en galeria en loca, sino que se sube a cloudinary
    imagen = models.TextField()

    def __str__(self):
        return f"Galeria para el producto {self.producto.nombre}"
    
class Bitacora(TimestampModel):
    LOG_LEVELS = (
        ('INFO', 'INFO'),
        ('WARNING', 'WARNING'),
        ('ERROR', 'ERROR'),
        ('DEBUG', 'DEBUG'),
    )
    id = models.AutoField(primary_key=True)
    usuario = models.ForeignKey(User, on_delete=models.CASCADE)
    accion = models.CharField(max_length=255)
    ipv4 = models.CharField(max_length=50)
    nivel = models.CharField(choices=LOG_LEVELS, max_length=10, default='INFO')

    def __str__(self):
        return f"Bitacora para el usuario {self.usuario.username}"