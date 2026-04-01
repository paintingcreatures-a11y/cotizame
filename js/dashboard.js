let dashTab = 'submissions';

async function renderSettingsHistory() {
  const group  = document.getElementById('settings-history-group');
  const list   = document.getElementById('settings-history-list');
  const toggle = document.getElementById('settings-history-toggle');
  const arrow  = document.getElementById('settings-history-arrow');
  if (!group || !list || !toggle) return;

  if (!currentUser) { group.style.display = 'none'; return; }

  group.style.display = '';
  list.style.display  = 'none';
  list.innerHTML      = '';
  if (arrow) arrow.textContent = '↓';

  const newToggle = toggle.cloneNode(true);
  toggle.parentNode.replaceChild(newToggle, toggle);
  const newArrow = document.getElementById('settings-history-arrow');

  newToggle.addEventListener('click', async () => {
    const isOpen = list.style.display !== 'none';
    if (isOpen) {
      list.style.display = 'none';
      if (newArrow) newArrow.textContent = '↓';
    } else {
      list.style.display = '';
      if (newArrow) newArrow.textContent = '↑';
      if (!list.innerHTML) await _loadHistoryItems(list);
    }
  });
}

async function _loadHistoryItems(list) {
  list.innerHTML = '<div class="list-group-item text-muted small text-center py-2"><div class="spinner-border spinner-border-sm"></div></div>';

  const { data, error } = await sb.from('objects').select(`
    id, description, status, created_at, image_url,
    categories(emoji, label),
    valuations(amount)
  `).eq('user_id', currentUser.id)
    .order('created_at', { ascending: false })
    .limit(5);

  list.innerHTML = '';

  if (error || !data?.length) {
    list.innerHTML = '<div class="list-group-item text-muted small text-center py-3">No publicaste nada todavía.</div>';
    return;
  }

  data.forEach(obj => {
    const avg = obj.valuations?.length
      ? Math.round(obj.valuations.reduce((a, v) => a + v.amount, 0) / obj.valuations.length)
      : null;
    const statusColor = { pending: '#f59e0b', approved: '#10b981', rejected: '#ef4444' }[obj.status] || '#6b7280';
    const statusLabel = { pending: t('status_pending'), approved: t('status_approved'), rejected: t('status_rejected') }[obj.status] || obj.status;

    const item = document.createElement('div');
    item.className = 'list-group-item list-group-item-action py-2';
    item.style.cursor = obj.status === 'approved' ? 'pointer' : 'default';
    item.innerHTML = `
      <div class="d-flex align-items-center gap-3">
        ${obj.image_url
          ? `<img src="${obj.image_url}" class="rounded flex-shrink-0" style="width:48px;height:48px;object-fit:cover;border:1.5px solid var(--border)" alt="">`
          : `<div class="rounded flex-shrink-0 d-flex align-items-center justify-content-center" style="width:48px;height:48px;background:rgba(245,158,11,.1);font-size:1.5rem;border:1.5px solid var(--border)">${obj.categories?.emoji || '📦'}</div>`
        }
        <div class="flex-grow-1 overflow-hidden">
          <div class="fw-medium text-truncate" style="font-size:.85rem;max-width:200px">${obj.description || t('no_description')}</div>
          <div class="text-muted" style="font-size:.72rem">${obj.categories?.emoji || ''} ${obj.categories?.label || ''} · ${timeAgo(obj.created_at)}</div>
          ${avg ? `<div style="font-size:.78rem;font-weight:700;color:var(--tangerine)">${formatARS(avg)} ${t('avg_label')}</div>` : ''}
        </div>
        <span class="flex-shrink-0 badge" style="background:${statusColor}20;color:${statusColor};border:1px solid ${statusColor};font-size:.65rem">${statusLabel}</span>
      </div>
    `;
    if (obj.status === 'approved') {
      item.addEventListener('click', async () => {
        const { data: full } = await sb.from('objects').select(
          'id, description, image_url, created_at, status, categories(slug,label,emoji), valuations(amount)'
        ).eq('id', obj.id).single();
        if (full) openValuation(full);
      });
    }
    list.appendChild(item);
  });

  const more = document.createElement('button');
  more.className = 'list-group-item list-group-item-action text-center';
  more.style.cssText = 'font-size:.8rem;color:var(--tangerine);font-weight:700;border-top:1.5px solid var(--border)';
  more.textContent = t('settings_history_see_all');
  more.addEventListener('click', () => {
    dashTab = 'submissions';
    showScreen('dashboard');
  });
  list.appendChild(more);
}

function bindDashboard() {
  document.getElementById('dash-tab-submissions').addEventListener('click', () => {
    dashTab = 'submissions';
    setDashTab();
    loadDashList();
  });
  document.getElementById('dash-tab-valuations').addEventListener('click', () => {
    dashTab = 'valuations';
    setDashTab();
    loadDashList();
  });
  document.getElementById('dash-search').addEventListener('input', loadDashList);
  document.getElementById('dash-status-filter').addEventListener('change', loadDashList);
}

function setDashTab() {
  document.getElementById('dash-tab-submissions').classList.toggle('active', dashTab === 'submissions');
  document.getElementById('dash-tab-valuations').classList.toggle('active',  dashTab === 'valuations');
}

async function loadDashList() {
  if (!currentUser) {
    document.getElementById('dash-list').innerHTML = '<p class="text-center text-muted py-5">'+t('login_to_see')+'</p>';
    return;
  }

  const list      = document.getElementById('dash-list');
  const search    = document.getElementById('dash-search').value.toLowerCase();
  const statusFlt = document.getElementById('dash-status-filter').value;

  list.innerHTML = '<div class="text-center py-4"><div class="spinner-border spinner-border-sm text-warning"></div></div>';

  if (dashTab === 'submissions') {
    let q = sb.from('objects').select(`
      id, description, status, created_at, image_url,
      categories(emoji, label),
      valuations(amount)
    `).eq('user_id', currentUser.id).order('created_at',{ascending:false});

    if (statusFlt) q = q.eq('status', statusFlt);

    const { data } = await q;
    const filtered = (data || []).filter(o =>
      !search || (o.description || '').toLowerCase().includes(search)
    );

    list.innerHTML = '';
    if (!filtered.length) { list.innerHTML = '<p class="text-center text-muted py-5">Sin publicaciones.</p>'; return; }

    filtered.forEach(obj => {
      const avg = obj.valuations?.length
        ? Math.round(obj.valuations.reduce((a,v)=>a+v.amount,0)/obj.valuations.length) : null;
      const statusBadge = { pending:'warning', approved:'success', rejected:'danger' }[obj.status] || 'secondary';
      const item = document.createElement('div');
      item.className = 'list-group-item list-group-item-action py-3';
      item.style.cursor = 'pointer';
      item.innerHTML = `
        <div class="d-flex justify-content-between align-items-start">
          <div class="d-flex gap-3 align-items-center flex-grow-1">
            ${obj.image_url
              ? `<img src="${obj.image_url}" class="rounded" style="width:56px;height:56px;object-fit:cover" alt="">`
              : `<div class="d-flex align-items-center justify-content-center rounded bg-warning bg-opacity-10" style="width:56px;height:56px;font-size:1.8rem">${obj.categories?.emoji||'📦'}</div>`
            }
            <div>
              <div class="fw-medium text-truncate" style="max-width:200px">${obj.description || t('no_description')}</div>
              <div class="text-muted small">${obj.categories?.emoji||''} ${obj.categories?.label||''} · ${timeAgo(obj.created_at)}</div>
              ${avg ? `<div class="text-warning fw-bold">Promedio: ${formatARS(avg)}</div>` : ''}
            </div>
          </div>
          <span class="badge bg-${statusBadge} ms-2">${obj.status}</span>
        </div>
      `;
      item.addEventListener('click', () => { if (obj.status==='approved') openValuation(obj); });
      list.appendChild(item);
    });

  } else {
    const { data } = await sb.from('valuations').select(`
      id, amount, created_at,
      objects(id, description, status, image_url, created_at, categories(slug, emoji, label))
    `).eq('user_id', currentUser.id).order('created_at',{ascending:false});

    const filtered = (data || []).filter(v =>
      !search || (v.objects?.description || '').toLowerCase().includes(search)
    );

    list.innerHTML = '';
    if (!filtered.length) { list.innerHTML = '<p class="text-center text-muted py-5">Sin cotizaciones.</p>'; return; }

    filtered.forEach(val => {
      const obj  = val.objects;
      const item = document.createElement('div');
      item.className = 'list-group-item list-group-item-action py-3';
      item.innerHTML = `
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <div class="fw-medium text-truncate" style="max-width:220px">${obj?.description || '—'}</div>
            <div class="text-muted small">${obj?.categories?.emoji||''} ${obj?.categories?.label||''} · ${timeAgo(val.created_at)}</div>
          </div>
          <div class="text-warning fw-bold fs-5">${formatARS(val.amount)}</div>
        </div>
      `;
      item.addEventListener('click', () => { if (obj?.status==='approved') openValuation(obj); });
      list.appendChild(item);
    });
  }
}
