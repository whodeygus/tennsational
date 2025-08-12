import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const SchemaManager = () => {
  const location = useLocation();
  const [currentPath, setCurrentPath] = useState('');

  useEffect(() => {
    // Extract the path from the hash router format
    const path = location.hash ? location.hash.substring(1) : '/';
    setCurrentPath(path);
    
    // Remove any existing schema scripts
    const existingSchemas = document.querySelectorAll('script[type="application/ld+json"]');
    existingSchemas.forEach(script => script.remove());
    
    // Load and inject appropriate schema based on current path
    loadSchemaForPath(path);
    
  }, [location]);

  const loadSchemaForPath = async (path) => {
    try {
      // Default organization schema for all pages
      const orgSchemaResponse = await fetch('/schemas/localBusiness.json');
      const orgSchema = await orgSchemaResponse.json();
      injectSchema(orgSchema, 'org-schema');
      
      // Path-specific schemas
      if (path === '/' || path === '') {
        // Homepage schema - already covered by organization schema
      } else if (path.startsWith('/restaurants')) {
        // Check if specific restaurant
        const urlParams = new URLSearchParams(path.split('?')[1]);
        const restaurantId = urlParams.get('id');
        
        if (restaurantId) {
          // Try to load specific restaurant schema
          try {
            const restaurantSchemaResponse = await fetch(`/schemas/${restaurantId}.json`);
            const restaurantSchema = await restaurantSchemaResponse.json();
            injectSchema(restaurantSchema, 'restaurant-schema');
          } catch (err) {
            // If specific restaurant schema doesn't exist, use sample
            const sampleRestaurantResponse = await fetch('/schemas/sampleRestaurant.json');
            const sampleRestaurant = await sampleRestaurantResponse.json();
            injectSchema(sampleRestaurant, 'sample-restaurant-schema');
          }
        }
      } else if (path.startsWith('/knox-county')) {
        // Knox County FAQ schema
        const knoxFaqResponse = await fetch('/schemas/knoxCountyFAQ.json');
        const knoxFaq = await knoxFaqResponse.json();
        injectSchema(knoxFaq, 'knox-faq-schema');
      } else if (path.startsWith('/sevier-county')) {
        // Sevier County FAQ schema
        const sevierFaqResponse = await fetch('/schemas/sevierCountyFAQ.json');
        const sevierFaq = await sevierFaqResponse.json();
        injectSchema(sevierFaq, 'sevier-faq-schema');
      }
    } catch (error) {
      console.error('Error loading schema:', error);
    }
  };

  const injectSchema = (schema, id) => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = id;
    script.innerHTML = JSON.stringify(schema);
    document.head.appendChild(script);
  };

  // This component doesn't render anything visible
  return null;
};

export default SchemaManager;

