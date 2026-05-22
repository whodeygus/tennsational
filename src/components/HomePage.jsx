import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logoHero   from '../assets/tennsational_logo_hero.png';
import logoNew    from '../assets/tennsational_logo_new.png';
import mountainBackground from '../assets/east_tennessee_mountains.jpg';
import { getRestaurantStats } from '../data/restaurants';
import '../App.css';

// ── Brand colour tokens ──────────────────────────────────────
const C = {
  forest:      '#1E3A2F',
  forestDark:  '#0D2018',
  orange:      '#C8641A',
  orangeDark:  '#A04E12',
  orangeLight: '#E07830',
  navy:        '#1A3550',
  navyMid:     '#274A6A',
  cream:       '#F7F0E3',
  parchment:   '#EDE4CE',
  muted:       '#6B6560',
  charcoal:    '#2C2A26',
};

// ── Static page data ─────────────────────────────────────────
const CITIES = [
  { name: 'Knoxville',     count: '200+', desc: 'Knox County',              span: 2, bg: 'linear-gradient(150deg,#0D2830 0%,#1C4A4A 50%,#2A5E56 100%)' },
  { name: 'Gatlinburg',    count: '90+',  desc: 'Gateway to the Smokies',   span: 1, bg: 'linear-gradient(150deg,#1A2E18 0%,#2E5028 50%,#3A6830 100%)' },
  { name: 'Pigeon Forge',  count: '80+',  desc: 'Family dining destination', span: 1, bg: 'linear-gradient(150deg,#2E1A0C 0%,#5A3418 50%,#744220 100%)' },
  { name: 'Chattanooga',   count: '110+', desc: 'Riverside dining',          span: 2, bg: 'linear-gradient(150deg,#101828 0%,#1C3050 50%,#244068 100%)' },
  { name: 'Sevierville',   count: '60+',  desc: 'Sevier County',             span: 1, bg: 'linear-gradient(150deg,#1C2C14 0%,#324C22 50%,#446030 100%)' },
  { name: 'Johnson City',  count: '70+',  desc: 'The hidden culinary gem',   span: 1, bg: 'linear-gradient(150deg,#28141E 0%,#4A2438 50%,#603050 100%)' },
];

const PICKS = [
  {
    badge: "⭐ Editor's Choice",
    cuisine: 'Modern Appalachian · Fine Dining',
    name: 'Dancing Bear Appalachian Bistro',
    location: 'Gatlinburg', price: '$$$$', rating: '★★★★★',
    desc: "Where Smoky Mountain heritage meets culinary artistry. Farm-to-table dining built around Cruze Farm dairy, Benton's bacon, and seasonal mountain produce.",
    bg: 'linear-gradient(145deg,#1A3020 0%,#2E5230 50%,#3A6640 100%)',
  },
  {
    badge: '🔥 Local Favorite',
    cuisine: 'Tennessee BBQ · Casual',
    name: "Calhoun's on the River",
    location: 'Knoxville', price: '$$', rating: '★★★★½',
    desc: 'Riverside Tennessee BBQ done right. The ribs and the views are both worth the drive. A Knoxville institution.',
    bg: 'linear-gradient(145deg,#2E1808 0%,#6A3418 50%,#844220 100%)',
  },
  {
    badge: '🏆 Hidden Gem',
    cuisine: 'American Contemporary · Upscale',
    name: 'The Marlowe',
    location: 'Knoxville', price: '$$$', rating: '★★★★★',
    desc: "Knoxville's answer to great metropolitan dining. Consistently spectacular — the rare restaurant that punches above its city's weight class.",
    bg: 'linear-gradient(145deg,#0E2236 0%,#1A3550 50%,#224270 100%)',
  },
];

const CATEGORIES = [
  '🔥 Tennessee BBQ','🥩 Steakhouses','🌿 Farm-to-Table',
  '🥞 Breakfast & Brunch','💑 Date Night','👨‍👩‍👧 Family Friendly',
  '🍺 Craft Breweries','🌮 Mexican & Latin','🍣 Asian Cuisine',
  '🎭 Dinner Shows','🌅 Waterfront Dining','⭐ Fine Dining',
  '🥜 Southern Comfort','🍕 Pizza & Italian',
];

// ── Shared tiny helpers ──────────────────────────────────────
const SectionLabel = ({ children }) => (
  <div style={{ fontSize:'0.67rem', fontWeight:700, letterSpacing:'0.22em', textTransform:'uppercase', color:C.orange, marginBottom:'0.6rem', display:'flex', alignItems:'center', gap:'0.7rem' }}>
    {children}
    <span style={{ display:'block', width:36, height:1, background:C.orange, opacity:0.55 }} />
  </div>
);

const SectionTitle = ({ children }) => (
  <h2 style={{ fontFamily:"'Cormorant Garamond','Georgia',serif", fontSize:'clamp(2rem,4vw,3rem)', fontWeight:600, color:C.navy, lineHeight:1.05, marginBottom:'0.75rem' }}>
    {children}
  </h2>
);

const SectionSub = ({ children }) => (
  <p style={{ color:C.muted, fontSize:'0.95rem', maxWidth:'460px', lineHeight:1.7, marginBottom:'2.5rem' }}>
    {children}
  </p>
);


// ════════════════════════════════════════════════════════════
export default function HomePage() {
  const [searchQuery,          setSearchQuery]          = useState('');
  const [cityFilter,           setCityFilter]           = useState('All Cities');
  const [newsletterData,       setNewsletterData]       = useState({ firstName:'', lastName:'', email:'' });
  const [isSubmittingNewsletter, setIsSubmittingNewsletter] = useState(false);

  const navigate = useNavigate();
  const stats    = getRestaurantStats();   // live numbers from your data

  // ── Search (unchanged logic) ────────────────────────────
  const handleSearch = () => {
    const q = searchQuery.trim();
    const c = cityFilter !== 'All Cities' ? cityFilter : '';
    const term = q || c;
    navigate(term ? `/restaurants?search=${encodeURIComponent(term)}` : '/restaurants');
  };

  const handleKeyPress    = (e) => { if (e.key === 'Enter') handleSearch(); };
  const handleCityClick = (city) => navigate(`/restaurants?city=${encodeURIComponent(city)}`);
  const handlePickClick   = (name)     => navigate(`/restaurants?search=${encodeURIComponent(name)}`);
  const handleCatClick    = (cat)      => navigate(`/restaurants?search=${encodeURIComponent(cat.replace(/^[^\s]+\s/,''))}`);
  const handleTagClick    = (tag)      => navigate(`/restaurants?search=${encodeURIComponent(tag.replace(/^[^\s]+\s/,''))}`);

  // ── Scroll reveal ──────────────────────────────────────
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.12 }
    );
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // ── Newsletter (unchanged logic + endpoint) ─────────────
  const handleNewsletterChange = (field, value) =>
    setNewsletterData(prev => ({ ...prev, [field]: value }));

  const handleNewsletterSubmit = async () => {
    if (!newsletterData.firstName || !newsletterData.lastName || !newsletterData.email) {
      alert('Please fill in all fields to subscribe to our newsletter.');
      return;
    }
    setIsSubmittingNewsletter(true);
    try {
      const res = await fetch('https://formspree.io/f/mvgwqkvn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          firstName:  newsletterData.firstName,
          lastName:   newsletterData.lastName,
          email:      newsletterData.email,
          _subject:   'New Newsletter Subscription - TENNsational',
        }),
      });
      if (res.ok) {
        alert("Thank you for subscribing! You'll receive our weekly restaurant updates and exclusive deals.");
        setNewsletterData({ firstName:'', lastName:'', email:'' });
      } else {
        alert('Failed to subscribe. Please try again.');
      }
    } catch (err) {
      console.error('Newsletter error:', err);
      alert('There was an error subscribing. Please try again.');
    } finally {
      setIsSubmittingNewsletter(false);
    }
  };

  // ────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight:'100vh', fontFamily:"'Nunito','Inter',sans-serif", background:C.cream }}>

      {/* ════ HERO ══════════════════════════════════════════ */}
      <section style={{
        minHeight:'92vh',
        background:`linear-gradient(168deg,#081410 0%,#1A3228 28%,${C.forest} 55%,#2E5840 78%,#375E4A 100%)`,
        display:'flex', flexDirection:'column',
        alignItems:'center', justifyContent:'center',
        textAlign:'center', padding:'4rem 1.5rem 6rem',
        position:'relative', overflow:'hidden',
      }}>

        {/* Mountain photo — subtle texture overlay */}
        <div style={{
          position:'absolute', inset:0,
          backgroundImage:`url(${mountainBackground})`,
          backgroundSize:'cover', backgroundPosition:'center',
          opacity:0.12, pointerEvents:'none',
        }} />

        {/* Mountain silhouette SVG */}
        <svg style={{ position:'absolute', bottom:0, left:0, width:'100%', pointerEvents:'none' }}
          viewBox="0 0 1440 200" preserveAspectRatio="none">
          <path d="M0,200 L0,152 L55,112 L115,136 L190,84 L265,114 L345,58 L430,92 L510,40 L598,76 L680,28 L762,70 L845,20 L928,60 L1010,35 L1092,70 L1175,46 L1255,80 L1335,52 L1440,60 L1440,200 Z" fill="rgba(0,0,0,0.10)"/>
          <path d="M0,200 L0,166 L72,140 L155,160 L245,118 L338,136 L430,94 L522,120 L615,74 L705,100 L795,66 L885,96 L975,70 L1065,100 L1155,80 L1245,112 L1335,86 L1440,104 L1440,200 Z" fill="rgba(0,0,0,0.16)"/>
          <path d="M0,200 L0,185 L180,165 L360,178 L540,158 L720,172 L900,155 L1080,168 L1260,152 L1440,162 L1440,200 Z" fill="rgba(8,20,16,0.82)"/>
        </svg>

        {/* Badge logo — your real tennsational_logo_hero.png */}
        <div style={{ position:'relative', zIndex:2, marginBottom:'1.75rem' }}>
          <img
            src={logoHero}
            alt="TENNsational — Explore. Taste. Discover."
            style={{ width:'220px', height:'auto',
              filter:'drop-shadow(0 10px 30px rgba(0,0,0,0.5)) drop-shadow(0 2px 8px rgba(200,100,26,0.25))' }}
          />
        </div>

        {/* Eyebrow line */}
        <div style={{ position:'relative', zIndex:2, fontSize:'0.7rem', fontWeight:700,
          letterSpacing:'0.24em', textTransform:'uppercase', color:C.orangeLight,
          marginBottom:'1.25rem', display:'flex', alignItems:'center', gap:'0.9rem' }}>
          <span style={{ display:'block', width:36, height:1, background:C.orange, opacity:0.5 }} />
          East Tennessee's Dining Guide
          <span style={{ display:'block', width:36, height:1, background:C.orange, opacity:0.5 }} />
        </div>

        {/* H1 */}
        <h1 style={{ position:'relative', zIndex:2,
          fontFamily:"'Cormorant Garamond','Georgia',serif",
          fontSize:'clamp(2.8rem,7.5vw,5.5rem)', fontWeight:600,
          color:C.cream, lineHeight:1.04,
          marginBottom:'1.25rem', maxWidth:'820px' }}>
          Where East Tennessee{' '}
          <em style={{ fontStyle:'italic', color:C.orangeLight }}>Eats</em>
        </h1>

        {/* Sub */}
        <p style={{ position:'relative', zIndex:2, color:'rgba(247,240,227,0.62)',
          fontSize:'1.02rem', maxWidth:'460px', lineHeight:1.7, marginBottom:'2.5rem' }}>
          From mountain BBQ joints to James Beard–worthy fine dining — the South's most authentic
          culinary region, all in one place.
        </p>

        {/* Search bar */}
        <div style={{ position:'relative', zIndex:2, width:'100%', maxWidth:'620px', marginBottom:'1.75rem' }}>
          <div style={{ display:'flex', background:'white', borderRadius:'56px', overflow:'hidden',
            boxShadow:'0 20px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(200,100,26,0.15)' }}>
            <input
              type="text"
              placeholder="Restaurant, cuisine, or city..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              style={{ flex:1, border:'none', outline:'none', padding:'1rem 1.5rem',
                fontFamily:'inherit', fontSize:'0.96rem', color:C.charcoal }}
            />
            <div style={{ width:1, background:'#E4D8C0', margin:'10px 0' }} />
            <select
              value={cityFilter}
              onChange={e => setCityFilter(e.target.value)}
              style={{ border:'none', outline:'none', padding:'0 1rem',
                fontFamily:'inherit', fontSize:'0.87rem', color:C.muted,
                background:'white', minWidth:'130px', cursor:'pointer' }}
            >
              <option>All Cities</option>
              {CITIES.map(c => <option key={c.name}>{c.name}</option>)}
            </select>
            <button onClick={handleSearch}
              style={{ background:C.orange, border:'none', padding:'0 1.75rem',
                color:'white', fontFamily:'inherit', fontSize:'0.87rem',
                fontWeight:700, cursor:'pointer', borderRadius:'0 56px 56px 0',
                letterSpacing:'0.06em', textTransform:'uppercase', whiteSpace:'nowrap' }}>
              Find It →
            </button>
          </div>
        </div>

        {/* Quick-filter tags */}
        <div style={{ position:'relative', zIndex:2, display:'flex', flexWrap:'wrap', gap:'0.5rem', justifyContent:'center' }}>
          {['🔥 Best BBQ','🌄 Smoky Mountains','🥂 Fine Dining','🌅 Waterfront','🥞 Brunch','💑 Date Night','👨‍👩‍👧 Family Friendly'].map(tag => (
            <button key={tag} onClick={() => handleTagClick(tag)}
              style={{ background:'rgba(255,255,255,0.07)', border:`1px solid rgba(200,100,26,0.3)`,
                color:'rgba(247,240,227,0.72)', padding:'0.35rem 1rem',
                borderRadius:'50px', fontSize:'0.78rem', fontWeight:500, cursor:'pointer',
                fontFamily:'inherit' }}>
              {tag}
            </button>
          ))}
        </div>
      </section>

      {/* ════ TRUST STRIP ═══════════════════════════════════ */}
      <div style={{ background:C.forestDark, borderBottom:`1px solid rgba(200,100,26,0.22)`,
        padding:'1rem 2rem', display:'flex', justifyContent:'center', gap:'3rem', flexWrap:'wrap' }}>
        {[
          { val:`${stats.totalRestaurants}+`, lbl:'Restaurants Listed' },
          { val:'6',        lbl:'Counties Covered' },
          { val:'Updated',  lbl:'Weekly by Locals' },
          { val:'Zero',     lbl:'Chain Sponsorships' },
          { val:'100%',     lbl:'East TN Independent' },
        ].map((item, i) => (
          <div key={item.lbl} className={`reveal delay-${i+1}`} style={{ color:'rgba(247,240,227,0.58)', fontSize:'0.79rem',
            fontWeight:500, display:'flex', alignItems:'center', gap:'0.4rem' }}>
            <strong style={{ color:C.orangeLight, fontFamily:"'Cormorant Garamond',serif",
              fontSize:'1rem', fontWeight:700 }}>{item.val}</strong>
            {item.lbl}
          </div>
        ))}
      </div>

      {/* ════ BROWSE BY CITY ════════════════════════════════ */}
      <section className="reveal" style={{ padding:'5rem 2rem', maxWidth:'1200px', margin:'0 auto' }}>
        <SectionLabel>Explore the Region</SectionLabel>
        <SectionTitle>Browse by City</SectionTitle>
        <SectionSub>
          From Knoxville's urban food scene to Gatlinburg's mountain charm — find your next great
          meal anywhere in East Tennessee.
        </SectionSub>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)',
          gridTemplateRows:'270px 270px', gap:'0.9rem' }}>
          {CITIES.map((city, i) => (
            <div key={city.name}
              className={`reveal delay-${(i % 4) + 1}`}
              onClick={() => handleCityClick(city.name)}
              style={{ gridColumn:`span ${city.span}`, borderRadius:14, position:'relative',
                overflow:'hidden', cursor:'pointer', display:'flex',
                alignItems:'flex-end', background:city.bg }}
              onMouseEnter={e => {
                e.currentTarget.querySelector('.c-hover').style.opacity = '1';
                e.currentTarget.querySelector('.c-ovl').style.opacity  = '0.94';
              }}
              onMouseLeave={e => {
                e.currentTarget.querySelector('.c-hover').style.opacity = '0';
                e.currentTarget.querySelector('.c-ovl').style.opacity  = '0';
              }}
            >
              {/* Base gradient overlay */}
              <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top,rgba(8,20,16,0.88) 0%,rgba(8,20,16,0.15) 50%,transparent 100%)' }} />
              {/* Hover darkening */}
              <div className="c-ovl" style={{ position:'absolute', inset:0, background:'rgba(8,20,16,0.5)', opacity:0, transition:'opacity 0.3s' }} />
              {/* Hover explore button */}
              <div className="c-hover" style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', opacity:0, transition:'opacity 0.3s' }}>
                <span style={{ background:'rgba(200,100,26,0.88)', color:C.cream, padding:'0.55rem 1.4rem', borderRadius:'50px', fontSize:'0.78rem', fontWeight:700, letterSpacing:'0.08em', textTransform:'uppercase' }}>
                  Explore {city.name}
                </span>
              </div>
              <div style={{ position:'relative', zIndex:1, padding:'1.5rem 1.75rem' }}>
                <span style={{ fontFamily:"'Cormorant Garamond','Georgia',serif", fontSize:'1.75rem', fontWeight:600, color:C.cream, display:'block', lineHeight:1, marginBottom:'0.2rem' }}>
                  {city.name}
                </span>
                <span style={{ fontSize:'0.74rem', fontWeight:500, color:'rgba(247,240,227,0.55)', display:'block' }}>
                  {city.count} restaurants · {city.desc}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ════ EDITOR'S PICKS ════════════════════════════════ */}
      <section className="reveal" style={{ background:C.parchment, borderTop:`1px solid rgba(200,100,26,0.14)`, borderBottom:`1px solid rgba(200,100,26,0.14)` }}>
        <div style={{ maxWidth:'1200px', margin:'0 auto', padding:'5rem 2rem' }}>
          <SectionLabel>Curated Weekly</SectionLabel>
          <SectionTitle>Editor's Picks</SectionTitle>
          <SectionSub>Hand-selected by our team — the restaurants worth going out of your way for right now.</SectionSub>

          <div style={{ display:'grid', gridTemplateColumns:'1.45fr 1fr 1fr', gap:'1.2rem' }}>
            {PICKS.map((pick, i) => (
              <div key={pick.name}
                className={`reveal delay-${i+1}`}
                onClick={() => handlePickClick(pick.name)}
                style={{ background:'white', borderRadius:14, overflow:'hidden', cursor:'pointer',
                  border:'1px solid rgba(0,0,0,0.055)', transition:'box-shadow 0.3s,transform 0.3s' }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow='0 16px 48px rgba(30,58,47,0.18)'; e.currentTarget.style.transform='translateY(-4px)'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow='none'; e.currentTarget.style.transform='translateY(0)'; }}
              >
                <div style={{ height: i===0 ? '295px' : '230px', background:pick.bg, position:'relative' }}>
                  <span style={{ position:'absolute', top:'1rem', left:'1rem', background:C.orange,
                    color:'white', fontSize:'0.65rem', fontWeight:700, letterSpacing:'0.1em',
                    textTransform:'uppercase', padding:'0.28rem 0.8rem', borderRadius:'50px' }}>
                    {pick.badge}
                  </span>
                </div>
                <div style={{ padding:'1.35rem 1.4rem 1.5rem' }}>
                  <div style={{ fontSize:'0.67rem', fontWeight:700, letterSpacing:'0.14em', textTransform:'uppercase', color:C.navyMid, marginBottom:'0.4rem' }}>{pick.cuisine}</div>
                  <div style={{ fontFamily:"'Cormorant Garamond','Georgia',serif", fontSize:'1.3rem', fontWeight:600, color:C.navy, marginBottom:'0.4rem', lineHeight:1.2 }}>{pick.name}</div>
                  <div style={{ display:'flex', alignItems:'center', gap:'0.65rem', fontSize:'0.78rem', color:C.muted, marginBottom:'0.65rem' }}>
                    <span style={{ color:C.orange }}>{pick.rating}</span>
                    <span>{pick.location} · {pick.price}</span>
                  </div>
                  <p style={{ fontSize:'0.86rem', color:C.muted, lineHeight:1.6, margin:0 }}>{pick.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════ BROWSE BY CATEGORY ════════════════════════════ */}
      <section className="reveal" style={{ padding:'5rem 2rem', maxWidth:'1200px', margin:'0 auto' }}>
        <SectionLabel>Filter by Vibe</SectionLabel>
        <SectionTitle>Find Your Kind of Meal</SectionTitle>
        <SectionSub>Browse by what you're craving — or what the occasion calls for.</SectionSub>

        <div style={{ display:'flex', gap:'0.7rem', flexWrap:'wrap' }}>
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => handleCatClick(cat)}
              style={{ display:'flex', alignItems:'center', gap:'0.45rem',
                background:'white', border:`1.5px solid #DDD0BA`, borderRadius:'50px',
                padding:'0.6rem 1.3rem', fontSize:'0.86rem', fontWeight:500,
                color:C.charcoal, cursor:'pointer', fontFamily:'inherit', transition:'all 0.22s' }}
              onMouseEnter={e => { e.currentTarget.style.background=C.forest; e.currentTarget.style.borderColor=C.forest; e.currentTarget.style.color=C.cream; }}
              onMouseLeave={e => { e.currentTarget.style.background='white'; e.currentTarget.style.borderColor='#DDD0BA'; e.currentTarget.style.color=C.charcoal; }}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* ════ ABOUT SECTION ═════════════════════════════════ */}
      <section className="reveal" style={{ background:C.forest, padding:'6rem 2rem' }}>
        <div style={{ maxWidth:'1200px', margin:'0 auto', display:'grid',
          gridTemplateColumns:'1fr 1fr', gap:'5rem', alignItems:'center' }}>

          <div className="reveal">
            {/* Your real logo — cream badge pops beautifully on forest green */}
            <img src={logoNew} alt="TENNsational"
              style={{ width:'280px', height:'auto', marginBottom:'2rem', display:'block',
                filter:'drop-shadow(0 12px 36px rgba(0,0,0,0.55))' }} />
            <blockquote style={{ fontFamily:"'Cormorant Garamond','Georgia',serif",
              fontSize:'clamp(1.6rem,2.6vw,2.2rem)', fontStyle:'italic',
              color:C.cream, lineHeight:1.38, fontWeight:400,
              paddingLeft:'1.6rem', borderLeft:`3px solid ${C.orange}`, margin:0 }}>
              East Tennessee has always had a table worth sitting at.{' '}
              <em style={{ fontStyle:'italic', color:C.orangeLight }}>
                We're just making sure you can find it.
              </em>
            </blockquote>
          </div>

          <div className="reveal delay-2">
            <p style={{ color:'rgba(247,240,227,0.66)', fontSize:'0.96rem', lineHeight:1.8, margin:0 }}>
              TENNsational was built by a local, for locals — and for the visitors lucky enough to find
              their way to this corner of the South. We cover six counties, hundreds of restaurants,
              and zero chain sponsorships.
            </p>
            <div style={{ width:44, height:2, background:C.orange, margin:'1.75rem 0' }} />
            <p style={{ color:'rgba(247,240,227,0.66)', fontSize:'0.96rem', lineHeight:1.8, margin:0 }}>
              Our picks come from real meals, real conversations, and a genuine love for what this
              region puts on the table. From Benton's bacon in Madisonville to Cruze Farm dairy in
              Knoxville — this is East Tennessee's food, told honestly.
            </p>
            <div style={{ display:'flex', gap:'2.5rem', marginTop:'2rem' }}>
              {[
                { val:`${stats.totalRestaurants}+`, lbl:'Restaurants' },
                { val:'6',    lbl:'Counties' },
                { val:'100%', lbl:'Independent' },
              ].map(s => (
                <div key={s.lbl}>
                  <strong style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'2.2rem',
                    fontWeight:600, color:C.orangeLight, display:'block', lineHeight:1 }}>
                    {s.val}
                  </strong>
                  <span style={{ fontSize:'0.73rem', fontWeight:600, letterSpacing:'0.1em',
                    textTransform:'uppercase', color:'rgba(247,240,227,0.38)',
                    display:'block', marginTop:'0.25rem' }}>
                    {s.lbl}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════ NEWSLETTER ════════════════════════════════════ */}
      {/* Formspree endpoint mvgwqkvn — preserved exactly */}
      <section style={{ background:`linear-gradient(130deg,${C.orange} 0%,${C.orangeDark} 55%,#7A3A0A 100%)`,
        padding:'5rem 2rem', textAlign:'center', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)',
          fontFamily:"'Cormorant Garamond',serif", fontSize:'13rem', fontWeight:700,
          color:'rgba(255,255,255,0.04)', whiteSpace:'nowrap', pointerEvents:'none',
          letterSpacing:'-0.02em' }}>
          TENNsational
        </div>
        <div style={{ position:'relative', zIndex:1 }}>
          <h2 style={{ fontFamily:"'Cormorant Garamond','Georgia',serif", fontSize:'2.7rem',
            fontWeight:600, color:C.cream, marginBottom:'0.65rem' }}>
            Stay Updated with TENNsational
          </h2>
          <p style={{ color:'rgba(247,240,227,0.72)', fontSize:'0.97rem', marginBottom:'2rem' }}>
            Weekly featured restaurants, new reviews, and exclusive dining deals — delivered to your inbox.
          </p>

          <div style={{ maxWidth:'420px', margin:'0 auto', display:'flex', flexDirection:'column', gap:'0.75rem' }}>
            <div style={{ display:'flex', gap:'0.75rem' }}>
              {['firstName','lastName'].map(field => (
                <input key={field}
                  type="text"
                  placeholder={field === 'firstName' ? 'First Name' : 'Last Name'}
                  value={newsletterData[field]}
                  onChange={e => handleNewsletterChange(field, e.target.value)}
                  disabled={isSubmittingNewsletter}
                  style={{ flex:1, background:'rgba(255,255,255,0.15)', border:'1px solid rgba(255,255,255,0.3)',
                    borderRadius:8, padding:'0.85rem 1.1rem', color:C.cream,
                    fontFamily:'inherit', fontSize:'0.93rem', outline:'none' }}
                />
              ))}
            </div>
            <input
              type="email"
              placeholder="Email Address"
              value={newsletterData.email}
              onChange={e => handleNewsletterChange('email', e.target.value)}
              disabled={isSubmittingNewsletter}
              style={{ background:'rgba(255,255,255,0.15)', border:'1px solid rgba(255,255,255,0.3)',
                borderRadius:8, padding:'0.85rem 1.1rem', color:C.cream,
                fontFamily:'inherit', fontSize:'0.93rem', outline:'none' }}
            />
            <button onClick={handleNewsletterSubmit} disabled={isSubmittingNewsletter}
              style={{ background:C.cream, border:'none', borderRadius:8, padding:'0.9rem',
                fontFamily:'inherit', fontSize:'0.9rem', fontWeight:700,
                color:C.orangeDark, cursor: isSubmittingNewsletter ? 'not-allowed' : 'pointer',
                letterSpacing:'0.05em', textTransform:'uppercase',
                opacity: isSubmittingNewsletter ? 0.7 : 1 }}>
              {isSubmittingNewsletter ? 'Subscribing…' : 'Subscribe to Newsletter'}
            </button>
          </div>

          <p style={{ color:'rgba(247,240,227,0.5)', fontSize:'0.8rem', marginTop:'1rem' }}>
            We respect your privacy.{' '}
            <Link to="/privacy" style={{ color:'rgba(247,240,227,0.7)', textDecoration:'underline' }}>
              Privacy Policy
            </Link>
          </p>
        </div>
      </section>

      {/* ════ FOOTER ════════════════════════════════════════ */}
      <footer style={{ background:C.forestDark, padding:'4rem 2rem 2rem',
        borderTop:`2px solid ${C.orange}` }}>
        <div style={{ maxWidth:'1200px', margin:'0 auto' }}>
          <div style={{ display:'grid', gridTemplateColumns:'1.6fr 1fr 1fr 1fr',
            gap:'3rem', paddingBottom:'3rem',
            borderBottom:'1px solid rgba(247,240,227,0.08)', marginBottom:'2rem' }}>

            {/* Brand col */}
            <div>
              <img src={logoNew} alt="TENNsational"
                style={{ width:'150px', height:'auto', marginBottom:'1rem', filter:'brightness(1.05)' }} />
              <p style={{ color:'rgba(247,240,227,0.45)', fontSize:'0.86rem', lineHeight:1.72,
                marginBottom:'1.5rem', maxWidth:'280px' }}>
                East Tennessee's most trusted restaurant directory. Built by a local, for locals —
                and for the visitors who love this region as much as we do.
              </p>
              {/* Real social links — preserved from original */}
              <div style={{ display:'flex', gap:'0.6rem' }}>
                <a href="https://www.facebook.com/profile.php?id=61579002906078"
                  target="_blank" rel="noopener noreferrer" aria-label="Facebook"
                  style={{ width:34, height:34, borderRadius:'50%',
                    border:'1px solid rgba(247,240,227,0.2)', display:'flex',
                    alignItems:'center', justifyContent:'center',
                    color:'rgba(247,240,227,0.5)', textDecoration:'none' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style={{ width:16, height:16 }}>
                    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z"/>
                  </svg>
                </a>
                <a href="https://www.instagram.com/tennsational/"
                  target="_blank" rel="noopener noreferrer" aria-label="Instagram"
                  style={{ width:34, height:34, borderRadius:'50%',
                    border:'1px solid rgba(247,240,227,0.2)', display:'flex',
                    alignItems:'center', justifyContent:'center',
                    color:'rgba(247,240,227,0.5)', textDecoration:'none' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style={{ width:16, height:16 }}>
                    <path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153.509.5.902 1.105 1.153 1.772.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 01-1.153 1.772c-.5.508-1.105.902-1.772 1.153-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 01-1.772-1.153 4.904 4.904 0 01-1.153-1.772c-.247-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.218-1.79.465-2.428.254-.66.598-1.216 1.153-1.772.5-.509 1.105-.902 1.772-1.153.637-.247 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 1.802c-2.67 0-2.986.01-4.04.059-.976.045-1.505.207-1.858.344-.466.181-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.055-.059 1.37-.059 4.04 0 2.67.01 2.986.059 4.04.045.976.207 1.505.344 1.858.181.466.398.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.047 1.37.059 4.04.059 2.67 0 2.987-.01 4.04-.059.976-.045 1.505-.207 1.858-.344.466-.181.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.047-1.055.059-1.37.059-4.04 0-2.67-.01-2.986-.059-4.04-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.055-.047-1.37-.059-4.04-.059zm0 3.063A5.135 5.135 0 1 1 12 17.135 5.135 5.135 0 0 1 12 6.865zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm5.338-7.862a1.2 1.2 0 1 0 0-2.4 1.2 1.2 0 0 0 0 2.4z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Cities col */}
            <div>
              <h4 style={{ fontSize:'0.69rem', fontWeight:700, letterSpacing:'0.16em',
                textTransform:'uppercase', color:C.cream, marginBottom:'1.2rem' }}>
                Explore Cities
              </h4>
              <div style={{ display:'flex', flexDirection:'column', gap:'0.55rem' }}>
                {CITIES.map(city => (
                  <button key={city.name} onClick={() => handleCityClick(city.name)}
                    style={{ background:'none', border:'none', padding:0,
                      color:'rgba(247,240,227,0.4)', fontSize:'0.86rem',
                      cursor:'pointer', textAlign:'left', fontFamily:'inherit' }}
                    onMouseEnter={e => e.currentTarget.style.color=C.orangeLight}
                    onMouseLeave={e => e.currentTarget.style.color='rgba(247,240,227,0.4)'}>
                    {city.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Cuisine col */}
            <div>
              <h4 style={{ fontSize:'0.69rem', fontWeight:700, letterSpacing:'0.16em',
                textTransform:'uppercase', color:C.cream, marginBottom:'1.2rem' }}>
                Browse Cuisine
              </h4>
              <div style={{ display:'flex', flexDirection:'column', gap:'0.55rem' }}>
                {['Tennessee BBQ','Fine Dining','Breakfast & Brunch','Farm-to-Table','Family Friendly','Date Night'].map(c => (
                  <button key={c} onClick={() => handleCatClick(c)}
                    style={{ background:'none', border:'none', padding:0,
                      color:'rgba(247,240,227,0.4)', fontSize:'0.86rem',
                      cursor:'pointer', textAlign:'left', fontFamily:'inherit' }}
                    onMouseEnter={e => e.currentTarget.style.color=C.orangeLight}
                    onMouseLeave={e => e.currentTarget.style.color='rgba(247,240,227,0.4)'}>
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Connect col */}
            <div>
              <h4 style={{ fontSize:'0.69rem', fontWeight:700, letterSpacing:'0.16em',
                textTransform:'uppercase', color:C.cream, marginBottom:'1.2rem' }}>
                Connect
              </h4>
              <div style={{ display:'flex', flexDirection:'column', gap:'0.55rem' }}>
                <Link to="/about"   style={{ color:'rgba(247,240,227,0.4)', fontSize:'0.86rem', textDecoration:'none' }}>Our Story</Link>
                <Link to="/privacy" style={{ color:'rgba(247,240,227,0.4)', fontSize:'0.86rem', textDecoration:'none' }}>Privacy Policy</Link>
                <a href="mailto:Admin@tennsational.com" style={{ color:'rgba(247,240,227,0.4)', fontSize:'0.86rem', textDecoration:'none' }}>Admin@tennsational.com</a>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center',
            fontSize:'0.75rem', color:'rgba(247,240,227,0.24)', flexWrap:'wrap', gap:'0.5rem' }}>
            <span>© 2025 TENNsational.com · East Tennessee's Table · Explore. Taste. Discover.</span>
            <span>East Tennessee Independent</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
