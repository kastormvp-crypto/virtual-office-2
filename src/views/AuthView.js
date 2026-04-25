import { validateCedula } from '../services/validator';

// ─── LOGIN VIEW ───────────────────────────────────────────────────────────────
const LoginView = () => `
<div class="animate-fade" style="max-width: 450px; margin: 3rem auto;">
  <div class="glass" style="padding: 2.5rem; text-align: center;">
    <img src="/icon.png" alt="Logo" style="width: 80px; height: 80px; margin-bottom: 1.5rem; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.3);">
    <h1 style="font-size: 1.8rem; color: var(--primary); margin-bottom: 0.3rem; letter-spacing: 2px;">VIRTUAL OFFICE</h1>
    <p style="color: var(--text-dim); font-size: 0.7rem; letter-spacing: 3px; text-transform: uppercase; margin-bottom: 2rem;">Tu Hoja de Vida al Instante</p>
    <h2 style="margin-bottom: 1.5rem; font-weight: 300; font-size: 1.1rem;">Acceso Ejecutivo</h2>

    <div class="input-group">
      <label>Correo Electrónico</label>
      <input type="email" id="email" class="input-field" placeholder="usuario@correo.com" autocomplete="email">
    </div>

    <div class="input-group">
      <label>Contraseña</label>
      <input type="password" id="password" class="input-field" placeholder="••••••••••" autocomplete="current-password">
    </div>

    <button id="auth-submit-btn" class="btn-primary" style="width: 100%; margin-top: 1.5rem; letter-spacing: 1px;">
      INICIAR SESIÓN
    </button>

    <div style="margin-top: 1.5rem; padding: 0.8rem; border: 1px solid rgba(197, 160, 89, 0.2); border-radius: 8px; background: rgba(197, 160, 89, 0.05); text-align: left;">
       <p style="margin: 0; font-size: 0.7rem; color: #4ade80; display: flex; align-items: center; gap: 0.5rem; font-weight: 600;">
          <span>🔒</span> CONEXION SEGURA(AES-256)
       </p>
       <p style="margin: 0.3rem 0 0; font-size: 0.65rem; color: var(--text-dim); line-height: 1.4;">
          Sus datos personales están protegidos bajo estándares de alta seguridad.
       </p>
    </div>

    <div style="margin-top: 1.5rem; font-size: 0.85rem; color: var(--text-dim);">
      ¿Eres Usuario Nuevo? <a href="#" id="toggle-auth" data-mode="register" style="color: var(--primary); font-weight: 600; text-decoration: none;">Crear Cuenta</a>
    </div>
  </div>
</div>
`;

// ─── REGISTER VIEW ────────────────────────────────────────────────────────────
const RegisterView = () => `
<div class="animate-fade" style="max-width: 450px; margin: 3rem auto;">
  <div class="glass" style="padding: 2.5rem; text-align: center;">
    <img src="/icon.png" alt="Logo" style="width: 80px; height: 80px; margin-bottom: 1.5rem; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.3);">
    <h1 style="font-size: 1.8rem; color: var(--primary); margin-bottom: 0.3rem; letter-spacing: 2px;">VIRTUAL OFFICE</h1>
    <p style="color: var(--text-dim); font-size: 0.7rem; letter-spacing: 3px; text-transform: uppercase; margin-bottom: 2rem;">Tu Hoja de Vida al Instante</p>
    <h2 style="margin-bottom: 0.3rem; font-weight: 300; font-size: 1.1rem;">Registro de Identidad</h2>
    <p style="color: var(--text-dim); font-size: 0.7rem; margin-bottom: 1.5rem;">Tu cédula debe ser válida para continuar</p>

    <!-- PASO 1: Identidad (siempre visible) -->
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.6rem;">
      <div class="input-group" style="text-align:left;">
        <label>Nombres</label>
        <input type="text" id="reg-firstname" class="input-field" placeholder="Nombre Completos" autocomplete="given-name">
      </div>
      <div class="input-group" style="text-align:left;">
        <label>Apellidos</label>
        <input type="text" id="reg-lastname" class="input-field" placeholder="Apellidos Completos" autocomplete="family-name">
      </div>
    </div>

    <div class="input-group">
      <label>Número de Cédula</label>
      <input type="text" id="cedula" class="input-field" placeholder="1712345678" maxlength="10" inputmode="numeric">
      <div id="cedula-feedback" style="font-size: 0.75rem; margin-top: 0.3rem; text-align: left; min-height: 1.1rem;"></div>
    </div>

    <div class="input-group">
      <label>Nacionalidad</label>
      <input type="text" id="reg-nationality" class="input-field" placeholder="Ecuatoriana" autocomplete="country-name">
    </div>

    <!-- PASO 2: Credenciales (oculto hasta cédula válida) -->
    <div id="credentials-section" style="overflow: hidden; max-height: 0; opacity: 0; transition: max-height 0.4s ease, opacity 0.4s ease;">
      <div style="border-top: 1px solid rgba(197,160,89,0.2); padding-top: 1rem; margin-top: 0.5rem; margin-bottom: 0.5rem;">
        <p style="font-size: 0.7rem; color: #4ade80; text-align: center; letter-spacing: 1px; margin: 0 0 1rem;">✓ Cédula Verificada — Completa tus credenciales</p>
        <div class="input-group">
          <label>Correo Electrónico</label>
          <input type="email" id="email" class="input-field" placeholder="usuario@correo.com" autocomplete="email">
        </div>
        <div class="input-group">
          <label>Contraseña</label>
          <input type="password" id="password" class="input-field" placeholder="Mínimo 8 caracteres" autocomplete="new-password" minlength="8">
        </div>
      </div>
    </div>

    <button id="auth-submit-btn" class="btn-primary" style="width: 100%; margin-top: 1rem; letter-spacing: 1px;" disabled>
      COMPLETAR REGISTRO
    </button>

    <div style="margin-top: 1.5rem; font-size: 0.85rem; color: var(--text-dim);">
      ¿Ya tienes cuenta? <a href="#" id="toggle-auth" data-mode="login" style="color: var(--primary); font-weight: 600; text-decoration: none;">Iniciar Sesión</a>
    </div>
  </div>
</div>
`;

// ─── EXPORT ───────────────────────────────────────────────────────────────────
export const AuthView = (mode = 'login') => mode === 'login' ? LoginView() : RegisterView();

// ─── LISTENERS ───────────────────────────────────────────────────────────────
export const attachAuthListeners = (currentMode, onToggle, onSubmit) => {
  const toggleBtn = document.querySelector('#toggle-auth');
  const submitBtn = document.querySelector('#auth-submit-btn');

  toggleBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    onToggle(e.target.dataset.mode);
  });

  if (currentMode === 'register') {
    const cedulaInput = document.querySelector('#cedula');
    const feedback = document.querySelector('#cedula-feedback');
    const credentialsSection = document.querySelector('#credentials-section');
    let cedulaValid = false;

    cedulaInput?.addEventListener('input', (e) => {
      const val = e.target.value.replace(/\D/g, '');
      cedulaInput.value = val; // allow only numbers
      if (val.length === 10) {
        cedulaValid = validateCedula(val);
        if (cedulaValid) {
          feedback.textContent = '✓ Cédula ecuatoriana válida';
          feedback.style.color = '#4ade80';
          // Reveal credentials section
          credentialsSection.style.maxHeight = '300px';
          credentialsSection.style.opacity = '1';
          submitBtn.disabled = false;
          submitBtn.style.opacity = '1';
        } else {
          feedback.textContent = '✕ Cédula inválida. Verifícala.';
          feedback.style.color = '#f87171';
          credentialsSection.style.maxHeight = '0';
          credentialsSection.style.opacity = '0';
          submitBtn.disabled = true;
        }
      } else {
        feedback.textContent = val.length > 0 ? `${val.length}/10 dígitos` : '';
        feedback.style.color = 'var(--text-dim)';
        cedulaValid = false;
        credentialsSection.style.maxHeight = '0';
        credentialsSection.style.opacity = '0';
        submitBtn.disabled = true;
      }
    });

    submitBtn?.addEventListener('click', () => {
      if (!cedulaValid) return;
      const firstName = document.querySelector('#reg-firstname')?.value?.trim() || '';
      const lastName = document.querySelector('#reg-lastname')?.value?.trim() || '';
      const cedula = document.querySelector('#cedula').value;
      const nationality = document.querySelector('#reg-nationality')?.value?.trim() || 'Ecuatoriana';
      const email = document.querySelector('#email')?.value?.trim() || '';
      const password = document.querySelector('#password')?.value || '';
      const fullName = `${firstName} ${lastName}`.trim();
      if (!firstName || !lastName) return;
      if (email.length < 5) return;
      if (password.length < 8) return;
      // Pass all data to main.js via onSubmit
      // encode extra data in a structured object passed as the password param
      onSubmit(currentMode, email, cedula, password, { fullName, cedula, nationality });
    });

  } else {
    // LOGIN: simple email + password
    submitBtn?.addEventListener('click', () => {
      const email = document.querySelector('#email')?.value?.trim() || '';
      const password = document.querySelector('#password')?.value || '';
      onSubmit(currentMode, email, password);
    });
  }
};
