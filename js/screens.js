const SCREENS = ['home','post','val','stats','cats','notifs','settings',
                 'terms','auth','dashboard','account'];

function showScreen(name) {
  SCREENS.forEach(id => {
    const el = document.getElementById('screen-' + id);
    if (!el) return;
    if (id === name) { el.classList.remove('d-none'); el.style.display = ''; }
    else             { el.classList.add('d-none');    el.style.display = 'none'; }
  });

  document.querySelectorAll('.nav-item-btn').forEach(b => b.classList.remove('active'));
  const navMap = { home:'nav-home', cats:'nav-cats', notifs:'nav-notifs', settings:'nav-settings' };
  if (navMap[name]) document.getElementById(navMap[name])?.classList.add('active');

  const appContent = document.getElementById('app-content');
  if (appContent) appContent.scrollTop = 0; else window.scrollTo(0, 0);

  if (name === 'home')      loadFeed();
  if (name === 'notifs')    loadNotifications();
  if (name === 'cats')      renderCommunities();
  if (name === 'dashboard') { if (typeof setDashTab === 'function') setDashTab(); loadDashList(); }
  if (name === 'account')   renderAccount();
  if (name === 'settings')  renderSettingsNotifs();

  if (typeof applyUI === 'function') applyUI();
}

function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  const body = toast.querySelector('.toast-body') || toast;
  body.textContent = msg;
  try {
    bootstrap.Toast.getOrCreateInstance(toast).show();
  } catch(e) {
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2800);
  }
}
