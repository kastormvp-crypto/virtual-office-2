// La clave se inyecta desde la variable de entorno VITE_GROQ_API_KEY
// Configúrala en .env.local (local) y en Vercel Dashboard (producción)
const API_KEY = import.meta.env.VITE_GROQ_API_KEY || "";

/**
 * Refina una sección usando Fetch directo a la API de Groq (Llama 3)
 * Retorna el texto mejorado como string, o null si hubo un error.
 */
export const refineSection = async (sectionName, rawData) => {
  // Guardia: sin clave configurada no intentar llamada
  if (!API_KEY) {
    console.warn('Groq: VITE_GROQ_API_KEY no configurada');
    return { success: false, error: 'no_key' };
  }

  // Modelo ultra rápido de Groq
  const model = 'llama-3.3-70b-versatile';
  
  const systemPrompt = `Eres un experto redactor de CVs profesionales para el mercado laboral latinoamericano. 
Tu tarea es mejorar el texto de un CV sin inventar información falsa. 
- Corrige ortografía y gramática en español.
- Mejora el impacto profesional con verbos de acción (lideré, implementé, optimicé, gestioné, desarrollé...).
- Mantén el significado y los hechos originales del usuario.
- Responde ÚNICAMENTE en formato JSON exacto, sin explicaciones ni markdown.`;

  const userPrompt = sectionName === 'summary'
    ? `Mejora este resumen profesional de CV. Devuelve SOLO este JSON exacto: {"summary": "texto mejorado aquí"}\n\nTexto original: "${rawData.summary}"`
    : `Mejora estos logros/funciones laborales. Devuelve SOLO este JSON exacto: {"achievements": ["logro mejorado 1", "logro mejorado 2"]}\n\nTexto original: ${JSON.stringify(rawData.achievements || [])}`;

  try {
    const url = `https://api.groq.com/openai/v1/chat/completions`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.4,
        max_tokens: 1024,
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.warn(`Groq HTTP ${response.status}:`, errText.substring(0, 200));
      return { success: false, error: 'Groq API error' };
    }

    const data = await response.json();
    
    const text = data?.choices?.[0]?.message?.content;
    if (!text) {
      console.warn('Groq: respuesta vacía');
      return { success: false, error: 'Respuesta vacía' };
    }
    
    console.log(`Groq raw response:`, text.substring(0, 200));

    // Parsear el JSON de respuesta
    let parsed = null;
    
    try { parsed = JSON.parse(text.trim()); } catch {}
    
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

    console.warn(`Groq: JSON parseado pero sin campos esperados:`, parsed);
    return { success: false, error: 'Formato inválido de la IA' };

  } catch (e) {
    console.error(`Groq Error:`, e.message);
    return { success: false, error: 'Error de conexión con la IA' };
  }
};
