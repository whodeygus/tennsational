import { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import {
  canVote, fetchMyRating, loadRatingSummaries, ratingKey, submitRating,
} from '../lib/ratings.mjs';

const COLORS = { navy: '#1A3550', orange: '#C8641A', text: '#333333', muted: '#6b7280', cream: '#F7F0E3' };
const LABELS = ['', 'Poor', 'Fair', 'Good', 'Very good', 'Excellent'];

// Shared hook: Map(restaurant_key -> { avg, count }), empty until loaded or
// if Supabase is unreachable (pages then fall back to Google's rating alone).
export function useRatingSummaries() {
  const [summaries, setSummaries] = useState(() => new Map());
  useEffect(() => {
    let live = true;
    loadRatingSummaries().then((m) => { if (live) setSummaries(m); });
    return () => { live = false; };
  }, []);
  return summaries;
}

// "TENNsational locals" rating line plus the 1–5 star picker.
export default function LocalRating({ restaurant }) {
  const summaries = useRatingSummaries();
  const [local, setLocal] = useState(null);
  const [mine, setMine] = useState(null);
  const [hover, setHover] = useState(0);
  const [status, setStatus] = useState('idle'); // idle | saving | saved | error
  const [error, setError] = useState('');

  useEffect(() => {
    setLocal(summaries.get(ratingKey(restaurant)) || null);
  }, [summaries, restaurant]);

  useEffect(() => {
    let live = true;
    setMine(null);
    setStatus('idle');
    fetchMyRating(restaurant).then((s) => { if (live) setMine(s); }).catch(() => {});
    return () => { live = false; };
  }, [restaurant]);

  async function rate(stars) {
    setStatus('saving');
    setError('');
    try {
      setLocal(await submitRating(restaurant, stars));
      setMine(stars);
      setStatus('saved');
    } catch (e) {
      setError(e.message || 'Could not save your rating — please try again.');
      setStatus('error');
    }
  }

  const shown = hover || mine || 0;

  return (
    <div style={{ background: '#fff', borderRadius: '12px', padding: '20px 26px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', marginBottom: '28px' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
        <div>
          <div style={{ color: COLORS.muted, fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            TENNsational locals
          </div>
          {local?.count ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px', color: COLORS.navy }}>
              <Star style={{ width: '20px', height: '20px', fill: COLORS.orange, color: COLORS.orange }} />
              <strong style={{ fontSize: '1.3rem' }}>{local.avg.toFixed(1)}</strong>
              <span style={{ color: COLORS.muted }}>
                from {local.count.toLocaleString()} local rating{local.count === 1 ? '' : 's'}
              </span>
            </div>
          ) : (
            <div style={{ marginTop: '4px', color: COLORS.navy, fontWeight: 600 }}>
              Be the first local to rate {restaurant.name}
            </div>
          )}
        </div>

        {canVote() && (
          <div>
            <div style={{ color: COLORS.text, fontSize: '0.9rem', marginBottom: '4px' }}>
              {mine ? 'Your rating — tap to change' : 'Rate this restaurant'}
            </div>
            <div role="radiogroup" aria-label={`Rate ${restaurant.name}`} style={{ display: 'flex', alignItems: 'center', gap: '2px' }} onMouseLeave={() => setHover(0)}>
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  role="radio"
                  aria-checked={mine === n}
                  aria-label={`${n} star${n === 1 ? '' : 's'} — ${LABELS[n]}`}
                  disabled={status === 'saving'}
                  onClick={() => rate(n)}
                  onMouseEnter={() => setHover(n)}
                  onFocus={() => setHover(n)}
                  onBlur={() => setHover(0)}
                  style={{ background: 'none', border: 'none', padding: '4px', cursor: 'pointer', lineHeight: 0 }}
                >
                  <Star style={{
                    width: '30px', height: '30px',
                    fill: n <= shown ? COLORS.orange : 'none',
                    color: n <= shown ? COLORS.orange : '#d1d5db',
                  }} />
                </button>
              ))}
              <span style={{ marginLeft: '8px', color: COLORS.muted, fontSize: '0.85rem', minWidth: '70px' }}>
                {status === 'saving' ? 'Saving…' : shown ? LABELS[shown] : ''}
              </span>
            </div>
          </div>
        )}
      </div>
      {status === 'saved' && (
        <div style={{ marginTop: '10px', color: '#15803d', fontSize: '0.9rem' }}>Thanks! Your rating is in.</div>
      )}
      {status === 'error' && (
        <div style={{ marginTop: '10px', color: '#b91c1c', fontSize: '0.9rem' }}>{error}</div>
      )}
      <div style={{ marginTop: '12px', color: COLORS.muted, fontSize: '0.78rem' }}>
        Local ratings come from TENNsational visitors — one per person. Google ratings come from Google.
      </div>
    </div>
  );
}
