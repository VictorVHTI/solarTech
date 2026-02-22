// main.js — SolarTech entry point

document.addEventListener('DOMContentLoaded', () => {
  const ctaBtn = document.getElementById('cta-btn');
  const heroTitle = document.getElementById('hero-title');

  // Simple interaction on button click
  ctaBtn.addEventListener('click', () => {
    heroTitle.textContent = '¡Bienvenido! 🌞';
    ctaBtn.textContent = 'Listo';
    ctaBtn.disabled = true;
  });

  console.log('SolarTech app initialized.');
});
