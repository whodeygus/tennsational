import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './components/HomePage';
import RestaurantsPage from './components/RestaurantsPage';
import AboutPage from './components/AboutPage';
import PrivacyPolicy from './components/PrivacyPolicy';
import SubmitRestaurant from './components/SubmitRestaurant';
import AdminDashboard from './components/AdminDashboard';
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
            <Route path="/about" element={<AboutPage />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/submit" element={<SubmitRestaurant />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
