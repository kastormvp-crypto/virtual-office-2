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
document.addEventListener('contextmenu', (e) => {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
    return true;
  }
  e.preventDefault();
});
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
import { initAiAssistant } from './components/AiAssistant';
import { startOnboarding } from './components/OnboardingTour';
import { showTransferModal } from './components/TransferModal';
import { showBotMessage, showBotFinal } from './components/BotMessage';
import { trackVisit, getTrafficData } from './services/analytics';
import './style.css';
import {
  subscribeToAuthChanges, login, register, logout, getUserProfile, setupIdentity,
  saveResumeData, getResumeData, getAllProfiles, setVipStatus, setUserRole,
  updateUserProfile, updateUserCedulaInResume, savePaymentData, getPaymentData,
  deleteUserAccount, deleteCurrentAuthUser, resetPassword
} from './services/auth';

// ─── OPTIMIZACIÓN DE ARRANQUE INMEDIATO (PUBLIC CV) ───────────────────
const app = document.querySelector('#app');
const path = window.location.pathname;

if (path.startsWith('/cv/')) {
  const uid = path.split('/cv/')[1];
  import('./views/PublicCvView').then(m => m.showPublicCV(uid));
} else {
  // Lógica de Confianza: 10 min para desconocidos, Sin límite para habituales
  const isTrustedDevice = () => localStorage.getItem('hv_trusted_device') === 'true';
  const INACTIVITY_LIMIT = isTrustedDevice() ? 0 : 10 * 60 * 1000; 

  let inactivityTimer;
  let lastInactivityReset = 0;

  function resetInactivityTimer() {
    if (INACTIVITY_LIMIT === 0) return; // No hay límite para equipos de confianza
    
    // THROTTLE: Evitar recomputar el timer miles de veces por segundo (previene congelamientos)
    const now = Date.now();
    if (now - lastInactivityReset < 5000) return; 
    lastInactivityReset = now;

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

  // ─── AUTOCORRECTOR INTELIGENTE GLOBAL (Aplica a toda la aplicación) ───
  document.addEventListener('blur', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
      let val = e.target.value;
      if (!val || e.target.type === 'password' || e.target.type === 'email') return;

      const id = e.target.id || '';
      const classes = e.target.className || '';

      // 1. Capitalizar cada palabra
      if (id === 'setup-fullname' || id === 'reg-firstname' || id === 'reg-lastname' || id === 'client-name' || id === 'field-title' || id === 'field-location' || id === 'reg-nationality' || classes.includes('exp-company') || classes.includes('exp-role') || classes.includes('exp-supervisor') || classes.includes('edu-school') || classes.includes('edu-degree') || classes.includes('ref-name') || classes.includes('ref-relation')) {
        e.target.value = val.split(' ').map(word => {
          if (!word) return '';
          return word.charAt(0).toUpperCase() + word.slice(1);
        }).join(' ');
      }
      // 2. Capitalizar el inicio de cada oración
      else if (id === 'field-summary' || classes.includes('exp-achievements') || id === 'field-certifications') {
        e.target.value = val.replace(/(^\s*|[.!?]\s+)([¡¿]?)([a-zñáéíóúü])/gi, (match, separator, inverted, letter) => {
          return separator + (inverted || '') + letter.toUpperCase();
        });
      }
    }
  }, true);

  const payphoneReturnPromise = handlePayPhoneReturn();
  
  initAiAssistant();
  trackVisit(); // Registro de visita diaria — silencioso, sin bloquear

  subscribeToAuthChanges(async (user) => {
    await payphoneReturnPromise;

    if (user) navigateBasedOnProfile(user);
    else {
      hardReset();
      if (!sessionStorage.getItem('skip_landing')) showLanding();
      else renderAuth('login');
    }
  });
}

// ─── ESTADO GLOBAL ───
let currentUser = null;
let profileData = null;
let vipListener = null;
let pendingGoogleProfile = null; // Datos capturados en el registro con Google
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
  app.innerHTML = `<div style="display:grid;place-items:center;height:100vh;background:#0a0b10;color:#c5a059;text-align:center;"><div class="neon-loader-wrapper"><div class="neon-ring"></div><div class="neon-ring"></div></div><p style="letter-spacing:2px; font-size:0.8rem; font-weight:bold; color:#fff;">CARGANDO...</p></div>`;
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
  app.innerHTML = `<div style="display:grid;place-items:center;height:100vh;text-align:center;"><div class="neon-loader-wrapper"><div class="neon-ring"></div><div class="neon-ring"></div></div><p style="letter-spacing:2px; font-size:0.8rem; font-weight:bold; color:#fff;">CARGANDO...</p></div>`;
  const localSessionId = sessionStorage.getItem('app_session_id') || (Date.now().toString(36) + Math.random().toString(36).substring(2));
  sessionStorage.setItem('app_session_id', localSessionId);

  try {
    const [fetchedProfile, fetchedResume] = await Promise.all([ getUserProfile(user.uid), getResumeData(user.uid) ]);
    profileData = fetchedProfile;
    if (profileData) profileData.uid = user.uid;
    resumeData = fetchedResume ? { ...resumeData, ...fetchedResume } : resumeData;
    // BUG FIX: Inyectar cédula del perfil (users/) en resumeData solo para usuarios normales.
    // Los socios no tienen cédula propia en el cuestionario; la ingresan por cliente.
    if (profileData?.cedula && profileData.role !== 'partner') {
      resumeData.cedula = profileData.cedula;
    }

    if (profileData) await updateUserProfile(user.uid, { sessionId: localSessionId });

    // Carga de Listener en tiempo real (Optimizado con Periodo de Gracia de 10s)
    const { doc, onSnapshot, db } = await import('firebase/firestore').then(async m => ({ ...m, db: m.getFirestore((await import('./services/firebase')).default) }));
    
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
      if (profileData) profileData.uid = user.uid;
      if (currentView === 'editor') showPreview();
    });

    if (!profileData?.locked) {
      // Flujo Google Register: usar datos del formulario capturados antes del popup
      if (pendingGoogleProfile) {
        const profile = { ...pendingGoogleProfile };
        pendingGoogleProfile = null;
        await setupIdentity(user.uid, { ...profile, email: user.email, locked: true });
        navigateBasedOnProfile(user);
        return;
      }
      const { SetupIdentityView, attachSetupListeners } = await import('./views/SetupIdentityView');
      app.innerHTML = SetupIdentityView(user.email);
      attachSetupListeners(async ({ fullName, cedula }) => {
        await setupIdentity(user.uid, { fullName, cedula, email: user.email, locked: true });
        navigateBasedOnProfile(user);
      });
    } else if (profileData.role === 'partner') {
      showPartnerPanel();
    } else {
      showDashboard();
      showPayPhoneResultIfPending(user.uid);
    }
  } catch (error) { console.error(error); showToast('Error de conexión: ' + error.message, 'error'); }
}

async function showDashboard() {
  currentView = 'dashboard';
  try {
    const { Dashboard } = await import('./views/Dashboard');
    app.innerHTML = Dashboard(profileData);
    attachDashboardListeners();
  } catch (err) {
    console.error("Chunk load error:", err);
    // Vercel deployment cache issue: If old main.js tries to load old Dashboard.js, reload to get new assets.
    window.location.reload(true);
  }
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

  // Listener de Eliminar Cuenta Propia
  document.querySelector('#delete-account-btn')?.addEventListener('click', () => {
    const overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.92);display:grid;place-items:center;z-index:99999;padding:1rem;backdrop-filter:blur(6px);box-sizing:border-box;';
    overlay.innerHTML = `
      <div style="max-width:360px;width:100%;background:#0f1018;border:1px solid rgba(248,113,113,0.3);border-radius:20px;padding:2rem 1.5rem;text-align:center;position:relative;box-sizing:border-box;">
        <div style="font-size:2.5rem;margin-bottom:1rem;">⚠️</div>
        <h3 style="color:#f87171;margin:0 0 0.6rem;font-size:1.1rem;letter-spacing:1px;">ELIMINAR MI CUENTA</h3>
        <p style="color:#a0a0b0;font-size:0.82rem;margin-bottom:0.8rem;line-height:1.6;">
          Esta acción eliminará <strong style="color:#fff;">permanentemente</strong> tu cuenta y toda tu información:
          perfil, hoja de vida y datos de pago.
        </p>
        <p style="color:#f87171;font-size:0.78rem;margin-bottom:1.8rem;line-height:1.5;">
          No podrás recuperar estos datos. Podrás volver a registrarte con el mismo correo o Google sin problema.
        </p>
        <div style="display:flex;flex-direction:column;gap:0.8rem;">
          <button id="confirm-delete-account-btn" style="padding:0.9rem;border-radius:10px;border:none;background:#f87171;color:#000;font-weight:700;font-size:0.85rem;cursor:pointer;letter-spacing:1px;">SÍ, ELIMINAR MI CUENTA</button>
          <button id="cancel-delete-account-btn" style="padding:0.7rem;border-radius:10px;background:none;border:1px solid rgba(255,255,255,0.1);color:#a0a0b0;font-size:0.8rem;cursor:pointer;">Cancelar</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);

    document.getElementById('cancel-delete-account-btn').onclick = () => overlay.remove();
    overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });

    document.getElementById('confirm-delete-account-btn').onclick = async () => {
      const btn = document.getElementById('confirm-delete-account-btn');
      btn.disabled = true;
      btn.textContent = 'Eliminando...';
      try {
        const uid = currentUser.uid;
        // 1. Borrar datos de Firestore primero
        await deleteUserAccount(uid);
        // 2. Borrar usuario de Firebase Auth
        await deleteCurrentAuthUser();
        // 3. Limpiar estado local y recargar
        localStorage.removeItem('hv_trusted_device');
        overlay.remove();
        showToast('Tu cuenta ha sido eliminada correctamente.', 'success');
        setTimeout(() => window.location.reload(), 1500);
      } catch (err) {
        const code = err?.code || '';
        if (code === 'auth/requires-recent-login') {
          btn.disabled = false;
          btn.textContent = 'SÍ, ELIMINAR MI CUENTA';
          overlay.remove();
          showToast('Por seguridad, cierra sesión, vuelve a ingresar y luego elimina tu cuenta.', 'error');
        } else {
          btn.disabled = false;
          btn.textContent = 'Error — Reintentar';
          showToast('Error al eliminar: ' + (err?.message || 'Intenta de nuevo.'), 'error');
        }
      }
    };
  });

  // Listener de Descarga de Tarjeta de Contacto Premium (Sin QR, Negro Mate y Elegancia Pura)
  document.querySelector('#download-qr-btn')?.addEventListener('click', () => {
    showToast('Generando tu Tarjeta de Contacto Premium...', 'info');

    const uid = currentUser.uid;
    const name = profileData.fullName || 'Profesional Certificado';
    const title = resumeData.title || 'Especialista';
    const phone = resumeData.phone || '';
    const email = profileData.email || currentUser.email || '';
    const photoUrl = resumeData.photoUrl || '';

    // Cargar foto si existe
    let photoImg = null;
    const promises = [];
    if (photoUrl) {
      photoImg = new Image();
      photoImg.crossOrigin = "anonymous";
      const photoPromise = new Promise((resolve) => {
        photoImg.onload = () => resolve(photoImg);
        photoImg.onerror = () => resolve(null);
      });
      photoImg.src = photoUrl;
      promises.push(photoPromise);
    }

    const runRender = (photoLoaded) => {
      // Crear canvas dinámico de alta definición (300 DPI estándar para tarjetas de 3.5" x 2")
      const canvas = document.createElement('canvas');
      canvas.width = 1050;
      canvas.height = 600;
      const ctx = canvas.getContext('2d');

      // 1. Fondo Negro Mate de Lujo Absoluto
      const grad = ctx.createLinearGradient(0, 0, 1050, 600);
      grad.addColorStop(0, '#0a0a0d'); // Negro mate puro
      grad.addColorStop(0.5, '#0f0f13');
      grad.addColorStop(1, '#14141a');   
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1050, 600);

      // 2. Líneas Geométricas de Acentuación en Oro (Textura Ejecutiva)
      ctx.strokeStyle = 'rgba(197, 160, 89, 0.07)';
      ctx.lineWidth = 1.5;
      for (let i = 0; i < 7; i++) {
        ctx.beginPath();
        ctx.moveTo(0, 80 + i * 90);
        ctx.lineTo(1050, 180 + i * 90);
        ctx.stroke();
      }

      // 3. Marco de Borde de Oro Ejecutivo
      ctx.strokeStyle = '#c5a059';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      const r = 24; 
      const margin = 25;
      const w = 1050 - 2 * margin;
      const h = 600 - 2 * margin;
      if (ctx.roundRect) {
        ctx.roundRect(margin, margin, w, h, r);
      } else {
        ctx.rect(margin, margin, w, h);
      }
      ctx.stroke();

      let textStartX = 100;
      let textWidth = 850;

      // Dibujar la foto de perfil en formato cuadrado grande con esquinas redondeadas
      if (photoLoaded) {
        const px = 90;
        const py = 140;
        const pSize = 320;
        const pRad = 24;

        ctx.save();
        ctx.beginPath();
        if (ctx.roundRect) {
          ctx.roundRect(px, py, pSize, pSize, pRad);
        } else {
          ctx.rect(px, py, pSize, pSize);
        }
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(photoLoaded, px, py, pSize, pSize);
        ctx.restore();

        // Marco dorado de la foto
        ctx.strokeStyle = '#c5a059';
        ctx.lineWidth = 4;
        ctx.beginPath();
        if (ctx.roundRect) {
          ctx.roundRect(px, py, pSize, pSize, pRad);
        } else {
          ctx.rect(px, py, pSize, pSize);
        }
        ctx.stroke();

        // Línea vertical divisoria elegante
        ctx.strokeStyle = 'rgba(197, 160, 89, 0.2)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(455, 140);
        ctx.lineTo(455, 460);
        ctx.stroke();

        textStartX = 500;
        textWidth = 460;
      }

      // NOMBRE Y APELLIDO (Tamaño grande, centrado o a la derecha)
      // NOMBRE Y APELLIDO (Tamaño grande, centrado o a la derecha)
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 50px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.fillText(name.toUpperCase(), textStartX, photoLoaded ? 170 : 200, textWidth);

      // Datos de Contacto (Teléfono y Correo estrictamente)
      ctx.fillStyle = '#ffffff';
      ctx.font = '300 22px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
      
      let contactY = photoLoaded ? 265 : 295;
      if (phone) {
        ctx.fillText(`📞   ${phone}`, textStartX, contactY, textWidth);
        contactY += 60;
      }
      ctx.fillStyle = '#a0a0b0';
      ctx.fillText(`📧   ${email}`, textStartX, contactY, textWidth);

      // 7. Marca Distintiva "TU INFORMACIÓN VIRTUAL" (Rayo Plateado Elegante emoji ⚡)
      ctx.fillStyle = '#c5a059';
      ctx.font = 'bold 20px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
      ctx.fillText('⚡   TU INFORMACIÓN VIRTUAL', textStartX, photoLoaded ? 430 : 455, textWidth);

      // 8. Sistema Híbrido de Compartir Nativo / Descarga Directa
      const triggerDirectDownload = () => {
        try {
          const link = document.createElement('a');
          link.download = `Tarjeta_Contacto_${name.replace(/\s+/g, '_')}.png`;
          link.href = canvas.toDataURL('image/png');
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          showToast('✓ ¡Tu Tarjeta de Contacto ha sido descargada!', 'success');
        } catch (err) {
          showToast('Error al descargar la tarjeta.', 'error');
        }
      };

      try {
        canvas.toBlob((blob) => {
          if (!blob) {
            triggerDirectDownload();
            return;
          }
          const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
          const file = new File([blob], `Tarjeta_Contacto_${name.replace(/\s+/g, '_')}.png`, { type: 'image/png' });
          if (isMobile && navigator.canShare && navigator.canShare({ files: [file] })) {
            navigator.share({
              files: [file],
              title: 'Mi Tarjeta de Contacto',
              text: `Hola, esta es mi Tarjeta de Contacto Personal.`
            }).then(() => {
              showToast('✓ ¡Compartido con éxito!', 'success');
            }).catch((err) => {
              if (err && err.name !== 'AbortError') {
                triggerDirectDownload();
              }
            });
          } else {
            triggerDirectDownload();
          }
        }, 'image/png');
      } catch (err) {
        triggerDirectDownload();
      }
    };

    if (promises.length > 0) {
      Promise.all(promises).then((results) => {
        runRender(results[0]);
      }).catch(() => {
        runRender(null);
      });
    } else {
      runRender(null);
    }
  });

  // Listener de Tarjeta Laboral (Generador de Tarjeta de Información Laboral Premium)
  document.querySelector('#download-laboral-btn')?.addEventListener('click', () => {
    showToast('Generando tu Tarjeta Laboral Premium...', 'info');

    const uid = currentUser.uid;
    const name = profileData.fullName || 'Profesional Certificado';
    const title = resumeData.title || 'Hoja de Vida Digital';
    const photoUrl = resumeData.photoUrl || '';
    
    // Obtener habilidades principales o usar placeholders elegantes
    const rawSkills = resumeData.hardSkills || [];
    const skills = rawSkills.filter(s => s).slice(0, 4);
    if (skills.length < 4) {
      const placeholders = ['Liderazgo y Gestión', 'Trabajo en Equipo', 'Resolución de Problemas', 'Comunicación Asertiva'];
      while (skills.length < 4) {
        skills.push(placeholders[skills.length]);
      }
    }

    // Carga asíncrona robusta de recursos gráficos
    const promises = [];

    // 1. Carga del Código QR
    const qrImg = new Image();
    qrImg.crossOrigin = "anonymous";
    const qrPromise = new Promise((resolve, reject) => {
      qrImg.onload = () => resolve(qrImg);
      qrImg.onerror = () => reject();
    });
    qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&color=111217&bgcolor=ffffff&data=${encodeURIComponent(window.location.origin + '/cv/' + uid)}`;
    promises.push(qrPromise);

    // 2. Carga de la Foto de Perfil (Opcional)
    let photoImg = null;
    if (photoUrl) {
      photoImg = new Image();
      photoImg.crossOrigin = "anonymous";
      const photoPromise = new Promise((resolve) => {
        photoImg.onload = () => resolve(photoImg);
        photoImg.onerror = () => resolve(null);
      });
      photoImg.src = photoUrl;
      promises.push(photoPromise);
    }

    Promise.all(promises).then((results) => {
      const qrLoaded = results[0];
      const photoLoaded = photoUrl ? results[1] : null;

      const canvas = document.createElement('canvas');
      canvas.width = 1050;
      canvas.height = 600;
      const ctx = canvas.getContext('2d');

      // 1. Fondo Degradado de Lujo (Deep Navy Azul Ejecutivo)
      const grad = ctx.createLinearGradient(0, 0, 1050, 600);
      grad.addColorStop(0, '#10141d'); 
      grad.addColorStop(0.5, '#162032');
      grad.addColorStop(1, '#1b2c45');   
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1050, 600);

      // 2. Líneas Geométricas de Acentuación en Oro (Micro-textura elegante)
      ctx.strokeStyle = 'rgba(197, 160, 89, 0.08)';
      ctx.lineWidth = 1.5;
      for (let i = 0; i < 7; i++) {
        ctx.beginPath();
        ctx.moveTo(0, 80 + i * 90);
        ctx.lineTo(1050, 180 + i * 90);
        ctx.stroke();
      }

      // 3. Marco de Borde Fino de Oro Ejecutivo
      ctx.strokeStyle = '#c5a059';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      const r = 24; 
      const margin = 25;
      const w = 1050 - 2 * margin;
      const h = 600 - 2 * margin;
      if (ctx.roundRect) {
        ctx.roundRect(margin, margin, w, h, r);
      } else {
        ctx.rect(margin, margin, w, h);
      }
      ctx.stroke();

      // 4. Barra Vertical de Oro como acento en el lateral izquierdo
      ctx.fillStyle = '#c5a059';
      ctx.fillRect(55, 120, 5, 360);

      // 5. Contenedor del QR en el lado derecho
      const qx = 670;
      const qy = 145;
      const qw = 310;
      const qh = 310;
      
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(qx, qy, qw, qh, 20);
      } else {
        ctx.rect(qx, qy, qw, qh);
      }
      ctx.fill();
      
      ctx.strokeStyle = '#c5a059';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      ctx.drawImage(qrLoaded, qx + 20, qy + 20, 270, 270);

      // 6. Configuración de Coordenadas de Texto
      let textStartX = 85;
      let textWidth = 540;

      // Dibujar foto de perfil si está cargada
      if (photoLoaded) {
        ctx.save();
        ctx.beginPath();
        if (ctx.roundRect) {
          ctx.roundRect(85, 100, 120, 120, 16);
        } else {
          ctx.rect(85, 100, 120, 120);
        }
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(photoLoaded, 85, 100, 120, 120);
        ctx.restore();

        ctx.strokeStyle = '#c5a059';
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        if (ctx.roundRect) {
          ctx.roundRect(85, 100, 120, 120, 16);
        } else {
          ctx.rect(85, 100, 120, 120);
        }
        ctx.stroke();

        textStartX = 230;
        textWidth = 405;
      }

      // NOMBRE COMPLETO
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 44px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.fillText(name.toUpperCase(), textStartX, 115, textWidth);

      // TÍTULO PROFESIONAL
      ctx.fillStyle = '#c5a059';
      ctx.font = '500 20px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
      ctx.fillText(title.toUpperCase(), textStartX, 180, textWidth);

      // SECCIÓN: HABILIDADES CLAVE (LADO IZQUIERDO)
      ctx.fillStyle = '#c5a059';
      ctx.font = 'bold 16px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
      ctx.fillText('HABILIDADES CLAVE', 85, 255);

      ctx.fillStyle = '#a0a0b0';
      ctx.font = '300 18px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
      
      // Dibujar 2x2 grid de Habilidades Clave con balas de rayo
      ctx.fillText(`⚡  ${skills[0]}`, 85, 290, 260);
      ctx.fillText(`⚡  ${skills[1]}`, 365, 290, 260);
      ctx.fillText(`⚡  ${skills[2]}`, 85, 330, 260);
      ctx.fillText(`⚡  ${skills[3]}`, 365, 330, 260);

      // Mensaje Instructivo
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.font = 'italic 16px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
      ctx.fillText('⚡ Escanee el código QR para ver mi Hoja de Vida en tiempo real', 85, 385, 540);

      // 7. Marca Distintiva "TU INFORMACIÓN VIRTUAL"
      ctx.fillStyle = '#c5a059';
      ctx.font = 'bold 18px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
      ctx.fillText('⚡   TU INFORMACIÓN VIRTUAL', 85, 450, 540);

      // 8. Descarga / Compartir Híbrido
      const triggerDirectDownload = () => {
        try {
          const link = document.createElement('a');
          link.download = `Tarjeta_Laboral_${name.replace(/\s+/g, '_')}.png`;
          link.href = canvas.toDataURL('image/png');
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          showToast('✓ ¡Tu Tarjeta Laboral ha sido descargada!', 'success');
        } catch (err) {
          window.open(qrLoaded.src, '_blank');
          showToast('✓ Mantén presionado el código QR para guardarlo.', 'success');
        }
      };

      try {
        canvas.toBlob((blob) => {
          if (!blob) {
            triggerDirectDownload();
            return;
          }
          const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
          const file = new File([blob], `Tarjeta_Laboral_${name.replace(/\s+/g, '_')}.png`, { type: 'image/png' });
          if (isMobile && navigator.canShare && navigator.canShare({ files: [file] })) {
            navigator.share({
              files: [file],
              title: 'Mi Tarjeta Laboral',
              text: `Hola, esta es mi Tarjeta de Información Laboral de Tu Información Virtual.`
            }).then(() => {
              showToast('✓ ¡Compartido con éxito!', 'success');
            }).catch((err) => {
              if (err && err.name !== 'AbortError') {
                triggerDirectDownload();
              }
            });
          } else {
            triggerDirectDownload();
          }
        }, 'image/png');
      } catch (err) {
        triggerDirectDownload();
      }
    }).catch(() => {
      window.open(`https://api.qrserver.com/v1/create-qr-code/?size=1000x1000&color=111217&bgcolor=ffffff&data=${encodeURIComponent(window.location.origin + '/cv/' + uid)}`, '_blank');
      showToast('Descargando código QR estándar...', 'info');
    });
  });

  document.querySelector('#copy-cv-link-btn')?.addEventListener('click', () => {
    const link = `${window.location.origin}/cv/${currentUser.uid}`;
    navigator.clipboard.writeText(link).then(() => {
      showToast('✓ Enlace público copiado al portapapeles', 'success');
    }).catch(() => {
      showToast('Error al copiar el enlace.', 'error');
    });
  });
}

async function showAdminPanel() {
  app.innerHTML = `<div style="display:grid;place-items:center;height:100vh;"><div class="neon-loader-wrapper"><div class="neon-ring"></div><div class="neon-ring"></div></div><p style="letter-spacing:2px; font-size:0.8rem; font-weight:bold; color:#fff;">CARGANDO...</p></div>`;
  const { AdminPanelView, attachAdminListeners } = await import('./views/AdminPanelView');
  const isMaster = profileData?.role === 'master';
  const [profiles, trafficData] = await Promise.all([
    getAllProfiles(),
    isMaster ? getTrafficData(7) : Promise.resolve([])
  ]);
  app.innerHTML = AdminPanelView(profiles, profileData?.role || '', trafficData);
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
      try {
        await updateUserProfile(uid, fields);
        // FIX FINAL: El admin SOLO actualiza la colección 'users'. 
        // No toca 'resumes' en absoluto porque Firestore bloquea la escritura.
        // La cédula y nombre se leerán desde profileData (users).
        showToast('✓ Nombre corregido correctamente', 'success');
        // BUG FIX: Actualizar el DOM de la fila directamente sin recargar el panel completo
        // Esto evita que resumeData quede con datos incorrectos si el admin visualiza el CV
        const editedRow = document.querySelector(`.edit-profile-btn[data-uid="${uid}"]`)?.closest('tr');
        if (editedRow) {
          const nameCell = editedRow.querySelector('td:first-child div:first-child');
          if (nameCell && fields.fullName) nameCell.textContent = fields.fullName;
          const editBtn = editedRow.querySelector(`.edit-profile-btn[data-uid="${uid}"]`);
          if (editBtn) {
            editBtn.dataset.fullname = fields.fullName || editBtn.dataset.fullname;
            editBtn.dataset.cedula = fields.cedula || editBtn.dataset.cedula;
          }
          // Actualizar data-search de la fila para que el filtro de búsqueda refleje el nuevo nombre
          const cedulaEl = editedRow.querySelector('td:first-child div:nth-child(3)');
          const emailEl = editedRow.querySelector('td:first-child div:nth-child(2)');
          editedRow.dataset.search = `${fields.fullName || ''} ${emailEl?.textContent || ''} ${fields.cedula || ''}`.toLowerCase();
          if (cedulaEl && fields.cedula) cedulaEl.textContent = `CI: ${fields.cedula}`;
        }
      } catch (err) {
        const errMsg = err?.code || err?.message || 'desconocido';
        showToast(`Error: ${errMsg}`, 'error');
        throw err;
      }
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
  const fullResumeData = { 
    ...resumeData, 
    // Aislamiento para Socios: Si es socio, el nombre y correo obligatoriamente provienen
    // del cliente (resumeData). Si es usuario normal, provienen de su cuenta oficial.
    fullName: profileData?.role === 'partner' ? (resumeData.fullName || 'Cliente') : (profileData?.fullName || resumeData.fullName || 'Usuario'), 
    email: profileData?.role === 'partner' ? (resumeData.email || '') : (resumeData.email || profileData?.email || ''), 
    vip: profileData?.vip || profileData?.role === 'admin' || profileData?.role === 'master' || (profileData?.role === 'partner' && !!profileData?.subActive) || false 
  };
  const { EditorView, attachEditorListeners } = await import('./views/EditorView');
  app.innerHTML = EditorView(fullResumeData, profileData, resumeData.theme);
  setTimeout(() => attachEditorListeners(fullResumeData, profileData, (updates, skipRender = false) => {
    resumeData = { ...resumeData, ...updates };
    saveResumeData(currentUser.uid, resumeData);
    if (!skipRender) showPreview();
  }, () => {
    if (profileData?.role === 'partner') showPartnerPanel();
    else showDashboard();
  }, () => showStep(0), () => showPartnerPanel()), 50);
}

async function showLanding() {
  currentView = 'landing';
  const { LandingView, attachLandingListeners } = await import('./views/LandingView');
  app.innerHTML = LandingView();
  attachLandingListeners(
    () => renderAuth('register'),
    () => renderAuth('login'),
    () => {
      renderAuth('register');
      showToast('Regístrate primero para crear tu cuenta y activar tu membresía de Socio de manera segura.', 'info');
    },
    () => {
      renderAuth('register');
      showToast('Regístrate primero para asociar tu pago por transferencia a tu cuenta de Socio.', 'info');
    }
  );

  if (localStorage.getItem('has_seen_tour') !== 'true') {
    startOnboarding('#landing-register-btn', '¡Hola! Empieza haciendo clic aquí para crear tu cuenta gratis. ¡Yo te guiaré en todo el proceso!');
  }
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
  }, async (email) => {
    if (!email) {
      showToast('Ingresa tu correo en el campo correspondiente primero.', 'info');
      return;
    }
    try {
      await resetPassword(email);
      showToast('✓ Correo de recuperación enviado. Revisa tu bandeja.', 'success');
    } catch (err) {
      showToast('Error al enviar correo. Verifica tu dirección.', 'error');
    }
  }, async (extra) => {
    // Google Sign-In/Sign-Up handler
    try {
      if (extra) pendingGoogleProfile = extra; // register mode: almacenar datos del formulario
      const { signInWithGoogle } = await import('./services/firebase');
      await signInWithGoogle();
      // subscribeToAuthChanges dispara navigateBasedOnProfile automáticamente
    } catch (err) {
      pendingGoogleProfile = null;
      const code = err?.code || '';
      if (code !== 'auth/popup-closed-by-user' && code !== 'auth/cancelled-popup-request') {
        showToast('Error al conectar con Google. Intenta de nuevo.', 'error');
      }
    }
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
  if (stepIdx > 6) {
    showPreview(); // Redirigir al visor si se completaron todos los pasos
    setTimeout(() => showBotFinal(profileData?.fullName || ''), 750);
    return;
  }
  currentView = 'questionnaire';
  const { QuestionnaireView, attachQuestionnaireListeners } = await import('./views/QuestionnaireView');
  app.innerHTML = QuestionnaireView(resumeData, stepIdx);
  attachQuestionnaireListeners(resumeData, stepIdx, 
    (stepData) => { 
      resumeData = { ...resumeData, ...stepData };
      // FIRE-AND-FORGET: El guardado en Firestore nunca bloquea la navegación.
      // Si falla la red, los datos están en memoria y se reintentará en el siguiente paso.
      saveResumeData(currentUser.uid, resumeData).catch(() => {});
      showStep(stepIdx + 1); 
    },
    () => showStep(stepIdx + 1), () => showStep(stepIdx - 1), () => showDashboard(),
    (stepData) => {
      resumeData = { ...resumeData, ...stepData };
      saveResumeData(currentUser.uid, resumeData).catch(() => {});
    }
  );
  // ─── BOT INFORMATIVO — Solo visual, no afecta lógica del wizard ───
  showBotMessage(stepIdx, profileData?.fullName || '');
}
