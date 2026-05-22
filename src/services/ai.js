// La clave se inyecta desde la variable de entorno VITE_GEMINI_API_KEY
// Configúrala en .env.local (local) y en Vercel Dashboard (producción)
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";

/**
 * Refina una sección usando Fetch directo a la API de Gemini (v1beta)
 * Retorna el texto mejorado como string, o null si hubo un error.
 */
export const refineSection = async (sectionName, rawData) => {
  // Guardia: sin clave configurada no intentar llamada
  if (!API_KEY) {
    console.warn('Gemini: VITE_GEMINI_API_KEY no configurada');
    return { success: false, error: 'no_key' };
  }

  // Modelos confirmados disponibles en la cuenta
  const models = ['gemini-2.0-flash', 'gemini-2.5-flash'];
  
  const systemPrompt = `Eres un experto redactor de CVs profesionales para el mercado laboral latinoamericano. 
Tu tarea es mejorar el texto de un CV sin inventar información falsa. 
- Corrige ortografía y gramática en español.
- Mejora el impacto profesional con verbos de acción (lideré, implementé, optimicé, gestioné, desarrollé...).
- Mantén el significado y los hechos originales del usuario.
- Responde ÚNICAMENTE con el JSON solicitado, sin explicaciones ni markdown.`;

  const userPrompt = sectionName === 'summary'
    ? `Mejora este resumen profesional de CV. Devuelve SOLO este JSON exacto: {"summary": "texto mejorado aquí"}\n\nTexto original: "${rawData.summary}"`
    : `Mejora estos logros/funciones laborales. Devuelve SOLO este JSON exacto: {"achievements": ["logro mejorado 1", "logro mejorado 2"]}\n\nTexto original: ${JSON.stringify(rawData.achievements || [])}`;

  for (const model of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${API_KEY}`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }]
          }],
          generationConfig: {
            temperature: 0.4,
            maxOutputTokens: 1024
          }
        })
      });

      if (!response.ok) {
        const errText = await response.text();
        try {
          const errJson = JSON.parse(errText);
          if (errJson.error?.code === 429) {
            console.warn(`Gemini [${model}]: Cuota de API agotada`);
            return { success: false, error: 'quota' };
          }
        } catch {}
        console.warn(`Gemini [${model}] HTTP ${response.status}:`, errText.substring(0, 200));
        continue;
      }

      const data = await response.json();
      
      if (data.error) {
        console.warn(`Gemini [${model}] API Error:`, data.error.message);
        continue;
      }

      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) {
        console.warn(`Gemini [${model}]: respuesta vacía`);
        continue;
      }
      
      console.log(`Gemini [${model}] raw response:`, text.substring(0, 200));

      // Parsear el JSON de respuesta — con múltiples estrategias de extracción
      let parsed = null;
      
      // Estrategia 1: parseo directo
      try { parsed = JSON.parse(text.trim()); } catch {}
      
      // Estrategia 2: extraer bloque JSON del texto
      if (!parsed) {
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          try { parsed = JSON.parse(jsonMatch[0]); } catch {}
        }
      }

      if (parsed) {
        // Verificar que el resultado tiene contenido útil
        if (sectionName === 'summary' && parsed.summary && parsed.summary.trim().length > 10) {
          return { success: true, data: parsed };
        } else if (sectionName !== 'summary' && parsed.achievements && parsed.achievements.length > 0) {
          return { success: true, data: parsed };
        }
      }

      // Si el JSON es válido pero no tiene el campo esperado
      console.warn(`Gemini [${model}]: JSON parseado pero sin campos esperados:`, parsed);

    } catch (e) {
      console.error(`Gemini [${model}] Error:`, e.message);
    }
  }

  // Todos los modelos fallaron
  return { success: false, error: 'No se pudo conectar con la IA' };
};
