/**
 * PartnerDashboard — Panel de Control para Socios (Cibercafés)
 * Administra el flujo de clientes ilimitados por $10/mes.
 */
export const PartnerDashboardView = (profile, subStatus) => {
  const isExpired = subStatus.daysRemaining <= 0;
  
  return `
  <div class="animate-fade" style="min-height:100vh; background:#0a0b10; color:#fff; font-family:'Inter',sans-serif; padding:1.5rem;">
    
    <!-- HEADER -->
    <header style="display:flex; justify-content:space-between; align-items:center; margin-bottom:2rem; border-bottom:1px solid rgba(197,160,89,0.1); padding-bottom:1rem;">
      <div style="display:flex; align-items:center; gap:0.8rem;">
        <img src="/icon.png" style="width:35px; border-radius:6px;">
        <div>
          <h2 style="font-size:0.9rem; color:#c5a059; margin:0; letter-spacing:1px;">PANEL DE SOCIO ®</h2>
          <p style="font-size:0.65rem; color:#808090; margin:0;">${profile.fullName}</p>
        </div>
      </div>
      <button id="logout-btn" style="background:none; border:1px solid rgba(255,255,255,0.1); color:#f87171; padding:0.4rem 0.8rem; border-radius:6px; font-size:0.7rem; cursor:pointer;">Cerrar Sesión</button>
    </header>

    <!-- ESTADO DE SUSCRIPCIÓN -->
    <div class="glass" style="padding:1.5rem; margin-bottom:2rem; border-left:4px solid ${isExpired ? '#f87171' : '#4ade80'};">
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <div>
          <p style="font-size:0.75rem; color:#a0a0b0; margin:0 0 0.3rem;">Estado de Membresía Ilimitada</p>
          <h3 style="font-size:1.1rem; margin:0;">${isExpired ? 'SUSCRIPCIÓN VENCIDA' : 'ACTIVA ✓'}</h3>
        </div>
        <div style="text-align:right;">
          <p style="font-size:1.2rem; font-weight:700; color:${isExpired ? '#f87171' : '#4ade80'}; margin:0;">${subStatus.daysRemaining} Días</p>
          <p style="font-size:0.65rem; color:#a0a0b0; margin:0;">Restantes</p>
        </div>
      </div>
      ${isExpired ? `
        <div style="margin-top:1rem; padding:0.8rem; background:rgba(248,113,113,0.1); border-radius:8px; border:1px solid rgba(248,113,113,0.2);">
          <p style="font-size:0.7rem; color:#f87171; margin-bottom:0.8rem;">Tu acceso ha expirado. Renueva ahora para seguir atendiendo clientes.</p>
          <button id="renew-sub-btn" class="btn-primary" style="width:100%; padding:0.6rem; font-size:0.8rem; background:#4ade80; color:#000;">RENOVAR POR $10.00</button>
        </div>
      ` : (subStatus.daysRemaining <= 3 ? `
        <div style="margin-top:1rem; padding:0.8rem; background:rgba(197,160,89,0.1); border-radius:8px; border:1px solid rgba(197,160,89,0.2);">
          <p style="font-size:0.7rem; color:#c5a059; margin-bottom:0.8rem;">Tu suscripción vence pronto. Puedes renovar ahora para evitar interrupciones.</p>
          <button id="renew-sub-btn" class="btn-primary" style="width:100%; padding:0.6rem; font-size:0.8rem;">RENOVAR ANTICIPADAMENTE</button>
        </div>
      ` : '')}
    </div>

    <!-- ACCIONES PRINCIPALES -->
    <div style="display:grid; grid-template-columns:1fr; gap:1.2rem;">
      
      <div class="glass" style="padding:1.5rem; text-align:center; border:1px solid ${isExpired ? 'rgba(255,255,255,0.05)' : 'rgba(197,160,89,0.3)'}; opacity:${isExpired ? '0.5' : '1'};">
        <div style="font-size:2.5rem; margin-bottom:1rem;">📄</div>
        <h3 style="font-size:1.1rem; margin-bottom:0.5rem;">Nuevo Cliente</h3>
        <p style="font-size:0.75rem; color:#a0a0b0; margin-bottom:1.5rem;">Inicia el proceso para una nueva hoja de vida limpia.</p>
        
        <div style="background:rgba(255,255,255,0.03); border-radius:8px; padding:1.2rem; margin-bottom:1.5rem; text-align:left;">
          <div class="input-group" style="margin-bottom:1rem;">
            <label style="font-size:0.65rem; text-transform:uppercase; color:#c5a059;">Nombre del Cliente</label>
            <input type="text" id="client-name" class="input-field" placeholder="Ej: Juan Pérez" style="background:rgba(0,0,0,0.2);" spellcheck="true" autocorrect="on" autocapitalize="sentences">
          </div>
          <div class="input-group" style="margin-bottom:1rem;">
            <label style="font-size:0.65rem; text-transform:uppercase; color:#c5a059;">Cédula del Cliente</label>
            <input type="text" id="client-cedula" class="input-field" placeholder="1712345678" maxlength="10" inputmode="numeric" style="background:rgba(0,0,0,0.2);">
          </div>
          <div class="input-group" style="margin-bottom:0;">
            <label style="font-size:0.65rem; text-transform:uppercase; color:#c5a059;">Correo del Cliente <span style="color:#808090;">(Opcional)</span></label>
            <input type="email" id="client-email" class="input-field" placeholder="correo@ejemplo.com" style="background:rgba(0,0,0,0.2);" inputmode="email">
          </div>
        </div>

        <button id="start-client-cv-btn" class="btn-primary" style="width:100%; padding:1rem; font-weight:700;" ${isExpired ? 'disabled' : ''}>
          COMENZAR CUESTIONARIO
        </button>
      </div>

      <div class="glass" style="padding:1rem; text-align:center; opacity:0.6;">
        <p style="font-size:0.7rem; color:#a0a0b0; margin:0;">Uso Ilimitado Mensual habilitado para este local.</p>
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
