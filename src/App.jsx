import { HashRouter as Router, Routes, Route } from 'react-router-dom';
// Temporarily removed header import
import HomePage from './components/HomePage.jsx';
import RestaurantsPage from './components/RestaurantsPage.jsx';
import AboutPage from './components/AboutPage.jsx';
import PrivacyPolicy from './components/PrivacyPolicy.jsx';
import MerchPage from './components/MerchPage.jsx';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        {/* Temporary inline header */}
        <header className="bg-white shadow-sm">
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <a href="/" className="flex items-center">
                  <span className="text-2xl font-bold text-orange-600">TENNsational</span>
                </a>
              </div>
              <div className="flex items-center space-x-4">
                <a href="/#/" className="text-gray-700 hover:text-orange-600">Home</a>
                <a href="/#/restaurants" className="text-gray-700 hover:text-orange-600">Restaurants</a>
                <a href="/#/merch" className="text-gray-700 hover:text-orange-600">Merch</a>
                <a href="/#/about" className="text-gray-700 hover:text-orange-600">About</a>
              </div>
            </div>
          </nav>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/restaurants" element={<RestaurantsPage />} />
            <Route path="/merch" element={<MerchPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
