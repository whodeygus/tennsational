import { useState, useMemo, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Star, MapPin, Phone, Globe, Clock, DollarSign, Plus, MessageSquare } from 'lucide-react';
import { StarDisplay } from './ui/star-rating';
import { ReviewModal } from './ReviewModal';
import mountainBackground from '../assets/east_tennessee_mountains.jpg';
import allRestaurantsData from '../data/allrestaurants.json';
import '../App.css';

export default function RestaurantsPage() {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCounty, setSelectedCounty] = useState('All Counties');
  const [selectedCuisine, setSelectedCuisine] = useState('All Cuisines');
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  
  // State for combined restaurant data
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // NEW: Fetch and combine restaurants from both sources
  useEffect(() => {
    const fetchAllRestaurants = async () => {
      try {
        setLoading(true);
        
        // Start with hardcoded restaurants from JSON file
        const hardcodedRestaurants = allRestaurantsData.restaurants;
        
        // Fetch user-submitted approved restaurants from database
        let databaseRestaurants = [];
        try {
          const response = await fetch('/api/restaurants/approved');
          if (response.ok) {
            databaseRestaurants = await response.json();
          } else {
            console.log('No approved restaurants from database yet');
          }
        } catch (dbError) {
          console.log('Could not fetch database restaurants:', dbError);
          // Continue with just hardcoded restaurants if database fails
        }

        // Convert database restaurants to match hardcoded format
        const formattedDatabaseRestaurants = databaseRestaurants.map(restaurant => ({
          id: `db-${restaurant.id}`, // Prefix with 'db-' to avoid ID conflicts
          name: restaurant.name,
          county: restaurant.county,
          city: restaurant.city,
          cuisine: restaurant.cuisine,
          price_range: restaurant.price_range || '$$',
          rating: restaurant.rating || 0,
          review_count: restaurant.reviews || 0,
          address: restaurant.address,
          phone: restaurant.phone || '',
          website: restaurant.website || '',
          hours: restaurant.hours || 'Hours not specified',
          amenities: restaurant.amenities || [],
          featured: false, // User-submitted restaurants are not featured by default
          description: restaurant.description || 'Great local restaurant',
          isUserSubmitted: true // Flag to identify user-submitted restaurants
        }));

        // Combine both arrays - hardcoded first, then database restaurants
        const combinedRestaurants = [
          ...hardcodedRestaurants.map(r => ({ ...r, isUserSubmitted: false })),
          ...formattedDatabaseRestaurants
        ];

        console.log(`Loaded ${hardcodedRestaurants.length} hardcoded restaurants`);
        console.log(`Loaded ${databaseRestaurants.length} user-submitted restaurants`);
        console.log(`Total: ${combinedRestaurants.length} restaurants`);

        setRestaurants(combinedRestaurants);
        setError(null);
      } catch (error) {
        console.error('Error loading restaurants:', error);
        setError('Failed to load restaurants');
      } finally {
        setLoading(false);
      }
    };

    fetchAllRestaurants();
  }, []);

  // Handle URL search parameter
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchParam = urlParams.get('search');
    if (searchParam) {
      setSearchTerm(searchParam);
    }
  }, [location.search]);

  // Dynamic helper functions
  const getUniqueCounties = () => {
    const counties = [...new Set(restaurants.map(r => r.county))];
    return counties.sort();
  };

  const getUniqueCuisines = () => {
    const cuisines = [...new Set(restaurants.map(r => r.cuisine))];
    return cuisines.sort();
  };

  const counties = getUniqueCounties();
  const cuisines = getUniqueCuisines();

  const filteredRestaurants = useMemo(() => {
    return restaurants.filter(restaurant => {
      const matchesSearch = searchTerm === '' || 
        restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        restaurant.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        restaurant.cuisine.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (restaurant.description && restaurant.description.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCounty = selectedCounty === 'All Counties' || restaurant.county === selectedCounty;
      const matchesCuisine = selectedCuisine === 'All Cuisines' || restaurant.cuisine === selectedCuisine;
      
      return matchesSearch && matchesCounty && matchesCuisine;
    });
  }, [restaurants, searchTerm, selectedCounty, selectedCuisine]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCounty('All Counties');
    setSelectedCuisine('All Cuisines');
  };

  const groupedRestaurants = useMemo(() => {
    const grouped = {};
    filteredRestaurants.forEach(restaurant => {
      if (!grouped[restaurant.county]) {
        grouped[restaurant.county] = [];
      }
      grouped[restaurant.county].push(restaurant);
    });
    return grouped;
  }, [filteredRestaurants]);

  const getPriceSymbol = (priceRange) => {
    const symbols = { '$': '$', '$$': '$$', '$$$': '$$$', '$$$$': '$$$$' };
    return symbols[priceRange] || '$$';
  };

  const handleWriteReview = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setIsReviewModalOpen(true);
  };

  const handleCloseReviewModal = () => {
    setIsReviewModalOpen(false);
    setSelectedRestaurant(null);
  };

  // Loading and error states
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading restaurants...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()} className="tennsational-orange">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div 
        className="relative bg-white shadow-sm"
        style={{
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)), url(${mountainBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-4 sm:mb-0">Restaurants in East Tennessee</h1>
            <Link to="/submit">
              <Button className="tennsational-orange">
                <Plus className="w-4 h-4 mr-2" />
                Submit a Restaurant
              </Button>
            </Link>
          </div>
          
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Input
              type="text"
              placeholder="Search restaurants..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="md:col-span-1"
            />
            
            <Select value={selectedCounty} onValueChange={setSelectedCounty}>
              <SelectTrigger>
                <SelectValue placeholder="All Counties" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Counties">All Counties</SelectItem>
                {counties.map(county => (
                  <SelectItem key={county} value={county}>{county}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={selectedCuisine} onValueChange={setSelectedCuisine}>
              <SelectTrigger>
                <SelectValue placeholder="All Cuisines" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Cuisines">All Cuisines</SelectItem>
                {cuisines.map(cuisine => (
                  <SelectItem key={cuisine} value={cuisine}>{cuisine}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button 
              variant="outline" 
              onClick={clearFilters}
              className="border-primary text-primary hover:bg-primary hover:text-white"
            >
              Clear Filters
            </Button>
          </div>
          
          <p className="text-gray-600 mb-8">Showing {filteredRestaurants.length} restaurants</p>
        </div>
      </div>

      {/* Restaurant Listings */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {Object.entries(groupedRestaurants).map(([county, countyRestaurants]) => (
          <div key={county} className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {county} ({countyRestaurants.length} restaurants)
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {countyRestaurants.map((restaurant) => (
                <Card key={restaurant.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900">
                          {restaurant.name}
                          {restaurant.isUserSubmitted && (
                            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              New!
                            </span>
                          )}
                        </h3>
                      </div>
                      <StarDisplay 
                        rating={restaurant.rating || 0} 
                        reviewCount={restaurant.review_count || restaurant.reviews || 0}
                        size="small"
                      />
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-gray-600">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span className="text-sm">{restaurant.address}</span>
                      </div>
                      
                      {restaurant.phone && (
                        <div className="flex items-center text-gray-600">
                          <Phone className="w-4 h-4 mr-2" />
                          <span className="text-sm">{restaurant.phone}</span>
                        </div>
                      )}
                      
                      {restaurant.website && (
                        <div className="flex items-center text-gray-600">
                          <Globe className="w-4 h-4 mr-2" />
                          <a 
                            href={restaurant.website.startsWith('http') ? restaurant.website : `https://${restaurant.website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:underline"
                          >
                            {restaurant.website}
                          </a>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between mb-4">
                      <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                        {restaurant.cuisine}
                      </span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">
                          {restaurant.review_count || restaurant.reviews || 0} reviews
                        </span>
                        <span className="text-sm font-medium text-primary">
                          {getPriceSymbol(restaurant.price_range)}
                        </span>
                      </div>
                    </div>
                    
                    {restaurant.description && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {restaurant.description}
                      </p>
                    )}
                    
                    {restaurant.amenities && restaurant.amenities.length > 0 && (
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-1">
                          {restaurant.amenities.slice(0, 3).map((amenity, idx) => (
                            <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                              {amenity}
                            </span>
                          ))}
                          {restaurant.amenities.length > 3 && (
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                              +{restaurant.amenities.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    <Button 
                      onClick={() => handleWriteReview(restaurant)}
                      variant="outline"
                      size="sm"
                      className="w-full mt-4"
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Write Review
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
        
        {filteredRestaurants.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No restaurants found matching your criteria.</p>
            <Button 
              onClick={clearFilters}
              className="mt-4 tennsational-orange"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>

      {/* Review Modal */}
      <ReviewModal 
        isOpen={isReviewModalOpen} 
        onClose={handleCloseReviewModal}
        preselectedRestaurant={selectedRestaurant}
      />
    </div>
  );
}
