import { ResumeTemplate } from '../components/ResumeTemplate';
import { showToast } from '../components/Toast';

let html2pdfModule = null;
const getHtml2Pdf = async () => {
  if (!html2pdfModule) {
    const { default: lib } = await import('html2pdf.js');
    html2pdfModule = lib;
  }
  return html2pdfModule;
};

export const EditorView = (resumeData, profileData, currentTheme = 'executive-navy') => {
  const isMobile = window.innerWidth < 600;
  const isVip = !!resumeData?.vip || profileData?.role === 'admin' || profileData?.role === 'master' || (profileData?.role === 'partner' && profileData?.subActive);

  return `
<div class="editor-animate-fast" style="display: flex; flex-direction: column; height: 100vh; overflow: hidden; background: #0a0b10; font-family: 'Inter', sans-serif; position: fixed; top: 0; left: 0; width: 100vw; z-index: 5000;">
  
  <header style="padding: 0.6rem 1rem; background: rgba(10, 11, 16, 0.98); backdrop-filter: blur(10px); border-bottom: 1px solid rgba(255,255,255,0.05); z-index: 1000;">
    <div style="max-width: 1200px; margin: 0 auto; display: flex; flex-direction: ${isMobile ? 'column' : 'row'}; gap: 10px; justify-content: space-between; align-items: center;">
       <div style="display: flex; justify-content: space-between; align-items: center; width: ${isMobile ? '100%' : 'auto'};">
          <div>
            <h3 style="margin: 0; font-size: 0.95rem; color: var(--primary);">Visor Profesional</h3>
            <span style="font-size: 0.65rem; color: ${isVip ? '#4ade80' : 'var(--text-dim)'}; text-transform: uppercase; font-weight: bold;">${isVip ? '✓ Acceso VIP' : 'Vista Previa'}</span>
          </div>
          <div style="display:flex; gap:0.5rem;">
            <button id="edit-info-btn-mob" type="button" style="padding: 0.4rem 0.8rem; font-size: 0.8rem; background: rgba(197,160,89,0.1); border: 1px solid var(--primary); border-radius: 6px; color: var(--primary); font-weight:bold; ${!isMobile ? 'display:none;' : ''}">EDITAR</button>
            <button id="exit-editor-btn-mob" type="button" style="padding: 0.4rem 0.8rem; font-size: 0.8rem; background: rgba(60,65,80,0.7); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; color: #fff; ${!isMobile ? 'display:none;' : ''}">SALIR</button>
          </div>
       </div>
       <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 0.3rem; padding: 0.2rem 0; width: 100%;">
          <button type="button" class="theme-select-h ${currentTheme === 'executive-navy' ? 'active' : ''}" data-theme="executive-navy">Standard</button>
          <button type="button" class="theme-select-h ${currentTheme === 'tech-minimal' ? 'active' : ''}" data-theme="tech-minimal">Minimalist</button>
          <button type="button" class="theme-select-h ${currentTheme === 'modern-sidebar' ? 'active' : ''}" data-theme="modern-sidebar">Modern Side</button>
          <button type="button" class="theme-select-h ${currentTheme === 'harvard-classic' ? 'active' : ''}" data-theme="harvard-classic">Harvard Classic</button>
          <button type="button" class="theme-select-h ${currentTheme === 'harvard-navy' ? 'active' : ''}" data-theme="harvard-navy">Harvard Navy</button>
          <button type="button" class="theme-select-h ${currentTheme === 'startup-modern' ? 'active' : ''}" data-theme="startup-modern">Startup Pro</button>
          <button type="button" class="theme-select-h ${currentTheme === 'creative-exec' ? 'active' : ''}" data-theme="creative-exec">Creative Exec</button>
       </div>
       <div style="display: flex; gap: 6px; align-items: center;">
          <button id="exit-editor-btn" type="button" style="padding: 0.5rem 0.9rem; font-size: 0.8rem; background: rgba(60,65,80,0.7); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; color: #fff; cursor:pointer; ${isMobile ? 'display:none;' : ''}">SALIR</button>
          <button id="edit-info-btn" type="button" style="padding: 0.5rem 0.9rem; font-size: 0.8rem; background: rgba(197,160,89,0.1); border: 1px solid var(--primary); color: var(--primary); font-weight:bold; border-radius: 6px; cursor:pointer; ${isMobile ? 'display:none;' : ''}">EDITAR INFO</button>
          <button id="share-whatsapp-btn" type="button" style="padding: 0.5rem 0.9rem; background: ${isVip ? '#25D366' : 'rgba(37,211,102,0.15)'}; border: 1px solid ${isVip ? '#25D366' : 'rgba(255,255,255,0.1)'}; color: ${isVip ? '#fff' : 'var(--text-dim)'}; font-size: 0.85rem; font-weight: bold; border-radius: 6px; cursor:pointer;">WhatsApp</button>
          <button id="download-pdf-btn" type="button" class="btn-primary" style="padding: 0.5rem 1rem; font-size: 0.85rem; font-weight: bold; ${!isVip ? 'filter: grayscale(1);' : ''}">DESCARGAR PDF</button>
       </div>
    </div>
  </header>

   <main id="preview-area" style="flex: 1; overflow: hidden; background: radial-gradient(circle at center, #111218 0%, #050505 100%); position: relative; display: flex; align-items: center; justify-content: center; touch-action: none; cursor: grab;">
      <div id="resume-wrapper" style="width: 21cm; height: 29.6cm; flex-shrink: 0; position: relative; transform-origin: center center; user-select: none; will-change: transform;">
         <div style="width: 100%; height: 100%; box-shadow: 0 40px 100px rgba(0,0,0,0.9); background: white; border-radius: 2px;">
            <div id="resume-document">
               ${ResumeTemplate(resumeData, currentTheme)}
            </div>
         </div>
      </div>
     <div id="zoom-controls" style="position: absolute; bottom: 25px; left: 50%; transform: translateX(-50%); display: flex; gap: 10px; z-index: 2000; background: rgba(20, 22, 30, 0.95); backdrop-filter: blur(15px); padding: 6px 14px; border-radius: 30px; border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
        <button id="zoom-out" style="width: 34px; height: 34px; border-radius: 50%; border: none; background: rgba(255,255,255,0.05); color: white; cursor: pointer; font-size: 1.4rem; display: flex; align-items: center; justify-content: center;">-</button>
        <div id="zoom-label" style="min-width: 50px; color: var(--primary); font-size: 0.85rem; font-weight: bold; display: flex; align-items: center; justify-content: center; user-select: none;">100%</div>
        <button id="zoom-in" style="width: 34px; height: 34px; border-radius: 50%; border: none; background: rgba(255,255,255,0.05); color: white; cursor: pointer; font-size: 1.4rem; display: flex; align-items: center; justify-content: center;">+</button>
        <div style="width: 1px; background: rgba(255,255,255,0.1); margin: 6px 2px;"></div>
        <button id="zoom-fit" style="width: 34px; height: 34px; border-radius: 50%; border: none; background: rgba(255,255,255,0.05); color: white; cursor: pointer; font-size: 1rem; display: flex; align-items: center; justify-content: center;">↔</button>
     </div>
   </main>

  <style>
    .editor-animate-fast { animation: editor-fade-fast 0.15s ease-out; }
    @keyframes editor-fade-fast { from { opacity: 0; transform: scale(1.02); } to { opacity: 1; transform: scale(1); } }
    .theme-select-h { flex: 0 0 auto; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); color: var(--text-dim); padding: 0.35rem 0.8rem; border-radius: 6px; font-size: 0.7rem; cursor: pointer; white-space: nowrap; transition: 0.15s; }
    .theme-select-h.active { background: var(--primary); color: #000; font-weight: bold; border-color: var(--primary); }
    #preview-area:active { cursor: grabbing; }
  </style>
</div>
`;
};

export const attachEditorListeners = (data, profileData, onUpdate, onExit, onEdit) => {
  const isVip = !!data.vip || profileData?.role === 'admin' || profileData?.role === 'master' || (profileData?.role === 'partner' && profileData?.subActive);
  const viewport = document.getElementById('preview-area');
  const wrapper = document.getElementById('resume-wrapper');

  const a4W = 21 * 37.8;
  const a4H = 29.6 * 37.8;
  const fitZoom = Math.min((viewport.clientWidth * 0.95) / a4W, (viewport.clientHeight * 0.85) / a4H);

  let state = {
    scale: fitZoom,
    offset: { x: 0, y: 0 },
    isDragging: false,
    lastMouse: { x: 0, y: 0 },
    pointers: new Map(),
    prevDiff: -1
  };

  const updateTransform = () => {
    // ── MOTOR DE LÍMITES (BOUNDARIES) ──
    const vw = viewport.clientWidth;
    const vh = viewport.clientHeight;
    const curW = a4W * state.scale;
    const curH = a4H * state.scale;

    // Calcular límites permitidos (no dejar que la hoja salga más de un 40% de la pantalla)
    const limitX = Math.max(0, (curW - vw) / 2) + (vw * 0.4);
    const limitY = Math.max(0, (curH - vh) / 2) + (vh * 0.4);

    if (state.scale <= fitZoom + 0.01) {
      // Si el zoom es pequeño, forzar centrado suave
      state.offset.x *= 0.8;
      state.offset.y *= 0.8;
      if (Math.abs(state.offset.x) < 1) state.offset.x = 0;
      if (Math.abs(state.offset.y) < 1) state.offset.y = 0;
    } else {
      // Aplicar límites de arrastre
      state.offset.x = Math.max(-limitX, Math.min(state.offset.x, limitX));
      state.offset.y = Math.max(-limitY, Math.min(state.offset.y, limitY));
    }

    wrapper.style.transform = `translate(${state.offset.x}px, ${state.offset.y}px) scale(${state.scale})`;
    const label = document.getElementById('zoom-label');
    if (label) label.innerText = `${Math.round(state.scale * 100)}%`;
  };

  const setScaleWithLimit = (newScale) => {
    state.scale = Math.max(0.1, Math.min(newScale, 4.0));
    updateTransform();
  };

  // ── EVENTOS ──
  viewport.addEventListener('wheel', (e) => {
    e.preventDefault();
    if (e.ctrlKey) setScaleWithLimit(state.scale + (e.deltaY < 0 ? 0.15 : -0.15));
    else {
      state.offset.y -= e.deltaY;
      updateTransform();
    }
  }, { passive: false });

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

  const stopDrag = (e) => { state.pointers.delete(e.pointerId); state.isDragging = false; };
  window.addEventListener('pointerup', stopDrag);
  window.addEventListener('pointercancel', stopDrag);

  document.getElementById('zoom-fit')?.addEventListener('click', () => {
    state.offset = { x: 0, y: 0 };
    state.scale = fitZoom;
    updateTransform();
  });
  document.getElementById('zoom-in')?.addEventListener('click', () => setScaleWithLimit(state.scale + 0.25));
  document.getElementById('zoom-out')?.addEventListener('click', () => setScaleWithLimit(state.scale - 0.25));

  const generatePDF = async (action) => {
    const element = document.getElementById('resume-document');
    const safeName = (profileData?.fullName || data?.fullName || 'CV').normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
    const filename = `Hoja_de_Vida_${safeName}.pdf`;
    showToast('Generando PDF...', 'info');
    try {
      const lib = await getHtml2Pdf();
      const opt = {
        margin: [0, 0, 0, 0], filename, image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, letterRendering: true, scrollY: 0, scrollX: 0, windowHeight: 1122 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait', compress: true },
        pagebreak: { mode: ['css', 'legacy'] }
      };
      if (action === 'share') {
        const blob = await lib().set(opt).from(element).output('blob');
        if (navigator.share) await navigator.share({ files: [new File([blob], filename, { type: 'application/pdf' })], title: filename });
      } else {
        await lib().set(opt).from(element).save();
        showToast('✓ Descargado', 'success');
      }
    } catch (err) { showToast('Error al generar PDF', 'error'); }
  };

  document.querySelector('#download-pdf-btn')?.addEventListener('click', () => isVip ? generatePDF('download') : null);
  document.querySelector('#share-whatsapp-btn')?.addEventListener('click', () => isVip ? generatePDF('share') : null);
  document.querySelectorAll('.theme-select-h').forEach(btn => btn.addEventListener('click', () => onUpdate({ theme: btn.dataset.theme })));
  document.querySelectorAll('#exit-editor-btn, #exit-editor-btn-mob').forEach(b => b.addEventListener('click', onExit));
  document.querySelectorAll('#edit-info-btn, #edit-info-btn-mob').forEach(b => b.addEventListener('click', onEdit));

  updateTransform();
};
