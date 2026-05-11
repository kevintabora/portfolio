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

// Case study modal
const caseModalOverlay = document.querySelector('[data-case-modal-overlay]');
const caseModal = caseModalOverlay?.querySelector('.case-modal');
const caseModalBody = caseModalOverlay?.querySelector('.case-modal-body');
const caseStoryContent = caseModalOverlay?.querySelector('.case-story-content');
const caseModalOpen = document.querySelector('[data-case-modal-open]');
const caseModalClose = document.querySelector('[data-case-modal-close]');
const caseRevealItems = document.querySelectorAll('[data-case-reveal]');
const caseNavItems = document.querySelectorAll('[data-case-nav]');
const caseSections = document.querySelectorAll('[data-case-section]');
let caseModalLastFocus = null;
let caseRevealObserver = null;
let caseNavObserver = null;
let caseWheelLocked = false;

const isDesktopCaseView = () => window.matchMedia('(min-width: 741px)').matches;

const updateCaseContentHeight = () => {
  if (!caseStoryContent) return;
  if (!isDesktopCaseView()) {
    caseStoryContent.style.minHeight = '';
    return;
  }

  const tallest = Array.from(caseSections).reduce((max, section) => {
    const wasHidden = !section.classList.contains('active-section');
    if (wasHidden) {
      section.style.display = 'block';
      section.style.visibility = 'hidden';
      section.style.position = 'absolute';
      section.style.pointerEvents = 'none';
      section.style.inset = '0 auto auto 0';
      section.style.width = '100%';
    }

    const height = section.scrollHeight;

    if (wasHidden) {
      section.removeAttribute('style');
    }

    return Math.max(max, height);
  }, 0);

  if (tallest) {
    caseStoryContent.style.minHeight = `${tallest}px`;
  }
};

const setActiveCaseNav = (id) => {
  const currentIndex = getActiveCaseIndex();
  const nextIndex = Array.from(caseSections).findIndex(section => section.id === id);

  if (caseStoryContent && nextIndex >= 0 && currentIndex >= 0) {
    caseStoryContent.classList.toggle('case-section-back', nextIndex < currentIndex);
  }

  caseNavItems.forEach(item => {
    item.classList.toggle('active', item.dataset.caseNav === id);
  });
  caseSections.forEach(section => {
    section.classList.toggle('active-section', section.id === id);
  });
  updateCaseContentHeight();
};

const setActiveCaseIndex = (index) => {
  const clamped = Math.max(0, Math.min(caseSections.length - 1, index));
  const target = caseSections[clamped];
  if (!target) return;
  setActiveCaseNav(target.id);
  if (!isDesktopCaseView()) {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

const getActiveCaseIndex = () => {
  const current = Array.from(caseSections).findIndex(section => section.classList.contains('active-section'));
  return current < 0 ? 0 : current;
};

const resetCaseReveal = () => {
  if (!caseRevealItems.length) return;

  if (!('IntersectionObserver' in window) || !caseModalBody) {
    caseRevealItems.forEach(item => item.classList.add('visible'));
    return;
  }

  caseRevealObserver?.disconnect();
  caseModalBody.scrollTop = 0;
  caseRevealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        caseRevealObserver.unobserve(entry.target);
      }
    });
  }, { root: caseModalBody, threshold: 0.16 });

  caseRevealItems.forEach(item => {
    item.classList.remove('visible');
    caseRevealObserver.observe(item);
  });
};

const resetCaseNav = () => {
  if (!caseSections.length || !caseModalBody) return;

  setActiveCaseNav(caseSections[0].id);
  caseNavObserver?.disconnect();
  caseNavObserver = new IntersectionObserver((entries) => {
    const visible = entries
      .filter(entry => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (visible?.target?.id) {
      setActiveCaseNav(visible.target.id);
    }
  }, {
    root: caseModalBody,
    threshold: [0.18, 0.35, 0.55],
    rootMargin: '-18% 0px -55% 0px'
  });

  caseSections.forEach(section => caseNavObserver.observe(section));
};

const openCaseModal = () => {
  if (!caseModalOverlay) return;
  caseModalLastFocus = document.activeElement;
  caseModalOverlay.hidden = false;
  document.body.classList.add('case-modal-open');
  resetCaseReveal();
  resetCaseNav();
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

caseNavItems.forEach(item => {
  item.addEventListener('click', () => {
    const target = document.getElementById(item.dataset.caseNav);
    if (!target) return;
    setActiveCaseNav(target.id);
    if (!isDesktopCaseView()) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

caseModalBody?.addEventListener('wheel', (e) => {
  if (!isDesktopCaseView() || caseModalOverlay?.hidden) return;
  if (Math.abs(e.deltaY) < 12) return;

  e.preventDefault();
  if (caseWheelLocked) return;

  caseWheelLocked = true;
  setActiveCaseIndex(getActiveCaseIndex() + (e.deltaY > 0 ? 1 : -1));
  setTimeout(() => {
    caseWheelLocked = false;
  }, 420);
}, { passive: false });

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeCaseModal();
});

window.addEventListener('resize', updateCaseContentHeight);

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
