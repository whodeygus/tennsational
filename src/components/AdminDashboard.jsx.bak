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
  Users,
  Building,
  MapPin,
  Phone,
  Globe,
  DollarSign,
  Utensils
} from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({});
  const [activeTab, setActiveTab] = useState('pending-restaurants');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });

  useEffect(() => {
    checkAuthStatus();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
      loadStats();
    }
  }, [activeTab, isAuthenticated]);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/admin/stats');
      if (response.ok) {
        setIsAuthenticated(true);
      }
    } catch (error) {
      setIsAuthenticated(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm),
      });

      if (response.ok) {
        setIsAuthenticated(true);
        setLoginForm({ username: '', password: '' });
      } else {
        const error = await response.json();
        alert(error.error || 'Login failed');
      }
    } catch (error) {
      alert('Login failed. Please try again.');
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      setIsAuthenticated(false);
      setData([]);
      setStats({});
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const loadStats = async () => {
    try {
      const response = await fetch('/api/admin/stats');
      if (response.ok) {
        const statsData = await response.json();
        setStats(statsData);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      let endpoint;
      let status = 'all';

      if (activeTab.includes('restaurants')) {
        endpoint = '/api/admin/restaurant-submissions';
        if (activeTab === 'pending-restaurants') status = 'pending';
        else if (activeTab === 'approved-restaurants') status = 'approved';
        else if (activeTab === 'rejected-restaurants') status = 'rejected';
      } else if (activeTab.includes('reviews')) {
        endpoint = '/api/admin/reviews';
        if (activeTab === 'pending-reviews') status = 'pending';
        else if (activeTab === 'approved-reviews') status = 'approved';
        else if (activeTab === 'rejected-reviews') status = 'rejected';
      } else if (activeTab === 'newsletter') {
        endpoint = '/api/admin/newsletter-subscribers';
      }

      const url = status !== 'all' ? `${endpoint}?status=${status}` : endpoint;
      const response = await fetch(url);
      
      if (response.ok) {
        const responseData = await response.json();
        setData(responseData);
      } else {
        console.error('Failed to load data');
        setData([]);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus, type) => {
    try {
      const endpoint = type === 'restaurant' 
        ? `/api/admin/restaurant-submissions/${id}`
        : `/api/admin/reviews/${id}`;
      
      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        loadData();
        loadStats();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to update status');
      }
    } catch (error) {
      alert('Error updating status. Please try again.');
    }
  };

  const deleteItem = async (id, type) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      let endpoint;
      if (type === 'restaurant') {
        endpoint = `/api/admin/restaurant-submissions/${id}`;
      } else if (type === 'review') {
        endpoint = `/api/admin/reviews/${id}`;
      } else if (type === 'subscriber') {
        endpoint = `/api/admin/newsletter-subscribers/${id}`;
      }

      const response = await fetch(endpoint, { method: 'DELETE' });

      if (response.ok) {
        loadData();
        loadStats();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to delete item');
      }
    } catch (error) {
      alert('Error deleting item. Please try again.');
    }
  };

  const exportNewsletterSubscribers = () => {
    if (data.length === 0) {
      alert('No newsletter subscribers to export.');
      return;
    }

    const csvContent = [
      ['First Name', 'Last Name', 'Email', 'Signup Date'],
      ...data.map(sub => [
        sub.first_name,
        sub.last_name,
        sub.email,
        new Date(sub.subscribed_at).toLocaleDateString()
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Login Form
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Admin Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Username</label>
                <input
                  type="text"
                  value={loginForm.username}
                  onChange={(e) => setLoginForm({...loginForm, username: e.target.value})}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Password</label>
                <input
                  type="password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <Button type="submit" className="w-full tennsational-orange">
                Login
              </Button>
            </form>
            <p className="text-sm text-gray-500 mt-4 text-center">
              Default login: admin / tennsational2025
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Restaurant Card Component
  const RestaurantCard = ({ restaurant }) => (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{restaurant.name}</CardTitle>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {restaurant.address}
              </div>
              <div className="flex items-center gap-1">
                <Building className="w-4 h-4" />
                {restaurant.city}, {restaurant.county}
              </div>
            </div>
          </div>
          <Badge variant={
            restaurant.status === 'approved' ? 'default' : 
            restaurant.status === 'rejected' ? 'destructive' : 
            'secondary'
          }>
            {restaurant.status}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <span className="text-sm font-medium text-gray-500">Cuisine</span>
              <p className="text-sm">{restaurant.cuisine}</p>
            </div>
            {restaurant.price_range && (
              <div>
                <span className="text-sm font-medium text-gray-500">Price Range</span>
                <p className="text-sm">{restaurant.price_range}</p>
              </div>
            )}
            {restaurant.phone && (
              <div>
                <span className="text-sm font-medium text-gray-500">Phone</span>
                <p className="text-sm">{restaurant.phone}</p>
              </div>
            )}
            {restaurant.website && (
              <div>
                <span className="text-sm font-medium text-gray-500">Website</span>
                <p className="text-sm truncate">{restaurant.website}</p>
              </div>
            )}
          </div>

          {restaurant.description && (
            <div>
              <h4 className="font-medium mb-2">Description</h4>
              <p className="text-gray-700 bg-gray-50 p-3 rounded-lg text-sm">
                {restaurant.description}
              </p>
            </div>
          )}

          {restaurant.amenities && restaurant.amenities.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Amenities</h4>
              <div className="flex flex-wrap gap-1">
                {restaurant.amenities.map((amenity, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {amenity}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {restaurant.hours && (
            <div>
              <h4 className="font-medium mb-2">Hours</h4>
              <p className="text-sm text-gray-700">{restaurant.hours}</p>
            </div>
          )}

          <div className="text-xs text-gray-500">
            Submitted: {formatDate(restaurant.submitted_at)}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4 border-t">
            {restaurant.status === 'pending' && (
              <>
                <Button
                  onClick={() => updateStatus(restaurant.id, 'approved', 'restaurant')}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  size="sm"
                >
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Approve
                </Button>
                <Button
                  onClick={() => updateStatus(restaurant.id, 'rejected', 'restaurant')}
                  variant="destructive"
                  className="flex-1"
                  size="sm"
                >
                  <XCircle className="w-4 h-4 mr-1" />
                  Reject
                </Button>
              </>
            )}
            
            {restaurant.status !== 'pending' && (
              <div className="flex gap-2">
                {restaurant.status === 'rejected' && (
                  <Button
                    onClick={() => updateStatus(restaurant.id, 'approved', 'restaurant')}
                    variant="outline"
                    size="sm"
                  >
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Approve
                  </Button>
                )}
                {restaurant.status === 'approved' && (
                  <Button
                    onClick={() => updateStatus(restaurant.id, 'rejected', 'restaurant')}
                    variant="outline"
                    size="sm"
                  >
                    <XCircle className="w-4 h-4 mr-1" />
                    Reject
                  </Button>
                )}
              </div>
            )}
            
            <Button
              onClick={() => deleteItem(restaurant.id, 'restaurant')}
              variant="outline"
              size="sm"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // Review Card Component (simplified from previous version)
  const ReviewCard = ({ review }) => (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">Restaurant ID: {review.restaurant_id}</CardTitle>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                {review.reviewer_name}
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Visit: {new Date(review.visit_date).toLocaleDateString()}
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
            <h4 className="font-medium mb-2">Review</h4>
            <p className="text-gray-700 bg-gray-50 p-3 rounded-lg text-sm">
              {review.review_text}
            </p>
          </div>

          <div className="text-xs text-gray-500">
            Submitted: {formatDate(review.submitted_at)}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4 border-t">
            {review.status === 'pending' && (
              <>
                <Button
                  onClick={() => updateStatus(review.id, 'approved', 'review')}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  size="sm"
                >
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Approve
                </Button>
                <Button
                  onClick={() => updateStatus(review.id, 'rejected', 'review')}
                  variant="destructive"
                  className="flex-1"
                  size="sm"
                >
                  <XCircle className="w-4 h-4 mr-1" />
                  Reject
                </Button>
              </>
            )}
            
            <Button
              onClick={() => deleteItem(review.id, 'review')}
              variant="outline"
              size="sm"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const tabs = [
    { id: 'pending-restaurants', label: 'Pending Restaurants', count: stats.pendingRestaurants || 0 },
    { id: 'approved-restaurants', label: 'Approved Restaurants', count: stats.approvedRestaurants || 0 },
    { id: 'rejected-restaurants', label: 'Rejected Restaurants', count: stats.rejectedRestaurants || 0 },
    { id: 'pending-reviews', label: 'Pending Reviews', count: stats.pendingReviews || 0 },
    { id: 'approved-reviews', label: 'Approved Reviews', count: stats.approvedReviews || 0 },
    { id: 'rejected-reviews', label: 'Rejected Reviews', count: stats.rejectedReviews || 0 },
    { id: 'newsletter', label: 'Newsletter', count: stats.newsletterSubscribers || 0 }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">Manage restaurant submissions, reviews, and newsletter subscribers</p>
          </div>
          <Button onClick={handleLogout} variant="outline">
            Logout
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Restaurants</p>
                  <p className="text-3xl font-bold text-orange-600">{stats.pendingRestaurants || 0}</p>
                </div>
                <Building className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Reviews</p>
                  <p className="text-3xl font-bold text-orange-600">{stats.pendingReviews || 0}</p>
                </div>
                <Clock className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Approved Items</p>
                  <p className="text-3xl font-bold text-green-600">
                    {(stats.approvedRestaurants || 0) + (stats.approvedReviews || 0)}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Newsletter Subscribers</p>
                  <p className="text-3xl font-bold text-blue-600">{stats.newsletterSubscribers || 0}</p>
                </div>
                <Mail className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
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
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Newsletter Subscribers</h2>
                <Button 
                  onClick={exportNewsletterSubscribers}
                  className="flex items-center gap-2"
                  disabled={data.length === 0}
                >
                  <Download className="w-4 h-4" />
                  Export CSV
                </Button>
              </div>

              {loading ? (
                <div className="text-center py-8">Loading...</div>
              ) : data.length === 0 ? (
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
                          {data.map((subscriber) => (
                            <tr key={subscriber.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">
                                  {subscriber.first_name} {subscriber.last_name}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{subscriber.email}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500">
                                  {formatDate(subscriber.subscribed_at)}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => deleteItem(subscriber.id, 'subscriber')}
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
