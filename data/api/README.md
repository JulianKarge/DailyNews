# DailyNews API Feed

This folder is the stable data contract for embedding KIFlowState Daily AI News into another website.

## Public URLs

- Feed index: `https://juliankarge.github.io/DailyNews/data/api/index.json`
- Latest full digest: `https://juliankarge.github.io/DailyNews/data/api/latest.json`
- Individual day: `https://juliankarge.github.io/DailyNews/data/api/days/YYYY-MM-DD.json`

## Recommended integration

1. Fetch `index.json` for archive lists and latest metadata.
2. Fetch `latest.json` for the homepage/latest-news module.
3. Fetch `days/{date}.json` when opening a day detail page.
4. Render `items[]` as source-backed cards.
5. Always show `source.url` or `sources[]` next to factual claims.

## Data principles

- Do not render raw Markdown in the website UI.
- Treat JSON as the source of truth.
- Every factual news item should have a source URL.
- Summaries are short and transformative, not article copies.
- Images should be own/generated/abstract visuals unless an external image license is clear.

## TypeScript shape

```ts
export type DailyNewsIndex = {
  schema_version: '1.0';
  feed: 'kiflowstate-daily-ai-news';
  title: string;
  description: string;
  language: 'de';
  updated_at: string;
  count: number;
  latest_date: string;
  base_url: string;
  days: DailyNewsDaySummary[];
};

export type DailyNewsDaySummary = {
  id: string;
  date: string; // YYYY-MM-DD
  weekday: string;
  date_label: string;
  title: string;
  dek: string;
  language: 'de';
  status: 'published' | 'draft';
  tags: string[];
  hero: DailyNewsHero;
  canonical_url: string;
  web_url: string;
  item_count: number;
  source_count: number;
};

export type DailyNewsDay = DailyNewsDaySummary & {
  schema_version: '1.0';
  summary: string;
  generated_at: string;
  items: DailyNewsItem[];
  sources: DailyNewsSource[];
  legacy?: {
    markdown_url?: string;
    html_page?: string;
  };
};

export type DailyNewsItem = {
  title: string;
  summary: string;
  why_it_matters: string;
  source: DailyNewsSource;
  sources: DailyNewsSource[];
  tags: string[];
  confidence: 'high' | 'medium' | 'low';
};

export type DailyNewsSource = {
  name: string;
  url: string;
};

export type DailyNewsHero = {
  topic: string;
  accent: string;
  image_alt: string;
};
```

## Claude Code prompt for KIFlowState website

```text
Build a Daily AI News page for the KIFlowState website.

Use this data source as the external feed:
- Index: https://juliankarge.github.io/DailyNews/data/api/index.json
- Latest: https://juliankarge.github.io/DailyNews/data/api/latest.json
- Day detail: https://juliankarge.github.io/DailyNews/data/api/days/YYYY-MM-DD.json

Read the schema in data/api/README.md. Render a polished page with:
- latest digest hero
- archive grouped by date_label / weekday
- item cards from items[]
- visible source links for every factual item
- tags and source counts
- loading and error states
- no raw Markdown rendering

Keep the website frontend independent. Do not write daily generated HTML; only fetch JSON.
```
