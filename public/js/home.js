/**
 * Solar Tech — home.js
 * Funcionalidades exclusivas del home (rediseño v1):
 *   1. Control de pausa del video del hero
 *   2. Cotización rápida (estimación + envío por WhatsApp)
 *   3. Carrusel de proyectos (flechas)
 * Contadores y animaciones de entrada viven en js/site.js.
 */

document.addEventListener('DOMContentLoaded', () => {

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ============================================================
     1. VIDEO HERO — pausa/reproducción (accesibilidad)
     ============================================================ */
  const video  = document.getElementById('hero-video');
  const toggle = document.getElementById('hero-toggle');

  if (video && toggle) {
    const setPaused = (paused) => {
      toggle.classList.toggle('paused', paused);
      toggle.setAttribute('aria-label', paused ? 'Reproducir video' : 'Pausar video');
    };

    if (reduceMotion) { video.pause(); setPaused(true); }

    toggle.addEventListener('click', () => {
      if (video.paused) { video.play(); setPaused(false); }
      else              { video.pause(); setPaused(true); }
    });
  }


  /* ============================================================
     2. COTIZACIÓN RÁPIDA
     Estimación referencial (no sustituye el análisis del recibo):
       consumo   = pago / tarifa promedio ($/kWh)
       kWp       = consumo diario / (HSP × eficiencia)
       paneles   = kWp / potencia del panel
     ============================================================ */
  const WHATSAPP_NUMBER = '524431044109';
  const PANEL_W   = 590;  // W por panel
  const HSP       = 5.3;  // horas solares pico promedio (centro de México)
  const EFFICIENCY = 0.8; // pérdidas del sistema
  const COVERAGE  = 0.95; // % del consumo a cubrir
  const PROFILES  = {
    hogar:     { label: 'Hogar',     period: 'bimestral', days: 60, perYear: 6,  priceKwh: 3.2, max: 30000 },
    negocio:   { label: 'Negocio',   period: 'mensual',   days: 30, perYear: 12, priceKwh: 5.2, max: 60000 },
    industria: { label: 'Industria', period: 'mensual',   days: 30, perYear: 12, priceKwh: 2.9, max: 300000 },
  };

  const form = document.getElementById('quote-form');

  if (form) {
    const range     = document.getElementById('quote-bill');
    const billOut   = document.getElementById('quote-bill-value');
    const periodOut = document.getElementById('quote-period');
    const kwpOut    = document.getElementById('quote-kwp');
    const panelsOut = document.getElementById('quote-panels');
    const savingOut = document.getElementById('quote-saving');
    const nameEl    = document.getElementById('quote-name');
    const cityEl    = document.getElementById('quote-city');

    const money = (n) => '$' + Math.round(n).toLocaleString('es-MX');
    const profile = () => PROFILES[form.elements.tipo.value];

    const estimate = () => {
      const p     = profile();
      const bill  = Number(range.value);
      const daily = bill / p.priceKwh / p.days;
      const kwp   = (daily * COVERAGE) / (HSP * EFFICIENCY);
      return {
        bill,
        kwp,
        panels: Math.max(1, Math.ceil((kwp * 1000) / PANEL_W)),
        saving: bill * p.perYear * COVERAGE,
      };
    };

    const render = () => {
      const p = profile();
      const e = estimate();
      const fill = ((range.value - range.min) / (range.max - range.min)) * 100;
      range.style.setProperty('--fill', `${fill}%`);
      periodOut.textContent = p.period;
      billOut.textContent   = money(e.bill) + (Number(range.value) >= Number(range.max) ? '+' : '');
      kwpOut.textContent    = e.kwp.toFixed(e.kwp < 10 ? 1 : 0);
      panelsOut.textContent = e.panels;
      savingOut.textContent = money(e.saving);
    };

    // Al cambiar de tipo de cliente se ajusta el rango del slider
    form.querySelectorAll('input[name="tipo"]').forEach(radio => {
      radio.addEventListener('change', () => {
        const p = profile();
        range.max  = p.max;
        range.step = p.max > 60000 ? 2500 : 500;
        if (Number(range.value) > p.max) range.value = p.max;
        render();
      });
    });

    range.addEventListener('input', render);
    render();

    form.addEventListener('submit', (ev) => {
      ev.preventDefault();
      const name = nameEl.value.trim();
      nameEl.classList.toggle('is-invalid', !name);
      if (!name) { nameEl.focus(); return; }

      const p = profile();
      const e = estimate();
      const city = cityEl.value.trim();
      const msg = [
        `Hola, soy ${name}${city ? ` de ${city}` : ''}. Quiero una cotización de Solar Tech.`,
        `• Tipo: ${p.label}`,
        `• Pago ${p.period} a CFE: ${money(e.bill)} MXN`,
        `• Estimado web: ${e.kwp.toFixed(1)} kWp / ${e.panels} paneles`,
      ].join('\n');

      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener');
    });

    nameEl.addEventListener('input', () => nameEl.classList.remove('is-invalid'));
  }


  /* ============================================================
     3. CARRUSEL DE PROYECTOS
     ============================================================ */
  const rail = document.getElementById('proj-rail');
  const prev = document.getElementById('proj-prev');
  const next = document.getElementById('proj-next');

  if (rail && prev && next) {
    const step = () => {
      const card = rail.querySelector('.pcard');
      return card ? card.getBoundingClientRect().width + 20 : 400;
    };
    prev.addEventListener('click', () => rail.scrollBy({ left: -step(), behavior: 'smooth' }));
    next.addEventListener('click', () => rail.scrollBy({ left:  step(), behavior: 'smooth' }));
  }
});
