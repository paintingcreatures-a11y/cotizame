let currentUser = null;

async function initAuth() {
  const { data: { session } } = await sb.auth.getSession();
  currentUser = session?.user ?? null;
  updateAuthUI();
  loadNotifCount();

  sb.auth.onAuthStateChange(async (_e, session) => {
    currentUser = session?.user ?? null;
    updateAuthUI();
    loadNotifCount();
    if (currentUser && window._pendingCatIds?.length) {
      try {
        await sb.from('subscriptions').upsert(
          window._pendingCatIds.map(id => ({ user_id: currentUser.id, category_id: id })),
          { onConflict: 'user_id,category_id' }
        );
      } catch(e) {}
      window._pendingCatIds = null;
      if (typeof renderSettingsNotifs === 'function') renderSettingsNotifs();
    }
  });
}

function updateAuthUI() {
  const loggedIn = !!currentUser;

  const loginBtn  = document.getElementById('topbar-login');
  const userArea  = document.getElementById('topbar-user-area');
  const avatarBtn = document.getElementById('topbar-avatar');
  const btnNotifs = document.getElementById('btn-notifs');
  if (loginBtn)  loginBtn.style.setProperty('display', loggedIn ? 'none' : '', 'important');
  if (userArea)  userArea.style.setProperty('display', loggedIn ? 'flex' : 'none', 'important');
  if (btnNotifs) btnNotifs.style.setProperty('display', loggedIn ? '' : 'none', 'important');
  if (avatarBtn && loggedIn) {
    avatarBtn.textContent = (currentUser.user_metadata?.name || currentUser.email || '?').substring(0,2).toUpperCase();
  }

  const navCats   = document.getElementById('nav-cats');
  const navNotifs = document.getElementById('nav-notifs');
  if (navCats)   navCats.style.setProperty('display', 'none', 'important');
  if (navNotifs) navNotifs.style.setProperty('display', loggedIn ? '' : 'none', 'important');

  const loginRow    = document.getElementById('settings-login-row');
  const sgLoginLbl  = document.getElementById('sg-login-label');
  const notifsGroup = document.getElementById('settings-notifs-group');
  const privGroup   = document.getElementById('settings-privacy-group');
  if (loginRow)    loginRow.style.setProperty('display', loggedIn ? 'none' : '', 'important');
  if (sgLoginLbl)  sgLoginLbl.style.setProperty('display', loggedIn ? 'none' : '', 'important');
  if (notifsGroup) notifsGroup.style.display = loggedIn ? '' : 'none';
  if (privGroup)   privGroup.style.display   = loggedIn ? '' : 'none';

  const valChip = document.getElementById('val-anon-chip');
  if (valChip) valChip.textContent = loggedIn
    ? (currentUser.user_metadata?.name || currentUser.email?.split('@')[0] || 'Usuario')
    : t('val_anon');

  const postText = document.getElementById('post-anon-text');
  if (postText) postText.textContent = loggedIn
    ? `${t('publishing_as')} ${currentUser.user_metadata?.name || currentUser.email?.split('@')[0]}.`
    : t('post_anon');
}

async function authLogin(email, password) {
  const { data, error } = await sb.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

async function authRegister(email, password, name, catIds) {
  const { data, error } = await sb.auth.signUp({
    email, password,
    options: {
      data: { name },
      emailRedirectTo: 'https://renzxavi.github.io/coso/'
    }
  });
  if (error) throw error;

  const userId = data.user?.id || data.session?.user?.id;
  if (userId && catIds.length) {
    try {
      await sb.from('subscriptions').upsert(
        catIds.map(id => ({ user_id: userId, category_id: id })),
        { onConflict: 'user_id,category_id' }
      );
      if (typeof renderSettingsNotifs === 'function') renderSettingsNotifs();
    } catch(e) {}
  } else if (catIds.length) {
    window._pendingCatIds = catIds;
  }
  return data;
}

async function authLogout() {
  await sb.auth.signOut();
  showScreen('home');
}

function bindAuthModal() {
  const tabLogin  = document.getElementById('auth-tab-login');
  const tabReg    = document.getElementById('auth-tab-register');
  const submitBtn = document.getElementById('auth-submit-btn');
  if (!tabLogin || !tabReg || !submitBtn) return;
  let mode = 'login';

  function setTabStyle(activeId) {
    [tabLogin, tabReg].forEach(tab => {
      const isActive = tab.id === activeId;
      tab.style.background = isActive ? 'var(--ink)' : 'var(--surface)';
      tab.style.color      = isActive ? 'var(--gold)' : 'var(--ink2)';
      tab.style.opacity    = isActive ? '1' : '0.6';
    });
  }

  function setMode(m) {
    mode = m;
    setTabStyle(m === 'login' ? 'auth-tab-login' : 'auth-tab-register');
    const regFields = document.getElementById('auth-register-fields');
    if (regFields) regFields.style.display = m === 'register' ? 'flex' : 'none';
    const titles = {
      login:    [t('auth_login_title'), t('auth_login_sub'),    t('auth_tab_login')],
      register: [t('auth_register_title'), t('auth_register_sub'), t('auth_tab_register')],
    };
    const [title, sub, btn] = titles[m];
    const titleEl = document.getElementById('auth-title');
    const subEl   = document.getElementById('auth-sub');
    if (titleEl) titleEl.textContent = title;
    if (subEl)   subEl.textContent   = sub;
    submitBtn.textContent = btn;
    const errEl = document.getElementById('auth-error');
    if (errEl) { errEl.textContent = ''; errEl.classList.add('d-none'); }
  }

  setTabStyle('auth-tab-login');

  tabLogin.addEventListener('click',  () => setMode('login'));
  tabReg.addEventListener('click',    () => setMode('register'));

  document.getElementById('topbar-login')?.addEventListener('click',  () => showScreen('auth'));
  document.getElementById('topbar-avatar')?.addEventListener('click', () => showScreen('account'));
  document.getElementById('topbar-logout')?.addEventListener('click', () => {
    authLogout();
    showToast(t('toast_session_closed'));
  });
  document.getElementById('settings-login-row')?.addEventListener('click', () => showScreen('auth'));
  document.getElementById('auth-back-btn')?.addEventListener('click', () => showScreen('home'));
  document.getElementById('btn-logout')?.addEventListener('click', () => {
    authLogout();
    showToast(t('toast_session_closed'));
  });

  submitBtn.addEventListener('click', async () => {
    const emailEl = document.getElementById('auth-email');
    const passEl  = document.getElementById('auth-password');
    const email    = emailEl.value.trim();
    const password = passEl.value;
    const errEl    = document.getElementById('auth-error');
    if (errEl) { errEl.textContent = ''; errEl.classList.add('d-none'); }

    try {
      submitBtn.disabled = true;
      submitBtn.textContent = t('auth_btn_processing') || 'Procesando…';

      if (mode === 'login') {
        await authLogin(email, password);
        emailEl.value = '';
        passEl.value  = '';
        showScreen('home');
        showToast(t('toast_welcome_back'));
      } else {
        const nameEl = document.getElementById('auth-name');
        const name   = nameEl.value.trim();
        if (!name) {
          const errEl2 = document.getElementById('auth-error');
          if (errEl2) { errEl2.textContent = t('err_name_required'); errEl2.classList.remove('d-none'); }
          return;
        }
        const catIds = [...document.querySelectorAll('.auth-cat-chip.active')].map(el => +el.dataset.catId);
        const regData = await authRegister(email, password, name, catIds);
        emailEl.value = '';
        passEl.value  = '';
        nameEl.value  = '';
        document.querySelectorAll('.auth-cat-chip.active').forEach(b => {
          b.classList.remove('active');
          b.style.background  = 'var(--surface)';
          b.style.borderColor = 'var(--border2)';
          b.style.color       = 'var(--ink3)';
          b.style.boxShadow   = '';
        });
        if (!regData?.session) {
          showToast(t('register_confirm_email'));
        } else {
          showToast(t('toast_welcome_new'));
        }
        showScreen('home');
      }
    } catch(e) {
      if (errEl) {
        errEl.textContent = e.message || 'Error de autenticación.';
        errEl.classList.remove('d-none');
      }
    } finally {
      submitBtn.disabled = false;
      setMode(mode);
    }
  });

  const grid = document.getElementById('auth-cats-grid');
  if (grid) {
    CATEGORIES.forEach((c, i) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'auth-cat-chip';
      btn.dataset.catId = i + 1;
      btn.style.cssText = 'border:1.5px solid var(--border2);border-radius:var(--r-sm);padding:8px 4px;text-align:center;cursor:pointer;background:var(--surface);display:flex;flex-direction:column;align-items:center;gap:3px;font-size:10px;font-weight:700;color:var(--ink3);transition:all .14s;line-height:1.2';
      btn.innerHTML = `<span style="font-size:1.3rem">${c.emoji}</span><span>${catLabel(c)}</span>`;
      btn.addEventListener('click', () => {
        btn.classList.toggle('active');
        const on = btn.classList.contains('active');
        btn.style.background  = on ? 'var(--gold)'    : 'var(--surface)';
        btn.style.borderColor = on ? 'var(--ink)'     : 'var(--border2)';
        btn.style.color       = on ? 'var(--ink)'     : 'var(--ink3)';
        btn.style.boxShadow   = on ? 'var(--sh-sm)'   : '';
      });
      grid.appendChild(btn);
    });
  }
}

async function renderAccount() {
  if (!currentUser) { showScreen('auth'); return; }
  const initials = (currentUser.user_metadata?.name || currentUser.email).substring(0,2).toUpperCase();
  document.getElementById('account-avatar-initials')?.textContent && (document.getElementById('account-avatar-initials').textContent = initials);
  const naEl = document.getElementById('account-name');
  const emEl = document.getElementById('account-email');
  const joEl = document.getElementById('account-joined');
  if (naEl) naEl.textContent = currentUser.user_metadata?.name || '—';
  if (emEl) emEl.textContent = currentUser.email;
  if (joEl) joEl.textContent = t('member_since') + ' ' + new Date(currentUser.created_at).toLocaleDateString('es-AR', {year:'numeric',month:'long'});

  const { data: subs } = await sb.from('subscriptions').select('category_id').eq('user_id', currentUser.id);
  const list = document.getElementById('account-cat-list');
  if (!list) return;
  list.innerHTML = '';
  if (!subs?.length) { list.innerHTML = '<p class="text-muted small">' + t('account_no_cats') + '</p>'; return; }
  subs.forEach(s => {
    const cat = CATEGORIES[s.category_id - 1];
    if (!cat) return;
    const span = document.createElement('span');
    span.className = 'badge bg-warning text-dark me-1 mb-1 fs-6';
    span.textContent = cat.emoji + ' ' + catLabel(cat);
    list.appendChild(span);
  });
}

async function renderSettingsNotifs() {
  const container = document.getElementById('settings-notif-list');
  if (!container || !currentUser) return;
  container.innerHTML = '<div class="list-group-item text-muted small text-center py-2"><div class="spinner-border spinner-border-sm"></div></div>';

  const { data: subs } = await sb.from('subscriptions').select('category_id').eq('user_id', currentUser.id);
  const followedIds = new Set((subs || []).map(s => s.category_id));

  container.innerHTML = '';
  CATEGORIES.forEach((cat, i) => {
    const catId = i + 1;
    const isOn  = followedIds.has(catId);
    const row   = document.createElement('div');
    row.className = 'list-group-item d-flex align-items-center gap-3';
    row.innerHTML = `
      <span class="fs-4">${cat.emoji}</span>
      <div class="flex-grow-1">
        <div class="fw-medium">${catLabel(cat)}</div>
        <div class="text-muted small">Nuevos objetos a cotizar</div>
      </div>
      <button class="toggle-setting ${isOn ? 'on' : ''}" data-cat-id="${catId}" type="button"></button>
    `;
    const toggle = row.querySelector('.toggle-setting');
    toggle.addEventListener('click', async () => {
      const on = toggle.classList.toggle('on');
      try {
        if (on) {
          await sb.from('subscriptions').upsert({ user_id: currentUser.id, category_id: catId }, { onConflict: 'user_id,category_id' });
          showToast(t('notifs_on') + ' ' + catLabel(cat));
        } else {
          await sb.from('subscriptions').delete().eq('user_id', currentUser.id).eq('category_id', catId);
          showToast(t('notifs_off') + ' ' + catLabel(cat));
        }
      } catch(e) {
        toggle.classList.toggle('on');
        showToast(t('error_saving'));
      }
    });
    container.appendChild(row);
  });
}
