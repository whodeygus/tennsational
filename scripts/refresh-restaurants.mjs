// TENNsational restaurant refresh.
// Runs in GitHub Actions (see .github/workflows/refresh-restaurants.yml).
// 1. Searches Google Places for restaurants in every city in refresh-config.json
// 2. Adds anything not already in allRestaurants.json (matched by place_id)
// 3. Optionally checks existing listings for permanent closures and archives them
// 4. Updates the stats/counties/cuisines metadata and last_updated
// The commit that follows triggers the Vercel build, which regenerates every
// page and the sitemap automatically.
//
// Cost control: discovery searches use Pro-tier fields (5,000 free/month),
// full details are fetched ONLY for new places (capped by maxDetailCallsPerRun),
// closure checks use a cheap field mask. At this scale the run is $0.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const DATA_PATH = path.join(ROOT, 'src/data/allRestaurants.json');
const ARCHIVE_PATH = path.join(ROOT, 'src/data/closedRestaurants.json');
const CONFIG = JSON.parse(fs.readFileSync(path.join(__dirname, 'refresh-config.json'), 'utf8'));

const API_KEY = process.env.GOOGLE_PLACES_KEY;
const MOCK = process.env.MOCK_PLACES === '1'; // test mode: no network calls
if (!API_KEY && !MOCK) {
  console.error('GOOGLE_PLACES_KEY is not set. Add it as a GitHub Actions secret.');
  process.exit(1);
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const norm = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '');

// ---------------- Places API helpers ----------------
let searchCalls = 0;
let detailCalls = 0;

async function placesSearchText(query, pageToken) {
  if (MOCK) return mockSearch(query);
  searchCalls++;
  const res = await fetch('https://places.googleapis.com/v1/places:searchText', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': API_KEY,
      'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.businessStatus,nextPageToken',
    },
    body: JSON.stringify({
      textQuery: query,
      includedType: 'restaurant',
      pageSize: 20,
      ...(pageToken ? { pageToken } : {}),
    }),
  });
  if (!res.ok) throw new Error(`searchText ${res.status}: ${await res.text()}`);
  return res.json();
}

const DETAIL_MASK = [
  'id', 'displayName', 'formattedAddress', 'addressComponents', 'location',
  'nationalPhoneNumber', 'websiteUri', 'googleMapsUri', 'businessStatus',
  'rating', 'userRatingCount', 'priceLevel', 'primaryTypeDisplayName', 'photos',
  'regularOpeningHours.weekdayDescriptions', 'editorialSummary',
].join(',');

async function placeDetails(placeId, fieldMask = DETAIL_MASK) {
  if (MOCK) return mockDetails(placeId);
  detailCalls++;
  const res = await fetch(`https://places.googleapis.com/v1/places/${placeId}`, {
    headers: { 'X-Goog-Api-Key': API_KEY, 'X-Goog-FieldMask': fieldMask },
  });
  if (!res.ok) throw new Error(`placeDetails ${res.status}: ${await res.text()}`);
  return res.json();
}

let photoCalls = 0;
async function resolvePhotoUrl(details) {
  const photoName = details.photos?.[0]?.name;
  if (!photoName) return '';
  if (MOCK) return 'https://lh3.googleusercontent.com/p/MOCK_PHOTO=s1024';
  try {
    photoCalls++;
    const res = await fetch(
      `https://places.googleapis.com/v1/${photoName}/media?maxWidthPx=1024&skipHttpRedirect=true`,
      { headers: { 'X-Goog-Api-Key': API_KEY } },
    );
    if (!res.ok) return '';
    const j = await res.json();
    return j.photoUri || '';
  } catch { return ''; }
}

// ---------------- mapping to TENNsational schema ----------------
const PRICE_MAP = {
  PRICE_LEVEL_INEXPENSIVE: '$',
  PRICE_LEVEL_MODERATE: '$$',
  PRICE_LEVEL_EXPENSIVE: '$$$',
  PRICE_LEVEL_VERY_EXPENSIVE: '$$$$',
};

function typeText(primaryTypeDisplayName) {
  // Places API (New) returns LocalizedText: { text, languageCode }
  if (!primaryTypeDisplayName) return '';
  return typeof primaryTypeDisplayName === 'string'
    ? primaryTypeDisplayName
    : (primaryTypeDisplayName.text || '');
}

function deriveCuisine(primaryTypeDisplayName, knownCuisines) {
  const t = typeText(primaryTypeDisplayName);
  if (!t) return 'American';
  let c = t.replace(/\s*restaurant\s*$/i, '').trim();
  if (!c || /^restaurant$/i.test(t)) c = 'American';
  const aliases = {
    'Barbecue': 'BBQ', 'Bar & grill': 'American', 'Hamburger': 'Burgers',
    'Fast food': 'Fast Food', 'Coffee shop': 'Cafe', 'Sandwich shop': 'American',
    'Breakfast': 'American', 'Diner': 'American', 'Takeout': 'American',
    'Chicken': 'American', 'Ice cream shop': 'Cafe', 'Steak house': 'Steakhouse',
  };
  c = aliases[c] || c;
  // Prefer an existing cuisine label if it matches, to keep filters tidy
  const hit = knownCuisines.find((k) => norm(k) === norm(c));
  return hit || c;
}

function extractComponent(components, type) {
  const c = (components || []).find((x) => (x.types || []).includes(type));
  return c ? (c.longText || c.shortText || '') : '';
}

function extractHours(details) {
  const days = details.regularOpeningHours?.weekdayDescriptions;
  if (!days || !days.length) return '';
  // "Monday: 11:00 AM – 10:00 PM" -> "11:00 AM – 10:00 PM"
  return days[0].replace(/^[A-Za-z]+:\s*/, '').replace(/\u2009/g, ' ');
}

function toRestaurant(details, id, cityFallback, knownCuisines) {
  const city = extractComponent(details.addressComponents, 'locality') || cityFallback;
  const county = extractComponent(details.addressComponents, 'administrative_area_level_2');
  return {
    id,
    name: details.displayName?.text || 'Unknown',
    county: county || '',
    city,
    cuisine: deriveCuisine(details.primaryTypeDisplayName, knownCuisines),
    price_range: PRICE_MAP[details.priceLevel] || '$$',
    rating: details.rating || 0,
    review_count: details.userRatingCount || 0,
    address: details.formattedAddress || '',
    phone: details.nationalPhoneNumber || '',
    website: details.websiteUri || '',
    hours: extractHours(details),
    description: details.editorialSummary?.text
      || `${details.displayName?.text} is a ${(typeText(details.primaryTypeDisplayName) || 'restaurant').toLowerCase()} in ${city}, Tennessee.`,
    amenities: [],
    categories: typeText(details.primaryTypeDisplayName) || 'Restaurant',
    google_link: details.googleMapsUri || '',
    featured_image: '', // owner/editor photos preferred; detail page falls back gracefully
    featured: false,
    lat: details.location?.latitude ?? null,
    lng: details.location?.longitude ?? null,
    place_id: details.id,
    added_by_refresh: new Date().toISOString().slice(0, 10),
  };
}

// ---------------- mock fixtures (MOCK_PLACES=1 test mode) ----------------
function mockSearch(query) {
  return {
    places: [
      { id: 'MOCK_NEW_1', displayName: { text: 'El Tercero Taqueria' }, formattedAddress: '100 Test St, Johnson City, TN 37601', businessStatus: 'OPERATIONAL' },
      { id: 'ChIJV1NebwKfXogRy2qqJdfoKoY', displayName: { text: 'Bella' }, formattedAddress: '121 W Broadway Ave, Maryville, TN 37801', businessStatus: 'OPERATIONAL' },
    ],
  };
}
function mockDetails(placeId) {
  if (placeId === 'MOCK_NEW_1') {
    return {
      id: 'MOCK_NEW_1',
      displayName: { text: 'El Tercero Taqueria' },
      formattedAddress: '100 Test St, Johnson City, TN 37601',
      addressComponents: [
        { longText: 'Johnson City', types: ['locality'] },
        { longText: 'Washington County', types: ['administrative_area_level_2'] },
      ],
      location: { latitude: 36.3134, longitude: -82.3535 },
      nationalPhoneNumber: '(423) 555-0100',
      websiteUri: 'https://example.com',
      googleMapsUri: 'https://maps.google.com/?cid=1',
      businessStatus: 'OPERATIONAL',
      rating: 4.7, userRatingCount: 212,
      priceLevel: 'PRICE_LEVEL_MODERATE',
      primaryTypeDisplayName: { text: 'Mexican restaurant', languageCode: 'en' },
      regularOpeningHours: { weekdayDescriptions: ['Monday: 11:00 AM – 9:00 PM'] },
      photos: [{ name: 'places/MOCK_NEW_1/photos/abc123' }],
      editorialSummary: { text: 'Family-run taqueria known for street tacos and homemade salsas.' },
    };
  }
  return { id: placeId, businessStatus: 'OPERATIONAL' };
}

// ---------------- main ----------------
async function main() {
  const data = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
  const restaurants = data.restaurants;
  const knownIds = new Set(restaurants.map((r) => r.place_id).filter(Boolean));
  const knownNameCity = new Set(restaurants.map((r) => norm(r.name) + '|' + norm(r.city)));
  const knownCuisines = data.cuisines || [];

  const report = { added: [], closed: [], skipped: 0, errors: [] };

  // Optional: focus an entire run on one city (Actions "Run workflow" input).
  const onlyCity = (process.env.ONLY_CITY || '').trim().toLowerCase();
  const cityList = onlyCity
    ? CONFIG.cities.filter((c) => c.toLowerCase().includes(onlyCity))
    : CONFIG.cities;
  if (onlyCity && !cityList.length) {
    console.error(`ONLY_CITY "${process.env.ONLY_CITY}" matches nothing in refresh-config.json — add the city there first.`);
    process.exit(1);
  }
  if (onlyCity) console.log(`Single-city mode: ${cityList.join(', ')}`);

  // ---- 1. discovery ----
  const discovered = new Map(); // placeId -> { name, cityFallback }
  for (const city of cityList) {
    const queries = [`restaurants in ${city}`, ...(CONFIG.extraQueries?.[city] || [])];
    for (const q of queries) {
      try {
        let pageToken;
        for (let page = 0; page < 3; page++) {
          const res = await placesSearchText(q, pageToken);
          for (const p of res.places || []) {
            if (p.businessStatus && p.businessStatus !== 'OPERATIONAL') continue;
            if (knownIds.has(p.id)) continue;
            const nameCity = norm(p.displayName?.text) + '|' + norm(city.split(',')[0]);
            if (knownNameCity.has(nameCity)) { report.skipped++; continue; }
            if (!discovered.has(p.id)) discovered.set(p.id, { name: p.displayName?.text, cityFallback: city.split(',')[0] });
          }
          pageToken = res.nextPageToken;
          if (!pageToken) break;
          await sleep(1500); // pagination tokens need a moment to become valid
        }
      } catch (e) {
        report.errors.push(`search "${q}": ${e.message}`);
      }
    }
  }
  console.log(`Discovered ${discovered.size} candidate new restaurants (${searchCalls} search calls)`);

  // ---- 2. fetch details for new places, capped ----
  // Round-robin across cities so no single city's backlog starves the others:
  // deal one candidate per city in rotation until the cap is reached.
  let nextId = Math.max(...restaurants.map((r) => r.id)) + 1;
  const byCity = new Map();
  for (const [placeId, meta] of discovered) {
    if (!byCity.has(meta.cityFallback)) byCity.set(meta.cityFallback, []);
    byCity.get(meta.cityFallback).push([placeId, meta]);
  }
  const cap = Math.min(CONFIG.maxNewPerRun, CONFIG.maxDetailCallsPerRun);
  const candidates = [];
  const buckets = [...byCity.values()];
  for (let round = 0; candidates.length < cap; round++) {
    let dealt = false;
    for (const bucket of buckets) {
      if (bucket[round]) {
        candidates.push(bucket[round]);
        dealt = true;
        if (candidates.length >= cap) break;
      }
    }
    if (!dealt) break; // every bucket exhausted
  }
  for (const [placeId, meta] of candidates) {
    try {
      const details = await placeDetails(placeId);
      if (details.businessStatus && details.businessStatus !== 'OPERATIONAL') continue;
      if ((details.userRatingCount || 0) < (CONFIG.minUserRatings ?? 0)) { report.skipped++; continue; }
      const r = toRestaurant(details, nextId++, meta.cityFallback, knownCuisines);
      r.featured_image = await resolvePhotoUrl(details);
      restaurants.push(r);
      knownIds.add(placeId);
      report.added.push(`${r.name} — ${r.city} (${r.cuisine}, ★${r.rating})`);
      await sleep(120);
    } catch (e) {
      report.errors.push(`details ${meta.name}: ${e.message}`);
    }
  }

  // ---- 2b. photo backfill for previously added entries with no image ----
  if (!MOCK) {
    const needPhoto = restaurants.filter((r) => r.place_id && !r.featured_image && r.added_by_refresh).slice(0, 40);
    let healed = 0;
    for (const r of needPhoto) {
      try {
        const d = await placeDetails(r.place_id, 'id,photos');
        const url = await resolvePhotoUrl(d);
        if (url) { r.featured_image = url; healed++; }
        await sleep(80);
      } catch { /* try again next run */ }
    }
    if (healed) report.added.push(`(photo backfill: added images to ${healed} existing listings)`);
  }

  // ---- 3. closure sweep over existing listings ----
  if (CONFIG.checkClosures && !MOCK) {
    const archive = fs.existsSync(ARCHIVE_PATH)
      ? JSON.parse(fs.readFileSync(ARCHIVE_PATH, 'utf8'))
      : { closed: [] };
    const stillOpen = [];
    for (const r of restaurants) {
      if (!r.place_id) { stillOpen.push(r); continue; }
      try {
        const d = await placeDetails(r.place_id, 'id,businessStatus');
        if (d.businessStatus === 'CLOSED_PERMANENTLY') {
          archive.closed.push({ ...r, archived_on: new Date().toISOString().slice(0, 10) });
          report.closed.push(`${r.name} — ${r.city}`);
        } else {
          stillOpen.push(r);
        }
        await sleep(60);
      } catch {
        stillOpen.push(r); // API hiccup: keep the listing, never delete on error
      }
    }
    data.restaurants = stillOpen;
    fs.writeFileSync(ARCHIVE_PATH, JSON.stringify(archive, null, 2));
  }

  // ---- 4. metadata + write ----
  const rs = data.restaurants;
  data.stats = {
    restaurant_count: rs.length,
    total_reviews: rs.reduce((s, r) => s + (r.review_count || 0), 0),
    average_rating: Math.round((rs.reduce((s, r) => s + (r.rating || 0), 0) / rs.length) * 10) / 10,
    counties: new Set(rs.map((r) => r.county).filter(Boolean)).size,
  };
  data.counties = [...new Set(rs.map((r) => r.county).filter(Boolean))].sort();
  data.cuisines = [...new Set(rs.map((r) => r.cuisine).filter(Boolean))].sort();
  data.last_updated = new Date().toISOString();
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));

  // ---- 5. report (shows in the GitHub Actions summary) ----
  const lines = [
    `## Restaurant refresh — ${new Date().toISOString().slice(0, 10)}`,
    `**API usage:** ${searchCalls} searches, ${detailCalls} detail calls, ${photoCalls} photo lookups`,
    ``,
    `### Added (${report.added.length})`,
    ...(report.added.length ? report.added.map((s) => `- ${s}`) : ['_none_']),
    ``,
    `### Archived as permanently closed (${report.closed.length})`,
    ...(report.closed.length ? report.closed.map((s) => `- ${s}`) : ['_none_']),
    ``,
    ...(report.errors.length ? [`### Errors (${report.errors.length})`, ...report.errors.map((s) => `- ${s}`)] : []),
  ].join('\n');
  console.log(lines);
  if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, lines + '\n');
}

main().catch((e) => { console.error(e); process.exit(1); });
