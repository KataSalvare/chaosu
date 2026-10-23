const navToggle = document.querySelector('.nav-toggle');
const mainNav = document.querySelector('.main-nav');
const typeButtons = [...document.querySelectorAll('.join-option')];
const applicationForm = document.querySelector('#application-form');
const formSuccess = document.querySelector('#form-success');
const toast = document.querySelector('#download-toast');
let toastTimer;

const gameLogos = [...document.querySelectorAll('.game-logo img')];
gameLogos.forEach((image) => {
  const showFallback = () => image.closest('.game-card')?.classList.add('is-logo-missing');
  image.addEventListener('error', showFallback, { once: true });
});
window.addEventListener('load', () => {
  gameLogos.forEach((image) => {
    if (image.complete && image.naturalWidth === 0) image.closest('.game-card')?.classList.add('is-logo-missing');
  });
}, { once: true });

navToggle.addEventListener('click', () => {
  const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
  navToggle.setAttribute('aria-expanded', String(!isOpen));
  mainNav.classList.toggle('is-open', !isOpen);
});

mainNav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navToggle.setAttribute('aria-expanded', 'false');
    mainNav.classList.remove('is-open');
  });
});

function setApplicationType(type) {
  const isClub = type === 'club';
  typeButtons.forEach((button) => {
    const selected = button.dataset.type === type;
    button.classList.toggle('is-active', selected);
    button.setAttribute('aria-selected', String(selected));
  });

  document.querySelectorAll('.companion-only').forEach((field) => {
    field.hidden = isClub;
    field.querySelector('input').required = !isClub;
  });
  document.querySelectorAll('.club-only').forEach((field) => {
    field.hidden = !isClub;
    field.querySelector('input').required = isClub;
  });

  applicationForm.elements.applicationType.value = isClub ? '俱乐部入驻' : '陪玩伙伴';
  document.querySelector('#form-title').textContent = isClub ? '俱乐部入驻申请' : '陪玩伙伴申请';
  document.querySelector('#form-eyebrow').textContent = isClub ? 'CLUB APPLICATION' : 'PARTNER APPLICATION';
  document.querySelector('#intro-label').innerHTML = `${isClub ? '俱乐部介绍' : '个人简介'} <i>*</i>`;
  applicationForm.elements.intro.placeholder = isClub
    ? '介绍俱乐部情况、团队特点或申请想法'
    : '介绍一下你自己、擅长的游戏或申请想法';
}

typeButtons.forEach((button) => {
  button.addEventListener('click', () => setApplicationType(button.dataset.type));
});

applicationForm.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!applicationForm.reportValidity()) return;
  applicationForm.querySelectorAll('.form-grid, .form-bottom, .form-heading, input[type="hidden"]').forEach((element) => {
    element.hidden = true;
  });
  formSuccess.hidden = false;
});

document.querySelector('#submit-another').addEventListener('click', () => {
  applicationForm.reset();
  setApplicationType('companion');
  applicationForm.querySelectorAll('.form-grid, .form-bottom, .form-heading, input[type="hidden"]').forEach((element) => {
    element.hidden = false;
  });
  formSuccess.hidden = true;
  applicationForm.elements.applicantName.focus();
});

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('is-visible');
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove('is-visible'), 2500);
}

document.querySelectorAll('.platform-row').forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    showToast(`${link.dataset.platform} 下载地址即将开放，敬请期待。`);
  });
});

const serviceToggle = document.querySelector('#service-toggle');
const servicePanel = document.querySelector('#service-panel');
const serviceClose = document.querySelector('#service-close');
const serviceBackdrop = document.querySelector('#service-backdrop');
const serviceFrame = document.querySelector('#service-frame');
const mobileServiceLayout = window.matchMedia('(max-width: 700px)');

function syncServiceLayout() {
  const isOpen = serviceToggle.getAttribute('aria-expanded') === 'true';
  servicePanel.setAttribute('aria-modal', String(mobileServiceLayout.matches));
  serviceBackdrop.hidden = !isOpen || !mobileServiceLayout.matches;
  document.body.classList.toggle('service-open', isOpen && mobileServiceLayout.matches);
}

function setServiceOpen(isOpen) {
  serviceToggle.setAttribute('aria-expanded', String(isOpen));
  serviceToggle.setAttribute('aria-label', isOpen ? '在线客服已打开' : '打开在线客服');
  servicePanel.hidden = !isOpen;

  if (isOpen && serviceFrame.src === 'about:blank') {
    serviceFrame.src = serviceFrame.dataset.src;
  }

  syncServiceLayout();
  if (isOpen) serviceClose.focus();
  else serviceToggle.focus();
}

serviceToggle.addEventListener('click', () => {
  setServiceOpen(serviceToggle.getAttribute('aria-expanded') !== 'true');
});
serviceClose.addEventListener('click', () => setServiceOpen(false));
serviceBackdrop.addEventListener('click', () => setServiceOpen(false));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && serviceToggle.getAttribute('aria-expanded') === 'true') {
    setServiceOpen(false);
  }
});
mobileServiceLayout.addEventListener('change', syncServiceLayout);

