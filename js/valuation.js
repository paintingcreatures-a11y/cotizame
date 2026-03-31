let currentObject = null;

async function openValuation(obj) {
  currentObject = obj;

  document.getElementById('val-object-title').textContent = obj.description || t('no_description');
  document.getElementById('val-object-meta').textContent  =
    (obj.categories?.emoji || '') + ' ' + (obj.categories?.label || '') + ' · ' + timeAgo(obj.created_at);

  const visual = document.getElementById('val-visual');
  if (obj.image_url) {
    visual.innerHTML = `<img src="${obj.image_url}" style="width:100%;height:100%;object-fit:cover;display:block" alt="objeto">`;
  } else {
    visual.innerHTML = `<span style="font-size:4.5rem">${obj.categories?.emoji || '📦'}</span>`;
  }

  const amountInput = document.getElementById('price-input');
  if (amountInput) amountInput.value = '';
  const currencySelect = document.getElementById('currency-select');
  if (currencySelect) currencySelect.value = 'UYU';

  await refreshValStats(obj.id);
  showScreen('val');
}

async function refreshValStats(objId) {
  const { data } = await sb.rpc('object_stats', { obj_id: objId });
  document.getElementById('val-mini-avg').textContent   = data?.avg    ? formatARS(data.avg)    : '—';
  document.getElementById('val-mini-med').textContent   = data?.median ? formatARS(data.median) : '—';
  document.getElementById('val-mini-votes').textContent = data?.count  || 0;
}

function bindValuation() {
  const submitBtn = document.getElementById('btn-submit-val');
  if (submitBtn) submitBtn.addEventListener('click', submitValuation);

  const backBtn = document.getElementById('val-back-btn');
  if (backBtn) backBtn.addEventListener('click', () => showScreen('home'));
}

async function submitValuation() {
  if (!currentObject) return;

  const amountInput    = document.getElementById('price-input');
  const currencySelect = document.getElementById('currency-select');
  const amount         = parseFloat(amountInput?.value);
  const currency       = currencySelect?.value || 'UYU';

  if (!amount || amount <= 0) {
    showToast(t('err_valid_amount'));
    return;
  }

  const btn = document.getElementById('btn-submit-val');
  btn.disabled = true;

  try {
    let { error } = await sb.from('valuations').insert({
      object_id: currentObject.id,
      amount,
      currency,
      user_id: currentUser?.id || null,
    });

    if (error?.message?.includes('currency')) {
      const res = await sb.from('valuations').insert({
        object_id: currentObject.id,
        amount,
        user_id: currentUser?.id || null,
      });
      error = res.error;
    }

    if (error) {
      showToast((currentLang === 'en' ? 'Error: ' : 'Error al cotizar: ') + error.message);
      return;
    }

    showToast(t('toast_val_sent'));
    openStatsScreen(currentObject);
  } catch(e) {
    showToast((currentLang === 'en' ? 'Unexpected error: ' : 'Error inesperado: ') + e.message);
  } finally {
    btn.disabled = false;
  }
}

async function openStatsScreen(obj) {
  const { data: stats } = await sb.rpc('object_stats', { obj_id: obj.id });

  document.getElementById('stats-main-price').textContent = formatARS(stats?.avg) || '—';
  document.getElementById('stats-based-on').textContent   = t('stats_based_on', {n: stats?.count || 0});
  document.getElementById('stats-avg').textContent  = formatARS(stats?.avg);
  document.getElementById('stats-med').textContent  = formatARS(stats?.median);
  document.getElementById('stats-low').textContent  = formatARS(stats?.min);
  document.getElementById('stats-high').textContent = formatARS(stats?.max);

  const { data: vals } = await sb.from('valuations').select('amount').eq('object_id', obj.id);
  const rows = document.getElementById('dist-rows');
  rows.innerHTML = '';
  if (vals?.length) {
    const amounts = vals.map(v => v.amount).sort((a, b) => a - b);
    const n = amounts.length;

    const pctBreaks = [0, 25, 50, 75, 100].map(p => {
      const idx = Math.min(Math.floor(p / 100 * n), n - 1);
      return amounts[idx];
    });

    const uniqueBreaks = [...new Set(pctBreaks)];

    const ranges = [];
    for (let i = 0; i < uniqueBreaks.length - 1; i++) {
      const lo = uniqueBreaks[i];
      const hi = uniqueBreaks[i + 1];
      const isLast = i === uniqueBreaks.length - 2;
      ranges.push({
        label: isLast ? `≥ ${formatARS(lo)}` : `${formatARS(lo)}–${formatARS(hi)}`,
        fn: isLast ? v => v >= lo : v => v >= lo && v < hi,
      });
    }
    ranges.forEach(r => {
      const cnt = vals.filter(v => r.fn(v.amount)).length;
      const pct = Math.round(cnt / vals.length * 100);
      const row = document.createElement('div');
      row.style.cssText = 'display:flex;align-items:center;gap:10px;margin-bottom:10px';
      row.innerHTML = `
        <span style="font-size:.72rem;font-weight:600;color:var(--ink3);min-width:72px;flex-shrink:0">${r.label}</span>
        <div style="flex:1;height:6px;background:var(--surface3);border-radius:3px;overflow:hidden">
          <div style="height:100%;width:${pct}%;background:var(--tangerine);border-radius:3px;transition:width .4s ease"></div>
        </div>
        <span style="font-size:.72rem;font-weight:700;color:${pct > 0 ? 'var(--tangerine)' : 'var(--ink4)'};min-width:44px;text-align:right">${pct}%<span style="font-weight:400;color:var(--ink4)"> (${cnt})</span></span>
      `;
      rows.appendChild(row);
    });
  }

  showScreen('stats');
}
