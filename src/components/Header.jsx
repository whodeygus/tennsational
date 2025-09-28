import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="bg-white shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-orange-600">TENNsational</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-gray-700 hover:text-orange-600">Home</Link>
            <Link to="/restaurants" className="text-gray-700 hover:text-orange-600">Restaurants</Link>
            <Link to="/merch" className="text-gray-700 hover:text-orange-600">Merch</Link>
            <Link to="/about" className="text-gray-700 hover:text-orange-600">About</Link>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;
