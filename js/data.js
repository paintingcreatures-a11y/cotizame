const CATEGORIES = [
  { slug:'autos',       label:'Autos',       labelEn:'Cars',        emoji:'🚗' },
  { slug:'electronica', label:'Electrónica', labelEn:'Electronics', emoji:'📱' },
  { slug:'ropa',        label:'Ropa',        labelEn:'Clothing',    emoji:'👕' },
  { slug:'hogar',       label:'Hogar',       labelEn:'Home',        emoji:'🏠' },
  { slug:'deportes',    label:'Deportes',    labelEn:'Sports',      emoji:'⚽' },
  { slug:'arte',        label:'Arte',        labelEn:'Art',         emoji:'🎨' },
  { slug:'joyas',       label:'Joyas',       labelEn:'Jewelry',     emoji:'💍' },
  { slug:'otros',       label:'Otros',       labelEn:'Other',       emoji:'📦' },
];

function formatARS(n) {
  if (!n && n !== 0) return '—';
  return '$' + Math.round(n).toLocaleString('es-AR');
}

function timeAgo(dateStr) {
  const s = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (s < 60)    return (typeof currentLang !== 'undefined' && currentLang === 'en') ? 'now' : 'ahora';
  if (s < 3600)  return Math.floor(s/60) + 'm';
  if (s < 86400) return Math.floor(s/3600) + 'h';
  return Math.floor(s/86400) + 'd';
}

function generateToken() {
  return crypto.randomUUID().replace(/-/g,'').substring(0,16).toUpperCase();
}
