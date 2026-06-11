const cardsEl = document.querySelector('#cards');
const featuredEl = document.querySelector('#featured');
const searchEl = document.querySelector('#search');
const emptyEl = document.querySelector('#empty');

const fmtDate = (iso) => {
  if (!iso) return 'Ohne Datum';
  return new Intl.DateTimeFormat('de-DE', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(`${iso}T12:00:00`));
};

const escapeHtml = (value = '') => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

const tagMarkup = (tags = []) => tags.map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join('');

const sourceMarkup = (sources = [], limit = 3) => {
  const visible = sources.slice(0, limit);
  if (!visible.length) return '<span class="source-note">Quellen werden im nächsten Digest sichtbarer erfasst.</span>';
  return visible.map(source => `<a class="source-pill" href="${source.url}" target="_blank" rel="noreferrer">${escapeHtml(source.label)} ↗</a>`).join('');
};

const visualMarkup = (item) => `
  <div class="visual" data-topic="${escapeHtml(item.visualTag || 'AI')}">
    <span>${escapeHtml(item.visualTag || 'AI')}</span>
    <small>${escapeHtml(item.weekday || '')}</small>
  </div>`;

const cardMarkup = (item) => `
  <article class="card">
    ${visualMarkup(item)}
    <div class="date-block">
      <span class="weekday">${escapeHtml(item.weekday || '')}</span>
      <span class="date">${escapeHtml(item.dateLabel || fmtDate(item.date))}</span>
    </div>
    <h3>${escapeHtml(item.title)}</h3>
    <p>${escapeHtml(item.summary || 'Kurzer Daily AI Digest mit Signalen, Einordnung und Content-Angles.')}</p>
    <div class="tags">${tagMarkup(item.tags)}</div>
    <div class="sources" aria-label="Quellen">${sourceMarkup(item.sources || [], 3)}</div>
    <div class="card-actions">
      <a class="mini-link" href="${item.file}">Tagesseite öffnen →</a>
    </div>
  </article>`;

function render(items) {
  const [latest, ...rest] = items;
  featuredEl.innerHTML = latest ? `
    <article class="featured-card">
      ${visualMarkup(latest)}
      <div>
        <div class="date-block inverted">
          <span class="weekday">Neuester Digest · ${escapeHtml(latest.weekday || '')}</span>
          <span class="date">${escapeHtml(latest.dateLabel || fmtDate(latest.date))}</span>
        </div>
        <h3>${escapeHtml(latest.title)}</h3>
        <p>${escapeHtml(latest.summary || '')}</p>
        <div class="sources light">${sourceMarkup(latest.sources || [], 4)}</div>
      </div>
      <a class="button primary" href="${latest.file}">Tagesseite öffnen →</a>
    </article>` : '';
  cardsEl.innerHTML = rest.map(cardMarkup).join('');
  emptyEl.hidden = items.length !== 0;
}

const response = await fetch('./data/news.json', { cache: 'no-store' });
const news = await response.json();

const sourceCount = news.reduce((sum, item) => sum + (item.sources?.length || item.links?.length || 0), 0);
document.querySelector('#stat-count').textContent = news.length;
document.querySelector('#stat-links').textContent = sourceCount;
document.querySelector('#stat-latest').textContent = news[0]?.dateLabel || (news[0]?.date ? fmtDate(news[0].date) : '–');

render(news);

searchEl.addEventListener('input', () => {
  const query = searchEl.value.trim().toLowerCase();
  if (!query) return render(news);
  const filtered = news.filter(item => [
    item.title,
    item.summary,
    item.date,
    item.dateLabel,
    item.weekday,
    ...(item.tags || []),
    ...(item.sources || []).flatMap(source => [source.label, source.url]),
    ...(item.links || [])
  ].join(' ').toLowerCase().includes(query));
  render(filtered);
});
