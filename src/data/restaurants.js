import restaurantData from '../assets/allRestaurants.json';

// Extract restaurants array from the JSON structure
export const restaurants = restaurantData.restaurants || restaurantData;

// Helper functions for restaurant data
export const getRestaurantsByCounty = (county) => {
  if (!county || county === 'All Counties') return restaurants;
  return restaurants.filter(restaurant => restaurant.county === county);
};

export const getRestaurantsByCuisine = (cuisine) => {
  if (!cuisine || cuisine === 'All Cuisines') return restaurants;
  return restaurants.filter(restaurant => restaurant.cuisine === cuisine);
};

export const searchRestaurants = (query) => {
  if (!query) return restaurants;
  const lowercaseQuery = query.toLowerCase();
  return restaurants.filter(restaurant => 
    restaurant.name.toLowerCase().includes(lowercaseQuery) ||
    restaurant.address.toLowerCase().includes(lowercaseQuery) ||
    restaurant.cuisine.toLowerCase().includes(lowercaseQuery) ||
    restaurant.county.toLowerCase().includes(lowercaseQuery)
  );
};

export const getUniqueCounties = () => {
  const counties = [...new Set(restaurants.map(r => r.county))];
  return counties.sort();
};

export const getUniqueCuisines = () => {
  const cuisines = [...new Set(restaurants.map(r => r.cuisine))];
  return cuisines.sort();
};

export const getRestaurantStats = () => {
  const totalRestaurants = restaurants.length;
  const totalReviews = restaurants.reduce((sum, r) => sum + (r.reviews || 0), 0);
  const totalCounties = getUniqueCounties().length;
  const avgRating = restaurants.reduce((sum, r) => sum + (r.rating || 0), 0) / totalRestaurants;
  
  return {
    totalRestaurants,
    totalReviews,
    totalCounties,
    avgRating: Math.round(avgRating * 10) / 10
  };
};

