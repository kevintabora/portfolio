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

const refreshIcons = () => {
  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }
};

refreshIcons();
document.addEventListener('DOMContentLoaded', refreshIcons);
window.addEventListener('load', refreshIcons);

// Case study modal
const caseModalOverlay = document.querySelector('[data-case-modal-overlay]');
const caseModal = caseModalOverlay?.querySelector('.case-modal');
const caseModalOpen = document.querySelector('[data-case-modal-open]');
const caseModalClose = document.querySelector('[data-case-modal-close]');
let caseModalLastFocus = null;

const openCaseModal = () => {
  if (!caseModalOverlay) return;
  caseModalLastFocus = document.activeElement;
  caseModalOverlay.hidden = false;
  document.body.classList.add('case-modal-open');
  refreshIcons();
  caseModalClose?.focus();
};

const closeCaseModal = () => {
  if (!caseModalOverlay || caseModalOverlay.hidden) return;
  caseModalOverlay.hidden = true;
  document.body.classList.remove('case-modal-open');
  caseModalLastFocus?.focus?.();
};

caseModalOpen?.addEventListener('click', openCaseModal);
caseModalClose?.addEventListener('click', closeCaseModal);

caseModalOverlay?.addEventListener('click', (e) => {
  if (e.target === caseModalOverlay) closeCaseModal();
});

caseModal?.addEventListener('click', (e) => e.stopPropagation());

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeCaseModal();
});

// Copy email - works on both HTTP (S3) and HTTPS
function copyEmail(e) {
  e.preventDefault();
  const email = 'kbtabora+portfolio@gmail.com';
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
