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

  // Modelo de alto razonamiento de Groq
  const model = 'openai/gpt-oss-120b';
  
  const systemPrompt = `Eres un redactor profesional especializado en currículums (CVs) y perfiles profesional. Tu tarea es tomar el texto que el usuario te proporciona y convertirlo en una versión optimizada y profesional.

OBJETIVO:
Transformar texto informal o desorganizado en redacción profesional de alto nivel, manteniendo el significado y datos originales sin inventar nada.

REGLAS DE ESTILO:
1. Perspectiva y Ortografía (CRÍTICO): REDACTA SIEMPRE EN PRIMERA PERSONA de forma implícita (ej. "Diseñé y gestioné", "Lideré equipos"). ESTÁ PROHIBIDO usar la tercera persona (ej. "Diseñó y gestionó"). La ortografía y gramática deben ser impecables.
2. Variedad léxica: PROHIBIDO repetir el mismo verbo. Usa sinónimos naturales (orquestar, coordinar, implementar, optimizar, gestionar).
3. Tono natural y humano: Evita frases robóticas, clichés vacíos y relleno sin sustancia. Prioriza claridad sobre grandilocuencia.
4. Estructura: 
   - Resumen: 2-4 líneas destacando el perfil.
   - Experiencia: Viñetas que empiecen con verbos de acción en PRIMERA PERSONA.
5. Fidelidad al contenido: No inventes logros, herramientas ni certificaciones que el usuario no mencionó.
6. PROHIBIDO INVENTAR DATOS (CRÍTICO): Bajo ninguna circunstancia agregues porcentajes (%), números, métricas o estadísticas que el usuario no haya proporcionado explícitamente en el texto original. Solo mejora la redacción.

FORMATO DE RESPUESTA (CRÍTICO):
- Debes responder ÚNICA y EXCLUSIVAMENTE en formato JSON válido.
- No agregues explicaciones, ni texto introductorio, ni comentarios, ni bloques markdown de código.
- Si el usuario te envía un "summary", responde: {"summary": "texto aquí"}
- Si el usuario te envía "achievements", responde: {"achievements": ["logro 1", "logro 2"]}`;

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
        temperature: 0.7,
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

export const chatWithAssistant = async (messages) => {
  if (!API_KEY) {
    return { success: false, error: 'no_key' };
  }
  const model = 'openai/gpt-oss-120b';
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
        messages: messages,
        temperature: 0.6,
        max_tokens: 1024
      })
    });
    if (!response.ok) {
      return { success: false, error: 'Groq API error' };
    }
    const data = await response.json();
    const text = data?.choices?.[0]?.message?.content;
    if (!text) {
      return { success: false, error: 'Respuesta vacía' };
    }
    return { success: true, reply: text };
  } catch (e) {
    console.error(`Groq Chat Error:`, e.message);
    return { success: false, error: 'Error de conexión con la IA' };
  }
};

