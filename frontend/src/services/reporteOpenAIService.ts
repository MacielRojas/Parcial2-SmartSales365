// Cliente OpenAI para generación de reportes con lenguaje natural

export interface ReportQuery {
	consulta: string;
	modelo?: string;
	audio?: boolean;
}

export interface ReportStructure {
	titulo: string;
	descripcion: string;
	tipo_reporte: "tabla" | "grafico" | "mixto";
	endpoint_sugerido: string;
	parametros: Record<string, any>;
	sql_sugerido?: string;
	campos_requeridos: string[];
	filtros: Record<string, any>;
	ordenamiento?: {
		campo: string;
		direccion: "ASC" | "DESC";
	};
	agrupamiento?: string[];
	calculo?: string;
}

/**
 * Llama a OpenAI Chat Completions solo texto
 */
async function fetchOpenAICompletion({ prompt, model }: { prompt: string; model: string }): Promise<string> {
	const apiKey = import.meta.env.VITE_OPENAI_API_KEY as string | undefined;
	const apiUrl = (import.meta.env.VITE_OPENAI_API_URL as string | undefined) || "https://api.openai.com/v1/chat/completions";
	
	if (!apiKey) throw new Error("Falta VITE_OPENAI_API_KEY");

	const body = {
		model,
		temperature: 0.2,
		messages: [{ role: "user", content: prompt }],
	};

	const res = await fetch(apiUrl, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${apiKey}`,
		},
		body: JSON.stringify(body),
	});

	if (!res.ok) {
		const text = await res.text();
		throw new Error(`OpenAI API error ${res.status}: ${text}`);
	}
	
	const data = await res.json();
	return data.choices?.[0]?.message?.content || JSON.stringify(data);
}

/**
 * Procesa una consulta en lenguaje natural y la convierte en una estructura de reporte
 * usando OpenAI
 */
export async function procesarConsultaConIA(query: ReportQuery): Promise<ReportStructure> {
	const apiKey = import.meta.env.VITE_OPENAI_API_KEY as string | undefined;
	
	console.log('🔑 Verificando OpenAI API Key:', apiKey ? `${apiKey.substring(0, 10)}...` : 'NO ENCONTRADA');
	
	if (!apiKey || apiKey.trim() === '') {
		throw new Error(
			"❌ API Key de OpenAI no configurada.\n\n" +
			"Pasos para solucionar:\n" +
			"1. Verifica que el archivo .env tenga: VITE_OPENAI_API_KEY=tu_api_key\n" +
			"2. Reinicia el servidor de desarrollo con: npm run dev\n" +
			"3. Recarga la página"
		);
	}

	const chosenModel = query.modelo || (import.meta.env.VITE_OPENAI_MODEL as string | undefined) || "gpt-4o-mini";

	const systemPrompt = `Eres un experto en análisis de datos y generación de reportes. 
Tu tarea es interpretar consultas en lenguaje natural y convertirlas en estructuras de reportes JSON.

El sistema tiene las siguientes entidades disponibles:
- Ventas: id, fecha, total, usuario_id, estado, metodo_pago
- Productos: id, nombre, precio, stock, categoria_id, descripcion, destacado
- Categorias: id, nombre, descripcion
- Usuarios: id, nombre, email, fecha_registro, rol
- Carritos: id, usuario_id, fecha_creacion, estado
- Facturas: id, venta_id, numero_factura, fecha_emision, total
- Pagos: id, venta_id, monto, fecha, metodo

CASOS ESPECIALES:
- Si menciona "productos destacados", usa endpoint_sugerido: "productos/destacados" y filtros: {"destacado": true}
- Si menciona "productos con stock", filtra por stock > 0
- Si menciona "productos sin stock" o "agotados", filtra por stock = 0

IMPORTANTE: 
- Analiza cuidadosamente la consulta
- Identifica la entidad principal
- Determina los campos necesarios
- Sugiere filtros relevantes
- Proporciona ordenamiento lógico
- Si menciona "últimos días/meses", calcula las fechas apropiadas
- Si pide "top N", incluye límite y ordenamiento DESC

Responde ÚNICAMENTE con un JSON válido siguiendo esta estructura exacta:
{
  "titulo": "Título descriptivo del reporte",
  "descripcion": "Descripción detallada de lo que muestra el reporte",
  "tipo_reporte": "tabla" | "grafico" | "mixto",
  "endpoint_sugerido": "nombre del endpoint backend sugerido",
  "parametros": {
    "model_name": "nombre_modelo",
    "limit": número o null,
    "otros_parametros": "valores"
  },
  "sql_sugerido": "Query SQL sugerido si es relevante",
  "campos_requeridos": ["campo1", "campo2"],
  "filtros": {
    "campo": "valor",
    "fecha_inicio": "YYYY-MM-DD",
    "fecha_fin": "YYYY-MM-DD"
  },
  "ordenamiento": {
    "campo": "nombre_campo",
    "direccion": "ASC" o "DESC"
  },
  "agrupamiento": ["campo1", "campo2"],
  "calculo": "SUM, AVG, COUNT, etc."
}`;

	const userPrompt = `Analiza esta consulta y genera la estructura del reporte:

Consulta: "${query.consulta}"

Fecha actual: ${new Date().toISOString().split("T")[0]}

Genera el JSON de la estructura del reporte:`;

	try {
		const fullPrompt = `${systemPrompt}\n\n${userPrompt}`;
		const responseText = await fetchOpenAICompletion({
			prompt: fullPrompt,
			model: chosenModel
		});

		// Extraer JSON de la respuesta (puede venir con markdown)
		let jsonText = responseText.trim();
		if (jsonText.startsWith("```json")) {
			jsonText = jsonText.replace(/^```json\n?/, "").replace(/\n?```$/, "");
		} else if (jsonText.startsWith("```")) {
			jsonText = jsonText.replace(/^```\n?/, "").replace(/\n?```$/, "");
		}

		const estructura: ReportStructure = JSON.parse(jsonText);

		// Validación básica
		if (!estructura.titulo || !estructura.tipo_reporte) {
			throw new Error("Estructura de reporte inválida");
		}

		return estructura;
	} catch (error) {
		console.error("Error al procesar con OpenAI:", error);
		throw new Error(`Error al interpretar la consulta: ${error instanceof Error ? error.message : "Error desconocido"}`);
	}
}

/**
 * Genera sugerencias de reportes basadas en el contexto
 */
export async function generarSugerenciasReportes(): Promise<string[]> {
	const apiKey = import.meta.env.VITE_OPENAI_API_KEY as string | undefined;
	if (!apiKey) {
		// Retornar sugerencias por defecto si no hay API key
		return [
			"Reporte de los productos destacados",
			"Mostrar las ventas del último mes agrupadas por categoría",
			"Top 10 productos más vendidos en el último trimestre",
			"Usuarios registrados por mes del año actual",
			"Ventas totales por día de la semana",
		];
	}

	const model = (import.meta.env.VITE_OPENAI_MODEL as string | undefined) || "gpt-4o-mini";

	const prompt = `Genera 10 ejemplos de consultas en español para un sistema de reportes de e-commerce.
Las consultas deben ser variadas, útiles y específicas.
Incluye consultas sobre: ventas, productos, usuarios, tendencias, comparativas.

Responde ÚNICAMENTE con un array JSON de strings, ejemplo:
["consulta 1", "consulta 2", ...]`;

	try {
		const responseText = await fetchOpenAICompletion({ prompt, model });
		let jsonText = responseText.trim();

		if (jsonText.startsWith("```json")) {
			jsonText = jsonText.replace(/^```json\n?/, "").replace(/\n?```$/, "");
		}

		const sugerencias: string[] = JSON.parse(jsonText);
		return Array.isArray(sugerencias) ? sugerencias : [];
	} catch (error) {
		console.error("Error al generar sugerencias:", error);
		return [
			"Reporte de los productos destacados",
			"Mostrar las ventas del último mes agrupadas por categoría",
			"Top 10 productos más vendidos",
			"Usuarios registrados este año",
			"Productos con stock bajo",
		];
	}
}

export default { procesarConsultaConIA, generarSugerenciasReportes };
