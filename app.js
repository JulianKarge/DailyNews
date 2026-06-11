const cardsEl = document.querySelector('#cards');
const featuredEl = document.querySelector('#featured');
const searchEl = document.querySelector('#search');
const emptyEl = document.querySelector('#empty');

const fmtDate = (iso) => {
  if (!iso) return 'Ohne Datum';
  return new Intl.DateTimeFormat('de-DE', { dateStyle: 'medium' }).format(new Date(`${iso}T12:00:00`));
};

const escapeHtml = (value = '') => value
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

const tagMarkup = (tags = []) => tags.map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join('');

const cardMarkup = (item) => `
  <article class="card">
    <div class="date">${fmtDate(item.date)}</div>
    <h3>${escapeHtml(item.title)}</h3>
    <p>${escapeHtml(item.summary || 'Kurzer Daily AI Digest mit Signalen, Einordnung und Content-Angles.')}</p>
    <div class="tags">${tagMarkup(item.tags)}</div>
    <div class="card-actions">
      <a class="mini-link" href="${item.file}">Markdown öffnen →</a>
      ${(item.links || [])[0] ? `<a class="mini-link" href="${item.links[0]}" target="_blank" rel="noreferrer">Top-Quelle ↗</a>` : ''}
    </div>
  </article>`;

function render(items) {
  const [latest, ...rest] = items;
  featuredEl.innerHTML = latest ? `
    <article class="featured-card">
      <div>
        <div class="date">Neuester Digest · ${fmtDate(latest.date)}</div>
        <h3>${escapeHtml(latest.title)}</h3>
        <p>${escapeHtml(latest.summary || '')}</p>
      </div>
      <a class="button primary" href="${latest.file}">Lesen →</a>
    </article>` : '';
  cardsEl.innerHTML = rest.map(cardMarkup).join('');
  emptyEl.hidden = items.length !== 0;
}

const response = await fetch('./data/news.json', { cache: 'no-store' });
const news = await response.json();

const linkCount = news.reduce((sum, item) => sum + (item.links?.length || 0), 0);
document.querySelector('#stat-count').textContent = news.length;
document.querySelector('#stat-links').textContent = linkCount;
document.querySelector('#stat-latest').textContent = news[0]?.date ? fmtDate(news[0].date) : '–';

render(news);

searchEl.addEventListener('input', () => {
  const query = searchEl.value.trim().toLowerCase();
  if (!query) return render(news);
  const filtered = news.filter(item => [
    item.title,
    item.summary,
    item.date,
    ...(item.tags || []),
    ...(item.links || [])
  ].join(' ').toLowerCase().includes(query));
  render(filtered);
});
