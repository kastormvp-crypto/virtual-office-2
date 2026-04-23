/**
 * Premium Toast Notification System
 */
export const showToast = (message, type = 'success') => {
  const container = document.getElementById('toast-container') || createContainer();
  
  const toast = document.createElement('div');
  toast.className = `glass animate-fade toast ${type}`;
  toast.innerHTML = `
    <div class="toast-content">
      <span class="toast-icon">${type === 'success' ? '✓' : '✕'}</span>
      <span class="toast-msg">${message}</span>
    </div>
  `;
  
  container.appendChild(toast);
  
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(20px)';
    setTimeout(() => toast.remove(), 500);
  }, 4000);
};

function createContainer() {
  const container = document.createElement('div');
  container.id = 'toast-container';
  container.style.cssText = `
    position: fixed;
    top: 2rem;
    right: 2rem;
    z-index: 9999;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    pointer-events: none;
  `;
  document.body.appendChild(container);

  // Add styles to head if not present
  if (!document.getElementById('toast-styles')) {
    const style = document.createElement('style');
    style.id = 'toast-styles';
    style.textContent = `
      .toast {
        padding: 1rem 1.5rem;
        min-width: 250px;
        pointer-events: auto;
        color: white;
        display: flex;
        align-items: center;
        border-right: 4px solid transparent;
        transition: all 0.5s ease;
      }
      .toast.success { border-right-color: #4ade80; }
      .toast.error { border-right-color: #f87171; }
      .toast-content { display: flex; align-items: center; gap: 0.8rem; }
      .toast-icon { 
        font-weight: bold; 
        font-size: 1.2rem;
      }
      .toast.success .toast-icon { color: #4ade80; }
      .toast.error .toast-icon { color: #f87171; }
    `;
    document.head.appendChild(style);
  }
  
  return container;
}
