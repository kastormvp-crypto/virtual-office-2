import { Footer } from '../components/Footer';

export const Dashboard = (profile) => {
  const isMaster = profile.role === 'master';
  const isAdmin = isMaster || profile.role === 'admin';

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
    </div>
  </div>
  ${Footer()}
  </div>
</div>
`;
};
