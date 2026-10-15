// Turns Google's weekly opening hours into one short line for listings:
//   ["Monday: Closed", "Tuesday: 11:00 AM – 9:00 PM", …]
//   -> "11 AM-9 PM (Closed Monday)"
//   -> "11 AM-9 PM; Fri-Sat 11 AM-10 PM (Closed Sunday)"
// Matches the style of the hand-entered listings ("11 AM-7 PM (Closed
// Saturday, Sunday)"). Returns '' when Google has no hours.

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const SHORT = { Monday: 'Mon', Tuesday: 'Tue', Wednesday: 'Wed', Thursday: 'Thu', Friday: 'Fri', Saturday: 'Sat', Sunday: 'Sun' };

// "11:00 AM – 9:30 PM, 5:00 – 9:00 PM" -> "11 AM-9:30 PM, 5-9 PM"
function tidy(text) {
  return text
    .replace(/[   ]/g, ' ')
    .replace(/:00/g, '')
    .replace(/\s*[–—-]\s*/g, '-')
    .replace(/\s+/g, ' ')
    .trim();
}

// Consecutive days become ranges: [Fri, Sat] -> "Fri-Sat"; others joined.
function dayList(days, long) {
  const idx = days.map((d) => DAYS.indexOf(d)).sort((a, b) => a - b);
  const parts = [];
  for (let i = 0; i < idx.length; i++) {
    let j = i;
    while (j + 1 < idx.length && idx[j + 1] === idx[j] + 1) j++;
    const name = (k) => (long ? DAYS[k] : SHORT[DAYS[k]]);
    parts.push(j - i >= (long ? 2 : 1) ? `${name(idx[i])}-${name(idx[j])}`
      : idx.slice(i, j + 1).map(name).join(', '));
    i = j;
  }
  return parts.join(', ');
}

export function summarizeHours(weekdayDescriptions) {
  if (!Array.isArray(weekdayDescriptions) || !weekdayDescriptions.length) return '';
  const byDay = {};
  for (const line of weekdayDescriptions) {
    const m = String(line).match(/^([A-Za-z]+):\s*(.*)$/);
    if (m && DAYS.includes(m[1])) byDay[m[1]] = tidy(m[2]);
  }
  const days = DAYS.filter((d) => byDay[d] !== undefined);
  if (!days.length) return '';

  const closed = days.filter((d) => /^closed$/i.test(byDay[d]));
  const open = days.filter((d) => !closed.includes(d));
  if (!open.length) return '';

  // Most common open hours become the headline; other days are listed.
  const groups = new Map();
  for (const d of open) groups.set(byDay[d], [...(groups.get(byDay[d]) || []), d]);
  const ranked = [...groups.entries()].sort((a, b) => b[1].length - a[1].length);
  const [main, ...rest] = ranked;

  let out = /open 24 hours/i.test(main[0]) ? 'Open 24 hours' : main[0];
  for (const [hours, ds] of rest) out += `; ${dayList(ds, false)} ${hours}`;
  if (closed.length) out += ` (Closed ${dayList(closed, true)})`;
  return out;
}
