import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Menu, X } from 'lucide-react';
import { Input } from './ui/input';
import logoHeader from '../assets/tennsational_logo_new.png';
import '../App.css';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
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
              className="h-12 w-auto"
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
              to="/merch" 
              className="text-gray-900 hover:text-primary transition-colors font-medium"
            >
              Merch
            </Link>
            <Link 
              to="/about" 
              className="text-gray-900 hover:text-primary transition-colors font-medium"
            >
              About Us
            </Link>
          </nav>

          {/* Search */}
          <div className="flex items-center space-x-4">
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search restaurants..."
                className="pl-10 w-64"
              />
            </div>
            
            {/* Mobile menu button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
            <Link
              to="/"
              onClick={closeMobileMenu}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:text-primary hover:bg-gray-50"
            >
              Home
            </Link>
            <Link
              to="/restaurants"
              onClick={closeMobileMenu}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:text-primary hover:bg-gray-50"
            >
              Restaurants
            </Link>
            <Link
              to="/merch"
              onClick={closeMobileMenu}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:text-primary hover:bg-gray-50"
            >
              Merch
            </Link>
            <Link
              to="/about"
              onClick={closeMobileMenu}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:text-primary hover:bg-gray-50"
            >
              About Us
            </Link>
            <Link
              to="/privacy"
              onClick={closeMobileMenu}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:text-primary hover:bg-gray-50"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
