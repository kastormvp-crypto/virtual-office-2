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
        <p style="color: #fff; font-size: 0.65rem; text-transform: uppercase; letter-spacing: 1.5px; font-weight: bold; margin: 0;">Oficina Virtual Professional</p>
        <h3 style="margin: 0.1rem 0 0 0; font-weight: 500; font-size: 1.3rem;">Hola, ${profile.fullName}</h3>
      </div>
    </div>
    <div style="display: flex; gap: 0.8rem; align-items: center;">
      ${isAdmin ? `
        <button id="super-user-btn" style="padding: 0.4rem 0.8rem; border-radius: 8px; cursor: pointer; font-size: 0.75rem; font-weight: bold; background: transparent; color: #fff; border: 1px solid rgba(56, 189, 248, 0.8); box-shadow: 0 0 10px rgba(56, 189, 248, 0.3); transition: box-shadow 0.3s ease;" onmouseover="this.style.boxShadow='0 0 20px rgba(56, 189, 248, 0.8)'" onmouseout="this.style.boxShadow='0 0 10px rgba(56, 189, 248, 0.3)'" ontouchstart="this.style.boxShadow='0 0 20px rgba(56, 189, 248, 0.8)'" ontouchend="this.style.boxShadow='0 0 10px rgba(56, 189, 248, 0.3)'">PANEL SUPER USUARIO</button>
      ` : ''}
      <button id="logout-btn" style="padding: 0.4rem 0.8rem; border-radius: 8px; cursor: pointer; font-size: 0.75rem; font-weight: bold; background: transparent; color: #fff; border: 1px solid rgba(56, 189, 248, 0.8); box-shadow: 0 0 10px rgba(56, 189, 248, 0.3); transition: box-shadow 0.3s ease;" onmouseover="this.style.boxShadow='0 0 20px rgba(56, 189, 248, 0.8)'" onmouseout="this.style.boxShadow='0 0 10px rgba(56, 189, 248, 0.3)'" ontouchstart="this.style.boxShadow='0 0 20px rgba(56, 189, 248, 0.8)'" ontouchend="this.style.boxShadow='0 0 10px rgba(56, 189, 248, 0.3)'">SALIR</button>
    </div>
  </header>

  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem;">
    <!-- Module 1: AI Data Capture -->
    <div class="glass" style="padding: 1.5rem; display: flex; flex-direction: column; align-items: center; text-align: center; border-top: 3px solid rgba(56, 189, 248, 0.8); position: relative; overflow: hidden; background: linear-gradient(135deg, rgba(56, 189, 248, 0.05) 0%, transparent 100%);">
      <div style="position:relative; width:50px; height:50px; margin-bottom: 0.5rem;">
        <div style="position:absolute; width:26px; height:34px; background:rgba(255,255,255,0.05); border:2px solid #38bdf8; border-radius:4px; top:8px; left:12px; box-shadow: 0 0 10px rgba(56,189,248,0.2);">
          <div style="width:12px; height:2px; background:#38bdf8; margin:6px 5px; border-radius:1px;"></div>
          <div style="width:8px; height:2px; background:#38bdf8; margin:5px; border-radius:1px;"></div>
          <div style="width:14px; height:2px; background:#38bdf8; margin:5px; border-radius:1px;"></div>
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
      <h2 style="margin-bottom: 0.3rem; font-size: 1.2rem;">Edicion de tu Hoja de Vida</h2>
      <p style="color: var(--text-dim); flex-grow: 1; margin-bottom: 1.2rem; line-height: 1.4; font-size: 0.85rem;">
        Cuestionario inteligente para estructurar tu perfil profesional bajo formato ATS con asistencia de IA.
      </p>
      <button id="start-interview-btn" style="width: 100%; padding: 0.7rem; border-radius: 8px; cursor: pointer; font-weight: bold; font-size: 0.9rem; background: transparent; color: #fff; border: 1px solid rgba(56, 189, 248, 0.8); box-shadow: 0 0 10px rgba(56, 189, 248, 0.3); transition: box-shadow 0.3s ease;" onmouseover="this.style.boxShadow='0 0 20px rgba(56, 189, 248, 0.8)'" onmouseout="this.style.boxShadow='0 0 10px rgba(56, 189, 248, 0.3)'" ontouchstart="this.style.boxShadow='0 0 20px rgba(56, 189, 248, 0.8)'" ontouchend="this.style.boxShadow='0 0 10px rgba(56, 189, 248, 0.3)'">REGISTRO DE INFORMACION</button>
    </div>

    <!-- Module 2: Visualization and Export -->
    <div class="glass" style="padding: 1.5rem; display: flex; flex-direction: column; align-items: center; text-align: center; border-top: 3px solid rgba(56, 189, 248, 0.8); position: relative; overflow: hidden; background: linear-gradient(135deg, rgba(56, 189, 248, 0.05) 0%, transparent 100%);">
      <div style="position:relative; width:50px; height:50px; margin-bottom: 0.5rem; perspective: 150px;">
        <div style="position:absolute; width:28px; height:38px; background:rgba(197,160,89,0.15); border:1.5px solid rgba(197,160,89,0.8); border-radius:4px; top:6px; left:11px; transform-origin: bottom center; animation: doc-swap-1 4s infinite ease-in-out; box-shadow: 0 0 10px rgba(197,160,89,0.2);">
          <div style="width:14px; height:2px; background:rgba(197,160,89,0.6); margin:6px auto; border-radius:1px;"></div>
          <div style="width:10px; height:2px; background:rgba(197,160,89,0.6); margin:4px auto; border-radius:1px;"></div>
        </div>
        <div style="position:absolute; width:28px; height:38px; background:rgba(56,189,248,0.15); border:1.5px solid rgba(56,189,248,0.8); border-radius:4px; top:6px; left:11px; transform-origin: bottom center; animation: doc-swap-2 4s infinite ease-in-out; box-shadow: 0 0 10px rgba(56,189,248,0.2);">
          <div style="width:14px; height:2px; background:rgba(56,189,248,0.6); margin:6px auto; border-radius:1px;"></div>
          <div style="width:18px; height:2px; background:rgba(56,189,248,0.6); margin:4px auto; border-radius:1px;"></div>
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
      <h2 style="margin-bottom: 0.3rem; font-size: 1.2rem;">Mi Hoja de Vida</h2>
      <p style="color: var(--text-dim); flex-grow: 1; margin-bottom: 1.2rem; line-height: 1.4; font-size: 0.85rem;">
        Visualiza tu resultado, cambia el estilo ejecutivo de tu CV y compártelo directamente por WhatsApp como PDF.
      </p>
      <button id="direct-editor-btn" style="width: 100%; padding: 0.7rem; border-radius: 8px; cursor: pointer; font-weight: bold; font-size: 0.9rem; background: transparent; color: #fff; border: 1px solid rgba(56, 189, 248, 0.8); box-shadow: 0 0 10px rgba(56, 189, 248, 0.3); transition: box-shadow 0.3s ease;" onmouseover="this.style.boxShadow='0 0 20px rgba(56, 189, 248, 0.8)'" onmouseout="this.style.boxShadow='0 0 10px rgba(56, 189, 248, 0.3)'" ontouchstart="this.style.boxShadow='0 0 20px rgba(56, 189, 248, 0.8)'" ontouchend="this.style.boxShadow='0 0 10px rgba(56, 189, 248, 0.3)'">VER MI HOJA DE VIDA</button>
    </div>

    ${isStandard ? `
    <!-- Upgrade Banner — Solo para usuarios estándar -->
    <div class="glass" style="padding: 1.5rem; grid-column: 1 / -1; border: 1px solid rgba(197,160,89,0.3); background: linear-gradient(135deg, rgba(197,160,89,0.06) 0%, rgba(0,0,0,0) 100%); border-radius: 16px; position:relative; overflow:hidden;">
      <div style="position:absolute; top:-40px; right:-40px; width:200px; height:200px; background:radial-gradient(circle, rgba(197,160,89,0.07) 0%, transparent 70%); pointer-events:none;"></div>
      <div style="display:flex; align-items:flex-start; gap:1rem; flex-wrap:wrap;">
        <div style="font-size:2.5rem;">💼</div>
        <div style="flex:1; min-width:200px;">
          <span style="background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.4); color:#fff; font-size:0.65rem; font-weight:700; letter-spacing:2px; padding:0.25rem 0.7rem; border-radius:100px; text-transform:uppercase;">Plan Socio</span>
          <h3 style="margin:0.5rem 0 0.3rem; font-size:1.05rem; color:#fff;">¿Tienes un Cibercafé o Centro de Copiado?</h3>
          <p style="color:#fff; font-size:0.8rem; margin:0 0 1rem; line-height:1.5;">Acceso ilimitado para generar CVs profesionales a todos tus clientes por solo <strong style="color:#fff;">$10 al mes</strong>. Sin límites, sin pagos por CV.</p>
          <div style="display:flex; gap:0.8rem; flex-wrap:wrap;">
            <button id="dashboard-socio-payphone-btn" style="padding:0.6rem 1.2rem; border-radius:10px; cursor:pointer; font-weight:700; font-size:0.8rem; background:transparent; color:#fff; border:1px solid rgba(56, 189, 248, 0.8); box-shadow:0 0 10px rgba(56, 189, 248, 0.3); transition:box-shadow 0.3s ease;" onmouseover="this.style.boxShadow='0 0 20px rgba(56, 189, 248, 0.8)'" onmouseout="this.style.boxShadow='0 0 10px rgba(56, 189, 248, 0.3)'" ontouchstart="this.style.boxShadow='0 0 20px rgba(56, 189, 248, 0.8)'" ontouchend="this.style.boxShadow='0 0 10px rgba(56, 189, 248, 0.3)'">💳 Pagar con Tarjeta — $10</button>
            <button id="dashboard-socio-transfer-btn" style="padding:0.6rem 1.2rem; border-radius:10px; cursor:pointer; font-weight:700; font-size:0.8rem; background:transparent; color:#fff; border:1px solid rgba(56, 189, 248, 0.8); box-shadow:0 0 10px rgba(56, 189, 248, 0.3); transition:box-shadow 0.3s ease;" onmouseover="this.style.boxShadow='0 0 20px rgba(56, 189, 248, 0.8)'" onmouseout="this.style.boxShadow='0 0 10px rgba(56, 189, 248, 0.3)'" ontouchstart="this.style.boxShadow='0 0 20px rgba(56, 189, 248, 0.8)'" ontouchend="this.style.boxShadow='0 0 10px rgba(56, 189, 248, 0.3)'">🏦 Pagar por Transferencia</button>
          </div>
        </div>
      </div>
    </div>
    ` : ''}

    ${''}
    <!-- Panel de Utilidades — Visible para todos los usuarios -->
    <div class="glass" style="padding: 1.5rem; grid-column: 1 / -1; border: 1px solid rgba(197,160,89,0.25); background: linear-gradient(135deg, rgba(197,160,89,0.04) 0%, rgba(0,0,0,0) 100%); border-radius: 16px; box-sizing:border-box;">
      <div style="text-align:center; margin-bottom:1.5rem;">
        <h2 style="margin:0; font-size:1.3rem; color:#fff; letter-spacing:1px;">Enlaces de Interés</h2>
        <p style="margin:0.3rem 0 0; color:var(--text-dim); font-size:0.75rem;">Acceso directo a trámites y portales de empleo</p>
      </div>

      <!-- Documentos Oficiales -->
      <p style="text-align:center; color:#fff; font-size:0.68rem; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; margin:0 0 1rem;">📋 Documentos Oficiales</p>
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(140px, 1fr)); gap:1rem; margin-bottom:1.8rem;">
        <a href="https://certificados.ministeriodelinterior.gob.ec/gestorcertificados/antecedentes/" target="_blank" rel="noopener noreferrer" style="text-decoration:none;">
          <div class="glass" style="padding:1rem; display:flex; flex-direction:column; align-items:center; text-align:center; gap:0.6rem; cursor:pointer; transition:all 0.2s; border:1px solid rgba(255,255,255,0.06);" onmouseover="this.style.borderColor='rgba(197,160,89,0.4)';this.style.background='rgba(197,160,89,0.06)';" onmouseout="this.style.borderColor='rgba(255,255,255,0.06)';this.style.background='';">
            <span style="font-size:1.8rem;">🔍</span>
            <div>
              <p style="margin:0; font-size:0.85rem; color:#fff; font-weight:600;">Record Policial</p>
              <p style="margin:0.2rem 0 0; font-size:0.65rem; color:var(--text-dim);">Ministerio del Interior</p>
            </div>
          </div>
        </a>
        <a href="https://servicios.educacion.gob.ec/titulacion25-web/faces/paginas/consulta-titulos-refrendados.xhtml" target="_blank" rel="noopener noreferrer" style="text-decoration:none;">
          <div class="glass" style="padding:1rem; display:flex; flex-direction:column; align-items:center; text-align:center; gap:0.6rem; cursor:pointer; transition:all 0.2s; border:1px solid rgba(255,255,255,0.06);" onmouseover="this.style.borderColor='rgba(197,160,89,0.4)';this.style.background='rgba(197,160,89,0.06)';" onmouseout="this.style.borderColor='rgba(255,255,255,0.06)';this.style.background='';">
            <span style="font-size:1.8rem;">🎓</span>
            <div>
              <p style="margin:0; font-size:0.85rem; color:#fff; font-weight:600;">Título de Bachiller</p>
              <p style="margin:0.2rem 0 0; font-size:0.65rem; color:var(--text-dim);">Ministerio de Educación</p>
            </div>
          </div>
        </a>
      </div>

      <!-- Portales de Empleo -->
      <p style="text-align:center; color:#fff; font-size:0.68rem; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; margin:0 0 1rem;">💼 Portales de Empleo</p>
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(140px, 1fr)); gap:1rem;">
        <a href="https://encuentraempleo.trabajo.gob.ec/socioEmpleo-war/paginas/index.jsf" target="_blank" rel="noopener noreferrer" style="text-decoration:none;">
          <div class="glass" style="padding:1rem; display:flex; flex-direction:column; align-items:center; text-align:center; gap:0.6rem; cursor:pointer; transition:all 0.2s; border:1px solid rgba(255,255,255,0.06);" onmouseover="this.style.borderColor='rgba(74,222,128,0.4)';this.style.background='rgba(74,222,128,0.04)';" onmouseout="this.style.borderColor='rgba(255,255,255,0.06)';this.style.background='';">
            <span style="font-size:1.8rem;">🏛️</span>
            <div>
              <p style="margin:0; font-size:0.85rem; color:#fff; font-weight:600;">Socio Empleo</p>
              <p style="margin:0.2rem 0 0; font-size:0.65rem; color:var(--text-dim);">Ministerio de Trabajo</p>
            </div>
          </div>
        </a>
        <a href="https://www.computrabajo.com.ec/" target="_blank" rel="noopener noreferrer" style="text-decoration:none;">
          <div class="glass" style="padding:1rem; display:flex; flex-direction:column; align-items:center; text-align:center; gap:0.6rem; cursor:pointer; transition:all 0.2s; border:1px solid rgba(255,255,255,0.06);" onmouseover="this.style.borderColor='rgba(74,222,128,0.4)';this.style.background='rgba(74,222,128,0.04)';" onmouseout="this.style.borderColor='rgba(255,255,255,0.06)';this.style.background='';">
            <span style="font-size:1.8rem;">💻</span>
            <div>
              <p style="margin:0; font-size:0.85rem; color:#fff; font-weight:600;">CompuTrabajo</p>
              <p style="margin:0.2rem 0 0; font-size:0.65rem; color:var(--text-dim);">Portal de empleo</p>
            </div>
          </div>
        </a>
        <a href="https://www.multitrabajos.com/" target="_blank" rel="noopener noreferrer" style="text-decoration:none;">
          <div class="glass" style="padding:1rem; display:flex; flex-direction:column; align-items:center; text-align:center; gap:0.6rem; cursor:pointer; transition:all 0.2s; border:1px solid rgba(255,255,255,0.06);" onmouseover="this.style.borderColor='rgba(74,222,128,0.4)';this.style.background='rgba(74,222,128,0.04)';" onmouseout="this.style.borderColor='rgba(255,255,255,0.06)';this.style.background='';">
            <span style="font-size:1.8rem;">🌐</span>
            <div>
              <p style="margin:0; font-size:0.85rem; color:#fff; font-weight:600;">Multitrabajos</p>
              <p style="margin:0.2rem 0 0; font-size:0.65rem; color:var(--text-dim);">Ofertas laborales</p>
            </div>
          </div>
        </a>
        <a href="https://www.linkedin.com/jobs/" target="_blank" rel="noopener noreferrer" style="text-decoration:none;">
          <div class="glass" style="padding:1rem; display:flex; flex-direction:column; align-items:center; text-align:center; gap:0.6rem; cursor:pointer; transition:all 0.2s; border:1px solid rgba(255,255,255,0.06);" onmouseover="this.style.borderColor='rgba(74,222,128,0.4)';this.style.background='rgba(74,222,128,0.04)';" onmouseout="this.style.borderColor='rgba(255,255,255,0.06)';this.style.background='';">
            <span style="font-size:1.8rem;">💼</span>
            <div>
              <p style="margin:0; font-size:0.85rem; color:#fff; font-weight:600;">LinkedIn</p>
              <p style="margin:0.2rem 0 0; font-size:0.65rem; color:var(--text-dim);">Red profesional</p>
            </div>
          </div>
        </a>
      </div>
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
        
        <!-- Trusted Device Toggle -->
        <div style="margin-left: auto; padding-left: 1rem; display: flex; flex-direction: column; gap: 0.5rem; align-items: flex-end;">
           <button id="trust-device-btn" class="glass" style="padding: 0.4rem 0.8rem; font-size: 0.65rem; border-color: ${localStorage.getItem('hv_trusted_device') === 'true' ? '#4ade80' : 'rgba(255,255,255,0.1)'}; color: ${localStorage.getItem('hv_trusted_device') === 'true' ? '#4ade80' : '#a0a0b0'}; cursor: pointer; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px;">
              ${localStorage.getItem('hv_trusted_device') === 'true' ? '🔒 Equipo de Confianza' : '🔓 ¿Equipo Habitual?'}
           </button>
           <button id="delete-account-btn" style="background: none; border: 1px solid rgba(248,113,113,0.2); color: rgba(248,113,113,0.55); padding: 0.35rem 0.7rem; border-radius: 6px; font-size: 0.6rem; cursor: pointer; font-weight: 500; letter-spacing: 0.5px; transition: all 0.2s;" onmouseover="this.style.borderColor='rgba(248,113,113,0.5)';this.style.color='#f87171';" onmouseout="this.style.borderColor='rgba(248,113,113,0.2)';this.style.color='rgba(248,113,113,0.55)';">
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
