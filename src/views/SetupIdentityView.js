import { validateCedula } from '../services/validator';

export const SetupIdentityView = (email) => `
<div class="animate-fade premium-auth-wrapper">
  <div class="premium-card" style="text-align: center;">
    <img src="/icon.png" alt="Logo" style="width: 70px; height: 70px; margin-bottom: 1.5rem; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.3);">
    <h1 style="color: var(--primary); margin-bottom: 0.3rem; font-size: 1.6rem; letter-spacing: 2px;">COMPLETA TU PERFIL</h1>
    <p style="text-align: center; color: var(--text-dim); margin-bottom: 2rem; font-size: 0.8rem; letter-spacing: 1px; text-transform: uppercase;">
      Vinculación de identidad legal
    </p>

    <!-- Email vinculado -->
    <div style="background: rgba(197,160,89,0.06); border: 1px solid rgba(197,160,89,0.2); border-radius: 10px; padding: 0.8rem 1.2rem; margin-bottom: 2rem; text-align: left; display: flex; align-items: center; gap: 0.8rem;">
      <span style="font-size: 1.2rem;">🔗</span>
      <div>
        <p style="font-size: 0.65rem; color: var(--text-dim); margin: 0; text-transform: uppercase; letter-spacing: 1px;">Cuenta Google vinculada</p>
        <p style="font-size: 0.85rem; color: var(--primary); margin: 0.2rem 0 0; font-weight: 600;">${email}</p>
      </div>
    </div>

    <!-- Nombre Completo -->
    <div class="input-group" style="text-align: left;">
      <label>Nombres y Apellidos Completos</label>
      <input type="text" id="setup-fullname" class="input-field" placeholder="Ej: Juan Carlos Pérez López"
        autocomplete="name" spellcheck="true" autocorrect="on" autocapitalize="words">
    </div>

    <!-- Número de Cédula -->
    <div class="input-group" style="text-align: left; margin-top: 0.5rem;">
      <label>Número de Cédula (10 dígitos)</label>
      <input type="text" id="setup-cedula" class="input-field" placeholder="1712345678"
        maxlength="10" inputmode="numeric">
      <div id="setup-cedula-feedback" style="font-size: 0.75rem; margin-top: 0.4rem; min-height: 1.1rem; text-align: left;"></div>
    </div>

    <!-- Advertencia -->
    <div style="margin: 1.5rem 0; padding: 1rem; background: rgba(248,113,113,0.05); border-radius: 8px; border: 1px solid rgba(248,113,113,0.15); text-align: left;">
      <p style="color: #f87171; font-size: 0.78rem; margin: 0; line-height: 1.5;">
        ⚠️ <strong>IMPORTANTE:</strong> Tus datos quedarán <strong>registrados permanentemente</strong>.
        Asegúrate de que sean correctos.
      </p>
    </div>

    <button id="finish-setup-btn" class="btn-primary" style="width: 100%; letter-spacing: 1px;" disabled>
      CONFIRMAR Y CREAR CUENTA
    </button>
  </div>
</div>
`;

export const attachSetupListeners = (onFinish) => {
  const finishBtn  = document.querySelector('#finish-setup-btn');
  const nameInput  = document.querySelector('#setup-fullname');
  const cedulaInput = document.querySelector('#setup-cedula');
  const feedback   = document.querySelector('#setup-cedula-feedback');

  let cedulaValid = false;

  const checkReady = () => {
    const hasName = nameInput?.value?.trim().length > 0;
    const ready = hasName && cedulaValid;
    if (finishBtn) {
      finishBtn.disabled = !ready;
      finishBtn.style.opacity = ready ? '1' : '0.5';
    }
  };

  cedulaInput?.addEventListener('input', (e) => {
    const val = e.target.value.replace(/\D/g, '');
    cedulaInput.value = val;

    if (val.length === 10) {
      cedulaValid = validateCedula(val);
      if (cedulaValid) {
        feedback.textContent = '✓ Cédula ecuatoriana válida';
        feedback.style.color = '#4ade80';
      } else {
        feedback.textContent = '✕ Cédula inválida. Verifícala.';
        feedback.style.color = '#f87171';
      }
    } else {
      cedulaValid = false;
      feedback.textContent = val.length > 0 ? `${val.length}/10 dígitos` : '';
      feedback.style.color = 'var(--text-dim)';
    }
    checkReady();
  });

  nameInput?.addEventListener('input', checkReady);

  finishBtn?.addEventListener('click', () => {
    const fullName = nameInput?.value?.trim() || '';
    const cedula   = cedulaInput?.value || '';
    if (!fullName || !cedulaValid) return;
    onFinish({ fullName, cedula });
  });
};
