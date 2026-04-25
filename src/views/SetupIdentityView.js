export const SetupIdentityView = (email, cedula) => `
<div class="animate-fade" style="max-width: 500px; margin: 4rem auto;">
  <div class="glass" style="padding: 3rem;">
    <h1 style="color: var(--primary); text-align: center; margin-bottom: 1rem;">Configuración Final</h1>
    <p style="text-align: center; color: var(--text-dim); margin-bottom: 2.5rem; font-size: 0.95rem;">
      Estamos vinculando tu cuenta a una identidad legal única e intransferible.
    </p>

    <div style="background: rgba(197, 160, 89, 0.05); border-left: 3px solid var(--primary); padding: 1rem; border-radius: 4px; margin-bottom: 2rem;">
      <p style="font-size: 0.8rem; color: var(--text-dim); margin-bottom: 0.5rem;">DATOS RECUPERADOS:</p>
      <div style="font-weight: 600;">Cédula: ${cedula}</div>
      <div style="font-size: 0.85rem; color: var(--primary);">${email}</div>
    </div>

    <div class="input-group">
      <label>Nombres y Apellidos Completos</label>
      <input type="text" id="setup-fullname" class="input-field" placeholder="Juan Pérez" autocomplete="name">
    </div>

    <div style="margin-top: 2rem; padding: 1rem; background: rgba(248, 113, 113, 0.05); border-radius: var(--radius-sm); margin-bottom: 2rem;">
      <p style="color: #f87171; font-size: 0.8rem; margin: 0; line-height: 1.4;">
        ⚠️ <strong>IMPORTANTE:</strong> Una vez guardados, tus nombres y cédula quedarán <strong>registrados permanentemente</strong>. Asegúrate de que sean correctos.
      </p>
    </div>

    <button id="finish-setup-btn" class="btn-primary" style="width: 100%; letter-spacing: 1px;">
      CONFIRMAR Y GUARDAR
    </button>
  </div>
</div>
`;

export const attachSetupListeners = (onFinish) => {
  const finishBtn = document.querySelector('#finish-setup-btn');
  finishBtn?.addEventListener('click', () => {
    const fullName = document.querySelector('#setup-fullname').value;
    onFinish(fullName);
  });
};
