import { ResumeTemplate } from '../components/ResumeTemplate';
import { showToast } from '../components/Toast';

export const EditorView = (resumeData, profileData, currentTheme = 'executive-navy') => {
  const isMobile = window.innerWidth < 600;
  // Bulletproof Master Bypass
  const isVip = !!resumeData?.vip || profileData?.role === 'admin' || profileData?.role === 'master' || (profileData?.role === 'partner' && profileData?.subActive);

  return `
<div class="animate-fade" style="display: flex; flex-direction: column; height: 100vh; overflow: hidden; background: #f5f5f7; font-family: -apple-system, BlinkMacSystemFont, 'Inter', sans-serif; position: fixed; top: 0; left: 0; width: 100vw; z-index: 5000;">
  
  <header style="padding: 0.8rem 1rem; background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(10px); border-bottom: 1px solid rgba(0,0,0,0.05); z-index: 1000;">
    <div style="max-width: 1200px; margin: 0 auto; display: flex; flex-direction: ${isMobile ? 'column' : 'row'}; gap: 12px; justify-content: space-between; align-items: center;">
       <div style="display: flex; justify-content: space-between; align-items: center; width: ${isMobile ? '100%' : 'auto'};">
          <div>
            <h3 style="margin: 0; font-size: 1rem; color: #1d1d1f;">Visor de Hoja de Vida</h3>
            ${isVip ? '' : '<span style="font-size: 0.7rem; color: #475569; text-transform: uppercase;">Modo Vista Previa</span>'}
          </div>
          <div style="display:flex; gap:0.5rem;">
            <button id="edit-info-btn-mob" type="button" class="neon-btn" style="padding: 0.5rem 0.9rem; font-size: 0.85rem; border-radius: 8px; font-weight:bold; cursor:pointer; ${!isMobile ? 'display:none;' : ''}">EDITAR</button>
            <button id="exit-editor-btn-mob" type="button" class="neon-btn" style="padding: 0.5rem 0.9rem; font-size: 0.85rem; border-radius: 8px; font-weight:bold; cursor:pointer; ${!isMobile ? 'display:none;' : ''}">SALIR</button>
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
          <button type="button" class="theme-select-h ${currentTheme === 'dark-gold' ? 'active' : ''}" data-theme="dark-gold">🌌 Dark Gold</button>
          <button type="button" class="theme-select-h ${currentTheme === 'carbon-gray' ? 'active' : ''}" data-theme="carbon-gray">🔘 Carbon Gray</button>
          <button type="button" class="theme-select-h ${currentTheme === 'royal-navy' ? 'active' : ''}" data-theme="royal-navy">🔵 Royal Navy</button>
       </div>
       <!-- Advertencia de impresión para temas oscuros -->
       <div id="dark-theme-alert" style="display: ${['dark-gold', 'carbon-gray', 'royal-navy'].includes(currentTheme) ? 'flex' : 'none'}; gap: 6px; align-items: center; justify-content: center; background: #f5f5f7; border: 1px solid rgba(0, 0, 0, 0.1); border-radius: 8px; padding: 0.35rem 0.8rem; font-size: 0.7rem; color: #1d1d1f; width: 100%; max-width: 600px; margin: 0 auto 0.2rem auto; text-align: center;">
         <strong>Nota de Impresión:</strong> Los diseños oscuros son espectaculares para envío digital por WhatsApp o Correo. Si planeas imprimirlo físicamente, te sugerimos usar un diseño claro para ahorrar tinta.
       </div>
       <div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap; justify-content: flex-end;">
          <button id="exit-editor-btn" type="button" class="neon-btn" style="padding: 0.55rem 1rem; font-size: 0.85rem; border-radius: 8px; font-weight:bold; cursor:pointer; flex:1; ${isMobile ? 'display:none;' : ''}">SALIR</button>
          <button id="edit-info-btn" type="button" class="neon-btn" style="padding: 0.55rem 1rem; font-size: 0.85rem; font-weight:bold; border-radius: 8px; cursor:pointer; flex:1; ${isMobile ? 'display:none;' : ''}">EDITAR INFO</button>
          <button id="download-pdf-btn" type="button" class="neon-btn" style="padding: 0.55rem 1rem; font-size: 0.9rem; flex: 1; font-weight: bold; border-radius: 8px; cursor:pointer;">
            ${isMobile ? 'DESCARGAR PDF <span style="color:#a0a0b0; margin: 0 4px;">/</span> WhatsApp <span style="color:#25d366; font-size:1.1rem; vertical-align:middle; line-height:1;">☻</span>' : 'DESCARGAR PDF'}
          </button>
          ${profileData?.role === 'partner' ? '<button id="new-client-btn" type="button" class="neon-btn" style="padding: 0.55rem 1rem; font-size: 0.9rem; flex: 1; font-weight: bold; border-radius: 8px; cursor:pointer; min-width: 150px;">🆕 NUEVO CLIENTE</button>' : ''}
       </div>
    </div>
  </header>

   <main id="preview-area" style="flex: 1; overflow: auto; background: #f5f5f7; position: relative; display: flex; flex-direction: column; align-items: center; padding: 20px 0 100px 0; touch-action: pan-x pan-y;">
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
     <div id="zoom-controls" style="position: absolute; bottom: 20px; right: 20px; display: flex; gap: 8px; z-index: 2000; background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(8px); padding: 6px; border-radius: 12px; border: 1px solid rgba(0,0,0,0.1); box-shadow: 0 8px 32px rgba(0,0,0,0.1);">
        <button id="zoom-out" title="Alejar" style="width: 32px; height: 32px; border-radius: 8px; border: 1px solid rgba(0,0,0,0.05); background: #f5f5f7; color: #1d1d1f; cursor: pointer; font-size: 1.2rem; display: flex; align-items: center; justify-content: center;">-</button>
        <div id="zoom-label" style="min-width: 45px; color: #0071e3; font-size: 0.75rem; font-weight: bold; display: flex; align-items: center; justify-content: center; user-select: none;">100%</div>
        <button id="zoom-in" title="Acercar" style="width: 32px; height: 32px; border-radius: 8px; border: 1px solid rgba(0,0,0,0.05); background: #f5f5f7; color: #1d1d1f; cursor: pointer; font-size: 1.2rem; display: flex; align-items: center; justify-content: center;">+</button>
        <div style="width: 1px; background: rgba(0,0,0,0.1); margin: 4px 2px;"></div>
        <button id="zoom-fit" title="Ajustar a Pantalla" style="width: 32px; height: 32px; border-radius: 8px; border: 1px solid rgba(0,0,0,0.05); background: #f5f5f7; color: #1d1d1f; cursor: pointer; font-size: 0.9rem; display: flex; align-items: center; justify-content: center;">↔</button>
     </div>
  </main>

  <style>
    .neon-btn { background: #ffffff !important; color: #1d1d1f !important; border: 1px solid rgba(0, 0, 0, 0.15) !important; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.02) !important; transition: all 0.2s ease !important; }
    .neon-btn:hover, .neon-btn:active { background: #f5f5f7 !important; border-color: rgba(0,0,0,0.3) !important; }
    
    #download-pdf-btn { background: #0071e3 !important; color: #ffffff !important; border: none !important; box-shadow: 0 4px 10px rgba(0, 113, 227, 0.3) !important; }
    #download-pdf-btn:hover { background: #0077ED !important; transform: translateY(-1px); }

    .theme-select-h { flex: 0 0 auto; background: #ffffff; border: 1px solid rgba(0,0,0,0.1); color: #1d1d1f; padding: 0.4rem 0.9rem; border-radius: 6px; font-size: 0.75rem; cursor: pointer; white-space: nowrap; transition: all 0.2s; user-select: none; }
    .theme-select-h.active { background: #0071e3; color: #ffffff; font-weight: bold; border-color: #0071e3; box-shadow: none; }
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
  <div id="vip-modal" class="vip-modal-container" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); z-index:99999; place-items:center; padding:1rem; overflow-y:auto; touch-action:auto; box-sizing:border-box; backdrop-filter:blur(6px);">
     <div class="premium-card animate-fade" style="max-width:480px; width:100%; background:var(--bg-glass); border:1px solid var(--border-glass); border-radius:24px; padding:2.5rem 2rem; text-align:center; position:relative; margin:auto; box-shadow:var(--shadow-lg); touch-action:auto; box-sizing:border-box; max-height:92vh; overflow-y:auto;">
        <button id="close-vip-modal" type="button" style="position:absolute; top:1rem; right:1.5rem; background:none; border:none; color:var(--text-main); font-size:1.8rem; cursor:pointer; line-height:1; transition:color 0.2s;" onmouseover="this.style.color='var(--primary)'" onmouseout="this.style.color='var(--text-main)'">&times;</button>
        <h2 style="color:var(--text-main); margin-bottom:0.3rem; font-size:1.4rem; font-weight:700;">Activa tu CV VIP</h2>
        <p style="color:var(--text-dim); font-size:0.95rem; margin-bottom:1.5rem; line-height:1.5;">Ediciones ilimitadas y descarga profesional por solo <strong style="color:var(--text-main);">$1.00</strong>.</p>
        <div id="payment-options-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; width: 100%; justify-content: center; margin-bottom: 1.5rem; box-sizing: border-box;">
          <button id="editor-card-btn" class="payment-block-btn" style="display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.8rem; padding: 1.5rem 1rem; background: #ffffff; border: 1px solid var(--border-glass); border-radius: 16px; box-shadow: var(--shadow-sm); cursor: pointer; transition: all 0.2s; width: 100%; box-sizing: border-box;" onmouseover="this.style.boxShadow='var(--shadow-md)'; this.style.transform='translateY(-2px)';" onmouseout="this.style.boxShadow='var(--shadow-sm)'; this.style.transform='translateY(0)';">
            <span style="font-size: 2.5rem; line-height: 1;">💳</span>
            <span style="color: var(--text-main); font-weight: 700; font-size: 1.05rem; letter-spacing: 0.5px; text-align: center;">Pagar con Tarjeta — $1.00</span>
          </button>
          <button id="editor-transfer-btn" class="payment-block-btn" style="display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.8rem; padding: 1.5rem 1rem; background: #ffffff; border: 1px solid var(--border-glass); border-radius: 16px; box-shadow: var(--shadow-sm); cursor: pointer; transition: all 0.2s; width: 100%; box-sizing: border-box;" onmouseover="this.style.boxShadow='var(--shadow-md)'; this.style.transform='translateY(-2px)';" onmouseout="this.style.boxShadow='var(--shadow-sm)'; this.style.transform='translateY(0)';">
            <span style="font-size: 2.5rem; line-height: 1;">🏦</span>
            <span style="color: var(--text-main); font-weight: 700; font-size: 1.05rem; letter-spacing: 0.5px; text-align: center;">Pagar por Transferencia</span>
          </button>
        </div>

        <div id="editor-payphone-container" style="display:none; width:100%;">
           <button type="button" class="pay-back-btn" style="display:inline-flex; align-items:center; gap:0.4rem; background:none; border:none; color:var(--text-dim); font-size:0.85rem; font-weight:600; cursor:pointer; padding:0.3rem 0; margin-bottom:0.8rem; transition:color 0.2s;" onmouseover="this.style.color='var(--primary)'" onmouseout="this.style.color='var(--text-dim)'">&larr; Cambiar forma de pago</button>
           <div id="pp-button" style="min-height:60px; display:flex; justify-content:center; touch-action:auto; width:100%; box-sizing:border-box;"></div>
           <style>
             #pp-button iframe {
               max-width: 100% !important;
               width: 100% !important;
             }
           </style>
        </div>

        <div id="editor-transfer-container" style="display:none; width:100%; text-align:left;">
           <button type="button" class="pay-back-btn" style="display:inline-flex; align-items:center; gap:0.4rem; background:none; border:none; color:var(--text-dim); font-size:0.85rem; font-weight:600; cursor:pointer; padding:0.3rem 0; margin-bottom:0.8rem; transition:color 0.2s;" onmouseover="this.style.color='var(--primary)'" onmouseout="this.style.color='var(--text-dim)'">&larr; Cambiar forma de pago</button>
           <div style="padding:1.2rem; background:var(--bg-deep); border:1px solid var(--border-glass); border-radius:12px; box-shadow:inset 0 2px 4px rgba(0,0,0,0.02);">
             <p style="margin:0 0 0.8rem; font-size:0.75rem; color:var(--text-main); font-weight:700; text-transform:uppercase; letter-spacing:0.5px; border-bottom:1px solid var(--border-glass); padding-bottom:0.5rem;">🏦 Pago por Transferencia Bancaria</p>
             <p style="margin:0.2rem 0; font-size:0.85rem; color:var(--text-dim);"><b>Banco:</b> Pichincha — Cuenta de Ahorros</p>
             <p style="margin:0.2rem 0; font-size:0.95rem; color:var(--primary); font-weight:800; letter-spacing:1px;">N° 2215852866 &nbsp;&nbsp;<span style="color:var(--text-dim); font-weight:normal; font-size:0.85rem;">|&nbsp; Cel: 0962696067</span></p>
             <p style="margin:0.2rem 0; font-size:0.85rem; color:var(--text-dim);"><b>Titular:</b> David Flores G.</p>
             <p style="margin:0.8rem 0 0; font-size:0.75rem; color:var(--text-dim); font-style:italic;">Envía el comprobante por WhatsApp para activar tu cuenta VIP.</p>
           </div>
           <div style="display:flex; flex-direction:column; gap:0.8rem; margin-top:1rem;">
             <a href="https://wa.me/593962696067?text=Hola%20David,%20adjunto%20comprobante%20de%20%241%20para%20activar%20mi%20Cuenta%20VIP%20-%20Usuario:%20${data.fullName}" target="_blank" style="text-decoration:none; display:flex; align-items:center; justify-content:center; gap:0.5rem; background:#ffffff; color:var(--text-main); border:1px solid var(--border-glass); border-radius:12px; padding:1rem; font-size:1rem; font-weight:700; transition:all 0.2s; box-shadow:var(--shadow-sm);" onmouseover="this.style.boxShadow='var(--shadow-md)'; this.style.borderColor='#25d366';" onmouseout="this.style.boxShadow='var(--shadow-sm)'; this.style.borderColor='var(--border-glass)';">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#25d366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg> ENVIAR POR WHATSAPP
             </a>
           </div>
        </div>
     </div>
  </div>`;
  document.body.insertAdjacentHTML('beforeend', vipModalHTML);
  const vipModal = document.getElementById('vip-modal');

  // Volver a la vista de opciones (Tarjeta / Transferencia)
  const resetPaymentView = () => {
    document.getElementById('payment-options-grid').style.display = 'grid';
    document.getElementById('editor-payphone-container').style.display = 'none';
    document.getElementById('editor-transfer-container').style.display = 'none';
  };
  vipModal.querySelectorAll('.pay-back-btn').forEach(b => { b.onclick = resetPaymentView; });

  const showVipWall = () => {
    resetPaymentView();
    vipModal.style.display = 'grid';

    // onclick (no addEventListener) para no acumular listeners cada vez que se abre el modal
    const cardBtn = document.getElementById('editor-card-btn');
    if (cardBtn) cardBtn.onclick = () => {
      document.getElementById('payment-options-grid').style.display = 'none';
      document.getElementById('editor-transfer-container').style.display = 'none';
      document.getElementById('editor-payphone-container').style.display = 'block';
    };

    const transferBtn = document.getElementById('editor-transfer-btn');
    if (transferBtn) transferBtn.onclick = () => {
      document.getElementById('payment-options-grid').style.display = 'none';
      document.getElementById('editor-payphone-container').style.display = 'none';
      document.getElementById('editor-transfer-container').style.display = 'block';
    };

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
              successBanner.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);display:grid;place-items:center;z-index:99999;backdrop-filter:blur(5px);';
              successBanner.innerHTML = `
                <div class="premium-card animate-fade" style="text-align:center;padding:2.5rem 2rem;max-width:380px;background:var(--bg-glass);border:1px solid var(--border-glass);border-radius:24px;box-shadow:var(--shadow-lg);">
                  <div style="font-size:4rem;margin-bottom:0.5rem;">✅</div>
                  <h2 style="color:#16a34a;margin:0 0 0.5rem;font-weight:700;">¡Pago Aprobado!</h2>
                  <p style="color:var(--text-dim);margin-bottom:1.5rem;font-size:0.95rem;">Tu cuenta VIP ha sido activada exitosamente.</p>
                  <button id="pp-editor-receipt" style="background:#ffffff;border:1px solid var(--border-glass);color:var(--text-main);padding:0.8rem;border-radius:8px;font-size:0.85rem;font-weight:600;cursor:pointer;width:100%;margin-bottom:0.8rem;box-shadow:var(--shadow-sm);transition:all 0.2s;" onmouseover="this.style.background='var(--bg-deep)'" onmouseout="this.style.background='#ffffff'">📄 DESCARGAR RECIBO</button>
                  <button id="pp-editor-continue" class="btn-primary" style="padding:0.8rem;border-radius:8px;font-weight:700;font-size:1rem;cursor:pointer;width:100%;">CONTINUAR</button>
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
    resetPaymentView();
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
      modal.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.4); display:grid; place-items:center; z-index:99999; backdrop-filter:blur(5px);';
      modal.innerHTML = `
        <div class="premium-card animate-fade" style="padding:2rem; max-width:92%; width:400px; text-align:center; box-sizing:border-box; margin: 0 auto; display:flex; flex-direction:column; align-items:center; background:var(--bg-glass);">
          <div style="font-size:3rem; margin-bottom:1rem;">⚠️</div>
          <h3 style="color:var(--text-main); margin-top:0; font-size:1.2rem; width:100%; font-weight:700;">¿Cerrar Hoja de Vida?</h3>
          <p style="font-size:0.85rem; color:var(--text-dim); margin-bottom:1.5rem; width:100%; line-height:1.4;">Asegúrate de haber <strong>descargado o enviado</strong> el PDF a tu cliente. Al confirmar, los datos actuales se borrarán para iniciar uno nuevo limpio.</p>
          <div style="display:flex; gap:10px; width:100%; flex-wrap:wrap;">
            <button id="cancel-exit" style="flex:1; min-width:120px; padding:0.8rem; background:#ffffff; border:1px solid var(--border-glass); color:var(--text-main); border-radius:8px; cursor:pointer; font-weight:600; box-shadow:var(--shadow-sm); transition:background 0.2s;" onmouseover="this.style.background='var(--bg-deep)'" onmouseout="this.style.background='#ffffff'">Cancelar</button>
            <button id="confirm-exit" class="btn-primary" style="flex:1; min-width:120px; padding:0.8rem; border:none; border-radius:8px; cursor:pointer; font-weight:700; background:#ef4444; color:#fff; box-shadow:0 4px 14px rgba(239, 68, 68, 0.3);">Sí, cerrar y limpiar</button>
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
      // >>> CÓDIGO TEMPORAL PARA SERVIDOR LOCAL PUPPETEER <<<
      // Construimos un HTML completo inyectando los estilos del dev server
      const fullHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,800;1,400&family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
            <style>
              @page {
                size: A4;
                margin: 0;
              }
              html, body { 
                background: white !important; 
                margin: 0 !important; 
                padding: 0 !important; 
                width: 21cm !important;
                min-height: 29.7cm !important;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
              /* Asegurar que las variables CSS raíz estén disponibles */
              :root {
                --primary: #0aa79c;
                --text-main: #0f172a;
              }
              /* Resetear cualquier transformación por si acaso */
              * {
                transform: none !important;
                zoom: 1 !important;
              }
            </style>
          </head>
          <body>
            ${element.outerHTML}
          </body>
        </html>
      `;

      // Usar el backend de Firebase en Producción
      const response = await fetch('https://us-central1-virtuals2.cloudfunctions.net/generatePdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ html: fullHtml })
      });

      if (!response.ok) {
        throw new Error('Error en el servidor de PDF');
      }

      const blob = await response.blob();
      const file = new File([blob], customFilename, { type: 'application/pdf' });

      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
      
      if (isMobile) {
        if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({ files: [file], title: customFilename });
            showToast('✓ PDF listo. Selecciona "Guardar" o compártelo.', 'success');
          } catch (shareErr) {
            showToast('✓ PDF generado con éxito.', 'success');
          }
        } else {
          // Fallback descarga manual móvil
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
        // Desktop download
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = customFilename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        showToast('✓ Descarga completada', 'success');
      }
      // <<< FIN CÓDIGO TEMPORAL <<<
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
