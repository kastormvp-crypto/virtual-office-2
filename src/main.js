// ─── CRITICAL ERROR CATCHER (TOP LEVEL) ──────────────────────────────────────
window.onerror = function(msg, url, line, col, error) {
  if (!url || line === 0 || msg === 'Script error.' || msg === 'Script error') return true;
  const app = document.querySelector('#app');
  if (app && app.innerHTML.trim() === '') {
    app.innerHTML = `<div style="padding:2rem; color:#f87171; background:#000; height:100vh; font-family:monospace; font-size:0.8rem;">
      <h2 style="margin-bottom:1rem;">⚠️ ERROR DE CARGA</h2>
      <p>${msg}</p>
      <p>Línea: ${line}:${col}</p>
      <button onclick="window.location.reload()" style="margin-top:2rem; padding:0.8rem 1rem; background:#f87171; color:#fff; border:none; border-radius:5px;">FORZAR RECARGA</button>
    </div>`;
  }
  return false;
};

// ─── INTERFACE PROTECTION (ANTI-INSPECT) ─────────────────────────────────────
// Desactiva el clic derecho y atajos de teclado comunes para ver el código.
document.addEventListener('contextmenu', (e) => e.preventDefault());
document.addEventListener('keydown', (e) => {
  // Bloquear F12
  if (e.keyCode === 123) {
    e.preventDefault();
    return false;
  }
  // Bloquear Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C (Inspectores)
  if (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74 || e.keyCode === 67)) {
    e.preventDefault();
    return false;
  }
  // Bloquear Ctrl+U (Ver código fuente)
  if (e.ctrlKey && e.keyCode === 85) {
    e.preventDefault();
    return false;
  }
});

// ─── FACEBOOK IN-APP BROWSER DETECTOR ────────────────────────────────
// Se importa dinámicamente para no bloquear el bundle principal.
import('./services/fbBrowserDetector.js').then(m => m.detectAndHandleFBBrowser());

import './style.css';
import { showToast } from './components/Toast';
import { validateCedula } from './services/validator';
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
  updateUserProfile
} from './services/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from './services/firebase';
import { showPrivacyModal } from './components/PrivacyModal';

// ─── INITIALIZATION ──────────────────────────────────────────────────────────
const app = document.querySelector('#app');

// Show ultra-fast initial state
if (app) {
  app.innerHTML = `
    <div style="display:grid; place-items:center; height:100vh; background:#0a0b10; color:#c5a059; font-family:sans-serif;">
      <div style="text-align:center;">
        <div style="width:40px; height:40px; border:3px solid #c5a059; border-top-color:transparent; border-radius:50%; animation:spin 0.8s linear infinite; margin:0 auto 1rem;"></div>
        <p style="letter-spacing:2px; font-size:0.8rem; font-weight:bold;">VIRTUAL OFFICE</p>
      </div>
    </div>
    <style>@keyframes spin { to { transform: rotate(360deg); } }</style>
  `;
}

// ─── PWA SERVICE WORKER REGISTRATION ──────────────────────────────────────────
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(err => console.warn('SW failed', err));
  });
}

// ─── PAYPHONE RETURN HANDLER ──────────────────────────────────────────────────
// Detecta si la app fue abierta desde la URL de respuesta de PayPhone
async function handlePayPhoneReturn() {
  const params = new URLSearchParams(window.location.search);
  const ppId = params.get('id');
  const ppClientTxId = params.get('clientTransactionId');

  if (!ppId || !ppClientTxId) return false; // No es un retorno de PayPhone

  // Limpiar la URL para que no se repita en recargas
  window.history.replaceState({}, document.title, window.location.pathname);

  // Mostrar pantalla de verificación
  if (app) {
    app.innerHTML = `
      <div style="display:grid; place-items:center; height:100vh; background:#0a0b10; color:#c5a059; font-family:sans-serif; text-align:center; padding:2rem;">
        <div>
          <div style="width:50px; height:50px; border:3px solid #c5a059; border-top-color:transparent; border-radius:50%; animation:spin 0.8s linear infinite; margin:0 auto 1.5rem;"></div>
          <p style="letter-spacing:1px; font-size:0.9rem;">Verificando tu pago...</p>
        </div>
      </div>
      <style>@keyframes spin { to { transform: rotate(360deg); } }</style>
    `;
  }

  try {
    const token = "eNWk5EmtuMRdMJGQiJg-djEE4-stUyzApT1-3qzncfIrAwHRf84JpK4kHdZ6Y0uuhpXiVuCQ3EJKYb5pK44odTQNBvVSOTlyD5RG4cbcHwUDc-Vd9BfbhHBnL-S_Yz7Rz048UNiAXdti8XVk_fB7BSH7WA8I6csr_e8IRAie1e8F6pEL4zojWu7Vnn3tGjSgV-CPaK5iQ1BhfWopBUmVhoFemeLDGbb0xxsZGTSQ-FRK6z61mwSn9c_4PpGl6srEPWh7pvbmgs53OnkXFes3tCX5f8CWL4vTJ8f5v9Udvb5KOq2rSsUS28EX9hQIFXkN0s16BdPhU_iyTMsP2g6YEabj3VI";
    const res = await fetch('https://pay.payphonetodoesposible.com/api/button/V2/Confirm', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ id: parseInt(ppId), clientTxId: ppClientTxId })
    });

    const result = await res.json();
    
    // Guardar resultado en sessionStorage para mostrarlo tras el login
    sessionStorage.setItem('pp_result', JSON.stringify({
      status: result.transactionStatus,
      amount: result.amount,
      authCode: result.authorizationCode,
      clientTxId: ppClientTxId
    }));

    return true; // Indica que fue un retorno de PayPhone

  } catch (err) {
    console.warn('PayPhone confirm error:', err);
    sessionStorage.setItem('pp_result', JSON.stringify({ status: 'Error' }));
    return true;
  }
}

// Función para mostrar el resultado de pago guardado en sessionStorage
function showPayPhoneResultIfPending(uid) {
  const raw = sessionStorage.getItem('pp_result');
  if (!raw) return;
  sessionStorage.removeItem('pp_result');
  
  try {
    const result = JSON.parse(raw);
    const approved = result.status === 'Approved';
    
    const banner = document.createElement('div');
    banner.style.cssText = `position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.95);display:grid;place-items:center;z-index:99999;font-family:sans-serif;`;
    banner.innerHTML = `
      <div style="text-align:center;padding:2rem;max-width:380px;">
        <div style="font-size:4rem;margin-bottom:1rem;">${approved ? '✅' : '❌'}</div>
        <h2 style="color:${approved ? '#4ade80' : '#f87171'};margin:0 0 0.8rem;">
          ${approved ? '¡Pago Aprobado!' : 'Pago No Completado'}
        </h2>
        <p style="color:#e0e0e0;font-size:0.85rem;margin-bottom:0.5rem;">
          ${approved ? `Tu cuenta VIP ha sido activada exitosamente.` : 'La transacción no fue aprobada. Intenta nuevamente.'}
        </p>
        ${result.authCode ? `<p style="color:#a0a0a0;font-size:0.7rem;">Código: ${result.authCode}</p>` : ''}
        <button id="pp-result-btn" style="margin-top:1.5rem;background:${approved ? '#4ade80' : '#c5a059'};color:#000;border:none;padding:0.9rem 2rem;border-radius:8px;font-weight:bold;font-size:1rem;cursor:pointer;width:100%;">
          CONTINUAR
        </button>
      </div>`;
    document.body.appendChild(banner);
    
    document.getElementById('pp-result-btn')?.addEventListener('click', async () => {
      banner.remove();
      if (approved && uid) {
        await setVipStatus(uid, true);
      }
    });
  } catch(e) {}
}


// ─── SMART INSTALL PROMPT LOGIC ───────────────────────────────────────────────
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  showInstallBanner('android');
});

function showInstallBanner(platform) {
  if (sessionStorage.getItem('install_banner_closed')) return;
  const banner = document.createElement('div');
  banner.id = 'install-banner';
  banner.className = 'glass animate-fade';
  banner.style.cssText = 'position:fixed; bottom:20px; left:20px; right:20px; padding:1.2rem; z-index:9999; display:flex; align-items:center; gap:12px; border:1px solid var(--primary); box-shadow: 0 10px 40px rgba(0,0,0,0.5);';
  const isiOS = platform === 'ios' || /iPhone|iPad|iPod/i.test(navigator.userAgent);
  banner.innerHTML = `
    <img src="/icon.png" alt="Logo" style="width: 40px; height: 40px; border-radius: 8px;">
    <div style="flex:1;">
      <h4 style="margin:0; font-size:0.9rem; color:var(--primary);">Instalar App</h4>
      <p style="margin:2px 0 0; font-size:0.75rem; color:var(--text-dim);">
        ${isiOS ? 'Toca "Compartir" y "Añadir a Inicio"' : 'Accede más rápido desde tu pantalla de inicio.'}
      </p>
    </div>
    <div style="display:flex; gap:8px;">
      ${!isiOS ? '<button id="btn-install-now" class="btn-primary" style="padding:0.4rem 0.8rem; font-size:0.75rem;">INSTALAR</button>' : ''}
      <button id="btn-close-banner" style="background:none; border:none; color:var(--text-dim); font-size:1.2rem; cursor:pointer;">&times;</button>
    </div>
  `;
  document.body.appendChild(banner);
  document.querySelector('#btn-close-banner')?.addEventListener('click', () => {
    banner.remove();
    sessionStorage.setItem('install_banner_closed', 'true');
  });
  document.querySelector('#btn-install-now')?.addEventListener('click', async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') banner.remove();
    deferredPrompt = null;
  });
}
if (/iPhone|iPad|iPod/i.test(navigator.userAgent) && !window.navigator.standalone) {
  setTimeout(() => showInstallBanner('ios'), 3000);
}

// ─── STATE ──────────────────────────────────────────────────────────────────
let currentUser = null;
let profileData = null;
let vipListener = null;

const getInitialResumeData = () => ({
  theme: 'modern-sidebar',
  photoUrl: '',
  title: '',
  phone: '',
  location: '',
  links: { linkedin: '', portfolio: '' },
  summary: '',
  experience: [],
  education: [],
  hardSkills: [],
  softSkills: [],
  languages: [],
  certifications: [],
  references: []
});

let resumeData = getInitialResumeData();
let isAiRefining = false;
let currentView = 'auth';

function hardReset() {
  if (vipListener) { vipListener(); vipListener = null; }
  currentUser = null;
  profileData = null;
  resumeData = getInitialResumeData();
  currentView = 'auth';
}

async function navigateBasedOnProfile(user) {
  hardReset();
  currentUser = user;
  app.innerHTML = `<div style="display:grid;place-items:center;height:100vh;text-align:center;"><div class="glass" style="padding:2rem;border-radius:50%;width:30px;height:30px;margin:0 auto 1rem;border-top:3px solid var(--primary);animation:spin 0.8s linear infinite;"></div><p style="color:var(--text-dim);font-size:0.75rem;">Sincronizando perfil...</p></div>`;
  try {
    const [fetchedProfile, fetchedResume] = await Promise.all([
      getUserProfile(user.uid),
      getResumeData(user.uid)
    ]);
    profileData = fetchedProfile;
    resumeData = fetchedResume ? { ...getInitialResumeData(), ...fetchedResume } : getInitialResumeData();

    // ── AUTO-ASIGNAR role='master' si es la cuenta principal ──────
    // Esto garantiza que el Panel Admin siempre sea visible, sin depender
    // de comparaciones de email en el cliente.
    if (user.email === 'ks_mvp@icloud.com' && profileData?.role !== 'master') {
      await setUserRole(user.uid, 'master');
      profileData = { ...profileData, role: 'master' };
    }

    vipListener = onSnapshot(doc(db, 'users', user.uid), (docSnap) => {
      if (!docSnap.exists()) return;
      const incoming = docSnap.data();
      const justActivated = !profileData?.vip && incoming.vip;
      profileData = incoming;
      if (justActivated) showToast('¡VIP ACTIVADO!', 'success');
      if (currentView === 'editor') showPreview();
    });
    if (!profileData || !profileData.locked) {
      try {
        const { SetupIdentityView, attachSetupListeners } = await import('./views/SetupIdentityView');
        app.innerHTML = SetupIdentityView(user.email, 'Cédula Blindada');
        attachSetupListeners(async (fullName) => {
          await setupIdentity(user.uid, { fullName, email: user.email });
          navigateBasedOnProfile(user);
        });
      } catch (e) {
        showToast('Error cargando identidad.', 'error');
      }
    } else {
      showDashboard();
      // Mostrar notificación de PayPhone si viene de un retorno de pago
      showPayPhoneResultIfPending(user.uid);
    }
  } catch (error) {
    showToast('Error de conexión.', 'error');
  }
}

async function showDashboard() {
  currentView = 'dashboard';
  try {
    const { Dashboard } = await import('./views/Dashboard');
    // profileData ya tiene el role correcto (master/admin/user) desde Firestore
    app.innerHTML = Dashboard(profileData);
    attachDashboardListeners();
    if (!sessionStorage.getItem('privacy_seen')) showPrivacyModal();
  } catch (e) {
    showToast('Error cargando menú.', 'error');
  }
}

function attachDashboardListeners() {
  document.querySelector('#logout-btn')?.addEventListener('click', () => {
    hardReset();
    logout().then(() => window.location.reload());
  });
  document.querySelector('#start-interview-btn')?.addEventListener('click', () => showStep(0));
  document.querySelector('#direct-editor-btn')?.addEventListener('click', () => showPreview());
  document.querySelector('#super-user-btn')?.addEventListener('click', () => showAdminPanel());
}

async function showAdminPanel() {
  app.innerHTML = `<div style="display:grid;place-items:center;height:100vh;text-align:center;"><div class="glass" style="padding:2rem;border-radius:50%;width:30px;height:30px;margin:0 auto 1rem;border-top:3px solid var(--primary);animation:spin 0.8s linear infinite;"></div><p style="color:var(--primary);font-size:0.8rem;">Cargando Panel Maestro...</p></div>`;
  try {
    const { AdminPanelView, attachAdminListeners } = await import('./views/AdminPanelView');
    const profiles = await getAllProfiles();
    app.innerHTML = AdminPanelView(profiles, profileData?.role || '');
    attachAdminListeners(
      async (uid, isVip) => {
        await setVipStatus(uid, isVip);
        showToast(`Estado VIP ${isVip ? 'Activado' : 'Desactivado'}`);
        showAdminPanel();
      },
      async (uid, role) => {
        await setUserRole(uid, role);
        showToast(`Rol actualizado a ${role.toUpperCase()}`);
        showAdminPanel();
      },
      () => showDashboard(),
      async (uid, fields) => {
        await updateUserProfile(uid, fields);
        showToast('✓ Perfil corregido');
        showAdminPanel();
      }
    );
  } catch (err) {
    showToast('Error al cargar panel.', 'error');
    showDashboard();
  }
}

async function showStep(stepIdx) {
  if (stepIdx < 0) return showDashboard();
  if (stepIdx >= 7) return showPreview();
  currentView = 'questionnaire';
  try {
    const { QuestionnaireView, attachQuestionnaireListeners } = await import('./views/QuestionnaireView');
    app.innerHTML = QuestionnaireView(resumeData, stepIdx);
    attachQuestionnaireListeners(resumeData, stepIdx, 
      async (stepData) => {
        resumeData = { ...resumeData, ...stepData };
        await saveResumeData(currentUser.uid, resumeData);
        if ([1, 2].includes(stepIdx)) triggerAiRefinement(stepIdx, stepData);
        showStep(stepIdx + 1);
      },
      () => showStep(stepIdx + 1),
      () => showStep(stepIdx - 1),
      () => showDashboard()
    );
  } catch (e) {
    showToast('Error cargando formulario.', 'error');
    showDashboard();
  }
}

function updateAiStatusIndicator(visible) {
  const indicator = document.querySelector('#ai-status-indicator');
  if (indicator) indicator.style.display = visible ? 'flex' : 'none';
}

async function triggerAiRefinement(sectionIndex, dataChunk) {
  isAiRefining = true;
  updateAiStatusIndicator(true);
  try {
    const { refineSection } = await import('./services/ai');
    const refined = await refineSection(['Encabezado', 'Perfil', 'Experiencia', 'Habilidades', 'Educación', 'Adicionales', 'Referencias'][sectionIndex], dataChunk);
    resumeData = { ...resumeData, ...refined };
    await saveResumeData(currentUser.uid, resumeData);
  } catch (e) {
    console.warn('AI failed', e);
  } finally {
    isAiRefining = false;
    updateAiStatusIndicator(false);
  }
}

async function showPreview() {
  currentView = 'editor';
  app.innerHTML = `<div style="display:grid;place-items:center;height:100vh;text-align:center;"><div class="glass" style="padding:2rem;border-radius:50%;width:30px;height:30px;margin:0 auto 1rem;border-top:3px solid var(--primary);animation:spin 0.8s linear infinite;"></div><p style="color:var(--primary);font-size:0.8rem;">Cargando visor ejecutivo...</p></div>`;
  const fullResumeData = { 
    ...resumeData, 
    fullName: profileData?.fullName || resumeData?.fullName || 'Usuario', 
    email: profileData?.email || resumeData?.email || '', 
    cedula: profileData?.cedula || resumeData?.cedula || '', 
    vip: profileData?.vip || false 
  };
  try {
    const { EditorView, attachEditorListeners } = await import('./views/EditorView');
    app.innerHTML = EditorView(fullResumeData, profileData, resumeData.theme);
    
    setTimeout(() => {
      attachEditorListeners(fullResumeData, profileData, (updates) => {
        resumeData = { ...resumeData, ...updates };
        saveResumeData(currentUser.uid, resumeData);
        showPreview();
      }, () => showDashboard());
    }, 50);
    
  } catch (err) {
    console.error('Visor Error:', err);
    showToast(`Error: ${err.message || 'No se pudo abrir el visor'}`, 'error');
    showDashboard();
  }
}

// ─── AUTH ───────────────────────────────────────────────────────────────────
// Primero verificar si venimos de un retorno de PayPhone, luego iniciar auth
handlePayPhoneReturn().then(() => {
  subscribeToAuthChanges((user) => {
    if (user) navigateBasedOnProfile(user);
    else {
      hardReset();
      // Mostrar landing solo si el usuario nunca ha interactuado en esta sesión
      if (!sessionStorage.getItem('skip_landing')) {
        showLanding();
      } else {
        renderAuth('login');
      }
    }
  });
});

async function showLanding() {
  currentView = 'landing';
  try {
    const { LandingView, attachLandingListeners } = await import('./views/LandingView');
    app.innerHTML = LandingView();
    attachLandingListeners(
      () => { sessionStorage.setItem('skip_landing', '1'); renderAuth('register'); },
      () => { sessionStorage.setItem('skip_landing', '1'); renderAuth('login'); }
    );
  } catch (e) {
    // Fallback si la landing falla: ir directo al login
    renderAuth('login');
  }
}

async function renderAuth(mode) {
  currentView = 'auth';
  try {
    const { AuthView, attachAuthListeners } = await import('./views/AuthView');
    app.innerHTML = AuthView(mode);
    attachAuthListeners(mode, (newMode) => renderAuth(newMode), async (m, email, passOrCed, realPass, extra) => {
      try {
        if (m === 'login') {
          await login(email, passOrCed);
          showToast('Acceso validado.');
        } else {
          const { fullName, cedula, nationality } = extra || {};
          const userCred = await register(email, realPass);
          await setupIdentity(userCred.user.uid, { fullName, email, cedula, nationality: nationality || 'Ecuatoriana', locked: true });
          showToast('Cuenta creada.');
        }
      } catch (err) {
        showToast('Error en autenticación.', 'error');
      }
    });
  } catch (e) {
    console.error('Auth Load Fail', e);
  }
}
