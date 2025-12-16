import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export interface PDFReportOptions {
	titulo: string;
	descripcion?: string;
	datos: any[];
	columnas: string[];
	nombreArchivo?: string;
	orientacion?: "portrait" | "landscape";
	incluirFecha?: boolean;
	pieReporte?: string;
}

/**
 * Genera y descarga un PDF con los datos del reporte
 */
export function generarPDFReporte(options: PDFReportOptions): void {
	const {
		titulo,
		descripcion,
		datos,
		columnas,
		nombreArchivo = "reporte",
		orientacion = "landscape",
		incluirFecha = true,
		pieReporte,
	} = options;

	// Crear documento PDF
	const doc = new jsPDF({
		orientation: orientacion,
		unit: "mm",
		format: "a4",
	});

	const pageWidth = doc.internal.pageSize.getWidth();
	let yPosition = 20;

	// ===== ENCABEZADO =====
	// Logo o nombre de la empresa
	doc.setFontSize(10);
	doc.setTextColor(100, 100, 100);
	doc.text("SmartSales365", 15, 15);

	// Título principal
	doc.setFontSize(18);
	doc.setFont("helvetica", "bold");
	doc.setTextColor(0, 0, 0);
	doc.text(titulo, pageWidth / 2, yPosition, { align: "center" });
	yPosition += 10;

	// Descripción (si existe)
	if (descripcion) {
		doc.setFontSize(11);
		doc.setFont("helvetica", "normal");
		doc.setTextColor(80, 80, 80);
		const descripcionLines = doc.splitTextToSize(descripcion, pageWidth - 30);
		doc.text(descripcionLines, pageWidth / 2, yPosition, { align: "center" });
		yPosition += descripcionLines.length * 5 + 5;
	}

	// Fecha de generación
	if (incluirFecha) {
		doc.setFontSize(9);
		doc.setTextColor(120, 120, 120);
		const fechaActual = new Date().toLocaleDateString("es-ES", {
			year: "numeric",
			month: "long",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
		doc.text(`Generado el: ${fechaActual}`, pageWidth / 2, yPosition, { align: "center" });
		yPosition += 8;
	}

	// Línea separadora
	doc.setDrawColor(200, 200, 200);
	doc.line(15, yPosition, pageWidth - 15, yPosition);
	yPosition += 5;

	// ===== TABLA DE DATOS =====
	if (datos && datos.length > 0) {
		// Preparar datos para la tabla
		const headers = columnas.map((col) => ({
			header: capitalizeWords(col),
			dataKey: col,
		}));

		const rows = datos.map((row) => {
			const formattedRow: Record<string, any> = {};
			columnas.forEach((col) => {
				formattedRow[col] = formatValue(row[col]);
			});
			return formattedRow;
		});

		// Generar tabla
		autoTable(doc, {
			startY: yPosition,
			head: [headers.map((h) => h.header)],
			body: rows.map((row) => columnas.map((col) => row[col])),
			theme: "striped",
			headStyles: {
				fillColor: [41, 128, 185], // Azul
				textColor: 255,
				fontStyle: "bold",
				halign: "center",
			},
			styles: {
				fontSize: 9,
				cellPadding: 3,
				overflow: "linebreak",
			},
			alternateRowStyles: {
				fillColor: [245, 245, 245],
			},
			margin: { left: 15, right: 15 },
			didDrawPage: () => {
				// Pie de página en cada página
				const pageCount = (doc as any).internal.getNumberOfPages();
				const currentPage = (doc as any).internal.getCurrentPageInfo().pageNumber;

				doc.setFontSize(8);
				doc.setTextColor(150, 150, 150);
				doc.text(`Página ${currentPage} de ${pageCount}`, pageWidth / 2, doc.internal.pageSize.getHeight() - 10, {
					align: "center",
				});

				if (pieReporte) {
					doc.setFontSize(7);
					doc.text(pieReporte, pageWidth / 2, doc.internal.pageSize.getHeight() - 5, { align: "center" });
				}
			},
		});

		// Obtener posición final después de la tabla
		const finalY = (doc as any).lastAutoTable.finalY || yPosition + 50;

		// Estadísticas al final (si hay espacio)
		if (finalY < doc.internal.pageSize.getHeight() - 40) {
			doc.setFontSize(9);
			doc.setTextColor(80, 80, 80);
			doc.text(`Total de registros: ${datos.length}`, 15, finalY + 10);
		}
	} else {
		doc.setFontSize(11);
		doc.setTextColor(150, 150, 150);
		doc.text("No hay datos para mostrar", pageWidth / 2, yPosition + 20, { align: "center" });
	}

	// ===== DESCARGAR PDF =====
	const fileName = `${nombreArchivo}_${new Date().getTime()}.pdf`;
	doc.save(fileName);
}

/**
 * Formatea valores para mostrar en el PDF
 */
function formatValue(value: any): string {
	if (value === null || value === undefined) return "N/A";

	// Fechas
	if (value instanceof Date || (typeof value === "string" && /^\d{4}-\d{2}-\d{2}/.test(value))) {
		try {
			const date = new Date(value);
			if (!isNaN(date.getTime())) {
				return date.toLocaleDateString("es-ES");
			}
		} catch (e) {
			// Ignorar error
		}
	}

	// Números
	if (typeof value === "number") {
		// Si es un número con decimales, formatearlo
		if (value % 1 !== 0) {
			return value.toFixed(2);
		}
		return value.toLocaleString("es-ES");
	}

	// Booleanos
	if (typeof value === "boolean") {
		return value ? "Sí" : "No";
	}

	// Strings largos
	if (typeof value === "string" && value.length > 100) {
		return value.substring(0, 97) + "...";
	}

	return String(value);
}

/**
 * Capitaliza palabras separadas por guiones bajos o espacios
 */
function capitalizeWords(str: string): string {
	return str
		.split(/[_\s]/)
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
		.join(" ");
}

/**
 * Genera un PDF con gráfico (requiere imagen base64 del chart)
 */
export function generarPDFConGrafico(options: {
	titulo: string;
	descripcion?: string;
	imagenBase64: string;
	datos?: any[];
	columnas?: string[];
	nombreArchivo?: string;
}): void {
	const { titulo, descripcion, imagenBase64, datos, columnas, nombreArchivo = "reporte_grafico" } = options;

	const doc = new jsPDF({
		orientation: "portrait",
		unit: "mm",
		format: "a4",
	});

	const pageWidth = doc.internal.pageSize.getWidth();
	let yPosition = 20;

	// Encabezado
	doc.setFontSize(16);
	doc.setFont("helvetica", "bold");
	doc.text(titulo, pageWidth / 2, yPosition, { align: "center" });
	yPosition += 10;

	if (descripcion) {
		doc.setFontSize(10);
		doc.setFont("helvetica", "normal");
		const descLines = doc.splitTextToSize(descripcion, pageWidth - 30);
		doc.text(descLines, pageWidth / 2, yPosition, { align: "center" });
		yPosition += descLines.length * 5 + 8;
	}

	// Agregar imagen del gráfico
	try {
		doc.addImage(imagenBase64, "PNG", 15, yPosition, pageWidth - 30, 120);
		yPosition += 125;
	} catch (error) {
		console.error("Error al agregar imagen:", error);
	}

	// Si hay datos tabulares, agregarlos
	if (datos && columnas && datos.length > 0) {
		autoTable(doc, {
			startY: yPosition,
			head: [columnas.map(capitalizeWords)],
			body: datos.map((row) => columnas.map((col) => formatValue(row[col]))),
			theme: "grid",
			headStyles: {
				fillColor: [41, 128, 185],
			},
			margin: { left: 15, right: 15 },
		});
	}

	// Descargar
	const fileName = `${nombreArchivo}_${new Date().getTime()}.pdf`;
	doc.save(fileName);
}

export default { generarPDFReporte, generarPDFConGrafico };
