import { ResumeTemplate } from '../components/ResumeTemplate';
import html2pdf from 'html2pdf.js';
import { showToast } from '../components/Toast';

export const EditorView = (resumeData, profileData, currentTheme = 'executive-navy') => {
  const isMobile = window.innerWidth < 600;
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
       <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 0.4rem; padding: 0.4rem 0; width: 100%;">
          <button type="button" class="theme-select-h ${currentTheme === 'executive-navy' ? 'active' : ''}" data-theme="executive-navy">Standard</button>
          <button type="button" class="theme-select-h ${currentTheme === 'tech-minimal' ? 'active' : ''}" data-theme="tech-minimal">Minimalist</button>
          <button type="button" class="theme-select-h ${currentTheme === 'modern-sidebar' ? 'active' : ''}" data-theme="modern-sidebar">Modern Side</button>
          <button type="button" class="theme-select-h ${currentTheme === 'harvard-classic' ? 'active' : ''}" data-theme="harvard-classic">Harvard Classic</button>
          <button type="button" class="theme-select-h ${currentTheme === 'harvard-navy' ? 'active' : ''}" data-theme="harvard-navy">Harvard Navy</button>
          <button type="button" class="theme-select-h ${currentTheme === 'startup-modern' ? 'active' : ''}" data-theme="startup-modern">Startup Pro</button>
          <button type="button" class="theme-select-h ${currentTheme === 'creative-exec' ? 'active' : ''}" data-theme="creative-exec">Creative Exec</button>
       </div>
       <div style="display: flex; gap: 8px; align-items: center;">
          <button id="exit-editor-btn" type="button" style="padding: 0.55rem 1rem; font-size: 0.85rem; background: rgba(60,65,80,0.7); border: 1px solid rgba(255,255,255,0.12); border-radius: 8px; color: #e0e0e0; cursor:pointer; flex:1; ${isMobile ? 'display:none;' : ''}">SALIR</button>
          <button id="edit-info-btn" type="button" style="padding: 0.55rem 1rem; font-size: 0.85rem; background: rgba(197,160,89,0.1); border: 1px solid var(--primary); color: var(--primary); font-weight:bold; border-radius: 8px; cursor:pointer; flex:1; ${isMobile ? 'display:none;' : ''}">EDITAR INFO</button>
          <button id="share-whatsapp-btn" type="button" style="padding: 0.55rem 1rem; background: ${isVip ? '#25D366' : 'rgba(37,211,102,0.15)'}; border: 1px solid ${isVip ? '#25D366' : 'rgba(255,255,255,0.1)'}; color: ${isVip ? '#fff' : 'var(--text-dim)'}; font-size: 0.9rem; font-weight: bold; flex: 1; border-radius: 8px; cursor:pointer;">WhatsApp</button>
          <button id="download-pdf-btn" type="button" class="btn-primary" style="padding: 0.55rem 1rem; font-size: 0.9rem; flex: 1; font-weight: bold; ${!isVip ? 'filter: grayscale(1);' : ''}">DESCARGAR PDF</button>
       </div>
    </div>
  </header>

   <main id="preview-area" style="flex: 1; overflow: hidden; background: radial-gradient(circle at center, #1a1c25 0%, #050505 100%); position: relative; display: grid; place-items: center; touch-action: none; cursor: grab;">
      <div id="resume-wrapper" style="width: 21cm; height: 29.7cm; position: relative; transform-origin: center center; transition: transform 0.1s ease-out; user-select: none; will-change: transform;">
         <div style="width: 100%; height: 100%; box-shadow: 0 40px 120px rgba(0,0,0,0.8), 0 0 1px rgba(255,255,255,0.1); background: white; border-radius: 2px;">
            <div id="resume-document">
               ${ResumeTemplate(resumeData, currentTheme)}
            </div>
         </div>
      </div>
     <!-- Barra de Control de Zoom Premium -->
     <div id="zoom-controls" style="position: absolute; bottom: 30px; left: 50%; transform: translateX(-50%); display: flex; gap: 12px; z-index: 2000; background: rgba(20, 22, 30, 0.92); backdrop-filter: blur(12px); padding: 8px 16px; border-radius: 30px; border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 20px 40px rgba(0,0,0,0.6);">
        <button id="zoom-out" title="Alejar" style="width: 38px; height: 38px; border-radius: 50%; border: none; background: rgba(255,255,255,0.05); color: white; cursor: pointer; font-size: 1.5rem; display: flex; align-items: center; justify-content: center; transition: 0.2s;">-</button>
        <div id="zoom-label" style="min-width: 55px; color: var(--primary); font-size: 0.9rem; font-weight: bold; display: flex; align-items: center; justify-content: center; user-select: none;">100%</div>
        <button id="zoom-in" title="Acercar" style="width: 38px; height: 38px; border-radius: 50%; border: none; background: rgba(255,255,255,0.05); color: white; cursor: pointer; font-size: 1.5rem; display: flex; align-items: center; justify-content: center; transition: 0.2s;">+</button>
        <div style="width: 1px; background: rgba(255,255,255,0.1); margin: 8px 4px;"></div>
        <button id="zoom-fit" title="Ajustar" style="width: 38px; height: 38px; border-radius: 50%; border: none; background: rgba(255,255,255,0.05); color: white; cursor: pointer; font-size: 1.1rem; display: flex; align-items: center; justify-content: center; transition: 0.2s;">↔</button>
     </div>
   </main>

  <style>
    .theme-select-h { flex: 0 0 auto; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: var(--text-dim); padding: 0.4rem 0.9rem; border-radius: 6px; font-size: 0.75rem; cursor: pointer; white-space: nowrap; transition: all 0.2s; user-select: none; }
    .theme-select-h.active { background: var(--primary); color: #000; font-weight: bold; border-color: var(--primary); }
    .theme-select-h:hover { background: rgba(255,255,255,0.1); }
    .vip-modal-container { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.92); z-index: 6000; place-items: center; padding: 1rem; overflow-y: auto; }
    #preview-area:active { cursor: grabbing; }
  </style>

</div>
`;
};

export const attachEditorListeners = (data, profileData, onUpdate, onExit, onEdit) => {
  const isVip = !!data.vip || profileData?.role === 'admin' || profileData?.role === 'master' || (profileData?.role === 'partner' && profileData?.subActive);
  const themeButtons = document.querySelectorAll('.theme-select-h');
  const shareBtn = document.querySelector('#share-whatsapp-btn');
  const downloadBtn = document.querySelector('#download-pdf-btn');
  const viewport = document.getElementById('preview-area');
  const wrapper = document.getElementById('resume-wrapper');

  // ── MODAL VIP (Re-inyectar para asegurar que está en el DOM) ──
  const existingModal = document.getElementById('vip-modal');
  if (existingModal) existingModal.remove();
  const vipModalHTML = `
  <div id="vip-modal" class="vip-modal-container" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.92); z-index:99999; place-items:center; padding:1rem; overflow-y:auto; touch-action:auto;">
     <div class="glass" style="max-width:380px; width:100%; padding:1.5rem; text-align:center; position:relative; margin:auto;">
        <button id="close-vip-modal" type="button" style="position:absolute; top:0.5rem; right:0.8rem; background:none; border:none; color:white; font-size:1.8rem; cursor:pointer;">&times;</button>
        <div style="font-size:2rem; margin-bottom:0.5rem;">💎</div>
        <h2 style="color:var(--primary); margin-bottom:0.3rem; font-size:1.2rem;">Activa tu CV VIP</h2>
        <p style="color:var(--text-dim); font-size:0.75rem; margin-bottom:1.5rem;">Ediciones ilimitadas y descarga profesional por solo <b>$1.00</b>.</p>
        <div style="background:rgba(255,255,255,0.03); border:1px solid var(--border-glass); padding:1rem; border-radius:8px; margin-bottom:1.2rem; text-align:left;">
           <h4 style="margin:0 0 0.8rem; color:var(--primary); font-size:0.7rem; text-transform:uppercase;">Activa con un clic (Recomendado)</h4>
           <div id="pp-button" style="min-height:60px; display:flex; justify-content:center;"></div>
           <div style="margin-top:1rem; padding:0.9rem; border-top:1px solid rgba(255,255,255,0.08); background:rgba(197,160,89,0.07); border:1px solid rgba(197,160,89,0.25); border-radius:8px;">
             <p style="margin:0 0 0.5rem; font-size:0.7rem; color:var(--primary); font-weight:bold; text-transform:uppercase;">🏦 Pago por Transferencia Bancaria</p>
             <p style="margin:0.2rem 0; font-size:0.8rem; color:#e0e0e0;"><b>Banco:</b> Pichincha — Ahorros</p>
             <p style="margin:0.2rem 0; font-size:0.85rem; color:#fff; font-weight:bold;">N° 2215852866</p>
             <p style="margin:0.2rem 0; font-size:0.8rem; color:#e0e0e0;"><b>Titular:</b> David Flores G.</p>
           </div>
        </div>
        <a href="https://wa.me/593962696067?text=Hola%20David,%20adjunto%20comprobante%20de%20%241%20para%20activar%20mi%20Cuenta%20VIP" target="_blank" class="btn-primary" style="text-decoration:none; background:#25d366; color:white; padding:0.7rem; font-size:0.8rem; font-weight:bold; display:block;">📱 ENVIAR POR WHATSAPP</a>
     </div>
  </div>`;
  document.body.insertAdjacentHTML('beforeend', vipModalHTML);
  const vipModal = document.getElementById('vip-modal');
  document.getElementById('close-vip-modal')?.addEventListener('click', () => vipModal.style.display = 'none');

  const showVipWall = () => {
    vipModal.style.display = 'grid';
    const container = document.querySelector('#pp-button');
    if (!container) return;
    container.innerHTML = '<p style="color:var(--text-dim); font-size:0.7rem;">Cargando pasarela...</p>'; 

    const waitForPayPhone = (attempts = 0) => {
      if (window.PPaymentButtonBox) {
        container.innerHTML = '';
        const token = "eNWk5EmtuMRdMJGQiJg-djEE4-stUyzApT1-3qzncfIrAwHRf84JpK4kHdZ6Y0uuhpXiVuCQ3EJKYb5pK44odTQNBvVSOTlyD5RG4cbcHwUDc-Vd9BfbhHBnL-S_Yz7Rz048UNiAXdti8XVk_fB7BSH7WA8I6csr_e8IRAie1e8F6pEL4zojWu7Vnn3tGjSgV-CPaK5iQ1BhfWopBUmVhoFemeLDGbb0xxsZGTSQ-FRK6z61mwSn9c_4PpGl6srEPWh7pvbmgs53OnkXFes3tCX5f8CWL4vTJ8f5v9Udvb5KOq2rSsUS28EX9hQIFXkN0s16BdPhU_iyTMsP2g6YEabj3VI";
        const payphone = new PPaymentButtonBox({
          token: token, clientTransactionId: `VO2-${Date.now()}`, amount: 100, amountWithoutTax: 100, currency: "USD", reference: "Activacion VIP", lang: "es",
          onCompleted: async (model, status) => {
            if (status === 'Approved') {
              vipModal.style.display = 'none';
              onUpdate({ vip: true });
              showToast('¡Cuenta VIP Activada!', 'success');
            }
          }
        });
        payphone.render("#pp-button");
      } else if (attempts < 15) setTimeout(() => waitForPayPhone(attempts + 1), 300);
    };
    waitForPayPhone();
  };

  // ── MOTOR PROFESIONAL DE NAVEGACIÓN (PAN & ZOOM) ──
  const a4W = 21 * 37.8;
  const a4H = 29.7 * 37.8;
  const vW = viewport.clientWidth;
  const vH = viewport.clientHeight;
  const fitZoom = Math.min((vW * 0.9) / a4W, (vH * 0.8) / a4H);

  let state = {
    scale: fitZoom,
    offset: { x: 0, y: 0 },
    isDragging: false,
    lastMouse: { x: 0, y: 0 },
    pointers: new Map(),
    prevDiff: -1
  };

  const updateTransform = () => {
    wrapper.style.transform = `translate(${state.offset.x}px, ${state.offset.y}px) scale(${state.scale})`;
    const label = document.getElementById('zoom-label');
    if (label) label.innerText = `${Math.round(state.scale * 100)}%`;
  };

  const setScaleWithLimit = (newScale) => {
    state.scale = Math.max(0.15, Math.min(newScale, 4.0));
    updateTransform();
  };

  // ── EVENTOS DE INTERACCIÓN ──
  viewport.addEventListener('pointerdown', (e) => {
    state.pointers.set(e.pointerId, e);
    if (state.pointers.size === 1) {
      state.isDragging = true;
      state.lastMouse = { x: e.clientX, y: e.clientY };
    }
    if (state.pointers.size < 2) state.prevDiff = -1;
  });

  window.addEventListener('pointermove', (e) => {
    if (!state.pointers.has(e.pointerId)) return;
    state.pointers.set(e.pointerId, e);

    if (state.pointers.size === 2) {
      const pArray = Array.from(state.pointers.values());
      const curDiff = Math.sqrt(Math.pow(pArray[0].clientX - pArray[1].clientX, 2) + Math.pow(pArray[0].clientY - pArray[1].clientY, 2));
      if (state.prevDiff > 0) setScaleWithLimit(state.scale + (curDiff - state.prevDiff) * 0.005);
      state.prevDiff = curDiff;
    } else if (state.isDragging) {
      state.offset.x += e.clientX - state.lastMouse.x;
      state.offset.y += e.clientY - state.lastMouse.y;
      state.lastMouse = { x: e.clientX, y: e.clientY };
      updateTransform();
    }
  });

  const stopDrag = (e) => {
    state.pointers.delete(e.pointerId);
    state.isDragging = false;
    if (state.pointers.size < 2) state.prevDiff = -1;
  };
  window.addEventListener('pointerup', stopDrag);
  window.addEventListener('pointercancel', stopDrag);

  // Rueda del mouse (Zoom)
  viewport.addEventListener('wheel', (e) => {
    e.preventDefault();
    setScaleWithLimit(state.scale + (e.deltaY < 0 ? 0.1 : -0.1));
  }, { passive: false });

  viewport.addEventListener('dblclick', () => {
    state.offset = { x: 0, y: 0 };
    state.scale = fitZoom;
    updateTransform();
  });

  document.getElementById('zoom-in')?.addEventListener('click', () => setScaleWithLimit(state.scale + 0.2));
  document.getElementById('zoom-out')?.addEventListener('click', () => setScaleWithLimit(state.scale - 0.2));
  document.getElementById('zoom-fit')?.addEventListener('click', () => {
    state.offset = { x: 0, y: 0 };
    state.scale = fitZoom;
    updateTransform();
  });

  themeButtons.forEach(btn => btn.addEventListener('click', (e) => {
    onUpdate({ theme: btn.dataset.theme });
  }));

  const generatePDF = async (action) => {
    const element = document.getElementById('resume-document');
    const safeName = (profileData?.fullName || data?.fullName || 'CV')
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
    const filename = `Hoja_de_Vida_${safeName}.pdf`;

    showToast('Generando PDF...', 'info');
    try {
      const opt = {
        margin: 0, filename: filename, image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, letterRendering: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['css', 'legacy'] }
      };

      if (action === 'share') {
        const blob = await html2pdf().set(opt).from(element).output('blob');
        if (navigator.share) await navigator.share({ files: [new File([blob], filename, { type: 'application/pdf' })], title: filename });
      } else {
        await html2pdf().set(opt).from(element).save();
        showToast('✓ Descargado', 'success');
      }
    } catch (err) { showToast('Error al generar PDF', 'error'); }
  };

  shareBtn?.addEventListener('click', () => isVip ? generatePDF('share') : showVipWall());
  downloadBtn?.addEventListener('click', () => isVip ? generatePDF('download') : showVipWall());
  document.querySelectorAll('#exit-editor-btn, #exit-editor-btn-mob').forEach(b => b.addEventListener('click', onExit));
  document.querySelectorAll('#edit-info-btn, #edit-info-btn-mob').forEach(b => b.addEventListener('click', onEdit));

  updateTransform();
};
