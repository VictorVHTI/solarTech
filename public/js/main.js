/**
 * Solar Tech — main.js
 * Funcionalidades: menú hamburguesa, scroll activo del nav,
 * header scroll shadow y animaciones reveal.
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ============================================================
     1. MENÚ HAMBURGUESA (mobile)
     ============================================================ */
  const hamburger = document.getElementById('hamburger');
  const nav       = document.getElementById('nav');

  hamburger.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('nav--open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
  });

  // Cerrar menú al hacer clic en un enlace
  nav.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('nav--open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  // Cerrar menú al hacer clic fuera
  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target) && !hamburger.contains(e.target)) {
      nav.classList.remove('nav--open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });


  /* ============================================================
     2. HEADER — sombra al hacer scroll
     ============================================================ */
  const header = document.getElementById('header');

  const handleHeaderScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 10);
  };

  window.addEventListener('scroll', handleHeaderScroll, { passive: true });


  /* ============================================================
     3. NAV — enlace activo según sección visible
     ============================================================ */
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav__link');

  const setActiveLink = () => {
    let currentId = '';

    sections.forEach(section => {
      const top = section.offsetTop - 100;
      if (window.scrollY >= top) {
        currentId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.toggle(
        'active',
        link.getAttribute('href') === `#${currentId}`
      );
    });
  };

  window.addEventListener('scroll', setActiveLink, { passive: true });
  setActiveLink(); // Estado inicial


  /* ============================================================
     4. ANIMACIONES REVEAL al hacer scroll (Intersection Observer)
     ============================================================ */
  // Añadir clase .reveal a los elementos que queremos animar
  const revealTargets = [
    '.card',
    '.ubicacion__info',
    '.ubicacion__map',
    '.contacto__inner > *',
    '.hero__stats',
  ];

  revealTargets.forEach(selector => {
    document.querySelectorAll(selector).forEach((el, i) => {
      el.classList.add('reveal');
      // Escalonado para los grupos
      el.style.transitionDelay = `${i * 0.08}s`;
    });
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // Solo animar una vez
        }
      });
    },
    { threshold: 0.12 }
  );

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));


  /* ============================================================
     5. BOTÓN WHATSAPP — feedback visual al clic
     ============================================================ */
  const whatsappBtn = document.getElementById('whatsapp-btn');

  if (whatsappBtn) {
    whatsappBtn.addEventListener('click', () => {
      const original = whatsappBtn.innerHTML;
      whatsappBtn.textContent = '¡Redirigiendo...';
      whatsappBtn.style.pointerEvents = 'none';

      setTimeout(() => {
        whatsappBtn.innerHTML = original;
        whatsappBtn.style.pointerEvents = '';
      }, 2500);
    });
  }


  console.log('✅ Solar Tech — app inicializada.');
});
