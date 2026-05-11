  // ─── CRITICAL ERROR CATCHER (TOP LEVEL) ──────────────────────────────────
window.onerror = function(msg, url, line, col, error) {
  if (!url || line === 0 || msg === 'Script error.' || msg === 'Script error') return true;
  const app = document.querySelector('#app');
  const splash = document.querySelector('#app-splash');
  // Solo mostrar error si la app no ha renderizado contenido real aún
  if (app && splash) {
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
// NOTA: doc, onSnapshot, db y showPrivacyModal se cargan dinámicamente donde se necesitan
// para reducir el bundle principal y acelerar el inicio.

// ─── INITIALIZATION ──────────────────────────────────────────────────────────
const app = document.querySelector('#app');

// El splash screen ya es visible desde el HTML estático (0ms).
// Solo actualizamos el texto si el usuario ya tenía sesión activa.
if (app && localStorage.getItem('hv_session')) {
  const splash = document.querySelector('#app-splash p');
  if (splash) splash.textContent = 'Reconectando tu sesión...';
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
    
    if (approved) {
      // 🎉 CELEBRACIÓN: Confeti al volver
      if (window.confetti) {
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ['#c5a059', '#ffffff', '#4ade80'] });
      }
      // 📱 NOTIFICACIÓN: WhatsApp al Admin
      import('./services/auth').then(m => m.notifyNewSale(profileData, result.amount));
    }

    const banner = document.createElement('div');
    banner.style.cssText = `position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.95);display:grid;place-items:center;z-index:99999;font-family:sans-serif;`;
    banner.innerHTML = `
      <div style="text-align:center;padding:2rem;max-width:380px;">
        <div style="font-size:4rem;margin-bottom:1rem;">${approved ? '✅' : '❌'}</div>
        <h2 style="color:${approved ? '#4ade80' : '#f87171'};margin:0 0 0.8rem;">
          ${approved ? '¡Pago Aprobado!' : 'Pago No Completado'}
        </h2>
        <p style="color:#e0e0e0;font-size:0.85rem;margin-bottom:0.5rem;">
          ${approved ? 'Tu cuenta VIP ha sido activada exitosamente.' : 'La transacción no fue aprobada. Intenta nuevamente.'}
        </p>
        ${result.authCode ? `<p style="color:#a0a0a0;font-size:0.7rem;">Código: ${result.authCode}</p>` : ''}
        ${approved ? `<button id="pp-download-receipt" style="margin-top:1rem;background:none;border:1px solid rgba(197,160,89,0.4);color:#c5a059;padding:0.6rem 1.5rem;border-radius:8px;font-size:0.8rem;cursor:pointer;width:100%;">📄 DESCARGAR RECIBO</button>` : ''}
        <button id="pp-result-btn" style="margin-top:0.8rem;background:${approved ? '#4ade80' : '#c5a059'};color:#000;border:none;padding:0.9rem 2rem;border-radius:8px;font-weight:bold;font-size:1rem;cursor:pointer;width:100%;">
          CONTINUAR
        </button>
      </div>`;
    document.body.appendChild(banner);

    // Guardar datos de pago en Firestore para el recibo
    if (approved && uid) {
      savePaymentData(uid, {
        method: 'payphone',
        amount: result.amount || 100,
        authCode: result.authCode || '',
        clientTxId: result.clientTxId || '',
        status: 'Approved'
      });
    }

    document.getElementById('pp-download-receipt')?.addEventListener('click', async () => {
      const { downloadPaymentReceipt } = await import('./components/PaymentReceipt');
      const paymentInfo = await getPaymentData(uid);
      await downloadPaymentReceipt(paymentInfo || { method: 'payphone', authCode: result.authCode }, profileData);
    });
    
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
  localStorage.removeItem('hv_session'); // Limpiar hint de sesión al cerrar
}

async function navigateBasedOnProfile(user) {
  hardReset();
  currentUser = user;
  localStorage.setItem('hv_session', '1'); // Hint para el próximo inicio
  app.innerHTML = `<div style="display:grid;place-items:center;height:100vh;text-align:center;"><div class="glass" style="padding:2rem;border-radius:50%;width:30px;height:30px;margin:0 auto 1rem;border-top:3px solid var(--primary);animation:spin 0.8s linear infinite;"></div><p style="color:var(--text-dim);font-size:0.75rem;">Sincronizando perfil...</p></div>`;
  
  // ─── CONTROL DE CONCURRENCIA (SESIÓN ÚNICA) ───
  let localSessionId = sessionStorage.getItem('app_session_id');
  if (!localSessionId) {
    localSessionId = Date.now().toString(36) + Math.random().toString(36).substring(2);
    sessionStorage.setItem('app_session_id', localSessionId);
  }

  try {
    const [fetchedProfile, fetchedResume] = await Promise.all([
      getUserProfile(user.uid),
      getResumeData(user.uid)
    ]);
    profileData = fetchedProfile;
    resumeData = fetchedResume ? { ...getInitialResumeData(), ...fetchedResume } : getInitialResumeData();

    // ── Actualizar la sesión maestra en la base de datos ──
    if (profileData) {
      await updateUserProfile(user.uid, { sessionId: localSessionId });
    }

    // ── AUTO-ASIGNAR role='master' si es la cuenta principal ──────
    // Esto garantiza que el Panel Admin siempre sea visible, sin depender
    // de comparaciones de email en el cliente.
    if (user.email === 'ks_mvp@icloud.com' && profileData?.role !== 'master') {
      await setUserRole(user.uid, 'master');
      profileData = { ...profileData, role: 'master' };
    }

    // Cargar Firestore dinámicamente para el listener en tiempo real
    const [{ doc, onSnapshot }, { db }] = await Promise.all([
      import('firebase/firestore'),
      import('./services/firebase')
    ]);
    vipListener = onSnapshot(doc(db, 'users', user.uid), (docSnap) => {
      if (!docSnap.exists()) return;
      const incoming = docSnap.data();
      
      // ─── VERIFICAR MULTIPANTALLA ───
      if (incoming.sessionId && incoming.sessionId !== localSessionId) {
        showToast('Sesión cerrada: Alguien inició sesión en tu cuenta desde otro dispositivo.', 'error');
        setTimeout(() => {
          hardReset();
          logout().then(() => window.location.reload());
        }, 2500);
        return; // Detener flujo
      }

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
    } else if (profileData.role === 'partner') {
      showPartnerPanel();
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
    if (!sessionStorage.getItem('privacy_seen')) {
      import('./components/PrivacyModal').then(m => m.showPrivacyModal());
    }
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
  
  // Botón de descarga de recibo de pago (solo visible para VIP)
  document.querySelector('#download-receipt-btn')?.addEventListener('click', async () => {
    showToast('Generando recibo...');
    try {
      const { downloadPaymentReceipt } = await import('./components/PaymentReceipt');
      const paymentInfo = await getPaymentData(currentUser.uid);
      if (!paymentInfo) {
        showToast('No se encontró registro de pago. Contacta soporte.', 'error');
        return;
      }
      await downloadPaymentReceipt(paymentInfo, profileData);
      showToast('Recibo descargado ✓');
    } catch (err) {
      showToast('Error al generar recibo.', 'error');
    }
  });
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
        showToast(`Estado VIP ${isVip ? 'Activado ⭐' : 'Desactivado'}`);
        // No recargar — el DOM ya se actualiza con la lógica optimista en AdminPanelView
      },
      async (uid, currentRole, name) => {
        try {
          if (currentRole === 'partner_sub') {
            const { activatePartnerSubscription } = await import('./services/auth');
            await activatePartnerSubscription(uid, 1);
            showToast(`✅ Socio ${name} activado por 30 días.`, 'success');
          } else {
            const newRole = currentRole === 'admin' ? 'user' : 'admin';
            await setUserRole(uid, newRole);
            showToast(`Rol de ${name} → ${newRole.toUpperCase()}.`, 'success');
          }
          // No recargar — el DOM ya se actualiza con la lógica optimista en AdminPanelView
        } catch (err) {
          showToast(`❌ Error: ${err.message}`, 'error');
        }
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

async function showPartnerPanel() {
  currentView = 'partner_dashboard';
  app.innerHTML = `<div style="display:grid;place-items:center;height:100vh;text-align:center;"><div class="glass" style="padding:2rem;border-radius:50%;width:30px;height:30px;margin:0 auto 1rem;border-top:3px solid var(--primary);animation:spin 0.8s linear infinite;"></div><p style="color:var(--primary);font-size:0.8rem;">Cargando Panel de Socio...</p></div>`;
  
  try {
    const { PartnerDashboardView, attachPartnerListeners } = await import('./views/PartnerDashboard');
    
    // Calcular días restantes
    const expires = profileData.subExpires ? new Date(profileData.subExpires) : new Date();
    const diff = expires - new Date();
    const daysRemaining = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));

    app.innerHTML = PartnerDashboardView(profileData, { daysRemaining });
    
    attachPartnerListeners(
      async (clientName, clientCedula) => {
        // 🚀 MODO VOLÁTIL: Iniciamos CV limpio para el cliente
        resumeData = { ...getInitialResumeData(), fullName: clientName, cedula: clientCedula };
        showStep(0);
      },
      () => { hardReset(); logout(); },
      () => { 
        // 💳 RENOVACIÓN AUTOMÁTICA CON PAYPHONE ($10)
        showPartnerRenewalPaywall(profileData.uid);
      }
    );
  } catch (err) {
    showToast('Error al cargar panel de socio.', 'error');
  }
}

async function showPartnerRenewalPaywall(uid) {
  const container = document.createElement('div');
  container.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.9);display:grid;place-items:center;z-index:99999;padding:1.5rem;';
  container.innerHTML = `
    <div class="glass" style="width:100%; max-width:400px; padding:2rem; text-align:center;">
      <h3 style="color:#c5a059; margin-bottom:1rem;">Renovación de Membresía</h3>
      <p style="font-size:0.8rem; color:#a0a0b0; margin-bottom:2rem;">Pago de suscripción mensual ilimitada por $10.00 USD.</p>
      <div id="pp-partner-button"></div>
      <button id="close-pp-partner" style="margin-top:2rem; background:none; border:none; color:#f87171; font-size:0.8rem; cursor:pointer;">Cancelar</button>
    </div>
  `;
  document.body.appendChild(container);

  document.getElementById('close-pp-partner').onclick = () => container.remove();

  const waitForPayPhone = (attempts = 0) => {
    if (window.payphone) {
      const payphone = window.payphone.checkout({
        token: "N9p3VvRreU8_4r_55mO6T9eDOfN0YyW_nS1rNf_U6X-wXh2vXzO",
        amount: 1000, // $10.00
        clientTransactionId: `SUB_${uid}_${Date.now()}`,
        currency: "USD"
      });

      payphone.on((result) => {
        if (result && result.status === 'Approved') {
          import('./services/auth').then(async m => {
            await m.activatePartnerSubscription(uid, 1);
            showToast('¡Suscripción Renovada con Éxito!', 'success');
            container.remove();
            showPartnerPanel(); // Recargar panel
          });
        }
      });
      payphone.render("#pp-partner-button");
    } else if (attempts < 20) {
      setTimeout(() => waitForPayPhone(attempts + 1), 300);
    }
  };
  waitForPayPhone();
}

async function showStep(stepIdx) {
  if (stepIdx < 0) return showDashboard();
  if (stepIdx >= 7) return showPreview();
  currentView = 'questionnaire';

  // Si es un Socio creando CV para un cliente, usar SOLO resumeData (datos del cliente)
  // para evitar que la cédula del Socio reemplace la del cliente
  const isPartnerMode = profileData?.role === 'partner';
  const fullData = { 
    ...resumeData, 
    cedula: isPartnerMode ? (resumeData?.cedula || '') : (profileData?.cedula || resumeData?.cedula || '')
  };

  try {
    const { QuestionnaireView, attachQuestionnaireListeners } = await import('./views/QuestionnaireView');
    app.innerHTML = QuestionnaireView(fullData, stepIdx);
    attachQuestionnaireListeners(fullData, stepIdx, 
      async (stepData) => {
        resumeData = { ...resumeData, ...stepData };
        await saveResumeData(currentUser.uid, resumeData);
        if ([1, 2, 3, 4, 5].includes(stepIdx)) triggerAiRefinement(stepIdx, stepData);
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
      }, () => showDashboard(), () => showStep(0));
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
    }, async (email) => {
      if (!email) return showToast('Ingresa tu correo para recuperar la clave.', 'info');
      try {
        const { resetPassword } = await import('./services/auth');
        await resetPassword(email);
        showToast('Enlace de recuperación enviado a tu correo.');
      } catch (err) {
        showToast('No se pudo enviar el correo. Verifica el email.', 'error');
      }
    });
  } catch (e) {
    console.error('Auth Load Fail', e);
  }
}
