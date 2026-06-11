# DailyNews

Öffentliches, source-basiertes Archiv für tägliche AI-News auf Deutsch.

## Was hier liegt

- `index.html` — statische Overview für GitHub Pages
- `styles.css` — KIFlowState-nahes Design
- `app.js` — Suche, Karten, Statistiken
- `data/api/index.json` — stabiler Feed-Index für Website-Integrationen
- `data/api/latest.json` — aktuellster vollständiger Digest
- `data/api/days/*.json` — ein sauber strukturierter JSON-Digest pro Tag
- `data/api/schema.json` — JSON Schema für Frontend/Claude-Code-Integration
- `data/news.json` — Legacy-Index der aktuellen GitHub-Pages-Ansicht
- `news/*.md` — Markdown-Archiv, nicht für neue Website-UIs gedacht

## Nutzung

Dieses Repo ist bewusst statisch gehalten. GitHub Pages kann es direkt aus dem Root-Verzeichnis veröffentlichen.

## Website-Integration

Für die KIFlowState-Website sollte nicht Markdown, sondern der stabile JSON-Feed genutzt werden:

- Feed Index: `https://juliankarge.github.io/DailyNews/data/api/index.json`
- Latest Digest: `https://juliankarge.github.io/DailyNews/data/api/latest.json`
- Einzelner Tag: `https://juliankarge.github.io/DailyNews/data/api/days/YYYY-MM-DD.json`

Details und Claude-Code-Prompt: `data/api/README.md`

Empfohlene Pages-Einstellung:

- Source: `Deploy from a branch` → `main` → `/root`

## Workflow-Idee

Telegram bekommt künftig nur noch kurze Hinweise wie:

> Daily News ist online: https://juliankarge.github.io/DailyNews/

Der vollständige Digest landet hier im Repo.
