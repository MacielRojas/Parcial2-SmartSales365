/**
 * Script de prueba para verificar que Gemini funciona correctamente
 * Ejecuta esto en la consola del navegador para depurar
 */

import { procesarConsultaConGemini } from './reporteGeminiService';

export async function testGeminiConnection() {
    console.log('🧪 Iniciando prueba de conexión con Gemini...');
    
    try {
        // Verificar API Key
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
        console.log('✓ API Key configurada:', apiKey ? 'Sí' : 'No');
        
        if (!apiKey) {
            console.error('❌ VITE_GEMINI_API_KEY no está configurada en el archivo .env');
            return false;
        }
        
        // Prueba simple
        console.log('📤 Enviando consulta de prueba a Gemini...');
        const resultado = await procesarConsultaConGemini({
            consulta: 'Mostrar todas las ventas del último mes'
        });
        
        console.log('✅ Gemini respondió correctamente:', resultado);
        return true;
        
    } catch (error) {
        console.error('❌ Error en la prueba de Gemini:', error);
        return false;
    }
}

// Para usar en la consola del navegador:
// import { testGeminiConnection } from './services/testGemini'
// testGeminiConnection()
