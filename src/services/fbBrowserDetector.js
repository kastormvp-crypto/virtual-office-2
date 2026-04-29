/**
 * Facebook / Instagram In-App Browser Detector
 * Detecta el browser interno de Facebook/Instagram y redirige al navegador nativo.
 * - Android: Intent URL para Chrome, Firefox o Edge (abre directamente)
 * - iOS: Esquemas URL para Chrome/Firefox + instrucciones para Safari
 */
export function detectAndHandleFBBrowser() {
  const ua = navigator.userAgent || '';
  const isFBBrowser = /FBAN|FBAV|FB_IAB|Instagram|FBIOS|FBANDROID/i.test(ua);
  if (!isFBBrowser) return false;

  const rawURL = window.location.href;
  const hostPath = rawURL.replace(/^https?:\/\//, '');
  const isAndroid = /Android/i.test(ua);
  const isIOS = /iPhone|iPad|iPod/i.test(ua);

  // ─── ANDROID: intentar abrir Chrome automáticamente primero ──────────
  if (isAndroid) {
    try {
      window.location = `intent://${hostPath}#Intent;scheme=https;package=com.android.chrome;end;`;
      // Si el intent funciona, el browser se abre y no necesitamos el overlay.
      // Esperamos 1.5s y si aún seguimos aquí, mostramos el overlay.
      setTimeout(() => showOverlay(rawURL, hostPath, isAndroid, isIOS), 1500);
      return true;
    } catch (e) { /* intent falló, mostrar overlay */ }
  }

  showOverlay(rawURL, hostPath, isAndroid, isIOS);
  return true;
}

function showOverlay(rawURL, hostPath, isAndroid, isIOS) {
  if (document.getElementById('fb-browser-overlay')) return;

  // ─── Definir botones según plataforma ────────────────────────────────
  const browsers = [];

  if (isAndroid) {
    browsers.push({
      icon: chromeSVG(),
      name: 'Chrome',
      color: '#4285F4',
      // Formato de intent más robusto para Chrome
      action: `intent://${hostPath}#Intent;scheme=https;package=com.android.chrome;end;`
    });
    browsers.push({
      icon: firefoxSVG(),
      name: 'Firefox',
      color: '#FF6611',
      // Formato alternativo para Firefox Android
      action: `intent://${hostPath}#Intent;scheme=https;package=org.mozilla.firefox;S.browser_fallback_url=${encodeURIComponent(rawURL)};end;`
    });
  } else if (isIOS) {
    browsers.push({
      icon: chromeSVG(),
      name: 'Chrome',
      color: '#4285F4',
      action: `googlechrome://${hostPath}`
    });
    browsers.push({
      icon: firefoxSVG(),
      name: 'Firefox',
      color: '#FF6611',
      action: `firefox://open-url?url=${encodeURIComponent(rawURL)}`
    });
  }

  // ─── Construir HTML de botones ────────────────────────────────────────
  const browserButtons = browsers.map((b, i) => `
    <a href="${b.action}" id="fb-browser-btn-${i}"
       style="display:flex; align-items:center; gap:0.8rem;
              background:rgba(255,255,255,0.04);
              border:1px solid rgba(255,255,255,0.1);
              border-radius:12px; padding:0.85rem 1.1rem;
              text-decoration:none; transition:all 0.2s;
              cursor:pointer;">
      <div style="width:38px;height:38px;border-radius:50%;
                  background:${b.color}15;
                  border:2px solid ${b.color}40;
                  display:flex;align-items:center;justify-content:center;
                  flex-shrink:0;">
        ${b.icon}
      </div>
      <div style="text-align:left;">
        <p style="color:#fff;font-weight:600;font-size:0.9rem;margin:0;">
          Abrir en ${b.name}
        </p>
        <p style="color:#6b7280;font-size:0.72rem;margin:0;">
          Toca para abrir automáticamente
        </p>
      </div>
      <span style="margin-left:auto;color:#c5a059;font-size:1rem;">→</span>
    </a>
  `).join('');

  // ─── Instrucciones para Safari (iOS) ─────────────────────────────────
  const safariSection = isIOS ? `
    <div style="margin-top:0.5rem;padding:0.9rem 1rem;
                background:rgba(197,160,89,0.05);
                border:1px solid rgba(197,160,89,0.2);
                border-radius:12px;">
      <p style="color:#c5a059;font-size:0.72rem;font-weight:700;
                letter-spacing:1px;margin:0 0 0.4rem;text-transform:uppercase;">
        Para abrir en Safari
      </p>
      <p style="color:#a0a0b0;font-size:0.8rem;margin:0;line-height:1.5;">
        Toca <strong style="color:#fff;">⋯</strong> o
        <strong style="color:#fff;">⬆ Compartir</strong>
        → <strong style="color:#c5a059;">Abrir en Safari</strong>
      </p>
    </div>
  ` : '';

  // ─── Overlay completo ─────────────────────────────────────────────────
  const overlay = document.createElement('div');
  overlay.id = 'fb-browser-overlay';
  overlay.style.cssText = `
    position:fixed; top:0; left:0; right:0; bottom:0;
    background:#0a0b10; z-index:9999999; overflow-y:auto;
    display:flex; flex-direction:column;
    align-items:center; justify-content:center;
    padding:clamp(1.5rem,5vw,2.5rem);
    font-family:'Inter',sans-serif; box-sizing:border-box;
  `;

  overlay.innerHTML = `
    <div style="max-width:400px;width:100%;">

      <!-- Icono de seguridad -->
      <div style="text-align:center;margin-bottom:1.5rem;">
        <div style="display:inline-flex;align-items:center;justify-content:center;
                    width:64px;height:64px;border-radius:50%;
                    background:rgba(197,160,89,0.1);
                    border:2px solid rgba(197,160,89,0.3);
                    font-size:2rem;margin-bottom:1rem;">
          🔒
        </div>
        <h1 style="color:#c5a059;font-size:clamp(1rem,4vw,1.25rem);
                   letter-spacing:2px;margin:0 0 0.5rem;font-weight:700;
                   text-transform:uppercase;">
          Por tu Seguridad
        </h1>
        <p style="color:#a0a0b0;font-size:clamp(0.8rem,2.5vw,0.9rem);
                  line-height:1.5;margin:0;">
          Tu información personal debe abrirse en un
          <strong style="color:#fff;">navegador seguro</strong>.
          El browser de Facebook no es compatible con nuestra protección de datos.
        </p>
      </div>

      <!-- Botones de navegadores -->
      <div style="display:flex;flex-direction:column;gap:0.7rem;margin-bottom:1rem;">
        ${browserButtons}
        ${safariSection}
      </div>

      <!-- Separador -->
      <div style="display:flex;align-items:center;gap:0.8rem;margin:1rem 0;">
        <div style="flex:1;height:1px;background:rgba(255,255,255,0.08);"></div>
        <span style="color:#555;font-size:0.7rem;">O COPIA EL ENLACE</span>
        <div style="flex:1;height:1px;background:rgba(255,255,255,0.08);"></div>
      </div>

      <!-- URL + Botón copiar -->
      <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);
                  border-radius:10px;padding:0.8rem 1rem;margin-bottom:0.8rem;">
        <p style="color:#6b7280;font-size:0.65rem;letter-spacing:1px;
                  margin:0 0 0.2rem;text-transform:uppercase;">Enlace de la app</p>
        <p style="color:#e0e0e0;font-size:0.75rem;margin:0;word-break:break-all;">
          ${rawURL}
        </p>
      </div>

      <button id="fb-copy-btn"
        style="width:100%;padding:0.8rem;
               background:linear-gradient(135deg,#c5a059,#8b6914);
               border:none;border-radius:10px;color:#fff;
               font-size:0.88rem;font-weight:700;cursor:pointer;
               letter-spacing:1px;font-family:'Inter',sans-serif;">
        📋 COPIAR ENLACE Y ABRIR MANUALMENTE
      </button>

      <p style="color:#444;font-size:0.65rem;text-align:center;margin:0.8rem 0 0;line-height:1.4;">
        Pega el enlace en Chrome o Safari para acceder de forma segura
      </p>

    </div>
  `;

  const inject = () => {
    document.body.appendChild(overlay);

    // Listener del botón copiar
    document.getElementById('fb-copy-btn')?.addEventListener('click', function() {
      const btn = this;
      const copy = () => {
        btn.textContent = '✅ ¡Enlace copiado! Pégalo en Chrome o Safari';
        btn.style.background = 'linear-gradient(135deg,#4ade80,#16a34a)';
      };
      if (navigator.clipboard) {
        navigator.clipboard.writeText(rawURL).then(copy).catch(() => fallbackCopy(rawURL, copy));
      } else {
        fallbackCopy(rawURL, copy);
      }
    });
  };

  if (document.body) inject();
  else document.addEventListener('DOMContentLoaded', inject);
}

function fallbackCopy(text, onSuccess) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.cssText = 'position:fixed;opacity:0;';
  document.body.appendChild(ta);
  ta.select();
  try { document.execCommand('copy'); onSuccess(); } catch(e) {}
  ta.remove();
}

// ─── Iconos SVG inline de cada navegador ─────────────────────────────────────
function chromeSVG() {
  return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" fill="#4285F4"/>
    <circle cx="12" cy="12" r="4" fill="white"/>
    <path d="M12 8h8.5M6.5 19.5l4-7M17.5 19.5l-4-7" stroke="white" stroke-width="0"/>
    <path d="M12 2a10 10 0 0 1 8.66 5H12a5 5 0 0 0-4.33 2.5" stroke="none"/>
    <!-- Chrome simplified: colored ring -->
    <circle cx="12" cy="12" r="5.5" fill="white"/>
    <circle cx="12" cy="12" r="3.5" fill="#4285F4"/>
    <path d="M12 6.5h10" stroke="#EA4335" stroke-width="3" stroke-linecap="round"/>
    <path d="M12 6.5 L6.3 16.5" stroke="#34A853" stroke-width="3" stroke-linecap="round"/>
    <path d="M22 8.5 L11.7 17" stroke="#FBBC05" stroke-width="3" stroke-linecap="round"/>
  </svg>`;
}

function firefoxSVG() {
  return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" fill="#FF6611"/>
    <circle cx="12" cy="12" r="5" fill="#FFC200"/>
    <circle cx="12" cy="12" r="2.5" fill="#FF6611"/>
  </svg>`;
}

function edgeSVG() {
  return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" fill="#0078D4"/>
    <path d="M5 15 Q8 8 16 9 Q20 10 20 14 Q20 18 14 18 Q10 18 9 16" 
          stroke="white" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M9 18 Q5 18 4 16" stroke="#50E6FF" stroke-width="2" stroke-linecap="round" fill="none"/>
  </svg>`;
}
