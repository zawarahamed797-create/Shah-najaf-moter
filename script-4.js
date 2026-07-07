/* ==========================================================================
   SHAH-E-NAJAF MOTORS — script.js
   Pure vanilla JS. No dependencies.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Loading screen ---------- */
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => setTimeout(() => loader.classList.add('loaded'), 400));
  setTimeout(() => loader.classList.add('loaded'), 2200);

  /* ---------- Scroll progress + navbar + gauge needle (single rAF loop) ---------- */
  const progressBar = document.getElementById('scrollProgress');
  const navbar = document.getElementById('navbar');
  const gaugeNeedle = document.getElementById('gaugeNeedle');
  const gaugeFill = document.getElementById('gaugeFill');
  const gaugePct = document.getElementById('gaugePct');
  const GAUGE_ARC_LENGTH = 264; // approx path length for the fill arc

  if(gaugeFill){
    gaugeFill.style.strokeDasharray = GAUGE_ARC_LENGTH;
    gaugeFill.style.strokeDashoffset = GAUGE_ARC_LENGTH;
  }

  function updateOnScroll(){
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0;

    progressBar.style.width = (pct * 100) + '%';
    navbar.classList.toggle('scrolled', scrollTop > 40);

    if(gaugeNeedle){
      const angle = -90 + (pct * 180); // sweeps from -90deg to +90deg
      gaugeNeedle.setAttribute('transform', `rotate(${angle} 110 120)`);
    }
    if(gaugeFill){
      gaugeFill.style.strokeDashoffset = GAUGE_ARC_LENGTH * (1 - pct);
    }
    if(gaugePct){
      gaugePct.textContent = Math.round(pct * 100);
    }
  }

  let ticking = false;
  window.addEventListener('scroll', () => {
    if(!ticking){
      requestAnimationFrame(() => { updateOnScroll(); ticking = false; });
      ticking = true;
    }
  }, { passive:true });
  updateOnScroll();

  /* ---------- Mobile nav toggle ---------- */
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', isOpen);
  });
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', false);
    });
  });

  /* ---------- Scroll-triggered reveal animations ---------- */
  const revealTargets = document.querySelectorAll('.reveal-up, .reveal-scale');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('in');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
  revealTargets.forEach(el => revealObserver.observe(el));

  /* ---------- Animated counters ---------- */
  const counters = document.querySelectorAll('.stat-num');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => counterObserver.observe(c));

  function animateCounter(el){
    const target = parseInt(el.getAttribute('data-count'), 10) || 0;
    const duration = 1400;
    const start = performance.now();
    function tick(now){
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if(progress < 1) requestAnimationFrame(tick);
      else el.textContent = target;
    }
    requestAnimationFrame(tick);
  }

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById('year');
  if(yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Smooth in-page nav scrolling with navbar offset ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e){
      const id = this.getAttribute('href');
      if(id.length < 2) return;
      const target = document.querySelector(id);
      if(!target) return;
      e.preventDefault();
      const offset = 74;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ---------- Booking form -> WhatsApp ---------- */
  const DEALER_PHONE = '923004981297';

  const bookForm = document.getElementById('bookForm');
  if(bookForm){
    bookForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = bookForm.name.value.trim();
      const phone = bookForm.phone.value.trim();
      if(!name || !phone){
        alert('Please fill in your name and phone number.');
        return;
      }
      const model = bookForm.model.value.trim();
      const date = bookForm.date.value;
      const message = bookForm.message.value.trim();

      let text = `Hi Shah-e-Najaf Motors, I'd like to book a visit.\n`;
      text += `Name: ${name}\nPhone: ${phone}\n`;
      if(model) text += `Car / Model: ${model}\n`;
      if(date) text += `Preferred Date: ${date}\n`;
      if(message) text += `Message: ${message}\n`;

      window.open(`https://wa.me/${DEALER_PHONE}?text=${encodeURIComponent(text)}`, '_blank');
      bookForm.reset();
    });
  }

  /* ---------- Inspection request form -> WhatsApp ---------- */
  const inspectForm = document.getElementById('inspectForm');
  if(inspectForm){
    inspectForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = inspectForm.name.value.trim();
      const phone = inspectForm.phone.value.trim();
      if(!name || !phone){
        alert('Please fill in your name and phone number.');
        return;
      }
      const car = inspectForm.car.value.trim();
      const location = inspectForm.location.value.trim();
      const date = inspectForm.date.value;

      let text = `Hi Shah-e-Najaf Motors, I'd like to request a car inspection.\n`;
      text += `Name: ${name}\nPhone: ${phone}\n`;
      if(car) text += `Car: ${car}\n`;
      if(location) text += `Location: ${location}\n`;
      if(date) text += `Preferred Date: ${date}\n`;

      window.open(`https://wa.me/${DEALER_PHONE}?text=${encodeURIComponent(text)}`, '_blank');
      inspectForm.reset();
    });
  }

});
