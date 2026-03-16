/**
 * Solar Tech — main.js
 * Funcionalidades: animaciones reveal, WhatsApp feedback, formulario mailto.
 * El header (hamburguesa, dropdown, scroll shadow, nav activo)
 * está encapsulado en js/SiteHeader.js como Web Component <site-header>.
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ============================================================
     1. ANIMACIONES REVEAL al hacer scroll (Intersection Observer)
     ============================================================ */
  /* ============================================================
     1. ANIMACIONES REVEAL al hacer scroll (Intersection Observer)
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
      el.style.transitionDelay = `${i * 0.08}s`;
    });
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));


  /* ============================================================
     2. BOTÓN WHATSAPP — feedback visual al clic
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

  /* ============================================================
     3. FORMULARIO DE CONTACTO — mailto
     ============================================================ */
  const contactoForm = document.getElementById('contacto-form');

  if (contactoForm) {
    contactoForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const subjectEl = document.getElementById('mail-subject');
      const bodyEl    = document.getElementById('mail-body');
      const subject   = subjectEl.value.trim();
      const body      = bodyEl.value.trim();

      // Validar campos vacíos con feedback visual
      subjectEl.style.borderColor = subject ? '' : 'var(--orange)';
      bodyEl.style.borderColor    = body    ? '' : 'var(--orange)';

      if (!subject) { subjectEl.focus(); return; }
      if (!body)    { bodyEl.focus();    return; }

      const mailto = `mailto:lherrera@solartechsolutions.mx`
        + `?subject=${encodeURIComponent(subject)}`
        + `&body=${encodeURIComponent(body)}`;

      // window.open es más fiable que location.href para mailto
      // en todos los navegadores y entornos locales/producción
      window.open(mailto, '_self');
    });
  }
});
