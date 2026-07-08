// Shared SEO + slug helpers.
// Used by BOTH the React app and scripts/prerender.mjs — keep this file
// dependency-free so it runs in the browser and in Node.

export const SITE_URL = 'https://www.tennsational.com';

// "Calhoun's on the River" -> "calhoun-s-on-the-river"
export function slugify(str) {
  return String(str || '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '') // strip accents
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function citySlug(city) {
  return slugify(city);
}

// Builds deterministic, unique slugs for every restaurant.
// Base slug = name-city. If two restaurants share it (chains with two
// locations in the same city), the duplicates get "-{id}" appended.
// Returns: { bySlug: Map(slug -> restaurant), slugOf: Map(id -> slug) }
export function buildSlugMap(restaurants) {
  const counts = {};
  for (const r of restaurants) {
    const base = slugify(`${r.name}-${r.city}`);
    counts[base] = (counts[base] || 0) + 1;
  }
  const bySlug = new Map();
  const slugOf = new Map();
  for (const r of restaurants) {
    const base = slugify(`${r.name}-${r.city}`);
    const slug = counts[base] > 1 ? `${base}-${r.id}` : base;
    bySlug.set(slug, r);
    slugOf.set(r.id, slug);
  }
  return { bySlug, slugOf };
}

// Trimmed, clean meta description for a restaurant page.
export function restaurantMetaDescription(r) {
  const lead = `${r.name} — ${r.cuisine || 'restaurant'} in ${r.city || 'East Tennessee'}, TN.`;
  const extra = (r.description || '').replace(/\s+/g, ' ').trim();
  const combined = extra ? `${lead} ${extra}` : lead;
  return combined.length > 158 ? combined.slice(0, 155).trimEnd() + '…' : combined;
}

export function restaurantTitle(r) {
  return `${r.name} — ${r.cuisine || 'Restaurant'} in ${r.city || 'East Tennessee'}, TN | TENNsational`;
}

export function cityTitle(city, count) {
  return `${count} Restaurant${count === 1 ? '' : 's'} in ${city}, TN — Local Dining Guide | TENNsational`;
}

export function cityMetaDescription(city, count, topCuisines) {
  const cuisinePart = topCuisines && topCuisines.length
    ? ` Browse ${topCuisines.slice(0, 3).join(', ')} and more.`
    : '';
  const s = `The local guide to all ${count} ${city}, TN restaurants — ratings, hours, menus and hidden gems, curated by TENNsational.${cuisinePart}`;
  return s.length > 158 ? s.slice(0, 155).trimEnd() + '…' : s;
}

// Google Maps link that opens the exact place listing when we have a Place ID.
export function mapsLink(r) {
  if (r.place_id) {
    const q = encodeURIComponent(r.address || r.name);
    return `https://www.google.com/maps/search/?api=1&query=${q}&query_place_id=${r.place_id}`;
  }
  if (r.google_link) return r.google_link;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((r.name || '') + ' ' + (r.address || ''))}`;
}

// schema.org Restaurant structured data for one restaurant.
export function restaurantSchema(r, url) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: r.name,
    url,
    servesCuisine: r.cuisine || undefined,
    priceRange: r.price_range || undefined,
    telephone: r.phone || undefined,
    image: r.featured_image || undefined,
    description: (r.description || '').replace(/\s+/g, ' ').trim() || undefined,
  };
  if (r.address) {
    schema.address = {
      '@type': 'PostalAddress',
      streetAddress: r.address,
      addressRegion: 'TN',
      addressLocality: r.city || undefined,
      addressCountry: 'US',
    };
  }
  if (r.lat && r.lng) {
    schema.geo = { '@type': 'GeoCoordinates', latitude: r.lat, longitude: r.lng };
  }
  if (r.rating && r.review_count) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: r.rating,
      reviewCount: r.review_count,
    };
  }
  // strip undefined keys so the JSON stays clean
  return JSON.parse(JSON.stringify(schema));
}
