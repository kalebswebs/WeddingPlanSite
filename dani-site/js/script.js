document.getElementById('year').textContent = new Date().getFullYear();

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ===================== HERO SLIDESHOW ===================== */
(function initSlideshow(){
  const root = document.getElementById('heroSlideshow');
  if (!root) return;

  const slides = Array.from(root.querySelectorAll('.slide'));
  const dashes = Array.from(root.querySelectorAll('.slide-dash'));
  const prevBtn = root.querySelector('.slide-arrow[data-dir="-1"]');
  const nextBtn = root.querySelector('.slide-arrow[data-dir="1"]');
  const INTERVAL = 5000;
  let current = 0;
  let timer = null;

  function show(index){
    current = (index + slides.length) % slides.length;
    slides.forEach((s, i) => s.classList.toggle('is-active', i === current));
    dashes.forEach((d, i) => {
      d.classList.toggle('is-active', i === current);
      d.setAttribute('aria-selected', i === current ? 'true' : 'false');
    });
  }

  function next(){ show(current + 1); }
  function prev(){ show(current - 1); }

  function play(){
    if (reduceMotion) return;
    stop();
    timer = setInterval(next, INTERVAL);
  }
  function stop(){ if (timer) clearInterval(timer); timer = null; }

  nextBtn && nextBtn.addEventListener('click', () => { next(); play(); });
  prevBtn && prevBtn.addEventListener('click', () => { prev(); play(); });
  dashes.forEach(d => d.addEventListener('click', () => {
    show(parseInt(d.dataset.index, 10));
    play();
  }));

  root.addEventListener('mouseenter', stop);
  root.addEventListener('mouseleave', play);
  root.addEventListener('focusin', stop);
  root.addEventListener('focusout', play);

  show(0);
  play();
})();

/* ===================== SCROLL REVEAL ===================== */
(function initReveal(){
  const targets = document.querySelectorAll(
    '.section-title, .section-sub, .boarding-pass, .investment-visual, .investment-copy, .about-visual, .about-copy, .hero-copy'
  );
  targets.forEach(el => el.classList.add('reveal'));

  if (reduceMotion || !('IntersectionObserver' in window)) {
    targets.forEach(el => el.classList.add('is-visible'));
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  targets.forEach(el => io.observe(el));
})();

/* ===================== HEADER SCROLL STATE ===================== */
(function initHeaderState(){
  const header = document.getElementById('siteHeader');
  if (!header) return;
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 12);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
})();

/* ===================== MOBILE MENU ===================== */
(function initMobileMenu(){
  const toggle = document.getElementById('menuToggle');
  const header = document.getElementById('siteHeader');
  if (!toggle || !header) return;

  toggle.addEventListener('click', () => {
    const isOpen = header.classList.toggle('nav-open');
    toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  header.querySelectorAll('.primary-nav a, .nav-cta').forEach(link => {
    link.addEventListener('click', () => {
      header.classList.remove('nav-open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
})();

/* ===================== CARD TILT (subtle, pointer devices only) ===================== */
(function initTilt(){
  if (reduceMotion || window.matchMedia('(pointer: coarse)').matches) return;
  const cards = document.querySelectorAll('.boarding-pass');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(700px) rotateX(${(-y * 4).toFixed(2)}deg) rotateY(${(x * 4).toFixed(2)}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
})();