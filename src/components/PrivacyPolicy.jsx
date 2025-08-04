import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link 
            to="/" 
            className="inline-flex items-center text-primary hover:text-primary/80 transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
          <p className="text-gray-600 mt-2">Effective Date: August 4, 2025</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">
          
          {/* Introduction */}
          <section>
            <p className="text-gray-700 leading-relaxed">
              At TENNsational.com, we are committed to protecting your privacy and safeguarding your personal information. 
              This Privacy Policy outlines how we collect, use, and share information when you visit our website, 
              www.tennsational.com ("Site").
            </p>
          </section>

          {/* Information We Collect */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Information We Collect</h2>
            <p className="text-gray-700 mb-4">We collect information in the following ways:</p>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">a. Voluntarily Provided Information:</h3>
                <p className="text-gray-700">
                  When you fill out forms (e.g., submitting a restaurant review, joining our newsletter, or contacting us), 
                  we may collect your name, email address, and any other information you provide.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">b. Automatically Collected Information:</h3>
                <p className="text-gray-700 mb-2">
                  We use cookies and similar technologies to collect anonymous data such as:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  <li>IP address</li>
                  <li>Browser type</li>
                  <li>Device information</li>
                  <li>Pages visited and time spent</li>
                  <li>Referring URLs</li>
                </ul>
                <p className="text-gray-700 mt-2">
                  This helps us improve the functionality and user experience of our Site.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">c. Third-Party Tools:</h3>
                <p className="text-gray-700">
                  We use Google Analytics and may use Google AdSense, which may collect additional data as part of their 
                  tracking and advertising services. Please review their respective privacy policies for more information:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4 mt-2">
                  <li>
                    <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" 
                       className="text-primary hover:underline">
                      Google Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer" 
                       className="text-primary hover:underline">
                      How Google uses data from sites or apps that use our services
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* How We Use Your Information */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. How We Use Your Information</h2>
            <p className="text-gray-700 mb-2">We use your information to:</p>
            <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
              <li>Improve our website's content and performance</li>
              <li>Respond to inquiries and review submissions</li>
              <li>Send periodic updates (if you opt in to our newsletter)</li>
              <li>Display relevant advertising through third-party networks (e.g., Google AdSense)</li>
              <li>Maintain website security and monitor analytics</li>
              <li>Moderate and approve user-generated content (reviews and ratings)</li>
            </ul>
          </section>

          {/* Sharing Your Information */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Sharing Your Information</h2>
            <p className="text-gray-700 mb-2">
              We do not sell, rent, or trade your personal information to outside parties. However, we may share data with:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
              <li>Trusted third-party vendors who help operate our website (under confidentiality agreements)</li>
              <li>Legal authorities when required by law</li>
              <li>Service providers for newsletter delivery and website hosting</li>
            </ul>
          </section>

          {/* Cookies & Tracking */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Cookies & Tracking Technologies</h2>
            <p className="text-gray-700 mb-2">We use cookies to:</p>
            <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
              <li>Enhance website functionality</li>
              <li>Remember your preferences and settings</li>
              <li>Measure traffic and performance</li>
              <li>Store newsletter subscription preferences</li>
              <li>Display personalized ads via Google AdSense (if applicable)</li>
            </ul>
            <p className="text-gray-700 mt-2">
              You can manage or disable cookies through your browser settings. Please note, disabling cookies may affect 
              how our Site functions.
            </p>
          </section>

          {/* Third-Party Links */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Third-Party Links</h2>
            <p className="text-gray-700">
              Our website may include links to external websites (such as restaurant websites, Google Maps, social media, 
              or our merchandise store). We are not responsible for the privacy practices of these other sites. 
              Please review their privacy policies separately.
            </p>
          </section>

          {/* Your Rights */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Your Rights</h2>
            <p className="text-gray-700 mb-2">You have the right to:</p>
            <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
              <li>Access and update your personal information</li>
              <li>Request deletion of your data (where applicable)</li>
              <li>Opt out of receiving promotional emails</li>
              <li>Request removal of your reviews or comments</li>
            </ul>
            <p className="text-gray-700 mt-2">
              To exercise any of these rights, please contact us at: 
              <a href="mailto:Admin@tennsational.com" className="text-primary hover:underline ml-1">
                Admin@tennsational.com
              </a>
            </p>
          </section>

          {/* Children's Privacy */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Children's Privacy</h2>
            <p className="text-gray-700">
              TENNsational.com is not directed at children under 13. We do not knowingly collect personal information 
              from anyone under the age of 13. If you believe we have unknowingly collected such data, please contact 
              us immediately.
            </p>
          </section>

          {/* Data Security */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Data Security</h2>
            <p className="text-gray-700">
              We implement appropriate security measures to protect your personal information against unauthorized access, 
              alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic 
              storage is 100% secure.
            </p>
          </section>

          {/* Changes to Policy */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Changes to This Policy</h2>
            <p className="text-gray-700">
              We may update this Privacy Policy from time to time. Changes will be posted on this page with a new 
              effective date. We encourage you to review this page periodically.
            </p>
          </section>

          {/* Contact Information */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Contact Us</h2>
            <p className="text-gray-700 mb-2">
              If you have questions or concerns about this Privacy Policy, please contact:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700 font-medium">TENNsational Admin</p>
              <p className="text-gray-700">
                Email: 
                <a href="mailto:Admin@tennsational.com" className="text-primary hover:underline ml-1">
                  Admin@tennsational.com
                </a>
              </p>
              <p className="text-gray-700">
                Website: 
                <a href="https://www.tennsational.com" className="text-primary hover:underline ml-1">
                  www.TENNsational.com
                </a>
              </p>
            </div>
          </section>

          {/* Last Updated */}
          <section className="border-t pt-6">
            <p className="text-sm text-gray-500">
              This Privacy Policy was last updated on August 4, 2025.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}

