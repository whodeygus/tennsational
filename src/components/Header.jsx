import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="bg-white shadow-sm" style={{ position: 'sticky', top: 0, zIndex: 50, borderBottom: '1px solid #f3f4f6' }}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center" style={{ height: '64px' }}>
          <div className="flex">
            <Link to="/" className="flex items-center" style={{ textDecoration: 'none' }}>
              <span className="text-2xl font-bold text-primary">TENNsational</span>
            </Link>
          </div>
          
          <div className="flex items-center" style={{ gap: '32px' }}>
            <Link to="/" className="text-gray-700 hover:text-primary font-medium transition-colors" style={{ textDecoration: 'none', fontSize: '15px' }}>
              Home
            </Link>
            <Link to="/restaurants" className="text-gray-700 hover:text-primary font-medium transition-colors" style={{ textDecoration: 'none', fontSize: '15px' }}>
              Restaurants
            </Link>
            <Link to="/merch" className="text-gray-700 hover:text-primary font-medium transition-colors" style={{ textDecoration: 'none', fontSize: '15px' }}>
              Merch
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-primary font-medium transition-colors" style={{ textDecoration: 'none', fontSize: '15px' }}>
              About
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;
