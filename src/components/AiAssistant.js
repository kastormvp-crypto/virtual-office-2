import { chatWithAssistant } from '../services/ai.js';

export function initAiAssistant() {
  if (document.getElementById('ai-assistant-wrapper')) return;

  const wrapper = document.createElement('div');
  wrapper.id = 'ai-assistant-wrapper';
  wrapper.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
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

  // Friendly robot SVG
  botButton.innerHTML = `
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="10" width="18" height="12" rx="4" fill="rgba(56,189,248,0.2)" stroke="#38bdf8" stroke-width="2"/>
      <path d="M7 10V6C7 4.89543 7.89543 4 9 4H15C16.1046 4 17 4.89543 17 6V10" stroke="#38bdf8" stroke-width="2" stroke-linecap="round"/>
      <circle cx="12" cy="2" r="2" fill="#38bdf8"/>
      <circle cx="8.5" cy="15.5" r="1.5" fill="#38bdf8"/>
      <circle cx="15.5" cy="15.5" r="1.5" fill="#38bdf8"/>
      <path d="M10 19C10 19 11 20 12 20C13 20 14 19 14 19" stroke="#38bdf8" stroke-width="2" stroke-linecap="round"/>
      <path d="M2 13H3" stroke="#38bdf8" stroke-width="2" stroke-linecap="round"/>
      <path d="M21 13H22" stroke="#38bdf8" stroke-width="2" stroke-linecap="round"/>
    </svg>
    <style>
      @keyframes float-bot {
        0% { transform: translateY(0px); box-shadow: 0 0 15px rgba(56, 189, 248, 0.5), inset 0 0 10px rgba(56, 189, 248, 0.3); }
        50% { transform: translateY(-8px); box-shadow: 0 0 25px rgba(56, 189, 248, 0.8), inset 0 0 15px rgba(56, 189, 248, 0.5); }
        100% { transform: translateY(0px); box-shadow: 0 0 15px rgba(56, 189, 248, 0.5), inset 0 0 10px rgba(56, 189, 248, 0.3); }
      }
      #ai-bot-btn:hover {
        transform: scale(1.1);
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
    { role: "system", content: "Eres el asistente amigable y experto de 'Tu Hoja de Vida'. Ayudas a los usuarios de Ecuador a crear su CV profesional, brindando consejos sobre qué poner en experiencia, habilidades y perfil. Eres breve, empático, entusiasta y usas emojis ocasionalmente. Usa formato texto simple." }
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
