import { chatWithAssistant } from '../services/ai.js';

export function initAiAssistant() {
  if (document.getElementById('ai-assistant-wrapper')) return;

  const wrapper = document.createElement('div');
  wrapper.id = 'ai-assistant-wrapper';
  wrapper.style.cssText = `
    position: fixed;
    bottom: 40px;
    right: 40px;
    z-index: 9999;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    font-family: 'Inter', sans-serif;
  `;

  // The chat window (hidden by default)
  const chatWindow = document.createElement('div');
  chatWindow.id = 'ai-chat-window';
  chatWindow.className = 'glass';
  chatWindow.style.cssText = `
    width: 300px;
    height: 400px;
    margin-bottom: 15px;
    border-radius: 12px;
    border: 1px solid rgba(56, 189, 248, 0.4);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5), 0 0 15px rgba(56, 189, 248, 0.2);
    display: none;
    flex-direction: column;
    overflow: hidden;
    background: rgba(10, 11, 16, 0.85);
    backdrop-filter: blur(10px);
    transform: translateY(20px);
    opacity: 0;
    transition: all 0.3s ease;
  `;

  chatWindow.innerHTML = `
    <div style="background: linear-gradient(90deg, rgba(56, 189, 248, 0.2), transparent); padding: 12px; border-bottom: 1px solid rgba(56, 189, 248, 0.3); display: flex; justify-content: space-between; align-items: center;">
      <div style="display: flex; align-items: center; gap: 8px;">
        <div style="width: 8px; height: 8px; background: #38bdf8; border-radius: 50%; box-shadow: 0 0 8px #38bdf8;"></div>
        <span style="font-weight: 600; font-size: 0.9rem; color: #fff;">Asistente IA</span>
      </div>
      <button id="ai-chat-close" style="background: none; border: none; color: #fff; cursor: pointer; font-size: 1.2rem;">&times;</button>
    </div>
    <div id="ai-chat-messages" style="flex: 1; padding: 12px; overflow-y: auto; display: flex; flex-direction: column; gap: 10px; font-size: 0.8rem;">
      <div style="align-self: flex-start; background: rgba(56, 189, 248, 0.1); border: 1px solid rgba(56, 189, 248, 0.3); padding: 8px 12px; border-radius: 12px 12px 12px 0; color: #e0e0e0; max-width: 85%;">
        ¡Hola! Soy tu asistente amigable. ¿En qué puedo ayudarte con tu hoja de vida hoy?
      </div>
    </div>
    <form id="ai-chat-form" style="padding: 10px; border-top: 1px solid rgba(255, 255, 255, 0.1); display: flex; gap: 8px;">
      <input type="text" id="ai-chat-input" placeholder="Escribe tu duda aquí..." style="flex: 1; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; padding: 8px 12px; color: #fff; font-size: 0.8rem; outline: none;">
      <button type="submit" style="background: #38bdf8; border: none; border-radius: 50%; width: 32px; height: 32px; display: grid; place-items: center; cursor: pointer; color: #0a0b10; font-weight: bold;">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
      </button>
    </form>
  `;

  // The floating bot button (Friendly SVG Robot)
  const botButton = document.createElement('div');
  botButton.id = 'ai-bot-btn';
  botButton.style.cssText = `
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: linear-gradient(135deg, rgba(10,11,16,0.9), rgba(20,30,50,0.9));
    border: 2px solid #38bdf8;
    box-shadow: 0 0 15px rgba(56, 189, 248, 0.5), inset 0 0 10px rgba(56, 189, 248, 0.3);
    cursor: pointer;
    display: grid;
    place-items: center;
    transition: all 0.3s ease;
    animation: float-bot 3s ease-in-out infinite;
  `;

  botButton.style.position = 'relative';
  botButton.innerHTML = `
    <img src="/bot-avatar.png" alt="Bot Avatar" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">
    <div style="position: absolute; bottom: -22px; width: 140px; text-align: center; font-size: 0.65rem; font-weight: 800; color: #38bdf8; text-shadow: 0 0 8px rgba(56, 189, 248, 0.8), 0 0 2px #000; letter-spacing: 0.5px; left: 50%; transform: translateX(-50%);">
      Asistente Virtual
    </div>
    <style>
      @keyframes float-bot {
        0% { transform: translateY(0px); box-shadow: 0 0 15px rgba(56, 189, 248, 0.5), inset 0 0 10px rgba(56, 189, 248, 0.3); }
        50% { transform: translateY(-8px); box-shadow: 0 0 25px rgba(56, 189, 248, 0.8), inset 0 0 15px rgba(56, 189, 248, 0.5); }
        100% { transform: translateY(0px); box-shadow: 0 0 15px rgba(56, 189, 248, 0.5), inset 0 0 10px rgba(56, 189, 248, 0.3); }
      }
      #ai-bot-btn:hover {
        transform: scale(1.05);
      }
    </style>
  `;

  // Tooltip
  const tooltip = document.createElement('div');
  tooltip.id = 'ai-bot-tooltip';
  tooltip.style.cssText = `
    position: absolute;
    right: 75px;
    bottom: 15px;
    background: rgba(56, 189, 248, 0.15);
    border: 1px solid rgba(56, 189, 248, 0.4);
    backdrop-filter: blur(5px);
    color: #fff;
    padding: 8px 12px;
    border-radius: 8px 8px 0 8px;
    font-size: 0.75rem;
    white-space: nowrap;
    opacity: 0;
    transform: translateX(10px);
    transition: all 0.3s ease;
    pointer-events: none;
  `;
  tooltip.innerText = '¿Necesitas ayuda?';

  botButton.appendChild(tooltip);
  wrapper.appendChild(chatWindow);
  wrapper.appendChild(botButton);
  document.body.appendChild(wrapper);

  // Chat Logic
  let isOpen = false;
  const messagesHistory = [
    { role: "system", content: "Eres el Asistente Virtual experto de la plataforma 'Tu Hoja de Vida' (tuhojadevida.com). Ayudas a los usuarios de Ecuador a crear su CV profesional. Tu objetivo es asesorarlos y convencerlos de usar nuestro servicio resaltando SIEMPRE nuestras ventajas: 1) Formatos estandarizados que sí pasan los filtros ATS de los reclutadores. 2) Múltiples plantillas ejecutivas. 3) Optimización automática de textos con Inteligencia Artificial. 4) Descarga inmediata en PDF. Y lo más importante: Un costo súper accesible de tan solo $1 dólar. Eres breve, muy empático, entusiasta, persuasivo y usas emojis ocasionalmente. Si preguntan el precio, recalca que por solo $1 dólar tienen acceso a la mejor tecnología para conseguir empleo." }
  ];

  const toggleChat = () => {
    isOpen = !isOpen;
    if (isOpen) {
      chatWindow.style.display = 'flex';
      setTimeout(() => {
        chatWindow.style.opacity = '1';
        chatWindow.style.transform = 'translateY(0)';
      }, 10);
      tooltip.style.opacity = '0'; // hide tooltip when open
    } else {
      chatWindow.style.opacity = '0';
      chatWindow.style.transform = 'translateY(20px)';
      setTimeout(() => {
        chatWindow.style.display = 'none';
      }, 300);
    }
  };

  botButton.addEventListener('click', toggleChat);
  document.getElementById('ai-chat-close').addEventListener('click', toggleChat);

  // Show tooltip after a few seconds
  setTimeout(() => {
    if (!isOpen) {
      tooltip.style.opacity = '1';
      tooltip.style.transform = 'translateX(0)';
      setTimeout(() => {
        tooltip.style.opacity = '0';
        tooltip.style.transform = 'translateX(10px)';
      }, 5000);
    }
  }, 3000);

  const form = document.getElementById('ai-chat-form');
  const input = document.getElementById('ai-chat-input');
  const messagesContainer = document.getElementById('ai-chat-messages');

  const appendMessage = (role, text) => {
    const msgDiv = document.createElement('div');
    msgDiv.style.cssText = role === 'user' 
      ? `align-self: flex-end; background: rgba(255, 255, 255, 0.1); padding: 8px 12px; border-radius: 12px 12px 0 12px; color: #fff; max-width: 85%; border: 1px solid rgba(255,255,255,0.1);`
      : `align-self: flex-start; background: rgba(56, 189, 248, 0.1); padding: 8px 12px; border-radius: 12px 12px 12px 0; color: #e0e0e0; max-width: 85%; border: 1px solid rgba(56, 189, 248, 0.3);`;
    msgDiv.innerText = text;
    messagesContainer.appendChild(msgDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    
    appendMessage('user', text);
    messagesHistory.push({ role: 'user', content: text });
    input.value = '';

    // Typing indicator
    const typingDiv = document.createElement('div');
    typingDiv.style.cssText = `align-self: flex-start; color: #38bdf8; font-size: 0.7rem; font-style: italic; margin-left: 5px;`;
    typingDiv.innerText = 'Escribiendo...';
    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    const res = await chatWithAssistant(messagesHistory);
    
    messagesContainer.removeChild(typingDiv);

    if (res.success) {
      appendMessage('assistant', res.reply);
      messagesHistory.push({ role: 'assistant', content: res.reply });
    } else {
      appendMessage('assistant', 'Lo siento, tuve un pequeño error de conexión. ¿Puedes intentar de nuevo?');
    }
  });
}
