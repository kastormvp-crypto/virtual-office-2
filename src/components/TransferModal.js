/**
 * TransferModal — Instrucciones de pago por transferencia bancaria
 * Plan Socio $10/mes
 */
export const showTransferModal = (onConfirmSent) => {
  const overlay = document.createElement('div');
  overlay.id = 'transfer-modal-overlay';
  overlay.style.cssText = `
    position: fixed; top: 0; bottom: 0; left: 0; right: 0;
    background: rgba(0,0,0,0.72); display: flex; align-items: center; justify-content: center;
    z-index: 99999; padding: 1rem; backdrop-filter: blur(8px); box-sizing: border-box;
  `;

  overlay.innerHTML = `
    <div style="
      max-width: 420px; width: 100%; background: rgba(255, 255, 255, 0.95);
      border: 1px solid rgba(0, 0, 0, 0.1); border-radius: 14px;
      padding: 1.5rem; box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
      max-height: 85vh; overflow-y: auto; box-sizing: border-box; margin: auto;
      backdrop-filter: blur(16px);
    ">
      <!-- Header -->
      <div style="text-align: center; margin-bottom: 1.8rem;">
        <div style="font-size: 2.2rem; margin-bottom: 0.5rem;">🏦</div>
        <h3 style="margin: 0; color: #1d1d1f; font-size: 1.1rem; letter-spacing: 0.5px; text-transform: uppercase;">
          Pago por Transferencia
        </h3>
        <p style="margin: 0.4rem 0 0; color: #475569; font-size: 0.75rem;">
          Realiza la transferencia y envíanos el comprobante
        </p>
      </div>

      <!-- Monto -->
      <div style="
        background: #f5f5f7; border: 1px solid rgba(0, 0, 0, 0.1);
        border-radius: 10px; padding: 1rem; text-align: center; margin-bottom: 1.5rem;
      ">
        <p style="margin: 0; font-size: 0.65rem; color: #475569; text-transform: uppercase; letter-spacing: 1px;">Monto a transferir</p>
        <p style="margin: 0.3rem 0 0; font-size: 2.4rem; font-weight: 800; color: #0071e3; line-height: 1;">
          $10.00 <span style="font-size: 1rem; color: #475569; font-weight: 400;">USD</span>
        </p>
        <p style="margin: 0.2rem 0 0; font-size: 0.7rem; color: #475569;">Plan Socio — 30 días de acceso ilimitado</p>
      </div>

      <!-- Datos bancarios -->
      <div style="
        background: #f5f5f7; border: 1px solid rgba(0, 0, 0, 0.1);
        border-radius: 12px; padding: 1.2rem; margin-bottom: 1.5rem;
      ">
        <p style="margin: 0 0 1rem; font-size: 0.65rem; color: #1d1d1f; text-transform: uppercase; letter-spacing: 1px; font-weight: 700;">
          📋 Datos de Cuenta
        </p>
        <table style="width: 100%; border-collapse: collapse; font-size: 0.82rem;">
          <tr>
            <td style="padding: 0.45rem 0; color: #475569; width: 45%;">Banco:</td>
            <td style="padding: 0.45rem 0; color: #1d1d1f; font-weight: 600;">Banco Pichincha</td>
          </tr>
          <tr style="border-top: 1px solid rgba(0, 0, 0, 0.05);">
            <td style="padding: 0.45rem 0; color: #475569;">Tipo:</td>
            <td style="padding: 0.45rem 0; color: #1d1d1f; font-weight: 600;">Cuenta de Ahorros</td>
          </tr>
          <tr style="border-top: 1px solid rgba(0, 0, 0, 0.05);">
            <td style="padding: 0.45rem 0; color: #475569;">N° Cuenta:</td>
            <td style="padding: 0.45rem 0;">
              <span id="copy-account" style="
                color: #0071e3; font-weight: 700; font-family: monospace; font-size: 0.9rem;
                cursor: pointer; border-bottom: 1px dashed rgba(0, 113, 227, 0.4);
              ">2215852866</span>
              <span id="copy-feedback" style="font-size: 0.65rem; color: #0071e3; margin-left: 0.4rem; display: none;">✓ Copiado</span>
            </td>
          </tr>
          <tr style="border-top: 1px solid rgba(0, 0, 0, 0.05);">
            <td style="padding: 0.45rem 0; color: #475569;">Titular:</td>
            <td style="padding: 0.45rem 0; color: #1d1d1f; font-weight: 600;">David Flores G.</td>
          </tr>
          <tr style="border-top: 1px solid rgba(0, 0, 0, 0.05);">
            <td style="padding: 0.45rem 0; color: #475569;">RUC/CI:</td>
            <td style="padding: 0.45rem 0; color: #1d1d1f; font-weight: 600;">1716066370</td>
          </tr>
        </table>
      </div>

      <!-- Instrucción WhatsApp -->
      <div style="
        background: #f5f5f7; border: 1px solid rgba(0, 0, 0, 0.1);
        border-radius: 10px; padding: 1rem; margin-bottom: 1.5rem; display: flex;
        align-items: flex-start; gap: 0.8rem;
      ">
        <span style="font-size: 1.4rem; flex-shrink: 0;">💬</span>
        <p style="margin: 0; font-size: 0.78rem; color: #475569; line-height: 1.5;">
          Una vez realizada la transferencia, <strong style="color: #1d1d1f;">envía el comprobante por WhatsApp</strong> al
          <strong style="color: #1d1d1f;">+593 96 269 6067</strong> indicando tu correo para activar tu cuenta.
        </p>
      </div>

      <!-- Botones -->
      <div style="display: flex; gap: 0.8rem;">
        <button id="transfer-modal-cancel" style="
          flex: 1; padding: 0.8rem; border-radius: 10px; font-size: 0.8rem;
          background: #ffffff; border: 1px solid rgba(0,0,0,0.1); color: #475569;
          cursor: pointer; font-weight: 600; transition: background 0.2s;
        " onmouseover="this.style.background='#f5f5f7'" onmouseout="this.style.background='#ffffff'">Cerrar</button>
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
