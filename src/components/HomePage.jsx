import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';
import { Star, MapPin, Users, Award } from 'lucide-react';
import logoHero from '../assets/tennsational_logo_new.png';
import mountainBackground from '../assets/east_tennessee_mountains.jpg';
import { getRestaurantStats } from '../data/restaurants';
import ReviewModal from './ReviewModal';
import '../App.css';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [newsletterData, setNewsletterData] = useState({
    firstName: '',
    lastName: '',
    email: ''
  });
  
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
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleNewsletterSubmit = () => {
    if (!newsletterData.firstName || !newsletterData.lastName || !newsletterData.email) {
      alert('Please fill in all fields to subscribe to our newsletter.');
      return;
    }

    // Store newsletter subscription in localStorage
    const existingSubscriptions = JSON.parse(localStorage.getItem('newsletterSubscriptions') || '[]');
    const newSubscription = {
      ...newsletterData,
      subscribedAt: new Date().toISOString(),
      id: Date.now()
    };
    
    existingSubscriptions.push(newSubscription);
    localStorage.setItem('newsletterSubscriptions', JSON.stringify(existingSubscriptions));
    
    alert('Thank you for subscribing! You\'ll receive our weekly restaurant updates and exclusive deals.');
    
    // Reset form
    setNewsletterData({
      firstName: '',
      lastName: '',
      email: ''
    });
  };

  const handleNewsletterChange = (field, value) => {
    setNewsletterData(prev => ({
      ...prev,
      [field]: value
    }));
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
                Your trusted guide to authentic local flavors and hidden gems across Tennessee. 
                Find the perfect restaurant for every occasion in 6 counties.
              </p>
            </div>
            
            <div className="lg:w-1/2 lg:pl-12">
              <Card className="bg-white/20 backdrop-blur-md border-white/30 shadow-2xl">
                <CardContent className="p-6">
                  <h3 className="text-2xl font-bold mb-4 text-white drop-shadow-lg">Find Your Perfect Restaurant</h3>
                  <div className="space-y-4">
                    <Input
                      type="text"
                      placeholder="Search restaurants, cuisine, location..."
                      className="bg-white/20 border-white/30 text-white placeholder:text-white/70"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={handleKeyPress}
                    />
                    <Button 
                      className="w-full bg-primary hover:bg-primary/90"
                      onClick={handleSearch}
                    >
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
                <CardContent className="p-6">
                  <div className="text-3xl font-bold text-primary mb-2">{stats.totalRestaurants}+</div>
                  <div className="text-gray-600">Restaurants</div>
                </CardContent>
              </Card>
            </div>
            
            <div className="text-center">
              <Card className="border-primary/20 hover:border-primary/40 transition-colors">
                <CardContent className="p-6">
                  <div className="text-3xl font-bold text-primary mb-2">{stats.totalReviews.toLocaleString()}+</div>
                  <div className="text-gray-600">Reviews</div>
                </CardContent>
              </Card>
            </div>
            
            <div className="text-center">
              <Card className="border-primary/20 hover:border-primary/40 transition-colors">
                <CardContent className="p-6">
                  <div className="text-3xl font-bold text-primary mb-2">{stats.totalCounties}</div>
                  <div className="text-gray-600">Counties</div>
                </CardContent>
              </Card>
            </div>
            
            <div className="text-center">
              <Card className="border-primary/20 hover:border-primary/40 transition-colors">
                <CardContent className="p-6">
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
              />
              <Input
                type="text"
                placeholder="Last Name"
                className="flex-1"
                value={newsletterData.lastName}
                onChange={(e) => handleNewsletterChange('lastName', e.target.value)}
              />
            </div>
            <Input
              type="email"
              placeholder="Email Address"
              className="w-full"
              value={newsletterData.email}
              onChange={(e) => handleNewsletterChange('email', e.target.value)}
            />
            <Button 
              className="w-full tennsational-orange"
              onClick={handleNewsletterSubmit}
            >
              Subscribe to Newsletter
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

      {/* Featured Restaurants Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Restaurants</h2>
            <p className="text-xl text-gray-600">
              Discover the top-rated dining experiences across Tennessee, handpicked by our community of local food enthusiasts.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Find What Makes Tennessee TENNsational</h2>
          <p className="text-xl mb-8 opacity-90">
            Share your dining experiences and help others discover amazing restaurants across Tennessee. 
            Your reviews make a difference!
          </p>
          <Button 
            size="lg" 
            className="bg-white text-primary hover:bg-gray-100"
            onClick={() => setIsReviewModalOpen(true)}
          >
            <Users className="w-5 h-5 mr-2" />
            Write Your First Review
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-gray-300">
                © 2025 TENNsational.com. All rights reserved.
              </p>
            </div>
            <div className="flex space-x-6">
              <Link 
                to="/privacy" 
                className="text-gray-300 hover:text-white transition-colors"
              >
                Privacy Policy
              </Link>
              <a 
                href="mailto:Admin@tennsational.com" 
                className="text-gray-300 hover:text-white transition-colors"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Review Modal */}
      <ReviewModal 
        isOpen={isReviewModalOpen} 
        onClose={() => setIsReviewModalOpen(false)} 
      />
    </div>
  );
}

