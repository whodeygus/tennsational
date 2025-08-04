import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { StarRating } from './ui/star-rating';
import { Camera, X, Calendar, User } from 'lucide-react';
import { restaurants } from '../data/restaurants';

const reviewSchema = z.object({
  restaurantId: z.string().min(1, 'Please select a restaurant'),
  reviewerName: z.string().min(2, 'Name must be at least 2 characters'),
  rating: z.number().min(1, 'Please provide a rating').max(5),
  reviewText: z.string().min(10, 'Review must be at least 10 characters'),
  visitDate: z.string().min(1, 'Please provide visit date'),
});

export function ReviewModal({ isOpen, onClose, preselectedRestaurant = null }) {
  const [rating, setRating] = useState(0);
  const [uploadedPhotos, setUploadedPhotos] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      restaurantId: preselectedRestaurant?.id || '',
      rating: 0,
    },
  });

  const handlePhotoUpload = (event) => {
    const files = Array.from(event.target.files);
    const newPhotos = files.map(file => ({
      id: Date.now() + Math.random(),
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
    }));
    setUploadedPhotos(prev => [...prev, ...newPhotos]);
  };

  const removePhoto = (photoId) => {
    setUploadedPhotos(prev => {
      const photoToRemove = prev.find(p => p.id === photoId);
      if (photoToRemove) {
        URL.revokeObjectURL(photoToRemove.preview);
      }
      return prev.filter(p => p.id !== photoId);
    });
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      const reviewData = {
        ...data,
        rating,
        photos: uploadedPhotos,
        submittedAt: new Date().toISOString(),
        status: 'pending', // Will be reviewed by admin
      };

      // Store in localStorage for now (will be replaced with real database)
      const existingReviews = JSON.parse(localStorage.getItem('tennsational_reviews') || '[]');
      existingReviews.push(reviewData);
      localStorage.setItem('tennsational_reviews', JSON.stringify(existingReviews));

      // Show success message
      alert('Thank you for your review! It has been submitted for approval and will appear on the site once reviewed.');
      
      // Reset form
      reset();
      setRating(0);
      setUploadedPhotos([]);
      onClose();
    } catch (error) {
      alert('There was an error submitting your review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRatingChange = (newRating) => {
    setRating(newRating);
    setValue('rating', newRating);
  };

  const handleClose = () => {
    reset();
    setRating(0);
    setUploadedPhotos([]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Write a Review
          </DialogTitle>
          <DialogDescription>
            Share your dining experience to help others discover great restaurants in East Tennessee.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Restaurant Selection */}
          <div className="space-y-2">
            <Label htmlFor="restaurantId">Restaurant *</Label>
            <select
              {...register('restaurantId')}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
              disabled={!!preselectedRestaurant}
            >
              <option value="">Select a restaurant...</option>
              {restaurants
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((restaurant) => (
                <option key={restaurant.id} value={restaurant.id}>
                  {restaurant.name} - {restaurant.address}
                </option>
              ))}
            </select>
            {errors.restaurantId && (
              <p className="text-sm text-red-600">{errors.restaurantId.message}</p>
            )}
          </div>

          {/* Reviewer Name */}
          <div className="space-y-2">
            <Label htmlFor="reviewerName">Your Name *</Label>
            <Input
              {...register('reviewerName')}
              placeholder="Enter your name"
            />
            {errors.reviewerName && (
              <p className="text-sm text-red-600">{errors.reviewerName.message}</p>
            )}
          </div>

          {/* Visit Date */}
          <div className="space-y-2">
            <Label htmlFor="visitDate">Visit Date *</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                {...register('visitDate')}
                type="date"
                className="pl-10"
                max={new Date().toISOString().split('T')[0]}
              />
            </div>
            {errors.visitDate && (
              <p className="text-sm text-red-600">{errors.visitDate.message}</p>
            )}
          </div>

          {/* Rating */}
          <div className="space-y-2">
            <Label>Your Rating *</Label>
            <div className="flex items-center gap-4">
              <StarRating
                rating={rating}
                onRatingChange={handleRatingChange}
                size="large"
              />
              <span className="text-sm text-gray-600">
                {rating === 0 ? 'Click to rate' : `${rating} star${rating !== 1 ? 's' : ''}`}
              </span>
            </div>
            {errors.rating && (
              <p className="text-sm text-red-600">{errors.rating.message}</p>
            )}
          </div>

          {/* Review Text */}
          <div className="space-y-2">
            <Label htmlFor="reviewText">Your Review *</Label>
            <Textarea
              {...register('reviewText')}
              placeholder="Tell us about your experience... What did you order? How was the service? What made this visit special?"
              rows={4}
            />
            {errors.reviewText && (
              <p className="text-sm text-red-600">{errors.reviewText.message}</p>
            )}
          </div>

          {/* Photo Upload */}
          <div className="space-y-2">
            <Label>Add Photos (Optional)</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handlePhotoUpload}
                className="hidden"
                id="photo-upload"
              />
              <label
                htmlFor="photo-upload"
                className="flex flex-col items-center justify-center cursor-pointer"
              >
                <Camera className="w-8 h-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-600">
                  Click to upload photos of your meal
                </span>
              </label>
            </div>

            {/* Photo Previews */}
            {uploadedPhotos.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mt-4">
                {uploadedPhotos.map((photo) => (
                  <div key={photo.id} className="relative">
                    <img
                      src={photo.preview}
                      alt={photo.name}
                      className="w-full h-20 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(photo.id)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || rating === 0}
              className="flex-1 tennsational-orange"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default ReviewModal;

