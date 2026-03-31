let selectedCatId  = null;
let uploadedFileURL = null;

function bindPost() {
  const grid = document.getElementById('cat-select-grid');
  if (!grid) return;

  CATEGORIES.forEach((c, i) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'cat-tile';
    btn.dataset.catId = i + 1;
    btn.dataset.emoji = c.emoji;
    btn.dataset.label = c.label; btn.dataset.labelEn = c.labelEn || c.label;
    btn.style.cssText = `
      display:flex;flex-direction:column;align-items:center;justify-content:center;
      gap:5px;padding:10px 4px;
      background:var(--surface);border:2px solid var(--ink);
      border-radius:var(--r);cursor:pointer;
      transition:all .14s;box-shadow:var(--sh-sm);
      text-align:center;
    `;
    btn.innerHTML = `
      <span style="font-size:1.5rem;line-height:1">${c.emoji}</span>
      <span style="font-size:.62rem;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:var(--ink2);line-height:1.2;font-family:'DM Sans',sans-serif">${catLabel(c)}</span>
    `;
    btn.addEventListener('click', () => {
      selectedCatId = i + 1;
      grid.querySelectorAll('.cat-tile').forEach(b => {
        b.classList.remove('selected');
        b.style.background  = 'var(--surface)';
        b.style.boxShadow   = 'var(--sh-sm)';
        b.style.transform   = '';
        const lbl = b.querySelector('span:last-child');
        if (lbl) lbl.style.color = 'var(--ink2)';
      });
      btn.classList.add('selected');
      btn.style.background  = 'var(--ink)';
      btn.style.boxShadow   = 'var(--sh)';
      btn.style.transform   = 'translate(-1px,-1px)';
      const lbl = btn.querySelector('span:last-child');
      if (lbl) lbl.style.color = 'var(--gold)';

      const next2 = document.getElementById('post-next-2');
      if (next2) {
        next2.disabled = false;
        next2.style.background  = 'var(--tangerine)';
        next2.style.color       = '#fff';
        next2.style.cursor      = 'pointer';
        next2.style.boxShadow   = 'var(--sh)';
      }
    });
    grid.appendChild(btn);
  });

  const fileInput = document.getElementById('photo-file-input');
  const zone      = document.getElementById('upload-zone');
  const inner     = document.getElementById('upload-zone-inner');

  if (zone)  zone.addEventListener('click',  () => fileInput.click());
  if (inner) inner.addEventListener('click', (e) => { e.stopPropagation(); fileInput.click(); });

  zone?.addEventListener('dragover', e => e.preventDefault());
  zone?.addEventListener('drop', e => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  });

  fileInput?.addEventListener('change', () => {
    if (fileInput.files[0]) handleFileSelect(fileInput.files[0]);
  });

  document.getElementById('btn-submit-post')?.addEventListener('click', submitPost);
}

function handleFileSelect(file) {
  if (!['image/jpeg','image/png','image/webp'].includes(file.type)) {
    showToast(t('err_invalid_format')); return;
  }
  if (file.size > 10 * 1024 * 1024) {
    showToast(t('err_file_too_large')); return;
  }
  const reader = new FileReader();
  reader.onload = e => {
    const inner = document.getElementById('upload-zone-inner');
    if (inner) inner.innerHTML = `
      <img src="${e.target.result}" style="max-height:220px;max-width:100%;object-fit:cover;border-radius:var(--r-lg)" alt="preview">
      <div style="margin-top:10px;font-size:.8rem;color:var(--mint);font-weight:700">✓ ${t('post_upload_badge_done')}</div>
    `;
    uploadedFileURL = e.target.result;
    window._selectedFile = file;
    if (window._postStepController) window._postStepController.enableNext1();
  };
  reader.readAsDataURL(file);
}

function isAnonMode() {
  if (!currentUser) return true;
  return localStorage.getItem('anon_mode') !== 'false';
}

function updateAnonMode(isAnon) {
  const postText = document.getElementById('post-anon-text');
  if (!postText) return;
  if (!currentUser) {
    postText.textContent = t('post_anon');
    return;
  }
  postText.textContent = isAnon ? t('post_anon_mode') : '';
}

async function submitPost() {
  if (!selectedCatId) { showToast(t('err_no_category')); return; }

  const btn = document.getElementById('btn-submit-post');
  btn.disabled = true;
  btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>' + t('post_sending');

  try {
    let image_url = null;

    if (window._selectedFile) {
      const mimeToExt = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' };
      const ext = mimeToExt[window._selectedFile.type]
        || window._selectedFile.name.split('.').pop().toLowerCase()
        || 'jpg';
      const fname = `${Date.now()}_${Math.random().toString(36).slice(2,8)}.${ext}`;
      const { data: uploadData, error: upErr } = await sb.storage
        .from('objects')
        .upload(fname, window._selectedFile, { upsert: false, contentType: window._selectedFile.type });
      if (upErr) throw upErr;
      const { data: urlData } = sb.storage.from('objects').getPublicUrl(fname);
      image_url = urlData?.publicUrl || null;
    }

    const desc  = document.getElementById('desc-input').value.trim();
    const token = generateToken();
    const row   = {
      category_id: selectedCatId,
      description: desc || null,
      image_url,
      status: 'approved',
      delete_token: !currentUser ? token : null,
      user_id: currentUser?.id || null,
    };

    const { error } = await sb.from('objects').insert(row);
    if (error) throw error;

    const tokenBox = document.getElementById('modal-token-box');
    const userBox  = document.getElementById('modal-user-box');
    const tokenEl  = document.getElementById('modal-delete-token');

    if (tokenBox) tokenBox.style.display = '';
    if (tokenEl) {
      tokenEl.textContent = token;
      tokenEl.style.cursor = 'pointer';
      tokenEl.onclick = () => {
        navigator.clipboard.writeText(token).then(() => showToast(t('toast_copied')));
      };
    }

    if (userBox) {
      if (currentUser && !isAnonMode()) {
        userBox.style.display = '';
        const nameEl = document.getElementById('modal-user-name');
        if (nameEl) nameEl.textContent = currentUser.user_metadata?.name || currentUser.email;
      } else {
        userBox.style.display = 'none';
      }
    }

    try {
      const modal = new bootstrap.Modal(document.getElementById('modal-submitted'));
      modal.show();
    } catch(e) {
      document.getElementById('modal-overlay')?.classList.add('show');
    }

    resetPostForm();
  } catch(e) {
    showToast((currentLang === 'en' ? 'Error sending: ' : 'Error al enviar: ') + e.message);
  } finally {
    btn.disabled = false;
    btn.textContent = t('post_publish');
  }
}

function resetPostForm() {
  selectedCatId   = null;
  uploadedFileURL = null;
  window._selectedFile = null;
  const descEl = document.getElementById('desc-input');
  if (descEl) descEl.value = '';
  const inner = document.getElementById('upload-zone-inner');
  if (inner) inner.innerHTML = `
    <div style="font-size:2.8rem;margin-bottom:10px;opacity:.4">📷</div>
    <div style="font-family:'Syne',sans-serif;font-weight:700;font-size:.95rem;color:var(--ink);margin-bottom:5px" id="upload-title">${t('post_upload_title')}</div>
    <div style="font-size:.75rem;color:var(--ink4);margin-bottom:14px" id="upload-sub">${t('post_upload_sub')}</div>
    <div style="display:inline-block;padding:6px 18px;background:var(--ink);color:var(--gold);font-size:.78rem;font-weight:700;border-radius:var(--r-pill);box-shadow:var(--sh-sm)" id="upload-badge">${t('post_upload_badge')}</div>
  `;
  document.querySelectorAll('#cat-select-grid .cat-tile').forEach(b => {
    b.classList.remove('selected');
    b.style.background  = 'var(--surface)';
    b.style.boxShadow   = 'var(--sh-sm)';
    b.style.transform   = '';
    const lbl = b.querySelector('span:last-child');
    if (lbl) lbl.style.color = 'var(--ink2)';
  });

  ['post-next-1','post-next-2'].forEach(id => {
    const btn = document.getElementById(id);
    if (btn) {
      btn.disabled = true;
      btn.style.background  = 'var(--surface3)';
      btn.style.color       = 'var(--ink3)';
      btn.style.cursor      = 'not-allowed';
      btn.style.boxShadow   = 'none';
    }
  });

  if (window._postStepController) window._postStepController.goTo(1);
}
