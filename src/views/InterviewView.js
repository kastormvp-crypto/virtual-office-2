export const InterviewView = () => `
<div class="animate-fade" style="display: flex; flex-direction: column; height: calc(100vh - 4rem);">
  <header style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
    <div>
      <h2 style="color: var(--primary);">Módulo de Carga (IA Asistida)</h2>
      <p style="color: var(--text-dim); font-size: 0.85rem;">La IA guiará la estructuración de tu perfil ATS.</p>
    </div>
    <div style="display: flex; gap: 1rem;">
      <button id="save-return-btn" class="btn-primary" style="padding: 0.5rem 1.5rem; background: var(--primary-glow); border: 1px solid var(--primary);">GUARDAR Y VOLVER AL MENÚ</button>
    </div>
  </header>

  <div id="chat-container" class="glass" style="flex-grow: 1; overflow-y: auto; padding: 2rem; margin-bottom: 1.5rem; display: flex; flex-direction: column; gap: 1.5rem;">
    <div class="agent-msg animate-fade" style="align-self: flex-start; max-width: 80%; background: rgba(197, 160, 89, 0.1); padding: 1rem; border-radius: 0 16px 16px 16px; border-left: 3px solid var(--primary);">
      Bienvenido al Módulo de Carga. Estoy listo para procesar tu información.
      <br><br>
      ¿Deseas que empecemos con tu <strong>Encabezado profesional</strong> o prefieres retomar alguna sección específica?
    </div>
  </div>

  <div id="ai-typing" style="display: none; margin-bottom: 1rem; font-size: 0.8rem; color: var(--primary); font-style: italic; padding-left: 1rem;">
    Procesando información ATS...
  </div>

  <div class="input-area" style="display: flex; gap: 1rem;">
    <input type="text" id="interview-input" class="input-field" placeholder="Escribe tu respuesta aquí..." style="flex-grow: 1;">
    <button id="send-msg-btn" class="btn-primary" style="padding: 0 2rem;">ENVIAR</button>
  </div>

  <!-- Confirmation Overlay (Hidden by default) -->
  <div id="save-overlay" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); backdrop-filter: blur(8px); z-index: 100; place-items: center; padding: 2rem;">
    <div class="glass animate-fade" style="max-width: 500px; padding: 3rem; text-align: center;">
      <h3 style="color: var(--primary); margin-bottom: 1.5rem;">Resumen de Información Guardada</h3>
      <div id="save-summary" style="text-align: left; margin-bottom: 2rem; color: var(--text-dim); line-height: 1.6; font-size: 0.9rem; max-height: 300px; overflow-y: auto;">
        <!-- AI Summary will appear here -->
      </div>
      <button id="confirm-return-btn" class="btn-primary" style="width: 100%;">ENTENDIDO, VOLVER AL MENÚ</button>
    </div>
  </div>
</div>
`;

export const attachInterviewListeners = (onSendMessage, onSave) => {
  const sendBtn = document.querySelector('#send-msg-btn');
  const input = document.querySelector('#interview-input');
  const saveBtn = document.querySelector('#save-return-btn');
  const confirmBtn = document.querySelector('#confirm-return-btn');
  const chatContainer = document.querySelector('#chat-container');
  const typingIndicator = document.querySelector('#ai-typing');
  const saveOverlay = document.querySelector('#save-overlay');
  const saveSummary = document.querySelector('#save-summary');

  const addMessage = (text, role) => {
    const msg = document.createElement('div');
    msg.className = `${role}-msg animate-fade`;
    msg.style.cssText = `
      align-self: ${role === 'agent' ? 'flex-start' : 'flex-end'};
      max-width: 80%;
      background: ${role === 'agent' ? 'rgba(197, 160, 89, 0.1)' : 'rgba(255, 255, 255, 0.05)'};
      padding: 1rem;
      border-radius: ${role === 'agent' ? '0 16px 16px 16px' : '16px 0 16px 16px'};
      border-${role === 'agent' ? 'left' : 'right'}: 3px solid ${role === 'agent' ? 'var(--primary)' : 'var(--text-dim)'};
      white-space: pre-wrap;
    `;
    msg.innerHTML = text;
    chatContainer.appendChild(msg);
    chatContainer.scrollTop = chatContainer.scrollHeight;
  };

  const handleSend = () => {
    const text = input.value.trim();
    if (!text) return;
    
    addMessage(text, 'user');
    input.value = '';
    typingIndicator.style.display = 'block';

    onSendMessage(text, (response) => {
      typingIndicator.style.display = 'none';
      addMessage(response, 'agent');
    });
  };

  sendBtn?.addEventListener('click', handleSend);
  input?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSend();
  });

  saveBtn?.addEventListener('click', () => {
    typingIndicator.style.display = 'block';
    onSave((summaryText) => {
      typingIndicator.style.display = 'none';
      saveSummary.innerHTML = summaryText;
      saveOverlay.style.display = 'grid';
    });
  });

  confirmBtn?.addEventListener('click', () => {
    location.reload(); // Simplest way to return to dashboard with fresh state
  });
};
