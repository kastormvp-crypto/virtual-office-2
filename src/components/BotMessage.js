/**
 * BotMessage — Asistente virtual informativo del wizard de CV
 * Componente 100% aislado. No modifica ninguna funcionalidad existente.
 * Se inyecta como capa visual superpuesta al contenido del paso activo.
 */

// ─── ÍCONOS 3D (Microsoft Fluent Emoji vía jsDelivr CDN) ───────────────────
const B = 'https://cdn.jsdelivr.net/npm/@microsoft/fluentui-emoji@latest/assets';
const ICONS = {
  wave:   `${B}/Waving%20hand/3D/waving_hand_3d.png`,
  robot:  `${B}/Robot/3D/robot_3d.png`,
  fire:   `${B}/Fire/3D/fire_3d.png`,
  flag:   `${B}/Chequered%20flag/3D/chequered_flag_3d.png`,
  party:  `${B}/Party%20popper/3D/party_popper_3d.png`,
  rocket: `${B}/Rocket/3D/rocket_3d.png`,
  muscle: `${B}/Flexed%20biceps/3D/flexed_biceps_3d.png`,
  check:  `${B}/Check%20mark%20button/3D/check_mark_button_3d.png`,
  dollar: `${B}/Dollar%20banknote/3D/dollar_banknote_3d.png`,
};

// ─── CSS DE ANIMACIONES (se inyecta una sola vez) ──────────────────────────
let _cssInjected = false;
function injectCSS() {
  if (_cssInjected) return;
  _cssInjected = true;
  const style = document.createElement('style');
  style.id = 'bot-message-styles';
  style.textContent = `
    @keyframes botFadeIn    { from { opacity:0; transform:scale(0.90); } to { opacity:1; transform:scale(1); } }
    @keyframes botSlideUp   { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
    @keyframes botBubbleIn  { from { opacity:0; transform:translateY(30px) scale(0.88); } to { opacity:1; transform:translateY(0) scale(1); } }
    @keyframes botToastIn   { from { opacity:0; transform:translateX(110%); } to { opacity:1; transform:translateX(0); } }
    @keyframes botToastOut  { from { opacity:1; transform:translateX(0); } to { opacity:0; transform:translateX(110%); } }
    @keyframes botBannerIn  { from { opacity:0; transform:translateY(-12px); } to { opacity:1; transform:translateY(0); } }

    #bot-message-overlay {
      position:fixed; top:0; left:0; width:100vw; height:100vh;
      background:rgba(0,0,0,0.78); display:grid; place-items:center;
      z-index:99998; padding:1rem; backdrop-filter:blur(8px);
      box-sizing:border-box; animation:botFadeIn 0.28s ease;
    }
    .bot-card {
      max-width:480px; width:92%;
      background:#f5f5f7;
      border:1px solid rgba(0,0,0,0.05);
      border-radius:24px; padding:2.5rem 2rem;
      text-align:center; box-sizing:border-box;
      box-shadow:0 20px 40px -10px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0, 0, 0, 0.05);
      animation:botSlideUp 0.32s cubic-bezier(0.34,1.3,0.64,1);
    }
    .bot-card-title {
      color:#1d1d1f; font-size:1.4rem; font-weight:700;
      margin:0 0 1rem; line-height:1.3;
      font-family:'Outfit','Inter',sans-serif;
    }
    .bot-card-body {
      color:#475569; font-size:0.95rem; line-height:1.7;
      margin:0 0 2rem; font-family:'Outfit','Inter',sans-serif;
    }
    .bot-card-btn {
      width:100%; padding:1rem; border-radius:12px;
      background:#ffffff;
      color:#1d1d1f; font-weight:700; font-size:1rem;
      border:1px solid rgba(0,0,0,0.2);
      cursor:pointer; letter-spacing:0.5px;
      transition:transform 0.2s, box-shadow 0.2s, border-color 0.2s, background 0.2s;
      font-family:'Outfit','Inter',sans-serif;
    }
    .bot-card-btn:hover { 
      transform:translateY(-2px); 
      background:#f5f5f7;
      box-shadow:0 4px 15px rgba(0,0,0,0.05); 
    }

    #bot-bubble {
      position:fixed; bottom:88px; right:14px;
      max-width:268px; z-index:99997;
      animation:botBubbleIn 0.38s cubic-bezier(0.34,1.56,0.64,1);
    }
    .bot-bubble-inner {
      background:linear-gradient(145deg,#13151f,#1b1e30);
      border:1px solid rgba(197,160,89,0.22);
      border-radius:18px 18px 4px 18px;
      padding:0.9rem 0.9rem 0.75rem;
      box-shadow:0 10px 36px rgba(0,0,0,0.55);
      position:relative;
    }
    .bot-bubble-close {
      position:absolute; top:0.4rem; right:0.65rem;
      background:none; border:none; color:#505060;
      font-size:0.95rem; cursor:pointer; line-height:1;
      transition:color 0.2s;
    }
    .bot-bubble-close:hover { color:#a0a0b0; }

    #bot-toast {
      position:fixed; top:1rem; right:1rem;
      background:linear-gradient(135deg,#13151f,#1b1e30);
      border:1px solid rgba(197,160,89,0.28);
      border-radius:14px; padding:0.75rem 1.1rem;
      color:#e0e0e0; font-size:0.82rem;
      z-index:99997; max-width:288px;
      box-shadow:0 10px 28px rgba(0,0,0,0.5);
      animation:botToastIn 0.32s ease;
      font-family:'Outfit','Inter',sans-serif;
      display:flex; align-items:center; gap:0.6rem;
    }

    #bot-banner {
      display:flex; align-items:center; gap:0.75rem;
      background:rgba(197,160,89,0.06);
      border:1px solid rgba(197,160,89,0.18);
      border-radius:12px; padding:0.8rem 1rem;
      margin-bottom:1rem;
      animation:botBannerIn 0.3s ease;
    }
    .bot-banner-text {
      color:#c5a059; font-size:0.8rem; font-weight:600;
      margin:0; line-height:1.45;
      font-family:'Outfit','Inter',sans-serif;
    }
  `;
  document.head.appendChild(style);
}

// ─── HELPERS ───────────────────────────────────────────────────────────────
function firstName(fullName = '') {
  const name = (fullName || '').trim().split(' ')[0];
  return name || 'amigo/a';
}

function removeExisting(id) {
  document.getElementById(id)?.remove();
}

// ─── MODAL (Paso 1 y Final) ────────────────────────────────────────────────
function showModal({ title, body, btnText }) {
  injectCSS();
  removeExisting('bot-message-overlay');

  const overlay = document.createElement('div');
  overlay.id = 'bot-message-overlay';
  overlay.innerHTML = `
    <div class="bot-card">
      <h3 class="bot-card-title">${title}</h3>
      <p class="bot-card-body">${body}</p>
      <button class="bot-card-btn" id="bot-modal-btn">${btnText}</button>
    </div>
  `;
  document.body.appendChild(overlay);

  const close = () => overlay.remove();
  overlay.querySelector('#bot-modal-btn').addEventListener('click', close);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
}

// ─── BURBUJA DE CHAT (Paso 3) ──────────────────────────────────────────────
function showBubble({ icon, text }) {
  injectCSS();
  removeExisting('bot-bubble');

  const bubble = document.createElement('div');
  bubble.id = 'bot-bubble';
  bubble.innerHTML = `
    <div class="bot-bubble-inner">
      <button class="bot-bubble-close" id="bot-bubble-close" aria-label="Cerrar">✕</button>
      <div style="display:flex;align-items:flex-start;gap:0.6rem;padding-right:1rem;">
        <img src="${icon}" alt="" style="width:38px;height:38px;flex-shrink:0;filter:drop-shadow(0 5px 10px rgba(0,0,0,0.5));">
        <p style="color:#e0e0e0;font-size:0.8rem;line-height:1.6;margin:0;font-family:'Outfit','Inter',sans-serif;">${text}</p>
      </div>
    </div>
  `;
  document.body.appendChild(bubble);

  document.getElementById('bot-bubble-close').addEventListener('click', () => bubble.remove());
  // Auto-dismiss después de 9 segundos
  setTimeout(() => { removeExisting('bot-bubble'); }, 9000);
}

// ─── TOAST (Paso 5) ────────────────────────────────────────────────────────
function showBotToast({ icon, text }) {
  injectCSS();
  removeExisting('bot-toast');

  const toast = document.createElement('div');
  toast.id = 'bot-toast';
  toast.innerHTML = `
    <img src="${icon}" alt="" style="width:28px;height:28px;flex-shrink:0;filter:drop-shadow(0 4px 8px rgba(0,0,0,0.4));">
    <span>${text}</span>
  `;
  document.body.appendChild(toast);

  setTimeout(() => {
    const t = document.getElementById('bot-toast');
    if (!t) return;
    t.style.animation = 'botToastOut 0.32s ease forwards';
    setTimeout(() => removeExisting('bot-toast'), 330);
  }, 5500);
}

// ─── BANNER INLINE (Paso 7) ────────────────────────────────────────────────
function showBanner({ icon, text }) {
  injectCSS();
  removeExisting('bot-banner');

  const target = document.querySelector('.main-content');
  if (!target) return;

  const banner = document.createElement('div');
  banner.id = 'bot-banner';
  banner.innerHTML = `
    <img src="${icon}" alt="" style="width:34px;height:34px;flex-shrink:0;filter:drop-shadow(0 5px 12px rgba(197,160,89,0.4));">
    <p class="bot-banner-text">${text}</p>
  `;
  target.insertBefore(banner, target.firstChild);
}

// ─── API PÚBLICA ───────────────────────────────────────────────────────────

/**
 * Muestra el mensaje del bot correspondiente al paso del wizard.
 * @param {number} step  - Índice del paso (0–6)
 * @param {string} name  - Nombre completo del usuario (se extrae el primer nombre)
 */
export function showBotMessage(step, name) {
  const n = firstName(name);

  switch (step) {
    case 0:
      // Modal de bienvenida — aparece inmediatamente al entrar al paso 1
      showModal({
        title:   `Hola, ${n}`,
        body:    `Completa los pasos y al terminar paga <strong style="color:#1d1d1f;">solo $1</strong> con tarjeta o transferencia.<br><br>Obtienes <strong style="color:#1d1d1f;">11 diseños pro</strong> y descargas ilimitadas.`,
        btnText: 'Continuar',
      });
      break;
      
    // Pasos 2, 4 y 6 deshabilitados a petición para no interrumpir el flujo del usuario.
  }
}

/**
 * Muestra el modal de felicitación al completar el wizard (antes del editor/pago).
 * @param {string} name - Nombre completo del usuario
 */
export function showBotFinal(name) {
  const n = firstName(name);
  showModal({
    title:   `¡Completado, ${n}!`,
    body:    `Tu hoja de vida está lista.<br><br>Ahora <strong style="color:#1d1d1f;">escoge tu diseño favorito</strong>, realiza el pago de <strong style="color:#1d1d1f;">$1</strong> y termina el proceso.`,
    btnText: 'Ver mi Hoja de Vida',
  });
}
