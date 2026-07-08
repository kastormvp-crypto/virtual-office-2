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
  <header class="premium-card" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 3rem; padding: 1rem 1.5rem;">
    <div style="display: flex; align-items: center; gap: 1rem;">
      <img src="/icon.png" alt="Logo" style="width: 45px; height: 45px; border-radius: 8px; box-shadow: var(--shadow-md);">
      <div>
        <p style="color: var(--primary); font-size: 0.65rem; text-transform: uppercase; letter-spacing: 1.5px; font-weight: bold; margin: 0;">Oficina Virtual Professional</p>
        <h3 style="margin: 0.1rem 0 0 0; font-weight: 600; font-size: 1.3rem; color: var(--text-main);">Hola, ${profile.fullName.split(' ')[0]}</h3>
      </div>
    </div>
    <div style="display: flex; gap: 0.8rem; align-items: center;">
      ${isAdmin ? `
        <button id="super-user-btn" class="btn-primary" style="padding: 0.4rem 0.8rem; font-size: 0.75rem;">PANEL SUPER USUARIO</button>
      ` : ''}
      <button id="logout-btn" class="btn-logout">SALIR</button>
    </div>
  </header>

  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem;">
    <!-- Module 1: AI Data Capture -->
    <div class="premium-card" style="display: flex; flex-direction: column; align-items: center; text-align: center; position: relative; overflow: hidden; box-shadow: 0 0 0 1px rgba(56, 189, 248, 0.5), 0 15px 35px rgba(56, 189, 248, 0.15) !important;">
      <div style="position:relative; width:50px; height:50px; margin-bottom: 0.5rem;">
        <div style="position:absolute; width:26px; height:34px; background:var(--bg-deep); border:2px solid var(--primary); border-radius:4px; top:8px; left:12px; box-shadow: var(--shadow-sm);">
          <div style="width:12px; height:2px; background:var(--primary); margin:6px 5px; border-radius:1px;"></div>
          <div style="width:8px; height:2px; background:var(--primary); margin:5px; border-radius:1px;"></div>
          <div style="width:14px; height:2px; background:var(--primary); margin:5px; border-radius:1px;"></div>
        </div>
        <div style="position:absolute; font-size:1.4rem; top:14px; left:16px; animation: pen-write 2.5s infinite ease-in-out;">✏️</div>
        <style>
          @keyframes pen-write {
            0% { transform: translate(0px, 0px) rotate(0deg); }
            20% { transform: translate(6px, -2px) rotate(15deg); }
            40% { transform: translate(-2px, 8px) rotate(-5deg); }
            60% { transform: translate(8px, 12px) rotate(10deg); }
            80% { transform: translate(-4px, 4px) rotate(-10deg); }
            100% { transform: translate(0px, 0px) rotate(0deg); }
          }
        </style>
      </div>
      <h2 style="margin-bottom: 0.3rem; font-size: 1.2rem; color: var(--text-main);">Edicion de tu Hoja de Vida</h2>
      <p style="color: var(--text-dim); flex-grow: 1; margin-bottom: 1.2rem; line-height: 1.4; font-size: 0.85rem;">
        Cuestionario inteligente para estructurar tu perfil profesional bajo formato ATS con asistencia de IA.
      </p>
      <button id="start-interview-btn" class="btn-primary" style="width: 100%; padding: 0.7rem; font-size: 0.9rem;">REGISTRO DE INFORMACION</button>
    </div>

    <!-- Module 2: Visualization and Export -->
    <div class="premium-card" style="display: flex; flex-direction: column; align-items: center; text-align: center; position: relative; overflow: hidden; box-shadow: 0 0 0 1px rgba(56, 189, 248, 0.5), 0 15px 35px rgba(56, 189, 248, 0.15) !important;">
      <div style="position:relative; width:50px; height:50px; margin-bottom: 0.5rem; perspective: 150px;">
        <div style="position:absolute; width:28px; height:38px; background:var(--bg-deep); border:1.5px solid rgba(197,160,89,0.8); border-radius:4px; top:6px; left:11px; transform-origin: bottom center; animation: doc-swap-1 4s infinite ease-in-out; box-shadow: var(--shadow-sm);">
          <div style="width:14px; height:2px; background:rgba(197,160,89,0.6); margin:6px auto; border-radius:1px;"></div>
          <div style="width:10px; height:2px; background:rgba(197,160,89,0.6); margin:4px auto; border-radius:1px;"></div>
        </div>
        <div style="position:absolute; width:28px; height:38px; background:var(--bg-deep); border:1.5px solid var(--primary); border-radius:4px; top:6px; left:11px; transform-origin: bottom center; animation: doc-swap-2 4s infinite ease-in-out; box-shadow: var(--shadow-sm);">
          <div style="width:14px; height:2px; background:var(--primary); margin:6px auto; border-radius:1px;"></div>
          <div style="width:18px; height:2px; background:var(--primary); margin:4px auto; border-radius:1px;"></div>
        </div>
        <style>
          @keyframes doc-swap-1 {
            0%, 100% { transform: rotate(-8deg) translate(-4px, 0) scale(0.95); z-index: 1; opacity: 0.8;}
            25% { transform: rotate(-20deg) translate(-15px, 5px) scale(0.85); z-index: 1; opacity: 0.5;}
            50% { transform: rotate(5deg) translate(4px, -2px) scale(1.05); z-index: 2; opacity: 1;}
            75% { transform: rotate(15deg) translate(15px, 5px) scale(0.85); z-index: 2; opacity: 0.5;}
          }
          @keyframes doc-swap-2 {
            0%, 100% { transform: rotate(5deg) translate(4px, -2px) scale(1.05); z-index: 2; opacity: 1;}
            25% { transform: rotate(15deg) translate(15px, 5px) scale(0.85); z-index: 2; opacity: 0.5;}
            50% { transform: rotate(-8deg) translate(-4px, 0) scale(0.95); z-index: 1; opacity: 0.8;}
            75% { transform: rotate(-20deg) translate(-15px, 5px) scale(0.85); z-index: 1; opacity: 0.5;}
          }
        </style>
      </div>
      <h2 style="margin-bottom: 0.3rem; font-size: 1.2rem; color: var(--text-main);">Mi Hoja de Vida</h2>
      <p style="color: var(--text-dim); flex-grow: 1; margin-bottom: 1.2rem; line-height: 1.4; font-size: 0.85rem;">
        Visualiza tu resultado, cambia el estilo ejecutivo de tu CV y compártelo directamente por WhatsApp como PDF.
      </p>
      <button id="direct-editor-btn" class="btn-primary" style="width: 100%; padding: 0.7rem; font-size: 0.9rem;">VER MI HOJA DE VIDA</button>
    </div>

    ${isStandard ? `
    <!-- Upgrade Banner — Solo para usuarios estándar -->
    <div class="premium-card" style="padding: 1.5rem; grid-column: 1 / -1; background: var(--bg-deep); position:relative; overflow:hidden;">
      <div style="display:flex; align-items:flex-start; gap:1rem; flex-wrap:wrap;">
        <div style="font-size:2.5rem;">💼</div>
        <div style="flex:1; min-width:200px;">
          <span style="background:var(--primary-glow); border:1px solid var(--primary); color:var(--primary); font-size:0.65rem; font-weight:700; letter-spacing:2px; padding:0.25rem 0.7rem; border-radius:100px; text-transform:uppercase;">Plan Socio</span>
          <h3 style="margin:0.5rem 0 0.3rem; font-size:1.05rem; color:var(--text-main);">¿Tienes un Cibercafé o Centro de Copiado?</h3>
          <p style="color:var(--text-dim); font-size:0.8rem; margin:0 0 1rem; line-height:1.5;">Acceso ilimitado para generar CVs profesionales a todos tus clientes por solo <strong style="color:var(--text-main);">$10 al mes</strong>. Sin límites, sin pagos por CV.</p>
        </div>
      </div>
      <div style="display: flex; flex-wrap: wrap; gap: 1rem; width: 100%; justify-content: center; margin-top: 1.5rem; box-sizing: border-box;">
        <button id="dashboard-socio-payphone-btn" class="payment-block-btn btn-primary" style="flex: 1; min-width: 200px; display: flex; align-items: center; justify-content: center; gap: 0.6rem; padding: 1rem 1.2rem; transition: all 0.3s; box-sizing: border-box;">
          <span style="font-size: 1.5rem; line-height: 1;">💳</span>
          <span style="font-weight: 700; font-size: 0.95rem; letter-spacing: 0.5px; text-align: center;">Pagar con Tarjeta — $10</span>
        </button>
        <button id="dashboard-socio-transfer-btn" class="payment-block-btn btn-primary" style="flex: 1; min-width: 200px; display: flex; align-items: center; justify-content: center; gap: 0.6rem; padding: 1rem 1.2rem; transition: all 0.3s; box-sizing: border-box;">
          <span style="font-size: 1.5rem; line-height: 1;">🏦</span>
          <span style="font-weight: 700; font-size: 0.95rem; letter-spacing: 0.5px; text-align: center;">Pagar por Transferencia</span>
        </button>
      </div>
    </div>
    ` : ''}

    ${''}
    <!-- Panel de Utilidades — Visible para todos los usuarios -->
    <div class="premium-card" style="padding: 1.5rem; grid-column: 1 / -1; box-sizing:border-box;">
      <style>
        @keyframes icon-bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
        @keyframes icon-spin-slow { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes icon-pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.15); } }
        @keyframes icon-tilt { 0%, 100% { transform: rotate(0deg); } 25% { transform: rotate(12deg); } 75% { transform: rotate(-12deg); } }
      </style>
      <div style="text-align:center; margin-bottom:1.5rem;">
        <h2 style="margin:0; font-size:1.3rem; color:var(--text-main); letter-spacing:1px;">Enlaces de Interés</h2>
        <p style="margin:0.3rem 0 0; color:var(--text-dim); font-size:0.75rem;">Acceso directo a trámites y portales de empleo</p>
      </div>

      <!-- Documentos Oficiales -->
      <p style="text-align:center; color:var(--text-main); font-size:0.68rem; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; margin:0 0 1rem;">📋 Documentos Oficiales</p>
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(140px, 1fr)); gap:1rem; margin-bottom:1.8rem;">
        <a href="https://certificados.ministeriodelinterior.gob.ec/gestorcertificados/antecedentes/" target="_blank" rel="noopener noreferrer" style="text-decoration:none;">
          <div class="premium-card" style="border: 1px solid rgba(0,0,0,0.15); padding:1rem; display:flex; flex-direction:column; align-items:center; text-align:center; gap:0.6rem; cursor:pointer; transition:all 0.2s;" onmouseover="this.style.borderColor='var(--primary)';" onmouseout="this.style.borderColor='rgba(0,0,0,0.15)';">
            <span style="font-size:1.8rem; display:inline-block; animation:icon-tilt 2.5s infinite ease-in-out;">🔍</span>
            <div>
              <p style="margin:0; font-size:0.85rem; color:var(--text-main); font-weight:600;">Record Policial</p>
              <p style="margin:0.2rem 0 0; font-size:0.65rem; color:var(--text-dim);">Ministerio del Interior</p>
            </div>
          </div>
        </a>
        <a href="https://servicios.educacion.gob.ec/titulacion25-web/faces/paginas/consulta-titulos-refrendados.xhtml" target="_blank" rel="noopener noreferrer" style="text-decoration:none;">
          <div class="premium-card" style="border: 1px solid rgba(0,0,0,0.15); padding:1rem; display:flex; flex-direction:column; align-items:center; text-align:center; gap:0.6rem; cursor:pointer; transition:all 0.2s;" onmouseover="this.style.borderColor='var(--primary)';" onmouseout="this.style.borderColor='rgba(0,0,0,0.15)';">
            <span style="font-size:1.8rem; display:inline-block; animation:icon-bounce 2.2s infinite ease-in-out;">🎓</span>
            <div>
              <p style="margin:0; font-size:0.85rem; color:var(--text-main); font-weight:600;">Título de Bachiller</p>
              <p style="margin:0.2rem 0 0; font-size:0.65rem; color:var(--text-dim);">Ministerio de Educación</p>
            </div>
          </div>
        </a>
      </div>

      <!-- Portales de Empleo -->
      <p style="text-align:center; color:var(--text-main); font-size:0.68rem; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; margin:0 0 1rem;">💼 Portales de Empleo</p>
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(140px, 1fr)); gap:1rem;">
        <a href="https://encuentraempleo.trabajo.gob.ec/socioEmpleo-war/paginas/index.jsf" target="_blank" rel="noopener noreferrer" style="text-decoration:none;">
          <div class="premium-card" style="border: 1px solid rgba(0,0,0,0.15); padding:1rem; display:flex; flex-direction:column; align-items:center; text-align:center; gap:0.6rem; cursor:pointer; transition:all 0.2s;" onmouseover="this.style.borderColor='var(--primary)';" onmouseout="this.style.borderColor='rgba(0,0,0,0.15)';">
            <span style="font-size:1.8rem; display:inline-block; animation:icon-pulse 3s infinite ease-in-out;">🏛️</span>
            <div>
              <p style="margin:0; font-size:0.85rem; color:var(--text-main); font-weight:600;">Socio Empleo</p>
              <p style="margin:0.2rem 0 0; font-size:0.65rem; color:var(--text-dim);">Ministerio de Trabajo</p>
            </div>
          </div>
        </a>
        <a href="https://www.computrabajo.com.ec/" target="_blank" rel="noopener noreferrer" style="text-decoration:none;">
          <div class="premium-card" style="border: 1px solid rgba(0,0,0,0.15); padding:1rem; display:flex; flex-direction:column; align-items:center; text-align:center; gap:0.6rem; cursor:pointer; transition:all 0.2s;" onmouseover="this.style.borderColor='var(--primary)';" onmouseout="this.style.borderColor='rgba(0,0,0,0.15)';">
            <span style="font-size:1.8rem; display:inline-block; animation:icon-bounce 2.6s infinite ease-in-out;">💻</span>
            <div>
              <p style="margin:0; font-size:0.85rem; color:var(--text-main); font-weight:600;">CompuTrabajo</p>
              <p style="margin:0.2rem 0 0; font-size:0.65rem; color:var(--text-dim);">Portal de empleo</p>
            </div>
          </div>
        </a>
        <a href="https://www.multitrabajos.com/" target="_blank" rel="noopener noreferrer" style="text-decoration:none;">
          <div class="premium-card" style="border: 1px solid rgba(0,0,0,0.15); padding:1rem; display:flex; flex-direction:column; align-items:center; text-align:center; gap:0.6rem; cursor:pointer; transition:all 0.2s;" onmouseover="this.style.borderColor='var(--primary)';" onmouseout="this.style.borderColor='rgba(0,0,0,0.15)';">
            <span style="font-size:1.8rem; display:inline-block; animation:icon-spin-slow 8s infinite linear;">🌐</span>
            <div>
              <p style="margin:0; font-size:0.85rem; color:var(--text-main); font-weight:600;">Multitrabajos</p>
              <p style="margin:0.2rem 0 0; font-size:0.65rem; color:var(--text-dim);">Ofertas laborales</p>
            </div>
          </div>
        </a>
        <a href="https://www.linkedin.com/jobs/" target="_blank" rel="noopener noreferrer" style="text-decoration:none;">
          <div class="premium-card" style="border: 1px solid rgba(0,0,0,0.15); padding:1rem; display:flex; flex-direction:column; align-items:center; text-align:center; gap:0.6rem; cursor:pointer; transition:all 0.2s;" onmouseover="this.style.borderColor='var(--primary)';" onmouseout="this.style.borderColor='rgba(0,0,0,0.15)';">
            <span style="font-size:1.8rem; display:inline-block; animation:icon-tilt 2.8s infinite ease-in-out;">💼</span>
            <div>
              <p style="margin:0; font-size:0.85rem; color:var(--text-main); font-weight:600;">LinkedIn</p>
              <p style="margin:0.2rem 0 0; font-size:0.65rem; color:var(--text-dim);">Red profesional</p>
            </div>
          </div>
        </a>
      </div>
    </div>

    <!-- Info Card -->
    <div class="premium-card" style="padding: 1rem; display: flex; align-items: center; gap: 1rem; grid-column: 1 / -1; background: var(--bg-deep);">
       <div id="vip-status-icon" style="width: 40px; height: 40px; border-radius: 50%; background: ${profile.vip || isAdmin ? '#dcfce7' : 'var(--bg-glass)'}; display: grid; place-items: center; border: 1px solid ${profile.vip || isAdmin ? '#16a34a' : 'var(--border-glass)'};">
          <span style="font-weight: bold; color: ${profile.vip || isAdmin ? '#16a34a' : 'var(--text-dim)'}; font-size: 0.75rem;">${isMaster ? 'MST' : (isAdmin ? 'ADM' : (profile.vip ? 'VIP' : 'STD'))}</span>
       </div>
       <div style="flex:1;">
          <h4 style="margin: 0; color: var(--text-dim); text-transform: uppercase; font-size: 0.6rem; letter-spacing: 1px;">Cuenta Certificada</h4>
          <p style="margin: 0.1rem 0; font-size: 0.85rem; font-weight: 600; color: var(--text-main);">${profile.email}</p>
          <div style="display: flex; align-items: center; gap: 0.4rem; font-size: 0.7rem; color: ${profile.vip || isAdmin ? '#16a34a' : 'var(--text-dim)'}; font-weight: 500;">
             <span style="display: inline-block; width: 4px; height: 4px; background: ${profile.vip || isAdmin ? '#16a34a' : 'currentColor'}; border-radius: 50%;"></span>
             ${
               isMaster ? 'Socio VIP &#8212; Control Master' :
               isAdmin  ? 'Administrador &#8212; Acceso de Gestión' :
               profile.vip ? 'Socio VIP &#8212; Acceso Certificado' :
               'Pendiente de activación VIP'
             }
          </div>
       </div>
        ${profile.vip ? `<button id="download-receipt-btn" style="background:var(--primary-glow); border:1px solid var(--primary); color:var(--primary); padding:0.4rem 0.8rem; border-radius:6px; font-size:0.7rem; cursor:pointer; white-space:nowrap; font-weight:600;">📄 MI RECIBO</button>` : ''}
        
        <!-- Trusted Device Toggle -->
        <div style="margin-left: auto; padding-left: 1rem; display: flex; flex-direction: column; gap: 0.5rem; align-items: flex-end;">
           <button id="trust-device-btn" class="premium-card" style="padding: 0.4rem 0.8rem; font-size: 0.65rem; border-color: ${localStorage.getItem('hv_trusted_device') === 'true' ? '#16a34a' : 'var(--border-glass)'}; color: ${localStorage.getItem('hv_trusted_device') === 'true' ? '#16a34a' : 'var(--text-dim)'}; cursor: pointer; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
              ${localStorage.getItem('hv_trusted_device') === 'true' ? '🔒 Equipo de Confianza' : '🔓 ¿Equipo Habitual?'}
           </button>
           <button id="delete-account-btn" style="background: none; border: 1px solid #fca5a5; color: #dc2626; padding: 0.35rem 0.7rem; border-radius: 6px; font-size: 0.6rem; cursor: pointer; font-weight: 600; letter-spacing: 0.5px; transition: all 0.2s;" onmouseover="this.style.background='#fef2f2';" onmouseout="this.style.background='none';">
             🗑️ Eliminar mi cuenta
           </button>
        </div>
    </div>
  </div>
  ${Footer()}
  </div>
</div>
`;
};
