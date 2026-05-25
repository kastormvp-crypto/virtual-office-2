import { ResumeTemplate } from '../components/ResumeTemplate';
import { showToast } from '../components/Toast';

export const EditorView = (resumeData, profileData, currentTheme = 'executive-navy') => {
  const isMobile = window.innerWidth < 600;
  // Bulletproof Master Bypass
  const isVip = !!resumeData?.vip || profileData?.role === 'admin' || profileData?.role === 'master' || (profileData?.role === 'partner' && profileData?.subActive);

  return `
<div class="animate-fade" style="display: flex; flex-direction: column; height: 100vh; overflow: hidden; background: #0a0b10; font-family: 'Inter', sans-serif; position: fixed; top: 0; left: 0; width: 100vw; z-index: 5000;">
  
  <header style="padding: 0.8rem 1rem; background: rgba(10, 11, 16, 0.95); backdrop-filter: blur(10px); border-bottom: 1px solid rgba(255,255,255,0.05); z-index: 1000;">
    <div style="max-width: 1200px; margin: 0 auto; display: flex; flex-direction: ${isMobile ? 'column' : 'row'}; gap: 12px; justify-content: space-between; align-items: center;">
       <div style="display: flex; justify-content: space-between; align-items: center; width: ${isMobile ? '100%' : 'auto'};">
          <div>
            <h3 style="margin: 0; font-size: 1rem; color: var(--primary);">Visor de Hoja de Vida</h3>
            ${isVip ?
      '<span style="font-size: 0.7rem; color: #4ade80; text-transform: uppercase; font-weight: bold; letter-spacing: 1px;">✓ Acceso Maestro Activado</span>' :
      '<span style="font-size: 0.7rem; color: var(--text-dim); text-transform: uppercase;">Modo Vista Previa</span>'
    }
          </div>
          <div style="display:flex; gap:0.5rem;">
            <button id="edit-info-btn-mob" type="button" style="padding: 0.5rem 0.9rem; font-size: 0.85rem; background: rgba(197,160,89,0.1); border: 1px solid var(--primary); border-radius: 8px; color: var(--primary); font-weight:bold; cursor:pointer; ${!isMobile ? 'display:none;' : ''}">EDITAR</button>
            <button id="exit-editor-btn-mob" type="button" style="padding: 0.5rem 0.9rem; font-size: 0.85rem; background: rgba(60,65,80,0.7); border: 1px solid rgba(255,255,255,0.12); border-radius: 8px; color: #e0e0e0; cursor:pointer; ${!isMobile ? 'display:none;' : ''}">SALIR</button>
          </div>
       </div>
       <!-- CV Style Grid -->
       <div style="
         display: flex;
         flex-wrap: wrap;
         justify-content: center;
         gap: 0.4rem;
         padding: 0.4rem 0;
         width: 100%;
       ">
          <button type="button" class="theme-select-h ${currentTheme === 'executive-navy' ? 'active' : ''}" data-theme="executive-navy">💼 Standard</button>
          <button type="button" class="theme-select-h ${currentTheme === 'tech-minimal' ? 'active' : ''}" data-theme="tech-minimal">🌿 Minimalist</button>
          <button type="button" class="theme-select-h ${currentTheme === 'modern-sidebar' ? 'active' : ''}" data-theme="modern-sidebar">📐 Modern Side</button>
          <button type="button" class="theme-select-h ${currentTheme === 'harvard-classic' ? 'active' : ''}" data-theme="harvard-classic">🏛️ Harvard Classic</button>
          <button type="button" class="theme-select-h ${currentTheme === 'harvard-navy' ? 'active' : ''}" data-theme="harvard-navy">🎓 Harvard Navy</button>
          <button type="button" class="theme-select-h ${currentTheme === 'startup-modern' ? 'active' : ''}" data-theme="startup-modern">⚡ Startup Pro</button>
          <button type="button" class="theme-select-h ${currentTheme === 'creative-exec' ? 'active' : ''}" data-theme="creative-exec">🎨 Creative Exec</button>
          <button type="button" class="theme-select-h ${currentTheme === 'graduate-classic' ? 'active' : ''}" data-theme="graduate-classic">🎓 Recién Graduado</button>
          <button type="button" class="theme-select-h ${currentTheme === 'dark-gold' ? 'active' : ''}" data-theme="dark-gold" style="border: 1px solid rgba(197,160,89,0.3) !important;">🌌 Dark Gold</button>
          <button type="button" class="theme-select-h ${currentTheme === 'carbon-gray' ? 'active' : ''}" data-theme="carbon-gray" style="border: 1px solid rgba(226,232,240,0.3) !important;">🔘 Carbon Gray</button>
          <button type="button" class="theme-select-h ${currentTheme === 'royal-navy' ? 'active' : ''}" data-theme="royal-navy" style="border: 1px solid rgba(56,189,248,0.3) !important;">🔵 Royal Navy</button>
       </div>
       <!-- Advertencia de impresión para temas oscuros -->
       <div id="dark-theme-alert" style="display: ${['dark-gold', 'carbon-gray', 'royal-navy'].includes(currentTheme) ? 'flex' : 'none'}; gap: 6px; align-items: center; justify-content: center; background: rgba(197, 160, 89, 0.1); border: 1px solid rgba(197, 160, 89, 0.25); border-radius: 8px; padding: 0.35rem 0.8rem; font-size: 0.7rem; color: #c5a059; width: 100%; max-width: 600px; margin: 0 auto 0.2rem auto; text-align: center;">
         <span>💡</span> <strong>Nota de Impresión:</strong> Los diseños oscuros son espectaculares para envío digital por WhatsApp o Correo. Si planeas imprimirlo físicamente, te sugerimos usar un diseño claro para ahorrar tinta.
       </div>
       <div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap; justify-content: flex-end;">
          <button id="exit-editor-btn" type="button" style="padding: 0.55rem 1rem; font-size: 0.85rem; background: rgba(60,65,80,0.7); border: 1px solid rgba(255,255,255,0.12); border-radius: 8px; color: #e0e0e0; cursor:pointer; flex:1; ${isMobile ? 'display:none;' : ''}">SALIR</button>
          <button id="edit-info-btn" type="button" style="padding: 0.55rem 1rem; font-size: 0.85rem; background: rgba(197,160,89,0.1); border: 1px solid var(--primary); color: var(--primary); font-weight:bold; border-radius: 8px; cursor:pointer; flex:1; ${isMobile ? 'display:none;' : ''}">EDITAR INFO</button>
          <button id="download-pdf-btn" type="button" style="padding: 0.55rem 1rem; font-size: 0.9rem; flex: 1; font-weight: bold; background: #4b526d; border: 1px solid rgba(255,255,255,0.15); color: #ffffff; border-radius: 8px; cursor:pointer;">
            ${isMobile ? 'DESCARGAR PDF <span style="color:#a0a0b0; margin: 0 4px;">/</span> WhatsApp <span style="color:#25d366; font-size:1.1rem; vertical-align:middle; line-height:1;">☻</span>' : 'DESCARGAR PDF'}
          </button>
          ${profileData?.role === 'partner' ? '<button id="new-client-btn" type="button" style="padding: 0.55rem 1rem; font-size: 0.9rem; flex: 1; font-weight: bold; background: linear-gradient(135deg, #c5a059, #e8c878); border: none; color: #000; border-radius: 8px; cursor:pointer; min-width: 150px;">🆕 NUEVO CLIENTE</button>' : ''}
       </div>
    </div>
  </header>

   <main id="preview-area" style="flex: 1; overflow: auto; background: #000; position: relative; display: flex; flex-direction: column; align-items: center; padding: 20px 0 100px 0;">
      <div id="resume-scaler" style="position: relative; transition: all 0.2s ease-out; margin: 0 auto; display: flex; align-items: flex-start; justify-content: center; width: 21cm; min-height: 29.6cm; height: fit-content;">
         <div id="resume-wrapper" style="width: 21cm; min-height: 29.6cm; height: max-content; position: relative; transform-origin: top center; transition: transform 0.2s ease-out; margin: 0;">
            <div style="width: 100%; box-shadow: 0 0 100px rgba(0,0,0,1); background: white;">
               <div id="resume-document">
                  ${ResumeTemplate(resumeData, currentTheme)}
               </div>
            </div>
         </div>
      </div>
     <!-- Barra de Control de Zoom -->
     <div id="zoom-controls" style="position: absolute; bottom: 20px; right: 20px; display: flex; gap: 8px; z-index: 2000; background: rgba(20, 22, 30, 0.85); backdrop-filter: blur(8px); padding: 6px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 8px 32px rgba(0,0,0,0.5);">
        <button id="zoom-out" title="Alejar" style="width: 32px; height: 32px; border-radius: 8px; border: none; background: rgba(255,255,255,0.05); color: white; cursor: pointer; font-size: 1.2rem; display: flex; align-items: center; justify-content: center;">-</button>
        <div id="zoom-label" style="min-width: 45px; color: var(--primary); font-size: 0.75rem; font-weight: bold; display: flex; align-items: center; justify-content: center; user-select: none;">100%</div>
        <button id="zoom-in" title="Acercar" style="width: 32px; height: 32px; border-radius: 8px; border: none; background: rgba(255,255,255,0.05); color: white; cursor: pointer; font-size: 1.2rem; display: flex; align-items: center; justify-content: center;">+</button>
        <div style="width: 1px; background: rgba(255,255,255,0.1); margin: 4px 2px;"></div>
        <button id="zoom-fit" title="Ajustar a Pantalla" style="width: 32px; height: 32px; border-radius: 8px; border: none; background: rgba(255,255,255,0.05); color: white; cursor: pointer; font-size: 0.9rem; display: flex; align-items: center; justify-content: center;">↔</button>
     </div>
  </main>

  <style>
    .theme-select-h { flex: 0 0 auto; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: var(--text-dim); padding: 0.4rem 0.9rem; border-radius: 6px; font-size: 0.75rem; cursor: pointer; white-space: nowrap; transition: all 0.2s; user-select: none; }
    .theme-select-h.active { background: var(--primary); color: #000; font-weight: bold; border-color: var(--primary); }
    .theme-select-h:active { transform: scale(0.96); }
    .vip-modal-container { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.9); z-index: 6000; place-items: center; padding: 1rem; overflow-y: auto; }
  </style>

</div>
`;
};

export const attachEditorListeners = (data, profileData, onUpdate, onExit, onEdit, onNewClient) => {
  const isVip = !!data.vip || profileData?.role === 'admin' || profileData?.role === 'master' || (profileData?.role === 'partner' && profileData?.subActive);
  const themeButtons = document.querySelectorAll('.theme-select-h');
  const downloadBtn = document.querySelector('#download-pdf-btn');
  const viewport = document.getElementById('preview-area');
  const wrapper = document.getElementById('resume-wrapper');
  const scaler = document.getElementById('resume-scaler');

  // ── Inyectar el modal VIP en document.body (fuera del área de captura de eventos) ──
  const existingModal = document.getElementById('vip-modal');
  if (existingModal) existingModal.remove();
  const vipModalHTML = `
  <div id="vip-modal" class="vip-modal-container" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.92); z-index:99999; place-items:center; padding:1rem; overflow-y:auto; touch-action:auto; box-sizing:border-box;">
     <div class="glass" style="max-width:360px; width:100%; padding:1.8rem 1.2rem; text-align:center; position:relative; margin:auto; touch-action:auto; box-sizing:border-box; max-height:92vh; overflow-y:auto;">
        <button id="close-vip-modal" type="button" style="position:absolute; top:0.5rem; right:0.8rem; background:none; border:none; color:white; font-size:1.8rem; cursor:pointer; line-height:1;">&times;</button>
        <div style="font-size:2rem; margin-bottom:0.5rem;">💎</div>
        <h2 style="color:var(--primary); margin-bottom:0.3rem; font-size:1.2rem;">Activa tu CV VIP</h2>
        <p style="color:var(--text-dim); font-size:0.75rem; margin-bottom:1.5rem;">Ediciones ilimitadas y descarga profesional por solo <b>$1.00</b>.</p>
        <div style="background:rgba(255,255,255,0.03); border:1px solid var(--border-glass); padding:1rem; border-radius:8px; margin-bottom:1.2rem; text-align:left;">
           <h4 style="margin:0 0 0.8rem; color:var(--primary); font-size:0.7rem; text-transform:uppercase;">Activa con un clic (Recomendado)</h4>
           <div id="pp-button" style="min-height:60px; display:flex; justify-content:center; touch-action:auto; width:100%; box-sizing:border-box;"></div>
           <style>
             #pp-button iframe {
               max-width: 100% !important;
               width: 100% !important;
             }
           </style>
           <div style="margin-top:1rem; padding:0.9rem; border-top:1px solid rgba(255,255,255,0.08); background:rgba(197,160,89,0.07); border:1px solid rgba(197,160,89,0.25); border-radius:8px;">
             <p style="margin:0 0 0.5rem; font-size:0.7rem; color:var(--primary); font-weight:bold; text-transform:uppercase; letter-spacing:0.5px;">🏦 Pago por Transferencia Bancaria</p>
             <p style="margin:0.2rem 0; font-size:0.8rem; color:#e0e0e0;"><b>Banco:</b> Pichincha — Cuenta de Ahorros</p>
             <p style="margin:0.2rem 0; font-size:0.85rem; color:#fff; font-weight:bold; letter-spacing:1px;">N° 2215852866</p>
             <p style="margin:0.2rem 0; font-size:0.8rem; color:#e0e0e0;"><b>Titular:</b> David Flores G.</p>
             <p style="margin:0.5rem 0 0; font-size:0.7rem; color:var(--text-dim);">Envía el comprobante por WhatsApp para activar tu cuenta VIP.</p>
           </div>
        </div>
        <div style="display:flex; flex-direction:column; gap:0.8rem;">
           <a href="https://wa.me/593962696067?text=Hola%20David,%20adjunto%20comprobante%20de%20%241%20para%20activar%20mi%20Cuenta%20VIP%20-%20Usuario:%20${data.fullName}" target="_blank" class="btn-primary" style="text-decoration:none; display:flex; align-items:center; justify-content:center; gap:0.5rem; background:#25d366; color:white; border:none; padding:0.7rem; font-size:0.8rem; font-weight:bold;">
              <span>📱</span> ENVIAR POR WHATSAPP
           </a>
        </div>
     </div>
  </div>`;
  document.body.insertAdjacentHTML('beforeend', vipModalHTML);
  const vipModal = document.getElementById('vip-modal');

  const showVipWall = () => {
    vipModal.style.display = 'grid';
    const oldContainer = document.querySelector('#pp-button');
    if (!oldContainer) return;
    const newContainer = document.createElement('div');
    newContainer.id = 'pp-button';
    newContainer.style.cssText = 'min-height:60px; display:flex; justify-content:center; touch-action:auto; margin:auto;';
    newContainer.innerHTML = '<p style="color:var(--text-dim); font-size:0.7rem;">Cargando pasarela...</p>';
    oldContainer.parentNode.replaceChild(newContainer, oldContainer);
    const container = newContainer; 

    // Esperar hasta 5s a que el SDK de PayPhone cargue (carga async)
    const waitForPayPhone = (attempts = 0) => {
      if (window.PPaymentButtonBox) {
        container.innerHTML = '';
        const token = "eNWk5EmtuMRdMJGQiJg-djEE4-stUyzApT1-3qzncfIrAwHRf84JpK4kHdZ6Y0uuhpXiVuCQ3EJKYb5pK44odTQNBvVSOTlyD5RG4cbcHwUDc-Vd9BfbhHBnL-S_Yz7Rz048UNiAXdti8XVk_fB7BSH7WA8I6csr_e8IRAie1e8F6pEL4zojWu7Vnn3tGjSgV-CPaK5iQ1BhfWopBUmVhoFemeLDGbb0xxsZGTSQ-FRK6z61mwSn9c_4PpGl6srEPWh7pvbmgs53OnkXFes3tCX5f8CWL4vTJ8f5v9Udvb5KOq2rSsUS28EX9hQIFXkN0s16BdPhU_iyTMsP2g6YEabj3VI";
        
        const payphone = new PPaymentButtonBox({
          token: token,
          clientTransactionId: `VO2-${Date.now()}`,
          amount: 100,
          amountWithoutTax: 100,
          currency: "USD",
          reference: "Activacion VIP - TuHojadeVida.com",
          lang: "es",
          onCompleted: async (model, status) => {
            vipModal.style.display = 'none';
            if (status === 'Approved') {
              // 🎉 CELEBRACIÓN: Confeti
              if (window.confetti) {
                confetti({
                  particleCount: 150,
                  spread: 70,
                  origin: { y: 0.6 },
                  colors: ['#c5a059', '#ffffff', '#4ade80']
                });
              }

              // 📱 NOTIFICACIÓN: WhatsApp al Admin
              import('../services/auth').then(m => m.notifyNewSale(profileData, 100));

              // Guardar datos de pago en Firestore para el recibo
              try {
                const { savePaymentData } = await import('../services/auth');
                const uid = (await import('../services/firebase')).auth.currentUser?.uid;
                if (uid) {
                  await savePaymentData(uid, {
                    method: 'payphone',
                    amount: 100,
                    authCode: model?.authorizationCode || '',
                    clientTxId: model?.clientTransactionId || `VO2-${Date.now()}`,
                    status: 'Approved'
                  });
                }
              } catch(e) { console.warn('Error saving payment:', e); }

              // Mostrar confirmación visual
              const successBanner = document.createElement('div');
              successBanner.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.9);display:grid;place-items:center;z-index:99999;';
              successBanner.innerHTML = `
                <div style="text-align:center;padding:2rem;max-width:380px;">
                  <div style="font-size:4rem;">✅</div>
                  <h2 style="color:#4ade80;margin:1rem 0;">¡Pago Aprobado!</h2>
                  <p style="color:#e0e0e0;margin-bottom:1rem;">Tu cuenta VIP ha sido activada exitosamente.</p>
                  <button id="pp-editor-receipt" style="background:none;border:1px solid rgba(197,160,89,0.4);color:#c5a059;padding:0.6rem 1.5rem;border-radius:8px;font-size:0.8rem;cursor:pointer;width:100%;margin-bottom:0.8rem;">📄 DESCARGAR RECIBO</button>
                  <button id="pp-editor-continue" style="background:#4ade80;color:#000;border:none;padding:0.8rem 2rem;border-radius:8px;font-weight:bold;font-size:1rem;cursor:pointer;width:100%;">CONTINUAR</button>
                </div>`;
              document.body.appendChild(successBanner);

              document.getElementById('pp-editor-receipt')?.addEventListener('click', async () => {
                try {
                  const { downloadPaymentReceipt } = await import('../components/PaymentReceipt');
                  const { getPaymentData } = await import('../services/auth');
                  const { auth } = await import('../services/firebase');
                  const uid = auth.currentUser?.uid;
                  const paymentInfo = uid ? await getPaymentData(uid) : null;
                  const profile = { fullName: data.fullName, cedula: data.cedula, email: data.email };
                  await downloadPaymentReceipt(paymentInfo || { method: 'payphone' }, profile);
                } catch(e) { console.warn('Receipt error', e); }
              });

              document.getElementById('pp-editor-continue')?.addEventListener('click', () => {
                successBanner.remove();
              });

              // Actualizar estado VIP en segundo plano
              onUpdate({ vip: true });
            } else {
              showToast('Pago no completado. Intenta nuevamente.', 'error');
            }
          }
        });
        payphone.render("#pp-button");
      } else if (attempts < 16) {
        // SDK aún no cargó — reintentar en 300ms (hasta ~5 segundos total)
        setTimeout(() => waitForPayPhone(attempts + 1), 300);
      } else {
        container.innerHTML = '<p style="color:#f87171; font-size:0.7rem;">Error: Motor PayPhone no cargado. Usa transferencia bancaria.</p>';
      }
    };
    waitForPayPhone();
  }; // fin showVipWall

  document.querySelector('#close-vip-modal')?.addEventListener('click', () => {
    vipModal.style.display = 'none';
  });

  themeButtons.forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      const theme = btn.dataset.theme;
      
      // Actualizar estado activo de los botones visualmente
      themeButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const alertEl = document.getElementById('dark-theme-alert');
      if (alertEl) {
        alertEl.style.display = ['dark-gold', 'carbon-gray', 'royal-navy'].includes(theme) ? 'flex' : 'none';
      }

      // Actualizar el CV directamente sin desmontar EditorView para no perder el zoom/scroll
      const { ResumeTemplate } = await import('../components/ResumeTemplate');
      data.theme = theme; 
      const cvContainer = document.getElementById('resume-document');
      if (cvContainer) {
        cvContainer.innerHTML = ResumeTemplate(data, theme);
      }

      // Enviar actualización a Firebase de forma silenciosa (skipRender = true)
      onUpdate({ theme }, true);
    });
  });

  // GESTURES NATIVE RESTORATION
  const a4W = 21 * 37.8;
  const a4H = 29.7 * 37.8;
  const vW = viewport.clientWidth;
  const vH = viewport.clientHeight;
  const fitZoom = Math.min((vW * 0.95) / a4W, (vH * 0.95) / a4H);

  let state = {
    scale: fitZoom
  };

  const updateTransform = () => {
    wrapper.style.transform = `scale(${state.scale})`;
    if (scaler) {
      scaler.style.width = `${wrapper.offsetWidth * state.scale}px`;
      scaler.style.height = `${wrapper.offsetHeight * state.scale}px`;
    }
    if (zoomLabel) zoomLabel.innerText = `${Math.round(state.scale * 100)}%`;
  };

  // ── LÓGICA DE ZOOM MANUAL (BOTONES) ──
  const zoomInBtn = document.getElementById('zoom-in');
  const zoomOutBtn = document.getElementById('zoom-out');
  const zoomFitBtn = document.getElementById('zoom-fit');
  const newClientBtn = document.getElementById('new-client-btn');

  // ── CONFIRMACIÓN DE SALIDA PARA SOCIOS ──
  const handleExitWithConfirmation = (callback) => {
    if (profileData?.role === 'partner') {
      const modal = document.createElement('div');
      modal.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.85); display:grid; place-items:center; z-index:99999; backdrop-filter:blur(5px);';
      modal.innerHTML = `
        <div style="background:#151820; border:1px solid rgba(197,160,89,0.3); padding:2rem; border-radius:12px; max-width:92%; width:400px; text-align:center; color:#fff; box-shadow:0 10px 40px rgba(0,0,0,0.8); box-sizing:border-box; margin: 0 auto; display:flex; flex-direction:column; align-items:center;">
          <div style="font-size:3rem; margin-bottom:1rem;">⚠️</div>
          <h3 style="color:#c5a059; margin-top:0; font-size:1.2rem; width:100%;">¿Cerrar Hoja de Vida?</h3>
          <p style="font-size:0.85rem; color:#a0a0b0; margin-bottom:1.5rem; width:100%; line-height:1.4;">Asegúrate de haber <strong>descargado o enviado</strong> el PDF a tu cliente. Al confirmar, los datos actuales se borrarán para iniciar uno nuevo limpio.</p>
          <div style="display:flex; gap:10px; width:100%; flex-wrap:wrap;">
            <button id="cancel-exit" style="flex:1; min-width:120px; padding:0.8rem; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); color:#fff; border-radius:8px; cursor:pointer;">Cancelar</button>
            <button id="confirm-exit" style="flex:1; min-width:120px; padding:0.8rem; background:linear-gradient(135deg, #c5a059, #e8c878); border:none; color:#000; font-weight:bold; border-radius:8px; cursor:pointer;">Sí, cerrar y limpiar</button>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
      
      modal.querySelector('#cancel-exit').addEventListener('click', () => modal.remove());
      modal.querySelector('#confirm-exit').addEventListener('click', () => {
        modal.remove();
        callback();
      });
    } else {
      callback(); // Para usuarios normales, sale inmediatamente
    }
  };

  newClientBtn?.addEventListener('click', () => {
    handleExitWithConfirmation(() => {
      if(onNewClient) onNewClient();
    });
  });
  const zoomLabel = document.getElementById('zoom-label');

  const setScaleWithLimit = (newScale) => {
    state.scale = Math.max(0.2, Math.min(newScale, 3.0));
    updateTransform();
  };

  zoomInBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    setScaleWithLimit(state.scale + 0.15);
  });

  zoomOutBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    setScaleWithLimit(state.scale - 0.15);
  });

  zoomFitBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    const isMobile = window.innerWidth < 600;
    const paddingX = isMobile ? 12 : 30;
    const paddingY = isMobile ? 30 : 60;
    const scaleW = (viewport.clientWidth - paddingX) / a4W;
    const scaleH = (viewport.clientHeight - paddingY) / a4H;
    const fitScale = Math.min(scaleW, scaleH);
    setScaleWithLimit(fitScale);
  });

  // ── AUTO-FIT INICIAL ──
  setTimeout(() => zoomFitBtn?.click(), 100);

  // ── GESTOS TÁCTILES Y ZOOM DE MOUSE PREMIUM ──
  let touchStartDist = 0;
  let touchStartScale = 1;
  let isPinching = false;

  viewport?.addEventListener('touchstart', (e) => {
    if (e.touches.length === 2) {
      isPinching = true;
      touchStartDist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      touchStartScale = state.scale;
    }
  }, { passive: true });

  viewport?.addEventListener('touchmove', (e) => {
    if (isPinching && e.touches.length === 2) {
      e.preventDefault(); // Evitar zoom nativo de toda la página
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      if (touchStartDist > 0) {
        const factor = dist / touchStartDist;
        setScaleWithLimit(touchStartScale * factor);
      }
    }
  }, { passive: false });

  viewport?.addEventListener('touchend', (e) => {
    if (e.touches.length < 2) {
      isPinching = false;
      touchStartDist = 0;
    }
  }, { passive: true });

  // Zoom de Rueda de Mouse Inteligente (Ctrl + Rueda de Mouse amplía la hoja, rueda normal hace scroll)
  viewport?.addEventListener('wheel', (e) => {
    if (e.ctrlKey) {
      e.preventDefault();
      const factor = e.deltaY < 0 ? 1.05 : 0.95;
      setScaleWithLimit(state.scale * factor);
    }
  }, { passive: false });

  const generatePDF = async (action) => {
    const element = document.getElementById('resume-document');
    const safeName = (data?.fullName || profileData?.fullName || 'Mi_Perfil')
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .trim()
      .replace(/\s+/g, '_')
      .replace(/[^a-zA-Z0-9_]/g, '');
    
    const customFilename = `Hoja_de_Vida_${safeName}.pdf`;

    showToast('Generando PDF Profesional...', 'info');

    try {
      // Carga Perezosa: importar html2pdf solo cuando el usuario lo pide
      const html2pdf = (await import('html2pdf.js')).default;
      
      const opt = {
        margin: [0, 0, 0, 0],
        filename: customFilename,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2, 
          useCORS: true, 
          letterRendering: true,
          scrollY: 0, scrollX: 0
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait', compress: true },
        pagebreak: { mode: ['css', 'legacy'] }
      };

      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
      
      if (isMobile) {
        const blob = await html2pdf().set(opt).from(element).output('blob');
        const file = new File([blob], customFilename, { type: 'application/pdf' });
        
        if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
          // Abre la interfaz nativa del celular (Guardar en Archivos, Drive, Compartir)
          await navigator.share({ files: [file], title: customFilename });
          showToast('✓ PDF listo. Selecciona "Guardar" o compártelo.', 'success');
        } else {
          // Fallback si no soporta Web Share API: intentar descargar de forma segura sin reemplazar pestaña
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = customFilename;
          a.target = '_blank';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          setTimeout(() => URL.revokeObjectURL(url), 1000);
          showToast('✓ Descarga iniciada', 'success');
        }
      } else {
        // Lógica inalterada para Computadoras de Escritorio
        await html2pdf().set(opt).from(element).save();
        showToast('✓ Descarga completada', 'success');
      }
    } catch (err) {
      console.error('Error al generar PDF:', err);
      showToast('Error al generar el PDF profesional.', 'error');
    }
  };

  downloadBtn?.addEventListener('click', async (e) => {
    e.preventDefault();
    if (!isVip) return showVipWall();
    await generatePDF('download');
  });

  document.querySelectorAll('#exit-editor-btn, #exit-editor-btn-mob').forEach(btn => btn.addEventListener('click', () => {
    handleExitWithConfirmation(() => onExit());
  }));
  document.querySelectorAll('#edit-info-btn, #edit-info-btn-mob').forEach(btn => btn.addEventListener('click', onEdit));
};
