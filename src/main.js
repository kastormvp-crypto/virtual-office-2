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

// Global Error Catcher to diagnose Black Screens
window.onerror = function(msg, url, line, col, error) {
  if (app) {
    app.innerHTML = `<div style="padding:2rem; color:#f87171; background:#000; height:100vh; font-family:monospace; font-size:0.8rem;">
      <h2 style="margin-bottom:1rem;">⚠️ ERROR CRÍTICO</h2>
      <p>${msg}</p>
      <p>Línea: ${line}:${col}</p>
      <button onclick="window.location.reload()" style="margin-top:2rem; padding:0.5rem 1rem; background:#f87171; color:#fff; border:none; border-radius:5px;">REINTENTAR CARGA</button>
    </div>`;
  }
  return false;
};

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
    vipListener = onSnapshot(doc(db, 'users', user.uid), (docSnap) => {
      if (!docSnap.exists()) return;
      const incoming = docSnap.data();
      const justActivated = !profileData?.vip && incoming.vip;
      profileData = incoming;
      if (justActivated) showToast('¡VIP ACTIVADO!', 'success');
      if (currentView === 'editor') showPreview();
    });
    if (!profileData || !profileData.locked) {
      const { SetupIdentityView, attachSetupListeners } = await import('./views/SetupIdentityView');
      app.innerHTML = SetupIdentityView(user.email, 'Cédula Blindada');
      attachSetupListeners(async (fullName) => {
        await setupIdentity(user.uid, { fullName, email: user.email });
        navigateBasedOnProfile(user);
      });
    } else {
      showDashboard();
    }
  } catch (error) {
    showToast('Error de conexión.', 'error');
  }
}

async function showDashboard() {
  currentView = 'dashboard';
  const { Dashboard } = await import('./views/Dashboard');
  app.innerHTML = Dashboard(profileData);
  attachDashboardListeners();
  if (!sessionStorage.getItem('privacy_seen')) showPrivacyModal();
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
    app.innerHTML = AdminPanelView(profiles);
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
    const { EditorView, attachEditorListeners } = await import('./views/EditorView.js');
    app.innerHTML = EditorView(fullResumeData, profileData, resumeData.theme);
    
    // Pequeña espera para asegurar que el DOM procesó el HTML antes de ligar listeners
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
subscribeToAuthChanges((user) => {
  if (user) navigateBasedOnProfile(user);
  else { hardReset(); renderAuth('login'); }
});

async function renderAuth(mode) {
  currentView = 'auth';
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
}
