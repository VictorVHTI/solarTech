/**
 * Solar Tech — site.js
 * Comportamientos compartidos por todas las páginas (rediseño v1):
 *   1. <site-related current="slug">  → tarjetas de otras soluciones
 *   2. Contadores animados  [data-count]
 *   3. Animación de entrada al hacer scroll
 *   4. Navegación de proyectos (.pnav) con enlace activo
 */

/* ============================================================
   1. SERVICIOS RELACIONADOS
   ============================================================ */
const ST_SERVICES = [
  { slug: 'productos',                  tag: 'Soluciones',  title: 'Productos y Servicios',     img: 'Proyecto_Woolworth/5.webp' },
  { slug: 'nuestros-proyectos',         tag: 'Metodología', title: 'Ingeniería Integral EPC',   img: 'Proyecto_Talayote/2.webp' },
  { slug: 'proyectos-realizados',       tag: 'Portafolio',  title: 'Proyectos Realizados',      img: 'Proyecto_Talayote/12.webp' },
  { slug: 'ingenierias-iniciales',      tag: 'Ingeniería',  title: 'Ingenierías Iniciales',     img: 'Proyecto_Woolworth/13.webp' },
  { slug: 'supervision-ingenieria',     tag: 'Supervisión', title: 'Supervisión de Obra',       img: 'Proyecto_Woolworth/7.webp' },
  { slug: 'mantenimientos-correctivos', tag: 'Servicio',    title: 'Mantenimiento y Pruebas',   img: 'Mantenimientos_correctivos/4.webp' },
  { slug: 'termografia-drones',         tag: 'Nuevo',       title: 'Termografía con Drones',    img: 'Proyecto_Talayote/3.webp', thermal: true },
  { slug: 'servicios-adicionales',      tag: 'Valor agregado', title: 'Servicios Adicionales',  img: 'Due_Diligence/2.webp' },
];

class SiteRelated extends HTMLElement {
  connectedCallback() {
    const inPages = window.location.pathname.includes('/pages/');
    const root    = inPages ? '../' : '';
    const pages   = inPages ? '' : 'pages/';
    const current = this.getAttribute('current');
    const start   = Math.max(0, ST_SERVICES.findIndex(s => s.slug === current));

    // Las 3 soluciones siguientes a la actual (en orden circular)
    const picks = [1, 2, 3].map(n => ST_SERVICES[(start + n) % ST_SERVICES.length]);

    this.innerHTML = `
      <section class="h-section h-section--paper">
        <div class="h-wrap">
          <div class="h-head h-head--split">
            <div>
              <span class="h-eyebrow">Sigue explorando</span>
              <h2 class="h-title">Otras soluciones</h2>
            </div>
            <a href="${root}index.html#soluciones" class="h-link">Ver todas</a>
          </div>
          <div class="related">
            ${picks.map(s => `
              <a href="${pages}${s.slug}.html" class="rcard">
                <img src="${root}assets/img/${s.img}" alt="" loading="lazy"${s.thermal ? ' class="is-thermal"' : ''} />
                <span>${s.tag}</span>
                <strong>${s.title} →</strong>
              </a>`).join('')}
          </div>
        </div>
      </section>`;
  }
}
customElements.define('site-related', SiteRelated);


document.addEventListener('DOMContentLoaded', () => {

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ============================================================
     2. CONTADORES
     ============================================================ */
  const animateCount = (el) => {
    const target   = parseFloat(el.dataset.count);
    const decimals = Number(el.dataset.decimals || 0);
    const suffix   = el.dataset.suffix || '';
    const start    = performance.now();
    const duration = 1400;

    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const value = target * eased;
      el.textContent = (decimals ? value.toFixed(decimals) : Math.round(value).toLocaleString('es-MX')) + suffix;
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };


  /* ============================================================
     3. ANIMACIÓN DE ENTRADA
     ============================================================ */
  if (!reduceMotion) {
    document.querySelectorAll('[data-count]').forEach(animateCount);

    const revealEls = document.querySelectorAll([
      '.h-head', '.pcard', '.svc__item', '.step', '.istep', '.icard', '.cred',
      '.wcard', '.rcard', '.h-cta__inner', '.h-contact__info', '.h-contact__side',
      '.proj__head', '.p-split > *', '.ftable-wrap', '.p-gallery', '.prose', '.srow', '.detect li',
    ].join(','));

    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach((el) => {
      // Escalonado entre hermanos del mismo grupo
      const index = [...el.parentElement.children].indexOf(el);
      el.style.transitionDelay = `${Math.min(index, 5) * 70}ms`;
      el.classList.add('h-reveal');
      // Al terminar, limpiar para no interferir con los hovers propios
      const done = (e) => {
        if (e.target !== el) return;
        el.classList.remove('h-reveal', 'is-in');
        el.style.transitionDelay = '';
        el.removeEventListener('transitionend', done);
      };
      el.addEventListener('transitionend', done);
      io.observe(el);
    });
  }


  /* ============================================================
     4. NAVEGACIÓN DE PROYECTOS
     ============================================================ */
  const pnavLinks = document.querySelectorAll('.pnav a[href^="#"]');

  if (pnavLinks.length) {
    const targets = [...pnavLinks].map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
    const spy = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        pnavLinks.forEach(a => a.classList.toggle('is-active', a.getAttribute('href') === `#${entry.target.id}`));
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    targets.forEach(t => spy.observe(t));
  }
});


/* ============================================================
   5. COMPARADOR VISUAL / TÉRMICO
   ============================================================ */
document.querySelectorAll('.tcompare').forEach((box) => {
  const range = box.querySelector('.tcompare__range');
  if (!range) return;
  const update = () => box.style.setProperty('--pos', `${range.value}%`);
  range.addEventListener('input', update);
  update();
});
