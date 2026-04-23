import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyDtc3_ZVyP_V9llFTwoG4gZi0JY_BIGUxk";
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ 
  model: "gemini-1.5-flash",
  systemInstruction: `Actúa como un Especialista en Optimización ATS y Redactor de CVs de Élite. 
  Tu objetivo es recibir datos brutos de una sección de la hoja de vida y refinarlos para que sean de alto impacto.
  
  REGLAS DE REFINAMIENTO:
  1. CORRECCIÓN TOTAL: Corrige todos los errores de ortografía, tildes y gramática en español ecuatoriano.
  2. No inventes información, solo mejora la redacción.
  3. Implementa la fórmula: "Logré [X] medido por [Y] haciendo [Z]" en la experiencia.
  4. Usa verbos de acción potentes (Lideré, Implementé, Optimicé, Diseñé).
  5. Mantén un tono profesional y directo.
  6. Devuelve la información estructurada en el mismo formato que se te entregó (JSON).`
});

/**
 * Refines a specific section of the resume using AI
 * @param {string} sectionName 
 * @param {object} rawData 
 */
export const refineSection = async (sectionName, rawData) => {
  const prompt = `Refina la siguiente sección de la hoja de vida: "${sectionName}". 
  Datos actuales: ${JSON.stringify(rawData)}.
  
  IMPORTANTE: Solo devuelve el JSON refinado, sin texto adicional.`
;
  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  
  try {
    // Attempt to extract JSON from possible markdown blocks
    const jsonStr = text.match(/\{[\s\S]*\}/)?.[0] || text;
    return JSON.parse(jsonStr);
  } catch (e) {
    console.warn("AI didn't return valid JSON, using raw text", e);
    return rawData;
  }
};
