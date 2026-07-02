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
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    
    // Si ya visitó HOY, no sumar de nuevo (previene duplicados por recarga)
    const lastVisitDate = localStorage.getItem('hv_last_visit_date');
    if (lastVisitDate === today) return;
    
    // Si nunca había visitado antes, es usuario nuevo
    const isNewUser = !localStorage.getItem('hv_has_visited_ever');
    
    // Registrar la visita localmente
    localStorage.setItem('hv_last_visit_date', today);
    localStorage.setItem('hv_has_visited_ever', 'true');

    const { doc, setDoc, increment, db } = await getFirestoreDeps();

    await setDoc(
      doc(db, 'analytics', today),
      { 
        count: increment(1), 
        newUsers: isNewUser ? increment(1) : increment(0),
        returningUsers: !isNewUser ? increment(1) : increment(0),
        date: today 
      },
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
