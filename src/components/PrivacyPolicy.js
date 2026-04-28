export const PrivacyPolicyView = () => `
<div class="animate-fade" style="max-width: 800px; margin: 0 auto; padding: 2rem 1rem;">
  <div class="glass" style="padding: 2rem; border: 1px solid rgba(197,160,89,0.2);">
    
    <div style="text-align:center; margin-bottom: 2rem;">
      <img src="/icon.png" alt="Logo" style="width:50px; height:50px; border-radius:10px; margin-bottom:1rem;">
      <h1 style="color:var(--primary); font-size:1.4rem; margin:0 0 0.3rem; letter-spacing:2px;">POLÍTICA DE PRIVACIDAD</h1>
      <p style="color:var(--text-dim); font-size:0.75rem; margin:0;">Virtual Office — Última actualización: 27 de Abril 2026</p>
    </div>

    <div style="color:#e0e0e0; font-size:0.85rem; line-height:1.7;">

      <section style="margin-bottom:1.5rem;">
        <h2 style="color:var(--primary); font-size:1rem; border-bottom:1px solid rgba(197,160,89,0.2); padding-bottom:0.5rem;">1. Responsable del Tratamiento</h2>
        <p>La plataforma <strong>Virtual Office</strong>, de titularidad de <strong>David Flores G.</strong>, con domicilio en Ecuador, es responsable del tratamiento de sus datos personales conforme a la <strong>Ley Orgánica de Protección de Datos Personales del Ecuador (LOPDP)</strong>.</p>
        <p>Contacto: <a href="mailto:ks_mvp@icloud.com" style="color:var(--primary);">ks_mvp@icloud.com</a></p>
      </section>

      <section style="margin-bottom:1.5rem;">
        <h2 style="color:var(--primary); font-size:1rem; border-bottom:1px solid rgba(197,160,89,0.2); padding-bottom:0.5rem;">2. Datos que Recopilamos</h2>
        <p>Al registrarse y usar la plataforma, recopilamos los siguientes datos:</p>
        <ul style="padding-left:1.2rem; margin:0.5rem 0;">
          <li><strong>Datos de Identidad:</strong> Nombres completos, número de cédula de identidad, nacionalidad.</li>
          <li><strong>Datos de Contacto:</strong> Correo electrónico, número de teléfono.</li>
          <li><strong>Datos Profesionales:</strong> Experiencia laboral, formación académica, habilidades, referencias.</li>
          <li><strong>Datos de Acceso:</strong> Contraseña cifrada mediante Firebase Authentication (no almacenamos contraseñas en texto plano).</li>
          <li><strong>Datos de Transacción:</strong> Registro de activaciones VIP a través de PayPhone (no almacenamos datos de tarjetas).</li>
        </ul>
      </section>

      <section style="margin-bottom:1.5rem;">
        <h2 style="color:var(--primary); font-size:1rem; border-bottom:1px solid rgba(197,160,89,0.2); padding-bottom:0.5rem;">3. Finalidad del Tratamiento</h2>
        <p>Sus datos se utilizan <strong>exclusivamente</strong> para:</p>
        <ul style="padding-left:1.2rem; margin:0.5rem 0;">
          <li>Generar y personalizar su hoja de vida profesional en formato ATS.</li>
          <li>Verificar su identidad legal mediante cédula ecuatoriana.</li>
          <li>Gestionar su cuenta de usuario y nivel de acceso (estándar o VIP).</li>
          <li>Procesar pagos de activación VIP a través de PayPhone Ecuador.</li>
          <li>Mejorar la calidad del servicio mediante análisis interno.</li>
        </ul>
        <p style="color:#f87171; font-size:0.8rem; margin-top:0.8rem;">⚠️ <strong>Sus datos NO serán vendidos, cedidos ni compartidos</strong> con terceros para fines publicitarios o comerciales.</p>
      </section>

      <section style="margin-bottom:1.5rem;">
        <h2 style="color:var(--primary); font-size:1rem; border-bottom:1px solid rgba(197,160,89,0.2); padding-bottom:0.5rem;">4. Seguridad y Almacenamiento</h2>
        <p>Todos los datos son almacenados en <strong>Google Firebase (Firestore)</strong>, infraestructura certificada bajo estándares ISO 27001, SOC 2 y SOC 3. El acceso a sus datos está protegido por:</p>
        <ul style="padding-left:1.2rem; margin:0.5rem 0;">
          <li>Autenticación obligatoria — nadie puede ver sus datos sin su usuario y contraseña.</li>
          <li>Reglas de seguridad que garantizan que cada usuario solo accede a su propia información.</li>
          <li>Transmisión cifrada mediante HTTPS/TLS en todos los puntos.</li>
        </ul>
      </section>

      <section style="margin-bottom:1.5rem;">
        <h2 style="color:var(--primary); font-size:1rem; border-bottom:1px solid rgba(197,160,89,0.2); padding-bottom:0.5rem;">5. Sus Derechos (ARCO)</h2>
        <p>Conforme a la LOPDP, usted tiene derecho a:</p>
        <ul style="padding-left:1.2rem; margin:0.5rem 0;">
          <li><strong>Acceso:</strong> Solicitar copia de sus datos almacenados.</li>
          <li><strong>Rectificación:</strong> Corregir datos incorrectos o desactualizados.</li>
          <li><strong>Cancelación:</strong> Solicitar la eliminación de su cuenta y datos.</li>
          <li><strong>Oposición:</strong> Oponerse al tratamiento de sus datos.</li>
        </ul>
        <p>Para ejercer estos derechos, escriba a: <a href="mailto:ks_mvp@icloud.com" style="color:var(--primary);">ks_mvp@icloud.com</a></p>
      </section>

      <section style="margin-bottom:1.5rem;">
        <h2 style="color:var(--primary); font-size:1rem; border-bottom:1px solid rgba(197,160,89,0.2); padding-bottom:0.5rem;">6. Pagos y Datos Financieros</h2>
        <p>Los pagos de activación VIP son procesados por <strong>PayPhone Ecuador</strong>. Virtual Office <strong>no almacena</strong> datos de tarjetas de crédito, débito ni información bancaria. Para consultar la política de privacidad de PayPhone visite: <a href="https://www.payphone.app/politicas-de-privacidad-y-proteccion-de-datos" target="_blank" style="color:var(--primary);">payphone.app/politicas</a></p>
      </section>

      <section style="margin-bottom:1.5rem;">
        <h2 style="color:var(--primary); font-size:1rem; border-bottom:1px solid rgba(197,160,89,0.2); padding-bottom:0.5rem;">7. Cambios a esta Política</h2>
        <p>Nos reservamos el derecho de actualizar esta política. Los cambios significativos serán notificados dentro de la plataforma. El uso continuado del servicio implica aceptación de la política vigente.</p>
      </section>

      <section style="margin-bottom:0.5rem;">
        <h2 style="color:var(--primary); font-size:1rem; border-bottom:1px solid rgba(197,160,89,0.2); padding-bottom:0.5rem;">8. Jurisdicción</h2>
        <p>Esta política se rige por las leyes de la <strong>República del Ecuador</strong>, especialmente la Ley Orgánica de Protección de Datos Personales y sus reglamentos vigentes.</p>
      </section>

    </div>

    <div style="margin-top:2rem; text-align:center;">
      <button id="close-privacy-policy-btn" class="btn-primary" style="padding:0.7rem 2rem; letter-spacing:1px;">CERRAR</button>
    </div>

  </div>
</div>
`;

export const showPrivacyPolicy = () => {
  const existing = document.getElementById('privacy-policy-overlay');
  if (existing) return;

  const overlay = document.createElement('div');
  overlay.id = 'privacy-policy-overlay';
  overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.95);z-index:99999;overflow-y:auto;padding:1rem;';
  overlay.innerHTML = PrivacyPolicyView();
  document.body.appendChild(overlay);

  overlay.querySelector('#close-privacy-policy-btn')?.addEventListener('click', () => {
    overlay.remove();
  });
};
