import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header.jsx';
import HomePage from './components/HomePage.jsx';
import RestaurantsPage from './components/RestaurantsPage.jsx';
import AboutPage from './components/AboutPage.jsx';
import PrivacyPolicy from './components/PrivacyPolicy.jsx';
// Removed MerchPage import
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
            {/* Removed merch route */}
            <Route path="/about" element={<AboutPage />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
