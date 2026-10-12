// "Near me" on the website: the visitor's location from the browser, only
// after they tap a Near me button. Never sent anywhere — distances are
// computed in the browser. Remembered for this browser tab only, so
// restaurant pages can show "X mi away" after they've opted in.

const CACHE_KEY = 'tennsational_location';

export function cachedLocation() {
  try {
    const v = JSON.parse(sessionStorage.getItem(CACHE_KEY) || 'null');
    return v && typeof v.latitude === 'number' ? v : null;
  } catch {
    return null;
  }
}

// Resolves { latitude, longitude }; rejects with a friendly message.
export function getBrowserLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Your browser can’t share its location.'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
        try { sessionStorage.setItem(CACHE_KEY, JSON.stringify(loc)); } catch { /* private mode */ }
        resolve(loc);
      },
      (err) => reject(new Error(err.code === 1
        ? 'Location is blocked for this site — allow it in your browser settings to sort by distance.'
        : 'Couldn’t find your location — please try again.')),
      { enableHighAccuracy: false, timeout: 15000, maximumAge: 5 * 60 * 1000 },
    );
  });
}

// Straight-line distance in miles (haversine).
export function distanceMiles(from, r) {
  if (!from || r?.lat == null || r?.lng == null) return null;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(r.lat - from.latitude);
  const dLng = toRad(r.lng - from.longitude);
  const a = Math.sin(dLat / 2) ** 2
    + Math.cos(toRad(from.latitude)) * Math.cos(toRad(r.lat)) * Math.sin(dLng / 2) ** 2;
  return 3958.8 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function formatMiles(mi) {
  if (mi == null) return '';
  return mi < 10 ? `${mi.toFixed(1)} mi` : `${Math.round(mi)} mi`;
}
