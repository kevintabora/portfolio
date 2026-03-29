// Scroll-reveal
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('[data-observe]').forEach(el => observer.observe(el));

// Copy email — works on both HTTP (S3) and HTTPS
function copyEmail(e) {
  e.preventDefault();
  const email = 'kbtabora@gmail.com';
  const showToast = () => {
    const toast = document.getElementById('email-toast');
    if (!toast) return;
    toast.classList.add('show');
    clearTimeout(toast._t);
    toast._t = setTimeout(() => toast.classList.remove('show'), 2500);
  };
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(email).then(showToast);
  } else {
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
