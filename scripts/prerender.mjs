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
import { blendedScore, fetchRatingSummaries, ratingKey } from '../src/lib/ratings.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const DIST = path.join(ROOT, 'dist');

const data = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/allRestaurants.json'), 'utf8'));
const restaurants = data.restaurants;
const { slugOf } = buildSlugMap(restaurants);

// Local visitor ratings from Supabase. If it's unreachable the build still
// succeeds; pages just go out without local ratings until the next build.
let localRatings = new Map();
try {
  localRatings = await Promise.race([
    fetchRatingSummaries(),
    new Promise((_, reject) => setTimeout(() => reject(new Error('timed out')), 10000)),
  ]);
  console.log(`✓ local ratings for ${localRatings.size} restaurants`);
} catch (e) {
  console.warn(`! local ratings unavailable (${e.message}); building without them`);
}

const template = fs.readFileSync(path.join(DIST, 'index.html'), 'utf8');

const esc = (s) => String(s ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// ---------- head rewriting ----------
function rewriteHead(html, { title, description, url, image, schema }) {
  // Function replacers keep "$" in values literal ("$$" price ranges were
  // being collapsed to "$" when passed as replacement strings).
  const setTag = (out, pattern, value) => out.replace(pattern, (_, a, b) => `${a}${value}${b}`);
  let out = html;
  out = out.replace(/<title>[\s\S]*?<\/title>/, () => `<title>${esc(title)}</title>`);
  out = setTag(out, /(<meta name="description" content=")[\s\S]*?(">)/, esc(description));
  out = setTag(out, /(<link rel="canonical" href=")[\s\S]*?(" \/>|">)/, url);
  out = setTag(out, /(<meta property="og:url" content=")[\s\S]*?(" \/>|">)/, url);
  out = setTag(out, /(<meta property="og:title" content=")[\s\S]*?(" \/>|">)/, esc(title));
  out = setTag(out, /(<meta property="og:description" content=")[\s\S]*?(" \/>|">)/, esc(description));
  out = setTag(out, /(<meta name="twitter:url" content=")[\s\S]*?(" \/>|">)/, url);
  out = setTag(out, /(<meta name="twitter:title" content=")[\s\S]*?(" \/>|">)/, esc(title));
  out = setTag(out, /(<meta name="twitter:description" content=")[\s\S]*?(" \/>|">)/, esc(description));
  if (image) {
    out = setTag(out, /(<meta property="og:image" content=")[\s\S]*?(" \/>|">)/, esc(image));
    out = setTag(out, /(<meta name="twitter:image" content=")[\s\S]*?(" \/>|">)/, esc(image));
    // The template's width/height describe the default image, not this one
    out = out.replace(/\s*<meta property="og:image:(width|height)" content="[^"]*" ?\/?>/g, '');
  }
  if (schema) {
    out = out.replace('</head>', () => `<script type="application/ld+json">${JSON.stringify(schema)}</script>\n</head>`);
  }
  return out;
}

// Crawler-visible content inside #root. React replaces it on load; until
// then (and for any bot) the page has real content, not an empty shell.
// index.html marks the homepage's own content with prerender markers;
// every other page swaps in its own content there.
const ROOT_CONTENT = /<!--prerender:start-->[\s\S]*?<!--prerender:end-->/;
if (!ROOT_CONTENT.test(template)) throw new Error('prerender markers missing from dist/index.html');
function withRootContent(html, innerHtml) {
  return html.replace(ROOT_CONTENT, () => innerHtml);
}

function writePage(route, html) {
  const dir = path.join(DIST, route);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), html);
}

// ---------- restaurant pages ----------
const byCity = new Map();
for (const r of restaurants) {
  if (!byCity.has(r.city)) byCity.set(r.city, []);
  byCity.get(r.city).push(r);
}
const score = (r) => blendedScore(r, localRatings.get(ratingKey(r)));
const byScore = (a, b) => score(b) - score(a);
for (const list of byCity.values()) list.sort(byScore);

const linkList = (list) => list
  .map((x) => `<li><a href="/restaurant/${slugOf.get(x.id)}">${esc(x.name)}</a> — ${esc(x.cuisine || '')}${x.rating ? `, ★ ${x.rating}` : ''}</li>`)
  .join('');

let count = 0;
for (const r of restaurants) {
  const slug = slugOf.get(r.id);
  const route = `restaurant/${slug}`;
  const url = `${SITE_URL}/${route}`;
  const desc = (r.description || '').replace(/\s+/g, ' ').trim();
  const local = localRatings.get(ratingKey(r));
  const neighbors = (byCity.get(r.city) || []).filter((x) => x.id !== r.id);
  const sameCuisine = r.cuisine ? neighbors.filter((x) => x.cuisine === r.cuisine).slice(0, 6) : [];
  const sameCity = neighbors.filter((x) => !sameCuisine.includes(x)).slice(0, 6);

  const content = `
    <article>
      <h1>${esc(r.name)}</h1>
      <p><strong>${esc(r.cuisine || 'Restaurant')}</strong> in ${esc(r.city)}, Tennessee${r.county ? ` (${esc(r.county)})` : ''}.
      ${r.rating ? `Rated ${r.rating} stars on Google${r.review_count ? ` (${r.review_count} reviews)` : ''}.` : ''}
      ${local ? `TENNsational locals rate it ${local.avg} from ${local.count} rating${local.count === 1 ? '' : 's'}.` : ''}
      ${r.price_range ? `Price range: ${esc(r.price_range)}.` : ''}</p>
      ${desc ? `<p>${esc(desc)}</p>` : ''}
      ${r.address ? `<p>Address: <a href="${esc(mapsLink(r))}">${esc(r.address)}</a></p>` : ''}
      ${r.phone ? `<p>Phone: <a href="tel:${esc(r.phone)}">${esc(r.phone)}</a></p>` : ''}
      ${r.hours ? `<p>Hours: ${esc(r.hours)}</p>` : ''}
      ${sameCuisine.length ? `<h2>More ${esc(r.cuisine)} in ${esc(r.city)}</h2><ul>${linkList(sameCuisine)}</ul>` : ''}
      ${sameCity.length ? `<h2>More restaurants in ${esc(r.city)}</h2><ul>${linkList(sameCity)}</ul>` : ''}
      <p><a href="/city/${citySlug(r.city)}">All restaurants in ${esc(r.city)}, TN</a> · <a href="/restaurants">Full East Tennessee directory</a></p>
    </article>`;

  const html = withRootContent(
    rewriteHead(template, {
      title: restaurantTitle(r),
      description: restaurantMetaDescription(r),
      url,
      image: r.featured_image || null,
      schema: restaurantSchema(r, url, local),
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
    .sort(byScore)
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
// "2,105 restaurants" -> "2,100+": always true, and stable between monthly refreshes
const roundedCount = `${(Math.floor(restaurants.length / 100) * 100).toLocaleString('en-US')}+`;
const staticPages = [
  { route: 'restaurants', title: `All East Tennessee Restaurants — Search ${roundedCount} Local Spots | TENNsational`, description: `Search and filter ${roundedCount} East Tennessee restaurants by city, county, and cuisine. Knoxville, Gatlinburg, Pigeon Forge, Sevierville, Chattanooga, Maryville and more.` },
  { route: 'about', title: 'About TENNsational — East Tennessee\'s Dining Guide', description: 'TENNsational is East Tennessee\'s independent restaurant directory: local favorites, hidden gems, and honest guides across the region.' },
  { route: 'merch', title: 'TENNsational Merch — East Tennessee Food Lover Gear', description: 'Shirts and gear for East Tennessee food lovers, from TENNsational.' },
  { route: 'privacy', title: 'Privacy Policy | TENNsational', description: 'TENNsational privacy policy.' },
];
// Every city, biggest first — the crawl path from the homepage and the
// directory page into all city pages.
const cityLinks = [...cities.entries()]
  .sort((a, b) => b[1].length - a[1].length)
  .map(([s, list]) => `<li><a href="/city/${s}">Restaurants in ${esc(list[0].city)}, TN</a> (${list.length})</li>`)
  .join('');

const staticContent = {
  restaurants: `<h1>All East Tennessee Restaurants</h1><p>${esc(staticPages[0].description)}</p><h2>Browse by city</h2><ul>${cityLinks}</ul>`,
  about: `<h1>About TENNsational</h1><p>${esc(staticPages[1].description)}</p><p><a href="/restaurants">Browse all ${roundedCount} restaurants</a></p>`,
  merch: `<h1>TENNsational Merch</h1><p>${esc(staticPages[2].description)}</p>`,
  privacy: `<h1>Privacy Policy</h1><p>${esc(staticPages[3].description)}</p>`,
};
for (const p of staticPages) {
  const url = `${SITE_URL}/${p.route}`;
  writePage(p.route, withRootContent(
    rewriteHead(template, { title: p.title, description: p.description, url }),
    `<article>${staticContent[p.route]}</article>`,
  ));
}

// Homepage keeps its own content from index.html, plus links to every city.
fs.writeFileSync(path.join(DIST, 'index.html'), template.replace(
  '<!--prerender:end-->',
  () => `<h2>Browse restaurants by city</h2><ul>${cityLinks}</ul><p><a href="/restaurants">Search all ${roundedCount} East Tennessee restaurants</a></p><!--prerender:end-->`,
));
console.log(`✓ ${staticPages.length} static pages`);

// ---------- public data endpoint (used by the mobile app) ----------
fs.mkdirSync(path.join(DIST, 'data'), { recursive: true });
fs.copyFileSync(path.join(ROOT, 'src/data/allRestaurants.json'), path.join(DIST, 'data', 'restaurants.json'));
console.log('✓ data endpoint: /data/restaurants.json');

// ---------- sitemap ----------
// lastmod is only set where we know when a page's content changed: listings
// added by the monthly refresh carry their date, and directory-wide pages use
// the data's last_updated. Stamping every URL with today's date on every build
// teaches Google to ignore lastmod altogether.
const dataDate = (data.last_updated || '').slice(0, 10);
const entries = [
  { loc: `${SITE_URL}/`, lastmod: dataDate },
  ...staticPages.filter((p) => p.route !== 'privacy').map((p) => ({
    loc: `${SITE_URL}/${p.route}`, lastmod: p.route === 'restaurants' ? dataDate : '',
  })),
  ...[...cities.keys()].map((s) => ({ loc: `${SITE_URL}/city/${s}`, lastmod: dataDate })),
  ...restaurants.map((r) => ({ loc: `${SITE_URL}/restaurant/${slugOf.get(r.id)}`, lastmod: r.added_by_refresh || '' })),
];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.map((e) => `  <url><loc>${e.loc}</loc>${e.lastmod ? `<lastmod>${e.lastmod}</lastmod>` : ''}</url>`).join('\n')}
</urlset>
`;
fs.writeFileSync(path.join(DIST, 'sitemap.xml'), sitemap);
console.log(`✓ sitemap.xml with ${entries.length} URLs`);
console.log('Prerender complete.');
