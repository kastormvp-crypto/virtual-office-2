/**
 * PartnerDashboard — Panel de Control para Socios (Cibercafés)
 * Administra el flujo de clientes ilimitados por $10/mes.
 */
export const PartnerDashboardView = (profile, subStatus) => {
  const isExpired = subStatus.daysRemaining <= 0;
  
  return `
  <div class="animate-fade premium-auth-wrapper" style="min-height:100vh; padding:1.5rem; display:block; align-items:flex-start;">
    
    <!-- HEADER -->
    <header style="display:flex; justify-content:space-between; align-items:center; margin-bottom:2rem; border-bottom:1px solid var(--border-glass); padding-bottom:1rem;">
      <div style="display:flex; align-items:center; gap:0.8rem;">
        <img src="/icon.png" style="width:35px; border-radius:6px; box-shadow: var(--shadow-sm);">
        <div>
          <h2 style="font-size:0.9rem; color:var(--primary); margin:0; letter-spacing:1px; font-weight:700;">PANEL DE SOCIO ®</h2>
          <p style="font-size:0.65rem; color:var(--text-dim); margin:0;">${profile.fullName}</p>
        </div>
      </div>
      <button id="logout-btn" style="background:transparent; border:1px solid rgba(239, 68, 68, 0.2); color:#ef4444; padding:0.4rem 0.8rem; border-radius:6px; font-size:0.7rem; cursor:pointer; font-weight:600; transition:background 0.2s;" onmouseover="this.style.background='rgba(239, 68, 68, 0.05)'" onmouseout="this.style.background='transparent'">Cerrar Sesión</button>
    </header>

    <!-- ESTADO DE SUSCRIPCIÓN -->
    <div class="premium-card" style="padding:1.5rem; margin-bottom:2rem; border-left:4px solid ${isExpired ? '#ef4444' : '#16a34a'};">
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <div>
          <p style="font-size:0.75rem; color:var(--text-dim); margin:0 0 0.3rem; text-transform:uppercase; letter-spacing:0.5px;">Estado de Membresía Ilimitada</p>
          <h3 style="font-size:1.1rem; margin:0; color:var(--text-main); font-weight:600;">${isExpired ? 'SUSCRIPCIÓN VENCIDA' : 'ACTIVA ✓'}</h3>
        </div>
        <div style="text-align:right;">
          <p style="font-size:1.2rem; font-weight:800; color:${isExpired ? '#ef4444' : '#16a34a'}; margin:0;">${subStatus.daysRemaining} Días</p>
          <p style="font-size:0.65rem; color:var(--text-dim); margin:0; text-transform:uppercase; letter-spacing:0.5px;">Restantes</p>
        </div>
      </div>
      ${isExpired ? `
        <div style="margin-top:1.2rem; padding:1rem; background:rgba(239, 68, 68, 0.05); border-radius:8px; border:1px solid rgba(239, 68, 68, 0.2);">
          <p style="font-size:0.75rem; color:#ef4444; margin:0 0 1rem; font-weight:500;">Tu acceso ha expirado. Renueva ahora para seguir atendiendo clientes.</p>
          <button id="renew-sub-btn" style="width:100%; padding:0.8rem; font-size:0.8rem; background:#ef4444; color:#fff; border:none; border-radius:8px; font-weight:700; cursor:pointer;">RENOVAR POR $10.00</button>
        </div>
      ` : (subStatus.daysRemaining <= 3 ? `
        <div style="margin-top:1.2rem; padding:1rem; background:var(--primary-glow); border-radius:8px; border:1px solid rgba(59, 130, 246, 0.2);">
          <p style="font-size:0.75rem; color:var(--primary); margin:0 0 1rem; font-weight:500;">Tu suscripción vence pronto. Puedes renovar ahora para evitar interrupciones.</p>
          <button id="renew-sub-btn" class="btn-primary" style="width:100%; padding:0.8rem; font-size:0.8rem;">RENOVAR ANTICIPADAMENTE</button>
        </div>
      ` : '')}
    </div>

    <!-- ACCIONES PRINCIPALES (FORMULARIO CLIENTE) -->
    <div style="display:grid; grid-template-columns:1fr; gap:1.2rem; max-width: 600px; margin: 0 auto;">
      
      <div class="premium-card" style="padding:2rem; text-align:center; opacity:${isExpired ? '0.6' : '1'};">
        <div style="font-size:2.5rem; margin-bottom:1rem;">📄</div>
        <h3 style="font-size:1.2rem; margin:0 0 0.5rem; color:var(--text-main); font-weight:600;">Nuevo Cliente</h3>
        <p style="font-size:0.8rem; color:var(--text-dim); margin-bottom:2rem; line-height:1.5;">Inicia el proceso para una nueva hoja de vida limpia.</p>
        
        <div style="text-align:left;">
          <div class="input-group">
            <label>Nombre del Cliente</label>
            <input type="text" id="client-name" class="input-field" placeholder="Ej: Juan Pérez" spellcheck="true" autocorrect="on" autocapitalize="words">
          </div>
          <div class="input-group">
            <label>Cédula del Cliente</label>
            <input type="text" id="client-cedula" class="input-field" placeholder="1712345678" maxlength="10" inputmode="numeric">
          </div>
          <div class="input-group" style="margin-bottom:1.5rem;">
            <label>Correo del Cliente <span style="text-transform:none; font-weight:normal;">(Opcional)</span></label>
            <input type="email" id="client-email" class="input-field" placeholder="correo@ejemplo.com" inputmode="email">
          </div>
        </div>

        <button id="start-client-cv-btn" class="btn-primary" style="width:100%; padding:1.1rem; font-weight:700; font-size:0.9rem;" ${isExpired ? 'disabled' : ''}>
          COMENZAR CUESTIONARIO
        </button>
      </div>

    </div>

  </div>
  `;
};

export const attachPartnerListeners = (onStartClient, onLogout, onRenew) => {
  document.querySelector('#logout-btn')?.addEventListener('click', onLogout);
  document.querySelector('#renew-sub-btn')?.addEventListener('click', onRenew);
  
  document.querySelector('#start-client-cv-btn')?.addEventListener('click', () => {
    const name = document.querySelector('#client-name').value.trim();
    const cedula = document.querySelector('#client-cedula').value.trim();
    const email = document.querySelector('#client-email').value.trim();
    
    if (!name) {
      alert('Por favor, ingresa el nombre completo del cliente.');
      return;
    }
    if (cedula.length < 10) {
      alert('Por favor, ingresa una cédula válida de 10 dígitos.');
      return;
    }
    
    onStartClient(name, cedula, email);
  });
};
