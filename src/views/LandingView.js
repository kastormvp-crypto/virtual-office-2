/**
 * LandingView — Pantalla de bienvenida para usuarios nuevos
 * Solo se muestra cuando el usuario NO está autenticado.
 */
export const LandingView = () => `
<div class="animate-fade" style="min-height:100vh; background:#0a0b10; display:flex; flex-direction:column; font-family:'Inter',sans-serif; overflow-y:auto;">

  <!-- ══ HEADER ══════════════════════════════════════════════════════════ -->
  <header style="padding:1rem 1.5rem; display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid rgba(197,160,89,0.1);">
    <div style="display:flex; align-items:center; gap:0.7rem;">
      <img src="/icon.png" alt="Logo" style="width:36px; height:36px; border-radius:8px;">
      <span style="color:var(--primary); font-weight:700; font-size:1rem; letter-spacing:2px;">VIRTUAL OFFICE</span>
    </div>
    <button id="landing-login-btn" style="background:none; border:1px solid rgba(197,160,89,0.4); color:var(--primary); padding:0.45rem 1rem; border-radius:6px; font-size:0.8rem; cursor:pointer; font-family:'Inter',sans-serif;">
      Iniciar Sesión
    </button>
  </header>

  <!-- ══ HERO ════════════════════════════════════════════════════════════ -->
  <section style="flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; padding:3rem 1.5rem 2rem;">

    <!-- Badge -->
    <div style="display:inline-flex; align-items:center; gap:0.4rem; background:rgba(197,160,89,0.08); border:1px solid rgba(197,160,89,0.25); padding:0.35rem 0.9rem; border-radius:20px; margin-bottom:1.5rem;">
      <span style="width:6px; height:6px; background:#4ade80; border-radius:50%; display:inline-block; animation: pulse 2s infinite;"></span>
      <span style="font-size:0.7rem; color:var(--primary); letter-spacing:1px; font-weight:600;">100% GRATUITO · ACCESO INMEDIATO</span>
    </div>

    <!-- Main Headline -->
    <h1 style="font-size:clamp(2rem, 7vw, 3.5rem); font-weight:700; line-height:1.1; margin:0 0 1rem; max-width:700px;">
      <span style="color:#ffffff;">Crea tu Hoja de Vida</span><br>
      <span style="background: linear-gradient(90deg, #c5a059, #f0d080, #c5a059); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;">al Instante</span>
    </h1>

    <p style="color:#a0a0b0; font-size:clamp(0.9rem, 3vw, 1.1rem); max-width:520px; line-height:1.6; margin:0 0 2.5rem;">
      Diseña un CV profesional con formato ATS en minutos, desde tu celular. Descárgalo en PDF y compártelo directamente por WhatsApp.
    </p>

    <!-- CTA Buttons -->
    <div style="display:flex; flex-direction:column; gap:0.8rem; width:100%; max-width:320px;">
      <button id="landing-register-btn" class="btn-primary" style="width:100%; padding:0.9rem; font-size:1rem; font-weight:700; letter-spacing:1px; border-radius:10px;">
        ✨ CREAR MI CV GRATIS
      </button>
      <button id="landing-login-btn-2" style="width:100%; padding:0.75rem; background:transparent; border:1px solid rgba(255,255,255,0.12); color:#a0a0b0; border-radius:10px; font-size:0.85rem; cursor:pointer; font-family:'Inter',sans-serif;">
        Ya tengo cuenta — Iniciar sesión
      </button>
    </div>

  </section>

  <!-- ══ FEATURES ════════════════════════════════════════════════════════ -->
  <section style="padding:2rem 1.5rem 3rem; max-width:900px; margin:0 auto; width:100%;">

    <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:1rem;">

      <div class="glass" style="padding:1.2rem; border-top:2px solid var(--primary); text-align:left;">
        <div style="font-size:1.8rem; margin-bottom:0.5rem;">📄</div>
        <h3 style="color:#fff; font-size:0.95rem; margin:0 0 0.4rem;">7 Diseños Ejecutivos</h3>
        <p style="color:var(--text-dim); font-size:0.78rem; margin:0; line-height:1.5;">Standard, Minimalista, Harvard, Startup y más. Cambia el estilo con un toque.</p>
      </div>

      <div class="glass" style="padding:1.2rem; border-top:2px solid #4ade80; text-align:left;">
        <div style="font-size:1.8rem; margin-bottom:0.5rem;">⚡</div>
        <h3 style="color:#fff; font-size:0.95rem; margin:0 0 0.4rem;">Listo en Minutos</h3>
        <p style="color:var(--text-dim); font-size:0.78rem; margin:0; line-height:1.5;">Cuestionario guiado con asistencia de IA. Sin conocimientos técnicos necesarios.</p>
      </div>

      <div class="glass" style="padding:1.2rem; border-top:2px solid #60a5fa; text-align:left;">
        <div style="font-size:1.8rem; margin-bottom:0.5rem;">📱</div>
        <h3 style="color:#fff; font-size:0.95rem; margin:0 0 0.4rem;">Desde tu Celular</h3>
        <p style="color:var(--text-dim); font-size:0.78rem; margin:0; line-height:1.5;">App instalable en Android e iOS. Funciona sin conexión una vez cargada.</p>
      </div>

      <div class="glass" style="padding:1.2rem; border-top:2px solid #a78bfa; text-align:left;">
        <div style="font-size:1.8rem; margin-bottom:0.5rem;">🔒</div>
        <h3 style="color:#fff; font-size:0.95rem; margin:0 0 0.4rem;">Datos Protegidos</h3>
        <p style="color:var(--text-dim); font-size:0.78rem; margin:0; line-height:1.5;">Tu información cifrada y privada. Solo tú tienes acceso a tu hoja de vida.</p>
      </div>

    </div>

  </section>

  <!-- ══ FOOTER ══════════════════════════════════════════════════════════ -->
  <footer style="text-align:center; padding:1.2rem; border-top:1px solid rgba(255,255,255,0.05);">
    <p style="color:var(--text-dim); font-size:0.7rem; margin:0;">
      © 2025 Virtual Office · <a href="#" id="landing-privacy-link" style="color:var(--primary); text-decoration:none;">Política de Privacidad</a>
    </p>
  </footer>

  <style>
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.4; }
    }
  </style>
</div>
`;

export const attachLandingListeners = (onRegister, onLogin) => {
  document.getElementById('landing-register-btn')?.addEventListener('click', onRegister);
  document.getElementById('landing-login-btn')?.addEventListener('click', onLogin);
  document.getElementById('landing-login-btn-2')?.addEventListener('click', onLogin);

  document.getElementById('landing-privacy-link')?.addEventListener('click', async (e) => {
    e.preventDefault();
    const { showPrivacyPolicy } = await import('../components/PrivacyPolicy');
    showPrivacyPolicy();
  });
};
