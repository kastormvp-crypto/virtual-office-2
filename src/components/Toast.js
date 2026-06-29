/**
 * Premium Glass Toast — Modal Bloqueante Ejecutivo
 * API sin cambios: showToast(message, type)
 * Tipos: 'success' | 'error' | 'info' | 'warning'
 */

let _toastStylesInjected = false;

function injectToastStyles() {
  if (_toastStylesInjected) return;
  _toastStylesInjected = true;
  const style = document.createElement('style');
  style.id = 'toast-modal-styles';
  style.textContent = `
    @keyframes toastOverlayIn  { from { opacity:0; } to { opacity:1; } }
    @keyframes toastCardIn     { from { opacity:0; transform:scale(0.88) translateY(16px); } to { opacity:1; transform:scale(1) translateY(0); } }
    @keyframes toastCardOut    { from { opacity:1; transform:scale(1); } to { opacity:0; transform:scale(0.92); } }
    @keyframes toastProgress   { from { width:100%; } to { width:0%; } }

    #toast-modal-overlay {
      position: fixed; inset: 0;
      background: rgba(0,0,0,0.72);
      display: grid; place-items: center;
      z-index: 99999; padding: 1rem;
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      box-sizing: border-box;
      animation: toastOverlayIn 0.22s ease;
    }
    #toast-modal-overlay.closing {
      animation: toastCardOut 0.25s ease forwards;
    }
    .toast-modal-card {
      max-width: 320px; width: 100%;
      background: rgba(10, 10, 15, 0.4);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border-radius: 20px; padding: 2rem 1.5rem 1.5rem;
      text-align: center; box-sizing: border-box;
      border: 1px solid rgba(220, 220, 220, 0.6);
      box-shadow: 0 0 20px rgba(220, 220, 220, 0.15), inset 0 0 15px rgba(220, 220, 220, 0.05);
      animation: toastCardIn 0.3s cubic-bezier(0.34, 1.3, 0.64, 1);
      position: relative; overflow: hidden;
    }

    .toast-modal-icon-wrap {
      width: 60px; height: 60px; border-radius: 50%;
      display: grid; place-items: center;
      margin: 0 auto 1.2rem;
      background: transparent;
    }
    .toast-modal-icon-wrap.success { border: 1px solid #4ade80; box-shadow: 0 0 20px rgba(74,222,128,0.5), inset 0 0 15px rgba(74,222,128,0.3); }
    .toast-modal-icon-wrap.error   { border: 1px solid #f87171; box-shadow: 0 0 20px rgba(248,113,113,0.5), inset 0 0 15px rgba(248,113,113,0.3); }
    .toast-modal-icon-wrap.info    { border: 1px solid #38bdf8; box-shadow: 0 0 20px rgba(56,189,248,0.5), inset 0 0 15px rgba(56,189,248,0.3); }
    .toast-modal-icon-wrap.warning { border: 1px solid #eab308; box-shadow: 0 0 20px rgba(234,179,8,0.5), inset 0 0 15px rgba(234,179,8,0.3); }

    .toast-modal-title {
      color: #fff; font-size: 1.05rem; font-weight: 700;
      margin: 0 0 0.5rem; line-height: 1.4;
      font-family: 'Outfit','Inter',sans-serif; letter-spacing: 0.5px;
      text-transform: uppercase;
      text-shadow: 0 0 8px rgba(255,255,255,0.4);
    }
    .toast-modal-msg {
      color: var(--text-dim, #a0a0b0); font-size: 0.82rem; line-height: 1.6;
      margin: 0 0 1.8rem; font-family: 'Outfit','Inter',sans-serif;
    }
    .toast-modal-btn {
      width: 100%; padding: 1rem; border-radius: 12px;
      font-weight: 700; font-size: 0.85rem; letter-spacing: 1px; text-transform: uppercase;
      cursor: pointer; font-family: 'Outfit','Inter',sans-serif;
      background: transparent;
      color: #fff;
      border: 1px solid rgba(220, 220, 220, 0.7);
      box-shadow: 0 0 10px rgba(220, 220, 220, 0.2);
      transition: box-shadow 0.3s ease, text-shadow 0.3s ease;
    }
    .toast-modal-btn:hover {
      box-shadow: 0 0 20px rgba(220, 220, 220, 0.6), inset 0 0 10px rgba(220, 220, 220, 0.2);
      text-shadow: 0 0 8px rgba(255, 255, 255, 0.8);
    }

    .toast-progress-bar {
      position: absolute; bottom: 0; left: 0; height: 3px;
      animation: toastProgress 3.5s linear forwards;
      border-radius: 0 0 0 20px;
    }
    .toast-progress-bar.success { background: #4ade80; box-shadow: 0 0 10px #4ade80; }
    .toast-progress-bar.error   { background: #f87171; box-shadow: 0 0 10px #f87171; }
    .toast-progress-bar.info    { background: #38bdf8; box-shadow: 0 0 10px #38bdf8; }
    .toast-progress-bar.warning { background: #eab308; box-shadow: 0 0 10px #eab308; }
  `;
  document.head.appendChild(style);
}

const ICONS = {
  success: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#4ade80" stroke-width="1.5"/><path d="M7.5 12l3 3 6-6" stroke="#4ade80" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  error:   `<svg width="28" height="28" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#f87171" stroke-width="1.5"/><path d="M15 9l-6 6M9 9l6 6" stroke="#f87171" stroke-width="2" stroke-linecap="round"/></svg>`,
  info:    `<svg width="28" height="28" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#38bdf8" stroke-width="1.5"/><path d="M12 8v1M12 11v5" stroke="#38bdf8" stroke-width="2" stroke-linecap="round"/></svg>`,
  warning: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M12 3L22 20H2L12 3z" stroke="#c5a059" stroke-width="1.5" stroke-linejoin="round"/><path d="M12 10v4M12 17v1" stroke="#c5a059" stroke-width="2" stroke-linecap="round"/></svg>`,
};

const TITLES = {
  success: 'Operación exitosa',
  error:   'Ha ocurrido un error',
  info:    'Información',
  warning: 'Aviso importante',
};

const BTN_LABELS = {
  success: 'Aceptar',
  error:   'Entendido',
  info:    'Aceptar',
  warning: 'Aceptar',
};

export const showToast = (message, type = 'success') => {
  injectToastStyles();

  // Solo un modal a la vez — remover el anterior si existe
  document.getElementById('toast-modal-overlay')?.remove();

  const overlay = document.createElement('div');
  overlay.id = 'toast-modal-overlay';

  overlay.innerHTML = `
    <div class="toast-modal-card ${type}">
      <div class="toast-modal-icon-wrap ${type}">${ICONS[type] || ICONS.info}</div>
      <h3 class="toast-modal-title">${TITLES[type] || 'Notificación'}</h3>
      <p class="toast-modal-msg">${message}</p>
      <button class="toast-modal-btn ${type}" id="toast-modal-accept-btn">${BTN_LABELS[type] || 'Aceptar'}</button>
      <div class="toast-progress-bar ${type}"></div>
    </div>
  `;

  document.body.appendChild(overlay);

  const close = () => {
    overlay.style.animation = 'toastCardOut 0.25s ease forwards';
    setTimeout(() => overlay.remove(), 260);
  };

  document.getElementById('toast-modal-accept-btn').addEventListener('click', close);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });

  // Auto-cierre en 3.5s si no se hace clic
  const autoClose = setTimeout(close, 3500);
  document.getElementById('toast-modal-accept-btn').addEventListener('click', () => clearTimeout(autoClose), { once: true });
};
