import { getResumeData } from '../services/auth';
import { ResumeTemplate } from '../components/ResumeTemplate';

export const showPublicCV = async (uid) => {
  const app = document.querySelector('#app');
  
  // Mostrar pantalla de carga elegante
  app.innerHTML = `
    <div style="display:grid;place-items:center;height:100vh;background:#0a0b10;color:#c5a059;text-align:center;">
      <div style="width:40px;height:40px;border:3px solid #c5a059;border-top-color:transparent;border-radius:50%;animation:spin 0.8s linear infinite;margin:0 auto 1.5rem;"></div>
      <p style="font-family:'Inter', sans-serif; font-size:0.9rem; letter-spacing:1px; color:#e0e0e0;">Cargando Hoja de Vida Profesional...</p>
    </div>
  `;

  // Traer los datos del CV de forma segura desde Firestore
  const resumeData = await getResumeData(uid);
  if (!resumeData) {
    app.innerHTML = `
      <div style="display:flex;flex-direction:column;justify-content:center;align-items:center;height:100vh;background:#0a0b10;color:#fff;text-align:center;padding:2rem;font-family:'Inter',sans-serif;box-sizing:border-box;">
        <div style="font-size:4rem;margin-bottom:1rem;">⚠️</div>
        <h2 style="color:#c5a059;margin:0 0 0.8rem;font-size:1.5rem;">Hoja de Vida No Encontrada</h2>
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

  // Si el CV existe, renderizarlo adaptativamente de acuerdo al ancho del viewport móvil
  const updateLayoutScale = () => {
    const isMobile = window.innerWidth < 600;
    const a4W = 21 * 37.8; // 21cm en pixeles (~794px)
    const scale = isMobile ? (window.innerWidth - 30) / a4W : 1;

    const scaler = document.getElementById('public-cv-scaler');
    const wrapper = document.getElementById('public-cv-wrapper');
    if (scaler && wrapper) {
      scaler.style.width = `${a4W * scale}px`;
      scaler.style.height = `${(29.7 * 37.8) * scale}px`;
      wrapper.style.transform = `scale(${scale})`;
    }
  };

  const a4W = 21 * 37.8;
  const a4H = 29.7 * 37.8;

  app.innerHTML = `
    <div style="min-height:100vh;background:#000;font-family:'Inter',sans-serif;display:flex;flex-direction:column;align-items:center;padding:20px 0 120px 0;box-sizing:border-box;overflow-x:hidden;position:relative;">
      
      <!-- Encabezado de la Plataforma (Premium y Fijo) -->
      <div style="width:100%;max-width:800px;display:flex;justify-content:space-between;align-items:center;padding:0 15px 15px;border-bottom:1px solid rgba(255,255,255,0.08);margin-bottom:25px;box-sizing:border-box;">
        <div style="display:flex;align-items:center;gap:8px;">
          <span style="font-size:1.3rem;">💎</span>
          <span style="font-weight:800;font-size:0.95rem;color:#c5a059;letter-spacing:1px;">TU HOJA DE VIDA</span>
        </div>
        <a href="/" style="padding:0.45rem 1rem;font-size:0.75rem;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);color:#fff;text-decoration:none;border-radius:6px;font-weight:600;transition:0.2s;">
          Crear la Mía
        </a>
      </div>

      <!-- Contenedor del CV -->
      <div id="public-cv-scaler" style="position:relative;margin:0 auto;display:flex;justify-content:center;align-items:flex-start;transition:all 0.2s;">
        <div id="public-cv-wrapper" style="width:${a4W}px;height:${a4H}px;position:relative;transform-origin:top center;margin:0;box-shadow:0 15px 50px rgba(0,0,0,0.85);background:#fff;border-radius:2px;">
          ${ResumeTemplate(resumeData, resumeData.theme || 'executive-navy')}
        </div>
      </div>

      <!-- Barra de Acciones Flotantes Inferiores -->
      <div style="position:fixed;bottom:20px;left:50%;transform:translateX(-50%);width:92%;max-width:480px;background:rgba(20,22,30,0.94);backdrop-filter:blur(12px);border:1px solid rgba(197,160,89,0.3);box-shadow:0 12px 40px rgba(0,0,0,0.7);border-radius:20px;padding:0.8rem;display:flex;gap:10px;z-index:9999;box-sizing:border-box;">
        
        <a href="tel:${resumeData.phone || ''}" style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);color:#fff;text-decoration:none;border-radius:12px;padding:0.6rem 0;font-size:0.7rem;font-weight:700;transition:0.2s;text-align:center;">
          <span style="font-size:1.15rem;">📞</span> Llamar
        </a>

        <a href="https://wa.me/${cleanPhone}?text=${encodeURIComponent('Hola ' + resumeData.fullName + ', desearía contactarme con usted.')}" target="_blank" rel="noopener" style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;background:#25d366;color:#fff;text-decoration:none;border-radius:12px;padding:0.6rem 0;font-size:0.7rem;font-weight:700;transition:0.2s;text-align:center;">
          <span style="font-size:1.15rem;">💬</span> WhatsApp
        </a>

        <a href="mailto:${resumeData.email || ''}" style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);color:#fff;text-decoration:none;border-radius:12px;padding:0.6rem 0;font-size:0.7rem;font-weight:700;transition:0.2s;text-align:center;">
          <span style="font-size:1.15rem;">📧</span> Correo
        </a>

        <button id="public-vcard-btn" style="flex:1.2;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;background:linear-gradient(135deg,#c5a059,#e8c878);color:#000;border:none;border-radius:12px;padding:0.6rem 0;font-size:0.7rem;font-weight:700;cursor:pointer;transition:0.2s;box-shadow:0 4px 10px rgba(197,160,89,0.2);">
          <span style="font-size:1.15rem;">📥</span> Guardar
        </button>

      </div>
    </div>
  `;

  // Ajustar la escala inmediatamente
  updateLayoutScale();
  // Volver a ajustar si el usuario cambia el tamaño o rota el teléfono
  window.addEventListener('resize', updateLayoutScale);

  // Guardar datos en la agenda con vCard
  document.getElementById('public-vcard-btn')?.addEventListener('click', () => {
    const nameParts = (resumeData.fullName || '').trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    const vcardData = `BEGIN:VCARD
VERSION:3.0
N:${lastName};${firstName};;;
FN:${resumeData.fullName}
TITLE:${resumeData.title || ''}
TEL;TYPE=CELL:${cleanPhone}
EMAIL;TYPE=INTERNET:${resumeData.email || ''}
ADR;TYPE=HOME:;;${resumeData.location || ''}
END:VCARD`;

    const blob = new Blob([vcardData], { type: 'text/vcard;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Contacto_${resumeData.fullName.replace(/\s+/g, '_')}.vcf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });
};
