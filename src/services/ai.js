const API_KEY = "AIzaSyDtc3_ZVyP_V9llFTwoG4gZi0JY_BIGUxk";

/**
 * Refina una sección usando Fetch directo a la API de Gemini (v1beta)
 * Configurado para responder JSON puro sin markdown.
 */
export const refineSection = async (sectionName, rawData) => {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;
  
  const systemPrompt = `Eres un experto redactor de CVs profesionales para el mercado laboral latinoamericano. 
Tu tarea es mejorar el texto de un CV sin inventar información falsa. 
- Corrige ortografía y gramática.
- Mejora el impacto profesional con lenguaje de acción (verbos fuertes: lideré, implementé, optimicé, gestioné...).
- Mantén el mismo significado original.
- Responde ÚNICAMENTE con el JSON solicitado, sin explicaciones adicionales.`;

  const userPrompt = sectionName === 'summary'
    ? `Mejora este resumen profesional de CV. Devuelve SOLO este JSON: {"summary": "texto mejorado aquí"}\n\nTexto original: "${rawData.summary}"`
    : `Mejora estos logros/responsabilidades laborales de un CV. Devuelve SOLO este JSON: {"achievements": ["logro mejorado 1", "logro mejorado 2"]}\n\nTexto original: ${JSON.stringify(rawData.achievements)}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }]
        }],
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.4,
          maxOutputTokens: 1024
        }
      })
    });

    if (!response.ok) {
      console.error("Gemini HTTP Error:", response.status, await response.text());
      return rawData;
    }

    const data = await response.json();
    
    if (data.error) {
      console.error("Gemini API Error:", data.error.message);
      return rawData;
    }

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) return rawData;
    
    // Parsear el JSON de respuesta
    try {
      const parsed = JSON.parse(text);
      return parsed;
    } catch {
      // Si por alguna razón devuelve texto sin JSON limpio, intentar extraerlo
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) return JSON.parse(jsonMatch[0]);
      return rawData;
    }
  } catch (e) {
    console.error("AI Service Error:", e);
    return rawData;
  }
};
