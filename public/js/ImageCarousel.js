/**
 * <image-carousel images='["url1","url2",...]'>
 *
 * Web Component autónomo con Shadow DOM.
 * No requiere CSS externo, IDs ni scripts adicionales.
 * Uso: <image-carousel images='["../assets/img/foto1.jpg","../assets/img/foto2.jpg"]'></image-carousel>
 */
class ImageCarousel extends HTMLElement {

  /* ── Ciclo de vida ─────────────────────────────────────── */
  connectedCallback() {
    this._images   = JSON.parse(this.getAttribute('images') || '[]');
    this._current  = 0;
    this._timer    = null;
    this._autoplay = parseInt(this.getAttribute('autoplay') || '4500', 10);
    this._swipeStartX = 0;
    this._swipeStartY = 0;
    this._dragging    = false;

    this.attachShadow({ mode: 'open' });
    this._render();
    this._bind();
    this._goTo(0);
    this._startAuto();
  }

  disconnectedCallback() {
    clearInterval(this._timer);
  }

  /* ── Render ────────────────────────────────────────────── */
  _render() {
    const imgs = this._images;

    const slides = imgs.map((src, i) =>
      `<div class="slide" role="img" aria-label="Imagen ${i + 1}">
         <img src="${src}" alt="Imagen ${i + 1}" loading="${i === 0 ? 'eager' : 'lazy'}"/>
       </div>`
    ).join('');

    const dots = imgs.map((_, i) =>
      `<button class="dot${i === 0 ? ' active' : ''}" data-i="${i}" aria-label="Ir a imagen ${i + 1}" type="button"></button>`
    ).join('');

    const thumbs = imgs.map((src, i) =>
      `<button class="thumb${i === 0 ? ' active' : ''}" data-i="${i}" aria-label="Ir a imagen ${i + 1}" type="button">
         <img src="${src}" alt="" loading="lazy"/>
       </button>`
    ).join('');

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
          --accent: #FFB600;
          --radius: 12px;
          --btn-size: 44px;
        }

        /* ── Wrapper ── */
        .carousel {
          position: relative;
          width: 100%;
          overflow: hidden;
          border-radius: var(--radius);
          background: #0d1117;
          aspect-ratio: 16 / 9;
          /* Desacopla el gesto horizontal del scroll de página */
          touch-action: pan-y pinch-zoom;
        }

        /* ── Track ── */
        .track {
          display: flex;
          height: 100%;
          will-change: transform;
          transition: transform 0.42s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* ── Slides ── */
        .slide {
          flex: 0 0 100%;
          height: 100%;
          overflow: hidden;
        }
        .slide img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          pointer-events: none;
          user-select: none;
          -webkit-user-drag: none;
        }

        /* ── Botones prev / next ── */
        .btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 10;
          width: var(--btn-size);
          height: var(--btn-size);
          border-radius: 50%;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0,0,0,0.45);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          color: #fff;
          transition: background 0.2s, transform 0.2s;
        }
        .btn:hover { background: rgba(0,0,0,0.7); transform: translateY(-50%) scale(1.08); }
        .btn--prev { left: 12px; }
        .btn--next { right: 12px; }

        /* ── Dots ── */
        .dots {
          position: absolute;
          bottom: 12px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 6px;
          z-index: 10;
        }
        .dot {
          width: 8px;
          height: 8px;
          border-radius: 9999px;
          border: none;
          cursor: pointer;
          background: rgba(255,255,255,0.4);
          transition: background 0.25s, width 0.25s;
          padding: 0;
        }
        .dot.active {
          background: var(--accent);
          width: 22px;
        }

        /* ── Thumbnails ── */
        .thumbs {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          padding: 10px 4px 4px;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .thumbs::-webkit-scrollbar { display: none; }

        .thumb {
          flex: 0 0 72px;
          height: 48px;
          border-radius: 6px;
          overflow: hidden;
          border: 2px solid transparent;
          cursor: pointer;
          padding: 0;
          background: #222;
          transition: border-color 0.2s, opacity 0.2s;
          opacity: 0.55;
        }
        .thumb.active {
          border-color: var(--accent);
          opacity: 1;
        }
        .thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          pointer-events: none;
        }

        /* ── Responsive ── */
        @media (max-width: 600px) {
          .btn { width: 36px; height: 36px; }
          .thumb { flex: 0 0 56px; height: 38px; }
        }
      </style>

      <div class="carousel" part="carousel">
        <div class="track" part="track">${slides}</div>

        <button class="btn btn--prev" aria-label="Imagen anterior" type="button">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
               fill="none" stroke="currentColor" stroke-width="2.5"
               stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>

        <button class="btn btn--next" aria-label="Imagen siguiente" type="button">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
               fill="none" stroke="currentColor" stroke-width="2.5"
               stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </button>

        <div class="dots" role="tablist" aria-label="Navegación de imágenes">${dots}</div>
      </div>

      <div class="thumbs" part="thumbs">${thumbs}</div>
    `;
  }

  /* ── Bind events ───────────────────────────────────────── */
  _bind() {
    const sr = this.shadowRoot;
    const track = sr.querySelector('.track');

    /* Prev / Next */
    sr.querySelector('.btn--prev').addEventListener('click', () => {
      this._stopAuto(); this._goTo(this._current - 1); this._startAuto();
    });
    sr.querySelector('.btn--next').addEventListener('click', () => {
      this._stopAuto(); this._goTo(this._current + 1); this._startAuto();
    });

    /* Dots */
    sr.querySelectorAll('.dot').forEach(dot => {
      dot.addEventListener('click', () => {
        this._stopAuto();
        this._goTo(parseInt(dot.dataset.i, 10));
        this._startAuto();
      });
    });

    /* Thumbnails */
    sr.querySelectorAll('.thumb').forEach(thumb => {
      thumb.addEventListener('click', () => {
        this._stopAuto();
        this._goTo(parseInt(thumb.dataset.i, 10));
        this._startAuto();
      });
    });

    /* Pause on hover */
    sr.querySelector('.carousel').addEventListener('mouseenter', () => this._stopAuto());
    sr.querySelector('.carousel').addEventListener('mouseleave', () => this._startAuto());

    /* ── Swipe táctil ──────────────────────────────────────
       Los 3 listeners van en el TRACK con { passive: false }
       desde touchstart para que el browser sepa desde el
       primer evento que podemos llamar preventDefault().
       Así el scroll de página queda completamente desacoplado
       cuando el gesto es horizontal.
    ───────────────────────────────────────────────────────── */
    track.addEventListener('touchstart', e => {
      this._swipeStartX = e.touches[0].clientX;
      this._swipeStartY = e.touches[0].clientY;
      this._dragging    = false;
      this._stopAuto();
    }, { passive: false });

    track.addEventListener('touchmove', e => {
      const dx = e.touches[0].clientX - this._swipeStartX;
      const dy = e.touches[0].clientY - this._swipeStartY;

      if (Math.abs(dx) > Math.abs(dy)) {
        // Gesto horizontal → bloquear scroll de página
        e.preventDefault();
        this._dragging = true;
      }
      // Gesto vertical → dejar pasar (isDragging queda false)
    }, { passive: false });

    track.addEventListener('touchend', e => {
      if (!this._dragging) { this._startAuto(); return; }
      const diff = this._swipeStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) {
        this._goTo(diff > 0 ? this._current + 1 : this._current - 1);
      }
      this._dragging = false;
      this._startAuto();
    }, { passive: true });
  }

  /* ── goTo ──────────────────────────────────────────────── */
  _goTo(idx) {
    const total = this._images.length;
    this._current = ((idx % total) + total) % total;

    // Mover track
    this.shadowRoot.querySelector('.track').style.transform =
      `translateX(-${this._current * 100}%)`;

    // Dots
    this.shadowRoot.querySelectorAll('.dot').forEach((d, i) =>
      d.classList.toggle('active', i === this._current)
    );

    // Thumbnails — activar clase y centrar dentro del contenedor .thumbs
    // SIN usar scrollIntoView (que escala al documento y scrollea la página)
    const thumbs      = this.shadowRoot.querySelectorAll('.thumb');
    const thumbsTrack = this.shadowRoot.querySelector('.thumbs');

    thumbs.forEach((t, i) => t.classList.toggle('active', i === this._current));

    const activeThumb = thumbs[this._current];
    if (activeThumb && thumbsTrack) {
      // Calcular el scroll necesario para centrar el thumb activo
      // dentro del contenedor, sin tocar el scroll del documento.
      const containerWidth = thumbsTrack.offsetWidth;
      const thumbLeft      = activeThumb.offsetLeft;
      const thumbWidth     = activeThumb.offsetWidth;
      const targetScroll   = thumbLeft - (containerWidth / 2) + (thumbWidth / 2);

      thumbsTrack.scrollTo({ left: targetScroll, behavior: 'smooth' });
    }
  }

  /* ── Autoplay ──────────────────────────────────────────── */
  _startAuto() {
    clearInterval(this._timer);
    this._timer = setInterval(() => this._goTo(this._current + 1), this._autoplay);
  }
  _stopAuto() {
    clearInterval(this._timer);
  }
}

customElements.define('image-carousel', ImageCarousel);
