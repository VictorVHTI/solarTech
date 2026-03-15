/**
 * Solar Tech — carousel.js
 * Componente autónomo de carrusel. Se auto-inicializa en DOMContentLoaded
 * buscando todos los elementos `.mc-carousel` en el DOM.
 *
 * Estructura HTML esperada dentro de cada `.mc-carousel`:
 *   .mc-carousel__track > .mc-carousel__slide (N slides)
 *   .mc-carousel__btn--prev
 *   .mc-carousel__btn--next
 *   .mc-carousel__dots  (vacío — se genera dinámicamente)
 *
 * Estructura HTML esperada FUERA pero asociada (siguiente hermano .mc-thumbs):
 *   .mc-thumbs > .mc-thumbs__track > .mc-thumb[data-index="N"]
 *
 * NO requiere IDs ni scripts inline en las páginas.
 * Cada carrusel opera de forma completamente aislada.
 */

(function () {
  'use strict';

  const AUTOPLAY_MS     = 4500;
  const SWIPE_THRESHOLD = 40;  // px mínimos para contar como swipe

  function buildCarousel(carousel) {
    const track    = carousel.querySelector('.mc-carousel__track');
    const slides   = carousel.querySelectorAll('.mc-carousel__slide');
    const dotsWrap = carousel.querySelector('.mc-carousel__dots');
    const prevBtn  = carousel.querySelector('.mc-carousel__btn--prev');
    const nextBtn  = carousel.querySelector('.mc-carousel__btn--next');
    const total    = slides.length;

    if (!track || total === 0) return;

    // Los thumbnails viven en el siguiente elemento hermano .mc-thumbs
    const thumbsEl  = carousel.nextElementSibling;
    const thumbBtns = (thumbsEl && thumbsEl.classList.contains('mc-thumbs'))
      ? thumbsEl.querySelectorAll('.mc-thumb')
      : [];

    let current   = 0;
    let autoTimer = null;

    /* ── Generar dots ─────────────────────────────────────── */
    if (dotsWrap) {
      dotsWrap.innerHTML = ''; // limpiar si ya había
      for (let i = 0; i < total; i++) {
        const dot = document.createElement('button');
        dot.className  = 'mc-dot' + (i === 0 ? ' active' : '');
        dot.type       = 'button';
        dot.setAttribute('aria-label', 'Ir a imagen ' + (i + 1));
        dot.addEventListener('click', () => goTo(i));
        dotsWrap.appendChild(dot);
      }
    }

    /* ── goTo ─────────────────────────────────────────────── */
    function goTo(idx) {
      current = ((idx % total) + total) % total;

      track.style.transform = 'translateX(-' + (current * 100) + '%)';

      // Dots
      if (dotsWrap) {
        dotsWrap.querySelectorAll('.mc-dot').forEach((d, i) =>
          d.classList.toggle('active', i === current)
        );
      }

      // Thumbnails — centrar dentro del contenedor .mc-thumbs
      // sin usar scrollIntoView que escala al documento
      thumbBtns.forEach((b, i) => b.classList.toggle('active', i === current));
      const activeThumb  = thumbBtns[current];
      const thumbsTrack  = activeThumb && activeThumb.closest('.mc-thumbs');
      if (activeThumb && thumbsTrack) {
        const containerWidth = thumbsTrack.offsetWidth;
        const thumbLeft      = activeThumb.offsetLeft;
        const thumbWidth     = activeThumb.offsetWidth;
        thumbsTrack.scrollTo({
          left: thumbLeft - (containerWidth / 2) + (thumbWidth / 2),
          behavior: 'smooth'
        });
      }
    }

    /* ── Autoplay ─────────────────────────────────────────── */
    function startAuto() {
      clearInterval(autoTimer);
      autoTimer = setInterval(() => goTo(current + 1), AUTOPLAY_MS);
    }
    function stopAuto() {
      clearInterval(autoTimer);
    }

    /* ── Controles prev / next ────────────────────────────── */
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        stopAuto(); goTo(current - 1); startAuto();
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        stopAuto(); goTo(current + 1); startAuto();
      });
    }

    /* ── Thumbnails ───────────────────────────────────────── */
    thumbBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        stopAuto();
        goTo(parseInt(btn.dataset.index, 10));
        startAuto();
      });
    });

    /* ── Pausa en hover (desktop) ─────────────────────────── */
    carousel.addEventListener('mouseenter', stopAuto);
    carousel.addEventListener('mouseleave', startAuto);

    /* ── Swipe táctil ─────────────────────────────────────── */
    // Registramos los listeners en el TRACK (elemento que se mueve)
    // con { passive: false } desde touchstart para que el navegador
    // sepa desde el inicio que podemos llamar preventDefault().
    // touch-action: pan-y en el CSS complementa esto para Safari/iOS.
    let touchStartX = 0;
    let touchStartY = 0;
    let isDragging  = false;

    track.addEventListener('touchstart', e => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      isDragging  = false;
      stopAuto();
    }, { passive: false });

    track.addEventListener('touchmove', e => {
      const dx = e.touches[0].clientX - touchStartX;
      const dy = e.touches[0].clientY - touchStartY;

      // Si el movimiento horizontal supera al vertical → carrusel
      if (Math.abs(dx) > Math.abs(dy)) {
        e.preventDefault(); // evita scroll de página
        isDragging = true;
      }
      // Si es claramente vertical → no interferir (isDragging queda false)
    }, { passive: false });

    track.addEventListener('touchend', e => {
      if (!isDragging) { startAuto(); return; }
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > SWIPE_THRESHOLD) {
        goTo(diff > 0 ? current + 1 : current - 1);
      }
      isDragging = false;
      startAuto();
    });

    /* ── Iniciar ──────────────────────────────────────────── */
    goTo(0);
    startAuto();
  }

  /* ── Escanear el DOM y construir todos los carruseles ───── */
  function initAll() {
    document.querySelectorAll('.mc-carousel').forEach(buildCarousel);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll(); // ya cargó (script defer o al final del body)
  }
})();
