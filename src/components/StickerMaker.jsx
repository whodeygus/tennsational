// Private sticker maker: /stickers (not linked anywhere, noindex).
// Search a restaurant, add it to the sheet, print 3" round
// "TENNsational Approved" stickers with a QR code to its rating box, and
// turn on its Approved badge on the site. Approving needs the admin
// passcode from supabase/approved.sql.

import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import allRestaurantsData from '../data/allRestaurants.json';
import { buildSlugMap, SITE_URL } from '../lib/seo.mjs';
import { checkAdmin, loadApproved, ratingKey, setApproved } from '../lib/ratings.mjs';

const C = { cream: '#F7F0E3', navy: '#1A3550', orange: '#C8641A', forest: '#2F4A3C', muted: '#6b7280', ring: '#F2B27A' };
const PASS_KEY = 'tennsational_admin_passcode';
const LAYOUT_KEY = 'tennsational_sticker_layout';
const DEFAULT_LAYOUT = { cols: 2, rows: 3, top: 0.5, left: 0.75, gapX: 1, gapY: 0.5, outline: false };

const storage = {
  get(k) { try { return localStorage.getItem(k); } catch { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch { /* private mode */ } },
  del(k) { try { localStorage.removeItem(k); } catch { /* private mode */ } },
};

// Split a restaurant name into 1–2 lines and pick a font size that fits the
// sticker's inner circle.
function nameLines(name) {
  const clean = name.replace(/\s+/g, ' ').trim();
  if (clean.length <= 18) return { lines: [clean], size: clean.length <= 13 ? 22 : 18 };
  const words = clean.split(' ');
  let best = [clean, ''];
  let bestDiff = Infinity;
  for (let i = 1; i < words.length; i++) {
    const a = words.slice(0, i).join(' ');
    const b = words.slice(i).join(' ');
    const diff = Math.abs(a.length - b.length);
    if (diff < bestDiff) { best = [a, b]; bestDiff = diff; }
  }
  const longest = Math.max(best[0].length, best[1].length);
  const size = Math.max(11, Math.min(17, Math.floor(290 / longest)));
  return { lines: best[1] ? best : [clean], size };
}

function Sticker({ restaurant, qrSvg, outline }) {
  const { lines, size } = nameLines(restaurant.name);
  const nameY = lines.length === 1 ? 88 : 78;
  return (
    <svg viewBox="0 0 300 300" width="3in" height="3in" style={{ display: 'block' }}>
      <defs>
        <path id="sticker-top" d="M 26,150 A 124,124 0 0 1 274,150" />
        <path id="sticker-bottom" d="M 14,150 A 136,136 0 0 0 286,150" />
      </defs>
      <circle cx="150" cy="150" r="150" fill={C.navy} />
      <circle cx="150" cy="150" r="112" fill={C.cream} />
      <text fill="#fff" fontSize="21" fontWeight="800" letterSpacing="2.5" fontFamily="Poppins, Arial, sans-serif">
        <textPath href="#sticker-top" startOffset="50%" textAnchor="middle">TENNSATIONAL APPROVED</textPath>
      </text>
      <text fill={C.ring} fontSize="15" fontWeight="700" letterSpacing="3" fontFamily="Poppins, Arial, sans-serif">
        <textPath href="#sticker-bottom" startOffset="50%" textAnchor="middle">★ TENNSATIONAL.COM ★</textPath>
      </text>
      {lines.map((line, i) => (
        <text key={i} x="150" y={nameY + i * (size + 3)} textAnchor="middle" fill={C.navy}
          fontSize={size} fontWeight="800" fontFamily="Poppins, Arial, sans-serif">{line}</text>
      ))}
      {qrSvg && (
        <image href={`data:image/svg+xml;utf8,${encodeURIComponent(qrSvg)}`} x="102" y="104" width="96" height="96" />
      )}
      <text x="150" y="222" textAnchor="middle" fill={C.orange} fontSize="13" fontWeight="800"
        letterSpacing="1.5" fontFamily="Poppins, Arial, sans-serif">SCAN TO RATE US</text>
      {outline && <circle cx="150" cy="150" r="149.5" fill="none" stroke="#999" strokeWidth="1" strokeDasharray="4 3" />}
    </svg>
  );
}

export default function StickerMaker() {
  const restaurants = allRestaurantsData.restaurants;
  const { slugOf } = useMemo(() => buildSlugMap(restaurants), [restaurants]);
  const [passcode, setPasscode] = useState(() => storage.get(PASS_KEY) || '');
  const [unlocked, setUnlocked] = useState(false);
  const [passInput, setPassInput] = useState('');
  const [authMsg, setAuthMsg] = useState('');
  const [query, setQuery] = useState('');
  const [queue, setQueue] = useState([]); // [{ r, copies }]
  const [approved, setApprovedState] = useState(() => new Set());
  const [qr, setQr] = useState({}); // restaurant id -> svg string
  const [layout, setLayout] = useState(() => {
    try { return { ...DEFAULT_LAYOUT, ...JSON.parse(storage.get(LAYOUT_KEY) || '{}') }; } catch { return DEFAULT_LAYOUT; }
  });
  const [skip, setSkip] = useState(0);
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);
  // Print copy of the sheets lives directly under <body>, so printing can
  // hide the whole app (no blank trailing pages from hidden content).
  const [printRoot] = useState(() => {
    const el = document.createElement('div');
    el.className = 'sticker-portal';
    return el;
  });
  useEffect(() => {
    document.body.appendChild(printRoot);
    return () => printRoot.remove();
  }, [printRoot]);

  // Private tool: keep it out of search results.
  useEffect(() => {
    document.title = 'Sticker Maker | TENNsational';
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
    document.head.appendChild(meta);
    return () => meta.remove();
  }, []);

  // Re-check a remembered passcode.
  useEffect(() => {
    if (!passcode) return;
    checkAdmin(passcode)
      .then((ok) => { if (ok) setUnlocked(true); else { storage.del(PASS_KEY); setPasscode(''); } })
      .catch(() => setAuthMsg('Could not reach the database — check your connection.'));
  }, [passcode]);

  useEffect(() => {
    if (unlocked) loadApproved({ refresh: true }).then(setApprovedState);
  }, [unlocked]);

  useEffect(() => { storage.set(LAYOUT_KEY, JSON.stringify(layout)); }, [layout]);

  // QR codes for everything on the sheet (library loads only on this page).
  useEffect(() => {
    const missing = queue.filter(({ r }) => !qr[r.id]);
    if (!missing.length) return;
    import('qrcode').then(({ default: QRCode }) => Promise.all(missing.map(({ r }) =>
      QRCode.toString(`${SITE_URL}/restaurant/${slugOf.get(r.id)}?ref=sticker`, {
        type: 'svg', margin: 1, errorCorrectionLevel: 'M', color: { dark: C.navy, light: '#FFFFFF' },
      }).then((svg) => [r.id, svg]),
    ))).then((pairs) => setQr((prev) => ({ ...prev, ...Object.fromEntries(pairs) })));
  }, [queue, qr, slugOf]);

  async function unlock(e) {
    e.preventDefault();
    setAuthMsg('Checking…');
    try {
      if (await checkAdmin(passInput)) {
        storage.set(PASS_KEY, passInput);
        setPasscode(passInput);
        setUnlocked(true);
        setAuthMsg('');
      } else {
        setAuthMsg('Wrong passcode.');
      }
    } catch {
      setAuthMsg('Could not reach the database — check your connection.');
    }
  }

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];
    return restaurants
      .filter((r) => `${r.name} ${r.city}`.toLowerCase().includes(q))
      .slice(0, 12);
  }, [query, restaurants]);

  const add = (r) => {
    setQueue((qu) => (qu.some((x) => x.r.id === r.id) ? qu : [...qu, { r, copies: 1 }]));
    setQuery('');
  };

  async function toggleBadge(r, on) {
    setBusy(true);
    try {
      await setApproved(r, on, passcode);
      setApprovedState(await loadApproved({ refresh: true }));
      setMsg(`${r.name}: badge ${on ? 'on' : 'off'}.`);
    } catch (e) {
      setMsg(`Could not update ${r.name}: ${e.message}`);
    }
    setBusy(false);
  }

  async function printAndApprove() {
    setBusy(true);
    setMsg('');
    const failed = [];
    for (const { r } of queue) {
      if (approved.has(ratingKey(r))) continue;
      try { await setApproved(r, true, passcode); } catch { failed.push(r.name); }
    }
    setApprovedState(await loadApproved({ refresh: true }));
    setBusy(false);
    if (failed.length) setMsg(`Badge not turned on for: ${failed.join(', ')}. Stickers will still print.`);
    setTimeout(() => window.print(), 50);
  }

  // Lay stickers onto sheets, leaving `skip` empty spots on the first sheet.
  const perSheet = layout.cols * layout.rows;
  const slots = [...Array(Math.max(0, skip)).fill(null), ...queue.flatMap(({ r, copies }) => Array(copies).fill(r))];
  const sheets = [];
  for (let i = 0; i < slots.length; i += perSheet) sheets.push(slots.slice(i, i + perSheet));
  const stickerCount = slots.length - skip;

  const box = { background: '#fff', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', marginBottom: '20px' };
  const btn = (bg, fg = '#fff') => ({ background: bg, color: fg, border: 'none', borderRadius: '8px', padding: '10px 18px', fontWeight: 700, cursor: 'pointer' });
  const num = (key, step = 0.05) => (
    <label style={{ display: 'inline-flex', flexDirection: 'column', fontSize: '0.8rem', color: C.muted, marginRight: '12px', marginBottom: '8px' }}>
      {{ cols: 'Columns', rows: 'Rows', top: 'Top margin (in)', left: 'Left margin (in)', gapX: 'Gap across (in)', gapY: 'Gap down (in)' }[key]}
      <input type="number" step={step} min="0" value={layout[key]} style={{ width: '90px', padding: '6px', border: '1px solid #d1d5db', borderRadius: '6px' }}
        onChange={(e) => setLayout({ ...layout, [key]: Math.max(0, Number(e.target.value) || 0) })} />
    </label>
  );

  const renderSheets = () => sheets.map((sheet, si) => (
    <div key={si} className="sticker-sheet"
      style={{ position: 'relative', width: '8.5in', height: '11in', background: '#fff', margin: '0 auto 24px', boxShadow: '0 2px 10px rgba(0,0,0,0.12)' }}>
      {sheet.map((r, i) => {
        const col = i % layout.cols;
        const row = Math.floor(i / layout.cols);
        const pos = {
          position: 'absolute',
          left: `${layout.left + col * (3 + layout.gapX)}in`,
          top: `${layout.top + row * (3 + layout.gapY)}in`,
        };
        return r
          ? <div key={i} style={pos}><Sticker restaurant={r} qrSvg={qr[r.id]} outline={layout.outline} /></div>
          : <div key={i} className="no-print" style={{ ...pos, width: '3in', height: '3in', borderRadius: '50%', border: '1px dashed #e5e7eb' }} />;
      })}
    </div>
  ));

  if (!unlocked) {
    return (
      <div style={{ minHeight: '70vh', background: C.cream, padding: '60px 16px' }}>
        <form onSubmit={unlock} style={{ ...box, maxWidth: '380px', margin: '0 auto' }}>
          <h1 style={{ color: C.navy, fontSize: '1.4rem', marginTop: 0 }}>Sticker Maker</h1>
          <p style={{ color: C.muted }}>Enter your admin passcode.</p>
          <input type="password" value={passInput} onChange={(e) => setPassInput(e.target.value)} autoFocus
            style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px', marginBottom: '12px' }} />
          <button type="submit" style={btn(C.orange)}>Unlock</button>
          {authMsg && <p style={{ color: C.muted, marginBottom: 0 }}>{authMsg}</p>}
        </form>
      </div>
    );
  }

  return (
    <div style={{ background: C.cream, minHeight: '100vh' }}>
      <style>{`
        @media screen {
          .sticker-portal { display: none; }
          .sticker-preview { overflow-x: auto; padding: 0 16px 40px; }
        }
        @media print {
          @page { size: letter; margin: 0; }
          html, body { margin: 0 !important; padding: 0 !important; background: #fff !important; }
          body > *:not(.sticker-portal) { display: none !important; }
          .sticker-portal .no-print { display: none !important; }
          .sticker-portal .sticker-sheet { box-shadow: none !important; margin: 0 !important; break-after: page; }
          .sticker-portal .sticker-sheet:last-child { break-after: auto; }
          * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      `}</style>

      <div className="no-print" style={{ maxWidth: '960px', margin: '0 auto', padding: '32px 16px 8px' }}>
        <h1 style={{ color: C.navy, marginTop: 0 }}>Sticker Maker</h1>

        <div style={box}>
          <h2 style={{ color: C.navy, fontSize: '1.1rem', marginTop: 0 }}>1. Add restaurants</h2>
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Type a restaurant name or city…"
            style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }} />
          {matches.length > 0 && (
            <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', marginTop: '6px' }}>
              {matches.map((r) => (
                <button key={r.id} type="button" onClick={() => add(r)}
                  style={{ display: 'block', width: '100%', textAlign: 'left', padding: '10px 12px', background: '#fff', border: 'none', borderBottom: '1px solid #f3f4f6', cursor: 'pointer' }}>
                  <strong style={{ color: C.navy }}>{r.name}</strong>
                  <span style={{ color: C.muted }}> · {r.city}{r.address ? ` · ${r.address.split(',')[0]}` : ''}</span>
                  {approved.has(ratingKey(r)) && <span style={{ color: C.forest, fontWeight: 700 }}> · ✓ Approved</span>}
                </button>
              ))}
            </div>
          )}
          {queue.length > 0 && (
            <table style={{ width: '100%', marginTop: '14px', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
              <tbody>
                {queue.map(({ r, copies }, i) => (
                  <tr key={r.id} style={{ borderTop: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '8px 4px' }}><strong>{r.name}</strong> <span style={{ color: C.muted }}>· {r.city}</span></td>
                    <td style={{ padding: '8px 4px', whiteSpace: 'nowrap' }}>
                      Copies{' '}
                      <input type="number" min="1" max="30" value={copies} style={{ width: '56px', padding: '4px', border: '1px solid #d1d5db', borderRadius: '6px' }}
                        onChange={(e) => setQueue(queue.map((x, j) => (j === i ? { ...x, copies: Math.min(30, Math.max(1, Number(e.target.value) || 1)) } : x)))} />
                    </td>
                    <td style={{ padding: '8px 4px', whiteSpace: 'nowrap' }}>
                      {approved.has(ratingKey(r))
                        ? <button type="button" disabled={busy} onClick={() => toggleBadge(r, false)} style={{ ...btn('#fff', C.muted), padding: '4px 10px', border: '1px solid #d1d5db' }}>✓ Approved — remove</button>
                        : <span style={{ color: C.muted }}>Badge turns on when printed</span>}
                    </td>
                    <td style={{ padding: '8px 4px', textAlign: 'right' }}>
                      <button type="button" onClick={() => setQueue(queue.filter((_, j) => j !== i))} style={{ background: 'none', border: 'none', color: '#b91c1c', cursor: 'pointer' }}>Remove</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div style={box}>
          <h2 style={{ color: C.navy, fontSize: '1.1rem', marginTop: 0 }}>2. Sheet setup (3″ round labels, letter paper)</h2>
          <p style={{ color: C.muted, fontSize: '0.85rem', marginTop: 0 }}>
            Match these to your label sheet&apos;s spec. First time: print on plain paper with outlines on, hold it
            against a label sheet up to the light, and adjust. Settings are remembered on this device.
          </p>
          <div>{num('cols', 1)}{num('rows', 1)}{num('top')}{num('left')}{num('gapX')}{num('gapY')}</div>
          <label style={{ display: 'inline-flex', flexDirection: 'column', fontSize: '0.8rem', color: C.muted, marginRight: '12px' }}>
            Start at label #
            <input type="number" min="1" max={perSheet} value={skip + 1} style={{ width: '90px', padding: '6px', border: '1px solid #d1d5db', borderRadius: '6px' }}
              onChange={(e) => setSkip(Math.min(perSheet - 1, Math.max(0, (Number(e.target.value) || 1) - 1)))} />
          </label>
          <label style={{ fontSize: '0.9rem', color: C.navy }}>
            <input type="checkbox" checked={layout.outline} onChange={(e) => setLayout({ ...layout, outline: e.target.checked })} /> Show cut/alignment outlines
          </label>
          <div style={{ marginTop: '8px' }}>
            <button type="button" onClick={() => { setLayout(DEFAULT_LAYOUT); setSkip(0); }} style={{ ...btn('#fff', C.muted), border: '1px solid #d1d5db', padding: '6px 12px' }}>Reset to defaults</button>
          </div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <button type="button" disabled={!stickerCount || busy} onClick={printAndApprove} style={{ ...btn(stickerCount ? C.orange : '#d1d5db'), padding: '14px 26px', fontSize: '1rem' }}>
            {busy ? 'Working…' : `3. Print ${stickerCount} sticker${stickerCount === 1 ? '' : 's'} & turn on badges`}
          </button>
          <button type="button" disabled={!stickerCount} onClick={() => window.print()} style={{ ...btn('#fff', C.navy), border: `2px solid ${C.navy}` }}>
            Print only (test page)
          </button>
          {msg && <span style={{ color: C.muted }}>{msg}</span>}
        </div>
        {sheets.length > 0 && <p style={{ color: C.muted, fontSize: '0.85rem' }}>Preview ({sheets.length} sheet{sheets.length === 1 ? '' : 's'}):</p>}
      </div>

      <div className="sticker-preview">{renderSheets()}</div>
      {createPortal(renderSheets(), printRoot)}
    </div>
  );
}
