/**
 * Solar Tech — SiteFooter.js
 * Web Component <site-footer>, compartido por todas las páginas.
 *
 * Uso:
 *   <site-footer></site-footer>
 *
 * Igual que <site-header>, detecta si la página vive en /pages/
 * para resolver las rutas relativas.
 */

class SiteFooter extends HTMLElement {
  connectedCallback() {
    const inPages = window.location.pathname.includes('/pages/');
    const root    = inPages ? '../' : '';
    const home    = `${root}index.html`;
    const pages   = inPages ? '' : 'pages/';

    this.innerHTML = /* html */`
      <footer class="h-footer">
        <div class="h-wrap h-footer__grid">
          <div class="h-footer__brand">
            <div class="h-footer__mark">
              <img src="${root}assets/img/logo_st.png" alt="" class="h-footer__logo" />
              <span>SolarTech</span>
            </div>
            <p>Energía limpia para el futuro.</p>
            <div class="h-footer__social">
              <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18" aria-hidden="true"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18" aria-hidden="true"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.17 8.17 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z"/></svg>
              </a>
            </div>
          </div>

          <nav class="h-footer__col" aria-label="Soluciones">
            <h4>Soluciones</h4>
            <a href="${pages}productos.html">Productos y Servicios</a>
            <a href="${pages}nuestros-proyectos.html">Ingeniería EPC</a>
            <a href="${pages}ingenierias-iniciales.html">Ingenierías iniciales</a>
            <a href="${pages}supervision-ingenieria.html">Supervisión de obra</a>
            <a href="${pages}mantenimientos-correctivos.html">Mantenimiento</a>
            <a href="${pages}servicios-adicionales.html">Servicios adicionales</a>
          </nav>

          <nav class="h-footer__col" aria-label="Empresa">
            <h4>Empresa</h4>
            <a href="${pages}proyectos-realizados.html">Proyectos realizados</a>
            <a href="${root}about.html">Quiénes somos</a>
            <a href="${home}#contacto">Contacto</a>
            <a href="${root}terms.html">Términos y condiciones</a>
          </nav>

          <div class="h-footer__col">
            <h4>Contacto</h4>
            <a href="tel:+524431044109">+52 (443) 104-4109</a>
            <a href="mailto:lherrera@solartechsolutions.mx">lherrera@solartechsolutions.mx</a>
            <span>García Obeso 852, Morelia, Mich.</span>
          </div>
        </div>

        <div class="h-wrap h-footer__base">
          <span>&copy; ${new Date().getFullYear()} Solar Tech. Todos los derechos reservados.</span>
          <span>ENERTIUM SOLARTECH SOLUTIONS S.A. DE C.V. · ® Marca registrada ante el IMPI</span>
        </div>
      </footer>
    `;
  }
}

customElements.define('site-footer', SiteFooter);
