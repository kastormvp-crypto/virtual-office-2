/**
 * TransferModal — Instrucciones de pago por transferencia bancaria
 * Plan Socio $10/mes
 */
export const showTransferModal = (onConfirmSent) => {
  const overlay = document.createElement('div');
  overlay.id = 'transfer-modal-overlay';
  overlay.style.cssText = `
    position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
    background: rgba(0,0,0,0.88); display: grid; place-items: center;
    z-index: 99999; padding: 1rem; backdrop-filter: blur(4px);
  `;

  overlay.innerHTML = `
    <div style="
      max-width: 420px; width: 100%; background: #0f1018;
      border: 1px solid rgba(197,160,89,0.35); border-radius: 20px;
      padding: 2rem; box-shadow: 0 30px 80px rgba(0,0,0,0.6);
    ">
      <!-- Header -->
      <div style="text-align: center; margin-bottom: 1.8rem;">
        <div style="font-size: 2.2rem; margin-bottom: 0.5rem;">🏦</div>
        <h3 style="margin: 0; color: #c5a059; font-size: 1.1rem; letter-spacing: 2px; text-transform: uppercase;">
          Pago por Transferencia
        </h3>
        <p style="margin: 0.4rem 0 0; color: #808090; font-size: 0.75rem;">
          Realiza la transferencia y envíanos el comprobante
        </p>
      </div>

      <!-- Monto -->
      <div style="
        background: rgba(74,222,128,0.06); border: 1px solid rgba(74,222,128,0.2);
        border-radius: 10px; padding: 1rem; text-align: center; margin-bottom: 1.5rem;
      ">
        <p style="margin: 0; font-size: 0.65rem; color: #808090; text-transform: uppercase; letter-spacing: 1px;">Monto a transferir</p>
        <p style="margin: 0.3rem 0 0; font-size: 2.4rem; font-weight: 800; color: #4ade80; line-height: 1;">
          $10.00 <span style="font-size: 1rem; color: #a0a0b0; font-weight: 400;">USD</span>
        </p>
        <p style="margin: 0.2rem 0 0; font-size: 0.7rem; color: #606070;">Plan Socio — 30 días de acceso ilimitado</p>
      </div>

      <!-- Datos bancarios -->
      <div style="
        background: rgba(197,160,89,0.04); border: 1px solid rgba(197,160,89,0.18);
        border-radius: 12px; padding: 1.2rem; margin-bottom: 1.5rem;
      ">
        <p style="margin: 0 0 1rem; font-size: 0.65rem; color: #c5a059; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 700;">
          📋 Datos de Cuenta
        </p>
        <table style="width: 100%; border-collapse: collapse; font-size: 0.82rem;">
          <tr>
            <td style="padding: 0.45rem 0; color: #808090; width: 45%;">Banco:</td>
            <td style="padding: 0.45rem 0; color: #fff; font-weight: 600;">Banco Pichincha</td>
          </tr>
          <tr style="border-top: 1px solid rgba(255,255,255,0.04);">
            <td style="padding: 0.45rem 0; color: #808090;">Tipo:</td>
            <td style="padding: 0.45rem 0; color: #fff; font-weight: 600;">Cuenta de Ahorros</td>
          </tr>
          <tr style="border-top: 1px solid rgba(255,255,255,0.04);">
            <td style="padding: 0.45rem 0; color: #808090;">N° Cuenta:</td>
            <td style="padding: 0.45rem 0;">
              <span id="copy-account" style="
                color: #c5a059; font-weight: 700; font-family: monospace; font-size: 0.9rem;
                cursor: pointer; border-bottom: 1px dashed rgba(197,160,89,0.4);
              ">2215852866</span>
              <span id="copy-feedback" style="font-size: 0.65rem; color: #4ade80; margin-left: 0.4rem; display: none;">✓ Copiado</span>
            </td>
          </tr>
          <tr style="border-top: 1px solid rgba(255,255,255,0.04);">
            <td style="padding: 0.45rem 0; color: #808090;">Titular:</td>
            <td style="padding: 0.45rem 0; color: #fff; font-weight: 600;">David Flores G.</td>
          </tr>
          <tr style="border-top: 1px solid rgba(255,255,255,0.04);">
            <td style="padding: 0.45rem 0; color: #808090;">RUC/CI:</td>
            <td style="padding: 0.45rem 0; color: #fff; font-weight: 600;">1716066370</td>
          </tr>
        </table>
      </div>

      <!-- Instrucción WhatsApp -->
      <div style="
        background: rgba(74,222,128,0.05); border: 1px solid rgba(74,222,128,0.15);
        border-radius: 10px; padding: 1rem; margin-bottom: 1.5rem; display: flex;
        align-items: flex-start; gap: 0.8rem;
      ">
        <span style="font-size: 1.4rem; flex-shrink: 0;">💬</span>
        <p style="margin: 0; font-size: 0.78rem; color: #d1d1d1; line-height: 1.5;">
          Una vez realizada la transferencia, <strong style="color: #4ade80;">envía el comprobante por WhatsApp</strong> al
          <strong style="color: #fff;">+593 96 269 6067</strong> indicando tu correo para activar tu cuenta.
        </p>
      </div>

      <!-- Botones -->
      <div style="display: flex; gap: 0.8rem;">
        <button id="transfer-modal-cancel" style="
          flex: 1; padding: 0.8rem; border-radius: 10px; font-size: 0.8rem;
          background: none; border: 1px solid rgba(255,255,255,0.1); color: #a0a0b0;
          cursor: pointer; font-weight: 600;
        ">Cerrar</button>
        <a href="https://wa.me/593962696067?text=Hola%2C%20acabo%20de%20realizar%20una%20transferencia%20de%20%2410%20para%20el%20Plan%20Socio%20de%20Tu%20Hoja%20de%20Vida.%20Adjunto%20mi%20comprobante." 
           target="_blank" rel="noopener" style="
          flex: 2; padding: 0.8rem; border-radius: 10px; font-size: 0.82rem;
          background: linear-gradient(135deg, #25d366, #128c7e); color: #fff; border: none;
          cursor: pointer; font-weight: 700; text-align: center; text-decoration: none;
          display: flex; align-items: center; justify-content: center; gap: 0.4rem;
        ">
          <span>💬</span> Enviar Comprobante
        </a>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  // Copy account number on click
  document.getElementById('copy-account')?.addEventListener('click', () => {
    navigator.clipboard?.writeText('2215852866').then(() => {
      const fb = document.getElementById('copy-feedback');
      if (fb) { fb.style.display = 'inline'; setTimeout(() => { fb.style.display = 'none'; }, 2000); }
    });
  });

  // Close on cancel or outside click
  document.getElementById('transfer-modal-cancel')?.addEventListener('click', () => overlay.remove());
  overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
};
