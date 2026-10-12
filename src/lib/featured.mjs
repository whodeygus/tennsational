// Paid featured placements ("Sponsored" listings).
//
// To sell a placement, set on the restaurant in src/data/allRestaurants.json:
//   "featured": true,
//   "featured_until": "2026-12-31"   // last day it shows, inclusive
// It turns off by itself after that date — no rebuild or edit needed.
// A listing with "featured": true and no featured_until stays on until
// you set "featured" back to false.

// Today's date in East Tennessee, as YYYY-MM-DD.
export function todayEastern(now = new Date()) {
  return now.toLocaleDateString('en-CA', { timeZone: 'America/New_York' });
}

export function isSponsored(r, today = todayEastern()) {
  if (!r.featured) return false;
  return !r.featured_until || today <= r.featured_until;
}
