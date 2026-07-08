export function initHologramCarousel(images) {
  const N = images.length;
  const STEP = 360 / N;
  
  const ring = document.getElementById('ring');
  const dotsWrap = document.getElementById('dots');
  const stage = document.querySelector('.stage');
  
  if (!ring || !dotsWrap || !stage) return;

  ring.innerHTML = '';
  dotsWrap.innerHTML = '';

  let rot = 0;
  let current = 0;
  let timers = [];
  // Removed isHovered and isPaused state to ensure it never stops by accident

  // 1. Dynamic Radius based on actual DOM width
  const cardWidth = ring.clientWidth || 320; 
  let RADIUS = Math.round((cardWidth / 2) / Math.tan(Math.PI / N));

  images.forEach((img, i) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.style.transform = `rotateY(${i * STEP}deg) translateZ(${RADIUS}px)`;
    card.innerHTML = `
      <div class="card-inner">
        <img src="${img.url}" alt="${img.label}">
        <div class="scan"></div>
        <div class="rim"></div>
        <div class="tag">${img.label}</div>
        <div class="beam"></div>
      </div>
    `;
    ring.appendChild(card);

    const dot = document.createElement('div');
    dot.className = 'dot';
    dotsWrap.appendChild(dot);
  });

  const cards = ring.querySelectorAll('.card');
  const dots = dotsWrap.querySelectorAll('.dot');

  function clearTimers() {
    timers.forEach(t => clearTimeout(t));
    timers = [];
  }

  function setActive(index) {
    cards.forEach(c => c.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));
    cards[index].classList.add('active');
    dots[index].classList.add('active');
    
    // Auto advance constantly (no pause on hover)
    timers.push(setTimeout(() => {
      timers.push(setTimeout(advance, 700));
    }, 1900));
  }

  function advance() {
    current = (current + 1) % N;
    rot -= STEP;
    ring.style.transform = `rotateY(${rot}deg)`;
    timers.push(setTimeout(() => setActive(current), 1150));
  }

  function goToIndex(i) {
    const diff = i - current;
    if (diff === 0) return;
    clearTimers();
    current = i;
    rot -= diff * STEP;
    ring.style.transform = `rotateY(${rot}deg)`;
    timers.push(setTimeout(() => setActive(current), 1150));
  }

  // Init
  ring.style.transform = `rotateY(0deg)`;
  timers.push(setTimeout(() => setActive(0), 300));

  // Navigation events
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => goToIndex(i));
  });

  cards.forEach((card, i) => {
    card.addEventListener('click', () => {
      // If clicking a card that is not active, rotate to it
      if (i !== current) {
         goToIndex(i);
      }
    });
  });

  // Hover to pause logic COMPLETELY REMOVED to guarantee continuous course

  // Resize handling for pure responsiveness
  window.addEventListener('resize', () => {
    const newWidth = ring.clientWidth;
    if (newWidth && newWidth !== cardWidth) {
       RADIUS = Math.round((newWidth / 2) / Math.tan(Math.PI / N));
       cards.forEach((card, i) => {
         card.style.transform = `rotateY(${i * STEP}deg) translateZ(${RADIUS}px)`;
       });
    }
  });
}
