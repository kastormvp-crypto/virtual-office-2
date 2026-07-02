/**
 * LandingView — Versión con Guía de Instalación PWA
 */
export const LandingView = () => `
<div class="animate-fade" id="landing-root" style="min-height:100vh; background:#0a0b10; color:#fff; font-family:'Inter',sans-serif; display:flex; flex-direction:column;">

  <style>
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

    /* SECCIÓN PLAN SOCIO */
    .socio-section {
      background: linear-gradient(180deg, rgba(197,160,89,0.04) 0%, rgba(0,0,0,0) 100%);
      padding: 5rem 1.5rem;
      border-top: 1px solid rgba(197,160,89,0.12);
      border-bottom: 1px solid rgba(197,160,89,0.08);
    }
    .socio-card {
      max-width: 860px;
      margin: 0 auto;
      background: rgba(255,255,255,0.02);
      border: 1px solid rgba(197,160,89,0.25);
      border-radius: 24px;
      padding: clamp(2rem, 5vw, 3.5rem);
      position: relative;
      overflow: hidden;
    }
    .socio-card::before {
      content: '';
      position: absolute;
      top: -80px; right: -80px;
      width: 300px; height: 300px;
      background: radial-gradient(circle, rgba(197,160,89,0.08) 0%, transparent 70%);
      pointer-events: none;
    }
    .socio-badge {
      display: inline-block;
      background: rgba(197,160,89,0.15);
      border: 1px solid rgba(197,160,89,0.4);
      color: #c5a059;
      font-size: 0.7rem;
      font-weight: 700;
      letter-spacing: 2px;
      text-transform: uppercase;
      padding: 0.4rem 1rem;
      border-radius: 100px;
      margin-bottom: 1.5rem;
    }
    .socio-benefits {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 1rem;
      margin: 2rem 0;
    }
    .benefit-item {
      display: flex;
      align-items: flex-start;
      gap: 0.8rem;
      font-size: 0.88rem;
      color: #fff;
      line-height: 1.4;
    }
    .benefit-icon {
      font-size: 1.2rem;
      flex-shrink: 0;
      margin-top: 1px;
    }
    .socio-cta-group {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
      margin-top: 2.5rem;
    }
    .btn-socio-primary {
      flex: 1;
      min-width: 200px;
      padding: 1rem 1.5rem;
      border-radius: 12px;
      font-weight: 700;
      font-size: 0.9rem;
      cursor: pointer;
      border: none;
      background: linear-gradient(135deg, #c5a059, #e8c878);
      color: #000;
      letter-spacing: 0.5px;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .btn-socio-primary:hover { transform: translateY(-2px); box-shadow: 0 10px 30px rgba(197,160,89,0.3); }
    .btn-socio-secondary {
      flex: 1;
      min-width: 200px;
      padding: 1rem 1.5rem;
      border-radius: 12px;
      font-weight: 600;
      font-size: 0.9rem;
      cursor: pointer;
      background: none;
      border: 1px solid rgba(197,160,89,0.35);
      color: #c5a059;
      transition: background 0.2s;
    }
    .btn-socio-secondary:hover { background: rgba(197,160,89,0.08); }

    @media (max-width: 480px) {
      .cta-group { flex-direction: column; }
      .socio-cta-group { flex-direction: column; }
    }
  </style>


  <!-- MAIN HERO -->
  <main class="hero-container">
    <h1 class="hero-title">Crea, Edita y Descarga <br> Ilimitadamente</h1>
    <p class="hero-subtitle">Diseña un CV profesional con formato ATS en minutos. La herramienta preferida por ejecutivos en Ecuador. Acceso total por solo $1.00.</p>
    
    <div class="cta-group">
      <button id="landing-register-btn" style="flex: 1; padding: 1.1rem; border-radius: 12px; font-weight: 700; font-size: 0.95rem; cursor: pointer; text-transform: uppercase; letter-spacing: 1px; background: transparent; color: #fff; border: 1px solid rgba(56, 189, 248, 0.8); box-shadow: 0 0 10px rgba(56, 189, 248, 0.3); transition: box-shadow 0.3s ease;" onmouseover="this.style.boxShadow='0 0 20px rgba(56, 189, 248, 0.8)'" onmouseout="this.style.boxShadow='0 0 10px rgba(56, 189, 248, 0.3)'" ontouchstart="this.style.boxShadow='0 0 20px rgba(56, 189, 248, 0.8)'" ontouchend="this.style.boxShadow='0 0 10px rgba(56, 189, 248, 0.3)'">Crear mi Cuenta</button>
      <button id="landing-login-btn" style="flex: 1; padding: 1.1rem; border-radius: 12px; font-weight: 700; font-size: 0.95rem; cursor: pointer; text-transform: uppercase; letter-spacing: 1px; background: transparent; color: #fff; border: 1px solid rgba(56, 189, 248, 0.8); box-shadow: 0 0 10px rgba(56, 189, 248, 0.3); transition: box-shadow 0.3s ease;" onmouseover="this.style.boxShadow='0 0 20px rgba(56, 189, 248, 0.8)'" onmouseout="this.style.boxShadow='0 0 10px rgba(56, 189, 248, 0.3)'" ontouchstart="this.style.boxShadow='0 0 20px rgba(56, 189, 248, 0.8)'" ontouchend="this.style.boxShadow='0 0 10px rgba(56, 189, 248, 0.3)'">Iniciar Sesión</button>
    </div>

    <div class="hero-image-container">
      <img src="/all-styles.png" class="hero-image" alt="Galería de Estilos Profesionales" fetchpriority="high" width="900" height="450">
    </div>
  </main>

  <!-- SECCIÓN PLAN SOCIO -->
  <section class="socio-section">
    <div class="socio-card">
      <div style="display:flex; flex-direction:column; align-items:center; text-align:center;">
        <span class="socio-badge" style="color:#fff; border-color:rgba(255,255,255,0.4);">💼 Plan Socio — Para Negocios</span>
        <h2 style="font-size:clamp(1.8rem,5vw,2.8rem); font-weight:700; margin:0 0 1rem; line-height:1.15; color:#fff;">
          ¿Tienes un local de Servicios?
        </h2>
        <p style="color:#fff; font-size:0.95rem; line-height:1.65; max-width:600px; margin:0 auto;">
          Ideal para <strong>Cibercafés, Centros de Copiado, Imprentas y Secretarías</strong>. Ofrece hojas de vida profesionales a tus clientes todos los días, con un solo pago mensual.
        </p>
      </div>

      <div class="socio-benefits">
        <div class="benefit-item"><span class="benefit-icon">✅</span><span><strong>CVs ilimitados</strong> durante todo el mes para todos tus clientes.</span></div>
        <div class="benefit-item"><span class="benefit-icon">🎨</span><span>Acceso a los <strong>10 estilos profesionales</strong> Harvard, Moderno, Minimalista y más.</span></div>
        <div class="benefit-item"><span class="benefit-icon">📄</span><span><strong>Descarga en PDF</strong> de alta calidad lista para imprimir o enviar.</span></div>
        <div class="benefit-item"><span class="benefit-icon">🚀</span><span><strong>Panel exclusivo</strong> para gestionar clientes sin mezclar tus datos.</span></div>
        <div class="benefit-item"><span class="benefit-icon">🔄</span><span>Renueva fácilmente con <strong>tarjeta o transferencia</strong> cada mes.</span></div>
        <div class="benefit-item"><span class="benefit-icon">💬</span><span><strong>Soporte directo</strong> por WhatsApp cuando lo necesites.</span></div>
      </div>

      <div style="background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.15); border-radius:16px; padding:1.5rem; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:1rem;">
        <div>
          <p style="margin:0; font-size:0.75rem; color:#fff; text-transform:uppercase; letter-spacing:1px;">Pago único mensual</p>
          <p style="margin:0.2rem 0 0; font-size:3rem; font-weight:800; color:#fff; line-height:1;">$10<span style="font-size:1.2rem; font-weight:400; color:#fff;">/mes</span></p>
          <p style="margin:0.3rem 0 0; font-size:0.78rem; color:#fff;">Sin contratos. Cancela cuando quieras.</p>
        </div>
        <div style="font-size:0.8rem; color:#fff; text-align:right;">
          <p style="margin:0;">Equivale a cobrar solo</p>
          <p style="margin:0.2rem 0 0; font-size:1.3rem; font-weight:700; color:#fff;">$2 por cliente</p>
          <p style="margin:0; font-size:0.7rem;">si atiendes 5 clientes/mes</p>
        </div>
      </div>

      <div class="socio-cta-group" style="display: flex; flex-wrap: wrap; gap: 1rem; width: 100%; justify-content: center; margin-top: 2.5rem; box-sizing: border-box;">
        <button id="socio-payphone-btn" class="payment-block-btn" style="flex: 1; min-width: 200px; display: flex; align-items: center; justify-content: center; gap: 0.6rem; padding: 1rem 1.2rem; background: transparent; border: 1px solid rgba(255,255,255,0.8); border-radius: 12px; box-shadow: 0 0 15px rgba(255,255,255,0.4); cursor: pointer; transition: all 0.3s; box-sizing: border-box;" onmouseover="this.style.boxShadow='0 0 25px rgba(255,255,255,0.8)'; this.style.transform='translateY(-2px)';" onmouseout="this.style.boxShadow='0 0 15px rgba(255,255,255,0.4)'; this.style.transform='translateY(0)';">
          <span style="font-size: 1.5rem; line-height: 1;">💳</span>
          <span style="color: #fff; font-weight: 700; font-size: 0.95rem; letter-spacing: 0.5px; text-align: center;">Pagar con Tarjeta — $10</span>
        </button>
        <button id="socio-transfer-btn" class="payment-block-btn" style="flex: 1; min-width: 200px; display: flex; align-items: center; justify-content: center; gap: 0.6rem; padding: 1rem 1.2rem; background: transparent; border: 1px solid rgba(255,255,255,0.8); border-radius: 12px; box-shadow: 0 0 15px rgba(255,255,255,0.4); cursor: pointer; transition: all 0.3s; box-sizing: border-box;" onmouseover="this.style.boxShadow='0 0 25px rgba(255,255,255,0.8)'; this.style.transform='translateY(-2px)';" onmouseout="this.style.boxShadow='0 0 15px rgba(255,255,255,0.4)'; this.style.transform='translateY(0)';">
          <span style="font-size: 1.5rem; line-height: 1;">🏦</span>
          <span style="color: #fff; font-weight: 700; font-size: 0.95rem; letter-spacing: 0.5px; text-align: center;">Pagar por Transferencia</span>
        </button>
      </div>
      <!-- Contenedor donde PayPhone SDK renderiza su caja de pago -->
      <div id="pp-socio-btn-container" style="margin-top:1rem;"></div>
    </div>
  </section>

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
    <p style="margin-bottom: 0.8rem; color: #C0C0C0; font-weight: 600; letter-spacing: 1.5px; font-size: 1rem;">www.tuhojadevida.com</p>
    <p style="color: #606070; font-size: 0.75rem; letter-spacing: 1px;">Todos los derechos reservados ®</p>
  </footer>

</div>
`;

export const attachLandingListeners = (onRegister, onLogin, onSocioPayPhone, onSocioTransfer) => {
  document.querySelector('#landing-register-btn')?.addEventListener('click', onRegister);
  document.querySelector('#landing-login-btn')?.addEventListener('click', onLogin);
  document.querySelector('#socio-payphone-btn')?.addEventListener('click', onSocioPayPhone);
  document.querySelector('#socio-transfer-btn')?.addEventListener('click', onSocioTransfer);
};
