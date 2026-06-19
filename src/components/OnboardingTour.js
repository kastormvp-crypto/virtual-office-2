export function startOnboarding(targetSelector, message) {
  // Give DOM a tiny moment to render the target
  setTimeout(() => {
    const target = document.querySelector(targetSelector);
    if (!target) return;

    if (document.getElementById('onboarding-overlay')) return; // Already running

    const rect = target.getBoundingClientRect();
    
    // Create the dark overlay with a "hole" (spotlight)
    const overlay = document.createElement('div');
    overlay.id = 'onboarding-overlay';
    overlay.style.cssText = `
      position: fixed;
      top: 0; left: 0; width: 100vw; height: 100vh;
      z-index: 9997;
      pointer-events: none;
      transition: all 0.5s ease;
      background: radial-gradient(circle at ${rect.left + rect.width/2}px ${rect.top + rect.height/2}px, transparent 0, transparent ${Math.max(rect.width, rect.height) + 10}px, rgba(0,0,0,0.85) ${Math.max(rect.width, rect.height) + 40}px);
    `;

    // Highlight the target element visually above the overlay
    const originalZIndex = target.style.zIndex;
    const originalPosition = target.style.position;
    target.style.position = target.style.position === 'static' || !target.style.position ? 'relative' : target.style.position;
    target.style.zIndex = '9998';

    // Create the tooltip
    const tooltip = document.createElement('div');
    tooltip.id = 'onboarding-tooltip';
    tooltip.style.cssText = `
      position: fixed;
      top: ${rect.bottom + 20 > window.innerHeight - 150 ? rect.top - 150 : rect.bottom + 20}px;
      left: ${Math.max(20, Math.min(rect.left, window.innerWidth - 270))}px;
      background: rgba(10, 11, 16, 0.95);
      border: 2px solid #38bdf8;
      border-radius: 12px;
      padding: 15px;
      color: #fff;
      font-family: 'Inter', sans-serif;
      z-index: 9999;
      box-shadow: 0 0 20px rgba(56, 189, 248, 0.4);
      max-width: 250px;
      animation: float-bot 3s ease-in-out infinite;
      pointer-events: auto;
    `;
    tooltip.innerHTML = `
      <div style="display:flex; gap:10px; align-items:center; margin-bottom: 8px;">
         <span style="font-size:1.5rem;">🤖</span>
         <span style="font-weight:bold; color:#38bdf8; font-size:0.9rem;">Paso 1</span>
      </div>
      <p style="font-size:0.8rem; margin:0; line-height:1.4;">${message}</p>
      <button id="close-tour-btn" style="margin-top:10px; width:100%; background:#38bdf8; color:#000; border:none; padding:6px; border-radius:5px; font-weight:bold; cursor:pointer;">¡Entendido!</button>
    `;

    document.body.appendChild(overlay);
    document.body.appendChild(tooltip);

    document.getElementById('close-tour-btn').addEventListener('click', () => {
       overlay.remove();
       tooltip.remove();
       target.style.zIndex = originalZIndex;
       target.style.position = originalPosition;
       localStorage.setItem('has_seen_tour', 'true');
    });

  }, 500); // 500ms delay to ensure view is fully loaded before targeting
}
