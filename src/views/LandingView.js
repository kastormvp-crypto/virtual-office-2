/**
 * LandingView — Versión con Guía de Instalación PWA
 */
export const LandingView = () => `
<div class="animate-fade" id="landing-root" style="min-height:100vh; background:#0a0b10; color:#fff; font-family:'Inter',sans-serif; display:flex; flex-direction:column;">

  <style>
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700&display=swap');
    
    #landing-root { font-family: 'Outfit', sans-serif; }
    
    .hero-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: clamp(2rem, 10vh, 4rem) 1.5rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .hero-title {
      font-size: clamp(2.2rem, 8vw, 4.5rem);
      font-weight: 700;
      line-height: 1.1;
      margin-bottom: 1.5rem;
      background: linear-gradient(135deg, #fff 0%, #c5a059 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .hero-subtitle {
      font-size: clamp(1rem, 3vw, 1.25rem);
      color: #a0a0b0;
      max-width: 700px;
      margin-bottom: 2.5rem;
      line-height: 1.6;
    }

    .hero-image-container {
      position: relative;
      width: 100%;
      max-width: 900px;
      margin-top: 1rem;
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 20px 50px rgba(0,0,0,0.5), 0 0 20px rgba(197,160,89,0.1);
      border: 1px solid rgba(255,255,255,0.05);
    }

    .hero-image {
      width: 100%;
      display: block;
    }

    .cta-group {
      display: flex;
      gap: 1rem;
      width: 100%;
      max-width: 480px;
      margin-bottom: 2rem;
    }

    .btn-main {
      flex: 1;
      padding: 1.1rem;
      border-radius: 12px;
      font-weight: 700;
      font-size: 0.95rem;
      cursor: pointer;
      border: none;
      transition: all 0.3s ease;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .btn-create {
      background: #c5a059;
      color: #000;
      box-shadow: 0 10px 20px rgba(197,160,89,0.2);
    }
    
    .btn-create:hover {
      transform: translateY(-3px);
      box-shadow: 0 15px 30px rgba(197,160,89,0.3);
    }

    .btn-login {
      background: rgba(255,255,255,0.05);
      color: #fff;
      border: 1px solid rgba(255,255,255,0.1);
    }

    .btn-login:hover {
      background: rgba(255,255,255,0.1);
    }

    /* SECCIÓN INSTALACIÓN */
    .install-section {
      background: rgba(255,255,255,0.02);
      padding: 4rem 1.5rem;
      margin-top: 2rem;
      border-top: 1px solid rgba(255,255,255,0.05);
    }

    .install-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 2rem;
      max-width: 1000px;
      margin: 2rem auto 0;
    }

    .install-card {
      background: rgba(255,255,255,0.03);
      padding: 2rem;
      border-radius: 16px;
      border: 1px solid rgba(255,255,255,0.05);
      text-align: left;
    }

    .install-card h4 {
      color: #c5a059;
      margin: 0 0 1rem;
      font-size: 1.1rem;
    }

    .install-step {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 1rem;
      font-size: 0.9rem;
      color: #d1d1d1;
    }

    .step-number {
      background: #c5a059;
      color: #000;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      display: grid;
      place-items: center;
      font-weight: 700;
      font-size: 0.75rem;
      flex-shrink: 0;
    }

    @media (max-width: 480px) {
      .cta-group { flex-direction: column; }
    }
  </style>

  <!-- NAVBAR -->
  <nav style="display:flex; justify-content:space-between; align-items:center; padding: 1.5rem clamp(1rem, 5vw, 2.5rem);">
    <div style="display:flex; align-items:center; gap:0.8rem;">
      <img src="/icon.png" style="width:40px; border-radius:8px;">
      <span style="font-weight:700; letter-spacing:1px; color:#c5a059; font-size:0.9rem;">TU HOJA DE VIDA</span>
    </div>
  </nav>

  <!-- MAIN HERO -->
  <main class="hero-container">
    <h1 class="hero-title">Crea, Edita y Descarga <br> Ilimitadamente</h1>
    <p class="hero-subtitle">Diseña un CV profesional con formato ATS en minutos. La herramienta preferida por ejecutivos en Ecuador. Acceso total por solo $1.00.</p>
    
    <div class="cta-group">
      <button id="landing-register-btn" class="btn-main btn-create">Crear mi Cuenta</button>
      <button id="landing-login-btn" class="btn-main btn-login">Iniciar Sesión</button>
    </div>

    <div class="hero-image-container">
      <img src="/all-styles.png" class="hero-image" alt="Galería de Estilos Profesionales">
    </div>
  </main>

  <!-- SECCIÓN INSTALACIÓN -->
  <section class="install-section">
    <h2 style="text-align:center; font-size:1.8rem; margin:0;">Instálala en tu Celular</h2>
    <p style="text-align:center; color:#a0a0b0; font-size:0.95rem; margin-top:0.5rem;">Acceso directo sin ocupar espacio en tu memoria.</p>
    
    <div class="install-grid">
      <!-- iPHONE -->
      <div class="install-card">
        <h4>En iPhone (Safari)</h4>
        <div class="install-step">
          <span class="step-number">1</span>
          <span>Toca el botón de <b>"Compartir"</b> <span style="font-size:1.2rem;">📤</span></span>
        </div>
        <div class="install-step">
          <span class="step-number">2</span>
          <span>Baja y toca en <b>"Añadir a Inicio"</b> <span style="font-size:1.2rem;">➕</span></span>
        </div>
      </div>

      <!-- ANDROID -->
      <div class="install-card">
        <h4>En Android (Chrome)</h4>
        <div class="install-step">
          <span class="step-number">1</span>
          <span>Toca el aviso de <b>"Instalar App"</b> al inicio.</span>
        </div>
        <div class="install-step">
          <span class="step-number">2</span>
          <span>O toca los <span style="font-size:1.2rem;">⋮</span> y elige <b>"Instalar Aplicación"</b>.</span>
        </div>
      </div>
    </div>
  </section>

  <footer style="padding: 3rem 1rem; text-align:center; border-top: 1px solid rgba(255,255,255,0.03); background: rgba(0,0,0,0.3); margin-top:auto;">
    <p style="margin-bottom: 0.8rem; color: #C0C0C0; font-weight: 600; letter-spacing: 1.5px; font-size: 1rem;">WWW.TUHOJADEVIDA.COM</p>
    <p style="color: #606070; font-size: 0.75rem; letter-spacing: 1px;">Todos los derechos reservados ®</p>
  </footer>

</div>
`;

export const attachLandingListeners = (onRegister, onLogin) => {
  document.querySelector('#landing-register-btn')?.addEventListener('click', onRegister);
  document.querySelector('#landing-login-btn')?.addEventListener('click', onLogin);
};
