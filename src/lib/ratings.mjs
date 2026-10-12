// TENNsational local ratings (stored in Supabase — see supabase/ratings.sql).
// Used by the React app and by scripts/prerender.mjs, so keep it
// dependency-free. The URL and publishable key are public by design; the
// database only exposes the three functions in ratings.sql.

export const SUPABASE_URL = 'https://ypsxwpmoobxzdmplzrle.supabase.co';
export const SUPABASE_KEY = 'sb_publishable_-neiLSc0x4TLWPRGPo-kfQ_x5mAZNpG';

// Sort-score tuning (never displayed — pages show Google and local ratings
// separately). Every restaurant starts from a typical regional rating worth
// PRIOR_VOTES votes; Google's rating adds one vote per GOOGLE_REVIEWS_PER_VOTE
// reviews, up to GOOGLE_MAX_VOTES; each local rating is one vote. So a 5.0
// from 12 reviews no longer outranks a 4.9 from 585, and a few local ratings
// nudge a well-reviewed restaurant instead of swinging it.
const TYPICAL_RATING = 4.3;
const PRIOR_VOTES = 5;
const GOOGLE_REVIEWS_PER_VOTE = 10;
const GOOGLE_MAX_VOTES = 30;

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

// Sort score blending the typical rating, Google's rating and local ratings.
export function blendedScore(r, local) {
  const g = r.rating ? Math.min((r.review_count || 0) / GOOGLE_REVIEWS_PER_VOTE, GOOGLE_MAX_VOTES) : 0;
  const n = local?.count || 0;
  return (TYPICAL_RATING * PRIOR_VOTES + (r.rating || 0) * g + (local?.avg || 0) * n) / (PRIOR_VOTES + g + n);
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

// ---------- "TENNsational Approved" badges (see supabase/approved.sql) ----------

// Set of restaurant keys that carry the badge.
export async function fetchApproved() {
  const rows = await rpc('get_approved');
  return new Set((rows || []).map((x) => (typeof x === 'string' ? x : x.get_approved)));
}

let approvedPromise = null;
export function loadApproved({ refresh = false } = {}) {
  if (!approvedPromise || refresh) {
    approvedPromise = fetchApproved().catch(() => {
      approvedPromise = null;
      return new Set();
    });
  }
  return approvedPromise;
}

export const checkAdmin = (passcode) => rpc('check_admin', { p_passcode: passcode });

export function setApproved(r, approved, passcode) {
  return rpc('set_approved', { p_restaurant_key: ratingKey(r), p_approved: approved, p_passcode: passcode });
}
