import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Star, MapPin } from 'lucide-react';
import allRestaurantsData from '../data/allRestaurants.json';
import mountainBackground from '../assets/east_tennessee_mountains.jpg';
import {
  buildSlugMap, citySlug, cityTitle, cityMetaDescription, SITE_URL,
} from '../lib/seo.mjs';

const COLORS = {
  cream: '#F7F0E3',
  forest: '#2F4A3C',
  navy: '#1A3550',
  orange: '#C8641A',
  text: '#333333',
  muted: '#6b7280',
};

function setMeta(title, description, canonicalPath) {
  document.title = title;
  let desc = document.querySelector('meta[name="description"]');
  if (!desc) {
    desc = document.createElement('meta');
    desc.setAttribute('name', 'description');
    document.head.appendChild(desc);
  }
  desc.setAttribute('content', description);
  let canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    document.head.appendChild(canonical);
  }
  canonical.setAttribute('href', SITE_URL + canonicalPath);
}

export default function CityPage() {
  const { slug } = useParams();
  const restaurants = allRestaurantsData.restaurants;
  const { slugOf } = useMemo(() => buildSlugMap(restaurants), [restaurants]);
  const [cuisineFilter, setCuisineFilter] = useState('All');

  const cityRestaurants = useMemo(
    () => restaurants.filter((r) => citySlug(r.city) === slug),
    [restaurants, slug],
  );
  const cityName = cityRestaurants[0]?.city;
  const county = cityRestaurants[0]?.county;

  const cuisines = useMemo(() => {
    const counts = {};
    cityRestaurants.forEach((r) => {
      if (r.cuisine) counts[r.cuisine] = (counts[r.cuisine] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).map(([c]) => c);
  }, [cityRestaurants]);

  useEffect(() => {
    if (cityName) {
      setMeta(
        cityTitle(cityName, cityRestaurants.length),
        cityMetaDescription(cityName, cityRestaurants.length, cuisines),
        `/city/${slug}`,
      );
      window.scrollTo(0, 0);
    }
  }, [slug, cityName, cityRestaurants.length, cuisines]);

  if (!cityName) {
    return (
      <div style={{ minHeight: '60vh', background: COLORS.cream, padding: '80px 20px', textAlign: 'center' }}>
        <h1 style={{ color: COLORS.navy, fontSize: '2rem', marginBottom: '16px' }}>City not found</h1>
        <Link to="/restaurants" style={{ color: COLORS.orange, fontWeight: 600 }}>
          Browse all East Tennessee restaurants →
        </Link>
      </div>
    );
  }

  const shown = cuisineFilter === 'All'
    ? cityRestaurants
    : cityRestaurants.filter((r) => r.cuisine === cuisineFilter);
  const sorted = [...shown].sort((a, b) => (b.rating || 0) - (a.rating || 0));

  const chip = (active) => ({
    padding: '6px 14px', borderRadius: '999px', cursor: 'pointer', fontSize: '0.85rem',
    border: `1.5px solid ${active ? COLORS.orange : '#d1d5db'}`,
    background: active ? COLORS.orange : '#fff',
    color: active ? '#fff' : COLORS.text, fontWeight: active ? 700 : 500,
  });

  return (
    <div style={{ background: COLORS.cream, minHeight: '100vh' }}>
      {/* Hero */}
      <div style={{ position: 'relative', padding: '64px 20px', backgroundImage: `url(${mountainBackground})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(26,53,80,0.72)' }} />
        <div style={{ position: 'relative', maxWidth: '960px', margin: '0 auto' }}>
          <nav style={{ fontSize: '0.85rem', marginBottom: '12px' }} aria-label="Breadcrumb">
            <Link to="/" style={{ color: 'rgba(247,240,227,0.85)', textDecoration: 'none' }}>Home</Link>
            <span style={{ color: 'rgba(247,240,227,0.5)', margin: '0 8px' }}>/</span>
            <span style={{ color: COLORS.cream }}>{cityName}</span>
          </nav>
          <h1 style={{ color: '#fff', fontSize: 'clamp(1.9rem, 4.5vw, 3rem)', margin: 0 }}>
            Restaurants in {cityName}, TN
          </h1>
          <p style={{ color: 'rgba(247,240,227,0.9)', fontSize: '1.05rem', maxWidth: '640px', lineHeight: 1.6, marginTop: '12px' }}>
            {cityRestaurants.length} local spots in {cityName}{county ? ` (${county})` : ''} — from{' '}
            {cuisines.slice(0, 3).join(', ').toLowerCase() || 'local favorites'} to hidden gems, all in one guide.
          </p>
        </div>
      </div>

      {/* Cuisine chips + listing */}
      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '28px 20px 60px' }}>
        {cuisines.length > 1 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
            <button type="button" onClick={() => setCuisineFilter('All')} style={chip(cuisineFilter === 'All')}>
              All ({cityRestaurants.length})
            </button>
            {cuisines.map((c) => (
              <button key={c} type="button" onClick={() => setCuisineFilter(c)} style={chip(cuisineFilter === c)}>
                {c}
              </button>
            ))}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '18px' }}>
          {sorted.map((r) => (
            <Link
              key={r.id}
              to={`/restaurant/${slugOf.get(r.id)}`}
              style={{ background: '#fff', borderRadius: '12px', padding: '20px', textDecoration: 'none', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', display: 'block' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
                <h2 style={{ color: COLORS.navy, fontSize: '1.05rem', margin: 0, lineHeight: 1.3 }}>{r.name}</h2>
                {r.price_range && <span style={{ color: COLORS.forest, fontWeight: 700, flexShrink: 0 }}>{r.price_range}</span>}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
                <span style={{ background: COLORS.cream, color: COLORS.forest, padding: '2px 10px', borderRadius: '999px', fontSize: '0.78rem', fontWeight: 600 }}>
                  {r.cuisine}
                </span>
                {r.rating ? (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: COLORS.muted, fontSize: '0.85rem' }}>
                    <Star style={{ width: '14px', height: '14px', fill: '#f59e0b', color: '#f59e0b' }} />
                    {r.rating}{r.review_count ? ` (${r.review_count.toLocaleString()})` : ''}
                  </span>
                ) : null}
              </div>
              {r.description && (
                <p style={{ color: COLORS.muted, fontSize: '0.88rem', lineHeight: 1.55, marginTop: '10px', marginBottom: 0, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {r.description}
                </p>
              )}
              {r.address && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: COLORS.muted, fontSize: '0.8rem', marginTop: '10px' }}>
                  <MapPin style={{ width: '13px', height: '13px', flexShrink: 0 }} />
                  <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.address}</span>
                </div>
              )}
            </Link>
          ))}
        </div>

        <div style={{ marginTop: '32px' }}>
          <Link to="/restaurants" style={{ color: COLORS.orange, fontWeight: 600, textDecoration: 'none' }}>
            ← Browse all East Tennessee restaurants
          </Link>
        </div>
      </div>
    </div>
  );
}
