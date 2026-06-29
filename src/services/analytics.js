/**
 * Analytics Service — Tráfico de visitas diarias
 * Escribe en Firestore: analytics/visits/{YYYY-MM-DD} → { count: N }
 * Usa sessionStorage para no duplicar por recarga de página.
 */

const getFirestoreDeps = async () => {
  const { doc, getDoc, setDoc, collection, getDocs, increment, getFirestore } = await import('firebase/firestore');
  const { default: app } = await import('./firebase');
  const db = getFirestore(app);
  return { doc, getDoc, setDoc, collection, getDocs, increment, db };
};

/**
 * Registra una visita única por sesión de navegador.
 * Si ya se registró en esta sesión (ej. recarga), no duplica.
 */
export const trackVisit = async () => {
  try {
    const SESSION_KEY = 'hv_visit_tracked';
    if (sessionStorage.getItem(SESSION_KEY)) return;
    sessionStorage.setItem(SESSION_KEY, '1');

    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const { doc, setDoc, increment, db } = await getFirestoreDeps();

    await setDoc(
      doc(db, 'analytics', today),
      { count: increment(1), date: today },
      { merge: true }
    );
  } catch (e) {
    // Silencioso: no interrumpir la app si falla el tracking
  }
};

/**
 * Lee los últimos N días de visitas desde Firestore.
 * Retorna array ordenado: [{ date: 'YYYY-MM-DD', count: N }, ...]
 * @param {number} days - Cantidad de días a obtener (default: 7)
 */
export const getTrafficData = async (days = 7) => {
  try {
    const { doc, getDoc, db } = await getFirestoreDeps();
    const results = [];

    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const snap = await getDoc(doc(db, 'analytics', dateStr));
      results.push({
        date: dateStr,
        count: snap.exists() ? (snap.data().count || 0) : 0,
        label: d.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric' }),
      });
    }

    return results;
  } catch (e) {
    return [];
  }
};
