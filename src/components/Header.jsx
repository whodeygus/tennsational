import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100" style={{ position: 'sticky', top: 0, zIndex: 50 }}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-primary" style={{ letterSpacing: '-0.5px' }}>TENNsational</span>
            </Link>
          </div>
          
          {/* Navigation Links */}
          <div className="flex items-center space-x-8">
            <Link 
              to="/" 
              className="text-gray-700 hover:text-primary font-medium transition-colors"
              style={{ textDecoration: 'none', fontSize: '15px' }}
            >
              Home
            </Link>
            <Link 
              to="/restaurants" 
              className="text-gray-700 hover:text-primary font-medium transition-colors"
              style={{ textDecoration: 'none', fontSize: '15px' }}
            >
              Restaurants
            </Link>
            <Link 
              to="/merch" 
              className="text-gray-700 hover:text-primary font-medium transition-colors"
              style={{ textDecoration: 'none', fontSize: '15px' }}
            >
              Merch
            </Link>
            <Link 
              to="/about" 
              className="text-gray-700 hover:text-primary font-medium transition-colors"
              style={{ textDecoration: 'none', fontSize: '15px' }}
            >
              About
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;
