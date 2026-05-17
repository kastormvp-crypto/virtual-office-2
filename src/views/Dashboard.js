import { Footer } from '../components/Footer';

export const Dashboard = (profile) => {
  const isMaster = profile.role === 'master';
  const isAdmin = isMaster || profile.role === 'admin';
  const isPartner = profile.role === 'partner';
  const isStandard = !profile.vip && !isAdmin && !isPartner;

  return `
<div class="animate-fade">
  <div class="main-content">
  <!-- Executive Menu Header -->
  <header class="glass" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 3rem; padding: 1rem 1.5rem; border: 1px solid rgba(197, 160, 89, 0.2);">
    <div style="display: flex; align-items: center; gap: 1rem;">
      <img src="/icon.png" alt="Logo" style="width: 45px; height: 45px; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.4);">
      <div>
        <p style="color: var(--primary); font-size: 0.65rem; text-transform: uppercase; letter-spacing: 1.5px; font-weight: bold; margin: 0;">Oficina Virtual Professional</p>
        <h3 style="margin: 0.1rem 0 0 0; font-weight: 500; font-size: 1.3rem;">Hola, ${profile.fullName}</h3>
      </div>
    </div>
    <div style="display: flex; gap: 0.8rem; align-items: center;">
      ${isAdmin ? `
        <button id="super-user-btn" class="glass" style="padding: 0.4rem 0.8rem; border-color: var(--primary); color: var(--primary); font-size: 0.75rem; font-weight: bold;">PANEL SUPER USUARIO</button>
      ` : ''}
      <button id="logout-btn" class="glass" style="padding: 0.4rem 0.8rem; border-color: rgba(248, 113, 113, 0.3); color: #f87171; font-size: 0.75rem;">SALIR</button>
    </div>
  </header>

  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem;">
    <!-- Module 1: AI Data Capture -->
    <div class="glass" style="padding: 1.5rem; display: flex; flex-direction: column; border-top: 3px solid var(--primary); position: relative; overflow: hidden; background: linear-gradient(135deg, rgba(197, 160, 89, 0.05) 0%, transparent 100%);">
      <div style="font-size: 1.8rem; margin-bottom: 0.5rem;">💼</div>
      <h2 style="margin-bottom: 0.3rem; font-size: 1.2rem;">Edicion de tu Hoja de Vida</h2>
      <p style="color: var(--text-dim); flex-grow: 1; margin-bottom: 1.2rem; line-height: 1.4; font-size: 0.85rem;">
        Cuestionario inteligente para estructurar tu perfil profesional bajo formato ATS con asistencia de IA.
      </p>
      <button id="start-interview-btn" class="btn-primary" style="width: 100%;">REGISTRO DE INFORMACION</button>
    </div>

    <!-- Module 2: Visualization and Export -->
    <div class="glass" style="padding: 1.5rem; display: flex; flex-direction: column; border-top: 3px solid #4ade80; position: relative; overflow: hidden;">
      <div style="font-size: 1.8rem; margin-bottom: 0.5rem;">📄</div>
      <h2 style="margin-bottom: 0.3rem; font-size: 1.2rem;">Mi Hoja de Vida</h2>
      <p style="color: var(--text-dim); flex-grow: 1; margin-bottom: 1.2rem; line-height: 1.4; font-size: 0.85rem;">
        Visualiza tu resultado, cambia el estilo ejecutivo de tu CV y compártelo directamente por WhatsApp como PDF.
      </p>
      <button id="direct-editor-btn" class="glass" style="width: 100%; border-color: #4ade80; color: #4ade80; padding: 0.5rem; font-size: 0.8rem; font-weight: bold;">VER MI HOJA DE VIDA</button>
    </div>

    ${isStandard ? `
    <!-- Upgrade Banner — Solo para usuarios estándar -->
    <div class="glass" style="padding: 1.5rem; grid-column: 1 / -1; border: 1px solid rgba(197,160,89,0.3); background: linear-gradient(135deg, rgba(197,160,89,0.06) 0%, rgba(0,0,0,0) 100%); border-radius: 16px; position:relative; overflow:hidden;">
      <div style="position:absolute; top:-40px; right:-40px; width:200px; height:200px; background:radial-gradient(circle, rgba(197,160,89,0.07) 0%, transparent 70%); pointer-events:none;"></div>
      <div style="display:flex; align-items:flex-start; gap:1rem; flex-wrap:wrap;">
        <div style="font-size:2.5rem;">💼</div>
        <div style="flex:1; min-width:200px;">
          <span style="background:rgba(197,160,89,0.15); border:1px solid rgba(197,160,89,0.4); color:#c5a059; font-size:0.65rem; font-weight:700; letter-spacing:2px; padding:0.25rem 0.7rem; border-radius:100px; text-transform:uppercase;">Plan Socio</span>
          <h3 style="margin:0.5rem 0 0.3rem; font-size:1.05rem;">¿Tienes un Cibercafé o Centro de Copiado?</h3>
          <p style="color:#a0a0b0; font-size:0.8rem; margin:0 0 1rem; line-height:1.5;">Acceso ilimitado para generar CVs profesionales a todos tus clientes por solo <strong style="color:#c5a059;">$10 al mes</strong>. Sin límites, sin pagos por CV.</p>
          <div style="display:flex; gap:0.8rem; flex-wrap:wrap;">
            <button id="dashboard-socio-payphone-btn" style="padding:0.6rem 1.2rem; border-radius:10px; border:none; background:linear-gradient(135deg,#c5a059,#e8c878); color:#000; font-weight:700; font-size:0.8rem; cursor:pointer;">💳 Pagar con Tarjeta — $10</button>
            <button id="dashboard-socio-transfer-btn" style="padding:0.6rem 1.2rem; border-radius:10px; background:none; border:1px solid rgba(197,160,89,0.35); color:#c5a059; font-weight:600; font-size:0.8rem; cursor:pointer;">🏦 Pagar por Transferencia</button>
          </div>
        </div>
      </div>
    </div>
    ` : ''}

    ${(profile.vip || isAdmin) ? `
    <!-- Tarjeta de Identidad Digital QR -->
    <div class="glass" style="padding: 1.5rem; grid-column: 1 / -1; border: 1px solid rgba(197,160,89,0.35); background: linear-gradient(135deg, rgba(197,160,89,0.06) 0%, rgba(0,0,0,0) 100%); border-radius: 16px; box-sizing:border-box;">
      <div style="display:flex; align-items:center; justify-content:space-between; gap:1.5rem; flex-wrap:wrap;">
        <div style="flex:1; min-width:260px; text-align:left;">
          <div style="display:flex; align-items:center; gap:10px; margin-bottom:0.5rem;">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:inline-block; vertical-align:middle; filter:drop-shadow(0 2px 4px rgba(0,0,0,0.35));">
              <defs>
                <linearGradient id="silver-lightning-dash" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#ffffff" />
                  <stop offset="50%" stop-color="#e2e8f0" />
                  <stop offset="100%" stop-color="#475569" />
                </linearGradient>
              </defs>
              <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill="url(#silver-lightning-dash)" stroke="#cbd5e1" stroke-width="1.2" stroke-linejoin="round"/>
            </svg>
            <h2 style="margin:0; font-size: 1.25rem; color:#c5a059;">Tu Información Virtual</h2>
          </div>
          <p style="color: var(--text-dim); margin-bottom: 1.2rem; line-height: 1.5; font-size: 0.85rem;">
            Tu Hoja de Vida ahora cuenta con una espectacular **Tarjeta de Presentación Digital Premium**. Descárgala en alta resolución para compartirla en redes sociales, WhatsApp o correo. Los reclutadores podrán escanear el código QR integrado para ver tu CV en tiempo real y contactarte al instante.
          </p>
          <div style="display:flex; gap:0.8rem; flex-wrap:wrap;">
            <button id="download-qr-btn" class="btn-primary" style="padding:0.6rem 1.5rem; font-size:0.8rem;">📥 TARJETA DE CONTACTO</button>
            <button id="download-laboral-btn" class="btn-primary" style="padding:0.6rem 1.5rem; font-size:0.8rem; background:linear-gradient(135deg,#334155,#475569); color:#fff; border:1px solid rgba(255,255,255,0.15);">📥 TARJETA LABORAL</button>
            <button id="copy-cv-link-btn" class="glass" style="padding:0.6rem 1.5rem; font-size:0.8rem; border-color:rgba(255,255,255,0.15); color:#fff; font-weight:bold;">🔗 COPIAR ENLACE PÚBLICO</button>
          </div>
        </div>
        <div style="background:#fff; padding:12px; border-radius:18px; border: 2.5px solid #c5a059; display:grid; place-items:center; box-shadow:0 12px 35px rgba(0,0,0,0.6); margin:0 auto;">
          <img id="dashboard-qr-img" src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&color=111217&bgcolor=ffffff&data=${encodeURIComponent(window.location.origin + '/cv/' + profile.uid)}" style="width:150px; height:150px; display:block; border-radius: 8px;" alt="Código QR CV">
        </div>
      </div>
    </div>
    ` : ''}

    <!-- Info Card -->
    <div class="glass" style="padding: 1rem; display: flex; align-items: center; gap: 1rem; grid-column: 1 / -1; background: rgba(255,255,255,0.01);">
       <div id="vip-status-icon" style="width: 40px; height: 40px; border-radius: 50%; background: ${profile.vip || isAdmin ? 'rgba(74,222,128,0.1)' : 'rgba(255,255,255,0.05)'}; display: grid; place-items: center; border: 1px solid ${profile.vip || isAdmin ? '#4ade80' : 'var(--border-glass)'};">
          <span style="font-weight: bold; color: ${profile.vip || isAdmin ? '#4ade80' : 'var(--text-dim)'}; font-size: 0.75rem;">${isMaster ? 'MST' : (isAdmin ? 'ADM' : (profile.vip ? 'VIP' : 'STD'))}</span>
       </div>
       <div style="flex:1;">
          <h4 style="margin: 0; color: var(--text-dim); text-transform: uppercase; font-size: 0.6rem; letter-spacing: 1px;">Cuenta Certificada</h4>
          <p style="margin: 0.1rem 0; font-size: 0.85rem; font-weight: 500;">${profile.email}</p>
          <div style="display: flex; align-items: center; gap: 0.4rem; font-size: 0.7rem; color: ${profile.vip || isAdmin ? '#4ade80' : 'var(--text-dim)'};">
             <span style="display: inline-block; width: 4px; height: 4px; background: ${profile.vip || isAdmin ? '#4ade80' : 'currentColor'}; border-radius: 50%;"></span>
             ${
               isMaster ? 'Socio VIP &#8212; Control Master' :
               isAdmin  ? 'Administrador &#8212; Acceso de Gestión' :
               profile.vip ? 'Socio VIP &#8212; Acceso Certificado' :
               'Pendiente de activación VIP'
             }
          </div>
       </div>
        ${profile.vip ? `<button id="download-receipt-btn" style="background:none; border:1px solid rgba(197,160,89,0.3); color:var(--primary); padding:0.4rem 0.8rem; border-radius:6px; font-size:0.7rem; cursor:pointer; white-space:nowrap; font-weight:600;">📄 MI RECIBO</button>` : ''}
        
        <!-- Trusted Device Toggle -->
        <div style="margin-left: auto; padding-left: 1rem;">
           <button id="trust-device-btn" class="glass" style="padding: 0.4rem 0.8rem; font-size: 0.65rem; border-color: ${localStorage.getItem('hv_trusted_device') === 'true' ? '#4ade80' : 'rgba(255,255,255,0.1)'}; color: ${localStorage.getItem('hv_trusted_device') === 'true' ? '#4ade80' : '#a0a0b0'}; cursor: pointer; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px;">
              ${localStorage.getItem('hv_trusted_device') === 'true' ? '🔒 Equipo de Confianza' : '🔓 ¿Equipo Habitual?'}
           </button>
        </div>
    </div>
  </div>
  ${Footer()}
  </div>
</div>
`;
};
