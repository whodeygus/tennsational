import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

function SimpleApp() {
  return (
    <Router>
      <div className="App">
        <header style={{ backgroundColor: 'white', padding: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between' }}>
            <a href="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#EA580C', textDecoration: 'none' }}>
              TENNsational
            </a>
            <nav style={{ display: 'flex', gap: '1rem' }}>
              <a href="/#/" style={{ color: '#333', textDecoration: 'none' }}>Home</a>
              <a href="/#/restaurants" style={{ color: '#333', textDecoration: 'none' }}>Restaurants</a>
              <a href="/#/about" style={{ color: '#333', textDecoration: 'none' }}>About</a>
            </nav>
          </div>
        </header>
        <main>
          <Routes>
            <Route path="/" element={
              <div style={{ padding: '2rem', textAlign: 'center' }}>
                <h1>Welcome to TENNsational</h1>
                <p>East Tennessee's Restaurant Guide</p>
                <p style={{ marginTop: '2rem', color: '#666' }}>
                  We're currently updating our site. Check back soon for our full restaurant directory!
                </p>
              </div>
            } />
            <Route path="/restaurants" element={
              <div style={{ padding: '2rem' }}>
                <h1>Restaurants</h1>
                <p>Our restaurant directory is being updated. Please check back soon!</p>
              </div>
            } />
            <Route path="/about" element={
              <div style={{ padding: '2rem' }}>
                <h1>About TENNsational</h1>
                <p>East Tennessee's most complete restaurant guide.</p>
              </div>
            } />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default SimpleApp;
