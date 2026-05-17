// ─── CRITICAL ERROR CATCHER (TOP LEVEL) ──────────────────────────────────
window.onerror = function(msg, url, line, col, error) {
  if (!url || line === 0 || msg === 'Script error.' || msg === 'Script error') return true;
  const app = document.querySelector('#app');
  const splash = document.querySelector('#app-splash');
  if (app && splash) {
    app.innerHTML = `<div style="padding:2rem; color:#f87171; background:#000; height:100vh; font-family:monospace; font-size:0.8rem;">
      <h2 style="margin-bottom:1rem;">⚠️ ERROR DE CARGA</h2>
      <p>${msg}</p><p>Línea: ${line}:${col}</p>
      <button onclick="window.location.reload()" style="margin-top:2rem; padding:0.8rem 1rem; background:#f87171; color:#fff; border:none; border-radius:5px;">FORZAR RECARGA</button>
    </div>`;
  }
  return false;
};

// ─── INTERFACE PROTECTION ───
document.addEventListener('contextmenu', (e) => e.preventDefault());
document.addEventListener('keydown', (e) => {
  if (e.keyCode === 123 || (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74 || e.keyCode === 67)) || (e.ctrlKey && e.keyCode === 85)) {
    e.preventDefault();
    return false;
  }
});

// ─── REGISTRO DE SERVICE WORKER CON AUTO-UPDATE ────────────────────
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(reg => {
      // Revisar actualizaciones cada 5 minutos de forma silenciosa
      setInterval(() => { reg.update(); }, 1000 * 60 * 5);
    });
  });

  let refreshing = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (refreshing) return;
    refreshing = true;
    window.location.reload();
  });
}

import { showToast } from './components/Toast';
import { showTransferModal } from './components/TransferModal';
import './style.css';
import {
  subscribeToAuthChanges, login, register, logout, getUserProfile, setupIdentity,
  saveResumeData, getResumeData, getAllProfiles, setVipStatus, setUserRole,
  updateUserProfile, updateUserCedulaInResume, savePaymentData, getPaymentData
} from './services/auth';

// ─── OPTIMIZACIÓN DE ARRANQUE Y SEGURIDAD ───────────────────────────
const app = document.querySelector('#app');

// Lógica de Confianza: 10 min para desconocidos, Sin límite para habituales
const isTrustedDevice = () => localStorage.getItem('hv_trusted_device') === 'true';
const INACTIVITY_LIMIT = isTrustedDevice() ? 0 : 10 * 60 * 1000; 

let inactivityTimer;

function resetInactivityTimer() {
  if (INACTIVITY_LIMIT === 0) return; // No hay límite para equipos de confianza
  clearTimeout(inactivityTimer);
  inactivityTimer = setTimeout(() => {
    if (currentUser) {
      showToast('Sesión cerrada por seguridad (Equipo no habitual).', 'info');
      logout().then(() => window.location.reload());
    }
  }, INACTIVITY_LIMIT);
}

// Escuchar interacciones para resetear el tiempo de vida de la sesión
['mousedown', 'mousemove', 'keydown', 'touchstart', 'scroll'].forEach(evt => 
  window.addEventListener(evt, resetInactivityTimer, { passive: true })
);

const payphoneReturnPromise = handlePayPhoneReturn();

subscribeToAuthChanges(async (user) => {
  await payphoneReturnPromise;
  if (user) navigateBasedOnProfile(user);
  else {
    hardReset();
    if (!sessionStorage.getItem('skip_landing')) showLanding();
    else renderAuth('login');
  }
});

// ─── ESTADO GLOBAL ───
let currentUser = null;
let profileData = null;
let vipListener = null;
let resumeData = { theme: 'modern-sidebar', experience: [], education: [], hardSkills: [], softSkills: [], languages: [], certifications: [], references: [] };
let currentView = 'auth';

function hardReset() {
  if (vipListener) { vipListener(); vipListener = null; }
  currentUser = null;
  profileData = null;
  currentView = 'auth';
}

async function handlePayPhoneReturn() {
  const params = new URLSearchParams(window.location.search);
  if (!params.get('id') || !params.get('clientTransactionId')) return;
  const ppId = params.get('id');
  const ppClientTxId = params.get('clientTransactionId');
  window.history.replaceState({}, document.title, window.location.pathname);
  app.innerHTML = `<div style="display:grid;place-items:center;height:100vh;background:#0a0b10;color:#c5a059;text-align:center;"><div class="glass" style="width:40px;height:40px;border:3px solid #c5a059;border-top-color:transparent;border-radius:50%;animation:spin 0.8s linear infinite;margin:0 auto 1.5rem;"></div><p>Verificando pago...</p></div>`;
  try {
    const token = "eNWk5EmtuMRdMJGQiJg-djEE4-stUyzApT1-3qzncfIrAwHRf84JpK4kHdZ6Y0uuhpXiVuCQ3EJKYb5pK44odTQNBvVSOTlyD5RG4cbcHwUDc-Vd9BfbhHBnL-S_Yz7Rz048UNiAXdti8XVk_fB7BSH7WA8I6csr_e8IRAie1e8F6pEL4zojWu7Vnn3tGjSgV-CPaK5iQ1BhfWopBUmVhoFemeLDGbb0xxsZGTSQ-FRK6z61mwSn9c_4PpGl6srEPWh7pvbmgs53OnkXFes3tCX5f8CWL4vTJ8f5v9Udvb5KOq2rSsUS28EX9hQIFXkN0s16BdPhU_iyTMsP2g6YEabj3VI";
    const res = await fetch('https://pay.payphonetodoesposible.com/api/button/V2/Confirm', {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ id: parseInt(ppId), clientTxId: ppClientTxId })
    });
    const result = await res.json();
    sessionStorage.setItem('pp_result', JSON.stringify({ status: result.transactionStatus, amount: result.amount, authCode: result.authorizationCode, clientTxId: ppClientTxId }));
  } catch (err) {}
}

async function navigateBasedOnProfile(user) {
  hardReset();
  currentUser = user;
  app.innerHTML = `<div style="display:grid;place-items:center;height:100vh;text-align:center;"><div class="glass" style="width:30px;height:30px;margin:0 auto 1rem;border-top:3px solid var(--primary);animation:spin 0.8s linear infinite;"></div></div>`;
  const localSessionId = sessionStorage.getItem('app_session_id') || (Date.now().toString(36) + Math.random().toString(36).substring(2));
  sessionStorage.setItem('app_session_id', localSessionId);

  try {
    const [fetchedProfile, fetchedResume] = await Promise.all([ getUserProfile(user.uid), getResumeData(user.uid) ]);
    profileData = fetchedProfile;
    resumeData = fetchedResume ? { ...resumeData, ...fetchedResume } : resumeData;
    // BUG FIX: Inyectar cédula del perfil (users/) en resumeData solo para usuarios normales.
    // Los socios no tienen cédula propia en el cuestionario; la ingresan por cliente.
    if (profileData?.cedula && profileData.role !== 'partner') {
      resumeData.cedula = profileData.cedula;
    }

    if (profileData) await updateUserProfile(user.uid, { sessionId: localSessionId });

    // Carga de Listener en tiempo real (Optimizado con Periodo de Gracia de 10s)
    const { doc, onSnapshot, db } = await import('firebase/firestore').then(async m => ({ ...m, db: (await import('./services/firebase')).db }));
    
    const sessionStartTime = Date.now();
    vipListener = onSnapshot(doc(db, 'users', user.uid), (docSnap) => {
      const incoming = docSnap.data();
      if (!incoming) return;

      // ─── PROTECCIÓN DE CONCURRENCIA CON PERIODO DE GRACIA ───
      // Si el ID de sesión es distinto, solo expulsar si ya pasaron más de 10s (tiempo de sincronización)
      if (incoming.sessionId && incoming.sessionId !== localSessionId) {
        const secondsActive = (Date.now() - sessionStartTime) / 1000;
        if (secondsActive > 10) { 
          showToast('Sesión abierta en otro dispositivo.', 'error');
          logout().then(() => window.location.reload());
          return;
        }
      }
      
      profileData = incoming;
      if (currentView === 'editor') showPreview();
    });

    if (!profileData?.locked) {
      const { SetupIdentityView, attachSetupListeners } = await import('./views/SetupIdentityView');
      app.innerHTML = SetupIdentityView(user.email);
      attachSetupListeners(async (fullName) => { await setupIdentity(user.uid, { fullName, email: user.email }); navigateBasedOnProfile(user); });
    } else if (profileData.role === 'partner') {
      showPartnerPanel();
    } else {
      showDashboard();
      showPayPhoneResultIfPending(user.uid);
    }
  } catch (error) { showToast('Error de conexión.', 'error'); }
}

async function showDashboard() {
  currentView = 'dashboard';
  const { Dashboard } = await import('./views/Dashboard');
  app.innerHTML = Dashboard(profileData);
  attachDashboardListeners();
}

function attachDashboardListeners() {
  document.querySelector('#logout-btn')?.addEventListener('click', () => { logout().then(() => window.location.reload()); });
  document.querySelector('#start-interview-btn')?.addEventListener('click', () => showStep(0));
  document.querySelector('#direct-editor-btn')?.addEventListener('click', () => showPreview());
  document.querySelector('#super-user-btn')?.addEventListener('click', () => showAdminPanel());

  // BUG FIX: Botones de pago Plan Socio en el dashboard
  document.querySelector('#dashboard-socio-payphone-btn')?.addEventListener('click', () => showSocioPaywall());
  document.querySelector('#dashboard-socio-transfer-btn')?.addEventListener('click', () => showTransferModal());

  // Lógica de Confianza de Equipo
  document.querySelector('#trust-device-btn')?.addEventListener('click', () => {
    const isTrusted = localStorage.getItem('hv_trusted_device') === 'true';
    localStorage.setItem('hv_trusted_device', !isTrusted);
    showDashboard(); // Recargar para reflejar cambio visual
    showToast(!isTrusted ? '✓ Equipo de Confianza activado. (Sin cierre automático)' : 'Equipo marcado como desconocido. (Cierre en 10 min)', 'info');
  });
}

async function showAdminPanel() {
  app.innerHTML = `<div style="display:grid;place-items:center;height:100vh;"><div class="glass" style="width:30px;height:30px;border-top:3px solid var(--primary);animation:spin 0.8s linear infinite;"></div></div>`;
  const { AdminPanelView, attachAdminListeners } = await import('./views/AdminPanelView');
  const profiles = await getAllProfiles();
  app.innerHTML = AdminPanelView(profiles, profileData?.role || '');
  attachAdminListeners(
    async (uid, isVip) => { await setVipStatus(uid, isVip); showToast('Estado VIP actualizado'); },
    async (uid, action, name) => {
      if (action === 'partner_sub') {
        const { activatePartnerSubscription } = await import('./services/auth');
        await activatePartnerSubscription(uid, 1);
        showToast('Socio activado');
      } else if (action === 'deactivate_partner') {
        const { deactivatePartnerSubscription } = await import('./services/auth');
        await deactivatePartnerSubscription(uid);
        showToast('Socio desactivado');
      } else {
        const newRole = action === 'admin' ? 'user' : 'admin';
        await setUserRole(uid, newRole);
        showToast(`Rol: ${newRole}`);
      }
    },
    () => showDashboard(),
    async (uid, fields) => {
      await updateUserProfile(uid, fields);
      // BUG FIX: Si se corrigió la cédula, propagarla también a 'resumes' para el cuestionario
      if (fields.cedula) await updateUserCedulaInResume(uid, fields.cedula);
      showAdminPanel();
    }

  );
}

async function showPartnerPanel() {
  currentView = 'partner_dashboard';
  const { PartnerDashboardView, attachPartnerListeners } = await import('./views/PartnerDashboard');
  const daysRemaining = profileData.subExpires ? Math.max(0, Math.ceil((new Date(profileData.subExpires) - new Date()) / (1000 * 60 * 60 * 24))) : 0;
  app.innerHTML = PartnerDashboardView(profileData, { daysRemaining });
  attachPartnerListeners(
    async (name, cedula, email) => {
      // BUG FIX: Resetear completamente resumeData para cada nuevo cliente del socio.
      // Sin esto, los datos del cliente anterior se mezclan con el nuevo.
      resumeData = {
        theme: 'modern-sidebar',
        experience: [], education: [], hardSkills: [], softSkills: [],
        languages: [], certifications: [], references: [],
        fullName: name, cedula, email: email || ''
      };
      showStep(0);
    },
    () => { logout().then(() => window.location.reload()); },
    () => showSocioPaywall()
  );
}

async function showPreview() {
  currentView = 'editor';
  const fullResumeData = { ...resumeData, fullName: profileData?.fullName || 'Usuario', email: profileData?.email || '', vip: profileData?.vip || false };
  const { EditorView, attachEditorListeners } = await import('./views/EditorView');
  app.innerHTML = EditorView(fullResumeData, profileData, resumeData.theme);
  setTimeout(() => attachEditorListeners(fullResumeData, profileData, (updates) => {
    resumeData = { ...resumeData, ...updates };
    saveResumeData(currentUser.uid, resumeData);
    showPreview();
  }, () => showDashboard(), () => showStep(0)), 50);
}

async function showLanding() {
  currentView = 'landing';
  const { LandingView, attachLandingListeners } = await import('./views/LandingView');
  app.innerHTML = LandingView();
  attachLandingListeners(
    () => renderAuth('register'),
    () => renderAuth('login'),
    () => triggerSocioPayPhone(),
    () => showTransferModal()
  );
}

// ─── PAYPHONE SOCIO — Usa el SDK PPaymentButtonBox (ya cargado en index.html) ───────
function triggerSocioPayPhone() {
  const token = "eNWk5EmtuMRdMJGQiJg-djEE4-stUyzApT1-3qzncfIrAwHRf84JpK4kHdZ6Y0uuhpXiVuCQ3EJKYb5pK44odTQNBvVSOTlyD5RG4cbcHwUDc-Vd9BfbhHBnL-S_Yz7Rz048UNiAXdti8XVk_fB7BSH7WA8I6csr_e8IRAie1e8F6pEL4zojWu7Vnn3tGjSgV-CPaK5iQ1BhfWopBUmVhoFemeLDGbb0xxsZGTSQ-FRK6z61mwSn9c_4PpGl6srEPWh7pvbmgs53OnkXFes3tCX5f8CWL4vTJ8f5v9Udvb5KOq2rSsUS28EX9hQIFXkN0s16BdPhU_iyTMsP2g6YEabj3VI";
  const clientTxId = `socio_${Date.now()}`;

  // Verificar que el SDK esté disponible (cargado async en index.html)
  if (typeof window.PPaymentButtonBox === 'undefined') {
    showToast('Cargando pasarela de pago... intenta en un momento.', 'info');
    // Retry automático después de 2s si el SDK no ha cargado aún
    setTimeout(() => {
      if (typeof window.PPaymentButtonBox !== 'undefined') triggerSocioPayPhone();
      else showToast('Error al cargar pasarela. Usa el botón de Transferencia.', 'error');
    }, 2000);
    return;
  }

  try {
    const box = new window.PPaymentButtonBox({
      token,
      amount: 1000,          // $10.00 en centavos
      amountWithoutTax: 1000,
      amountWithTax: 0,
      tax: 0,
      service: 0,
      tip: 0,
      currency: 'USD',
      clientTransactionId: clientTxId,
      responseUrl: window.location.origin + window.location.pathname,
      cancellationUrl: window.location.origin + window.location.pathname,
      reference: 'Plan Socio - Tu Hoja de Vida'
    });
    box.render('pp-socio-btn-container');
  } catch (err) {
    showToast('Error al iniciar el pago. Intenta por transferencia.', 'error');
  }
}

// ─── PAYWALL SOCIO (modal para el flujo autenticado) ────────────────────────
function showSocioPaywall() {
  const overlay = document.createElement('div');
  overlay.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.88);display:grid;place-items:center;z-index:99999;padding:1rem;backdrop-filter:blur(4px);box-sizing:border-box;';
  overlay.innerHTML = `
    <div style="max-width:360px;width:100%;background:#0f1018;border:1px solid rgba(197,160,89,0.35);border-radius:20px;padding:1.8rem 1.2rem;text-align:center;position:relative;box-sizing:border-box;max-height:92vh;overflow-y:auto;">
      <button id="paywall-close-x" style="position:absolute;top:0.6rem;right:0.9rem;background:none;border:none;color:#a0a0b0;font-size:1.6rem;cursor:pointer;line-height:1;font-weight:300;">&times;</button>
      <div style="font-size:2.5rem;margin-bottom:1rem;">💼</div>
      <h3 style="color:#c5a059;margin:0 0 0.4rem;font-size:1.05rem;letter-spacing:2px;">RENOVAR MEMBRESÍA</h3>
      <p style="color:#a0a0b0;font-size:0.8rem;margin-bottom:1.5rem;line-height:1.5;">Elige cómo pagar tu acceso ilimitado de 30 días por <strong style="color:#c5a059;">$10</strong>.</p>
      <!-- Contenedor donde el SDK de PayPhone renderiza la caja de pago -->
      <div id="pp-socio-btn-container" style="margin-bottom:1rem;width:100%;display:flex;justify-content:center;touch-action:auto;box-sizing:border-box;"></div>
      <div style="display:flex;flex-direction:column;gap:0.8rem;box-sizing:border-box;">
        <button id="paywall-card-btn" style="padding:0.9rem;border-radius:10px;border:none;background:linear-gradient(135deg,#c5a059,#e8c878);color:#000;font-weight:700;font-size:0.85rem;cursor:pointer;">💳 Pagar con Tarjeta — $10</button>
        <button id="paywall-transfer-btn" style="padding:0.9rem;border-radius:10px;background:none;border:1px solid rgba(197,160,89,0.35);color:#c5a059;font-weight:600;font-size:0.85rem;cursor:pointer;">🏦 Pagar por Transferencia</button>
        <button id="paywall-cancel-btn" style="padding:0.6rem;border-radius:10px;background:none;border:1px solid rgba(255,255,255,0.08);color:#606070;font-size:0.75rem;cursor:pointer;">Cerrar</button>
      </div>
      <style>
        #pp-socio-btn-container iframe {
          max-width: 100% !important;
          width: 100% !important;
        }
      </style>
    </div>
  `;
  document.body.appendChild(overlay);
  // El botón de tarjeta lanza el SDK de PayPhone (renderiza dentro del contenedor del modal)
  document.getElementById('paywall-card-btn')?.addEventListener('click', () => {
    document.getElementById('paywall-card-btn').style.display = 'none';
    triggerSocioPayPhone();
  });
  document.getElementById('paywall-transfer-btn')?.addEventListener('click', () => { overlay.remove(); showTransferModal(); });
  document.getElementById('paywall-cancel-btn')?.addEventListener('click', () => overlay.remove());
  document.getElementById('paywall-close-x')?.addEventListener('click', () => overlay.remove());
  overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
}

async function renderAuth(mode) {
  currentView = 'auth';
  const { AuthView, attachAuthListeners } = await import('./views/AuthView');
  app.innerHTML = AuthView(mode);
  attachAuthListeners(mode, renderAuth, async (m, email, pass, realPass, extra) => {
    try {
      if (m === 'login') await login(email, pass);
      else await register(email, realPass).then(u => setupIdentity(u.user.uid, { ...extra, email, locked: true }));
    } catch (err) { showToast('Error en acceso.', 'error'); }
  });
}

function showPayPhoneResultIfPending(uid) {
  const raw = sessionStorage.getItem('pp_result');
  if (!raw) return;
  sessionStorage.removeItem('pp_result');
  const result = JSON.parse(raw);
  if (result.status === 'Approved') {
    savePaymentData(uid, { method: 'payphone', amount: result.amount, authCode: result.authCode, status: 'Approved' });
    setVipStatus(uid, true);
    showToast('¡Pago VIP aprobado!', 'success');
  }
}

async function showStep(stepIdx) {
  if (stepIdx > 6) return showPreview(); // Redirigir al visor si se completaron todos los pasos
  currentView = 'questionnaire';
  const { QuestionnaireView, attachQuestionnaireListeners } = await import('./views/QuestionnaireView');
  app.innerHTML = QuestionnaireView(resumeData, stepIdx);
  attachQuestionnaireListeners(resumeData, stepIdx, 
    async (stepData) => { 
      resumeData = { ...resumeData, ...stepData }; 
      await saveResumeData(currentUser.uid, resumeData); 
      showStep(stepIdx + 1); 
    },
    () => showStep(stepIdx + 1), () => showStep(stepIdx - 1), () => showDashboard()
  );
}
