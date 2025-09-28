import { MapPin, Users, Star, Heart } from 'lucide-react';
import '../App.css';

/** Simple inline Card components so we don't need extra files/folders */
const Card = ({ children, className = '', ...props }) => (
  <div className={`rounded-lg border bg-white shadow-sm ${className}`} {...props}>
    {children}
  </div>
);

const CardContent = ({ children, className = '', ...props }) => (
  <div className={`p-6 ${className}`} {...props}>
    {children}
  </div>
);

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About TENNsational</h1>
          <p className="text-xl text-gray-600">
            East Tennessee&apos;s Most Complete Restaurant Guide.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardContent>
              <MapPin className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-3">Local Focus</h3>
              <p className="text-gray-600">
                Discover the best local dining from Knoxville to the Smokies. Comprehensive guides,
                honest reviews, and insider recommendations for food lovers and visitors.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Users className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-3">Community Driven</h3>
              <p className="text-gray-600">
                East Tennessee Owned &amp; Operated. From Hole-in-the-Wall to High End:
                We&apos;ve Got You Covered.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Star className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-3">Quality Reviews</h3>
              <p className="text-gray-600">
                We maintain high standards for reviews and listings, ensuring you get accurate,
                helpful information for your dining decisions.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Heart className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-3">Supporting Local</h3>
              <p className="text-gray-600">
                Born in the Smokies, Built for Foodies. By connecting diners with local restaurants,
                we help strengthen the East Tennessee food scene and support local businesses.
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              TENNsational was created to celebrate and promote the incredible dining scene across East Tennessee.
              We believe that great food brings communities together, and every restaurant has a story worth sharing.
              Whether you&apos;re looking for authentic Southern comfort food, innovative cuisine, or a perfect family
              dining spot, we&apos;re here to help you discover what makes Tennessee dining truly sensational.
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
            ].map((county) => (
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
