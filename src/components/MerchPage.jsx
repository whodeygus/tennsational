import React from 'react';

const MerchPage = () => {
  const products = [
    {
      name: "TENNsational Classic T-Shirt",
      image: "https://images.printify.com/mockup/65a1234567890/123456/1234/classic-tee.jpg", // You'll replace with actual image URLs
      price: "$24.99",
      link: "https://tennsational.printify.me/product/123456/classic-tee" // Replace with actual product links
    },
    {
      name: "TENNsational Hoodie",
      image: "https://images.printify.com/mockup/65a1234567890/123456/1234/hoodie.jpg",
      price: "$44.99",
      link: "https://tennsational.printify.me/product/123456/hoodie"
    },
    // Add more products here - just copy the block above and change the details
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b" style={{ borderColor: '#f3f4f6' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            TENNsational Merchandise
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Show your East Tennessee pride with official TENNsational gear. All proceeds support local restaurant discovery.
          </p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border" style={{ borderColor: '#e5e7eb' }}>
              <div style={{ aspectRatio: '1/1', overflow: 'hidden', borderRadius: '0.5rem 0.5rem 0 0', backgroundColor: '#f9fafb' }}>
                <img 
                  src={product.image} 
                  alt={product.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{product.name}</h3>
                <p className="text-2xl font-bold text-primary mb-4">{product.price}</p>
                <a 
                  href={product.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-primary hover:bg-primary/90 text-white font-medium px-6 py-3 rounded-md transition-colors"
                  style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}
                >
                  Shop Now
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Browse All Link */}
        <div className="text-center mt-12">
          <a 
            href="https://tennsational.printify.me"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline font-medium text-lg"
          >
            Browse All Products →
          </a>
        </div>
      </div>
    </div>
  );
};

export default MerchPage;
