import { ResumeTemplate } from '../components/ResumeTemplate';
import html2pdf from 'html2pdf.js';

export const EditorView = (resumeData, profileData, currentTheme = 'executive-navy') => {
  const isMobile = window.innerWidth < 600;
  // Bulletproof Master Bypass
  const isVip = !!resumeData?.vip || profileData?.role === 'admin' || profileData?.email === 'ks_mvp@icloud.com';
  
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
          <button id="exit-editor-btn-mob" type="button" style="padding: 0.5rem 0.9rem; font-size: 0.85rem; background: rgba(60,65,80,0.7); border: 1px solid rgba(255,255,255,0.12); border-radius: 8px; color: #e0e0e0; cursor:pointer; margin-right:16px; ${!isMobile ? 'display:none;' : ''}">SALIR</button>
       </div>
       <!-- CV Style Grid — 2 rows, centered, no scroll needed -->
       <div style="
         display: flex;
         flex-wrap: wrap;
         justify-content: center;
         gap: 0.4rem;
         padding: 0.4rem 0;
         width: 100%;
       ">
          <button type="button" class="theme-select-h ${currentTheme === 'executive-navy' ? 'active' : ''}" data-theme="executive-navy">Standard</button>
          <button type="button" class="theme-select-h ${currentTheme === 'tech-minimal' ? 'active' : ''}" data-theme="tech-minimal">Minimalist</button>
          <button type="button" class="theme-select-h ${currentTheme === 'modern-sidebar' ? 'active' : ''}" data-theme="modern-sidebar">Modern Side</button>
          <button type="button" class="theme-select-h ${currentTheme === 'harvard-classic' ? 'active' : ''}" data-theme="harvard-classic">Harvard Classic</button>
          <button type="button" class="theme-select-h ${currentTheme === 'harvard-navy' ? 'active' : ''}" data-theme="harvard-navy">Harvard Navy</button>
          <button type="button" class="theme-select-h ${currentTheme === 'startup-modern' ? 'active' : ''}" data-theme="startup-modern">Startup Pro</button>
          <button type="button" class="theme-select-h ${currentTheme === 'creative-exec' ? 'active' : ''}" data-theme="creative-exec">Creative Exec</button>
       </div>
       <div style="display: flex; gap: 12px; align-items: center;">
          <button id="exit-editor-btn" type="button" style="padding: 0.55rem 1rem; font-size: 0.85rem; background: rgba(60,65,80,0.7); border: 1px solid rgba(255,255,255,0.12); border-radius: 8px; color: #e0e0e0; cursor:pointer; margin-right:16px; flex:1; ${isMobile ? 'display:none;' : ''}">SALIR</button>
          <button id="share-whatsapp-btn" type="button" style="padding: 0.55rem 1rem; background: ${isVip ? '#25D366' : 'rgba(37,211,102,0.15)'}; border: 1px solid ${isVip ? '#25D366' : 'rgba(255,255,255,0.1)'}; color: ${isVip ? '#fff' : 'var(--text-dim)'}; font-size: 0.9rem; font-weight: bold; flex: 1; border-radius: 8px; cursor:pointer;">WhatsApp</button>
          <button id="download-pdf-btn" type="button" class="btn-primary" style="padding: 0.55rem 1rem; font-size: 0.9rem; flex: 1; font-weight: bold; ${!isVip ? 'filter: grayscale(1);' : ''}">DESCARGAR PDF</button>
       </div>
    </div>
  </header>

  <main id="preview-area" style="flex: 1; overflow: hidden; background: #000; position: relative; cursor: grab; touch-action: none; display: flex; align-items: center; justify-content: center; padding: 0;">
     <div id="resume-wrapper" style="width: 21cm; min-height: 29.7cm; position: relative; will-change: transform; pointer-events: none; transform-origin: center center;">
        <div style="width: 100%; box-shadow: 0 0 100px rgba(0,0,0,1); background: white;">
           <div id="resume-document">
              ${ResumeTemplate(resumeData, currentTheme)}
           </div>
        </div>
     </div>
  </main>

  <style>
    .theme-select-h { flex: 0 0 auto; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: var(--text-dim); padding: 0.4rem 0.9rem; border-radius: 6px; font-size: 0.75rem; cursor: pointer; white-space: nowrap; transition: all 0.2s; user-select: none; }
    .theme-select-h.active { background: var(--primary); color: #000; font-weight: bold; border-color: var(--primary); }
    .theme-select-h:active { transform: scale(0.96); }
    .vip-modal-container { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.9); z-index: 6000; place-items: center; padding: 1rem; overflow-y: auto; }
  </style>

  <!-- VIP Activation Modal (Compact & Mobile Responsive) -->
  <div id="vip-modal" class="vip-modal-container animate-fade">
     <div class="glass" style="max-width: 380px; width: 100%; padding: 1.5rem; text-align: center; position: relative; margin: auto;">
        <button id="close-vip-modal" type="button" style="position: absolute; top: 0.5rem; right: 0.8rem; background: none; border: none; color: white; font-size: 1.8rem; cursor: pointer; line-height: 1;">&times;</button>
        
        <div style="font-size: 2rem; margin-bottom: 0.5rem;">💎</div>
        <h2 style="color: var(--primary); margin-bottom: 0.3rem; font-size: 1.2rem;">Activa tu CV VIP</h2>
        <p style="color: var(--text-dim); font-size: 0.75rem; margin-bottom: 1.5rem;">Ediciones ilimitadas y descarga profesional por solo <b>$1.00</b>.</p>
        
        <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-glass); padding: 1rem; border-radius: 8px; margin-bottom: 1.5rem; text-align: left;">
           <h4 style="margin: 0 0 0.8rem; color: var(--primary); font-size: 0.7rem; text-transform: uppercase;">Transferencia Bancaria</h4>
           <div style="display: flex; flex-direction: column; gap: 0.5rem;">
              <p style="margin: 0; font-size: 0.8rem; font-weight: bold; color: var(--text-main);">Banco Pichincha (Ahorros)</p>
              <p style="margin: 0; font-size: 1rem; color: var(--primary); font-weight: 700;">2215792153</p>
              <p style="margin: 0; font-size: 0.75rem; color: var(--text-dim);">Titular: <span style="color:white; font-weight:600;">David Flores G.</span></p>
           </div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 0.8rem;">
           <a href="https://wa.me/593962696067?text=Hola%20David,%20adjunto%20comprobante%20de%20%241%20para%20activar%20mi%20Cuenta%20VIP%20-%20Usuario:%20${resumeData.fullName}" 
              target="_blank" class="btn-primary" style="text-decoration: none; display: flex; align-items: center; justify-content: center; gap: 0.5rem; background: #25d366; color: white; border: none; padding: 0.7rem; font-size: 0.8rem; font-weight: bold; box-shadow: 0 4px 15px rgba(37, 211, 102, 0.2);">
              <span style="font-size: 1rem;">📱</span> ENVIAR POR WHATSAPP
           </a>
        </div>
     </div>
  </div>
</div>
`;
};

export const attachEditorListeners = (data, profileData, onUpdate, onExit) => {
  const isVip = !!data.vip || profileData?.role === 'admin' || profileData?.email === 'ks_mvp@icloud.com';
  const themeButtons = document.querySelectorAll('.theme-select-h');
  const shareBtn = document.querySelector('#share-whatsapp-btn');
  const downloadBtn = document.querySelector('#download-pdf-btn');
  const vipModal = document.querySelector('#vip-modal');
  const viewport = document.getElementById('preview-area');
  const wrapper = document.getElementById('resume-wrapper');

  const showVipWall = () => {
    vipModal.style.display = 'grid';
  };

  document.querySelector('#close-vip-modal')?.addEventListener('click', () => {
    vipModal.style.display = 'none';
  });

  themeButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const theme = btn.dataset.theme;
      onUpdate({ theme });
    });
  });

  // GESTURES NATIVE RESTORATION
  const a4W = 21 * 37.8; 
  const a4H = 29.7 * 37.8; 
  const vW = viewport.clientWidth;
  const vH = viewport.clientHeight;
  const fitZoom = Math.min((vW * 0.95) / a4W, (vH * 0.95) / a4H);

  let state = {
    zoom: fitZoom,
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    lastPointers: new Map(),
    initialDist: 0,
    initialZoom: 0,
    animating: false
  };

  const updateTransform = (withBounce = false) => {
    const zoomedW = a4W * state.zoom;
    const zoomedH = a4H * state.zoom;
    const limitX = Math.max(0, (zoomedW - vW) / 2);
    const limitY = Math.max(0, (zoomedH - vH) / 2);
    
    if (!withBounce) {
        state.x = Math.min(Math.max(state.x, -limitX), limitX);
        state.y = Math.min(Math.max(state.y, -limitY), limitY);
    }
    wrapper.style.transform = `translate(${state.x}px, ${state.y}px) scale(${state.zoom})`;
  };

  updateTransform();

  const applyInertia = () => {
    if (!state.animating) return;
    state.x += state.vx;
    state.y += state.vy;
    state.vx *= 0.94;
    state.vy *= 0.94;
    updateTransform(true);

    if (Math.abs(state.vx) > 0.1 || Math.abs(state.vy) > 0.1) {
      requestAnimationFrame(applyInertia);
    } else {
      state.animating = false;
      updateTransform();
    }
  };

  viewport.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    viewport.setPointerCapture(e.pointerId);
    state.lastPointers.set(e.pointerId, { x: e.clientX, y: e.clientY, time: Date.now() });
    state.animating = false;
    if (state.lastPointers.size === 2) {
       const [p1, p2] = Array.from(state.lastPointers.values());
       state.initialDist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
       state.initialZoom = state.zoom;
    }
  });

  viewport.addEventListener('pointermove', (e) => {
    e.preventDefault();
    const last = state.lastPointers.get(e.pointerId);
    if (!last) return;
    const now = Date.now();

    if (state.lastPointers.size === 1) {
      const dx = e.clientX - last.x;
      const dy = e.clientY - last.y;
      state.x += dx;
      state.y += dy;
      state.vx = dx; 
      state.vy = dy;
    } else if (state.lastPointers.size === 2) {
      state.lastPointers.set(e.pointerId, { x: e.clientX, y: e.clientY, time: now });
      const [p1, p2] = Array.from(state.lastPointers.values());
      const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
      const ratio = dist / state.initialDist;
      state.zoom = Math.min(Math.max(state.initialZoom * ratio, fitZoom), 5);
    }
    state.lastPointers.set(e.pointerId, { x: e.clientX, y: e.clientY, time: now });
    updateTransform(true);
  });

  viewport.addEventListener('pointerup', (e) => {
    state.lastPointers.delete(e.pointerId);
    if (state.lastPointers.size === 0) {
       state.animating = true;
       applyInertia();
    }
  });

  // FREEZE FIX: Handle OS-interrupted gestures (notifications, calls, etc.)
  viewport.addEventListener('pointercancel', (e) => {
    state.lastPointers.delete(e.pointerId);
    state.animating = false;
    updateTransform();
  });

  shareBtn?.addEventListener('click', async (e) => {
    e.preventDefault();
    if (!isVip) return showVipWall();
    const element = document.getElementById('resume-document');
    const blob = await html2pdf().set({ margin:0, filename:'CV.pdf', image:{type:'jpeg',quality:0.98}, html2canvas:{scale:2,useCORS:true}, jsPDF:{unit:'mm',format:'a4'}, pagebreak:{mode:'avoid-all'} }).from(element).output('blob');
    const file = new File([blob], `Mi_CV_VIP.pdf`, { type: 'application/pdf' });
    if (navigator.share) await navigator.share({ files: [file] });
  });

  downloadBtn?.addEventListener('click', async (e) => {
    e.preventDefault();
    if (!isVip) return showVipWall();
    const element = document.getElementById('resume-document');
    await html2pdf().set({ margin:0, filename:'CV_VIP.pdf', html2canvas:{scale:2,useCORS:true}, jsPDF:{unit:'mm',format:'a4'}, pagebreak:{mode:'avoid-all'} }).from(element).save();
  });

  document.querySelectorAll('#exit-editor-btn, #exit-editor-btn-mob').forEach(btn => btn.addEventListener('click', onExit));
};
