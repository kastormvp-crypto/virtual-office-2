// La clave se inyecta desde la variable de entorno VITE_GROQ_API_KEY
// Configúrala en .env.local (local) y en Vercel Dashboard (producción)
const API_KEY = import.meta.env.VITE_GROQ_API_KEY || "";

/**
 * FILTRO ANTI-DATOS INVENTADOS
 * Detecta si la IA agregó números, porcentajes o cifras que NO están en el texto original.
 * Retorna true si la respuesta es segura (no inventó datos).
 */
const PERCENT_WORDS = /por\s*ciento|porciento/i;
const extractNumbers = (text) => (String(text).match(/\d+(?:[.,]\d+)?/g) || []).map(n => n.replace(',', '.'));

const hasNoInventedData = (originalText, refinedText) => {
  const original = String(originalText || '');
  const refined = String(refinedText || '');

  // 1. Porcentajes: si el cliente no escribió %, la IA tampoco puede
  if (refined.includes('%') && !original.includes('%')) return false;
  if (PERCENT_WORDS.test(refined) && !PERCENT_WORDS.test(original) && !original.includes('%')) return false;

  // 2. Números: todo número de la respuesta debe existir en el texto original
  const originalNums = new Set(extractNumbers(original));
  return extractNumbers(refined).every(n => originalNums.has(n));
};

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
  
  const systemPrompt = `Eres un redactor de hojas de vida en Ecuador. Tu tarea es tomar el texto que escribe el usuario y mejorar su redacción para que se lea claro, ordenado y profesional, como lo escribiría una persona ecuatoriana en su hoja de vida.

OBJETIVO:
Corregir ortografía, gramática y orden del texto, manteniendo EXACTAMENTE el significado y los datos originales. No inventas nada.

REGLAS DE LENGUAJE (CRÍTICO):
1. Usa español ecuatoriano sencillo, natural y profesional. Escribe como habla un profesional en Ecuador, no como una traducción del inglés.
2. Redacta en PRIMERA PERSONA, con expresiones como: "He trabajado en...", "Trabajé como...", "Mis funciones fueron...", "Estuve a cargo de...", "Me encargué de...", "Apoyé en...", "Realicé...", "Atendí...", "Coordiné...". PROHIBIDO usar tercera persona (ej. "Realizó", "Gestionó").
3. PALABRAS PROHIBIDAS: orquestar, orquesté, apalancar, sinergia, potenciar, robustecer, catalizar, impulsar sinergias, liderar iniciativas disruptivas, ecosistema, empoderar, maximizar, escalar, y cualquier palabra rebuscada, de marketing o poco común en Ecuador.
4. Tono humano y directo. Nada de frases exageradas, clichés ni relleno.
5. Estructura:
   - Resumen: 2 a 4 líneas que describan el perfil de la persona.
   - Experiencia: una frase por cada función o logro, en primera persona.

REGLAS DE FIDELIDAD (CRÍTICO):
6. PROHIBIDO INVENTAR DATOS: NO agregues porcentajes (%), números, cantidades, montos, métricas, estadísticas ni resultados que el usuario NO haya escrito. Si el usuario no puso una cifra, tu texto NO lleva cifras.
7. No inventes logros, herramientas, empresas, cargos ni certificaciones que el usuario no mencionó.
8. Si el usuario sí escribió una cifra, puedes mantenerla tal cual, sin cambiarla.

FORMATO DE RESPUESTA (CRÍTICO):
- Responde ÚNICA y EXCLUSIVAMENTE en formato JSON válido.
- No agregues explicaciones, ni texto introductorio, ni comentarios, ni bloques markdown de código.
- Si el usuario te envía un "summary", responde: {"summary": "texto aquí"}
- Si el usuario te envía "achievements", responde: {"achievements": ["función 1", "función 2"]}`;

  const originalText = sectionName === 'summary'
    ? (rawData.summary || '')
    : (rawData.achievements || []).join('\n');

  const buildUserPrompt = (strict) => {
    const strictNote = strict
      ? `\n\nATENCIÓN: tu respuesta anterior fue rechazada porque agregaste números o porcentajes que el usuario NO escribió. Esta vez NO incluyas ninguna cifra ni porcentaje que no esté en el texto original.`
      : '';
    return sectionName === 'summary'
      ? `Mejora este resumen profesional de hoja de vida. Devuelve SOLO este JSON exacto: {"summary": "texto mejorado aquí"}${strictNote}\n\nTexto original: "${rawData.summary}"`
      : `Mejora estas funciones/logros laborales. Devuelve SOLO este JSON exacto: {"achievements": ["función mejorada 1", "función mejorada 2"]}${strictNote}\n\nTexto original: ${JSON.stringify(rawData.achievements || [])}`;
  };

  // Hasta 2 intentos: si el primero inventa cifras, se reintenta en modo estricto
  let lastResult = { success: false, error: 'Formato inválido de la IA' };
  for (let attempt = 0; attempt < 2; attempt++) {
    const result = await callRefine(model, systemPrompt, buildUserPrompt(attempt > 0), sectionName, attempt > 0 ? 0.2 : 0.4);
    if (!result.success) return result; // error de red/API: no reintentar

    const refinedText = sectionName === 'summary'
      ? result.data.summary
      : [].concat(result.data.achievements).join('\n');

    if (hasNoInventedData(originalText, refinedText)) return result;

    console.warn('Groq: respuesta rechazada por datos inventados (cifras/%):', refinedText.substring(0, 200));
    lastResult = { success: false, error: 'invented_data' };
  }
  return lastResult;
};

/**
 * Llamada única a Groq + parseo del JSON. Uso interno de refineSection.
 */
const callRefine = async (model, systemPrompt, userPrompt, sectionName, temperature) => {
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
        temperature: temperature,
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

