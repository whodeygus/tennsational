import { Card, CardContent } from './ui/card';
import '../App.css';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-xl text-gray-600">
            Your privacy is important to us. This policy explains how we collect, use, and protect your information.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <Card className="mb-8">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Information We Collect</h2>
            <div className="space-y-4 text-gray-700">
              <p>
                We collect information you provide directly to us, such as when you:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Subscribe to our newsletter</li>
                <li>Submit restaurant information or reviews</li>
                <li>Contact us through our website</li>
                <li>Use our search and filtering features</li>
              </ul>
              
              <p>
                We also automatically collect certain information when you visit our website, including:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Your IP address and browser information</li>
                <li>Pages you visit and time spent on our site</li>
                <li>Referring website information</li>
                <li>Device and operating system information</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">How We Use Your Information</h2>
            <div className="space-y-4 text-gray-700">
              <p>We use the information we collect to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide and improve our restaurant directory services</li>
                <li>Send you newsletters and updates (with your consent)</li>
                <li>Respond to your inquiries and provide customer support</li>
                <li>Analyze website usage and improve user experience</li>
                <li>Prevent fraud and ensure website security</li>
                <li>Comply with legal obligations</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Cookies and Tracking Technologies</h2>
            <div className="space-y-4 text-gray-700">
              <p>
                We use cookies and similar tracking technologies to enhance your experience on our website. 
                These technologies help us:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Remember your preferences and settings</li>
                <li>Analyze website traffic and user behavior</li>
                <li>Provide personalized content and advertisements</li>
                <li>Improve website functionality and performance</li>
              </ul>
              <p>
                You can control cookies through your browser settings, but disabling cookies may affect 
                some website functionality.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Third-Party Services</h2>
            <div className="space-y-4 text-gray-700">
              <p>
                Our website may use third-party services that collect information used to identify you:
              </p>
              
              <h3 className="text-lg font-semibold mt-6 mb-2">Google AdSense</h3>
              <p>
                We use Google AdSense to display advertisements. Google may use cookies to serve ads based on 
                your visits to our site and other sites on the Internet. You can opt out of personalized 
                advertising by visiting Google's Ads Settings.
              </p>
              
              <h3 className="text-lg font-semibold mt-6 mb-2">Google Analytics</h3>
              <p>
                We use Google Analytics to analyze website usage. Google Analytics uses cookies to collect 
                information about how visitors use our site. This information is used to compile reports 
                and help us improve our website.
              </p>
              
              <h3 className="text-lg font-semibold mt-6 mb-2">Social Media</h3>
              <p>
                Our website may include social media features and widgets. These features may collect your 
                IP address and page information, and may set cookies to enable proper functionality.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Information Sharing</h2>
            <div className="space-y-4 text-gray-700">
              <p>
                We do not sell, trade, or otherwise transfer your personal information to third parties, 
                except in the following circumstances:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>With your explicit consent</li>
                <li>To comply with legal obligations or court orders</li>
                <li>To protect our rights, property, or safety</li>
                <li>In connection with a business transfer or merger</li>
                <li>With service providers who assist in website operations (under strict confidentiality agreements)</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Security</h2>
            <div className="space-y-4 text-gray-700">
              <p>
                We implement appropriate security measures to protect your personal information against 
                unauthorized access, alteration, disclosure, or destruction. However, no method of 
                transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
              </p>
              <p>
                We regularly review our data collection, storage, and processing practices to ensure 
                the security of your personal information.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Rights</h2>
            <div className="space-y-4 text-gray-700">
              <p>You have the right to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Access the personal information we have about you</li>
                <li>Request correction of inaccurate information</li>
                <li>Request deletion of your personal information</li>
                <li>Opt out of marketing communications</li>
                <li>Restrict or object to certain processing of your information</li>
              </ul>
              <p>
                To exercise these rights, please contact us using the information provided below.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Children's Privacy</h2>
            <div className="space-y-4 text-gray-700">
              <p>
                Our website is not intended for children under 13 years of age. We do not knowingly 
                collect personal information from children under 13. If we become aware that we have 
                collected personal information from a child under 13, we will take steps to delete 
                such information.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes to This Policy</h2>
            <div className="space-y-4 text-gray-700">
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any changes 
                by posting the new Privacy Policy on this page and updating the "Last updated" date.
              </p>
              <p>
                We encourage you to review this Privacy Policy periodically for any changes.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
            <div className="space-y-4 text-gray-700">
              <p>
                If you have any questions about this Privacy Policy or our privacy practices, 
                please contact us at:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p><strong>TENNsational</strong></p>
                <p>Email: privacy@tennsational.com</p>
                <p>Website: www.tennsational.com</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

