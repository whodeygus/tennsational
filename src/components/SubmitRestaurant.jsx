import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { MapPin, Phone, Globe, Clock, DollarSign, CheckCircle } from 'lucide-react';
import { getUniqueCounties } from '../data/restaurants';
import '../App.css';

export default function SubmitRestaurant() {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    website: '',
    county: '',
    cuisine: '',
    priceRange: '',
    description: '',
    hours: '',
    amenities: ''
  });
  
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const counties = getUniqueCounties();
  const cuisineTypes = [
    'American', 'Italian', 'Mexican', 'Chinese', 'Japanese', 'Thai', 'Indian',
    'Mediterranean', 'French', 'German', 'Southern', 'BBQ', 'Seafood', 'Steakhouse',
    'Pizza', 'Burgers', 'Sandwiches', 'Fast Food', 'Cafe', 'Bakery', 'Breakfast',
    'Vegetarian', 'Vegan', 'Other'
  ];

  const priceRanges = [
    { value: '$', label: '$ - Under $15' },
    { value: '$$', label: '$$ - $15-30' },
    { value: '$$$', label: '$$$ - $30-50' },
    { value: '$$$$', label: '$$$$ - Over $50' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Restaurant name is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.county) newErrors.county = 'County is required';
    if (!formData.cuisine) newErrors.cuisine = 'Cuisine type is required';
    if (!formData.priceRange) newErrors.priceRange = 'Price range is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    
    // Validate phone format (basic)
    if (formData.phone && !/^\(\d{3}\)\s\d{3}-\d{4}$/.test(formData.phone) && !/^\d{3}-\d{3}-\d{4}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number (e.g., (865) 123-4567)';
    }
    
    // Validate website format if provided
    if (formData.website && !formData.website.includes('.')) {
      newErrors.website = 'Please enter a valid website URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // In a real application, this would send data to a backend
      console.log('Restaurant submission:', formData);
      setIsSubmitted(true);
      
      // Reset form
      setFormData({
        name: '',
        address: '',
        phone: '',
        website: '',
        county: '',
        cuisine: '',
        priceRange: '',
        description: '',
        hours: '',
        amenities: ''
      });
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Thank You!</h2>
            <p className="text-gray-600 mb-6">
              Your restaurant submission has been received. We'll review it and add it to our directory soon.
            </p>
            <Button 
              onClick={() => setIsSubmitted(false)}
              className="tennsational-orange"
            >
              Submit Another Restaurant
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Submit a Restaurant</h1>
          <p className="text-xl text-gray-600">
            Help us grow our directory by adding your favorite local restaurant!
          </p>
          <p className="text-sm text-gray-500 mt-2">
            All submissions are reviewed before being added to the directory.
          </p>
        </div>

        <Card>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                    Restaurant Name *
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={errors.name ? 'border-red-500' : ''}
                    placeholder="Enter restaurant name"
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>

                <div>
                  <Label htmlFor="cuisine" className="text-sm font-medium text-gray-700">
                    Cuisine Type *
                  </Label>
                  <Select value={formData.cuisine} onValueChange={(value) => handleInputChange('cuisine', value)}>
                    <SelectTrigger className={errors.cuisine ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select cuisine type" />
                    </SelectTrigger>
                    <SelectContent>
                      {cuisineTypes.map(cuisine => (
                        <SelectItem key={cuisine} value={cuisine}>{cuisine}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.cuisine && <p className="text-red-500 text-sm mt-1">{errors.cuisine}</p>}
                </div>
              </div>

              {/* Location Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="address" className="text-sm font-medium text-gray-700">
                    Full Address *
                  </Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="address"
                      type="text"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className={`pl-10 ${errors.address ? 'border-red-500' : ''}`}
                      placeholder="123 Main St, City, TN 12345"
                    />
                  </div>
                  {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                </div>

                <div>
                  <Label htmlFor="county" className="text-sm font-medium text-gray-700">
                    County *
                  </Label>
                  <Select value={formData.county} onValueChange={(value) => handleInputChange('county', value)}>
                    <SelectTrigger className={errors.county ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select county" />
                    </SelectTrigger>
                    <SelectContent>
                      {counties.map(county => (
                        <SelectItem key={county} value={county}>{county}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.county && <p className="text-red-500 text-sm mt-1">{errors.county}</p>}
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                    Phone Number *
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className={`pl-10 ${errors.phone ? 'border-red-500' : ''}`}
                      placeholder="(865) 123-4567"
                    />
                  </div>
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <Label htmlFor="website" className="text-sm font-medium text-gray-700">
                    Website (Optional)
                  </Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="website"
                      type="url"
                      value={formData.website}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                      className={`pl-10 ${errors.website ? 'border-red-500' : ''}`}
                      placeholder="www.restaurant.com"
                    />
                  </div>
                  {errors.website && <p className="text-red-500 text-sm mt-1">{errors.website}</p>}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <Label htmlFor="priceRange" className="text-sm font-medium text-gray-700">
                  Price Range *
                </Label>
                <Select value={formData.priceRange} onValueChange={(value) => handleInputChange('priceRange', value)}>
                  <SelectTrigger className={errors.priceRange ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select price range" />
                  </SelectTrigger>
                  <SelectContent>
                    {priceRanges.map(range => (
                      <SelectItem key={range.value} value={range.value}>{range.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.priceRange && <p className="text-red-500 text-sm mt-1">{errors.priceRange}</p>}
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                  Description *
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className={errors.description ? 'border-red-500' : ''}
                  placeholder="Describe the restaurant, its atmosphere, specialties, and what makes it special..."
                  rows={4}
                />
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
              </div>

              {/* Hours */}
              <div>
                <Label htmlFor="hours" className="text-sm font-medium text-gray-700">
                  Hours of Operation (Optional)
                </Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="hours"
                    type="text"
                    value={formData.hours}
                    onChange={(e) => handleInputChange('hours', e.target.value)}
                    className="pl-10"
                    placeholder="Mon-Fri: 11am-10pm, Sat-Sun: 10am-11pm"
                  />
                </div>
              </div>

              {/* Amenities */}
              <div>
                <Label htmlFor="amenities" className="text-sm font-medium text-gray-700">
                  Amenities & Features (Optional)
                </Label>
                <Input
                  id="amenities"
                  type="text"
                  value={formData.amenities}
                  onChange={(e) => handleInputChange('amenities', e.target.value)}
                  placeholder="Outdoor seating, Full bar, Live music, Family friendly (separate with commas)"
                />
                <p className="text-sm text-gray-500 mt-1">
                  List special features, amenities, or services (separate multiple items with commas)
                </p>
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <Button 
                  type="submit" 
                  className="w-full tennsational-orange text-lg py-3"
                >
                  Submit Restaurant for Review
                </Button>
                <p className="text-sm text-gray-500 text-center mt-3">
                  By submitting, you confirm that the information provided is accurate and you have permission to share it.
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

