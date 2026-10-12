const header = document.getElementById('header');
const burger = document.getElementById('burger');

const onScroll = () => {
  if (header.hasAttribute('data-solid')) return;
  header.classList.toggle('scrolled', window.scrollY > 30);
};
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

burger.addEventListener('click', () => {
  const open = header.classList.toggle('open');
  burger.setAttribute('aria-expanded', open);
});
document.querySelectorAll('.nav a').forEach(a =>
  a.addEventListener('click', () => {
    header.classList.remove('open');
    burger.setAttribute('aria-expanded', false);
  })
);

// Counters
const animateCount = el => {
  const target = +el.dataset.count;
  const suffix = el.dataset.suffix || '';
  const start = performance.now();
  const dur = 1600;
  const tick = now => {
    const p = Math.min((now - start) / dur, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(target * eased).toLocaleString('en-IN') + suffix;
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
};

const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('in');
    e.target.querySelectorAll('[data-count]').forEach(animateCount);
    if (e.target.dataset.count) animateCount(e.target);
    io.unobserve(e.target);
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(el => io.observe(el));
document.querySelectorAll('[data-count]').forEach(el => {
  if (!el.closest('.reveal')) io.observe(el);
});

document.getElementById('year').textContent = new Date().getFullYear();

// Contact form (opt-in validation)
const form = document.getElementById('contactForm');
if (form) {
  const err = document.getElementById('formError');
  form.addEventListener('submit', e => {
    e.preventDefault();
    let ok = true;
    form.querySelectorAll('[required]').forEach(el => {
      const valid = el.type === 'checkbox' ? el.checked : el.checkValidity() && el.value.trim() !== '';
      (el.closest('.field') || el.closest('.check')).classList.toggle('invalid', !valid);
      if (!valid) ok = false;
    });
    if (!ok) {
      err.textContent = form.consent.checked
        ? 'Please fill in all required fields correctly.'
        : 'Please complete the required fields and accept the Terms & Privacy Policy to continue.';
      err.hidden = false;
      return;
    }
    err.hidden = true;
    const data = Object.fromEntries(new FormData(form));
    data.consent = true;
    data.marketing = !!form.marketing.checked;
    data.consentAt = new Date().toISOString();
    // TODO: send `data` to your backend / email service here
    console.log('Contact submission', data);
    form.hidden = true;
    document.getElementById('formSuccess').hidden = false;
  });
}
