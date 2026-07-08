// ─── CAROUSEL INTELIGENTE ────────────────────────────────────────────────────
// Desktop (≥800px): Carrusel 3D holográfico (igual que antes)
// Mobile  (<800px): Slider horizontal fluido con scroll-snap nativo

export function initHologramCarousel(images) {
  const isMobile = window.innerWidth < 800;

  if (isMobile) {
    initMobileSlider(images);
  } else {
    init3DCarousel(images);
  }
}

// ─── MOBILE: Slider Scroll-Snap (fluido en cualquier celular) ─────────────────
function initMobileSlider(images) {
  const stage = document.querySelector('.stage');
  if (!stage) return;

  // Reemplazar el contenido del stage con el slider
  stage.innerHTML = `
    <div class="mobile-slider-track" id="mobile-slider">
      ${images.map((img, i) => `
        <div class="mobile-slide ${i === 0 ? 'active' : ''}" data-index="${i}">
          <div class="mobile-slide-inner">
            <img src="${img.url}" alt="${img.label}" loading="lazy">
            <div class="mobile-slide-tag">${img.label}</div>
          </div>
        </div>
      `).join('')}
    </div>
    <div class="mobile-slider-dots" id="mobile-dots">
      ${images.map((_, i) => `<div class="mobile-dot ${i === 0 ? 'active' : ''}" data-dot="${i}"></div>`).join('')}
    </div>
  `;

  const track = document.getElementById('mobile-slider');
  const dots = document.querySelectorAll('.mobile-dot');
  const slides = document.querySelectorAll('.mobile-slide');
  let current = 0;
  let autoTimer = null;

  // Actualizar estado activo
  function setActive(index) {
    slides.forEach(s => s.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));
    if (slides[index]) slides[index].classList.add('active');
    if (dots[index]) dots[index].classList.add('active');
    current = index;
  }

  // Scroll hacia un índice
  function goTo(index, smooth = true) {
    const slide = slides[index];
    if (!slide) return;
    
    // En lugar de scrollIntoView (que puede mover la página entera en Android),
    // calculamos la posición exacta y movemos SOLO el track del carrusel.
    const slideRect = slide.getBoundingClientRect();
    const trackRect = track.getBoundingClientRect();
    const scrollPos = track.scrollLeft + (slideRect.left - trackRect.left) - (track.clientWidth / 2) + (slide.clientWidth / 2);
    
    track.scrollTo({
      left: scrollPos,
      behavior: smooth ? 'smooth' : 'instant'
    });
    
    setActive(index);
  }

  // Autoavance cada 3 segundos
  function startAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(() => {
      const next = (current + 1) % images.length;
      goTo(next);
    }, 3000);
  }

  // Detectar qué slide es visible tras scroll
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const index = parseInt(entry.target.dataset.index);
        setActive(index);
      }
    });
  }, { root: track, threshold: 0.6 });

  slides.forEach(slide => observer.observe(slide));

  // Parar autoavance al tocar, reanudar tras soltar
  track.addEventListener('touchstart', () => clearInterval(autoTimer), { passive: true });
  track.addEventListener('touchend', () => startAuto(), { passive: true });

  // Dots: click para ir a ese slide
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      goTo(i);
      clearInterval(autoTimer);
      startAuto();
    });
  });

  // Forzar el centrado exacto del primer slide instantáneamente al iniciar
  setTimeout(() => goTo(0, false), 10);
  startAuto();
}

// ─── DESKTOP: Carrusel 3D original (sin cambios) ─────────────────────────────
function init3DCarousel(images) {
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
      if (i !== current) goToIndex(i);
    });
  });

  // Resize
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
