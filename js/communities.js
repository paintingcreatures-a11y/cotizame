async function renderCommunities() {
  const list = document.getElementById('community-list');
  list.innerHTML = '';

  let subs = new Set();
  if (currentUser) {
    const { data } = await sb.from('subscriptions').select('category_id').eq('user_id', currentUser.id);
    subs = new Set((data || []).map(s => s.category_id));
  }

  const { data: stats } = await sb.from('objects').select('category_id, id')
    .eq('status','approved');
  const countByCat = {};
  (stats || []).forEach(o => { countByCat[o.category_id] = (countByCat[o.category_id]||0)+1; });

  document.getElementById('cats-following-label').textContent = `${t('cats_following')} ${subs.size}`;

  CATEGORIES.forEach((c, i) => {
    const catId = i + 1;
    const isSub = subs.has(catId);
    const count = countByCat[catId] || 0;

    const item = document.createElement('div');
    item.className = 'list-group-item list-group-item-action py-3 d-flex justify-content-between align-items-center';
    item.innerHTML = `
      <div class="d-flex align-items-center gap-3">
        <div class="fs-2">${c.emoji}</div>
        <div>
          <div class="fw-semibold">${catLabel(c)}</div>
          <div class="text-muted small">${count} ${t('objects_published')}</div>
        </div>
      </div>
      <button class="btn btn-sm ${isSub ? 'btn-warning' : 'btn-outline-secondary'} sub-btn" data-cat-id="${catId}">
        ${isSub ? '✓ Siguiendo' : '+ Seguir'}
      </button>
    `;

    const btn = item.querySelector('.sub-btn');
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      if (!currentUser) { showToast(t('login_to_follow')); showScreen('auth'); return; }
      if (subs.has(catId)) {
        await sb.from('subscriptions').delete().eq('user_id', currentUser.id).eq('category_id', catId);
        subs.delete(catId);
        btn.className = 'btn btn-sm btn-outline-secondary sub-btn';
        btn.textContent = '+ Seguir';
      } else {
        await sb.from('subscriptions').insert({ user_id: currentUser.id, category_id: catId });
        subs.add(catId);
        btn.className = 'btn btn-sm btn-warning sub-btn';
        btn.textContent = '✓ Siguiendo';
      }
      document.getElementById('cats-following-label').textContent = `${t('cats_following')} ${subs.size}`;
    });

    item.addEventListener('click', () => {
      activeCatFilter = c.slug;
      renderCatFilter();
      loadFeed();
      showScreen('home');
    });

    list.appendChild(item);
  });
}
