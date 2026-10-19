const header = document.getElementById('header');
const burger = document.getElementById('burger');

const onScroll = () => {
  if (!header || header.hasAttribute('data-solid')) return;
  header.classList.toggle('scrolled', window.scrollY > 30);
};
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

if (burger && header) {
  burger.addEventListener('click', () => {
    const open = header.classList.toggle('open');
    burger.setAttribute('aria-expanded', open);
  });
}

document.querySelectorAll('.nav a').forEach(a =>
  a.addEventListener('click', () => {
    if (header) header.classList.remove('open');
    if (burger) burger.setAttribute('aria-expanded', false);
  })
);

// Interactive OPPO Reno16 5G Color Switcher
const renoSection = document.getElementById('reno-spotlight');
const renoImg = document.getElementById('renoPhoneImg');
const renoDesc = document.getElementById('renoDesc');
document.querySelectorAll('[data-reno-color]').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('[data-reno-color]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const colorIdx = btn.dataset.renoColor;
    if (renoSection) renoSection.setAttribute('data-theme', colorIdx);
    if (renoImg && btn.dataset.img) {
      renoImg.style.opacity = '0.2';
      renoImg.style.transform = 'scale(0.96)';
      setTimeout(() => {
        renoImg.src = btn.dataset.img;
        renoImg.alt = 'OPPO Reno16 5G ' + btn.textContent.trim();
        renoImg.style.opacity = '1';
        renoImg.style.transform = 'scale(1)';
      }, 160);
    }
    if (renoDesc && btn.dataset.desc) {
      renoDesc.textContent = btn.dataset.desc;
    }
  });
});

// Smartphone Category Filter Tabs
const filterTabs = document.querySelectorAll('[data-filter]');
const phoneCards = document.querySelectorAll('#phoneGrid [data-category]');
filterTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    filterTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const filter = tab.dataset.filter;
    phoneCards.forEach(card => {
      const show = filter === 'all' || card.dataset.category === filter;
      card.style.display = show ? 'flex' : 'none';
    });
  });
});

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
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => io.observe(el));
document.querySelectorAll('[data-count]').forEach(el => {
  if (!el.closest('.reveal')) io.observe(el);
});

const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

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
    console.log('Contact submission', data);
    form.hidden = true;
    document.getElementById('formSuccess').hidden = false;
  });
}
