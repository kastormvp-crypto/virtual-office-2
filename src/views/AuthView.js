import { validateCedula } from '../services/validator';
import { showPrivacyPolicy } from '../components/PrivacyPolicy';

// ─── LOGIN VIEW ───────────────────────────────────────────────────────────────
const LoginView = () => `
<div class="animate-fade" style="max-width: 450px; margin: 3rem auto;">
  <div class="glass" style="padding: 2.5rem; text-align: center;">
    <img src="/icon.png" alt="Logo" style="width: 80px; height: 80px; margin-bottom: 1.5rem; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.3);">
    <h1 style="font-size: 1.8rem; color: var(--primary); margin-bottom: 0.3rem; letter-spacing: 2px;">TU HOJA DE VIDA</h1>
    <p style="color: var(--text-dim); font-size: 0.7rem; letter-spacing: 3px; text-transform: uppercase; margin-bottom: 2rem;">Al Instante</p>
    <h2 style="margin-bottom: 1.5rem; font-weight: 300; font-size: 1.1rem;">Acceso Ejecutivo</h2>

    <div class="input-group">
      <label>Correo Electrónico</label>
      <input type="email" id="email" class="input-field" placeholder="usuario@correo.com" autocomplete="email">
    </div>

    <div class="input-group">
      <label>Contraseña</label>
      <input type="password" id="password" class="input-field" placeholder="••••••••••" autocomplete="current-password">
    </div>

    <div style="text-align: right; margin-top: -0.5rem; margin-bottom: 1.5rem;">
      <a href="#" id="forgot-password-link" style="color: var(--text-dim); font-size: 0.75rem; text-decoration: none;">¿Olvidaste tu contraseña?</a>
    </div>

    <button id="auth-submit-btn" class="btn-primary" style="width: 100%; letter-spacing: 1px;">
      INICIAR SESIÓN
    </button>

    <div style="margin: 1.2rem 0; display:flex; align-items:center; gap:0.8rem;">
      <div style="flex:1; height:1px; background:rgba(255,255,255,0.1);"></div>
      <span style="font-size:0.7rem; color:var(--text-dim); white-space:nowrap;">o continúa con</span>
      <div style="flex:1; height:1px; background:rgba(255,255,255,0.1);"></div>
    </div>
    <button id="google-signin-btn" type="button" style="width:100%; padding:0.75rem; background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.12); border-radius:8px; color:#e8eaed; font-size:0.875rem; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:0.75rem; transition:background 0.2s; font-family:inherit;">
      <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg"><path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/><path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/><path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/><path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z" fill="#EA4335"/></svg>
      Continuar con Google
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
    <h1 style="font-size: 1.8rem; color: var(--primary); margin-bottom: 0.3rem; letter-spacing: 2px;">TU HOJA DE VIDA</h1>
    <p style="color: var(--text-dim); font-size: 0.7rem; letter-spacing: 3px; text-transform: uppercase; margin-bottom: 2rem;">Al Instante</p>
    <h2 style="margin-bottom: 0.3rem; font-weight: 300; font-size: 1.1rem;">Registro de Identidad</h2>
    <p style="color: var(--text-dim); font-size: 0.7rem; margin-bottom: 1.5rem;">Tu cédula debe ser válida para continuar</p>

    <!-- PASO 1: Identidad (siempre visible) -->
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.6rem;">
      <div class="input-group" style="text-align:left;">
        <label>Nombres</label>
        <input type="text" id="reg-firstname" class="input-field" placeholder="Nombre Completos" autocomplete="given-name" spellcheck="true" autocorrect="on" autocapitalize="words">
      </div>
      <div class="input-group" style="text-align:left;">
        <label>Apellidos</label>
        <input type="text" id="reg-lastname" class="input-field" placeholder="Apellidos Completos" autocomplete="family-name" spellcheck="true" autocorrect="on" autocapitalize="words">
      </div>
    </div>

    <div class="input-group">
      <label>Número de Cédula</label>
      <input type="text" id="cedula" class="input-field" placeholder="1712345678" maxlength="10" inputmode="numeric">
      <div id="cedula-feedback" style="font-size: 0.75rem; margin-top: 0.3rem; text-align: left; min-height: 1.1rem;"></div>
    </div>

    <div class="input-group">
      <label>Nacionalidad</label>
      <input type="text" id="reg-nationality" class="input-field" placeholder="Ecuatoriana" autocomplete="country-name" spellcheck="true" autocorrect="on" autocapitalize="words">
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

        <div style="margin: 1rem 0; display:flex; align-items:center; gap:0.8rem;">
          <div style="flex:1; height:1px; background:rgba(255,255,255,0.1);"></div>
          <span style="font-size:0.7rem; color:var(--text-dim); white-space:nowrap;">o regístrate con</span>
          <div style="flex:1; height:1px; background:rgba(255,255,255,0.1);"></div>
        </div>
        <button id="google-signup-btn" type="button" style="width:100%; padding:0.75rem; background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.12); border-radius:8px; color:#e8eaed; font-size:0.875rem; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:0.75rem; transition:background 0.2s; font-family:inherit; margin-bottom:0.5rem;">
          <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg"><path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/><path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/><path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/><path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z" fill="#EA4335"/></svg>
          Registrarse con Google
        </button>
        <div style="margin-top: 1rem; margin-bottom: 0.5rem; padding: 0.8rem; border: 1px solid rgba(197, 160, 89, 0.25); border-radius: 8px; background: rgba(197, 160, 89, 0.05); text-align: left;">
           <p style="margin: 0; font-size: 0.7rem; color: #4ade80; display: flex; align-items: center; gap: 0.5rem; font-weight: 600;">
              <span>🛡️</span> PROTECCIÓN DE DATOS (LOPDP)
           </p>
           <p style="margin: 0.3rem 0 0; font-size: 0.62rem; color: var(--text-dim); line-height: 1.4;">
              Conforme a la Ley Orgánica de Protección de Datos Personales (LOPDP), sus datos serán tratados de forma estrictamente confidencial por David Flores G. y con la única finalidad de generar su hoja de vida profesional.
           </p>
        </div>
      </div>
    </div>

    <button id="auth-submit-btn" class="btn-primary" style="width: 100%; margin-top: 1rem; letter-spacing: 1px;" disabled>
      COMPLETAR REGISTRO
    </button>

    <p style="margin-top:1rem; font-size:0.7rem; color:var(--text-dim); line-height:1.5;">
      Al registrarte, aceptas nuestra
      <a href="#" id="privacy-policy-link" style="color:var(--primary); text-decoration:underline;">Política de Privacidad</a>.
      Tus datos se usan exclusivamente para generar tu hoja de vida profesional.
    </p>

    <div style="margin-top: 0.8rem; font-size: 0.85rem; color: var(--text-dim);">
      ¿Ya tienes cuenta? <a href="#" id="toggle-auth" data-mode="login" style="color: var(--primary); font-weight: 600; text-decoration: none;">Iniciar Sesión</a>
    </div>
  </div>
</div>
`;

// ─── EXPORT ───────────────────────────────────────────────────────────────────
export const AuthView = (mode = 'login') => mode === 'login' ? LoginView() : RegisterView();

// ─── LISTENERS ───────────────────────────────────────────────────────────────
export const attachAuthListeners = (currentMode, onToggle, onSubmit, onForgotPassword, onGoogleSignIn) => {
  const toggleBtn = document.querySelector('#toggle-auth');
  const submitBtn = document.querySelector('#auth-submit-btn');
  const forgotBtn = document.querySelector('#forgot-password-link');

  toggleBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    onToggle(e.target.dataset.mode);
  });

  forgotBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    const email = document.querySelector('#email')?.value?.trim() || '';
    onForgotPassword(email);
  });

  // Privacy Policy link (register view only)
  document.querySelector('#privacy-policy-link')?.addEventListener('click', (e) => {
    e.preventDefault();
    showPrivacyPolicy();
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
          credentialsSection.style.maxHeight = '520px';
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

    // Google Sign-Up — disponible solo tras cédula válida
    document.querySelector('#google-signup-btn')?.addEventListener('click', () => {
      const firstName = document.querySelector('#reg-firstname')?.value?.trim() || '';
      const lastName  = document.querySelector('#reg-lastname')?.value?.trim()  || '';
      const cedula    = document.querySelector('#cedula')?.value || '';
      const nationality = document.querySelector('#reg-nationality')?.value?.trim() || 'Ecuatoriana';
      const fullName  = `${firstName} ${lastName}`.trim();
      if (!fullName) {
        const btn = document.querySelector('#google-signup-btn');
        const msg = document.createElement('p');
        msg.style.cssText = 'color:#f87171;font-size:0.72rem;margin:0.4rem 0 0;text-align:center;';
        msg.textContent = 'Ingresa tus nombres y apellidos primero.';
        btn?.insertAdjacentElement('afterend', msg);
        setTimeout(() => msg?.remove(), 3000);
        return;
      }
      if (onGoogleSignIn) onGoogleSignIn({ fullName, cedula, nationality });
    });

  } else {
    // LOGIN: simple email + password
    submitBtn?.addEventListener('click', () => {
      const email = document.querySelector('#email')?.value?.trim() || '';
      const password = document.querySelector('#password')?.value || '';
      onSubmit(currentMode, email, password);
    });

    // Google Sign-In (login) — sin datos extra, el perfil ya existe
    document.querySelector('#google-signin-btn')?.addEventListener('click', () => {
      if (onGoogleSignIn) onGoogleSignIn(null);
    });
  }
};
