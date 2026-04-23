/**
 * Privacy Disclaimer Modal
 * Informs the user about data encryption and exclusive use for professional CVs.
 */
export const showPrivacyModal = () => {
  const modalId = 'privacy-disclaimer-modal';
  if (document.getElementById(modalId)) return;

  const modal = document.createElement('div');
  modal.id = modalId;
  modal.style.cssText = `
    position: fixed;
    top: 0; left: 0;
    width: 100%; height: 100%;
    background: rgba(0, 0, 0, 0.9);
    display: grid;
    place-items: center;
    z-index: 9999;
    backdrop-filter: blur(8px);
    padding: 1.5rem;
  `;

  modal.innerHTML = `
    <div class="glass animate-fade" style="max-width: 420px; padding: 1.5rem; text-align: center; border: 1px solid rgba(197, 160, 89, 0.3);">
      <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">🔒</div>
      <h2 style="color: var(--primary); font-size: 1.1rem; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 0.8rem;">Privacidad y Seguridad</h2>
      
      <p style="color: var(--text-dim); font-size: 0.82rem; line-height: 1.5; margin-bottom: 1.2rem; text-align: justify;">
        Toda la información ingresada en esta plataforma es <strong>netamente para uso o realización de un currículum de trabajo profesional</strong>. 
        <br><br>
        Virtual Office no tiene acceso a su información personal privada, dado que todo es <strong>encriptado</strong> y mostrado solamente bajo el registro de su usuario y login personal.
      </p>

      <button id="close-privacy-btn" class="btn-primary" style="width: 100%; padding: 0.7rem; letter-spacing: 1px; font-weight: bold; font-size: 0.8rem;">
        ENTENDIDO Y CONTINUAR
      </button>
    </div>
  `;

  document.body.appendChild(modal);

  document.getElementById('close-privacy-btn').addEventListener('click', () => {
    modal.style.opacity = '0';
    setTimeout(() => modal.remove(), 400);
    sessionStorage.setItem('privacy_seen', 'true');
  });
};
