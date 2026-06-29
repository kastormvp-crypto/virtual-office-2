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
      backdrop-filter: blur(6px);
      -webkit-backdrop-filter: blur(6px);
      box-sizing: border-box;
      animation: toastOverlayIn 0.22s ease;
    }
    #toast-modal-overlay.closing {
      animation: toastCardOut 0.25s ease forwards;
    }
    .toast-modal-card {
      max-width: 320px; width: 100%;
      background: linear-gradient(145deg, #0f1018 0%, #151825 100%);
      border-radius: 20px; padding: 2rem 1.5rem 1.5rem;
      text-align: center; box-sizing: border-box;
      box-shadow: 0 24px 60px rgba(0,0,0,0.75), 0 0 40px rgba(0,0,0,0.3);
      animation: toastCardIn 0.3s cubic-bezier(0.34, 1.3, 0.64, 1);
      border-top: 3px solid transparent;
      position: relative; overflow: hidden;
    }
    .toast-modal-card.success { border-top-color: #4ade80; box-shadow: 0 24px 60px rgba(0,0,0,0.75), 0 0 30px rgba(74,222,128,0.08); }
    .toast-modal-card.error   { border-top-color: #f87171; box-shadow: 0 24px 60px rgba(0,0,0,0.75), 0 0 30px rgba(248,113,113,0.08); }
    .toast-modal-card.info    { border-top-color: #38bdf8; box-shadow: 0 24px 60px rgba(0,0,0,0.75), 0 0 30px rgba(56,189,248,0.08); }
    .toast-modal-card.warning { border-top-color: #c5a059; box-shadow: 0 24px 60px rgba(0,0,0,0.75), 0 0 30px rgba(197,160,89,0.08); }

    .toast-modal-icon-wrap {
      width: 60px; height: 60px; border-radius: 50%;
      display: grid; place-items: center;
      margin: 0 auto 1.2rem;
    }
    .toast-modal-icon-wrap.success { background: rgba(74,222,128,0.12); border: 1px solid rgba(74,222,128,0.25); }
    .toast-modal-icon-wrap.error   { background: rgba(248,113,113,0.12); border: 1px solid rgba(248,113,113,0.25); }
    .toast-modal-icon-wrap.info    { background: rgba(56,189,248,0.12);  border: 1px solid rgba(56,189,248,0.25); }
    .toast-modal-icon-wrap.warning { background: rgba(197,160,89,0.12);  border: 1px solid rgba(197,160,89,0.25); }

    .toast-modal-title {
      color: #fff; font-size: 1rem; font-weight: 700;
      margin: 0 0 0.5rem; line-height: 1.4;
      font-family: 'Outfit','Inter',sans-serif; letter-spacing: 0.2px;
    }
    .toast-modal-msg {
      color: #a0a0b0; font-size: 0.82rem; line-height: 1.6;
      margin: 0 0 1.5rem; font-family: 'Outfit','Inter',sans-serif;
    }
    .toast-modal-btn {
      width: 100%; padding: 0.8rem; border-radius: 10px;
      font-weight: 700; font-size: 0.85rem; letter-spacing: 0.5px;
      border: none; cursor: pointer;
      font-family: 'Outfit','Inter',sans-serif;
      transition: transform 0.2s, filter 0.2s;
    }
    .toast-modal-btn:hover { transform: translateY(-1px); filter: brightness(1.1); }
    .toast-modal-btn.success { background: linear-gradient(135deg,#22c55e,#4ade80); color: #000; }
    .toast-modal-btn.error   { background: linear-gradient(135deg,#dc2626,#f87171); color: #fff; }
    .toast-modal-btn.info    { background: linear-gradient(135deg,#0284c7,#38bdf8); color: #000; }
    .toast-modal-btn.warning { background: linear-gradient(135deg,#c5a059,#e8c878); color: #000; }

    .toast-progress-bar {
      position: absolute; bottom: 0; left: 0; height: 3px;
      animation: toastProgress 3.5s linear forwards;
      border-radius: 0 0 0 20px;
    }
    .toast-progress-bar.success { background: #4ade80; }
    .toast-progress-bar.error   { background: #f87171; }
    .toast-progress-bar.info    { background: #38bdf8; }
    .toast-progress-bar.warning { background: #c5a059; }
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
