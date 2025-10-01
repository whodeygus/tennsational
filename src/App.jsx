import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header.jsx';
import HomePage from './components/HomePage.jsx';
import RestaurantsPage from './components/RestaurantsPage.jsx';
import AboutPage from './components/AboutPage.jsx';
import PrivacyPolicy from './components/PrivacyPolicy.jsx';
import MerchPage from './components/MerchPage.jsx'; // This line was commented out, now active
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/restaurants" element={<RestaurantsPage />} />
            <Route path="/merch" element={<MerchPage />} /> {/* This route was commented out, now active */}
            <Route path="/about" element={<AboutPage />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
