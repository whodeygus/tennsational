import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import ReviewModal from './ReviewModal';
import logoHeader from '../assets/tennsational_logo_header.png';
import '../App.css';

export default function Header() {
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const handleWriteReview = () => {
    setIsReviewModalOpen(true);
  };

  const handleCloseReviewModal = () => {
    setIsReviewModalOpen(false);
  };
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img 
              src={logoHeader} 
              alt="TENNsational - Explore. Taste. Discover." 
              className="h-10 w-auto"
            />
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className="text-gray-900 hover:text-primary transition-colors font-medium"
            >
              Home
            </Link>
            <Link 
              to="/restaurants" 
              className="text-gray-900 hover:text-primary transition-colors font-medium"
            >
              Restaurants
            </Link>
            <Link 
              to="/about" 
              className="text-gray-900 hover:text-primary transition-colors font-medium"
            >
              About Us
            </Link>
          </nav>

          {/* Search and CTA */}
          <div className="flex items-center space-x-4">
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search restaurants..."
                className="pl-10 w-64"
              />
            </div>
            <Button 
              onClick={handleWriteReview}
              className="tennsational-orange"
            >
              Write Review
            </Button>
          </div>
        </div>
      </div>

      {/* Review Modal */}
      <ReviewModal 
        isOpen={isReviewModalOpen} 
        onClose={handleCloseReviewModal}
      />
    </header>
  );
}

