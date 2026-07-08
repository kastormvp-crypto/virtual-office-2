import { getResumeData, getUserProfile } from '../services/auth';
import { ResumeTemplate } from '../components/ResumeTemplate';

export const showPublicCV = async (uid) => {
  const app = document.querySelector('#app');
  
  // Mostrar pantalla de carga elegante
  app.innerHTML = `
    <div style="display:grid;place-items:center;height:100vh;background:var(--bg-deep);color:var(--primary);text-align:center;">
      <div class="neon-loader-wrapper">
         <div class="neon-ring"></div>
         <div class="neon-ring"></div>
      </div>
      <p style="font-family:'Inter', sans-serif; font-size:0.9rem; letter-spacing:2px; font-weight:bold; color:var(--text-main);">CARGANDO...</p>
    </div>
  `;

  // Traer los datos del CV y el perfil del usuario en paralelo
  const [resumeData, profileData] = await Promise.all([
    getResumeData(uid),
    getUserProfile(uid).catch(() => null)
  ]);
  if (!resumeData) {
    app.innerHTML = `
      <div style="display:flex;flex-direction:column;justify-content:center;align-items:center;height:100vh;background:var(--bg-deep);color:var(--text-main);text-align:center;padding:2rem;font-family:'Inter',sans-serif;box-sizing:border-box;">
        <div style="font-size:4rem;margin-bottom:1rem;">⚠️</div>
        <h2 style="color:var(--primary);margin:0 0 0.8rem;font-size:1.5rem;">Hoja de Vida No Encontrada</h2>
        <p style="color:#a0a0b0;font-size:0.9rem;max-width:320px;line-height:1.5;margin-bottom:2rem;">El enlace digital ingresado no es válido o ha sido desactivado por el usuario.</p>
        <a href="/" style="padding:0.8rem 2rem;background:linear-gradient(135deg,#c5a059,#e8c878);color:#000;font-weight:bold;text-decoration:none;border-radius:8px;font-size:0.9rem;box-shadow:0 4px 15px rgba(197,160,89,0.3);">Ir al Inicio</a>
      </div>
    `;
    return;
  }

  // Limpiar y formatear el número de celular para que WhatsApp sea 100% compatible
  let cleanPhone = (resumeData.phone || '').replace(/[^0-9]/g, '');
  if (cleanPhone.startsWith('09') && cleanPhone.length === 10) {
    cleanPhone = '593' + cleanPhone.substring(1);
  } else if (cleanPhone.startsWith('9') && cleanPhone.length === 9) {
    cleanPhone = '593' + cleanPhone;
  }

  // Extraer primer nombre de forma segura para el mensaje de WhatsApp
  const firstName = (resumeData.fullName || '').trim().split(' ')[0] || 'Profesional';

  let currentZoom = 1.0;

  // Si el CV existe, renderizarlo adaptativamente de acuerdo al ancho del viewport móvil
  const updateLayoutScale = () => {
    const isMobile = window.innerWidth < 600;
    const a4W = 21 * 37.8; // 21cm en pixeles (~794px)
    const baseScale = isMobile ? (window.innerWidth - 30) / a4W : 1;
    const finalScale = baseScale * currentZoom;

    const scaler = document.getElementById('public-cv-scaler');
    const wrapper = document.getElementById('public-cv-wrapper');
    if (scaler && wrapper) {
      scaler.style.width = `${a4W * finalScale}px`;
      scaler.style.height = `${(29.7 * 37.8) * finalScale}px`;
      wrapper.style.transform = `scale(${finalScale})`;
    }
  };

  const a4W = 21 * 37.8;
  const a4H = 29.7 * 37.8;

  app.innerHTML = `
    <div style="min-height:100vh;background:var(--bg-surface);font-family:'Inter',sans-serif;display:flex;flex-direction:column;align-items:center;padding:20px 0 120px 0;box-sizing:border-box;overflow-x:hidden;position:relative;">
      
      <!-- Encabezado de la Plataforma (Premium y Fijo) -->
      <div style="width:100%;max-width:800px;display:flex;justify-content:space-between;align-items:center;padding:0 15px 15px;border-bottom:1px solid var(--border-glass);margin-bottom:25px;box-sizing:border-box;">
        <div style="display:flex;align-items:center;gap:8px;">
          <span style="font-size:1.3rem;">💎</span>
          <span style="font-weight:800;font-size:0.95rem;color:var(--primary);letter-spacing:1px;">TU HOJA DE VIDA</span>
        </div>
        <a href="/" style="padding:0.45rem 1rem;font-size:0.75rem;background:var(--border-glass);border:1px solid var(--border-glass);color:var(--text-main);text-decoration:none;border-radius:6px;font-weight:600;transition:0.2s;">
          Crear la Mía
        </a>
      </div>

      <!-- Contenedor Desplazable del CV -->
      <div style="width: 100%; overflow: auto; display: flex; justify-content: center; align-items: flex-start; padding: 0 10px 100px 10px; box-sizing: border-box; -webkit-overflow-scrolling: touch;">
        <div id="public-cv-scaler" style="position:relative;margin:0 auto;display:flex;justify-content:center;align-items:flex-start;transition:transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);">
          <div id="public-cv-wrapper" style="width:${a4W}px;height:${a4H}px;position:relative;transform-origin:top center;margin:0;box-shadow:0 15px 50px rgba(0,0,0,0.85);background:#fff;border-radius:2px;">
            ${ResumeTemplate({
                ...resumeData,
                // Marca de agua: no mostrar si el dueño pagó, es admin/master,
                // o si fue generado por un socio con suscripción activa
                vip: !!(
                  resumeData?.vip ||
                  profileData?.vip ||
                  profileData?.role === 'admin' ||
                  profileData?.role === 'master' ||
                  (profileData?.role === 'partner' && profileData?.subActive)
                )
              }, resumeData.theme || 'executive-navy')}
          </div>
        </div>
      </div>

      <!-- Control de Zoom Flotante Premium (Modifica SOLO la Hoja, NO los botones flotantes) -->
      <div style="position:fixed; right:16px; top:45%; transform:translateY(-50%); display:flex; flex-direction:column; gap:12px; z-index:99999;">
        <button id="zoom-in-btn" style="width:40px; height:40px; border-radius:50%; background:var(--bg-deep); border:1.5px solid #c5a059; color:var(--text-main); font-size:1.1rem; font-weight:bold; cursor:pointer; display:grid; place-items:center; box-shadow:0 4px 15px rgba(0,0,0,0.45); transition:0.2s; backdrop-filter:blur(8px); -webkit-tap-highlight-color:transparent;">➕</button>
        <button id="zoom-out-btn" style="width:40px; height:40px; border-radius:50%; background:var(--bg-deep); border:1.5px solid #c5a059; color:var(--text-main); font-size:1.1rem; font-weight:bold; cursor:pointer; display:grid; place-items:center; box-shadow:0 4px 15px rgba(0,0,0,0.45); transition:0.2s; backdrop-filter:blur(8px); -webkit-tap-highlight-color:transparent;">➖</button>
      </div>

      <!-- Barra de Acciones Flotantes Inferiores -->
      <div style="position:fixed;bottom:20px;left:50%;transform:translateX(-50%);width:92%;max-width:480px;background:var(--bg-surface);backdrop-filter:blur(12px);border:1px solid rgba(197,160,89,0.3);box-shadow:0 12px 40px rgba(0,0,0,0.7);border-radius:20px;padding:0.8rem;display:flex;gap:10px;z-index:9999;box-sizing:border-box;">
        
        <a href="tel:${resumeData.phone || ''}" style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;background:var(--bg-deep);border:1px solid var(--border-glass);color:var(--text-main);text-decoration:none;border-radius:12px;padding:0.6rem 0;font-size:0.7rem;font-weight:700;transition:0.2s;text-align:center;">
          <span style="font-size:1.15rem;">📞</span> Llamar
        </a>

        <a href="https://wa.me/${cleanPhone}?text=${encodeURIComponent('Hola ' + firstName + ', desearía contactarme con usted.')}" target="_blank" rel="noopener" style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;background:#25d366;color:#fff;text-decoration:none;border-radius:12px;padding:0.6rem 0;font-size:0.7rem;font-weight:700;transition:0.2s;text-align:center;">
          <span style="font-size:1.15rem;">💬</span> WhatsApp
        </a>

        <a href="mailto:${resumeData.email || ''}" style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;background:var(--bg-deep);border:1px solid var(--border-glass);color:var(--text-main);text-decoration:none;border-radius:12px;padding:0.6rem 0;font-size:0.7rem;font-weight:700;transition:0.2s;text-align:center;">
          <span style="font-size:1.15rem;">📧</span> Correo
        </a>
      </div>
    </div>
  `;

  // Ajustar la escala inmediatamente
  updateLayoutScale();
  // Volver a ajustar si el usuario cambia el tamaño o rota el teléfono
  window.addEventListener('resize', updateLayoutScale);

  // Listeners de Control de Zoom
  document.getElementById('zoom-in-btn')?.addEventListener('click', () => {
    if (currentZoom < 2.5) {
      currentZoom += 0.2;
      updateLayoutScale();
    }
  });

  document.getElementById('zoom-out-btn')?.addEventListener('click', () => {
    if (currentZoom > 0.8) {
      currentZoom -= 0.2;
      updateLayoutScale();
    }
  });
};
