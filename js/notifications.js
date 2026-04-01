function updateNotifBadge(count) {
  try {
    const dot   = document.getElementById('notif-dot');
    const badge = document.getElementById('nav-notif-badge');
    if (dot) dot.style.display = count > 0 ? '' : 'none';
    if (badge) {
      badge.style.display = count > 0 ? '' : 'none';
      if (count > 0) badge.textContent = count > 99 ? '99+' : count;
    }
  } catch(e) {}
}

async function loadNotifCount() {
  if (!currentUser) { updateNotifBadge(0); return; }
  try {
    const { count } = await sb.from('notifications')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', currentUser.id)
      .eq('read', false);
    updateNotifBadge(count || 0);
  } catch(e) { updateNotifBadge(0); }
}

async function loadNotifications() {
  const list = document.getElementById('notif-list');
  if (!list) return;

  list.innerHTML = '<div class="text-center py-4"><div class="spinner-border spinner-border-sm text-warning"></div></div>';

  if (!currentUser) {
    list.innerHTML = `
      <div class="text-center py-5">
        <div class="fs-1 mb-2">🔔</div>
        <p class="text-muted mb-3">Iniciá sesión para ver tus notificaciones.</p>
        <button class="btn btn-warning" onclick="showScreen('auth')">Ingresar</button>
      </div>`;
    updateNotifBadge(0);
    return;
  }

  try {
    const { data, error } = await sb.from('notifications').select(`
      id, type, read, created_at,
      objects(id, description, categories(slug, emoji, label))
    `).eq('user_id', currentUser.id).order('created_at', { ascending: false }).limit(50);

    if (error) throw error;

    list.innerHTML = '';

    if (!data?.length) {
      list.innerHTML = `
        <div class="text-center py-5">
          <div class="fs-1 mb-2">🔔</div>
          <p class="text-muted">${t('notifs_empty')}</p>
          <p class="text-muted small">${t('notifs_empty_sub')}</p>
        </div>`;
      updateNotifBadge(0);
      return;
    }

    const unread = data.filter(n => !n.read).length;
    updateNotifBadge(unread);

    data.forEach(n => {
      const obj  = n.objects;
      const item = document.createElement('div');
      item.className = 'list-group-item list-group-item-action d-flex gap-3 py-3'
        + (n.read ? '' : ' fw-semibold');
      item.style.background = n.read ? '' : 'rgba(245,158,11,.08)';

      item.innerHTML = `
        <div class="fs-3 align-self-center">${obj?.categories?.emoji || '📦'}</div>
        <div class="flex-grow-1 overflow-hidden">
          <div class="small">${n.type === 'new_object'
            ? t('notifs_new_object') + ' <strong>' + (catLabelFromSlug(obj?.categories?.slug) || obj?.categories?.label || 'tu categoría') + '</strong>'
            : t('notifs_result')}</div>
          <div class="text-truncate small text-muted">${obj?.description || '—'}</div>
          <div class="text-muted" style="font-size:.72rem">${timeAgo(n.created_at)}</div>
        </div>
        ${!n.read
          ? `<span class="badge bg-danger rounded-pill align-self-center">${t('new_badge')}</span>`
          : '<span class="text-muted align-self-center small">✓</span>'}
      `;

      item.addEventListener('click', async () => {
        if (!n.read) {
          await sb.from('notifications').update({ read: true }).eq('id', n.id);
          item.style.background = '';
          item.classList.remove('fw-semibold');
          item.querySelector('.badge.bg-danger')?.remove();
          n.read = true;
          const b = document.getElementById('nav-notif-badge');
          if (b && b.style.display !== 'none') {
            const cur = parseInt(b.textContent) || 1;
            updateNotifBadge(cur <= 1 ? 0 : cur - 1);
          }
        }
        if (obj?.id) {
          const { data: fullObj } = await sb.from('objects').select(
            'id, description, image_url, created_at, status, categories(slug,label,emoji), valuations(amount)'
          ).eq('id', obj.id).single();
          if (fullObj?.status === 'approved') openValuation(fullObj);
        }
      });

      list.appendChild(item);
    });
  } catch(e) {
    list.innerHTML = `<p class="text-center text-muted py-4">Error cargando notificaciones: ${e.message}</p>`;
  }
}

async function markAllRead() {
  if (!currentUser) return;
  await sb.from('notifications')
    .update({ read: true })
    .eq('user_id', currentUser.id)
    .eq('read', false);
  updateNotifBadge(0);
  loadNotifications();
  showToast(t('toast_notifs_read'));
}