import { useState, useMemo, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Star, MapPin, Phone, Globe, Clock, DollarSign } from 'lucide-react';
import { StarDisplay } from './ui/star-rating';
import mountainBackground from '../assets/east_tennessee_mountains.jpg';
import allRestaurantsData from '../data/allRestaurants.json';
import '../App.css';

export default function RestaurantsPage() {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCounty, setSelectedCounty] = useState('All Counties');
  const [selectedCuisine, setSelectedCuisine] = useState('All Cuisines');
  
  // State for combined restaurant data
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch and combine restaurants from both sources
  useEffect(() => {
    const fetchAllRestaurants = async () => {
      try {
        setLoading(true);
        console.log('Starting to fetch restaurants...');
        
        // Start with hardcoded restaurants from JSON file
        const hardcodedRestaurants = allRestaurantsData.restaurants;
        console.log('Loaded hardcoded restaurants:', hardcodedRestaurants.length);
        
        // Fetch user-submitted approved restaurants from database
        let databaseRestaurants = [];
        try {
          console.log('Fetching database restaurants...');
          const response = await fetch('/api/restaurants/approved');
          if (response.ok) {
            databaseRestaurants = await response.json();
            console.log('Database restaurants loaded:', databaseRestaurants.length);
            
            // Mark database restaurants as "new" for display
            databaseRestaurants = databaseRestaurants.map(restaurant => ({
              ...restaurant,
              isUserSubmitted: true
            }));
          } else {
            console.warn('Failed to fetch database restaurants, using hardcoded only');
          }
        } catch (dbError) {
          console.warn('Database fetch error, using hardcoded restaurants only:', dbError);
        }
        
        // Combine both sources
        const allRestaurants = [...hardcodedRestaurants, ...databaseRestaurants];
        console.log('Total restaurants combined:', allRestaurants.length);
        
        setRestaurants(allRestaurants);
        setError(null);
      } catch (error) {
        console.error('Error fetching restaurants:', error);
        setError('Failed to load restaurant data');
        // Fallback to just hardcoded restaurants if available
        try {
          setRestaurants(allRestaurantsData.restaurants);
        } catch (fallbackError) {
          setRestaurants([]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAllRestaurants();
  }, []);

  // Get unique counties and cuisines from combined data
  const counties = useMemo(() => {
    const allCounties = [...new Set(restaurants.map(r => r.county))];
    return allCounties.sort();
  }, [restaurants]);

  const cuisines = useMemo(() => {
    const allCuisines = [...new Set(restaurants.map(r => r.cuisine))];
    return allCuisines.sort();
  }, [restaurants]);

  // Filter restaurants based on search and filters
  const filteredRestaurants = useMemo(() => {
    return restaurants.filter(restaurant => {
      const matchesSearch = searchTerm === '' || 
        restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        restaurant.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        restaurant.cuisine.toLowerCase().includes(searchTerm.toLowerCase()) ||
        restaurant.description?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCounty = selectedCounty === 'All Counties' || restaurant.county === selectedCounty;
      const matchesCuisine = selectedCuisine === 'All Cuisines' || restaurant.cuisine === selectedCuisine;
      
      return matchesSearch && matchesCounty && matchesCuisine;
    });
  }, [restaurants, searchTerm, selectedCounty, selectedCuisine]);

  const featuredRestaurants = useMemo(() => {
    return filteredRestaurants.filter(restaurant => restaurant.featured);
  }, [filteredRestaurants]);

  const regularRestaurants = useMemo(() => {
    return filteredRestaurants.filter(restaurant => !restaurant.featured);
  }, [filteredRestaurants]);

  // Handle clearing search results from URL state
  useEffect(() => {
    if (location.state?.clearSearch) {
      setSearchTerm('');
      setSelectedCounty('All Counties');
      setSelectedCuisine('All Cuisines');
    }
  }, [location.state]);

  const formatPhoneNumber = (phone) => {
    if (!phone) return null;
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    return phone;
  };

  const formatPriceRange = (priceRange) => {
    const dollarCount = priceRange?.length || 1;
    return '$'.repeat(Math.min(dollarCount, 4));
  };

  const RestaurantCard = ({ restaurant }) => (
    <Card className="h-full hover:shadow-lg transition-shadow duration-200 group">
      <CardContent className="p-4 h-full flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg group-hover:text-blue-600 transition-colors line-clamp-2">
            {restaurant.name}
          </h3>
          {restaurant.isUserSubmitted && (
            <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full ml-2 flex-shrink-0">
              New!
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
          <MapPin className="w-4 h-4 flex-shrink-0" />
          <span className="line-clamp-1">{restaurant.city}, {restaurant.county}</span>
        </div>
        
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
            {restaurant.cuisine}
          </span>
          <div className="flex items-center gap-1">
            <DollarSign className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-600">
              {formatPriceRange(restaurant.price_range)}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 mb-3">
          <StarDisplay rating={restaurant.rating} size="sm" />
          <span className="text-sm text-gray-600">
            {restaurant.rating} ({restaurant.review_count} reviews)
          </span>
        </div>
        
        <p className="text-sm text-gray-700 mb-4 line-clamp-3 flex-grow">
          {restaurant.description}
        </p>
        
        <div className="space-y-2 text-sm text-gray-600">
          {restaurant.address && (
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span className="line-clamp-2">{restaurant.address}</span>
            </div>
          )}
          
          {restaurant.phone && (
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 flex-shrink-0" />
              <a href={`tel:${restaurant.phone}`} className="hover:text-blue-600 transition-colors">
                {formatPhoneNumber(restaurant.phone)}
              </a>
            </div>
          )}
          
          {restaurant.website && (
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 flex-shrink-0" />
              <a 
                href={restaurant.website.startsWith('http') ? restaurant.website : `https://${restaurant.website}`}
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-blue-600 transition-colors line-clamp-1"
              >
                {restaurant.website}
              </a>
            </div>
          )}
          
          {restaurant.hours && (
            <div className="flex items-start gap-2">
              <Clock className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span className="line-clamp-2">{restaurant.hours}</span>
            </div>
          )}
        </div>
        
        {/* FIXED: Replaced broken buttons with working Call/Website buttons */}
        <div className="flex gap-2 mt-4 pt-4 border-t">
          {restaurant.phone && (
            <a 
              href={`tel:${restaurant.phone}`} 
              className="flex-1"
            >
              <Button variant="outline" size="sm" className="w-full">
                <Phone className="w-4 h-4 mr-1" />
                Call
              </Button>
            </a>
          )}
          {restaurant.website && (
            <a 
              href={restaurant.website.startsWith('http') ? restaurant.website : `https://${restaurant.website}`}
              target="_blank" 
              rel="noopener noreferrer"
              className="flex-1"
            >
              <Button variant="outline" size="sm" className="w-full">
                <Globe className="w-4 h-4 mr-1" />
                Website
              </Button>
            </a>
          )}
          {!restaurant.phone && !restaurant.website && (
            <div className="flex-1 text-center text-sm text-gray-500 py-2">
              Contact info not available
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div 
          className="relative h-64 bg-cover bg-center"
          style={{ backgroundImage: `url(${mountainBackground})` }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          <div className="relative z-10 flex flex-col justify-center items-center h-full text-white">
            <h1 className="text-4xl font-bold mb-4">East Tennessee Restaurants</h1>
            <p className="text-xl text-center max-w-2xl">Loading restaurant data...</p>
          </div>
        </div>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading restaurants...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <div 
          className="relative h-64 bg-cover bg-center"
          style={{ backgroundImage: `url(${mountainBackground})` }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          <div className="relative z-10 flex flex-col justify-center items-center h-full text-white">
            <h1 className="text-4xl font-bold mb-4">East Tennessee Restaurants</h1>
            <p className="text-xl text-center max-w-2xl">Error loading restaurant data</p>
          </div>
        </div>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-red-600">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div 
        className="relative h-64 bg-cover bg-center"
        style={{ backgroundImage: `url(${mountainBackground})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="relative z-10 flex flex-col justify-center items-center h-full text-white">
          <h1 className="text-4xl font-bold mb-4">East Tennessee Restaurants</h1>
          <p className="text-xl text-center max-w-2xl">
            Discover the best dining experiences in the heart of the Smoky Mountains
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search restaurants by name, city, cuisine, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex gap-2">
              <Select value={selectedCounty} onValueChange={setSelectedCounty}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Counties">All Counties</SelectItem>
                  {counties.map(county => (
                    <SelectItem key={county} value={county}>{county}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={selectedCuisine} onValueChange={setSelectedCuisine}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Cuisines">All Cuisines</SelectItem>
                  {cuisines.map(cuisine => (
                    <SelectItem key={cuisine} value={cuisine}>{cuisine}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="text-sm text-gray-600">
            Showing {filteredRestaurants.length} restaurants
          </div>
        </div>

        {/* Featured Restaurants */}
        {featuredRestaurants.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Star className="w-6 h-6 text-yellow-500" />
              Featured Restaurants
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredRestaurants.map((restaurant) => (
                <RestaurantCard key={`featured-${restaurant.id}`} restaurant={restaurant} />
              ))}
            </div>
          </div>
        )}

        {/* All Restaurants */}
        <div>
          <h2 className="text-2xl font-bold mb-6">All Restaurants</h2>
          {regularRestaurants.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularRestaurants.map((restaurant) => (
                <RestaurantCard key={`regular-${restaurant.id}`} restaurant={restaurant} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">No restaurants found matching your criteria.</p>
              <Button 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCounty('All Counties');
                  setSelectedCuisine('All Cuisines');
                }}
                className="mt-4"
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
