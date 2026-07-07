// Post-build prerender for TENNsational.
// Runs automatically after `vite build` (see package.json "build" script).
// For every restaurant and city it writes dist/<route>/index.html — a copy of
// the built app shell with that page's unique <title>, meta description,
// canonical URL, Open Graph tags, schema.org JSON-LD, and crawlable HTML
// content. It also regenerates sitemap.xml. Vercel serves these static files
// directly, so Google sees a real, unique page at every URL.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  SITE_URL, buildSlugMap, citySlug,
  restaurantTitle, restaurantMetaDescription, restaurantSchema,
  cityTitle, cityMetaDescription, mapsLink,
} from '../src/lib/seo.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const DIST = path.join(ROOT, 'dist');

const data = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/allRestaurants.json'), 'utf8'));
const restaurants = data.restaurants;
const { slugOf } = buildSlugMap(restaurants);

const template = fs.readFileSync(path.join(DIST, 'index.html'), 'utf8');

const esc = (s) => String(s ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// ---------- head rewriting ----------
function rewriteHead(html, { title, description, url, image, schema }) {
  let out = html;
  out = out.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`);
  out = out.replace(/(<meta name="description" content=")[\s\S]*?(">)/, `$1${esc(description)}$2`);
  out = out.replace(/(<link rel="canonical" href=")[\s\S]*?(" \/>|">)/, `$1${url}$2`);
  out = out.replace(/(<meta property="og:url" content=")[\s\S]*?(" \/>|">)/, `$1${url}$2`);
  out = out.replace(/(<meta property="og:title" content=")[\s\S]*?(" \/>|">)/, `$1${esc(title)}$2`);
  out = out.replace(/(<meta property="og:description" content=")[\s\S]*?(" \/>|">)/, `$1${esc(description)}$2`);
  out = out.replace(/(<meta name="twitter:url" content=")[\s\S]*?(" \/>|">)/, `$1${url}$2`);
  out = out.replace(/(<meta name="twitter:title" content=")[\s\S]*?(" \/>|">)/, `$1${esc(title)}$2`);
  out = out.replace(/(<meta name="twitter:description" content=")[\s\S]*?(" \/>|">)/, `$1${esc(description)}$2`);
  if (image) {
    out = out.replace(/(<meta property="og:image" content=")[\s\S]*?(" \/>|">)/, `$1${esc(image)}$2`);
    out = out.replace(/(<meta name="twitter:image" content=")[\s\S]*?(" \/>|">)/, `$1${esc(image)}$2`);
  }
  if (schema) {
    out = out.replace('</head>', `<script type="application/ld+json">${JSON.stringify(schema)}</script>\n</head>`);
  }
  return out;
}

// Crawler-visible content inside #root. React replaces it on load; until
// then (and for any bot) the page has real content, not an empty shell.
function withRootContent(html, innerHtml) {
  return html.replace(/<div id="root">[\s\S]*?<\/div>/, `<div id="root">${innerHtml}</div>`);
}

function writePage(route, html) {
  const dir = path.join(DIST, route);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), html);
}

// ---------- restaurant pages ----------
let count = 0;
for (const r of restaurants) {
  const slug = slugOf.get(r.id);
  const route = `restaurant/${slug}`;
  const url = `${SITE_URL}/${route}`;
  const desc = (r.description || '').replace(/\s+/g, ' ').trim();

  const content = `
    <article>
      <h1>${esc(r.name)}</h1>
      <p><strong>${esc(r.cuisine || 'Restaurant')}</strong> in ${esc(r.city)}, Tennessee${r.county ? ` (${esc(r.county)})` : ''}.
      ${r.rating ? `Rated ${r.rating} stars${r.review_count ? ` from ${r.review_count} reviews` : ''}.` : ''}
      ${r.price_range ? `Price range: ${esc(r.price_range)}.` : ''}</p>
      ${desc ? `<p>${esc(desc)}</p>` : ''}
      ${r.address ? `<p>Address: <a href="${esc(mapsLink(r))}">${esc(r.address)}</a></p>` : ''}
      ${r.phone ? `<p>Phone: <a href="tel:${esc(r.phone)}">${esc(r.phone)}</a></p>` : ''}
      ${r.hours ? `<p>Hours: ${esc(r.hours)}</p>` : ''}
      <p><a href="/city/${citySlug(r.city)}">All restaurants in ${esc(r.city)}, TN</a> · <a href="/restaurants">Full East Tennessee directory</a></p>
    </article>`;

  const html = withRootContent(
    rewriteHead(template, {
      title: restaurantTitle(r),
      description: restaurantMetaDescription(r),
      url,
      image: r.featured_image || null,
      schema: restaurantSchema(r, url),
    }),
    content,
  );
  writePage(route, html);
  count++;
}
console.log(`✓ ${count} restaurant pages`);

// ---------- city pages ----------
const cities = new Map();
for (const r of restaurants) {
  if (!r.city) continue;
  const key = citySlug(r.city);
  if (!cities.has(key)) cities.set(key, []);
  cities.get(key).push(r);
}

for (const [slug, list] of cities) {
  const cityName = list[0].city;
  const route = `city/${slug}`;
  const url = `${SITE_URL}/${route}`;
  const cuisineCounts = {};
  list.forEach((r) => { if (r.cuisine) cuisineCounts[r.cuisine] = (cuisineCounts[r.cuisine] || 0) + 1; });
  const topCuisines = Object.entries(cuisineCounts).sort((a, b) => b[1] - a[1]).map(([c]) => c);

  const items = [...list]
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .map((r) => `<li><a href="/restaurant/${slugOf.get(r.id)}">${esc(r.name)}</a> — ${esc(r.cuisine || '')}${r.rating ? `, ★ ${r.rating}` : ''}</li>`)
    .join('\n');

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `Restaurants in ${cityName}, TN`,
    url,
    description: cityMetaDescription(cityName, list.length, topCuisines),
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: list.length,
      itemListElement: list.slice(0, 25).map((r, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: r.name,
        url: `${SITE_URL}/restaurant/${slugOf.get(r.id)}`,
      })),
    },
  };

  const content = `
    <article>
      <h1>Restaurants in ${esc(cityName)}, TN</h1>
      <p>${esc(cityMetaDescription(cityName, list.length, topCuisines))}</p>
      <ul>${items}</ul>
      <p><a href="/restaurants">Browse the full East Tennessee restaurant directory</a></p>
    </article>`;

  const html = withRootContent(
    rewriteHead(template, {
      title: cityTitle(cityName, list.length),
      description: cityMetaDescription(cityName, list.length, topCuisines),
      url,
      schema,
    }),
    content,
  );
  writePage(route, html);
}
console.log(`✓ ${cities.size} city pages`);

// ---------- static pages (unique titles + canonicals) ----------
const staticPages = [
  { route: 'restaurants', title: 'All East Tennessee Restaurants — Search 650+ Local Spots | TENNsational', description: 'Search and filter 650+ East Tennessee restaurants by city, county, and cuisine. Knoxville, Sevierville, Gatlinburg, Maryville, Morristown, Dandridge and more.' },
  { route: 'about', title: 'About TENNsational — East Tennessee\'s Dining Guide', description: 'TENNsational is East Tennessee\'s independent restaurant directory: local favorites, hidden gems, and honest guides across the region.' },
  { route: 'merch', title: 'TENNsational Merch — East Tennessee Food Lover Gear', description: 'Shirts and gear for East Tennessee food lovers, from TENNsational.' },
  { route: 'privacy', title: 'Privacy Policy | TENNsational', description: 'TENNsational privacy policy.' },
];
for (const p of staticPages) {
  const url = `${SITE_URL}/${p.route}`;
  writePage(p.route, rewriteHead(template, { title: p.title, description: p.description, url }));
}
console.log(`✓ ${staticPages.length} static pages`);

// ---------- sitemap ----------
const today = new Date().toISOString().slice(0, 10);
const urls = [
  `${SITE_URL}/`,
  ...staticPages.filter((p) => p.route !== 'privacy').map((p) => `${SITE_URL}/${p.route}`),
  ...[...cities.keys()].map((s) => `${SITE_URL}/city/${s}`),
  ...restaurants.map((r) => `${SITE_URL}/restaurant/${slugOf.get(r.id)}`),
];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${u}</loc><lastmod>${today}</lastmod></url>`).join('\n')}
</urlset>
`;
fs.writeFileSync(path.join(DIST, 'sitemap.xml'), sitemap);
console.log(`✓ sitemap.xml with ${urls.length} URLs`);
console.log('Prerender complete.');
