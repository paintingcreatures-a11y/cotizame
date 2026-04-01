var currentLang = (function() {
  try {
    const stored = localStorage.getItem('lang');
    if (stored) return stored;
    const browser = (navigator.language || navigator.userLanguage || '').toLowerCase();
    return browser.startsWith('es') ? 'es' : 'en';
  } catch(e) { return 'es'; }
})();

const ES = {
  nav_home:'Inicio', nav_post:'Publicar', nav_notifs:'Alertas',
  nav_settings:'Ajustes', nav_cats:'Categorías',
  btn_login:'Ingresar', btn_logout:'✖',
  hero_eyebrow:'Valoración Comunitaria',
  hero_title_1:'¿Cuánto vale',
  hero_title_2:'este coso?',
  hero_sub:'Subí cualquier cosa y dejá que la comunidad la valore.',
  stat_objects:'Objetos', stat_valuations:'Cotizaciones', stat_avg_price:'Precio medio',
  feed_active:'Objetos activos',
  feed_all_cats:'🌐 Todos',
  feed_empty_cat:'No hay objetos en esta categoría todavía.',
  feed_no_val:'¿Cuánto vale?', feed_no_desc:'Sin descripción', feed_cotiz:'cotiz.',
  post_eyebrow:'Enviar para cotizar', post_title:'Publicar un Coso',
  post_step1:'Foto', post_step2:'Cat.', post_step3:'Desc.', post_step4:'Enviar',
  post_hint1:'Sacale una foto al coso que querés cotizar.',
  post_upload_title:'Soltá la foto acá',
  post_upload_sub:'JPG, PNG o WEBP · Máx 10MB',
  post_upload_badge:'o tocá para elegir',
  post_upload_badge_done:'Foto cargada',
  post_hint2:'¿En qué categoría entra este coso?',
  post_hint3:'Contanos un poco más sobre el objeto.',
  post_desc_label:'Descripción', post_desc_optional:'(opcional)',
  post_desc_placeholder:'¿Qué es? ¿Marca, modelo, estado?…',
  post_anon:'Tu publicación es completamente anónima.',
  post_anon_mode:'Publicando en modo anónimo.',
  post_sending_step:'Enviar →',
  post_hint4:'Revisá todo antes de publicar.',
  post_no_desc_preview:'Sin descripción', post_no_cat_preview:'— Sin categoría',
  post_publish:'Publicar ahora', post_edit:'Editar',
  post_btn:'Enviar', post_sending:'Enviando…',
  post_continue:'Continuar', post_back:'Atrás', post_cancel:'Cancelar',
  modal_title:'¡Publicado!', modal_sub:'Tu publicación ya está visible en el feed.',
  modal_btn:'Entendido', modal_user_prefix:'Publicado como',
  modal_user_desc:'Podés ver el estado en tu historial.',
  modal_anon_title:'Guardá tu ID de eliminación',
  modal_anon_desc:'Tocá para copiarlo.',
  val_title:'Cotizalo', val_anon:'Anónimo',
  val_community:'La comunidad hasta ahora',
  val_avg:'Promedio', val_median:'Mediana', val_votes:'Cotiz.',
  val_your:'Tu cotización', val_currency:'Moneda', val_amount:'Monto',
  val_btn:'Mandar mi cotización',
  stats_title:'Reporte de precio', stats_consensus:'Consenso de la comunidad',
  stats_based_on:'Basado en {n} cotizaciones',
  stats_avg:'Promedio', stats_median:'Mediana', stats_min:'Mínimo', stats_max:'Máximo',
  stats_dist:'Distribución de precios', stats_back:'Volver al inicio',
  notifs_title:'Notificaciones', notifs_mark_read:'Marcar leído',
  notifs_empty:'Sin notificaciones por ahora.',
  notifs_empty_sub:'Te avisamos cuando haya objetos nuevos en las categorías que seguís.',
  notifs_login:'Iniciá sesión para ver tus notificaciones.',
  notifs_new_object:'Nuevo objeto en', notifs_result:'Resultados de cotización listos',
  settings_title:'Ajustes', settings_account:'Cuenta',
  settings_login_title:'Iniciar sesión / Registrarse',
  settings_login_sub:'Recibí notificaciones de tus categorías',
  settings_language:'Idioma',
  settings_notifs_label:'Notificaciones por categoría',
  settings_notifs_sub:'Nuevos objetos a cotizar',
  settings_about:'Acerca de', settings_terms:'Términos y privacidad',
  settings_history_title:'Mis publicaciones recientes',
  settings_history_sub:'Mirá lo que publicaste',
  settings_history_see_all:'Ver todas mis publicaciones →',
  auth_tab_login:'Ingresar', auth_tab_register:'Registrarse',
  auth_login_title:'Iniciar sesión', auth_login_sub:'Bienvenido de vuelta.',
  auth_register_title:'Crear cuenta', auth_register_sub:'Es gratis. Solo necesitás un email.',
  auth_email_label:'Email', auth_password_label:'Contraseña',
  auth_password_placeholder:'Mínimo 6 caracteres',
  auth_name_label:'Nombre de usuario',
  auth_name_placeholder:'¿Cómo querés que te llamemos?',
  auth_benefits_title:'Con tu cuenta podés:',
  auth_benefit_1:'📋 Ver historial de publicaciones',
  auth_benefit_2:'💰 Ver todas tus cotizaciones',
  auth_benefit_3:'🔔 Recibir alertas de nuevos objetos',
  auth_cats_label:'Categorías', auth_cats_hint:'opcional — recibís alertas de estas',
  auth_btn_skip:'Continuar sin cuenta', auth_btn_processing:'Procesando…',
  account_my_cats:'Mis categorías',
  account_no_cats:'No seguís ninguna categoría todavía.',
  account_logout:'Cerrar sesión', member_since:'Miembro desde',
  dash_title:'Mi Actividad', dash_tab_subs:'Mis Publicaciones',
  dash_tab_vals:'Mis Cotizaciones', dash_search:'Buscar…',
  dash_filter_all:'Todos', dash_filter_pending:'Pendiente',
  dash_filter_approved:'Aprobado', dash_filter_rejected:'Rechazado',
  dash_empty_subs:'Sin publicaciones.', dash_empty_vals:'Sin cotizaciones.',
  login_to_see:'Iniciá sesión para ver tu actividad.',
  terms_title:'Términos y privacidad', terms_updated:'Última actualización: enero 2025',
  terms_01_title:'Uso de la plataforma',
  terms_01_body:'Cotizame el Coso es una plataforma comunitaria de valoración de objetos. Al usar la app, aceptás estas condiciones. El servicio está destinado a personas mayores de 18 años.',
  terms_02_title:'Anonimato y datos',
  terms_02_body:'Las publicaciones son anónimas por defecto. Las cotizaciones nunca se asocian a tu identidad.',
  terms_03_title:'Contenido publicado',
  terms_03_body:'Al publicar una imagen, confirmás que tenés derecho a hacerlo. Queda prohibido publicar contenido ilegal, violento, sexual o que viole derechos de terceros.',
  cats_title:'Comunidades', cats_following:'Siguiendo',
  objects_published:'objetos publicados',
  follow_btn:'+ Seguir', following_btn:'✓ Siguiendo',
  login_to_follow:'Iniciá sesión para seguir categorías.',
  toast_session_closed:'Sesión cerrada.', toast_welcome_back:'¡Bienvenido de vuelta! ',
  toast_welcome_new:'¡Cuenta creada! Ya podés iniciar sesión.',
  toast_copied:'ID copiado ✓', toast_val_sent:'¡Cotización enviada!',
  toast_anon_on:'🔒 Modo anónimo activado', toast_anon_off:'👤 Publicando con tu nombre',
  toast_notifs_read:'Todo marcado como leído ✓',
  err_no_category:'Elegí una categoría.',
  err_invalid_format:'Formato inválido. Usá JPG, PNG o WEBP.',
  err_file_too_large:'La imagen supera los 10MB.',
  err_valid_amount:'Ingresá un monto válido.',
  err_upload_required:'Necesitás subir una imagen para continuar.',
  post_image_required:'Subí una imagen antes de publicar.',
  no_description:'Sin descripción', avg_label:'promedio', avg_price_label:'Promedio:',
  no_posts_yet:'No publicaste nada todavía.',
  status_pending:'Pendiente', status_approved:'Aprobado', status_rejected:'Rechazado',
  notifs_on:'Activadas alertas de', notifs_off:'Desactivadas alertas de',
  error_saving:'Error al guardar', publishing_as:'Publicando como',
  err_name_required:'Ingresá un nombre de usuario.',
  register_confirm_email:'Revisá tu email para confirmar la cuenta.',
  new_badge:'Nuevo', loading:'Cargando…',
};

const EN = {
  nav_home:'Home', nav_post:'Post', nav_notifs:'Alerts',
  nav_settings:'Settings', nav_cats:'Categories',
  btn_login:'Sign in', btn_logout:'✖',
  hero_eyebrow:'Community Valuation',
  hero_title_1:'How much is',
  hero_title_2:'this thing worth?',
  hero_sub:'Post anything. The community sets the price.',
  stat_objects:'Objects', stat_valuations:'Valuations', stat_avg_price:'Avg price',
  feed_active:'Active objects',
  feed_all_cats:'🌐 All',
  feed_empty_cat:'No objects in this category yet.',
  feed_no_val:'How much is it worth?', feed_no_desc:'No description', feed_cotiz:'val.',
  post_eyebrow:'Submit for valuation', post_title:'Post a Thing',
  post_step1:'Photo', post_step2:'Cat.', post_step3:'Desc.', post_step4:'Send',
  post_hint1:'Take a photo of the thing you want valued.',
  post_upload_title:'Drop the photo here',
  post_upload_sub:'JPG, PNG or WEBP · Max 10MB',
  post_upload_badge:'or tap to choose',
  post_upload_badge_done:'Photo loaded',
  post_hint2:'What category does this thing belong to?',
  post_hint3:'Tell us a bit more about the object.',
  post_desc_label:'Description', post_desc_optional:'(optional)',
  post_desc_placeholder:'What is it? Brand, model, condition?…',
  post_anon:'Your post is completely anonymous.',
  post_anon_mode:'Posting anonymously.',
  post_sending_step:'Send →',
  post_hint4:'Review everything before posting.',
  post_no_desc_preview:'No description', post_no_cat_preview:'— No category',
  post_publish:'Publish now', post_edit:'Edit',
  post_btn:'Submit', post_sending:'Submitting…',
  post_continue:'Continue', post_back:'Back', post_cancel:'Cancel',
  modal_title:'Posted!', modal_sub:'Your post is now visible in the feed.',
  modal_btn:'Got it', modal_user_prefix:'Posted as',
  modal_user_desc:'You can check the status in your history.',
  modal_anon_title:'Save your deletion ID',
  modal_anon_desc:'Tap to copy.',
  val_title:'Value it', val_anon:'Anonymous',
  val_community:'Community so far',
  val_avg:'Average', val_median:'Median', val_votes:'Val.',
  val_your:'Your valuation', val_currency:'Currency', val_amount:'Amount',
  val_btn:'Submit my valuation',
  stats_title:'Price report', stats_consensus:'Community consensus',
  stats_based_on:'Based on {n} valuations',
  stats_avg:'Average', stats_median:'Median', stats_min:'Minimum', stats_max:'Maximum',
  stats_dist:'Price distribution', stats_back:'Back to home',
  notifs_title:'Notifications', notifs_mark_read:'Mark read',
  notifs_empty:'No notifications yet.',
  notifs_empty_sub:"We'll notify you when there are new items in the categories you follow.",
  notifs_login:'Sign in to see your notifications.',
  notifs_new_object:'New object in', notifs_result:'Valuation results ready',
  settings_title:'Settings', settings_account:'Account',
  settings_login_title:'Sign in / Register',
  settings_login_sub:'Get notifications for your categories',
  settings_language:'Language',
  settings_notifs_label:'Notifications by category',
  settings_notifs_sub:'New objects to value',
  settings_about:'About', settings_terms:'Terms & privacy',
  settings_history_title:'My recent posts',
  settings_history_sub:'See what you published',
  settings_history_see_all:'See all my posts →',
  auth_tab_login:'Sign in', auth_tab_register:'Register',
  auth_login_title:'Sign in', auth_login_sub:'Welcome back.',
  auth_register_title:'Create account', auth_register_sub:"It's free. Just need an email.",
  auth_email_label:'Email', auth_password_label:'Password',
  auth_password_placeholder:'Minimum 6 characters',
  auth_name_label:'Username', auth_name_placeholder:'What should we call you?',
  auth_benefits_title:'With an account you can:',
  auth_benefit_1:'📋 View your post history',
  auth_benefit_2:'💰 See all your valuations',
  auth_benefit_3:'🔔 Get alerts for new objects',
  auth_cats_label:'Categories', auth_cats_hint:'optional — get alerts for these',
  auth_btn_skip:'Continue without account', auth_btn_processing:'Processing…',
  account_my_cats:'My categories',
  account_no_cats:"You're not following any category yet.",
  account_logout:'Sign out', member_since:'Member since',
  dash_title:'My Activity', dash_tab_subs:'My Posts',
  dash_tab_vals:'My Valuations', dash_search:'Search…',
  dash_filter_all:'All', dash_filter_pending:'Pending',
  dash_filter_approved:'Approved', dash_filter_rejected:'Rejected',
  dash_empty_subs:'No posts yet.', dash_empty_vals:'No valuations yet.',
  login_to_see:'Sign in to see your activity.',
  terms_title:'Terms & privacy', terms_updated:'Last updated: January 2025',
  terms_01_title:'Platform use',
  terms_01_body:'Cotizame el Coso is a community object valuation platform. By using the app, you accept these terms. The service is intended for people over 18 years old.',
  terms_02_title:'Anonymity & data',
  terms_02_body:'Posts are anonymous by default. Valuations are never linked to your identity.',
  terms_03_title:'Published content',
  terms_03_body:'By posting an image, you confirm you have the right to do so. Publishing illegal, violent, sexual or third-party rights-infringing content is prohibited.',
  cats_title:'Communities', cats_following:'Following',
  objects_published:'objects published',
  follow_btn:'+ Follow', following_btn:'✓ Following',
  login_to_follow:'Sign in to follow categories.',
  toast_session_closed:'Signed out.', toast_welcome_back:'Welcome back! ',
  toast_welcome_new:'Account created! You can now sign in.',
  toast_copied:'ID copied ✓', toast_val_sent:'Valuation submitted!',
  toast_anon_on:'🔒 Anonymous mode on', toast_anon_off:'👤 Posting with your name',
  toast_notifs_read:'All marked as read ✓',
  err_no_category:'Choose a category.',
  err_invalid_format:'Invalid format. Use JPG, PNG or WEBP.',
  err_file_too_large:'Image exceeds 10MB.',
  err_valid_amount:'Enter a valid amount.',
  err_upload_required:'You need to upload an image to continue.',
  post_image_required:'Upload an image before posting.',
  no_description:'No description', avg_label:'average', avg_price_label:'Average:',
  no_posts_yet:"You haven't posted anything yet.",
  status_pending:'Pending', status_approved:'Approved', status_rejected:'Rejected',
  notifs_on:'Alerts on for', notifs_off:'Alerts off for',
  error_saving:'Error saving', publishing_as:'Posting as',
  err_name_required:'Enter a username.',
  register_confirm_email:'Check your email to confirm your account.',
  new_badge:'New', loading:'Loading…',
};

function catLabel(cat) {
  if (!cat) return '';
  return (currentLang === 'en' && cat.labelEn) ? cat.labelEn : cat.label;
}

function catLabelFromSlug(slug) {
  const cat = (typeof CATEGORIES !== 'undefined') ? CATEGORIES.find(c => c.slug === slug) : null;
  return cat ? catLabel(cat) : (slug || '');
}

function t(key, vars = {}) {
  const dict = currentLang === 'en' ? EN : ES;
  let str = dict[key] !== undefined ? dict[key] : (ES[key] !== undefined ? ES[key] : key);
  Object.entries(vars).forEach(([k, v]) => { str = str.replace(`{${k}}`, v); });
  return str;
}

function applyUI() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    el.textContent = t(el.dataset.i18n);
  });

  document.querySelectorAll('[data-i18n-ph]').forEach(el => {
    el.placeholder = t(el.dataset.i18nPh);
  });

  const heroEyebrow = document.getElementById('hero-eyebrow');
  if (heroEyebrow) heroEyebrow.textContent = t('hero_eyebrow');
  const heroTitle1 = document.getElementById('hero-title-1');
  if (heroTitle1) heroTitle1.textContent = t('hero_title_1');
  const heroTitle2 = document.getElementById('hero-title-2');
  if (heroTitle2) heroTitle2.textContent = t('hero_title_2');
  const heroSub = document.getElementById('hero-sub');
  if (heroSub) heroSub.textContent = t('hero_sub');

  const postEye   = document.getElementById('post-eyebrow');
  const postTitle = document.getElementById('post-header-title');
  if (postEye)   postEye.textContent   = t('post_eyebrow');
  if (postTitle) postTitle.textContent = t('post_title');

  ['1','2','3','4'].forEach(n => {
    const el = document.getElementById('step-label-' + n);
    if (el) el.textContent = t('post_step' + n);
  });

  const ids = {
    'post-step1-hint': 'post_hint1',
    'post-step2-hint': 'post_hint2',
    'post-step3-hint': 'post_hint3',
    'post-step4-hint': 'post_hint4',
    'upload-title':    'post_upload_title',
    'upload-sub':      'post_upload_sub',
    'upload-badge':    'post_upload_badge',
    'post-desc-label-text': 'post_desc_label',
    'post-desc-optional':   'post_desc_optional',
    'post-next3-label':     'post_sending_step',
    'post-publish-label':   'post_publish',
    'post-edit-label':      'post_edit',
  };
  Object.entries(ids).forEach(([id, key]) => {
    const el = document.getElementById(id);
    if (el) el.textContent = t(key);
  });
  const descTa = document.getElementById('desc-input');
  if (descTa) descTa.placeholder = t('post_desc_placeholder');

  const modalAnonTitle = document.getElementById('modal-anon-title');
  if (modalAnonTitle) modalAnonTitle.textContent = t('modal_anon_title');
  const modalAnonDesc = document.getElementById('modal-anon-copy-hint');
  if (modalAnonDesc) modalAnonDesc.textContent = t('modal_anon_desc');

  const termsMap = {
    'terms-header': 'terms_title', 'terms-h2': 'terms_title',
    'terms-updated': 'terms_updated',
    'terms-01-title': 'terms_01_title', 'terms-01-body': 'terms_01_body',
    'terms-02-title': 'terms_02_title', 'terms-02-body': 'terms_02_body',
    'terms-03-title': 'terms_03_title', 'terms-03-body': 'terms_03_body',
  };
  Object.entries(termsMap).forEach(([id, key]) => {
    const el = document.getElementById(id); if (el) el.textContent = t(key);
  });

  const valBtn = document.getElementById('btn-submit-val');
  if (valBtn && !valBtn.disabled) valBtn.textContent = t('val_btn');

  const valChip = document.getElementById('val-anon-chip');
  if (valChip && (valChip.textContent === ES.val_anon || valChip.textContent === EN.val_anon))
    valChip.textContent = t('val_anon');

  const markReadBtn = document.getElementById('btn-mark-all-read');
  if (markReadBtn) markReadBtn.textContent = t('notifs_mark_read');

  const settingsLoginRow = document.getElementById('settings-login-row');
  if (settingsLoginRow) {
    const fw = settingsLoginRow.querySelector('.fw-medium');
    const sm = settingsLoginRow.querySelector('.text-muted.small');
    if (fw) fw.textContent = t('settings_login_title');
    if (sm) sm.textContent = t('settings_login_sub');
  }
  const termsLabel = document.getElementById('settings-terms-label');
  if (termsLabel) termsLabel.textContent = t('settings_terms');
  const histMap = {
    'settings-history-title': 'settings_history_title',
    'settings-history-sub':   'settings_history_sub',
  };
  Object.entries(histMap).forEach(([id, key]) => {
    const el = document.getElementById(id); if (el) el.textContent = t(key);
  });

  const authTabL = document.getElementById('auth-tab-login');
  if (authTabL) authTabL.textContent = t('auth_tab_login');
  const authTabR = document.getElementById('auth-tab-register');
  if (authTabR) authTabR.textContent = t('auth_tab_register');
  const authBack = document.getElementById('auth-back-btn');
  if (authBack) authBack.textContent = t('auth_btn_skip');

  const dashTabs = { 'dash-tab-submissions': 'dash_tab_subs', 'dash-tab-valuations': 'dash_tab_vals' };
  Object.entries(dashTabs).forEach(([id, key]) => {
    const el = document.getElementById(id); if (el) el.textContent = t(key);
  });
  const dashSearch = document.getElementById('dash-search');
  if (dashSearch) dashSearch.placeholder = t('dash_search');
  const dashFilter = document.getElementById('dash-status-filter');
  if (dashFilter && dashFilter.options.length >= 4) {
    dashFilter.options[0].text = t('dash_filter_all');
    dashFilter.options[1].text = t('dash_filter_pending');
    dashFilter.options[2].text = t('dash_filter_approved');
    dashFilter.options[3].text = t('dash_filter_rejected');
  }

  const loginBtn = document.getElementById('topbar-login');
  if (loginBtn) loginBtn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> ${t('btn_login')}`;

  const sgLoginLbl = document.getElementById('sg-login-label');
  if (sgLoginLbl) sgLoginLbl.textContent = t('settings_account').toUpperCase();
  const sgAccLbl = document.getElementById('sg-account-label');
  if (sgAccLbl) sgAccLbl.textContent = t('settings_account').toUpperCase();

  if (typeof CATEGORIES !== 'undefined') {
    document.querySelectorAll('#cat-select-grid .cat-tile').forEach(btn => {
      const cat = CATEGORIES[+btn.dataset.catId - 1];
      if (cat) { const lbl = btn.querySelector('span:last-child'); if (lbl) lbl.textContent = catLabel(cat); }
    });
    document.querySelectorAll('#auth-cats-grid .auth-cat-chip').forEach(btn => {
      const cat = CATEGORIES[+btn.dataset.catId - 1];
      if (cat) { const lbl = btn.querySelector('span:last-child'); if (lbl) lbl.textContent = catLabel(cat); }
    });
  }

  document.getElementById('lang-en')?.classList.toggle('active', currentLang === 'en');
  document.getElementById('lang-es')?.classList.toggle('active', currentLang === 'es');

  const logoutBtn = document.getElementById('btn-logout');
  if (logoutBtn) { const sp = logoutBtn.querySelector('span'); if (sp) sp.textContent = t('account_logout'); }

  const dashTitleEl = document.querySelector('#screen-dashboard .sticky-top strong');
  if (dashTitleEl) dashTitleEl.textContent = t('dash_title');

  const statsHomeBtn = document.getElementById('stats-home-btn');
  if (statsHomeBtn) { const sp = statsHomeBtn.querySelector('span'); if (sp) sp.textContent = t('stats_back'); }

  const modalTitle = document.querySelector('#modal-submitted h4');
  if (modalTitle) modalTitle.textContent = t('modal_title');
  const modalSub = document.querySelector('#modal-submitted .text-muted.small.mb-3');
  if (modalSub) modalSub.textContent = t('modal_sub');
  const modalUserPrefix = document.querySelector('#modal-user-box .fw-bold');
  if (modalUserPrefix) {
    const nameSpan = document.getElementById('modal-user-name');
    const name = nameSpan ? nameSpan.textContent : '—';
    modalUserPrefix.innerHTML = t('modal_user_prefix') + ' <span id="modal-user-name">' + name + '</span>';
  }
  const modalUserDesc = document.querySelector('#modal-user-box .small.text-muted');
  if (modalUserDesc) modalUserDesc.textContent = t('modal_user_desc');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  if (modalCloseBtn) { const sp = modalCloseBtn.querySelector('span'); if (sp) sp.textContent = t('modal_btn'); }
}

function setLang(lang) {
  if (!['es','en'].includes(lang)) return;
  currentLang = lang;
  try { localStorage.setItem('lang', lang); } catch(e) {}
  applyUI();
  if (typeof renderCatFilter      === 'function') renderCatFilter();
  if (typeof loadFeed             === 'function') loadFeed();
  if (typeof renderSettingsNotifs === 'function') renderSettingsNotifs();
  const scCats = document.getElementById('screen-cats');
  if (typeof renderCommunities === 'function' && scCats && !scCats.classList.contains('d-none'))
    renderCommunities();
}

document.addEventListener('DOMContentLoaded', () => { applyUI(); });