import './style.css';
import { AuthView, attachAuthListeners } from './views/AuthView';
import { SetupIdentityView, attachSetupListeners } from './views/SetupIdentityView';
import { Dashboard } from './views/Dashboard';
import { QuestionnaireView, attachQuestionnaireListeners } from './views/QuestionnaireView';
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

const app = document.querySelector('#app');
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
let currentView = 'auth'; // track where user is

// ─── SECURITY: Hard Session Reset ────────────────────────────────────────────
function hardReset() {
  // Stop any real-time listeners
  if (vipListener) { vipListener(); vipListener = null; }
  currentUser = null;
  profileData = null;
  resumeData = getInitialResumeData();
  currentView = 'auth';
}

// ─── OPTIMIZED ENTRY POINT ───────────────────────────────────────────────────
async function navigateBasedOnProfile(user) {
  // Guarantee clean slate for THIS user before any load
  hardReset();
  currentUser = user;

  // Show instant skeleton while loading
  app.innerHTML = `
    <div class="animate-fade" style="display:grid;place-items:center;height:80vh;text-align:center;">
      <div>
        <div class="glass" style="padding:2rem;border-radius:50%;width:40px;height:40px;margin:0 auto 1rem;border-top:3px solid var(--primary);animation:spin 0.8s linear infinite;"></div>
        <p style="color:var(--text-dim);font-size:0.8rem;">Cargando sesión privada...</p>
      </div>
    </div>`;

  try {
    // Parallel fast fetch
    const [fetchedProfile, fetchedResume] = await Promise.all([
      getUserProfile(user.uid),
      getResumeData(user.uid)
    ]);

    profileData = fetchedProfile;
    // Merge only this user's resume data — never any global state
    resumeData = fetchedResume
      ? { ...getInitialResumeData(), ...fetchedResume }
      : getInitialResumeData();

    // Set up real-time VIP listener after data is clean
    vipListener = onSnapshot(doc(db, 'users', user.uid), (docSnap) => {
      if (!docSnap.exists()) return;
      const incoming = docSnap.data();
      const justActivated = !profileData?.vip && incoming.vip;
      profileData = incoming;

      if (justActivated) {
        showToast('¡ACCESO VIP ACTIVADO!', 'success');
      }

      // If Editor is open, refresh it instantly so downloads unlock
      if (currentView === 'editor') {
        showPreview();
      }
    });

    if (!profileData || !profileData.locked) {
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

function showDashboard() {
  currentView = 'dashboard';
  app.innerHTML = Dashboard(profileData);
  attachDashboardListeners();

  // Show privacy disclaimer once per session
  if (!sessionStorage.getItem('privacy_seen')) {
    showPrivacyModal();
  }
}

function attachDashboardListeners() {
  document.querySelector('#logout-btn')?.addEventListener('click', () => {
    hardReset();
    logout().then(() => {
      // Force reload to wipe all browser memory for next user
      window.location.reload();
    });
  });

  document.querySelector('#start-interview-btn')?.addEventListener('click', () => showStep(0));
  document.querySelector('#direct-editor-btn')?.addEventListener('click', () => showPreview());

  const isPrivileged = profileData?.email === 'ks_mvp@icloud.com' || profileData?.role === 'admin';
  if (isPrivileged) {
    document.querySelector('#super-user-btn')?.addEventListener('click', () => showAdminPanel());
  }
}

async function showAdminPanel() {
  currentView = 'admin';
  app.innerHTML = '<div class="animate-fade"><h3 style="color:var(--primary);text-align:center;margin-top:5rem;">Cargando base de datos VIP...</h3></div>';

  // Lazy-load admin panel only when needed
  const [{ AdminPanelView, attachAdminListeners }] = await Promise.all([
    import('./views/AdminPanelView')
  ]);

  const users = await getAllProfiles();
  app.innerHTML = AdminPanelView(users, currentUser.email);
  attachAdminListeners(
    async (uid, status) => {
      await setVipStatus(uid, status);
      showToast(status ? 'Socio activado ✓' : 'Socio degradado');
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
      showToast('✓ Perfil corregido exitosamente');
      showAdminPanel();
    }
  );
}

function updateAiStatusIndicator(visible) {
  const indicator = document.querySelector('#ai-status-indicator');
  if (indicator) indicator.style.display = visible ? 'flex' : 'none';
}

async function triggerAiRefinement(sectionIndex, dataChunk) {
  isAiRefining = true;
  updateAiStatusIndicator(true);
  const sectionNames = ['Encabezado', 'Perfil', 'Experiencia', 'Habilidades', 'Educación', 'Adicionales', 'Referencias'];
  try {
    const { refineSection } = await import('./services/ai');
    const refined = await refineSection(sectionNames[sectionIndex], dataChunk);
    resumeData = { ...resumeData, ...refined };
    await saveResumeData(currentUser.uid, resumeData);
  } catch (e) {
    console.warn('AI Refinement failed', e);
  } finally {
    isAiRefining = false;
    updateAiStatusIndicator(false);
  }
}

async function showStep(stepIdx) {
  if (stepIdx < 0) return showDashboard();
  if (stepIdx >= 7) return showPreview();

  currentView = 'questionnaire';
  app.innerHTML = QuestionnaireView(resumeData, stepIdx);

  const indicator = document.createElement('div');
  indicator.id = 'ai-status-indicator';
  indicator.style.cssText = 'display:none;position:fixed;bottom:20px;right:20px;background:var(--bg-surface);border:1px solid var(--primary);padding:0.5rem 1rem;border-radius:20px;font-size:0.8rem;color:var(--primary);align-items:center;gap:0.5rem;z-index:100;';
  indicator.innerHTML = '<span style="width:10px;height:10px;border:2px solid var(--primary);border-top-color:transparent;border-radius:50%;display:inline-block;animation:spin 0.8s linear infinite;"></span> IA optimizando...';
  document.body.appendChild(indicator);
  if (isAiRefining) updateAiStatusIndicator(true);

  attachQuestionnaireListeners(
    resumeData,
    stepIdx,
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

async function showPreview() {
  currentView = 'editor';

  // Show instant loading screen while 956KB EditorView chunk downloads
  app.innerHTML = `
    <div class="animate-fade" style="display:grid;place-items:center;height:100vh;text-align:center;background:#0a0b10;">
      <div>
        <div class="glass" style="padding:2rem;border-radius:50%;width:40px;height:40px;margin:0 auto 1rem;border-top:3px solid var(--primary);animation:spin 0.8s linear infinite;"></div>
        <p style="color:var(--primary);font-size:0.9rem;font-weight:600;">Cargando visor...</p>
      </div>
    </div>`;

  const fullResumeData = {
    ...resumeData,
    fullName: profileData?.fullName || 'Usuario',
    email: profileData?.email || '',
    cedula: profileData?.cedula || '',
    vip: profileData?.vip || false
  };

  try {
    // Lazy-load heavy Editor module only when needed
    const { EditorView, attachEditorListeners } = await import('./views/EditorView');

    app.innerHTML = EditorView(fullResumeData, profileData, resumeData.theme);

    attachEditorListeners(
      fullResumeData,
      profileData,
      (updates) => {
        resumeData = { ...resumeData, ...updates };
        saveResumeData(currentUser.uid, resumeData);
        showPreview();
      },
      () => showDashboard()
    );
  } catch (err) {
    console.error('Error cargando editor:', err);
    showToast('Error al abrir el visor. Intenta de nuevo.', 'error');
    showDashboard();
  }
}

// ─── AUTH BOOTSTRAP ──────────────────────────────────────────────────────────
subscribeToAuthChanges((user) => {
  if (user) {
    navigateBasedOnProfile(user);
  } else {
    hardReset();
    renderAuth('login');
  }
});

function renderAuth(mode) {
  currentView = 'auth';
  app.innerHTML = AuthView(mode);
  attachAuthListeners(
    mode,
    (newMode) => renderAuth(newMode),
    async (m, email, passwordOrCedula, realPassword, extraData) => {
      if (m === 'login') {
        // Login: email + password (existing users: cedula is their password)
        try {
          await login(email, passwordOrCedula);
          showToast('Acceso validado.');
        } catch (err) {
          showToast('Credenciales incorrectas.', 'error');
        }
      } else {
        // Register: email + realPassword + full profile data
        const { fullName, cedula, nationality } = extraData || {};
        if (!fullName) return showToast('Ingresa tus nombres completos.', 'error');
        try {
          const userCred = await register(email, realPassword);
          // Immediately save full profile locked
          await setupIdentity(userCred.user.uid, {
            fullName,
            email,
            cedula,
            nationality: nationality || 'Ecuatoriana',
            locked: true
          });
          showToast('Cuenta creada exitosamente.');
        } catch (err) {
          const msg = err.code === 'auth/email-already-in-use'
            ? 'Este correo ya está registrado.'
            : 'Error al crear la cuenta. Intenta de nuevo.';
          showToast(msg, 'error');
        }
      }
    }
  );
}
