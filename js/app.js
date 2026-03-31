document.addEventListener('DOMContentLoaded', async () => {
  try {

  await initAuth();

  showScreen('home');

  document.getElementById('nav-home')?.addEventListener('click',     () => showScreen('home'));
  document.getElementById('nav-cats')?.addEventListener('click',     () => showScreen('cats'));
  document.getElementById('nav-notifs')?.addEventListener('click',   () => showScreen('notifs'));
  document.getElementById('nav-settings')?.addEventListener('click', () => { showScreen('settings'); renderSettingsHistory(); });
  document.getElementById('nav-post')?.addEventListener('click',     () => showScreen('post'));

  document.getElementById('row-terms')?.addEventListener('click',      () => showScreen('terms'));
  document.getElementById('terms-back-btn')?.addEventListener('click', () => showScreen('settings'));
  document.getElementById('stats-back-btn')?.addEventListener('click', () => showScreen('home'));
  document.getElementById('stats-home-btn')?.addEventListener('click', () => showScreen('home'));
  document.getElementById('settings-account-row')?.addEventListener('click', () => showScreen('account'));
  document.getElementById('settings-dashboard-row')?.addEventListener('click', () => showScreen('dashboard'));
  document.getElementById('dashboard-back-btn')?.addEventListener('click', () => showScreen('home'));

  document.getElementById('btn-notifs')?.addEventListener('click', () => showScreen('notifs'));
  document.getElementById('btn-mark-all-read')?.addEventListener('click', markAllRead);

  document.getElementById('modal-close-btn')?.addEventListener('click', () => {
    bootstrap.Modal.getInstance(document.getElementById('modal-submitted'))?.hide();
    showScreen('home');
  });

  document.getElementById('lang-en')?.addEventListener('click', () => setLang('en'));
  document.getElementById('lang-es')?.addEventListener('click', () => setLang('es'));

  const anonToggle = document.querySelector('.toggle-setting');
  if (anonToggle) {
    const saved = localStorage.getItem('anon_mode') !== 'false';
    if (saved) anonToggle.classList.add('on');
    else anonToggle.classList.remove('on');
    anonToggle.addEventListener('click', () => {
      anonToggle.classList.toggle('on');
      const isAnon = anonToggle.classList.contains('on');
      localStorage.setItem('anon_mode', isAnon);
      updateAnonMode(isAnon);
      showToast(isAnon ? t('toast_anon_on') : t('toast_anon_off'));
    });
  }

  bindAuthModal();
  bindPost();
  bindValuation();
  bindDashboard();

  renderCatFilter();
  loadFeed();
  loadTicker();
  if (typeof applyUI === 'function') applyUI();

  const uploadZone = document.getElementById('upload-zone');
  if (uploadZone && !document.getElementById('upload-required-msg')) {
    const msg = document.createElement('div');
    msg.id = 'upload-required-msg';
    msg.textContent = t('err_upload_required');
    uploadZone.insertAdjacentElement('afterend', msg);
  }

  const submitPostBtn = document.getElementById('btn-submit-post');
  if (submitPostBtn) {
    submitPostBtn.addEventListener('click', (e) => {
      if (!window._selectedFile) {
        e.stopImmediatePropagation();
        if (window._postStepController) window._postStepController.goTo(1);
        const msg = document.getElementById('upload-required-msg');
        if (msg) msg.style.display = 'block';
        showToast(t('post_image_required'));
      }
    }, true);
  }

  document.getElementById('photo-file-input')?.addEventListener('change', () => {
    const msg = document.getElementById('upload-required-msg');
    if (msg) msg.style.display = 'none';
  });

  } catch(e) {
    console.error('INIT ERROR:', e);
  }
});
