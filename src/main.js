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

import { showToast } from './components/Toast';
import './style.css';
import {
  subscribeToAuthChanges, login, register, logout, getUserProfile, setupIdentity,
  saveResumeData, getResumeData, getAllProfiles, setVipStatus, setUserRole,
  updateUserProfile, savePaymentData, getPaymentData
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

    if (profileData) await updateUserProfile(user.uid, { sessionId: localSessionId });

    const { doc, onSnapshot, db } = await import('firebase/firestore').then(async m => ({ ...m, db: (await import('./services/firebase')).db }));
    
    let isFirstSnapshot = true;
    vipListener = onSnapshot(doc(db, 'users', user.uid), (docSnap) => {
      const incoming = docSnap.data();
      if (!incoming) return;

      // ─── PROTECCIÓN DE CONCURRENCIA REFINADA ───
      // Solo expulsar si el ID de sesión cambia DESPUÉS del arranque y es diferente al nuestro.
      if (incoming.sessionId && incoming.sessionId !== localSessionId) {
        if (!isFirstSnapshot) {
          showToast('Sesión abierta en otro dispositivo.', 'error');
          logout().then(() => window.location.reload());
          return;
        }
      }
      
      isFirstSnapshot = false;
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
    async (uid, currentRole, name) => {
      if (currentRole === 'partner_sub') {
        const { activatePartnerSubscription } = await import('./services/auth');
        await activatePartnerSubscription(uid, 1);
        showToast('Socio activado');
      } else {
        const newRole = currentRole === 'admin' ? 'user' : 'admin';
        await setUserRole(uid, newRole);
        showToast(`Rol: ${newRole}`);
      }
    },
    () => showDashboard(),
    async (uid, fields) => { await updateUserProfile(uid, fields); showAdminPanel(); }
  );
}

async function showPartnerPanel() {
  currentView = 'partner_dashboard';
  const { PartnerDashboardView, attachPartnerListeners } = await import('./views/PartnerDashboard');
  const daysRemaining = profileData.subExpires ? Math.max(0, Math.ceil((new Date(profileData.subExpires) - new Date()) / (1000 * 60 * 60 * 24))) : 0;
  app.innerHTML = PartnerDashboardView(profileData, { daysRemaining });
  attachPartnerListeners(
    async (name, cedula, email) => { resumeData = { ...resumeData, fullName: name, cedula, email: email || '' }; showStep(0); },
    () => { logout().then(() => window.location.reload()); },
    () => showPartnerRenewalPaywall(profileData.uid)
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
  attachLandingListeners(() => renderAuth('register'), () => renderAuth('login'));
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
