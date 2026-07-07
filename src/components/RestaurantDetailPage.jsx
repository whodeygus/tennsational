import { useEffect, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Star, MapPin, Phone, Globe, Clock, ArrowLeft, ExternalLink } from 'lucide-react';
import allRestaurantsData from '../data/allRestaurants.json';
import mountainBackground from '../assets/east_tennessee_mountains.jpg';
import {
  buildSlugMap, citySlug, restaurantTitle, restaurantMetaDescription, mapsLink, SITE_URL,
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

const StarRow = ({ rating }) => {
  const full = Math.floor(rating || 0);
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
      {[0, 1, 2, 3, 4].map((i) => (
        <Star
          key={i}
          style={{
            width: '18px', height: '18px',
            fill: i < full ? '#f59e0b' : 'none',
            color: i < full ? '#f59e0b' : '#d1d5db',
          }}
        />
      ))}
    </span>
  );
};

export default function RestaurantDetailPage() {
  const { slug } = useParams();
  const restaurants = allRestaurantsData.restaurants;
  const { bySlug, slugOf } = useMemo(() => buildSlugMap(restaurants), [restaurants]);
  const restaurant = bySlug.get(slug);

  useEffect(() => {
    if (restaurant) {
      setMeta(
        restaurantTitle(restaurant),
        restaurantMetaDescription(restaurant),
        `/restaurant/${slug}`,
      );
      window.scrollTo(0, 0);
    }
  }, [slug, restaurant]);

  if (!restaurant) {
    return (
      <div style={{ minHeight: '60vh', background: COLORS.cream, padding: '80px 20px', textAlign: 'center' }}>
        <h1 style={{ color: COLORS.navy, fontSize: '2rem', marginBottom: '16px' }}>Restaurant not found</h1>
        <p style={{ color: COLORS.muted, marginBottom: '24px' }}>
          It may have been removed or the link is out of date.
        </p>
        <Link to="/restaurants" style={{ color: COLORS.orange, fontWeight: 600 }}>
          Browse all East Tennessee restaurants →
        </Link>
      </div>
    );
  }

  const r = restaurant;
  const cityPath = `/city/${citySlug(r.city)}`;
  const sameCity = restaurants
    .filter((x) => x.city === r.city && x.id !== r.id)
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 6);
  const websiteHref = r.website
    ? (r.website.startsWith('http') ? r.website : `https://${r.website}`)
    : null;

  const infoRow = { display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '10px 0', borderBottom: '1px solid #eee', color: COLORS.text };
  const iconStyle = { width: '18px', height: '18px', color: COLORS.orange, flexShrink: 0, marginTop: '3px' };
  const btn = {
    display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 22px',
    borderRadius: '8px', fontWeight: 600, textDecoration: 'none', fontSize: '0.95rem',
  };

  return (
    <div style={{ background: COLORS.cream, minHeight: '100vh' }}>
      {/* Hero */}
      <div style={{ position: 'relative', height: '320px', overflow: 'hidden' }}>
        <img
          src={r.featured_image || mountainBackground}
          alt={`${r.name} — ${r.cuisine} restaurant in ${r.city}, TN`}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={(e) => { e.currentTarget.src = mountainBackground; }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(26,53,80,0.85), rgba(26,53,80,0.15))' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, maxWidth: '960px', margin: '0 auto', padding: '0 20px 28px' }}>
          <nav style={{ fontSize: '0.85rem', marginBottom: '10px' }} aria-label="Breadcrumb">
            <Link to="/" style={{ color: 'rgba(247,240,227,0.85)', textDecoration: 'none' }}>Home</Link>
            <span style={{ color: 'rgba(247,240,227,0.5)', margin: '0 8px' }}>/</span>
            <Link to={cityPath} style={{ color: 'rgba(247,240,227,0.85)', textDecoration: 'none' }}>{r.city}</Link>
            <span style={{ color: 'rgba(247,240,227,0.5)', margin: '0 8px' }}>/</span>
            <span style={{ color: COLORS.cream }}>{r.name}</span>
          </nav>
          <h1 style={{ color: '#fff', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', margin: 0, lineHeight: 1.15 }}>{r.name}</h1>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px', marginTop: '10px', color: COLORS.cream }}>
            {r.rating ? (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <StarRow rating={r.rating} />
                <strong>{r.rating}</strong>
                {r.review_count ? <span style={{ opacity: 0.8 }}>({r.review_count.toLocaleString()} reviews)</span> : null}
              </span>
            ) : null}
            <span style={{ background: COLORS.orange, color: '#fff', padding: '3px 10px', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 600 }}>
              {r.cuisine}
            </span>
            {r.price_range ? <span style={{ fontWeight: 700 }}>{r.price_range}</span> : null}
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '32px 20px 60px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '28px' }}>
          {/* About */}
          <div style={{ background: '#fff', borderRadius: '12px', padding: '26px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <h2 style={{ color: COLORS.navy, fontSize: '1.3rem', marginTop: 0 }}>About {r.name}</h2>
            <p style={{ color: COLORS.text, lineHeight: 1.7 }}>
              {r.description || `${r.name} is a ${r.cuisine ? r.cuisine.toLowerCase() : ''} restaurant in ${r.city}, Tennessee.`}
            </p>
            {Array.isArray(r.amenities) && r.amenities.length > 0 && (
              <>
                <h3 style={{ color: COLORS.navy, fontSize: '1rem', marginBottom: '8px' }}>Known for</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {r.amenities.map((a) => (
                    <span key={a} style={{ background: COLORS.cream, color: COLORS.forest, padding: '4px 12px', borderRadius: '999px', fontSize: '0.85rem' }}>
                      {a}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Details */}
          <div style={{ background: '#fff', borderRadius: '12px', padding: '26px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <h2 style={{ color: COLORS.navy, fontSize: '1.3rem', marginTop: 0 }}>Details</h2>
            {r.address && (
              <div style={infoRow}>
                <MapPin style={iconStyle} />
                <a href={mapsLink(r)} target="_blank" rel="noopener noreferrer" style={{ color: COLORS.text, textDecoration: 'none' }}>
                  {r.address} <ExternalLink style={{ width: '13px', height: '13px', display: 'inline', color: COLORS.muted }} />
                </a>
              </div>
            )}
            {r.phone && (
              <div style={infoRow}>
                <Phone style={iconStyle} />
                <a href={`tel:${r.phone}`} style={{ color: COLORS.text, textDecoration: 'none' }}>{r.phone}</a>
              </div>
            )}
            {websiteHref && (
              <div style={infoRow}>
                <Globe style={iconStyle} />
                <a href={websiteHref} target="_blank" rel="noopener noreferrer" style={{ color: COLORS.text, textDecoration: 'none', wordBreak: 'break-all' }}>
                  {r.website.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                </a>
              </div>
            )}
            {r.hours && (
              <div style={{ ...infoRow, borderBottom: 'none' }}>
                <Clock style={iconStyle} />
                <span>{r.hours}</span>
              </div>
            )}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '18px' }}>
              {r.phone && (
                <a href={`tel:${r.phone}`} style={{ ...btn, background: COLORS.orange, color: '#fff' }}>
                  <Phone style={{ width: '16px', height: '16px' }} /> Call
                </a>
              )}
              <a href={mapsLink(r)} target="_blank" rel="noopener noreferrer" style={{ ...btn, background: COLORS.navy, color: '#fff' }}>
                <MapPin style={{ width: '16px', height: '16px' }} /> Directions
              </a>
              {websiteHref && (
                <a href={websiteHref} target="_blank" rel="noopener noreferrer" style={{ ...btn, border: `2px solid ${COLORS.navy}`, color: COLORS.navy }}>
                  <Globe style={{ width: '16px', height: '16px' }} /> Website
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Same-city internal links — important for SEO crawl paths */}
        {sameCity.length > 0 && (
          <div style={{ marginTop: '40px' }}>
            <h2 style={{ color: COLORS.navy, fontSize: '1.4rem' }}>
              More restaurants in {r.city}
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
              {sameCity.map((x) => (
                <Link
                  key={x.id}
                  to={`/restaurant/${slugOf.get(x.id)}`}
                  style={{ background: '#fff', borderRadius: '10px', padding: '16px 18px', textDecoration: 'none', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}
                >
                  <div style={{ color: COLORS.navy, fontWeight: 700 }}>{x.name}</div>
                  <div style={{ color: COLORS.muted, fontSize: '0.85rem', marginTop: '4px' }}>
                    {x.cuisine} · {x.price_range || '$'} {x.rating ? `· ★ ${x.rating}` : ''}
                  </div>
                </Link>
              ))}
            </div>
            <div style={{ marginTop: '18px' }}>
              <Link to={cityPath} style={{ color: COLORS.orange, fontWeight: 600, textDecoration: 'none' }}>
                See all {r.city} restaurants →
              </Link>
            </div>
          </div>
        )}

        <div style={{ marginTop: '36px' }}>
          <Link to="/restaurants" style={{ color: COLORS.muted, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <ArrowLeft style={{ width: '16px', height: '16px' }} /> Back to all restaurants
          </Link>
        </div>
      </div>
    </div>
  );
}
