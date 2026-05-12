import { showToast } from './components/Toast';
import './style.css';
import {
  subscribeToAuthChanges,
  login,
  register,
  logout,
  getUserProfile,
  setupIdentity,
  saveResumeData,
  getResumeData,
  getAllProfiles,
  setVipStatus,
  setUserRole,
  updateUserProfile,
  savePaymentData,
  getPaymentData
} from './services/auth';

// ─── OPTIMIZACIÓN DE ARRANQUE: Paralelismo Total ───────────────────────────
const app = document.querySelector('#app');

// 1. Detectar si venimos de PayPhone (Sin bloquear el inicio)
const payphoneReturnPromise = handlePayPhoneReturn();

// 2. Iniciar Auth inmediatamente
subscribeToAuthChanges(async (user) => {
  await payphoneReturnPromise; // Solo esperar si realmente hay algo que procesar
  if (user) navigateBasedOnProfile(user);
  else {
    hardReset();
    if (!sessionStorage.getItem('skip_landing')) showLanding();
    else renderAuth('login');
  }
});

// ─── DETECTOR DE NAVEGADOR FB (Carga diferida) ──────────────────────────────
import('./services/fbBrowserDetector.js').then(m => m.detectAndHandleFBBrowser());

// ─── PWA ───
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}

// ─── MANEJO DE RETORNO DE PAYPHONE ──────────────────────────────────────────
async function handlePayPhoneReturn() {
  const params = new URLSearchParams(window.location.search);
  if (!params.get('id') || !params.get('clientTransactionId')) return;

  const ppId = params.get('id');
  const ppClientTxId = params.get('clientTransactionId');
  window.history.replaceState({}, document.title, window.location.pathname);

  app.innerHTML = `<div style="display:grid;place-items:center;height:100vh;background:#0a0b10;color:#c5a059;font-family:sans-serif;text-align:center;"><div class="glass" style="width:40px;height:40px;border:3px solid #c5a059;border-top-color:transparent;border-radius:50%;animation:spin 0.8s linear infinite;margin:0 auto 1.5rem;"></div><p>Verificando pago...</p></div>`;

  try {
    const token = "eNWk5EmtuMRdMJGQiJg-djEE4-stUyzApT1-3qzncfIrAwHRf84JpK4kHdZ6Y0uuhpXiVuCQ3EJKYb5pK44odTQNBvVSOTlyD5RG4cbcHwUDc-Vd9BfbhHBnL-S_Yz7Rz048UNiAXdti8XVk_fB7BSH7WA8I6csr_e8IRAie1e8F6pEL4zojWu7Vnn3tGjSgV-CPaK5iQ1BhfWopBUmVhoFemeLDGbb0xxsZGTSQ-FRK6z61mwSn9c_4PpGl6srEPWh7pvbmgs53OnkXFes3tCX5f8CWL4vTJ8f5v9Udvb5KOq2rSsUS28EX9hQIFXkN0s16BdPhU_iyTMsP2g6YEabj3VI";
    const res = await fetch('https://pay.payphonetodoesposible.com/api/button/V2/Confirm', {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ id: parseInt(ppId), clientTxId: ppClientTxId })
    });
    const result = await res.json();
    sessionStorage.setItem('pp_result', JSON.stringify({ status: result.transactionStatus, amount: result.amount, authCode: result.authorizationCode, clientTxId: ppClientTxId }));
  } catch (err) { console.warn(err); }
}

// ─── NAVEGACIÓN Y ESTADO ───────────────────────────────────────────────────
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

    // Carga de Listener en tiempo real (Optimizado)
    const { doc, onSnapshot, db } = await import('firebase/firestore').then(async m => ({ ...m, db: (await import('./services/firebase')).db }));
    
    vipListener = onSnapshot(doc(db, 'users', user.uid), (docSnap) => {
      const incoming = docSnap.data();
      if (incoming?.sessionId && incoming.sessionId !== localSessionId) {
        showToast('Sesión abierta en otro dispositivo.', 'error');
        logout().then(() => window.location.reload());
        return;
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
  currentView = 'questionnaire';
  const { QuestionnaireView, attachQuestionnaireListeners } = await import('./views/QuestionnaireView');
  app.innerHTML = QuestionnaireView(resumeData, stepIdx);
  attachQuestionnaireListeners(resumeData, stepIdx, 
    async (stepData) => { resumeData = { ...resumeData, ...stepData }; await saveResumeData(currentUser.uid, resumeData); showStep(stepIdx + 1); },
    () => showStep(stepIdx + 1), () => showStep(stepIdx - 1), () => showDashboard()
  );
}
