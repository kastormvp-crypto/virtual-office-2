const API_KEY = "AIzaSyDtc3_ZVyP_V9llFTwoG4gZi0JY_BIGUxk";

/**
 * Refina una sección usando Fetch directo a la API de Gemini (v1)
 * Esto es más robusto que el SDK y evita errores de versión.
 */
export const refineSection = async (sectionName, rawData) => {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
  
  const systemPrompt = "Actúa como experto en CVs ATS. Corrige ortografía y mejora el impacto profesional. Devuelve SOLO el JSON refinado.";
  const userPrompt = `Refina esta sección de CV: "${sectionName}". Datos: ${JSON.stringify(rawData)}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }]
        }]
      })
    });

    const data = await response.json();
    
    if (data.error) {
      console.error("Gemini API Error:", data.error);
      return rawData;
    }

    const text = data.candidates[0].content.parts[0].text;
    
    // Extracción de JSON manual
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    return rawData;
  } catch (e) {
    console.error("AI Service Error:", e);
    return rawData;
  }
};
