import csv
import io
from openpyxl import Workbook
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import Paragraph
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle
from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib import colors
from app_api.application.services.doc_service import DocService

class DjangoDocService(DocService):
    def generar_csv(self, data: list[dict], nombre_doc="reporte") -> io.StringIO:
        stream = io.StringIO()
        writer = csv.writer(stream)

        if not data:
            writer.writerow(["No se encontraron datos"])
        else:
            writer.writerow(list(data[0].keys()))
            for row in data:
                writer.writerow(list(row.values()))

        stream.seek(0)
        return stream
    
    def generar_excel(self, data: list[dict], nombre_doc="reporte") -> io.BytesIO:
        wb = Workbook()
        ws = wb.active

        if not ws:
            raise Exception("No se pudo crear el archivo")
        ws.title = nombre_doc

        if not data:
            ws.append(["No se encontraron datos"])
        else:
            # cabecera
            ws.append(list(data[0].keys()))
            # datos
            for row in data:
                ws.append(list(row.values()))

        stream = io.BytesIO()
        wb.save(stream)
        stream.seek(0)
        return stream
    
    def generar_pdf(self, data: list[dict], nombre_doc="reporte") -> io.BytesIO:
        """
        Genera un archivo PDF con una tabla a partir de una lista de diccionarios.
        Ajusta automáticamente el ancho de las columnas, la orientación de la página
        y permite texto largo sin cortes.
        """
        buffer = io.BytesIO()
        
        # Página horizontal (landscape) para más columnas
        doc = SimpleDocTemplate(buffer, pagesize=landscape(A4),
                                leftMargin=30, rightMargin=30, topMargin=30, bottomMargin=30)
        elements = []
        styles = getSampleStyleSheet()
        style_normal = styles["Normal"]

        # Validar datos
        if not data:
            data_tabla = [["No hay datos disponibles"]]
        else:
            # Encabezados
            headers = list(data[0].keys())
            # Filas de datos
            rows = [list(row.values()) for row in data]
            data_tabla = [headers] + rows

            # Convertir cada celda a Paragraph para evitar texto cortado
            data_tabla = [
                [Paragraph(str(cell), style_normal) for cell in row]
                for row in data_tabla
            ]

        # Calcular anchos dinámicos
        num_cols = len(data_tabla[0])
        page_width = doc.width
        col_width = max(page_width / num_cols, 40)  # ancho mínimo por columna
        col_widths = [col_width] * num_cols

        # Crear tabla
        table = Table(data_tabla, colWidths=col_widths, repeatRows=1)
        table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('FONTNAME', (0, 0), (-1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 0), (-1, -1), 8),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
            ('TOPPADDING', (0, 0), (-1, -1), 4),
            ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.black),
        ]))

        elements.append(table)
        doc.build(elements)
        buffer.seek(0)
        return buffer