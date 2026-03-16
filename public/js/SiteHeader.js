/**
 * Solar Tech — SiteHeader.js
 * Web Component <site-header>
 *
 * Uso:
 *   <site-header></site-header>
 *
 * Atributo opcional:
 *   depth="0"  → raíz public/   (default)
 *   depth="1"  → pages/
 *
 * El componente detecta la profundidad automáticamente
 * mirando window.location.pathname.
 */

class SiteHeader extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    // ── Resolver rutas relativas según profundidad ──────────────
    // Detectamos si la URL tiene /pages/ en la ruta
    const inPages = window.location.pathname.includes('/pages/');
    const root    = inPages ? '../'  : '';       // prefijo para assets/css
    const home    = inPages ? '../index.html' : 'index.html';
    const pages   = inPages ? '../pages/'    : 'pages/';

    // ── HTML del header ─────────────────────────────────────────
    this.innerHTML = /* html */`
      <header class="header" id="header">
        <div class="header__inner">

          <!-- Logo -->
          <a href="${home}#inicio" class="header__logo">
            <img
              src="${root}assets/img/logo_st.png"
              alt="Solar Tech Logo"
              class="header__logo-img"
              onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"
            />
            <span class="header__logo-fallback">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="28" height="28" aria-hidden="true">
                <circle cx="12" cy="12" r="5"/>
                <line x1="12" y1="2"  x2="12" y2="4"  stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>
                <line x1="12" y1="20" x2="12" y2="22" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>
                <line x1="2"  y1="12" x2="4"  y2="12" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>
                <line x1="20" y1="12" x2="22" y2="12" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>
                <line x1="4.93"  y1="4.93"  x2="6.34"  y2="6.34"  stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>
                <line x1="17.66" y1="17.66" x2="19.07" y2="19.07" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>
                <line x1="4.93"  y1="19.07" x2="6.34"  y2="17.66" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>
                <line x1="17.66" y1="6.34"  x2="19.07" y2="4.93"  stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>
              </svg>
            </span>
            <span class="header__logo-name">SolarTech</span>
          </a>

          <!-- Nav desktop -->
          <nav class="nav" id="nav" aria-label="Navegación principal">
            <a href="${home}#inicio"    class="nav__link">Inicio</a>
            <a href="${home}#productos" class="nav__link">Productos</a>
            <a href="${home}#ubicacion" class="nav__link">Ubicación</a>

            <!-- Dropdown Explora -->
            <div class="nav__dropdown" id="nav-dropdown">
              <button class="nav__dropdown-btn" id="nav-dropdown-btn"
                      aria-haspopup="true" aria-expanded="false" type="button">
                Explora
                <svg class="nav__dropdown-chevron" xmlns="http://www.w3.org/2000/svg"
                     width="14" height="14" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" stroke-width="2.5"
                     stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>
              <div class="nav__dropdown-menu" id="nav-dropdown-menu" role="menu">
                <a href="${pages}nuestros-proyectos.html" class="nav__dropdown-item" role="menuitem">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                  Nuestros Proyectos
                </a>
                <a href="${pages}proyectos-realizados.html" class="nav__dropdown-item" role="menuitem">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                  Proyectos Realizados
                </a>
                <a href="${pages}mantenimientos-correctivos.html" class="nav__dropdown-item" role="menuitem">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
                  Mantenimientos Correctivos
                </a>
                <a href="${pages}supervision-ingenieria.html" class="nav__dropdown-item" role="menuitem">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                  Supervisión de Ingeniería
                </a>
                <a href="${pages}ingenierias-iniciales.html" class="nav__dropdown-item" role="menuitem">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/></svg>
                  Ingenierías Iniciales
                </a>
                <a href="${pages}servicios-adicionales.html" class="nav__dropdown-item" role="menuitem">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
                  Servicios Adicionales
                </a>
              </div>
            </div>

            <a href="${home}#contacto" class="nav__link nav__link--cta">Contacto</a>
          </nav>

          <!-- Botón hamburguesa (mobile) -->
          <button class="hamburger" id="hamburger"
                  aria-label="Abrir menú" aria-expanded="false" aria-controls="nav">
            <span class="hamburger__bar"></span>
            <span class="hamburger__bar"></span>
            <span class="hamburger__bar"></span>
          </button>

        </div>
      </header>
    `;

    // ── Inicializar comportamientos ──────────────────────────────
    this._initHamburger();
    this._initDropdown();
    this._initScrollShadow();
    this._initActiveLink();
  }

  // ── 1. Menú hamburguesa ────────────────────────────────────────
  _initHamburger() {
    const hamburger = this.querySelector('#hamburger');
    const nav       = this.querySelector('#nav');

    hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = nav.classList.toggle('nav--open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
    });

    // Cerrar al hacer clic en un nav__link (no en el dropdown-btn)
    nav.querySelectorAll('.nav__link').forEach(link => {
      link.addEventListener('click', () => this._closeMenu());
    });

    // Cerrar al hacer clic fuera
    document.addEventListener('click', (e) => {
      if (!this.contains(e.target)) this._closeMenu();
    });
  }

  // ── 2. Dropdown "Explora" ──────────────────────────────────────
  _initDropdown() {
    const btn  = this.querySelector('#nav-dropdown-btn');
    const menu = this.querySelector('#nav-dropdown-menu');

    if (!btn || !menu) return;

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = menu.classList.toggle('open');
      btn.classList.toggle('open', isOpen);
      btn.setAttribute('aria-expanded', String(isOpen));
    });

    // Cerrar dropdown al hacer clic en cualquier item
    menu.querySelectorAll('.nav__dropdown-item').forEach(item => {
      item.addEventListener('click', () => this._closeDropdown());
    });

    // Cerrar dropdown al hacer clic fuera
    document.addEventListener('click', (e) => {
      if (!this.querySelector('#nav-dropdown').contains(e.target)) {
        this._closeDropdown();
      }
    });

    // Cerrar dropdown con Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this._closeDropdown();
    });
  }

  // ── 3. Sombra del header al hacer scroll ──────────────────────
  _initScrollShadow() {
    const header = this.querySelector('#header');
    const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ── 4. Nav link activo (solo funciona en index.html con #anchors) ─
  _initActiveLink() {
    const sections = document.querySelectorAll('section[id]');
    const links    = this.querySelectorAll('.nav__link');

    if (!sections.length) return;

    const setActive = () => {
      let currentId = '';
      sections.forEach(s => {
        if (window.scrollY >= s.offsetTop - 100) currentId = s.id;
      });
      links.forEach(link => {
        const href = link.getAttribute('href') || '';
        link.classList.toggle('active', href.endsWith(`#${currentId}`));
      });
    };

    window.addEventListener('scroll', setActive, { passive: true });
    setActive();
  }

  // ── Helpers ───────────────────────────────────────────────────
  _closeMenu() {
    const hamburger = this.querySelector('#hamburger');
    const nav       = this.querySelector('#nav');
    nav?.classList.remove('nav--open');
    hamburger?.classList.remove('open');
    hamburger?.setAttribute('aria-expanded', 'false');
  }

  _closeDropdown() {
    const btn  = this.querySelector('#nav-dropdown-btn');
    const menu = this.querySelector('#nav-dropdown-menu');
    btn?.classList.remove('open');
    btn?.setAttribute('aria-expanded', 'false');
    menu?.classList.remove('open');
  }
}

customElements.define('site-header', SiteHeader);
