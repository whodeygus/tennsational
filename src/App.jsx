import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Header from './components/Header.jsx';
import HomePage from './components/HomePage.jsx';
import RestaurantsPage from './components/RestaurantsPage.jsx';
import RestaurantDetailPage from './components/RestaurantDetailPage.jsx';
import CityPage from './components/CityPage.jsx';
import AboutPage from './components/AboutPage.jsx';
import PrivacyPolicy from './components/PrivacyPolicy.jsx';
import MerchPage from './components/MerchPage.jsx';
import './App.css';

// Old links used /#/restaurants — forward anyone arriving on a hash URL
// to the equivalent real URL so nothing breaks.
function HashRedirect() {
  const location = useLocation();
  useEffect(() => {
    if (window.location.hash.startsWith('#/')) {
      const target = window.location.hash.slice(1);
      window.history.replaceState(null, '', target);
      window.location.reload();
    }
  }, [location]);
  return null;
}

function NotFound() {
  return (
    <div style={{ minHeight: '60vh', background: '#F7F0E3', padding: '80px 20px', textAlign: 'center' }}>
      <h1 style={{ color: '#1A3550', fontSize: '2rem', marginBottom: '16px' }}>Page not found</h1>
      <Link to="/" style={{ color: '#C8641A', fontWeight: 600 }}>Back to the homepage →</Link>
    </div>
  );
}

function App() {
  return (
    <Router>
      <HashRedirect />
      <div className="App">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/restaurants" element={<RestaurantsPage />} />
            <Route path="/restaurant/:slug" element={<RestaurantDetailPage />} />
            <Route path="/city/:slug" element={<CityPage />} />
            <Route path="/merch" element={<MerchPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
