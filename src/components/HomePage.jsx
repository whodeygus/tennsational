import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, MapPin, Users, Award } from 'lucide-react';
import logoHero from '../assets/tennsational_logo_new.png';
import mountainBackground from '../assets/east_tennessee_mountains.jpg';
import { getRestaurantStats } from '../data/restaurants';
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
          alert(result.error || 'Failed to subscribe. Please try again.');
        }
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      alert('There was an error subscribing to the newsletter. Please try again.');
    } finally {
      setIsSubmittingNewsletter(false);
    }
  };

  const handleNewsletterChange = (field, value) => {
    setNewsletterData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section
        className="relative text-white py-20 min-h-[600px] flex items-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${mountainBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <div className="lg:w-1/2 mb-10 lg:mb-0 text-center">
              <img
                src={logoHero}
                alt="TENNsational - Explore. Taste. Discover."
                className="w-96 h-auto mb-6 mx-auto drop-shadow-2xl"
              />
              <p className="text-xl mb-8 text-white drop-shadow-lg">
                East Tennessee Owned & Operated. The most comprehensive local restaurant directory,
                connecting locals and visitors with the region&apos;s best dining experiences. From
                hidden gems to popular favorites, we provide trusted reviews and insider recommendations
                to help you discover your next great meal. Supporting local restaurants and food lovers
                across East Tennessee.
              </p>
            </div>

            <div className="lg:w-1/2 lg:pl-12 w-full">
              <Card className="bg-white/20 backdrop-blur-md border-white/30 shadow-2xl">
                <CardContent>
                  <h3 className="text-2xl font-bold mb-4 text-white drop-shadow-lg">
                    Find Your Perfect Restaurant
                  </h3>
                  <div className="space-y-4">
                    <Input
                      type="text"
                      placeholder="Search restaurants, cuisine, location..."
                      className="w-full bg-white/20 border-white/30 text-white placeholder:text-white/70"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={handleKeyPress}
                    />
                    <Button className="w-full bg-primary hover:bg-primary/90" onClick={handleSearch}>
                      <MapPin className="w-4 h-4 mr-2" />
                      Explore Restaurants
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <Card className="border-primary/20 hover:border-primary/40 transition-colors">
                <CardContent>
                  <div className="text-3xl font-bold text-primary mb-2">{stats.totalRestaurants}+</div>
                  <div className="text-gray-600">Restaurants</div>
                </CardContent>
              </Card>
            </div>

            <div className="text-center">
              <Card className="border-primary/20 hover:border-primary/40 transition-colors">
                <CardContent>
                  <div className="text-3xl font-bold text-primary mb-2">{stats.totalReviews.toLocaleString()}+</div>
                  <div className="text-gray-600">Reviews</div>
                </CardContent>
              </Card>
            </div>

            <div className="text-center">
              <Card className="border-primary/20 hover:border-primary/40 transition-colors">
                <CardContent>
                  <div className="text-3xl font-bold text-primary mb-2">{stats.totalCounties}</div>
                  <div className="text-gray-600">Counties</div>
                </CardContent>
              </Card>
            </div>

            <div className="text-center">
              <Card className="border-primary/20 hover:border-primary/40 transition-colors">
                <CardContent>
                  <div className="text-3xl font-bold text-primary mb-2 flex items-center justify-center">
                    {stats.avgRating}
                    <Star className="w-6 h-6 ml-1 fill-current" />
                  </div>
                  <div className="text-gray-600">Avg Rating</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Stay Updated with TENNsational</h2>
          <p className="text-xl text-gray-600 mb-8">
            Get weekly featured restaurants, new reviews, and exclusive dining deals delivered to your inbox.
          </p>

          <div className="max-w-md mx-auto space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <Input
                type="text"
                placeholder="First Name"
                className="flex-1"
                value={newsletterData.firstName}
                onChange={(e) => handleNewsletterChange('firstName', e.target.value)}
                disabled={isSubmittingNewsletter}
              />
              <Input
                type="text"
                placeholder="Last Name"
                className="flex-1"
                value={newsletterData.lastName}
                onChange={(e) => handleNewsletterChange('lastName', e.target.value)}
                disabled={isSubmittingNewsletter}
              />
            </div>
            <Input
              type="email"
              placeholder="Email Address"
              className="w-full"
              value={newsletterData.email}
              onChange={(e) => handleNewsletterChange('email', e.target.value)}
              disabled={isSubmittingNewsletter}
            />
            <Button
              className="w-full tennsational-orange"
              onClick={handleNewsletterSubmit}
              disabled={isSubmittingNewsletter}
            >
              {isSubmittingNewsletter ? 'Subscribing...' : 'Subscribe to Newsletter'}
            </Button>
          </div>

          <p className="text-sm text-gray-500 mt-4">
            We respect your privacy. Unsubscribe at any time.
            <Link to="/privacy" className="text-primary hover:underline ml-1">
              Privacy Policy
            </Link>
          </p>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Join the TENNsational Community</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Whether you&apos;re a restaurant owner looking to reach more diners or a food lover eager to discover new places,
              TENNsational is your gateway to East Tennessee&apos;s incredible dining scene.
            </p>
          </div>

        
        </div>
      </section>

   {/* Footer */}
      <footer className="bg-gray-900 text-white py-12" style={{ borderTop: '1px solid #374151' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            
            <div>
              <h3 className="text-xl font-bold text-primary mb-3">TENNsational</h3>
              <p className="text-gray-400 text-sm" style={{ lineHeight: '1.6' }}>
                East Tennessee&apos;s premier restaurant directory. Discover, explore, and taste the best local dining experiences.
              </p>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-300 uppercase mb-3" style={{ letterSpacing: '0.05em' }}>Quick Links</h4>
              <div className="space-y-2">
                <div><Link to="/restaurants" className="text-sm">Browse Restaurants</Link></div>
                <div><Link to="/about" className="text-sm">About Us</Link></div>
                <div><Link to="/privacy" className="text-sm">Privacy Policy</Link></div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-300 uppercase mb-3" style={{ letterSpacing: '0.05em' }}>Connect With Us</h4>
              <div className="space-y-3">
                <div><a href="mailto:Admin@tennsational.com" className="text-sm">Admin@tennsational.com</a></div>
                <div className="flex space-x-4 pt-2">
                  <a href="https://www.facebook.com/profile.php?id=61579002906078" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" />
                    </svg>
                  </a>
                  <a href="https://www.instagram.com/tennsational/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      <path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153.509.5.902 1.105 1.153 1.772.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 01-1.153 1.772c-.5.508-1.105.902-1.772 1.153-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 01-1.772-1.153 4.904 4.904 0 01-1.153-1.772c-.247-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.218-1.79.465-2.428.254-.66.598-1.216 1.153-1.772.5-.509 1.105-.902 1.772-1.153.637-.247 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 1.802c-2.67 0-2.986.01-4.04.059-.976.045-1.505.207-1.858.344-.466.181-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.055-.059 1.37-.059 4.04 0 2.67.01 2.986.059 4.04.045.976.207 1.505.344 1.858.181.466.398.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.047 1.37.059 4.04.059 2.67 0 2.987-.01 4.04-.059.976-.045 1.505-.207 1.858-.344.466-.181.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.047-1.055.059-1.37.059-4.04 0-2.67-.01-2.986-.059-4.04-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.055-.047-1.37-.059-4.04-.059zm0 3.063A5.135 5.135 0 1 1 12 17.135 5.135 5.135 0 0 1 12 6.865zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm5.338-7.862a1.2 1.2 0 1 0 0-2.4 1.2 1.2 0 0 0 0 2.4z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 mt-8 text-center" style={{ borderTop: '1px solid #374151' }}>
            <p className="text-gray-400 text-sm">© 2025 TENNsational.com. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
