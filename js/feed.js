let activeCatFilter = null;

async function loadFeed() {
  const container = document.getElementById('feed-cards');
  container.innerHTML = '<div class="text-center py-5"><div class="spinner-border text-warning"></div></div>';

  const { data, error } = await sb.from('objects').select(`
    id, description, image_url, created_at, status,
    categories(slug, label, emoji),
    valuations(amount)
  `).eq('status','approved').order('created_at',{ascending:false}).limit(30);

  if (error) {
    container.innerHTML = `<div class="alert alert-danger mx-3 mt-3"><strong>Error:</strong> ${error.message}</div>`;
    return;
  }

  const avgEl = document.getElementById('stat-avg-price');
  if (avgEl) {
    sb.from('valuations').select('amount').then(({ data: vals }) => {
      if (vals?.length) avgEl.textContent = formatARS(Math.round(vals.reduce((a,v)=>a+v.amount,0)/vals.length));
    });
  }

  const filtered = activeCatFilter ? data.filter(o=>o.categories?.slug===activeCatFilter) : data;

  document.getElementById('stat-objects').textContent    = filtered.length || 0;
  document.getElementById('stat-valuations').textContent = filtered.reduce((a,o)=>a+(o.valuations?.length||0),0);

  container.innerHTML = '';
  if (!filtered.length) {
    container.innerHTML = `<p class="text-center text-muted py-5">${t('feed_empty_cat')}</p>`;
    return;
  }

  filtered.forEach(obj => {
    if (!obj.categories) return;
    const avg = obj.valuations?.length
      ? Math.round(obj.valuations.reduce((a,v)=>a+v.amount,0)/obj.valuations.length) : null;
    const desc = obj.description || '';

    const card = document.createElement('div');
    card.className = 'list-group-item list-group-item-action p-0 border-bottom';
    card.style.cursor = 'pointer';
    card.innerHTML = `
      <div class="d-flex align-items-stretch">
        <div class="flex-shrink-0" style="width:110px;min-height:110px">
          ${obj.image_url
            ? `<img src="${obj.image_url}" style="width:110px;height:100%;min-height:110px;object-fit:cover;display:block" alt="">`
            : `<div style="width:110px;min-height:110px;display:flex;align-items:center;justify-content:center;background:rgba(245,158,11,.08);font-size:2.5rem">${obj.categories?.emoji||'📦'}</div>`}
        </div>
        <div class="p-3 flex-grow-1">
          <span class="badge mb-1" style="font-size:.7rem;background:#fff;color:var(--ink);border:1.5px solid var(--ink)">${obj.categories?.emoji||''} ${catLabelFromSlug(obj.categories?.slug)}</span>
          <p class="mb-1 fw-medium" data-tx="${desc.replace(/"/g,'&quot;')}" style="font-size:.9rem;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical">${desc || t('feed_no_desc')}</p>
          <div class="d-flex align-items-center gap-2 mt-2">
            <span class="fw-bold" style="color:var(--tangerine);font-size:1.05rem">${avg ? formatARS(avg) : t('feed_no_val')}</span>
            <span class="text-muted" style="font-size:.75rem">${obj.valuations?.length||0} ${t('feed_cotiz')}</span>
          </div>
          <div class="text-muted" style="font-size:.72rem;margin-top:2px">${timeAgo(obj.created_at)}</div>
        </div>
      </div>`;
    card.addEventListener('click', () => openValuation(obj));
    container.appendChild(card);
  });
}

function renderCatFilter() {
  const el = document.getElementById('cat-filter');
  el.innerHTML = '';
  const all = document.createElement('button');
  all.className = 'cat-pill' + (!activeCatFilter ? ' active' : '');
  all.textContent = t('feed_all_cats');
  all.addEventListener('click', () => { activeCatFilter = null; renderCatFilter(); loadFeed(); });
  el.appendChild(all);
  CATEGORIES.forEach(c => {
    const btn = document.createElement('button');
    btn.className = 'cat-pill' + (activeCatFilter===c.slug ? ' active' : '');
    btn.textContent = c.emoji + ' ' + catLabel(c);
    btn.addEventListener('click', () => { activeCatFilter = c.slug; renderCatFilter(); loadFeed(); });
    el.appendChild(btn);
  });
}

async function loadTicker() {
  const { data } = await sb.from('objects').select('description, categories(emoji)')
    .eq('status','approved').order('created_at',{ascending:false}).limit(15);
  if (!data?.length) return;
  const track = document.getElementById('ticker-track');
  track.innerHTML = [...data,...data].map(o =>
    `<span class="ticker-item">${o.categories?.emoji||'📦'} ${o.description?.substring(0,40)||'...'}</span>`
  ).join('');
}
