import '../carousel.css';
import { initHologramCarousel } from '../carousel.js';

/**
 * LandingView — Versión con Guía de Instalación PWA
 */
export const LandingView = () => `
<div class="animate-fade premium-bg-light" id="landing-root" style="min-height:100vh; font-family:'Inter',sans-serif; display:flex; flex-direction:column;">

  <style>
    body {
      background: var(--bg-surface);
    }
    
    #landing-root { 
      font-family: 'Outfit', sans-serif; 
      min-height: 100vh;
      background: transparent;
      /* Prevenir selección de texto y marcas azules */
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
      -webkit-tap-highlight-color: transparent;
    }
    
    .hero-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: clamp(1rem, 5vh, 2rem) 1.5rem; /* Hyper-compact padding */
      max-width: 1200px;
      margin: 0 auto;
    }

    .hero-title {
      font-size: clamp(2.2rem, 8vw, 4.5rem);
      font-weight: 700;
      line-height: 1.1;
      min-height: 2.2em; /* Prevents layout jumps when text changes */
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 0.2rem; /* Much tighter */
      color: var(--text-main);
      letter-spacing: -1px;
      transition: opacity 0.5s ease-in-out;
    }
    
    .hero-title.fade-out {
      opacity: 0;
    }
    
    @media (max-width: 480px) {
      .hero-title {
        min-height: 3.3em; /* Bloqueamos altura para hasta 3 líneas seguras en celular sin saltos */
      }
    }

    .hero-subtitle {
      font-size: clamp(1rem, 3vw, 1.25rem);
      color: var(--text-dim);
      max-width: 700px;
      margin-bottom: 0.5rem; /* Much tighter */
      line-height: 1.6;
    }

    .hero-image-container {
      position: relative;
      width: 100%;
      max-width: 900px;
      margin-top: 1rem;
      border-radius: 20px;
      overflow: hidden;
      /* Sombra limpia */
      box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
      border: 1px solid rgba(0, 0, 0, 0.1);
      background: #ffffff;
      backdrop-filter: blur(20px);
      transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.4s ease;
    }
    .hero-image-container:hover {
      transform: scale(1.02);
      box-shadow: 0 25px 50px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.05);
    }

    .cta-group {
      display: flex;
      gap: 1rem;
      width: 100%;
      max-width: 480px;
      margin-bottom: 2rem;
    }

    /* SECCIÓN INSTALACIÓN */
    .install-section {
      background: var(--bg-surface);
      padding: 2rem 1.5rem; /* Reduced padding */
      margin-top: 1rem;
      border-top: 1px solid var(--border-glass);
    }
    
    @media (min-width: 800px) {
      .install-section {
        display: none !important;
      }
    }

    .install-grid {
      display: grid;
      grid-template-columns: 1fr 1fr; /* Force horizontal alignment */
      gap: 1.5rem;
      max-width: 1000px;
      margin: 1.5rem auto 0;
    }
    
    @media (max-width: 600px) {
      .install-grid { gap: 0.8rem; }
    }

    @keyframes floatForward {
      0% { transform: translateY(0) scale(1); box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05); }
      50% { transform: translateY(-8px) scale(1.02); box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08); }
      100% { transform: translateY(0) scale(1); box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05); }
    }

    .install-card {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      padding: clamp(1rem, 3vw, 1.5rem); /* Tighter padding */
      border-radius: 20px;
      border: 1px solid rgba(0, 0, 0, 0.08);
      /* 3D Floating animation */
      animation: floatForward 4s ease-in-out infinite;
      text-align: left;
    }
    .install-card h4 {
      color: var(--text-main);
      margin: 0 0 1rem;
      font-size: clamp(0.9rem, 3vw, 1.1rem); /* Adaptive font size */
      font-weight: 700;
    }

    .install-step {
      display: flex;
      align-items: center;
      gap: 8px; /* Tighter gap */
      margin-bottom: 0.8rem;
      font-size: clamp(0.75rem, 2.5vw, 0.9rem);
      color: var(--text-dim);
    }
    
    @keyframes pulseHorizontal {
      0% { transform: translateX(0); opacity: 1; }
      50% { transform: translateX(5px); opacity: 0.8; }
      100% { transform: translateX(0); opacity: 1; }
    }

    .step-number {
      background: var(--primary);
      color: #ffffff;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      display: grid;
      place-items: center;
      font-weight: 700;
      font-size: 0.75rem;
      flex-shrink: 0;
      animation: pulseHorizontal 2s infinite cubic-bezier(0.4, 0, 0.2, 1);
    }

    /* SECCIÓN PLAN SOCIO */
    .socio-section {
      background: transparent; /* Changed to match global background */
      padding: 4rem 1.5rem 2rem; /* Added 4rem top padding for mobile */
      border-bottom: 1px solid var(--border-glass);
    }
    @media (min-width: 800px) {
      .socio-section {
        padding-top: 6rem; /* Push down more on desktop to avoid carousel overlap */
      }
    }
    .socio-card {
      max-width: 860px;
      margin: 0 auto;
      background: #ffffff;
      backdrop-filter: blur(20px);
      border: 1px solid rgba(0, 0, 0, 0.1);
      border-radius: 24px;
      padding: clamp(1.5rem, 4vw, 2.5rem); /* Tighter padding */
      position: relative;
      overflow: hidden;
      /* Sombra limpia */
      box-shadow: 0 15px 35px rgba(0, 0, 0, 0.06);
      transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.4s ease;
    }
    
    .socio-layout {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }
    @media (min-width: 800px) {
      .socio-layout {
        grid-template-columns: 1.2fr 0.8fr;
        align-items: center;
      }
    }
    .socio-card:hover {
      transform: scale(1.02);
      box-shadow: 0 25px 50px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.05);
    }
    
    .socio-badge {
      display: inline-block;
      background: rgba(0, 113, 227, 0.1);
      border: 1px solid rgba(0, 113, 227, 0.2);
      color: #0071e3;
      font-size: 0.7rem;
      font-weight: 700;
      letter-spacing: 2px;
      text-transform: uppercase;
      padding: 0.4rem 1rem;
      border-radius: 100px;
      margin-bottom: 1rem; /* Tighter margin */
    }
    .socio-benefits {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); /* Narrower minmax for 3 cols */
      gap: 0.8rem; /* Tighter gap */
      margin: 1.5rem 0; /* Tighter margin */
    }
    .benefit-item {
      display: flex;
      align-items: flex-start;
      gap: 0.6rem; /* Tighter */
      font-size: 0.85rem; /* Smaller font */
      color: var(--text-main);
      line-height: 1.3;
    }
    .benefit-icon {
      font-size: 1.1rem;
      flex-shrink: 0;
    }
    .socio-cta-group {
      display: flex;
      gap: 0.8rem; /* Tighter */
      flex-direction: column; /* Stack buttons in right column */
      margin-top: 1rem;
    }
    .btn-socio-primary, .btn-socio-secondary, .btn-outline {
      flex: 1;
      min-width: 200px;
      padding: 1rem 1.5rem;
      border-radius: 50px;
      font-weight: 700;
      font-size: 0.95rem;
      cursor: pointer;
      background: #0071e3;
      color: #ffffff;
      border: none;
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      text-transform: uppercase;
      letter-spacing: 1px;
      position: relative;
      overflow: hidden;
      z-index: 1;
    }
    .btn-socio-primary {
      animation: pulseForwardPrimary 3s infinite cubic-bezier(0.4, 0, 0.2, 1);
      animation-delay: 1.5s; /* Staggered from main hero button */
    }
    .btn-outline {
      background: #ffffff;
      color: #1d1d1f;
      border: 1px solid rgba(0, 0, 0, 0.15);
      animation: pulseForwardOutline 3s infinite cubic-bezier(0.4, 0, 0.2, 1);
      animation-delay: 1.5s; /* Staggered from main hero button */
    }

    .btn-socio-primary:hover, .btn-socio-secondary:hover, .btn-outline:hover { 
      animation-play-state: paused;
      transform: scale(1.03); 
    }
    
    .btn-socio-primary:hover {
      background: #005bb5;
      box-shadow: 0 15px 35px rgba(0, 113, 227, 0.3);
    }
    
    .btn-outline:hover {
      background: #f5f5f7;
      box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
    }

    .btn-socio-primary:active, .btn-socio-secondary:active, .btn-outline:active {
      transform: scale(0.98);
    }

    @media (max-width: 480px) {
      .cta-group { flex-direction: column; }
      .socio-cta-group { flex-direction: column; }
    }
    
    @keyframes pulseForwardPrimary {
      0%, 100% {
        transform: scale(1);
        box-shadow: 0 5px 15px rgba(0, 113, 227, 0.2);
      }
      50% {
        transform: scale(1.05);
        box-shadow: 0 15px 30px rgba(0, 113, 227, 0.4);
      }
    }
    
    @keyframes pulseForwardOutline {
      0%, 100% {
        transform: scale(1);
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
      }
      50% {
        transform: scale(1.05);
        box-shadow: 0 15px 30px rgba(0, 0, 0, 0.12);
      }
    }
  </style>


  <!-- MAIN HERO -->
  <main class="hero-container">
    <h1 class="hero-title">Crea, Edita y Descarga <br> Ilimitadamente</h1>
    <p class="hero-subtitle">Diseña un Hoja de Vida profesional con formato para filtros de seleccion (ATS) en minutos. Solo por $1 accedes ilimitadamente a uso de nuestra plataforma.</p>
    
    <div class="cta-group">
      <button id="landing-register-btn" class="btn-primary" style="flex: 1; text-transform: uppercase; font-weight: 700; letter-spacing: 0.05em;">CREAR MI CUENTA</button>
      <button id="landing-login-btn" class="btn-primary" style="flex: 1; text-transform: uppercase; font-weight: 700; letter-spacing: 0.05em;">INICIAR SESIÓN</button>
    </div>

    <div class="eyebrow">Elige tu plantilla</div>
    <div class="stage">
      <div class="floor"></div>
      <div class="ring-scaler">
        <div class="ring" id="ring"></div>
      </div>
      <div class="dots" id="dots"></div>
    </div>
  </main>

  <!-- SECCIÓN PLAN SOCIO -->
  <section class="socio-section">
    <div class="socio-card">
      <div class="socio-layout">
        <!-- Izquierda: Info y Beneficios -->
        <div>
          <div style="display:flex; flex-direction:column; align-items:flex-start; text-align:left;">
            <span class="socio-badge">💼 Plan Socio — Para Negocios</span>
            <h2 style="font-size:clamp(1.5rem,4vw,2.2rem); font-weight:700; margin:0 0 0.5rem; line-height:1.15; color:var(--text-main);">
              ¿Tienes un local de Servicios?
            </h2>
            <p style="color:var(--text-dim); font-size:0.9rem; line-height:1.5; margin:0 0 1.5rem;">
              Ideal para Cibercafés, Imprentas y Secretarías. Ofrece hojas de vida profesionales a tus clientes con un solo pago mensual.
            </p>
          </div>

          <div class="socio-benefits">
            <div class="benefit-item"><span class="benefit-icon">✅</span><span><strong>CVs ilimitados</strong> para clientes.</span></div>
            <div class="benefit-item"><span class="benefit-icon">🎨</span><span><strong>10 estilos profesionales</strong> disponibles.</span></div>
            <div class="benefit-item"><span class="benefit-icon">📄</span><span><strong>Descarga en PDF</strong> alta calidad.</span></div>
            <div class="benefit-item"><span class="benefit-icon">🚀</span><span><strong>Panel exclusivo</strong> para negocios.</span></div>
          </div>
        </div>

        <!-- Derecha: Precio y Botones -->
        <div style="display: flex; flex-direction: column; gap: 1rem; justify-content: center;">
          <div style="background:#f5f5f7; border:1px solid rgba(0,0,0,0.1); border-radius:16px; padding:1.2rem; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:1rem;">
            <div>
              <p style="margin:0; font-size:0.7rem; color:#475569; text-transform:uppercase; letter-spacing:1px;">Pago mensual</p>
              <p style="margin:0.2rem 0 0; font-size:2.5rem; font-weight:800; color:#1d1d1f; line-height:1;">$10<span style="font-size:1rem; font-weight:400; color:#475569;">/mes</span></p>
            </div>
            <div style="font-size:0.75rem; color:#475569; text-align:right;">
              <p style="margin:0;">Equivale a cobrar</p>
              <p style="margin:0.1rem 0 0; font-size:1.1rem; font-weight:700; color:#1d1d1f;">$2/cliente</p>
            </div>
          </div>

          <div class="socio-cta-group">
            <button id="socio-payphone-btn" class="btn-primary" style="flex: 1; display: flex; align-items: center; justify-content: center; gap: 0.6rem; text-transform: uppercase; font-weight: 700; letter-spacing: 0.05em;">
              <span style="font-size: 1.2rem; line-height: 1;">💳</span>
              <span>Tarjeta — $10</span>
            </button>
            <button id="socio-transfer-btn" class="btn-primary" style="flex: 1; display: flex; align-items: center; justify-content: center; gap: 0.6rem; text-transform: uppercase; font-weight: 700; letter-spacing: 0.05em;">
              <span style="font-size: 1.2rem; line-height: 1;">🏦</span>
              <span>Transferencia</span>
            </button>
          </div>
          <div id="pp-socio-btn-container" style="margin-top:0.5rem;"></div>
        </div>
      </div>
    </div>
  </section>

  <!-- SECCIÓN INSTALACIÓN -->
  <section class="install-section">
    <h2 style="text-align:center; font-size:1.8rem; margin:0; color:var(--text-main);">Instálala en tu Celular</h2>
    <p style="text-align:center; color:var(--text-dim); font-size:0.95rem; margin-top:0.5rem;">Acceso directo sin ocupar espacio en tu memoria.</p>
    
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

  <footer style="padding: 3rem 1rem; text-align:center; border-top: 1px solid var(--border-glass); background: var(--bg-surface); margin-top:auto;">
    <p style="margin-bottom: 0.8rem; color: var(--text-dim); font-weight: 600; letter-spacing: 1.5px; font-size: 1rem;">www.tuhojadevida.com</p>
    <p style="color: var(--text-dim); font-size: 0.75rem; letter-spacing: 1px;">Todos los derechos reservados ®</p>
  </footer>

</div>
`;;

export const attachLandingListeners = (onRegister, onLogin, onSocioPayPhone, onSocioTransfer) => {
  document.querySelector('#landing-register-btn')?.addEventListener('click', onRegister);
  document.querySelector('#landing-login-btn')?.addEventListener('click', onLogin);
  document.querySelector('#socio-payphone-btn')?.addEventListener('click', onSocioPayPhone);
  document.querySelector('#socio-transfer-btn')?.addEventListener('click', onSocioTransfer);
  const cvTemplates = [
    { url: '/cv-templates/Harvard Clasic.webp', label: 'HARVARD CLASIC' },
    { url: '/cv-templates/Harvad Navy.webp', label: 'HARVAD NAVY' },
    { url: '/cv-templates/Minimalist.webp', label: 'MINIMALIST' },
    { url: '/cv-templates/Moder Side.webp', label: 'MODERN SIDE' },
    { url: '/cv-templates/Recien Graduado.webp', label: 'RECIÉN GRADUADO' },
    { url: '/cv-templates/Royal Navy.webp', label: 'ROYAL NAVY' },
    { url: '/cv-templates/Standard.webp', label: 'STANDARD' },
    { url: '/cv-templates/Start Up.webp', label: 'START UP' },
    { url: '/cv-templates/Carbon Gray_page-0001.webp', label: 'CARBON GRAY' },
    { url: '/cv-templates/Creative_page-0001.webp', label: 'CREATIVE' },
    { url: '/cv-templates/Dark Gold_page-0001.webp', label: 'DARK GOLD' }
  ];
  
  // Wait a micro-tick to ensure DOM is fully painted if needed, but it should be synchronous in main.js
  setTimeout(() => {
    initHologramCarousel(cvTemplates);
    
    // Rotating Title Logic
    const titleEl = document.querySelector('.hero-title');
    if (titleEl) {
      const phrases = [
        "Crea, Edita y Descarga <br> Ilimitadamente",
        "Tenemos 11 Estilos de <br> Formatos Profesionales",
        "Solo Por $1 Tienes <br> Acceso Total",
        "Aceptamos Pagos con Tarjetas <br> y Transferencias"
      ];
      let currentPhrase = 0;
      
      setInterval(() => {
        titleEl.classList.add('fade-out');
        setTimeout(() => {
          currentPhrase = (currentPhrase + 1) % phrases.length;
          titleEl.innerHTML = phrases[currentPhrase];
          titleEl.classList.remove('fade-out');
        }, 500); // Wait for fade out to complete
      }, 5000);
    }
  }, 0);
};
