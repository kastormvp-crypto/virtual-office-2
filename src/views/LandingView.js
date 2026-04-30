/**
 * LandingView — Pantalla de bienvenida para usuarios nuevos
 * Completamente responsive para móvil, tablet y escritorio.
 */
export const LandingView = () => `
<div class="animate-fade" id="landing-root" style="min-height:100vh; background:#0a0b10; display:flex; flex-direction:column; font-family:'Inter',sans-serif; overflow-y:auto;">

  <style>
    #landing-root { box-sizing:border-box; }
    #landing-header { padding: clamp(0.8rem,3vw,1.2rem) clamp(1rem,5vw,2rem); }
    #landing-hero { padding: clamp(2rem,8vh,5rem) clamp(1rem,6vw,3rem) clamp(1.5rem,5vh,3rem); }
    #landing-badge { font-size: clamp(0.6rem,2vw,0.75rem); }
    #landing-headline { font-size: clamp(1.9rem,6vw,3.5rem); }
    #landing-sub { font-size: clamp(0.85rem,2.5vw,1.05rem); max-width: min(520px, 90vw); }
    #landing-cta-group { width:100%; max-width: min(340px, 90vw); }
    #landing-features { padding: clamp(1rem,4vw,2rem) clamp(1rem,5vw,2rem) clamp(2rem,6vh,4rem); }
    #landing-grid { grid-template-columns: repeat(auto-fit, minmax(min(200px,100%), 1fr)); gap: clamp(0.7rem,2vw,1.2rem); }
    #landing-footer { padding: clamp(0.8rem,2vh,1.2rem) 1rem; }
    .landing-card { padding: clamp(0.9rem,3vw,1.3rem) !important; }
    #landing-register-btn { padding: clamp(0.75rem,2.5vw,0.95rem) !important; font-size: clamp(0.85rem,2.5vw,1rem) !important; }
    #landing-login-btn-2 { padding: clamp(0.6rem,2vw,0.8rem) !important; font-size: clamp(0.78rem,2vw,0.88rem) !important; }
    @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
  </style>

  <!-- HEADER -->
  <header id="landing-header" style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid rgba(197,160,89,0.1); flex-shrink:0;">
    <div id="landing-logo" style="display:flex; flex-direction:column; align-items:center; gap:0.2rem;">
      <img src="/icon.png" alt="Logo" style="width:clamp(32px,6vw,42px); height:clamp(32px,6vw,42px); border-radius:8px; flex-shrink:0;">
      <span style="color:var(--primary); font-weight:700; font-size:clamp(0.65rem,2vw,0.8rem); letter-spacing:2px; white-space:nowrap; text-transform:uppercase;">Tu Hoja de Vida al Instante</span>
    </div>
    <button id="landing-login-btn" style="background:none; border:1px solid rgba(197,160,89,0.4); color:var(--primary); padding:clamp(0.35rem,1.5vw,0.5rem) clamp(0.7rem,2.5vw,1.1rem); border-radius:6px; font-size:clamp(0.7rem,2vw,0.82rem); cursor:pointer; font-family:'Inter',sans-serif; white-space:nowrap; flex-shrink:0;">
      Iniciar Sesión
    </button>
  </header>

  <!-- HERO -->
  <section id="landing-hero" style="flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center;">

    <div id="landing-badge" style="display:inline-flex; align-items:center; gap:0.4rem; background:rgba(197,160,89,0.08); border:1px solid rgba(197,160,89,0.25); padding:0.35rem 0.9rem; border-radius:20px; margin-bottom:clamp(1rem,4vh,1.8rem);">
      <span style="width:6px; height:6px; background:#4ade80; border-radius:50%; display:inline-block; animation:pulse 2s infinite; flex-shrink:0;"></span>
      <span style="color:var(--primary); letter-spacing:1px; font-weight:600; white-space:nowrap;">OFERTA DE LANZAMIENTO · SOLO $1.00</span>
    </div>

    <h1 id="landing-headline" style="font-weight:700; line-height:1.1; margin:0 0 clamp(0.8rem,3vh,1.2rem); max-width:min(700px,95vw);">
      <span style="color:#ffffff;">Tu Hoja de Vida Profesional</span><br>
      <span style="background:linear-gradient(90deg,#c5a059,#f0d080,#c5a059); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;">por solo $1.00</span>
    </h1>

    <p id="landing-sub" style="color:#a0a0b0; line-height:1.6; margin:0 0 clamp(1.5rem,5vh,2.8rem); text-align:center;">
      Diseña un CV profesional con formato ATS en minutos. Descárgalo en PDF y compártelo por WhatsApp. Pago único, acceso de por vida.
    </p>

    <div id="landing-cta-group" style="display:flex; flex-direction:column; gap:0.75rem;">
      <button id="landing-register-btn" class="btn-primary" style="width:100%; font-weight:700; letter-spacing:1px; border-radius:10px;">
        ✨ EMPEZAR MI CV AHORA
      </button>
      <button id="landing-login-btn-2" style="width:100%; background:transparent; border:1px solid rgba(255,255,255,0.12); color:#a0a0b0; border-radius:10px; cursor:pointer; font-family:'Inter',sans-serif;">
        Ya tengo cuenta — Iniciar sesión
      </button>
    </div>

  </section>

  <!-- FEATURES -->
  <section id="landing-features" style="max-width:900px; margin:0 auto; width:100%; box-sizing:border-box;">
    <div id="landing-grid" style="display:grid;">

      <div class="glass landing-card" style="border-top:2px solid var(--primary); text-align:left;">
        <div style="font-size:clamp(1.4rem,4vw,1.8rem); margin-bottom:0.4rem;">📄</div>
        <h3 style="color:#fff; font-size:clamp(0.85rem,2.5vw,0.95rem); margin:0 0 0.3rem;">7 Diseños Ejecutivos</h3>
        <p style="color:var(--text-dim); font-size:clamp(0.72rem,2vw,0.78rem); margin:0; line-height:1.5;">Standard, Minimalista, Harvard, Startup y más. Cambia el estilo con un toque.</p>
      </div>

      <div class="glass landing-card" style="border-top:2px solid #4ade80; text-align:left;">
        <div style="font-size:clamp(1.4rem,4vw,1.8rem); margin-bottom:0.4rem;">⚡</div>
        <h3 style="color:#fff; font-size:clamp(0.85rem,2.5vw,0.95rem); margin:0 0 0.3rem;">Listo en Minutos</h3>
        <p style="color:var(--text-dim); font-size:clamp(0.72rem,2vw,0.78rem); margin:0; line-height:1.5;">Cuestionario guiado con asistencia de IA. Sin conocimientos técnicos necesarios.</p>
      </div>

      <div class="glass landing-card" style="border-top:2px solid #60a5fa; text-align:left;">
        <div style="font-size:clamp(1.4rem,4vw,1.8rem); margin-bottom:0.4rem;">📱</div>
        <h3 style="color:#fff; font-size:clamp(0.85rem,2.5vw,0.95rem); margin:0 0 0.3rem;">Desde tu Celular</h3>
        <p style="color:var(--text-dim); font-size:clamp(0.72rem,2vw,0.78rem); margin:0; line-height:1.5;">App instalable en Android e iOS. Funciona sin conexión una vez cargada.</p>
      </div>

      <div class="glass landing-card" style="border-top:2px solid #a78bfa; text-align:left;">
        <div style="font-size:clamp(1.4rem,4vw,1.8rem); margin-bottom:0.4rem;">🔒</div>
        <h3 style="color:#fff; font-size:clamp(0.85rem,2.5vw,0.95rem); margin:0 0 0.3rem;">Datos Protegidos</h3>
        <p style="color:var(--text-dim); font-size:clamp(0.72rem,2vw,0.78rem); margin:0; line-height:1.5;">Tu información cifrada y privada. Solo tú tienes acceso a tu hoja de vida.</p>
      </div>

    </div>
  </section>

  <!-- FOOTER -->
  <footer id="landing-footer" style="text-align:center; border-top:1px solid rgba(255,255,255,0.05); flex-shrink:0;">
    <p style="color:var(--text-dim); font-size:clamp(0.65rem,1.8vw,0.75rem); margin:0;">
      © 2026 Tu Hoja de Vida ·
      <a href="#" id="landing-privacy-link" style="color:var(--primary); text-decoration:none;">Política de Privacidad</a>
    </p>
  </footer>

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
