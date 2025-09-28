import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, MapPin, Users, Award } from 'lucide-react';
import logoHero from '../assets/tennsational_logo_new.png';
import mountainBackground from '../assets/east_tennessee_mountains.jpg';
import { getRestaurantStats } from '../data/restaurants';
import ReviewModal from './ReviewModal';
import '../App.css';

/** ---- Minimal inline UI helpers so we don't rely on ./ui/* files ---- */
const Card = ({ children, className = '', ...props }) => (
  <div className={`rounded-lg border bg-white shadow-sm ${className}`} {...props}>
    {children}
  </div>
);

const CardContent = ({ children, className = '', ...props }) => (
  <div className={`p-6 ${className}`} {...props}>
    {children}
  </div>
);

const Input = ({ className = '', ...props }) => (
  <input
    className={`border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${className}`}
    {...props}
  />
);

const Button = ({ children, className = '', variant = 'primary', ...props }) => {
  const variants = {
    primary: 'bg-indigo-600 hover:bg-indigo-700 text-white',
    outline: 'border border-gray-300 hover:bg-gray-50 text-gray-900',
    ghost: 'hover:bg-gray-100 text-gray-900',
  };
  return (
    <button
      className={`inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors ${variants[variant] || variants.primary} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
/** -------------------------------------------------------------------- */

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [newsletterData, setNewsletterData] = useState({
    firstName: '',
    lastName: '',
    email: ''
  });
  const [isSubmittingNewsletter, setIsSubmittingNewsletter] = useState(false);

  const navigate = useNavigate();
  const stats = getRestaurantStats();

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/restaurants?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/restaurants');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  const handleNewsletterSubmit = async () => {
    if (!newsletterData.firstName || !newsletterData.lastName || !newsletterData.email) {
      alert('Please fill in all fields to subscribe to our newsletter.');
      return;
    }

    setIsSubmittingNewsletter(true);

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newsletterData),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Thank you for subscribing! You'll receive our weekly restaurant updates and exclusive deals.");
        setNewsletterData({ firstName: '', lastName: '', email: '' });
      } else {
        if (response.status === 409) {
          alert('This email is already subscribed to our newsletter.');
        } else {
          alert(result.error || 'Failed to subscribe
