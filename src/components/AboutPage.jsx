import { Card, CardContent } from './ui/card';
import { MapPin, Users, Star, Heart } from 'lucide-react';
import '../App.css';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About TENNsational</h1>
          <p className="text-xl text-gray-600">
            Your trusted guide to authentic local flavors across East Tennessee
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardContent className="p-6">
              <MapPin className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-3">Local Focus</h3>
              <p className="text-gray-600">
                We specialize in showcasing the best restaurants across 6 East Tennessee counties, 
                from hidden gems to beloved local favorites.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <Users className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-3">Community Driven</h3>
              <p className="text-gray-600">
                Our platform is built by locals, for locals. Every review and recommendation 
                comes from real people in the community.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <Star className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-3">Quality Reviews</h3>
              <p className="text-gray-600">
                We maintain high standards for reviews and listings, ensuring you get 
                accurate, helpful information for your dining decisions.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <Heart className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-3">Supporting Local</h3>
              <p className="text-gray-600">
                By connecting diners with local restaurants, we help strengthen the 
                East Tennessee food scene and support local businesses.
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              TENNsational was created to celebrate and promote the incredible dining scene 
              across East Tennessee. We believe that great food brings communities together, 
              and every restaurant has a story worth sharing. Whether you're looking for 
              authentic Southern comfort food, innovative cuisine, or a perfect family dining 
              spot, we're here to help you discover what makes Tennessee dining truly sensational.
            </p>
          </CardContent>
        </Card>

        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Coverage Areas</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              'Jefferson County',
              'Knox County', 
              'Sevier County',
              'Blount County',
              'Hamblen County',
              'Cocke County'
            ].map(county => (
              <div key={county} className="bg-white rounded-lg p-4 shadow-sm">
                <span className="font-medium text-gray-900">{county}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

