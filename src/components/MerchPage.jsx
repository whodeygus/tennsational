import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

const MerchPage = () => {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  // Mock product data based on Printify store analysis
  const mockProducts = [
    {
      id: '22140410',
      name: 'TENNsational Unisex Jersey Tee',
      description: 'Casual T-Shirt, Sports Tees, Men\'s & Women\'s Apparel, Unique Gift for Holidays, Comfortable Wear',
      price: 18.99,
      category: 'apparel',
      image: 'https://images.printify.com/mockup/65f4e5e8b7b5e5001234567/22140410/1234/tennsational-unisex-jersey-tee.jpg',
      colors: ['White', 'Red', 'Blue', 'Green', 'Black'],
      sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL'],
      printifyUrl: 'https://tennsational.printify.me/product/22140410/tennsational-unisex-jersey-tee-casual-t-shirt-sports-tees-mens-and-amp-womens-apparel-unique-gift-for-holidays-comfortable-wear'
    },
    {
      id: '22140411',
      name: 'Tennessee Snapback Trucker Cap',
      description: 'Casual Style for Outdoor Adventures, Gifts for Travelers, Festivals, and Everyday Wear',
      price: 22.99,
      category: 'accessories',
      image: 'https://images.printify.com/mockup/65f4e5e8b7b5e5001234567/22140411/1234/tennessee-snapback-trucker-cap.jpg',
      colors: ['Gray', 'Navy', 'Black'],
      sizes: ['One Size'],
      printifyUrl: 'https://tennsational.printify.me/'
    },
    {
      id: '22140412',
      name: 'TENNsational Unisex Softstyle T-Shirt',
      description: 'Fun, Casual Wear for Tennis Lovers, Gift for Sports Fans, Summer Outfit, Birthday Present',
      price: 16.99,
      category: 'apparel',
      image: 'https://images.printify.com/mockup/65f4e5e8b7b5e5001234567/22140412/1234/tennsational-unisex-softstyle-t-shirt.jpg',
      colors: ['White', 'Gray', 'Navy', 'Orange'],
      sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'],
      printifyUrl: 'https://tennsational.printify.me/'
    },
    {
      id: '22140413',
      name: 'TENNsational Phone Case',
      description: 'Tough Cases - Explore, Taste, Discover, Adventure Accessory, Gift for Travelers',
      price: 22.99,
      category: 'accessories',
      image: 'https://images.printify.com/mockup/65f4e5e8b7b5e5001234567/22140413/1234/tennsational-phone-case.jpg',
      colors: ['Clear', 'Black', 'White'],
      sizes: ['iPhone 12', 'iPhone 13', 'iPhone 14', 'Samsung Galaxy'],
      printifyUrl: 'https://tennsational.printify.me/'
    },
    {
      id: '22140414',
      name: 'TENNsational Stickers',
      description: 'Explore Taste Discover, Travel Decor, Outdoor Gear, Adventure Gifts, Laptop Stickers',
      price: 3.49,
      category: 'accessories',
      image: 'https://images.printify.com/mockup/65f4e5e8b7b5e5001234567/22140414/1234/tennsational-stickers.jpg',
      colors: ['Full Color'],
      sizes: ['3" x 3"'],
      printifyUrl: 'https://tennsational.printify.me/'
    },
    {
      id: '22140415',
      name: 'Tennis Kiss-Cut Stickers',
      description: 'Tennsational Decor, Sports Aesthetic, Cheer on Court, Gift for Tennis Lovers',
      price: 1.99,
      category: 'accessories',
      image: 'https://images.printify.com/mockup/65f4e5e8b7b5e5001234567/22140415/1234/tennis-kiss-cut-stickers.jpg',
      colors: ['Full Color'],
      sizes: ['2" x 2"'],
      printifyUrl: 'https://tennsational.printify.me/'
    },
    {
      id: '22140416',
      name: 'Tennessee Pronunciation Stickers',
      description: 'Fun Wall Decor, Laptop Decals, Gifts for Food Lovers, Travel Souvenirs',
      price: 1.99,
      category: 'accessories',
      image: 'https://images.printify.com/mockup/65f4e5e8b7b5e5001234567/22140416/1234/tennessee-pronunciation-stickers.jpg',
      colors: ['Full Color'],
      sizes: ['3" x 2"'],
      printifyUrl: 'https://tennsational.printify.me/'
    }
  ];

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setProducts(mockProducts);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  const categories = [
    { id: 'all', name: 'All Products', count: products.length },
    { id: 'apparel', name: 'Apparel', count: products.filter(p => p.category === 'apparel').length },
    { id: 'accessories', name: 'Accessories', count: products.filter(p => p.category === 'accessories').length }
  ];

  const handleShopNow = (product) => {
    // Open Printify product page in new tab
    window.open(product.printifyUrl, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading TENNsational merch...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
      {/* Hero Section with Mountain Background */}
      <div 
        className="relative bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('/east_tennessee_mountains.jpg')`
        }}
      >
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="max-w-4xl mx-auto">
            <img 
              src="/tennsational_logo_new.png" 
              alt="TENNsational Logo" 
              className="h-24 mx-auto mb-6 drop-shadow-lg"
            />
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
              TENNsational Merch
            </h1>
            <p className="text-xl md:text-2xl text-white mb-8 drop-shadow-lg">
              Wear Your East Tennessee Pride
            </p>
            <p className="text-lg text-white/90 max-w-2xl mx-auto drop-shadow-lg">
              Show your love for East Tennessee's amazing restaurant scene with our exclusive merchandise. 
              From comfortable tees to fun stickers, represent the TENNsational lifestyle wherever you go!
            </p>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              onClick={() => setSelectedCategory(category.id)}
              className={`${
                selectedCategory === category.id 
                  ? 'bg-orange-600 hover:bg-orange-700 text-white' 
                  : 'border-orange-600 text-orange-600 hover:bg-orange-50'
              }`}
            >
              {category.name} ({category.count})
            </Button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="group hover:shadow-xl transition-all duration-300 bg-white border-orange-200">
              <CardContent className="p-0">
                {/* Product Image */}
                <div className="relative overflow-hidden rounded-t-lg bg-gray-100 aspect-square">
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-100 to-orange-200">
                    <div className="text-center p-4">
                      <div className="text-orange-600 font-bold text-lg mb-2">TENNsational</div>
                      <div className="text-orange-500 text-sm">{product.category === 'apparel' ? '👕' : '📱'}</div>
                    </div>
                  </div>
                  <div className="absolute top-3 right-3">
                    <Badge variant="secondary" className="bg-orange-600 text-white">
                      ${product.price}
                    </Badge>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {product.description}
                  </p>
                  
                  {/* Colors Available */}
                  <div className="mb-3">
                    <p className="text-xs text-gray-500 mb-1">Colors available:</p>
                    <div className="flex flex-wrap gap-1">
                      {product.colors.slice(0, 4).map((color, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {color}
                        </Badge>
                      ))}
                      {product.colors.length > 4 && (
                        <Badge variant="outline" className="text-xs">
                          +{product.colors.length - 4} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Price and Shop Button */}
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-orange-600">
                      ${product.price}
                    </span>
                    <Button 
                      onClick={() => handleShopNow(product)}
                      className="bg-orange-600 hover:bg-orange-700 text-white"
                    >
                      Shop Now
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products found in this category.</p>
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="bg-white border-t border-orange-200">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Quality Guaranteed</h3>
              <p className="text-gray-600">Premium materials and printing for long-lasting wear and vibrant colors.</p>
            </div>
            <div>
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Fast Shipping</h3>
              <p className="text-gray-600">Quick processing and shipping to get your TENNsational gear to you fast.</p>
            </div>
            <div>
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Support Local</h3>
              <p className="text-gray-600">Every purchase supports East Tennessee's amazing restaurant community.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MerchPage;

