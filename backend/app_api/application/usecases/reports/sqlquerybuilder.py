import logging
from typing import List, Dict, Union, Optional, Any

logger = logging.getLogger(__name__)


class SQLQueryBuilder:
    """
    Constructor de consultas SQL dinámico, seguro y robusto
    Soporta: SELECT, FROM, JOIN, WHERE, GROUP BY, HAVING, ORDER BY, LIMIT, DISTINCT
    """
    
    def __init__(self):
        self.select_fields = []
        self.from_tables = []
        self.joins = []
        self.where_conditions = []
        self.where_logic_operator = 'AND'  # Operador lógico para WHERE
        self.group_by = []
        self.having_conditions = []
        self.order_by = []
        self.limit_value = None
        self.offset_value = None
        self.distinct_flag = False
        self.params = {}  # Para prepared statements
        self.param_counter = 0  # Contador para nombres únicos de parámetros
        self.aggregations = []  # Almacenar info de agregaciones
        
    def reset(self):
        """Reinicia el builder para reutilizarlo"""
        self.__init__()
        return self
    
    # ==================== SELECT ====================
    
    def select(self, fields: Union[str, List[str]]):
        """
        Añade campos SELECT
        
        Args:
            fields: Campo único o lista de campos
            
        Examples:
            .select('nombre')
            .select(['nombre', 'precio', 'stock'])
            .select('*')
        """
        if isinstance(fields, str):
            fields = [fields]
        
        for field in fields:
            if field not in self.select_fields:
                self.select_fields.append(field)
        
        logger.debug(f"SELECT fields añadidos: {fields}")
        return self
    
    def distinct(self, enabled: bool = True):
        """
        Activa/desactiva DISTINCT en el SELECT
        
        Args:
            enabled: True para activar DISTINCT
        """
        self.distinct_flag = enabled
        logger.debug(f"DISTINCT {'activado' if enabled else 'desactivado'}")
        return self
    
    def add_aggregation(self, agregaciones: List[Dict[str, str]]):
        """
        Añade funciones de agregación al SELECT
        
        Args:
            agregaciones: Lista de dicts con 'func', 'field', 'alias'
            
        Example:
            [
                {'func': 'SUM', 'field': 'precio', 'alias': 'sum_precio'},
                {'func': 'COUNT', 'field': 'id', 'alias': 'count_id'}
            ]
        """
        for agg in agregaciones:
            func = agg.get('func', 'COUNT').upper()
            field = agg.get('field', '*')
            alias = agg.get('alias', f"{func.lower()}_{field}")
            
            # Construir expresión de agregación
            field_expr = f"{func}({field}) AS {alias}"
            
            if field_expr not in self.select_fields:
                self.select_fields.append(field_expr)
                self.aggregations.append(agg)
        
        logger.debug(f"Agregaciones añadidas: {agregaciones}")
        return self
    
    def add_calculated_field(self, expression: str, alias: str):
        """
        Añade un campo calculado al SELECT
        
        Args:
            expression: Expresión SQL (ej: 'precio * cantidad')
            alias: Alias para el campo calculado
            
        Example:
            .add_calculated_field('precio * (1 - descuento/100)', 'precio_final')
        """
        field_expr = f"({expression}) AS {alias}"
        if field_expr not in self.select_fields:
            self.select_fields.append(field_expr)
        
        logger.debug(f"Campo calculado añadido: {field_expr}")
        return self
    
    # ==================== FROM & JOIN ====================
    
    def from_table(self, tablas: Union[str, List[str]]):
        """
        Define tabla(s) principal(es)
        
        Args:
            tablas: Tabla única o lista de tablas
        """
        if isinstance(tablas, str):
            tablas = [tablas]
        
        self.from_tables = tablas
        logger.debug(f"Tabla principal: {tablas[0]}")
        return self
    
    def add_join(self, joins: Union[Dict, List[Dict]]):
        """
        Añade uno o múltiples JOINs
        
        Args:
            joins: Dict o lista de dicts con 'table', 'type', 'on'
            
        Example:
            {
                'table': 'categoria',
                'type': 'INNER JOIN',
                'on': 'producto.categoria_id = categoria.id'
            }
        """
        if isinstance(joins, dict):
            joins = [joins]
        
        for join in joins:
            # Validar que no exista ya el mismo join
            join_exists = any(
                j['table'] == join['table'] and j['on'] == join['on'] 
                for j in self.joins
            )
            
            if not join_exists:
                self.joins.append(join)
                logger.debug(f"JOIN añadido: {join['type']} {join['table']}")
        
        return self
    
    def left_join(self, table: str, on: str):
        """Atajo para LEFT JOIN"""
        return self.add_join({
            'table': table,
            'type': 'LEFT JOIN',
            'on': on
        })
    
    def inner_join(self, table: str, on: str):
        """Atajo para INNER JOIN"""
        return self.add_join({
            'table': table,
            'type': 'INNER JOIN',
            'on': on
        })
    
    def right_join(self, table: str, on: str):
        """Atajo para RIGHT JOIN"""
        return self.add_join({
            'table': table,
            'type': 'RIGHT JOIN',
            'on': on
        })
    
    # ==================== WHERE ====================
    
    def where(self, conditions: Union[str, List[str]], logic_operator: str = 'AND'):
        """
        Añade condiciones WHERE
        
        Args:
            conditions: Condición única o lista de condiciones
            logic_operator: 'AND' u 'OR'
            
        Example:
            .where(['precio > 100', 'stock < 50'])
            .where('estado = "activo"')
        """
        if isinstance(conditions, str):
            conditions = [conditions]
        
        self.where_conditions.extend(conditions)
        self.where_logic_operator = logic_operator.upper()
        
        logger.debug(f"WHERE añadido: {conditions} con operador {logic_operator}")
        return self
    
    def where_equals(self, field: str, value: Any):
        """Atajo para condición de igualdad"""
        param_name = self._generate_param_name(field)
        self.where_conditions.append(f"{field} = %({param_name})s")
        self.params[param_name] = value
        return self
    
    def where_not_equals(self, field: str, value: Any):
        """Atajo para condición de desigualdad"""
        param_name = self._generate_param_name(field)
        self.where_conditions.append(f"{field} != %({param_name})s")
        self.params[param_name] = value
        return self
    
    def where_greater_than(self, field: str, value: Any):
        """Atajo para mayor que"""
        param_name = self._generate_param_name(field)
        self.where_conditions.append(f"{field} > %({param_name})s")
        self.params[param_name] = value
        return self
    
    def where_less_than(self, field: str, value: Any):
        """Atajo para menor que"""
        param_name = self._generate_param_name(field)
        self.where_conditions.append(f"{field} < %({param_name})s")
        self.params[param_name] = value
        return self
    
    def where_between(self, field: str, start: Any, end: Any):
        """Atajo para BETWEEN"""
        param_start = self._generate_param_name(f"{field}_start")
        param_end = self._generate_param_name(f"{field}_end")
        
        self.where_conditions.append(
            f"{field} BETWEEN %({param_start})s AND %({param_end})s"
        )
        self.params[param_start] = start
        self.params[param_end] = end
        return self
    
    def where_in(self, field: str, values: List[Any]):
        """Atajo para IN"""
        if not values:
            logger.warning(f"WHERE IN con lista vacía para campo {field}")
            return self
        
        placeholders = []
        for i, value in enumerate(values):
            param_name = self._generate_param_name(f"{field}_in_{i}")
            placeholders.append(f"%({param_name})s")
            self.params[param_name] = value
        
        self.where_conditions.append(
            f"{field} IN ({', '.join(placeholders)})"
        )
        return self
    
    def where_not_in(self, field: str, values: List[Any]):
        """Atajo para NOT IN"""
        if not values:
            logger.warning(f"WHERE NOT IN con lista vacía para campo {field}")
            return self
        
        placeholders = []
        for i, value in enumerate(values):
            param_name = self._generate_param_name(f"{field}_notin_{i}")
            placeholders.append(f"%({param_name})s")
            self.params[param_name] = value
        
        self.where_conditions.append(
            f"{field} NOT IN ({', '.join(placeholders)})"
        )
        return self
    
    def where_like(self, field: str, pattern: str):
        """Atajo para LIKE"""
        param_name = self._generate_param_name(f"{field}_like")
        self.where_conditions.append(f"{field} LIKE %({param_name})s")
        
        # Añadir wildcards si no los tiene
        if '%' not in pattern:
            pattern = f"%{pattern}%"
        
        self.params[param_name] = pattern
        return self
    
    def where_is_null(self, field: str):
        """Atajo para IS NULL"""
        self.where_conditions.append(f"{field} IS NULL")
        return self
    
    def where_is_not_null(self, field: str):
        """Atajo para IS NOT NULL"""
        self.where_conditions.append(f"{field} IS NOT NULL")
        return self
    
    def add_date_range(self, fechas: List[str], campo_fecha: str = 'created_at'):
        """
        Añade filtro de rango de fechas
        
        Args:
            fechas: Lista con [fecha_inicio, fecha_fin]
            campo_fecha: Nombre del campo de fecha
        """
        if fechas and len(fechas) >= 2:
            return self.where_between(campo_fecha, fechas[0], fechas[1])
        return self
    
    # ==================== GROUP BY ====================
    
    def group_by_fields(self, campos: Union[str, List[str]]):
        """
        Añade GROUP BY
        
        Args:
            campos: Campo único o lista de campos
        """
        if isinstance(campos, str):
            campos = [campos]
        
        for campo in campos:
            if campo not in self.group_by:
                self.group_by.append(campo)
        
        logger.debug(f"GROUP BY añadido: {campos}")
        return self
    
    # ==================== HAVING ====================
    
    def having(self, conditions: Union[Dict, List[Dict]]):
        """
        Añade condiciones HAVING
        
        Args:
            conditions: Dict o lista de dicts con 'field', 'operator', 'value'
            
        Example:
            [
                {'field': 'SUM(total)', 'operator': '>', 'value': 1000},
                {'field': 'COUNT(*)', 'operator': '>=', 'value': 5}
            ]
        """
        if isinstance(conditions, dict):
            conditions = [conditions]
        
        for cond in conditions:
            field = cond.get('field')
            operator = cond.get('operator', '=')
            value = cond.get('value')
            
            # Usar parámetro preparado para el valor
            param_name = self._generate_param_name(f"having_{field}")
            self.having_conditions.append(
                f"{field} {operator} %({param_name})s"
            )
            self.params[param_name] = value
        
        logger.debug(f"HAVING añadido: {conditions}")
        return self
    
    def having_greater_than(self, aggregate_field: str, value: Any):
        """Atajo para HAVING con mayor que"""
        return self.having({
            'field': aggregate_field,
            'operator': '>',
            'value': value
        })
    
    def having_less_than(self, aggregate_field: str, value: Any):
        """Atajo para HAVING con menor que"""
        return self.having({
            'field': aggregate_field,
            'operator': '<',
            'value': value
        })
    
    # ==================== ORDER BY ====================
    
    def order_by_fields(self, ordenamiento: Union[Dict, List[Dict]]):
        """
        Añade ORDER BY
        
        Args:
            ordenamiento: Dict o lista de dicts con 'field' y 'direction'/'order'
            
        Example:
            [
                {'field': 'precio', 'direction': 'DESC'},
                {'field': 'nombre', 'direction': 'ASC'}
            ]
        """
        if isinstance(ordenamiento, dict):
            ordenamiento = [ordenamiento]
        
        for order in ordenamiento:
            field = order.get('field')
            direction = order.get('direction') or order.get('order', 'ASC')
            direction = direction.upper()
            
            # Validar dirección
            if direction not in ['ASC', 'DESC']:
                direction = 'ASC'
            
            order_clause = f"{field} {direction}"
            
            if order_clause not in self.order_by:
                self.order_by.append(order_clause)
        
        logger.debug(f"ORDER BY añadido: {ordenamiento}")
        return self
    
    def order_by_asc(self, field: str):
        """Atajo para ORDER BY ascendente"""
        return self.order_by_fields({'field': field, 'direction': 'ASC'})
    
    def order_by_desc(self, field: str):
        """Atajo para ORDER BY descendente"""
        return self.order_by_fields({'field': field, 'direction': 'DESC'})
    
    # ==================== LIMIT & OFFSET ====================
    
    def limit(self, limite: int):
        """
        Añade LIMIT
        
        Args:
            limite: Número máximo de registros
        """
        if limite and limite > 0:
            self.limit_value = int(limite)
            logger.debug(f"LIMIT añadido: {limite}")
        return self
    
    def offset(self, offset: int):
        """
        Añade OFFSET (para paginación)
        
        Args:
            offset: Número de registros a saltar
        """
        if offset and offset >= 0:
            self.offset_value = int(offset)
            logger.debug(f"OFFSET añadido: {offset}")
        return self
    
    def paginate(self, page: int, per_page: int = 10):
        """
        Configura paginación
        
        Args:
            page: Número de página (empezando en 1)
            per_page: Registros por página
        """
        if page < 1:
            page = 1
        
        offset = (page - 1) * per_page
        return self.limit(per_page).offset(offset)
    
    # ==================== UTILIDADES ====================
    
    def _generate_param_name(self, base_name: str) -> str:
        """Genera un nombre único para parámetro"""
        # Limpiar caracteres especiales
        clean_name = ''.join(c if c.isalnum() or c == '_' else '_' for c in base_name)
        param_name = f"{clean_name}_{self.param_counter}"
        self.param_counter += 1
        return param_name
    
    def add_raw_condition(self, condition: str, params: Optional[Dict] = None):
        """
        Añade una condición SQL raw (usar con cuidado)
        
        Args:
            condition: Condición SQL como string
            params: Parámetros opcionales para la condición
        """
        self.where_conditions.append(condition)
        if params:
            self.params.update(params)
        
        logger.warning(f"Condición RAW añadida: {condition}")
        return self
    
    # ==================== BUILD ====================
    
    def build(self) -> str:
        """
        Construye la consulta SQL final
        
        Returns:
            String con la consulta SQL completa
            
        Raises:
            ValueError: Si falta información requerida
        """
        query_parts = []
        
        # 1. SELECT
        if not self.select_fields:
            raise ValueError("Debe especificar al menos un campo SELECT")
        
        select_keyword = "SELECT DISTINCT" if self.distinct_flag else "SELECT"
        select_clause = f"{select_keyword} {', '.join(self.select_fields)}"
        query_parts.append(select_clause)
        
        # 2. FROM
        if not self.from_tables:
            raise ValueError("Debe especificar al menos una tabla FROM")
        
        from_clause = f"FROM {', '.join(self.from_tables)}"
        query_parts.append(from_clause)
        
        # 3. JOINs
        if self.joins:
            for join in self.joins:
                join_clause = f"{join['type']} {join['table']} ON {join['on']}"
                query_parts.append(join_clause)
        
        # 4. WHERE
        if self.where_conditions:
            where_clause = f"WHERE {f' {self.where_logic_operator} '.join(self.where_conditions)}"
            query_parts.append(where_clause)
        
        # 5. GROUP BY
        if self.group_by:
            group_clause = f"GROUP BY {', '.join(self.group_by)}"
            query_parts.append(group_clause)
        
        # 6. HAVING
        if self.having_conditions:
            having_clause = f"HAVING {' AND '.join(self.having_conditions)}"
            query_parts.append(having_clause)
        
        # 7. ORDER BY
        if self.order_by:
            order_clause = f"ORDER BY {', '.join(self.order_by)}"
            query_parts.append(order_clause)
        
        # 8. LIMIT
        if self.limit_value:
            limit_clause = f"LIMIT {self.limit_value}"
            query_parts.append(limit_clause)
        
        # 9. OFFSET
        if self.offset_value:
            offset_clause = f"OFFSET {self.offset_value}"
            query_parts.append(offset_clause)
        
        query = ' '.join(query_parts)
        logger.info(f"Query construida: {query}")
        
        return query
    
    def build_with_params(self) -> tuple:
        """
        Construye la consulta y retorna con parámetros
        
        Returns:
            Tupla (query, params)
        """
        query = self.build()
        return query, self.params
    
    def get_params(self) -> Dict[str, Any]:
        """
        Retorna parámetros para prepared statement
        
        Returns:
            Diccionario con parámetros
        """
        return self.params
    
    def explain(self) -> Dict[str, Any]:
        """
        Retorna información detallada sobre la query sin construirla
        Útil para debugging
        
        Returns:
            Dict con todos los componentes de la query
        """
        return {
            'select_fields': self.select_fields,
            'distinct': self.distinct_flag,
            'from_tables': self.from_tables,
            'joins': self.joins,
            'where_conditions': self.where_conditions,
            'where_logic_operator': self.where_logic_operator,
            'group_by': self.group_by,
            'having_conditions': self.having_conditions,
            'order_by': self.order_by,
            'limit': self.limit_value,
            'offset': self.offset_value,
            'params': self.params,
            'aggregations': self.aggregations
        }
    
    def validate(self) -> tuple:
        """
        Valida la consulta antes de construirla
        
        Returns:
            Tupla (is_valid: bool, errors: List[str])
        """
        errors = []
        
        # Validar SELECT
        if not self.select_fields:
            errors.append("No se especificaron campos SELECT")
        
        # Validar FROM
        if not self.from_tables:
            errors.append("No se especificó tabla FROM")
        
        # Validar GROUP BY con agregaciones
        if self.aggregations and self.select_fields:
            # Verificar que campos no agregados estén en GROUP BY
            non_agg_fields = []
            for field in self.select_fields:
                # Si no contiene función de agregación
                if not any(func in field.upper() for func in ['SUM(', 'AVG(', 'COUNT(', 'MAX(', 'MIN(', 'STDDEV(', 'VARIANCE(']):
                    # Y no es un alias de agregación
                    if ' AS ' not in field:
                        field_name = field.split()[0]  # Obtener nombre base
                        if field_name not in ['*'] and field_name not in self.group_by:
                            non_agg_fields.append(field_name)
            
            if non_agg_fields and not self.group_by:
                errors.append(f"Campos no agregados sin GROUP BY: {non_agg_fields}")
        
        # Validar HAVING sin GROUP BY
        if self.having_conditions and not self.group_by:
            errors.append("HAVING especificado sin GROUP BY")
        
        # Validar OFFSET sin LIMIT
        if self.offset_value and not self.limit_value:
            errors.append("OFFSET especificado sin LIMIT (puede causar problemas en algunas BD)")
        
        is_valid = len(errors) == 0
        return is_valid, errors
    
    def __str__(self) -> str:
        """Retorna representación en string de la query"""
        try:
            return self.build()
        except ValueError as e:
            return f"<Query incompleta: {e}>"
    
    def __repr__(self) -> str:
        """Retorna representación técnica"""
        return f"<SQLQueryBuilder: {len(self.select_fields)} campos, {len(self.where_conditions)} condiciones>"