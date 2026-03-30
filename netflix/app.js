// Copy email — works on both HTTP (S3) and HTTPS
function copyEmail(e) {
  e.preventDefault();
  const email = 'kbtabora+portfolio@gmail.com';
  const showToast = () => {
    const toast = document.getElementById('email-toast');
    toast.classList.add('show');
    clearTimeout(toast._t);
    toast._t = setTimeout(() => toast.classList.remove('show'), 2500);
  };
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(email).then(showToast);
  } else {
    // HTTP fallback (works on plain S3 URLs)
    const ta = document.createElement('textarea');
    ta.value = email;
    ta.style.cssText = 'position:fixed;opacity:0;pointer-events:none;';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    showToast();
  }
}

// Scroll-reveal
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('[data-observe]').forEach(el => observer.observe(el));

// Nav scrolled state + logo/buttons: all driven by the same condition
const nav = document.getElementById('nf-nav');
const navRightGroup = document.getElementById('nav-right-group');
const nfLogo = document.querySelector('.nf-logo');

function updateNav() {
  const h1 = document.querySelector('#profile h1');
  const h1Bottom = h1.getBoundingClientRect().bottom;
  const pastName = h1Bottom <= 60;

  nav.classList.toggle('scrolled', pastName);
  navRightGroup.classList.toggle('nav-visible', pastName);
  nfLogo.classList.toggle('nav-visible', pastName);
}

window.addEventListener('scroll', updateNav, { passive: true });
updateNav();
