import React from 'react';
import logoHero from '../assets/tennsational_logo_new.png';

const MerchPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <img 
            src={logoHero} 
            alt="TENNsational Logo" 
            className="w-64 h-auto mx-auto mb-8 drop-shadow-lg"
          />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Official Merchandise
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Show your East Tennessee pride with official TENNsational gear. T-shirts, hoodies, and more available now.
          </p>
          
          <a 
            href="https://tennsational.printify.me"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-primary hover:bg-primary/90 text-white font-bold text-lg px-12 py-4 rounded-lg transition-colors inline-block shadow-lg"
            style={{ textDecoration: 'none' }}
          >
            Shop TENNsational Merch
          </a>
          
          <p className="text-sm text-gray-500 mt-6">
            All proceeds support local restaurant discovery in East Tennessee
          </p>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="text-4xl mb-3">👕</div>
            <h3 className="font-bold text-gray-900 mb-2">Quality Apparel</h3>
            <p className="text-gray-600 text-sm">Premium t-shirts and hoodies with the TENNsational logo</p>
          </div>
          <div className="text-center p-6">
            <div className="text-4xl mb-3">🎨</div>
            <h3 className="font-bold text-gray-900 mb-2">Unique Designs</h3>
            <p className="text-gray-600 text-sm">Exclusive East Tennessee-inspired merchandise</p>
          </div>
          <div className="text-center p-6">
            <div className="text-4xl mb-3">❤️</div>
            <h3 className="font-bold text-gray-900 mb-2">Support Local</h3>
            <p className="text-gray-600 text-sm">Proceeds help promote local restaurants</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MerchPage;
