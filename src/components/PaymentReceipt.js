/**
 * PaymentReceipt — Genera un recibo de pago profesional en PDF
 * Utiliza html2pdf.js (ya incluido en el proyecto via EditorView)
 */

/**
 * Genera y descarga un recibo de pago como PDF
 * @param {Object} paymentData - Datos del pago
 * @param {Object} profileData - Datos del perfil del usuario
 */
export async function downloadPaymentReceipt(paymentData, profileData) {
  const html2pdf = (await import('html2pdf.js')).default;

  const receiptDate = paymentData.paidAt 
    ? new Date(paymentData.paidAt).toLocaleDateString('es-EC', { 
        year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' 
      })
    : 'No disponible';

  const receiptNumber = paymentData.clientTxId || paymentData.paidAt || Date.now().toString();

  const receiptHTML = `
  <div id="receipt-render" style="width:210mm; min-height:148mm; padding:20mm 25mm; font-family:'Inter','Helvetica Neue',Arial,sans-serif; color:#1a1a2e; background:#ffffff; box-sizing:border-box;">
    
    <!-- Header con logo y datos empresa -->
    <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:25px; padding-bottom:18px; border-bottom:3px solid #c5a059;">
      <div>
        <h1 style="margin:0; font-size:22px; color:#c5a059; letter-spacing:2px; font-weight:700;">TU HOJA DE VIDA</h1>
        <p style="margin:4px 0 0; font-size:11px; color:#666; letter-spacing:1px;">al Instante — www.tuhojadevida.com</p>
      </div>
      <div style="text-align:right;">
        <p style="margin:0; font-size:18px; font-weight:700; color:#1a1a2e; letter-spacing:1px;">RECIBO DE PAGO</p>
        <p style="margin:4px 0 0; font-size:10px; color:#888;">N° ${receiptNumber.slice(-12).toUpperCase()}</p>
      </div>
    </div>

    <!-- Fecha -->
    <div style="margin-bottom:22px;">
      <table style="width:100%; border-collapse:collapse; font-size:12px;">
        <tr>
          <td style="padding:6px 0; color:#888; width:140px;">Fecha de emisión:</td>
          <td style="padding:6px 0; font-weight:600;">${receiptDate}</td>
        </tr>
        <tr>
          <td style="padding:6px 0; color:#888;">Estado:</td>
          <td style="padding:6px 0; font-weight:600; color:#16a34a;">✓ APROBADO</td>
        </tr>
      </table>
    </div>

    <!-- Datos del cliente -->
    <div style="background:#f8f9fa; border:1px solid #e9ecef; border-radius:8px; padding:16px 20px; margin-bottom:22px;">
      <p style="margin:0 0 10px; font-size:10px; color:#888; text-transform:uppercase; letter-spacing:1.5px; font-weight:600;">Datos del Cliente</p>
      <table style="width:100%; border-collapse:collapse; font-size:12px;">
        <tr>
          <td style="padding:5px 0; color:#666; width:140px;">Nombre completo:</td>
          <td style="padding:5px 0; font-weight:600;">${profileData?.fullName || 'N/A'}</td>
        </tr>
        <tr>
          <td style="padding:5px 0; color:#666;">Cédula:</td>
          <td style="padding:5px 0; font-weight:600;">${profileData?.cedula || 'N/A'}</td>
        </tr>
        <tr>
          <td style="padding:5px 0; color:#666;">Email:</td>
          <td style="padding:5px 0; font-weight:600;">${profileData?.email || 'N/A'}</td>
        </tr>
      </table>
    </div>

    <!-- Detalle del servicio -->
    <table style="width:100%; border-collapse:collapse; margin-bottom:22px; font-size:12px;">
      <thead>
        <tr style="background:#1a1a2e; color:#ffffff;">
          <th style="padding:10px 14px; text-align:left; font-size:10px; text-transform:uppercase; letter-spacing:1px;">Descripción</th>
          <th style="padding:10px 14px; text-align:center; font-size:10px; text-transform:uppercase; letter-spacing:1px;">Cant.</th>
          <th style="padding:10px 14px; text-align:right; font-size:10px; text-transform:uppercase; letter-spacing:1px;">Total</th>
        </tr>
      </thead>
      <tbody>
        <tr style="border-bottom:1px solid #e9ecef;">
          <td style="padding:12px 14px;">
            <strong>Licencia VIP — Tu Hoja de Vida</strong><br>
            <span style="font-size:10px; color:#888;">Acceso de por vida · CV profesional ATS · Descarga PDF ilimitada</span>
          </td>
          <td style="padding:12px 14px; text-align:center;">1</td>
          <td style="padding:12px 14px; text-align:right; font-weight:600;">$1.00</td>
        </tr>
      </tbody>
    </table>

    <!-- Total -->
    <div style="display:flex; justify-content:flex-end; margin-bottom:25px;">
      <table style="border-collapse:collapse; font-size:12px; min-width:220px;">
        <tr style="border-bottom:1px solid #e9ecef;">
          <td style="padding:6px 14px; color:#666;">Subtotal:</td>
          <td style="padding:6px 14px; text-align:right;">$1.00</td>
        </tr>
        <tr style="border-bottom:1px solid #e9ecef;">
          <td style="padding:6px 14px; color:#666;">IVA (0%):</td>
          <td style="padding:6px 14px; text-align:right;">$0.00</td>
        </tr>
        <tr style="background:#f0ead6;">
          <td style="padding:10px 14px; font-weight:700; font-size:14px;">TOTAL:</td>
          <td style="padding:10px 14px; text-align:right; font-weight:700; font-size:14px; color:#c5a059;">$1.00 USD</td>
        </tr>
      </table>
    </div>

    <!-- Método de pago -->
    <div style="border-top:1px solid #e9ecef; padding-top:16px; margin-bottom:18px;">
      <table style="width:100%; border-collapse:collapse; font-size:11px;">
        <tr>
          <td style="padding:4px 0; color:#888; width:160px;">Método de pago:</td>
          <td style="padding:4px 0;">${paymentData.method === 'transfer' ? 'Transferencia Bancaria' : 'Tarjeta (PayPhone)'}</td>
        </tr>
        ${paymentData.authCode ? `
        <tr>
          <td style="padding:4px 0; color:#888;">Código autorización:</td>
          <td style="padding:4px 0; font-family:monospace; font-weight:600;">${paymentData.authCode}</td>
        </tr>` : ''}
        ${paymentData.clientTxId ? `
        <tr>
          <td style="padding:4px 0; color:#888;">ID transacción:</td>
          <td style="padding:4px 0; font-family:monospace; font-size:10px;">${paymentData.clientTxId}</td>
        </tr>` : ''}
      </table>
    </div>

    <!-- Footer legal -->
    <div style="border-top:2px solid #c5a059; padding-top:14px; text-align:center;">
      <p style="margin:0; font-size:9px; color:#aaa; line-height:1.6;">
        Este documento es un comprobante de pago digital emitido por Tu Hoja de Vida al Instante.<br>
        Servicio digital de creación de hojas de vida profesionales · www.tuhojadevida.com<br>
        Para soporte: contacto vía WhatsApp al +593 96 269 6067
      </p>
    </div>

  </div>`;

  // Crear un contenedor temporal fuera del viewport para renderizar
  const container = document.createElement('div');
  container.style.cssText = 'position:fixed; left:-9999px; top:0; z-index:-1;';
  container.innerHTML = receiptHTML;
  document.body.appendChild(container);

  const element = container.querySelector('#receipt-render');

  // Sanitizar nombre para el archivo
  const safeName = (profileData?.fullName || 'usuario')
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .trim()
    .replace(/\s+/g, '_')
    .replace(/[^a-zA-Z0-9_]/g, '');

  try {
    await html2pdf().set({
      margin: 0,
      filename: `Recibo_TuHojaDeVida_${safeName}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        windowWidth: 900
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    }).from(element).save();
  } finally {
    container.remove();
  }
}
