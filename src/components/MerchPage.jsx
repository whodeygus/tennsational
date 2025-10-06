import React from 'react';

const MerchPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          TENNsational Merchandise
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Show your East Tennessee pride with official TENNsational gear. T-shirts, hoodies, and more available now.
        </p>
        
        <a 
          href="https://tennsational.printify.me"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-primary hover:bg-primary/90 text-white font-bold text-lg px-12 py-4 rounded-lg transition-colors inline-block"
          style={{ textDecoration: 'none' }}
        >
          Visit Our Store
        </a>
        
        <p className="text-sm text-gray-500 mt-6">
          All proceeds support local restaurant discovery in East Tennessee
        </p>
      </div>
    </div>
  );
};

export default MerchPage;
