// TENNsational local ratings (stored in Supabase — see supabase/ratings.sql).
// Used by the React app and by scripts/prerender.mjs, so keep it
// dependency-free. The URL and publishable key are public by design; the
// database only exposes the three functions in ratings.sql.

export const SUPABASE_URL = 'https://ypsxwpmoobxzdmplzrle.supabase.co';
export const SUPABASE_KEY = 'sb_publishable_-neiLSc0x4TLWPRGPo-kfQ_x5mAZNpG';

// Google's rating counts as this many votes when blending with local ratings
// for sort order, so a few early ratings nudge a restaurant instead of
// swinging it. (Never displayed — the page shows both ratings separately.)
const GOOGLE_PRIOR_VOTES = 20;

// Stable key for a restaurant across monthly refreshes.
export const ratingKey = (r) => r.place_id || `id-${r.id}`;

async function rpc(fn, body) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${fn}`, {
    method: 'POST',
    headers: { apikey: SUPABASE_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify(body || {}),
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.message || `Ratings request failed (${res.status})`);
  return data;
}

// Map(restaurant_key -> { avg, count }) for every locally rated restaurant.
export async function fetchRatingSummaries() {
  const rows = await rpc('get_rating_summaries');
  return new Map((rows || []).map((x) => [x.restaurant_key, { avg: Number(x.avg), count: Number(x.count) }]));
}

// Sort score: Google's rating weighted as up to GOOGLE_PRIOR_VOTES votes,
// blended with local ratings.
export function blendedScore(r, local) {
  const gWeight = r.rating ? Math.min(r.review_count || 0, GOOGLE_PRIOR_VOTES) : 0;
  const n = local?.count || 0;
  if (!gWeight && !n) return r.rating || 0;
  return ((r.rating || 0) * gWeight + (local?.avg || 0) * n) / (gWeight + n);
}

// ---------- browser-only helpers ----------

function voterId() {
  try {
    let id = localStorage.getItem('tennsational_voter');
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem('tennsational_voter', id);
    }
    return id;
  } catch {
    return null; // storage blocked: can still read ratings, just not vote
  }
}

export const canVote = () => voterId() !== null;

export async function fetchMyRating(r) {
  const id = voterId();
  if (!id) return null;
  return rpc('get_my_rating', { p_restaurant_key: ratingKey(r), p_voter_id: id });
}

// Returns the restaurant's updated { avg, count }.
export async function submitRating(r, stars) {
  const result = await rpc('submit_rating', {
    p_restaurant_key: ratingKey(r), p_voter_id: voterId(), p_stars: stars,
  });
  return { avg: Number(result.avg), count: Number(result.count) };
}

// One shared fetch per page load for list pages and the detail page.
let summariesPromise = null;
export function loadRatingSummaries() {
  if (!summariesPromise) {
    summariesPromise = fetchRatingSummaries().catch(() => {
      summariesPromise = null; // retry on the next page view
      return new Map();
    });
  }
  return summariesPromise;
}
