from app_api.application.services.re_service import REService
import re
import dateparser
from collections import deque
from datetime import timedelta, datetime

class ReREService(REService):
    def __init__(self):
        # Mapeo completo de campos según los modelos Django
        self.field_mapping = {
            # Producto
            'producto': 'app_api_producto.id', 'product': 'app_api_producto.id',
            'nombre': 'app_api_producto.nombre', 'name': 'app_api_producto.nombre',
            'precio': 'app_api_producto.precio', 'price': 'app_api_producto.precio',
            'stock': 'app_api_producto.stock',
            'codigo': 'app_api_producto.codigo', 'code': 'app_api_producto.codigo',
            'marca': 'app_api_producto.marca', 'brand': 'app_api_producto.marca',
            
            # Carrito
            'carrito': 'app_api_carrito.id', 'cart': 'app_api_carrito.id',
            'total': 'app_api_carrito.total',
            'descuento': 'app_api_carrito.descuento', 'discount': 'app_api_carrito.descuento',
            'cantidad': 'app_api_carrito.cantidad', 'quantity': 'app_api_carrito.cantidad',
            
            # Venta
            'venta': 'app_api_venta.id', 'sale': 'app_api_venta.id',

            # Usuario
            'usuario': 'app_api_user.id', 'usuario_id': 'app_api_user.id',
            'email': 'app_api_user.email', 'correo': 'app_api_user.email',
            'username': 'app_api_user.username',
            'first_name': 'app_api_user.first_name', 'nombre_cliente': 'app_api_user.first_name',
            'last_name': 'app_api_user.last_name', 'apellido': 'app_api_user.last_name',
            'born_date': 'app_api_user.born_date', 'fecha_nacimiento': 'app_api_user.born_date',
            'gender': 'app_api_user.gender', 'genero': 'app_api_user.gender', 'sexo': 'app_api_user.gender',
            
            # Categoria
            'categoria': 'app_api_categoria.nombre', 'category': 'app_api_categoria.nombre',
            'descripcion': 'descripcion', 'description': 'descripcion',
            
            # Pago
            'pago': 'app_api_pago.id', 'payment': 'app_api_pago.id',
            'monto': 'app_api_pago.monto', 'amount': 'app_api_pago.monto',
            'estado': 'app_api_pago.estado', 'status': 'app_api_pago.estado',
            'moneda': 'app_api_pago.moneda', 'currency': 'app_api_pago.moneda',
            'payment_method_id': 'app_api_pago.payment_method_id', 'metodo_pago': 'app_api_pago.payment_method_id',
            
            # Descuento
            'descuento': 'app_api_descuento.id', 'discount': 'app_api_descuento.id',
            'tipo': 'app_api_descuento.tipo', 'type': 'app_api_descuento.tipo',
            'valor': 'app_api_descuento.valor', 'value': 'app_api_descuento.valor',
            
            # Mantenimiento
            'fecha_programada': 'app_api_mantenimiento.fecha_programada', 'scheduled_date': 'app_api_mantenimiento.fecha_programada',
            
            # Garantia
            'estado': 'app_api_garantia.estado', 'status': 'app_api_garantia.estado',

            # Timestamps
            'fecha': 'created_at', 'date': 'created_at',
            'created_at': 'created_at', 'fecha_creacion': 'created_at',
            'updated_at': 'updated_at', 'fecha_actualizacion': 'updated_at',
            
            # Factura
            'nit': 'nit',
            'fecha_expendida': 'fecha_expendida', 'invoice_date': 'fecha_expendida',

        }
        
        # Mapeo de modelos/tablas - Nombres reales en la base de datos
        self.model_mapping = {
            'ventas': 'app_api_venta', 'venta': 'app_api_venta', 'sale': 'app_api_venta', 'sales': 'app_api_venta',
            'productos': 'app_api_producto', 'producto': 'app_api_producto', 'product': 'app_api_producto', 'products': 'app_api_producto',
            'usuarios': 'app_api_user', 'usuario': 'app_api_user', 'user': 'app_api_user', 'users': 'app_api_user',
            'clientes': 'app_api_user', 'cliente': 'app_api_user', 'customer': 'app_api_user', 'customers': 'app_api_user',
            'carritos': 'app_api_carrito', 'carrito': 'app_api_carrito', 'cart': 'app_api_carrito', 'carts': 'app_api_carrito',
            'pagos': 'app_api_pago', 'pago': 'app_api_pago', 'payment': 'app_api_pago', 'payments': 'app_api_pago',
            'categorias': 'app_api_categoria', 'categoria': 'app_api_categoria', 'category': 'app_api_categoria', 'categories': 'app_api_categoria',
            'descuentos': 'app_api_descuento', 'descuento': 'app_api_descuento', 'discount': 'app_api_descuento', 'discounts': 'app_api_descuento',
            'garantias': 'app_api_garantia', 'garantia': 'app_api_garantia', 'warranty': 'app_api_garantia', 'warranties': 'app_api_garantia',
            'mantenimientos': 'app_api_mantenimiento', 'mantenimiento': 'app_api_mantenimiento', 'maintenance': 'app_api_mantenimiento',
            'facturas': 'app_api_factura', 'factura': 'app_api_factura', 'invoice': 'app_api_factura', 'invoices': 'app_api_factura',
            'detalles': 'app_api_detallecarrito', 'detalle': 'app_api_detallecarrito', 'detail': 'app_api_detallecarrito',
            'roles': 'app_api_rol', 'rol': 'app_api_rol', 'role': 'app_api_rol',
            'permisos': 'app_api_permiso', 'permiso': 'app_api_permiso', 'permission': 'app_api_permiso',
            'galeria': 'app_api_galeria', 'gallery': 'app_api_galeria', 'imagenes': 'app_api_galeria',
        }
        
        # Relaciones mejoradas entre tablas
        self.relations = {
            ('app_api_producto', 'categoria'): {
                'type': 'INNER JOIN',
                'on': 'app_api_producto.categoria_id = app_api_categoria.id',
                'reverse_on': 'app_api_categoria.id = app_api_producto.categoria_id'
            },
            ('app_api_venta', 'app_api_carrito'): {
                'type': 'INNER JOIN',
                'on': 'app_api_venta.carrito_id = app_api_carrito.id',
                'reverse_on': 'app_api_carrito.id = app_api_venta.carrito_id'
            },
            ('app_api_venta', 'app_api_pago'): {
                'type': 'INNER JOIN',
                'on': 'app_api_venta.pago_id = app_api_pago.id',
                'reverse_on': 'app_api_pago.id = app_api_venta.pago_id'
            },
            ('app_api_carrito', 'app_api_detallecarrito'): {
                'type': 'INNER JOIN',
                'on': 'app_api_carrito.id = app_api_detallecarrito.carrito_id',
                'reverse_on': 'app_api_detallecarrito.carrito_id = app_api_carrito.id'
            },
            ('app_api_detallecarrito', 'app_api_producto'): {
                'type': 'INNER JOIN',
                'on': 'app_api_detallecarrito.producto_id = app_api_producto.id',
                'reverse_on': 'app_api_producto.id = app_api_detallecarrito.producto_id'
            },
            ('app_api_carrito', 'app_api_user'): {
                'type': 'INNER JOIN',
                'on': 'app_api_carrito.usuario_id = app_api_user.id',
                'reverse_on': 'app_api_user.id = app_api_carrito.usuario_id'
            },
            ('app_api_pago', 'app_api_carrito'): {
                'type': 'INNER JOIN',
                'on': 'app_api_pago.carrito_id = app_api_carrito.id',
                'reverse_on': 'app_api_carrito.id = app_api_pago.carrito_id'
            },
            ('app_api_garantia', 'app_api_producto'): {
                'type': 'INNER JOIN',
                'on': 'app_api_garantia.producto_id = app_api_producto.id',
                'reverse_on': 'app_api_producto.id = app_api_garantia.producto_id'
            },
            ('app_api_garantia', 'app_api_user'): {
                'type': 'INNER JOIN',
                'on': 'app_api_garantia.usuario_id = app_api_user.id',
                'reverse_on': 'app_api_user.id = app_api_garantia.usuario_id'
            },
            ('app_api_mantenimiento', 'app_api_user'): {
                'type': 'INNER JOIN',
                'on': 'app_api_mantenimiento.usuario_id = app_api_user.id',
                'reverse_on': 'app_api_user.id = app_api_mantenimiento.usuario_id'
            },
            ('app_api_mantenimiento', 'app_api_producto'): {
                'type': 'INNER JOIN',
                'on': 'app_api_mantenimiento.producto_id = app_api_producto.id',
                'reverse_on': 'app_api_producto.id = app_api_mantenimiento.producto_id'
            },
            ('app_api_descuento', 'app_api_producto'): {
                'type': 'INNER JOIN',
                'on': 'app_api_descuento.producto_id = app_api_producto.id',
                'reverse_on': 'app_api_producto.id = app_api_descuento.producto_id'
            },
            ('app_api_factura', 'app_api_venta'): {
                'type': 'INNER JOIN',
                'on': 'app_api_factura.venta_id = app_api_venta.id',
                'reverse_on': 'app_api_venta.id = app_api_factura.venta_id'
            },
            ('app_api_galeria', 'app_api_producto'): {
                'type': 'INNER JOIN',
                'on': 'app_api_galeria.producto_id = app_api_producto.id',
                'reverse_on': 'app_api_producto.id = app_api_galeria.producto_id'
            },
            ('app_api_userrol', 'app_api_user'): {
                'type': 'INNER JOIN',
                'on': 'app_api_userrol.user_id = app_api_user.id',
                'reverse_on': 'app_api_user.id = app_api_userrol.user_id'
            },
            ('app_api_userrol', 'app_api_rol'): {
                'type': 'INNER JOIN',
                'on': 'app_api_userrol.rol_id = app_api_rol.id',
                'reverse_on': 'app_api_rol.id = app_api_userrol.rol_id'
            },
            ('app_api_rolpermiso', 'app_api_rol'): {
                'type': 'INNER JOIN',
                'on': 'app_api_rolpermiso.rol_id = app_api_rol.id',
                'reverse_on': 'app_api_rol.id = app_api_rolpermiso.rol_id'
            },
            ('app_api_rolpermiso', 'app_api_permiso'): {
                'type': 'INNER JOIN',
                'on': 'app_api_rolpermiso.permiso_id = app_api_permiso.id',
                'reverse_on': 'app_api_permiso.id = app_api_rolpermiso.permiso_id'
            },
        }
        
    def extraer_filtros(self, texto: str) -> list:
        """ Extrae los filtros de un texto WHERE con operadores mejorados """
        try:
            filtros = []
            texto_lower = texto.lower()
            
            # Patrones mejorados para diferentes tipos de condiciones
            # IMPORTANTE: Ordenar de más específico a menos específico
            patterns = [
                # Patrón para LIKE (contiene, incluye)
                (r'(\w+)\s+(?:contiene|incluye|contenga|incluya)\s+["\']?([^"\']+)["\']?', 'LIKE'),
                # Patrón para IN (en, dentro de)
                (r'(\w+)\s+(?:en|dentro de|este en)\s+\(([^)]+)\)', 'IN'),
                # Patrón para BETWEEN
                (r'(\w+)\s+(?:entre)\s+(\d+)\s+(?:y)\s+(\d+)', 'BETWEEN'),
                # Patrón para IS NULL / IS NOT NULL
                (r'(\w+)\s+(?:es|sea|este)\s+(?:nulo|null|vacio)', 'IS NULL'),
                (r'(\w+)\s+(?:no es|no sea)\s+(?:nulo|null|vacio)', 'IS NOT NULL'),
                # Operadores de comparación con palabras (más específicos primero)
                (r'(\w+)\s+(?:con|con\s+)?(?:mayor\s+o\s+igual|mayor\s+igual)\s+(?:que|a)\s+(\d+(?:\.\d+)?)', '>='),
                (r'(\w+)\s+(?:con|con\s+)?(?:menor\s+o\s+igual|menor\s+igual)\s+(?:que|a)\s+(\d+(?:\.\d+)?)', '<='),
                (r'(\w+)\s+(?:con|con\s+)?(?:mayor|superior)\s+(?:que|a)\s+(\d+(?:\.\d+)?)', '>'),
                (r'(\w+)\s+(?:con|con\s+)?(?:menor|inferior)\s+(?:que|a)\s+(\d+(?:\.\d+)?)', '<'),
                (r'(\w+)\s+(?:sea|este|es)\s+(?:mayor que|superior a|mas que|mayor a)\s+(["\']?[\w\s]+["\']?)', '>'),
                (r'(\w+)\s+(?:sea|este|es)\s+(?:menor que|inferior a|menos que|menor a)\s+(["\']?[\w\s]+["\']?)', '<'),
                (r'(\w+)\s+(?:sea|este|es)\s+(?:mayor o igual|mayor igual)\s+(?:que|a)\s+(["\']?[\w\s]+["\']?)', '>='),
                (r'(\w+)\s+(?:sea|este|es)\s+(?:menor o igual|menor igual)\s+(?:que|a)\s+(["\']?[\w\s]+["\']?)', '<='),
                (r'(\w+)\s+(?:sea|este|es)\s+(?:diferente|distinto)\s+(?:de|a)\s+(["\']?[\w\s]+["\']?)', '!='),
                (r'(\w+)\s+(?:sea|este|es)\s+(?:igual a|igual que)\s+(["\']?[\w\s]+["\']?)', '='),
                # Operadores simbólicos
                (r'(\w+)\s*(>=)\s*(\d+(?:\.\d+)?)', '>='),
                (r'(\w+)\s*(<=)\s*(\d+(?:\.\d+)?)', '<='),
                (r'(\w+)\s*(!=|<>)\s*(\d+(?:\.\d+)?)', '!='),
                (r'(\w+)\s*(>)\s*(\d+(?:\.\d+)?)', '>'),
                (r'(\w+)\s*(<)\s*(\d+(?:\.\d+)?)', '<'),
                (r'(\w+)\s*(=)\s*(["\']?[\w\s]+["\']?)', '='),
                # Patrón simple "filtrar por campo = valor"
                (r'filtrar\s+por\s+(\w+)\s*=\s*(["\']?[\w\s]+["\']?)', '='),
            ]
            
            for pattern, operator in patterns:
                matches = re.findall(pattern, texto_lower)
                for match in matches:
                    if operator == 'BETWEEN' and len(match) == 3:
                        campo, valor1, valor2 = match
                        campo_real = self.field_mapping.get(campo, campo)
                        filtros.append({
                            'field': campo_real,
                            'operator': 'BETWEEN',
                            'value': [valor1.strip(), valor2.strip()]
                        })
                    elif operator == 'IN' and len(match) == 2:
                        campo, valores = match
                        campo_real = self.field_mapping.get(campo, campo)
                        valores_lista = [v.strip().strip('"\'') for v in valores.split(',')]
                        filtros.append({
                            'field': campo_real,
                            'operator': 'IN',
                            'value': valores_lista
                        })
                    elif operator in ['IS NULL', 'IS NOT NULL']:
                        campo = match[0] if isinstance(match, tuple) else match
                        campo_real = self.field_mapping.get(campo, campo)
                        filtros.append({
                            'field': campo_real,
                            'operator': operator,
                            'value': None
                        })
                    elif len(match) >= 2:
                        campo = match[0]
                        valor = match[-1]  # Último elemento es el valor
                        campo_real = self.field_mapping.get(campo, campo)
                        valor_limpio = valor.strip('"\'').strip()
                        
                        # Detectar si el valor contiene wildcards para LIKE
                        if operator == 'LIKE' or '%' in valor_limpio:
                            if not valor_limpio.startswith('%'):
                                valor_limpio = f'%{valor_limpio}'
                            if not valor_limpio.endswith('%'):
                                valor_limpio = f'{valor_limpio}%'
                        
                        filtros.append({
                            'field': campo_real,
                            'operator': operator,
                            'value': valor_limpio
                        })
            
            # Eliminar duplicados manteniendo el orden
            filtros_unicos = []
            vistos = set()
            for filtro in filtros:
                filtro_key = (filtro['field'], filtro['operator'], str(filtro['value']))
                if filtro_key not in vistos:
                    vistos.add(filtro_key)
                    filtros_unicos.append(filtro)
            
            return filtros_unicos
        except Exception as e:
            raise Exception(f"No se pudo extraer los filtros: {e}")
        
    def extraer_agregaciones(self, texto: str) -> list:
        """ Extrae las agregaciones de un texto con más funciones """
        try:
            agregaciones = []
            texto_lower = texto.lower()
            
            patterns = {
                'SUM': [
                    r'(?:suma|total|sumar|sumatorio)\s+(?:de\s+)?(?:la\s+)?(?:columna\s+)?(\w+)',
                    r'(?:cuanto es|cual es)\s+(?:la\s+)?(?:suma|total)\s+(?:de\s+)?(\w+)',
                ],
                'AVG': [
                    r'(?:promedio|media|average)\s+(?:de\s+)?(?:la\s+)?(?:columna\s+)?(\w+)',
                    r'(?:cuanto es|cual es)\s+(?:el\s+)?(?:promedio|media)\s+(?:de\s+)?(\w+)',
                ],
                'COUNT': [
                    r'(?:contar|cuenta|cantidad|numero|total|cuantos|cuantas)\s+(?:de\s+)?(?:los\s+)?(?:las\s+)?(\w+)',
                    r'(?:cuantos|cuantas)\s+(\w+)\s+(?:hay|existen|tenemos)',
                ],
                'MAX': [
                    r'(?:maximo|maxima|mayor|max|el mas alto|la mas alta)\s+(?:de\s+)?(?:la\s+)?(?:columna\s+)?(\w+)',
                    r'(?:cual es|cuanto es)\s+(?:el\s+)?(?:maximo|mayor|valor mas alto)\s+(?:de\s+)?(\w+)',
                ],
                'MIN': [
                    r'(?:minimo|minima|menor|min|el mas bajo|la mas baja)\s+(?:de\s+)?(?:la\s+)?(?:columna\s+)?(\w+)',
                    r'(?:cual es|cuanto es)\s+(?:el\s+)?(?:minimo|menor|valor mas bajo)\s+(?:de\s+)?(\w+)',
                ],
                'STDDEV': [
                    r'(?:desviacion estandar|desviacion|stddev)\s+(?:de\s+)?(\w+)',
                ],
                'VARIANCE': [
                    r'(?:varianza|variance)\s+(?:de\s+)?(\w+)',
                ],
            }
            
            for func, pattern_list in patterns.items():
                for pattern in pattern_list:
                    matches = re.findall(pattern, texto_lower)
                    for field in matches:
                        field_clean = field.strip()
                        campo_real = self.field_mapping.get(field_clean, field_clean)
                        
                        # Evitar duplicados
                        if not any(agg['field'] == campo_real and agg['func'] == func for agg in agregaciones):
                            agregaciones.append({
                                'func': func,
                                'field': campo_real,
                                'alias': f'{func.lower()}_{campo_real}'
                            })
            
            return agregaciones
        except Exception as e:
            raise Exception(f"No se pudo extraer las agregaciones: {e}")

    def extraer_agrupamientos(self, texto: str) -> list:
        """ Extrae los agrupamientos de un texto GROUP BY """
        try:
            texto_lower = texto.lower()
            
            patterns = [
                # Patrón para "agrupado por X"
                r'(?:agrupado|agrupada|agrupados|agrupadas)\s+por\s+(\w+(?:\s*,\s*\w+)*)',
                # Patrón para "agrupar por X"
                r'(?:agrupar|agrupar por|group by)\s+(?:por|en|by|de|para)?\s+(\w+(?:\s*,\s*\w+)*)',
                # Patrón para "por cada X"
                r'(?:por cada|para cada|por)\s+(\w+(?:\s+y\s+\w+)*)',
                # Patrón para "separar/dividir por X"
                r'(?:separar|dividir)\s+(?:por|en)\s+(\w+(?:\s*,\s*\w+)*)',
            ]

            for pattern in patterns:
                match = re.search(pattern, texto_lower)
                if match:
                    campos_texto = match.group(1)
                    # Separar por comas o "y"
                    campos = re.split(r'[,y]', campos_texto)
                    campos_reales = []
                    for campo in campos:
                        campo_clean = campo.strip()
                        if campo_clean:
                            campo_real = self.field_mapping.get(campo_clean, campo_clean)
                            if campo_real not in campos_reales:
                                campos_reales.append(campo_real)
                    
                    if campos_reales:
                        return campos_reales
            
            return []
        except Exception as e:
            raise Exception(f"No se pudo extraer los agrupamientos: {e}")
    
    def extraer_ordenamientos(self, texto: str) -> list:
        """ Extrae los ordenamientos de un texto ORDER BY """
        try:
            ordenamientos = []
            texto_lower = texto.lower()
            
            # Patrón mejorado para "ordenar por campo direccion"
            pattern1 = r'ordenar\s+por\s+(\w+(?:\s*,\s*\w+)*)\s+(ascendente|descendente|asc|desc)?'
            matches = re.findall(pattern1, texto_lower)
            for campos_texto, direccion in matches:
                campos = [c.strip() for c in campos_texto.split(',')]
                for campo in campos:
                    if campo:
                        order = 'DESC' if direccion and 'desc' in direccion else 'ASC'
                        campo_real = self.field_mapping.get(campo, campo)
                        if not any(o['field'] == campo_real for o in ordenamientos):
                            ordenamientos.append({'field': campo_real, 'order': order})
            
            # Patrón para "de mayor a menor campo"
            patterns_desc = [
                r'(?:de\s+)?(?:mayor a menor|de mayor a menor|descendente)\s+(?:por\s+)?(\w+)',
                r'(\w+)\s+(?:de mayor a menor|descendente)',
            ]
            for pattern in patterns_desc:
                matches = re.findall(pattern, texto_lower)
                for campo in matches:
                    campo_real = self.field_mapping.get(campo, campo)
                    if not any(o['field'] == campo_real for o in ordenamientos):
                        ordenamientos.append({'field': campo_real, 'order': 'DESC'})
            
            # Patrón para "de menor a mayor campo"
            patterns_asc = [
                r'(?:de\s+)?(?:menor a mayor|de menor a mayor|ascendente)\s+(?:por\s+)?(\w+)',
                r'(\w+)\s+(?:de menor a mayor|ascendente)',
            ]
            for pattern in patterns_asc:
                matches = re.findall(pattern, texto_lower)
                for campo in matches:
                    campo_real = self.field_mapping.get(campo, campo)
                    if not any(o['field'] == campo_real for o in ordenamientos):
                        ordenamientos.append({'field': campo_real, 'order': 'ASC'})
                    
            return ordenamientos
        except Exception as e:
            raise Exception(f"No se pudo extraer los ordenamientos: {e}")
        
    def extraer_limites(self, texto: str) -> int | None:
        """ Extrae los limites de un texto LIMIT """
        try:
            texto_lower = texto.lower()
            
            patterns = [
                r'(?:top|primeros?|ultimos?)\s+(\d+)',
                r'limit(?:ar)?\s+(?:a\s+)?(\d+)',
                r'(?:devolver|mostrar|traer)\s+(?:solo\s+)?(\d+)',
                r'(?:maximo|como maximo|hasta)\s+(\d+)',
                r'(\d+)\s+(?:registros|filas|resultados)',
            ]
            
            for pattern in patterns:
                match = re.search(pattern, texto_lower)
                if match:
                    return int(match.group(1))
            
            return None
        except Exception as e:
            raise Exception(f"No se pudo extraer los limites: {e}")
        
    from collections import deque

    def _buscar_camino(self, origen, destino):
        """Devuelve el camino de tablas desde origen hasta destino, si existe."""
        grafo = {}

        # Crear grafo no dirigido a partir de self.relations
        for (a, b) in self.relations.keys():
            grafo.setdefault(a, set()).add(b)
            grafo.setdefault(b, set()).add(a)

        visitados = set()
        cola = deque([(origen, [origen])])

        while cola:
            actual, camino = cola.popleft()
            if actual == destino:
                return camino  # Ej: ['venta', 'carrito', 'detallecarrito', 'producto']
            for vecino in grafo.get(actual, []):
                if vecino not in visitados:
                    visitados.add(vecino)
                    cola.append((vecino, camino + [vecino]))
        return None

    def extraer_joins(self, texto: str) -> list:
        """ Detecta y extrae los JOIN entre tablas de manera inteligente """
        try:
            joins = []
            tablas = self.extraer_tablas(texto)
            
            if len(tablas) < 2:
                return []
            
            # Generar todas las combinaciones posibles de joins
            tablas_procesadas = set()
            tabla_principal = tablas[0]
            tablas_procesadas.add(tabla_principal)
            
            # Algoritmo para encontrar el camino de joins
            for tabla_secundaria in tablas[1:]:
                # Si la tabla secundaria ya fue procesada, saltar
                if tabla_secundaria in tablas_procesadas:
                    continue
                
                # Buscar join directo
                join_key = (tabla_principal, tabla_secundaria)
                reverse_join_key = (tabla_secundaria, tabla_principal)
                
                if join_key in self.relations:
                    joins.append({
                        'table': tabla_secundaria,
                        'type': self.relations[join_key]['type'],
                        'on': self.relations[join_key]['on']
                    })
                    tablas_procesadas.add(tabla_secundaria)
                elif reverse_join_key in self.relations:
                    joins.append({
                        'table': tabla_secundaria,
                        'type': self.relations[reverse_join_key]['type'],
                        'on': self.relations[reverse_join_key]['reverse_on']
                    })
                    tablas_procesadas.add(tabla_secundaria)
                else:
                    # Buscar join indirecto
                    camino = self._buscar_camino(tabla_principal, tabla_secundaria)
                    if camino and len(camino) > 1:
                        for i in range(len(camino) - 1):
                            t1, t2 = camino[i], camino[i + 1]
                            rel = self.relations.get((t1, t2)) or self.relations.get((t2, t1))
                            if rel:
                                joins.append({
                                    'table': t2,
                                    'type': rel['type'],
                                    'on': rel['on'] if (t1, t2) in self.relations else rel['reverse_on']
                                })
                        tablas_procesadas.update(camino)
            return joins
        except Exception as e:
            raise Exception(f"No se pudo extraer los joins: {e}")
        
    def extraer_havings(self, texto: str) -> list:
        """ Extrae los havings de un texto (condiciones post-agregación) """
        try:
            having_conditions = []
            texto_lower = texto.lower()
            
            # Patrones mejorados
            patterns = [
                r'(?:donde|con|que|having)\s+(?:la\s+)?(?:el\s+)?(\w+)\s+(?:sea|este|es)\s+(superior|inferior|mayor|menor|igual|menor o igual|mayor o igual|menor igual|mayor igual|distinto|diferente)\s+(?:a|que|de)\s+(\d+(?:\.\d+)?)',
                r'(?:suma|total|promedio|count|max|min)\s+(?:sea\s+)?(?:es\s+)?(superior|inferior|mayor|menor|igual|menor o igual|mayor o igual|distinto|diferente)\s+(?:a|que|de)\s+(\d+(?:\.\d+)?)',
                r'(?:con|que|donde)\s+(?:un\s+)?(?:una\s+)?(?:suma|total|promedio|cantidad)\s+(?:de\s+)?(\w+)?\s*(>|<|=|>=|<=|!=)\s*(\d+(?:\.\d+)?)',
            ]
            
            ops_map = {
                'superior': '>', 'mayor': '>',
                'inferior': '<', 'menor': '<',
                'igual': '=',
                'menor o igual': '<=', 'menor igual': '<=',
                'mayor o igual': '>=', 'mayor igual': '>=',
                'distinto': '!=', 'diferente': '!=',
                '>': '>', '<': '<', '=': '=',
                '>=': '>=', '<=': '<=', '!=': '!=',
            }

            for pattern in patterns:
                matches = re.findall(pattern, texto_lower)
                for match in matches:
                    if len(match) == 3:
                        field, op, value = match
                        field_real = self.field_mapping.get(field, field) if field else None
                        
                        if not any(h['field'] == field_real and h['value'] == value for h in having_conditions):
                            having_conditions.append({
                                'field': field_real,
                                'op': ops_map.get(op, '='),
                                'value': value
                            })
                    elif len(match) == 2:
                        op, value = match
                        having_conditions.append({
                            'field': None,  # Se inferirá del contexto
                            'op': ops_map.get(op, '='),
                            'value': value
                        })
            
            return having_conditions
        except Exception as e:
            raise Exception(f"No se pudo extraer los havings: {e}")

    def extraer_atributos(self, texto: str) -> list:
        """Extrae los atributos/campos a seleccionar"""
        try:
            fields = []
            texto_lower = texto.lower().strip()
            
            # 1. Detección rápida de SELECT *
            select_all_keywords = ['todo', 'todos', 'todas', 'completo', 'completa', '*', 'toda la información', 'todos los campos', 'todos los datos']
            if any(keyword in texto_lower for keyword in select_all_keywords):
                return ['*']
            
            # 2. Palabras que indican que NO hay campos específicos a seleccionar
            # (son palabras de contexto, no campos)
            palabras_contexto = [
                'reporte', 'reportes', 'informe', 'informes', 'resumen', 'resúmenes',
                'mes', 'meses', 'año', 'años', 'semana', 'semanas', 'día', 'días',
                'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
                'quiero', 'necesito', 'deseo', 'pido', 'solicito', 'requiero',
                'un', 'una', 'unos', 'unas', 'el', 'la', 'los', 'las',
                'de', 'del', 'desde', 'hasta', 'entre', 'por', 'para', 'con', 'sin',
                'agrupado', 'agrupada', 'agrupados', 'agrupadas', 'agrupar',
                'ordenado', 'ordenada', 'ordenados', 'ordenadas', 'ordenar',
                'filtrado', 'filtrada', 'filtrados', 'filtradas', 'filtrar',
            ]
            
            # 3. Patrones optimizados para extracción de campos ESPECÍFICOS
            patterns = [
                # Patrón para "mostrar campo1, campo2 y campo3" (ANTES de palabras de contexto)
                r"(?:mostrar|muestre|ver|seleccionar|select|dame|traer|obtener|listar|consultar)\s+(?:el\s+|la\s+|los\s+|las\s+)?([^.?¿!]+?)(?:\s+(?:de|donde|order|limit|por|con|para|agrupado|agrupar))",
                
                # Patrón para "campos: campo1, campo2"
                r"(?:campos?|atributos?|columnas?|datos?)\s*[:\-]?\s*([^.?¿!]+?)(?:\s+|$)",
                
                # Patrón para "quiero ver campo1, campo2"
                r"(?:quiero|necesito|deseo)\s+(?:ver|conocer|saber)\s+([^.?¿!]+?)(?:\s+(?:de|donde|$))",
            ]

            # 4. Extracción usando patrones
            for pattern in patterns:
                matches = re.findall(pattern, texto_lower)
                for match in matches:
                    if not match.strip():
                        continue
                        
                    fields_text = match.strip()
                    
                    # Separar campos por diferentes delimitadores
                    separators = r'[,;]|\s+y\s+|\s+o\s+|\s+con\s+|\s+e\s+'
                    potential_fields = re.split(separators, fields_text)
                    
                    for field in potential_fields:
                        field_clean = field.strip()
                        
                        # Filtrar campos vacíos o muy cortos
                        if not field_clean or len(field_clean) < 2:
                            continue
                        
                        # Saltar palabras de contexto
                        if field_clean in palabras_contexto:
                            continue
                        
                        # Limpiar artículos y palabras comunes
                        common_words = ['el', 'la', 'los', 'las', 'un', 'una', 'unos', 'unas', 'de', 'del']
                        for word in common_words:
                            field_clean = re.sub(rf'\b{word}\b', '', field_clean)
                        
                        field_clean = re.sub(r'\s+', ' ', field_clean).strip()
                        
                        if field_clean and len(field_clean) >= 2 and field_clean not in palabras_contexto:
                            # Buscar en el field_mapping
                            campo_real = self._buscar_campo_en_mapeo(field_clean)
                            if campo_real and campo_real not in fields and campo_real not in palabras_contexto:
                                fields.append(campo_real)

            # 5. Si encontramos campos específicos, usarlos
            if fields:
                return list(set(fields))
            
            # 6. Búsqueda directa de campos mencionados en el texto
            fields_directos = self._buscar_campos_por_mencion_directa(texto_lower)
            if fields_directos:
                return fields_directos
            
            # 7. Lógica inteligente para consultas generales
            return self._decidir_campos_para_consulta_general(texto_lower)
            
        except Exception as e:
            raise Exception(f"No se pudo extraer los atributos: {e}")
        
    def _buscar_campo_en_mapeo(self, campo_texto: str) -> str:
        """Busca un campo en el mapeo con diferentes estrategias"""
        # Busqueda exacta
        if campo_texto in self.field_mapping:
            return self.field_mapping[campo_texto]
        
        # Busqueda por sinónimos en español/inglés
        for key, value in self.field_mapping.items():
            if key == campo_texto:
                return value
        
        # Busqueda por palabras clave (para campos compuestos)
        palabras_clave = campo_texto.split()
        for palabra in palabras_clave:
            if palabra in self.field_mapping:
                return self.field_mapping[palabra]
        
        # Si no se encuentra, devolver el texto original
        return campo_texto

    def _buscar_campos_por_mencion_directa(self, texto_lower: str) -> list:
        """Busca campos mencionados directamente en el texto"""
        fields_found = []
        
        # Lista de campos principales para búsqueda directa
        campos_principales = [
            'id', 'nombre', 'precio', 'stock', 'codigo', 'marca', 'total', 
            'descuento', 'cantidad', 'email', 'username', 'first_name', 'last_name',
            'born_date', 'gender', 'categoria', 'descripcion', 'monto', 'estado',
            'moneda', 'tipo', 'valor', 'fecha_inicio', 'fecha_fin', 'fecha_programada',
            'created_at', 'updated_at', 'nit', 'fecha_expendida'
        ]
        
        for campo in campos_principales:
            if re.search(rf'\b{re.escape(campo)}\b', texto_lower):
                campo_real = self.field_mapping.get(campo, campo)
                if campo_real not in fields_found:
                    fields_found.append(campo_real)
        
        return fields_found

    def _decidir_campos_para_consulta_general(self, texto_lower: str) -> list:
        """Decide qué campos devolver para consultas generales como 'Mostrar usuarios'"""
        
        # Primero intentar inferir por tabla mencionada
        campos_inferidos = self._inferir_campos_por_tabla(texto_lower)
        if campos_inferidos:
            return campos_inferidos
        
        # Consultas que claramente penden datos generales
        consultas_generales = ['mostrar', 'ver', 'traer', 'dame', 'listar', 'consultar', 'obtener']
        
        # Si es una consulta general sin especificaciones, usar campos básicos
        if any(consulta in texto_lower for consulta in consultas_generales):
            # Campos básicos por defecto para cualquier consulta
            return ['id', 'nombre', 'created_at']
        
        # Por defecto, usar SELECT * solo como última opción
        return ['*']

    def _inferir_campos_por_tabla(self, texto_lower: str) -> list:
        """Infere campos apropiados basado en la tabla mencionada"""
        campousuario = [
            'app_api_user.id',
            'app_api_user.username',
            'app_api_user.email',
            'app_api_user.first_name',
            'app_api_user.last_name',
            'app_api_user.born_date',
            'app_api_user.gender'
        ]
        campoproducto = [
            'app_api_producto.id',
            'app_api_producto.nombre',
            'app_api_producto.precio',
            'app_api_producto.stock',
            'app_api_producto.codigo',
            'app_api_producto.marca',
            'app_api_producto.categoria_id',
        ]
        campocategoria =[
            'app_api_categoria.id',
            'app_api_categoria.nombre',
            'app_api_categoria.descripcion',
        ]
        campocarrito = [
            'app_api_carrito.id',
            'app_api_carrito.usuario_id',
            'app_api_carrito.total',
            'app_api_carrito.descuento',
            'app_api_carrito.created_at',
        ]
        campodetallecarrito = [
            'app_api_detalle_carrito.id',
            'app_api_detalle_carrito.carrito_id',
            'app_api_detalle_carrito.producto_id',
            'app_api_detalle_carrito.cantidad',
            'app_api_detalle_carrito.descuento',
        ]
        campopago = [
            'app_api_pago.id', 
            'app_api_pago.monto', 
            'app_api_pago.moneda', 
            'app_api_pago.estado', 
            'app_api_pago.carrito_id', 
            'app_api_pago.payment_method_id', 
            'app_api_pago.payment_intent'
        ]
        campoventa = [
            'app_api_venta.id', 
            'app_api_venta.carrito_id', 
            'app_api_venta.pago_id', 
            'app_api_venta.created_at'
        ]
        campofactura = [
            'app_api_factura.id',
            'app_api_factura.venta_id',
            'app_api_factura.fecha_expendida',
            'app_api_factura.nit'
        ]
        campodescuento = [
            'app_api_descuento.id', 
            'app_api_descuento.tipo', 
            'app_api_descuento.producto_id', 
            'app_api_descuento.valor', 
            'app_api_descuento.fecha_inicio', 
            'app_api_descuento.fecha_fin'
        ]
        campogarantia = [
            'app_api_garantia.id', 
            'app_api_garantia.producto_id', 
            'app_api_garantia.usuario_id', 
            'app_api_garantia.precio', 
            'app_api_garantia.fecha_inicio', 
            'app_api_garantia.fecha_fin', 
            'app_api_garantia.descripcion', 
            'app_api_garantia.estado'
        ]
        campomantenimiento = [
            'app_api_mantenimiento.id', 
            'app_api_mantenimiento.producto_id', 
            'app_api_mantenimiento.precio', 
            'app_api_mantenimiento.fecha_programada', 
            'app_api_mantenimiento.estado', 
            'app_api_mantenimiento.usuario_id'
        ]
        campogaleria = [
            'app_api_galeria.id', 
            'app_api_galeria.producto_id', 
            'app_api_galeria.imagen'
        ]
        camporol = [
            'app_api_rol.id', 
            'app_api_rol.nombre', 
            'app_api_rol.descripcion'
        ]
        campousuario_rol = [
            'app_api_usuario_rol.id', 
            'app_api_usuario_rol.usuario_id', 
            'app_api_usuario_rol.rol_id'
        ]
        campopermiso = [
            'app_api_permiso.id', 
            'app_api_permiso.nombre', 
            'app_api_permiso.descripcion'
        ]
        camporol_permiso = [
            'app_api_rol_permiso.id', 
            'app_api_rol_permiso.rol_id', 
            'app_api_rol_permiso.permiso_id'
        ]
        camposml = [
            'app_api_mlmodel.id', 
            'app_api_mlmodel.name', 
            'app_api_mlmodel.version', 
            'app_api_mlmodel.description'
        ]
        # Mapeo de campos por defecto para cada tabla basado en los modelos reales
        campos_por_defecto = {
            # Usuario / Cliente
            'usuario': campousuario,
            'user': campousuario,
            'cliente': campousuario,
            'customer': campousuario,
            
            # Producto
            'producto': campoproducto,
            'product': campoproducto,
            
            # Categoría
            'categoria': campocategoria,
            'category': campocategoria,
            
            # Carrito
            'carrito': campocarrito,
            'cart': campocarrito,
            
            # DetalleCarrito
            'detallecarrito': campodetallecarrito,
            'detalle': campodetallecarrito,
            'detail': campodetallecarrito,
            
            # Pago
            'pago': campopago,
            'payment': campopago,
            
            # Venta
            'venta': campoventa,
            'sale': campoventa,
            
            # Factura
            'factura': campofactura,
            'invoice': campofactura,
            
            # Descuento
            'descuento': campodescuento,
            'discount': campodescuento,
            
            # Garantía
            'garantia': campogarantia,
            'warranty': campogarantia,
            
            # Mantenimiento
            'mantenimiento': campomantenimiento,
            'maintenance': campomantenimiento,
            
            # Galería
            'galeria': campogaleria,
            'gallery': campogaleria,
            'imagenes': campogaleria,
            
            # Rol
            'rol': camporol,
            'role': camporol,
            
            # Permiso
            'permiso': campopermiso,
            'permission': campopermiso,
            
            # RolPermiso
            'rolpermiso': camporol_permiso,
            'rolepermission': camporol_permiso,
            
            # UserRol
            'userrol': campousuario_rol,
            'userrole': campousuario_rol,
            
            # MLmodel
            'mlmodel': camposml,
        }
        tablas: list[str] = self.extraer_tablas(texto_lower)
        atributos = []
        for tabla in tablas:
            for key, value in campos_por_defecto.items():
                if tabla.replace('app_api_', '') == key:
                    for campo in value:
                        atributos.append(campo)
        return atributos
        
    def extraer_fechas(self, texto: str) -> dict | None:
        """ Extrae rangos de fechas con mejor manejo de formatos """
        try:
            texto_lower = texto.lower()

            # tablas para referenciar el created_at
            tablas = self.extraer_tablas(texto)

            # Patrón para "desde...hasta..."
            pattern_range = r'desde\s+(?:el|la\s+fecha)?\s*(.+?)\s+hasta\s+(?:el|la\s+fecha)?\s*(.+?)'
            match = re.search(pattern_range, texto_lower)

            if match:
                fecha1_str = match.group(1).strip()
                fecha2_str = match.group(2).strip()
                
                start = dateparser.parse(fecha1_str, languages=['es'])
                end = dateparser.parse(fecha2_str, languages=['es'])

                if start and end:
                    return {
                        'start': start.strftime('%Y-%m-%d'),
                        'end': end.strftime('%Y-%m-%d'),
                        'field': f'{tablas[0].lower()}.created_at'  # Campo por defecto
                    }
            
            # Patrón para "entre...y..."
            pattern_between = r'entre\s+(?:el\s+)?(.+?)\s+y\s+(?:el\s+)?(.+?)(?:\s|,|$|de\s+|donde\s+)'
            match = re.search(pattern_between, texto_lower)
            
            if match:
                fecha1_str = match.group(1).strip()
                fecha2_str = match.group(2).strip()
                
                start = dateparser.parse(fecha1_str, languages=['es'])
                end = dateparser.parse(fecha2_str, languages=['es'])

                if start and end:
                    return {
                        'start': start.strftime('%Y-%m-%d'),
                        'end': end.strftime('%Y-%m-%d'),
                        'field': f'{tablas[0].lower()}.created_at'
                    }
            
            # Patrón para "el mes de..."
            pattern_month = r'(?:el\s+|del\s+)?mes\s+(?:de\s+)?(\w+\s*)(?:de\s+|del\s+|en\s+|del\s+año\s+)?(\d{4})?'
            match = re.search(pattern_month, texto_lower)
            
            if match:
                month_str = match.group(1)
                year_str = match.group(2) if match.group(2) else str(datetime.now().year)
                
                date_str = f"{month_str} {year_str}"
                parsed_date = dateparser.parse(date_str, languages=['es'])
                
                if parsed_date:
                    # Primer y último día del mes
                    from calendar import monthrange
                    last_day = monthrange(parsed_date.year, parsed_date.month)[1]
                    
                    return {
                        'start': parsed_date.replace(day=1).strftime('%Y-%m-%d'),
                        'end': parsed_date.replace(day=last_day).strftime('%Y-%m-%d'),
                        'field': f'{tablas[0].lower()}.created_at'
                    }
            
            # Patrón para fechas individuales en formato dd/mm o dd/mm/yyyy
            date_pattern = r'\b(\d{1,2}[/-]\d{1,2}(?:[/-]\d{2,4})?)\b'
            dates = re.findall(date_pattern, texto)
            
            if len(dates) >= 2:
                start = dateparser.parse(dates[0], languages=['es'])
                end = dateparser.parse(dates[1], languages=['es'])
                if start and end:
                    return {
                        'start': start.strftime('%Y-%m-%d'),
                        'end': end.strftime('%Y-%m-%d'),
                        'field': f'{tablas[0].lower()}.created_at'
                    }
            elif len(dates) == 1:
                # Una sola fecha: buscar ese día específico
                date = dateparser.parse(dates[0], languages=['es'])
                if date:
                    return {
                        'start': date.strftime('%Y-%m-%d'),
                        'end': date.strftime('%Y-%m-%d'),
                        'field': f'{tablas[0].lower()}.created_at'
                    }
            
            # Patrones relativos (hoy, ayer, esta semana, etc.)
            relative_patterns = {
                r'\bhoy\b': 'today',
                r'\bayer\b': 'yesterday',
                r'\bantier\b': '2 days ago',
                r'\best[ea]\s+semana\b': 'this week',
                r'\bsemana\s+pasada\b': 'last week',
                r'\best[ea]\s+mes\b': 'this month',
                r'\bmes\s+pasado\b': 'last month',
                r'\best[ea]\s+año\b': 'this year',
                r'\baño\s+pasado\b': 'last year',
                r'\bultim[oa]s?\s+7\s+dias\b': 'last 7 days',
                r'\bultim[oa]s?\s+30\s+dias\b': 'last 30 days',
            }
            
            for pattern, relative_str in relative_patterns.items():
                if re.search(pattern, texto_lower):
                    parsed_date = dateparser.parse(relative_str, languages=['es'])
                    if parsed_date:
                        # Para rangos relativos, calcular inicio y fin
                        if 'week' in relative_str or 'semana' in pattern:
                            start_of_week = parsed_date - timedelta(days=parsed_date.weekday())
                            end_of_week = start_of_week + timedelta(days=6)
                            return {
                                'start': start_of_week.strftime('%Y-%m-%d'),
                                'end': end_of_week.strftime('%Y-%m-%d'),
                                'field': f'{tablas[0].lower()}.created_at'
                            }
                        elif 'month' in relative_str or 'mes' in pattern:
                            from calendar import monthrange
                            last_day = monthrange(parsed_date.year, parsed_date.month)[1]
                            return {
                                'start': parsed_date.replace(day=1).strftime('%Y-%m-%d'),
                                'end': parsed_date.replace(day=last_day).strftime('%Y-%m-%d'),
                                'field': f'{tablas[0].lower()}.created_at'
                            }
                        elif 'year' in relative_str or 'año' in pattern:
                            return {
                                'start': parsed_date.replace(month=1, day=1).strftime('%Y-%m-%d'),
                                'end': parsed_date.replace(month=12, day=31).strftime('%Y-%m-%d'),
                                'field': f'{tablas[0].lower()}.created_at'
                            }
                        elif 'days' in relative_str or 'dias' in pattern:
                            days_match = re.search(r'(\d+)', pattern)
                            if days_match:
                                days_ago = int(days_match.group(1))
                                end_date = datetime.now()
                                start_date = end_date - timedelta(days=days_ago)
                                return {
                                    'start': start_date.strftime('%Y-%m-%d'),
                                    'end': end_date.strftime('%Y-%m-%d'),
                                    'field': f'{tablas[0].lower()}.created_at'
                                }
                        else:
                            # Para fechas específicas (hoy, ayer)
                            return {
                                'start': parsed_date.strftime('%Y-%m-%d'),
                                'end': parsed_date.strftime('%Y-%m-%d'),
                                'field': f'{tablas[0].lower()}.created_at'
                            }
                    
            return None
        except Exception as e:
            raise Exception(f"No se pudo extraer las fechas: {e}")
        
    def extraer_tablas(self, texto: str) -> list:
        """ Extrae las tablas mencionadas en el texto """
        try:
            tablas = []
            texto_lower = texto.lower()

            # Buscar todas las tablas mencionadas
            for keyword, model in self.model_mapping.items():
                if re.search(rf'\b{keyword}\b', texto_lower):
                    if model not in tablas:
                        tablas.append(model)
            
            # Si no se encontró ninguna tabla, intentar inferir por contexto
            if not tablas:
                # Inferir por palabras clave de campos específicos
                field_to_table = {
                    'stock': 'app_api_producto',
                    'codigo': 'app_api_producto',
                    'marca': 'app_api_producto',
                    'nit': 'app_api_factura',
                    'monto': 'app_api_pago',
                    'moneda': 'app_api_pago',
                    'payment_method': 'app_api_pago',
                    'born_date': 'app_api_usuario',
                    'gender': 'app_api_usuario',
                }
                
                for field_keyword, table in field_to_table.items():
                    if field_keyword in texto_lower and table not in tablas:
                        tablas.append(table)
            return tablas
        except Exception as e:
            raise Exception(f"No se pudo extraer las tablas: {e}")
    
    def extraer_operadores_logicos(self, texto: str) -> list:
        """ Extrae operadores lógicos AND/OR para filtros compuestos """
        try:
            operadores = []
            texto_lower = texto.lower()
            
            # Detectar AND
            if re.search(r'\b(y|and)\b', texto_lower):
                operadores.append('AND')
            
            # Detectar OR
            if re.search(r'\b(o|or)\b', texto_lower):
                operadores.append('OR')
            
            return operadores
        except Exception as e:
            raise Exception(f"No se pudo extraer operadores lógicos: {e}")
    
    def detectar_subconsultas(self, texto: str) -> bool:
        """ Detecta si el texto requiere subconsultas """
        try:
            texto_lower = texto.lower()
            
            keywords_subquery = [
                'que tengan',
                'cuyos',
                'cuyas',
                'donde el',
                'donde la',
                'que esten en',
                'que no esten en',
                'que pertenezcan',
            ]
            
            return any(keyword in texto_lower for keyword in keywords_subquery)
        except Exception as e:
            return False
    
    def extraer_distinct(self, texto: str) -> bool:
        """ Detecta si se requiere DISTINCT """
        try:
            texto_lower = texto.lower()
            
            keywords_distinct = [
                'unicos',
                'unicas',
                'distintos',
                'distintas',
                'diferentes',
                'sin repetir',
                'sin duplicados',
                'distinct',
            ]
            
            return any(keyword in texto_lower for keyword in keywords_distinct)
        except Exception as e:
            return False
    
    def construir_query_completa(self, texto: str) -> dict:
        """ Método principal que extrae todos los componentes de una consulta """
        try:
            return {
                'tablas': self.extraer_tablas(texto),
                'atributos': self.extraer_atributos(texto),
                'filtros': self.extraer_filtros(texto),
                'joins': self.extraer_joins(texto),
                'agregaciones': self.extraer_agregaciones(texto),
                'agrupamientos': self.extraer_agrupamientos(texto),
                'havings': self.extraer_havings(texto),
                'ordenamientos': self.extraer_ordenamientos(texto),
                'limite': self.extraer_limites(texto),
                'fechas': self.extraer_fechas(texto),
                'distinct': self.extraer_distinct(texto),
                'operadores_logicos': self.extraer_operadores_logicos(texto),
                'requiere_subconsulta': self.detectar_subconsultas(texto),
            }
        except Exception as e:
            raise Exception(f"Error al construir query completa: {e}")