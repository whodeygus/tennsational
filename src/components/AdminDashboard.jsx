import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { StarDisplay } from './ui/star-rating';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  User, 
  Calendar, 
  MessageSquare,
  Camera,
  Trash2,
  Eye,
  Mail,
  Download,
  Users
} from 'lucide-react';
import { restaurants } from '../data/restaurants';

export default function AdminDashboard() {
  const [pendingReviews, setPendingReviews] = useState([]);
  const [approvedReviews, setApprovedReviews] = useState([]);
  const [rejectedReviews, setRejectedReviews] = useState([]);
  const [newsletterSubscribers, setNewsletterSubscribers] = useState([]);
  const [activeTab, setActiveTab] = useState('pending');

  useEffect(() => {
    loadReviews();
    loadNewsletterSubscribers();
  }, []);

  const loadReviews = () => {
    const allReviews = JSON.parse(localStorage.getItem('tennsational_reviews') || '[]');
    
    setPendingReviews(allReviews.filter(review => review.status === 'pending'));
    setApprovedReviews(allReviews.filter(review => review.status === 'approved'));
    setRejectedReviews(allReviews.filter(review => review.status === 'rejected'));
  };

  const loadNewsletterSubscribers = () => {
    const subscribers = JSON.parse(localStorage.getItem('newsletterSubscriptions') || '[]');
    setNewsletterSubscribers(subscribers);
  };

  const exportNewsletterSubscribers = () => {
    if (newsletterSubscribers.length === 0) {
      alert('No newsletter subscribers to export.');
      return;
    }

    const csvContent = [
      ['First Name', 'Last Name', 'Email', 'Signup Date'],
      ...newsletterSubscribers.map(sub => [
        sub.firstName,
        sub.lastName,
        sub.email,
        new Date(sub.timestamp).toLocaleDateString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tennsational-newsletter-subscribers-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const deleteNewsletterSubscriber = (index) => {
    if (confirm('Are you sure you want to remove this subscriber?')) {
      const updatedSubscribers = newsletterSubscribers.filter((_, i) => i !== index);
      localStorage.setItem('newsletterSubscriptions', JSON.stringify(updatedSubscribers));
      loadNewsletterSubscribers();
    }
  };

  const updateReviewStatus = (reviewIndex, newStatus) => {
    const allReviews = JSON.parse(localStorage.getItem('tennsational_reviews') || '[]');
    allReviews[reviewIndex].status = newStatus;
    allReviews[reviewIndex].reviewedAt = new Date().toISOString();
    
    localStorage.setItem('tennsational_reviews', JSON.stringify(allReviews));
    loadReviews();
  };

  const deleteReview = (reviewIndex) => {
    if (confirm('Are you sure you want to permanently delete this review?')) {
      const allReviews = JSON.parse(localStorage.getItem('tennsational_reviews') || '[]');
      allReviews.splice(reviewIndex, 1);
      localStorage.setItem('tennsational_reviews', JSON.stringify(allReviews));
      loadReviews();
    }
  };

  const getRestaurantName = (restaurantId) => {
    const restaurant = restaurants.find(r => r.id === restaurantId);
    return restaurant ? restaurant.name : 'Unknown Restaurant';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const ReviewCard = ({ review, index, showActions = true }) => (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{getRestaurantName(review.restaurantId)}</CardTitle>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                {review.reviewerName}
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Visit: {new Date(review.visitDate).toLocaleDateString()}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                Submitted: {formatDate(review.submittedAt)}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <StarDisplay rating={review.rating} size="small" />
            <Badge variant={
              review.status === 'approved' ? 'default' : 
              review.status === 'rejected' ? 'destructive' : 
              'secondary'
            }>
              {review.status}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Review
            </h4>
            <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
              {review.reviewText}
            </p>
          </div>

          {review.photos && review.photos.length > 0 && (
            <div>
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Camera className="w-4 h-4" />
                Photos ({review.photos.length})
              </h4>
              <div className="grid grid-cols-3 gap-2">
                {review.photos.map((photo, photoIndex) => (
                  <div key={photoIndex} className="relative">
                    <img
                      src={photo.preview}
                      alt={`Review photo ${photoIndex + 1}`}
                      className="w-full h-20 object-cover rounded-lg"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {showActions && review.status === 'pending' && (
            <div className="flex gap-2 pt-4 border-t">
              <Button
                onClick={() => updateReviewStatus(index, 'approved')}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Approve
              </Button>
              <Button
                onClick={() => updateReviewStatus(index, 'rejected')}
                variant="destructive"
                className="flex-1"
              >
                <XCircle className="w-4 h-4 mr-2" />
                Reject
              </Button>
              <Button
                onClick={() => deleteReview(index)}
                variant="outline"
                size="sm"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          )}

          {showActions && review.status !== 'pending' && (
            <div className="flex gap-2 pt-4 border-t">
              <Button
                onClick={() => deleteReview(index)}
                variant="outline"
                size="sm"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
              {review.status === 'rejected' && (
                <Button
                  onClick={() => updateReviewStatus(index, 'approved')}
                  variant="outline"
                  size="sm"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve
                </Button>
              )}
              {review.status === 'approved' && (
                <Button
                  onClick={() => updateReviewStatus(index, 'rejected')}
                  variant="outline"
                  size="sm"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const getCurrentReviews = () => {
    const allReviews = JSON.parse(localStorage.getItem('tennsational_reviews') || '[]');
    
    switch (activeTab) {
      case 'pending':
        return allReviews
          .map((review, index) => ({ ...review, originalIndex: index }))
          .filter(review => review.status === 'pending');
      case 'approved':
        return allReviews
          .map((review, index) => ({ ...review, originalIndex: index }))
          .filter(review => review.status === 'approved');
      case 'rejected':
        return allReviews
          .map((review, index) => ({ ...review, originalIndex: index }))
          .filter(review => review.status === 'rejected');
      default:
        return [];
    }
  };

  const currentReviews = getCurrentReviews();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Review and manage submitted restaurant reviews</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Reviews</p>
                  <p className="text-3xl font-bold text-orange-600">{pendingReviews.length}</p>
                </div>
                <Clock className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Approved Reviews</p>
                  <p className="text-3xl font-bold text-green-600">{approvedReviews.length}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Rejected Reviews</p>
                  <p className="text-3xl font-bold text-red-600">{rejectedReviews.length}</p>
                </div>
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Newsletter Subscribers</p>
                  <p className="text-3xl font-bold text-blue-600">{newsletterSubscribers.length}</p>
                </div>
                <Mail className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'pending', label: 'Pending', count: pendingReviews.length },
                { id: 'approved', label: 'Approved', count: approvedReviews.length },
                { id: 'rejected', label: 'Rejected', count: rejectedReviews.length },
                { id: 'newsletter', label: 'Newsletter', count: newsletterSubscribers.length }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content Area */}
        <div>
          {activeTab === 'newsletter' ? (
            <div>
              {/* Newsletter Header */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Newsletter Subscribers</h2>
                <Button 
                  onClick={exportNewsletterSubscribers}
                  className="flex items-center gap-2"
                  disabled={newsletterSubscribers.length === 0}
                >
                  <Download className="w-4 h-4" />
                  Export CSV
                </Button>
              </div>

              {/* Newsletter Subscribers List */}
              {newsletterSubscribers.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No newsletter subscribers yet
                    </h3>
                    <p className="text-gray-600">
                      Newsletter signups will appear here once visitors subscribe.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Email
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Signup Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {newsletterSubscribers.map((subscriber, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">
                                  {subscriber.firstName} {subscriber.lastName}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{subscriber.email}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500">
                                  {new Date(subscriber.timestamp).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => deleteNewsletterSubscriber(index)}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            /* Reviews List */
            currentReviews.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Eye className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No {activeTab} reviews
                  </h3>
                  <p className="text-gray-600">
                    {activeTab === 'pending' 
                      ? 'All caught up! No reviews waiting for approval.'
                      : `No ${activeTab} reviews to display.`
                    }
                  </p>
                </CardContent>
              </Card>
            ) : (
              currentReviews.map((review) => (
                <ReviewCard
                  key={review.originalIndex}
                  review={review}
                  index={review.originalIndex}
                  showActions={true}
                />
              ))
            )
          )}
        </div>
      </div>
    </div>
  );
}

