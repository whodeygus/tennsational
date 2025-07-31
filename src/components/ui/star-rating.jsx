import { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '../../lib/utils';

export function StarRating({ 
  rating = 0, 
  onRatingChange, 
  readonly = false, 
  size = 'default',
  showValue = false,
  className 
}) {
  const [hoverRating, setHoverRating] = useState(0);
  const [currentRating, setCurrentRating] = useState(rating);

  const sizeClasses = {
    small: 'w-4 h-4',
    default: 'w-5 h-5',
    large: 'w-6 h-6'
  };

  const handleStarClick = (starValue) => {
    if (readonly) return;
    
    setCurrentRating(starValue);
    if (onRatingChange) {
      onRatingChange(starValue);
    }
  };

  const handleStarHover = (starValue) => {
    if (readonly) return;
    setHoverRating(starValue);
  };

  const handleMouseLeave = () => {
    if (readonly) return;
    setHoverRating(0);
  };

  const displayRating = hoverRating || currentRating;

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div 
        className="flex items-center"
        onMouseLeave={handleMouseLeave}
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              sizeClasses[size],
              "transition-colors duration-150",
              readonly ? "cursor-default" : "cursor-pointer",
              star <= displayRating
                ? "fill-yellow-400 text-yellow-400"
                : "fill-gray-200 text-gray-200 hover:fill-yellow-300 hover:text-yellow-300"
            )}
            onClick={() => handleStarClick(star)}
            onMouseEnter={() => handleStarHover(star)}
          />
        ))}
      </div>
      
      {showValue && (
        <span className="text-sm font-medium text-gray-600 ml-1">
          {displayRating.toFixed(1)}
        </span>
      )}
    </div>
  );
}

export function StarDisplay({ rating, reviewCount, size = 'default', className }) {
  const sizeClasses = {
    small: 'w-4 h-4',
    default: 'w-5 h-5',
    large: 'w-6 h-6'
  };

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              sizeClasses[size],
              star <= Math.round(rating)
                ? "fill-yellow-400 text-yellow-400"
                : "fill-gray-200 text-gray-200"
            )}
          />
        ))}
      </div>
      <span className="text-sm font-medium text-gray-600">
        {rating.toFixed(1)}
      </span>
      {reviewCount && (
        <span className="text-sm text-gray-500">
          ({reviewCount} {reviewCount === 1 ? 'review' : 'reviews'})
        </span>
      )}
    </div>
  );
}

