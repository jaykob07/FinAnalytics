import { GoogleGenAI } from '@google/genai';
import { Anomaly } from '../types';
import { getMetricLabel } from '../utils/dataParser';

export const analyzeAnomaly = async (anomaly: Anomaly, contextData?: string): Promise<string> => {
    const apiKey = "AIzaSyBIAcs9grwAF_M0NyF5dwkUSjGlNmMKUFE";
    if (!apiKey) {
        return "Error: API Key not found. Please ensure process.env.API_KEY is set.";
    }

    const ai = new GoogleGenAI({ apiKey });

    const metricName = getMetricLabel(anomaly.metric);
    
    const prompt = `
        Actúa como un analista financiero experto en el mercado colombiano.
        
        Se ha detectado una caída abrupta en: ${metricName}.
        Fecha: ${anomaly.date}
        Valor Anterior: ${anomaly.previousValue}
        Valor Actual: ${anomaly.value}
        Cambio Porcentual: ${anomaly.changePercent.toFixed(2)}%

        Analiza brevemente (máximo 3 oraciones):
        1. ¿Qué posibles eventos económicos, políticos o globales (especialmente relacionados con Colombia) ocurrieron alrededor de esta fecha que podrían explicar esta caída?
        2. Si no hay un evento específico claro, menciona la tendencia general del mercado en ese momento.
        
        Responde en español, con tono profesional y directo.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text || "No se pudo generar un análisis.";
    } catch (error) {
        console.error("Gemini Error:", error);
        return "Ocurrió un error al consultar a Gemini. Verifica tu conexión o cuota de API.";
    }
};