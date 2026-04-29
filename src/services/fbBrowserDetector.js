/**
 * Facebook / Instagram In-App Browser Detector
 *
 * El browser interno de Facebook (FBBrowser) bloquea cookies de terceros
 * que Firebase Auth necesita para funcionar. Este módulo detecta ese
 * navegador y actúa según la plataforma:
 *
 * - Android: intenta redirigir automáticamente a Chrome via Intent URL.
 * - iOS / fallback: muestra un overlay con instrucciones claras + botón
 *   para copiar el enlace y abrirlo en Safari/Chrome.
 */
export function detectAndHandleFBBrowser() {
  const ua = navigator.userAgent || '';
  const isFBBrowser = /FBAN|FBAV|FB_IAB|Instagram|FBIOS|FBANDROID/i.test(ua);

  if (!isFBBrowser) return false; // No es FB browser, nada que hacer

  const currentURL = window.location.href;
  const isAndroid = /Android/i.test(ua);
  const isIOS = /iPhone|iPad|iPod/i.test(ua);

  // ── Android: redirigir automáticamente a Chrome ────────────────────────
  if (isAndroid) {
    try {
      window.location = 'intent://' +
        currentURL.replace(/^https?:\/\//, '') +
        '#Intent;scheme=https;package=com.android.chrome;end;';
      return true; // Redirigiendo...
    } catch (e) {
      // Si el intent falla, caemos al overlay de instrucciones
    }
  }

  // ── iOS y fallback Android: mostrar overlay de instrucciones ───────────
  const iosInstructions = isIOS
    ? `<p style="color:#a0a0b0;font-size:0.85rem;margin:0.3rem 0;line-height:1.5;">
         En iPhone: toca el ícono <strong style="color:#fff;">⋯</strong> o
         <strong style="color:#fff;">⬆ Compartir</strong> y elige<br>
         <strong style="color:#c5a059;">"Abrir en Safari"</strong>
       </p>`
    : `<p style="color:#a0a0b0;font-size:0.85rem;margin:0.3rem 0;line-height:1.5;">
         Toca los <strong style="color:#fff;">⋮ tres puntos</strong> (esquina superior derecha)<br>
         y elige <strong style="color:#c5a059;">"Abrir en Chrome"</strong>
       </p>`;

  const overlay = document.createElement('div');
  overlay.id = 'fb-browser-overlay';
  overlay.style.cssText = [
    'position:fixed', 'top:0', 'left:0', 'right:0', 'bottom:0',
    'background:#0a0b10', 'z-index:9999999',
    'display:flex', 'flex-direction:column',
    'align-items:center', 'justify-content:center',
    'padding:clamp(1.5rem,5vw,3rem)', 'text-align:center',
    "font-family:'Inter',sans-serif", 'box-sizing:border-box',
    'overflow-y:auto'
  ].join(';');

  overlay.innerHTML = `
    <div style="max-width:380px;width:100%;">

      <div style="font-size:3rem;margin-bottom:1rem;">🌐</div>

      <h1 style="color:#c5a059;font-size:clamp(1rem,4vw,1.3rem);letter-spacing:2px;
                 margin:0 0 0.6rem;text-transform:uppercase;font-weight:700;">
        Abre en tu Navegador
      </h1>

      <p style="color:#e0e0e0;font-size:clamp(0.82rem,2.5vw,0.95rem);
                line-height:1.6;margin:0 0 1rem;">
        Para registrarte y usar la app correctamente, ábrela en
        <strong style="color:#fff;">Chrome o Safari</strong>.
      </p>

      ${iosInstructions}

      <!-- URL visible para copiar -->
      <div style="margin:1.5rem 0;padding:0.9rem 1rem;
                  background:rgba(197,160,89,0.08);
                  border:1px solid rgba(197,160,89,0.3);
                  border-radius:10px;">
        <p style="color:#c5a059;font-size:0.65rem;letter-spacing:1.5px;
                  margin:0 0 0.3rem;font-weight:700;text-transform:uppercase;">
          Enlace
        </p>
        <p style="color:#e0e0e0;font-size:0.78rem;margin:0;word-break:break-all;">
          ${currentURL}
        </p>
      </div>

      <!-- Botón copiar -->
      <button id="fb-copy-btn"
        style="width:100%;padding:0.85rem;
               background:linear-gradient(135deg,#c5a059,#8b6914);
               border:none;border-radius:10px;color:#fff;
               font-size:0.9rem;font-weight:700;cursor:pointer;
               letter-spacing:1px;font-family:'Inter',sans-serif;
               margin-bottom:0.7rem;">
        📋 COPIAR ENLACE
      </button>

      <p style="color:#555;font-size:0.68rem;margin:0;line-height:1.4;">
        Pega el enlace en Chrome o Safari para continuar
      </p>
    </div>
  `;

  const inject = () => {
    if (document.body && !document.getElementById('fb-browser-overlay')) {
      document.body.appendChild(overlay);
      document.getElementById('fb-copy-btn')?.addEventListener('click', function() {
        navigator.clipboard?.writeText(currentURL).then(() => {
          this.textContent = '✅ ¡Enlace copiado!';
          this.style.background = 'linear-gradient(135deg,#4ade80,#16a34a)';
        }).catch(() => {
          // Fallback para browsers sin clipboard API
          const ta = document.createElement('textarea');
          ta.value = currentURL;
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          ta.remove();
          this.textContent = '✅ ¡Copiado!';
        });
      });
    }
  };

  if (document.body) inject();
  else document.addEventListener('DOMContentLoaded', inject);

  return true; // Está en FB browser
}
