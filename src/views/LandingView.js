/**
 * LandingView — Rediseño Premium con Enfoque en Conversión
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
      padding: clamp(2rem, 10vh, 5rem) 1.5rem;
      max-width: 1200px;
      margin: 0 auto;
      flex: 1;
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
      margin-bottom: 3rem;
      line-height: 1.6;
    }

    .hero-image-container {
      position: relative;
      width: 100%;
      max-width: 900px;
      margin-top: 2rem;
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 20px 50px rgba(0,0,0,0.5), 0 0 20px rgba(197,160,89,0.1);
      border: 1px solid rgba(255,255,255,0.05);
    }

    .hero-image {
      width: 100%;
      display: block;
      transition: transform 0.5s ease;
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
    <p class="hero-subtitle">Diseña un CV profesional con formato ATS en minutos. Acceso de por vida a nuestras plantillas ejecutivas por solo $1.00.</p>
    
    <div class="cta-group">
      <button id="landing-register-btn" class="btn-main btn-create">Crear mi Cuenta</button>
      <button id="landing-login-btn" class="btn-main btn-login">Iniciar Sesión</button>
    </div>

    <div class="hero-image-container">
      <img src="/all-styles.png" class="hero-image" alt="Galería de Estilos de Hoja de Vida Profesionales">
    </div>
  </main>

  <footer style="padding: 3rem 1rem; text-align:center; border-top: 1px solid rgba(255,255,255,0.03); background: rgba(0,0,0,0.3);">
    <p style="margin-bottom: 0.8rem; color: #C0C0C0; font-weight: 600; letter-spacing: 1.5px; font-size: 1rem;">WWW.TUHOJADEVIDA.COM</p>
    <p style="color: #606070; font-size: 0.75rem; letter-spacing: 1px;">Todos los derechos reservados ®</p>
  </footer>

</div>
`;

export const attachLandingListeners = (onRegister, onLogin) => {
  document.querySelector('#landing-register-btn')?.addEventListener('click', onRegister);
  document.querySelector('#landing-login-btn')?.addEventListener('click', onLogin);
};
