import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { MapPin, Phone, Globe, Clock, DollarSign, Utensils, X, Plus } from 'lucide-react';

const COUNTIES = [
  'Blount County',
  'Cocke County', 
  'Hamblen County',
  'Jefferson County',
  'Knox County',
  'Sevier County'
];

const CUISINES = [
  'American',
  'American Steakhouse', 
  'Asian',
  'BBQ',
  'Chinese',
  'Coffee',
  'Fast Food',
  'Indian',
  'Italian',
  'Japanese',
  'Mediterranean',
  'Mexican',
  'Mexican Fast Food',
  'Middle Eastern',
  'Pizza',
  'Seafood',
  'Southern',
  'Steakhouse'
];

const PRICE_RANGES = [
  { value: '$', label: '$ - Under $15' },
  { value: '$$', label: '$$ - $15-30' },
  { value: '$$$', label: '$$$ - $30-50' },
  { value: '$$$$', label: '$$$$ - Over $50' }
];

const restaurantSchema = z.object({
  name: z.string().min(2, 'Restaurant name must be at least 2 characters'),
  address: z.string().min(5, 'Please provide a complete address'),
  city: z.string().min(2, 'City is required'),
  county: z.string().min(1, 'Please select a county'),
  phone: z.string().optional(),
  website: z.string().optional(),
  cuisine: z.string().min(1, 'Please select a cuisine type'),
  price_range: z.string().optional(),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  hours: z.string().optional(),
});

export function AddRestaurant() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [amenities, setAmenities] = useState([]);
  const [newAmenity, setNewAmenity] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(restaurantSchema),
  });

  const addAmenity = () => {
    if (newAmenity.trim() && !amenities.includes(newAmenity.trim())) {
      setAmenities([...amenities, newAmenity.trim()]);
      setNewAmenity('');
    }
  };

  const removeAmenity = (amenityToRemove) => {
    setAmenities(amenities.filter(amenity => amenity !== amenityToRemove));
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    
    try {
      const submissionData = {
        ...data,
        amenities: amenities,
        submitted_at: new Date().toISOString(),
      };

      // API call to backend
      const response = await fetch('/api/restaurants/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitSuccess(true);
        reset();
        setAmenities([]);
        setNewAmenity('');
        
        // Show success message
        alert('Thank you for submitting your restaurant! It will be reviewed and added to our directory once approved.');
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        throw new Error(result.error || 'Failed to submit restaurant');
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('There was an error submitting your restaurant. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4">
          <Card className="text-center">
            <CardContent className="p-12">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Restaurant Submitted Successfully!
              </h2>
              <p className="text-gray-600 mb-6">
                Thank you for contributing to TENNsational! Your restaurant submission has been received and will be reviewed by our team. Once approved, it will appear in our directory.
              </p>
              <Button 
                onClick={() => setSubmitSuccess(false)}
                className="tennsational-orange"
              >
                Submit Another Restaurant
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Add Your Restaurant to TENNsational
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Help fellow food lovers discover your restaurant! Submit your information below and we'll add you to our comprehensive East Tennessee dining directory.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Utensils className="w-5 h-5" />
              Restaurant Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Restaurant Name *</Label>
                  <Input
                    {...register('name')}
                    placeholder="e.g., Tony's Italian Kitchen"
                  />
                  {errors.name && (
                    <p className="text-sm text-red-600">{errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cuisine">Cuisine Type *</Label>
                  <select
                    {...register('cuisine')}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">Select cuisine type...</option>
                    {CUISINES.map(cuisine => (
                      <option key={cuisine} value={cuisine}>{cuisine}</option>
                    ))}
                  </select>
                  {errors.cuisine && (
                    <p className="text-sm text-red-600">{errors.cuisine.message}</p>
                  )}
                </div>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="address">Full Address *</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    {...register('address')}
                    placeholder="123 Main Street, Knoxville, TN 37902"
                    className="pl-10"
                  />
                </div>
                {errors.address && (
                  <p className="text-sm text-red-600">{errors.address.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    {...register('city')}
                    placeholder="e.g., Knoxville"
                  />
                  {errors.city && (
                    <p className="text-sm text-red-600">{errors.city.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="county">County *</Label>
                  <select
                    {...register('county')}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">Select county...</option>
                    {COUNTIES.map(county => (
                      <option key={county} value={county}>{county}</option>
                    ))}
                  </select>
                  {errors.county && (
                    <p className="text-sm text-red-600">{errors.county.message}</p>
                  )}
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      {...register('phone')}
                      placeholder="(865) 123-4567"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      {...register('website')}
                      placeholder="https://www.example.com"
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              {/* Price Range */}
              <div className="space-y-2">
                <Label htmlFor="price_range">Price Range</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {PRICE_RANGES.map(({ value, label }) => (
                    <label key={value} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        {...register('price_range')}
                        value={value}
                        className="text-primary focus:ring-primary"
                      />
                      <span className="text-sm">{label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Hours */}
              <div className="space-y-2">
                <Label htmlFor="hours">Hours of Operation</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Textarea
                    {...register('hours')}
                    placeholder="Mon-Thu: 11:00 AM - 9:00 PM, Fri-Sat: 11:00 AM - 10:00 PM, Sun: 12:00 PM - 8:00 PM"
                    className="pl-10"
                    rows={3}
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Restaurant Description *</Label>
                <Textarea
                  {...register('description')}
                  placeholder="Tell us about your restaurant! What makes it special? What's your signature dish? What's the atmosphere like?"
                  rows={4}
                />
                {errors.description && (
                  <p className="text-sm text-red-600">{errors.description.message}</p>
                )}
              </div>

              {/* Amenities */}
              <div className="space-y-2">
                <Label>Amenities & Features</Label>
                <div className="flex gap-2">
                  <Input
                    value={newAmenity}
                    onChange={(e) => setNewAmenity(e.target.value)}
                    placeholder="e.g., Outdoor Seating, Full Bar, Live Music"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAmenity())}
                  />
                  <Button
                    type="button"
                    onClick={addAmenity}
                    variant="outline"
                    size="sm"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                
                {amenities.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {amenities.map((amenity, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {amenity}
                        <button
                          type="button"
                          onClick={() => removeAmenity(amenity)}
                          className="ml-1 hover:text-red-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
                <p className="text-sm text-gray-500">
                  Add features like "Outdoor Seating", "Full Bar", "Live Music", "Family Friendly", etc.
                </p>
              </div>

              {/* Submission Notice */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-medium text-blue-900 mb-2">Submission Process</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Your restaurant will be reviewed by our team before being added to the directory</li>
                  <li>• We may contact you if we need additional information</li>
                  <li>• Once approved, your restaurant will appear in search results and listings</li>
                  <li>• This service is completely free for restaurant owners</li>
                </ul>
              </div>

              {/* Submit Button */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    reset();
                    setAmenities([]);
                    setNewAmenity('');
                  }}
                  className="flex-1"
                >
                  Clear Form
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 tennsational-orange"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Restaurant'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Help Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Need Help?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2">Questions about listing your restaurant?</h4>
                <p className="text-sm text-gray-600 mb-2">
                  Contact us at <a href="mailto:admin@tennsational.com" className="text-primary hover:underline">admin@tennsational.com</a>
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Already listed but need updates?</h4>
                <p className="text-sm text-gray-600">
                  Send us your updated information and we'll make the changes for you.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default AddRestaurant;
