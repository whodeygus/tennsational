import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm" style={{ position: 'sticky', top: 0, zIndex: 50, borderBottom: '1px solid #f3f4f6' }}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center" style={{ height: '64px' }}>
          <div className="flex">
            <Link to="/" className="flex items-center" style={{ textDecoration: 'none' }}>
              <span className="text-2xl font-bold text-primary">TENNsational</span>
            </Link>
          </div>
          
          {/* Desktop Navigation - Hidden on mobile */}
          <div style={{ display: 'none' }} className="desktop-nav">
            <Link to="/" className="text-gray-700 hover:text-primary font-medium transition-colors" style={{ textDecoration: 'none', fontSize: '15px', marginLeft: '32px' }}>
              Home
            </Link>
            <Link to="/restaurants" className="text-gray-700 hover:text-primary font-medium transition-colors" style={{ textDecoration: 'none', fontSize: '15px', marginLeft: '32px' }}>
              Restaurants
            </Link>
            <Link to="/merch" className="text-gray-700 hover:text-primary font-medium transition-colors" style={{ textDecoration: 'none', fontSize: '15px', marginLeft: '32px' }}>
              Merch
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-primary font-medium transition-colors" style={{ textDecoration: 'none', fontSize: '15px', marginLeft: '32px' }}>
              About
            </Link>
          </div>

          {/* Mobile Menu Button - Hidden on desktop */}
          <button 
            className="mobile-menu-btn"
            style={{ display: 'block' }}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <svg style={{ width: '24px', height: '24px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {menuOpen && (
          <div style={{ paddingTop: '16px', paddingBottom: '16px', borderTop: '1px solid #f3f4f6' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <Link to="/" className="text-gray-700 hover:text-primary font-medium transition-colors" style={{ textDecoration: 'none' }} onClick={() => setMenuOpen(false)}>
                Home
              </Link>
              <Link to="/restaurants" className="text-gray-700 hover:text-primary font-medium transition-colors" style={{ textDecoration: 'none' }} onClick={() => setMenuOpen(false)}>
                Restaurants
              </Link>
              <Link to="/merch" className="text-gray-700 hover:text-primary font-medium transition-colors" style={{ textDecoration: 'none' }} onClick={() => setMenuOpen(false)}>
                Merch
              </Link>
              <Link to="/about" className="text-gray-700 hover:text-primary font-medium transition-colors" style={{ textDecoration: 'none' }} onClick={() => setMenuOpen(false)}>
                About
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

export default Header;
