import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cookie Policy | CreateFreeCV.com',
  description: 'Read our Cookie Policy to understand how CreateFreeCV.com uses cookies and tracking technologies.',
};

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-white p-8 shadow-lg rounded-lg border-gray-200">
          <h1 className="text-3xl font-bold text-slate-900 mb-6">Cookie Policy</h1>
          <div className="space-y-6 text-slate-700">
            <p>Last updated: November 26, 2025</p>
            
            <p>This Cookie Policy explains how CreateFreeCV.com ("we", "us", or "our") uses cookies and similar tracking technologies when you visit our website and how you can manage your cookie preferences.</p>

            <h2 className="text-2xl font-semibold text-slate-800 pt-4">What Are Cookies?</h2>
            <p>Cookies are small text files that are stored on your device (computer, tablet, or mobile) when you visit a website. They are widely used to make websites work more efficiently and to provide information to website owners.</p>
            
            <p>Cookies can be categorized based on their function and lifespan:</p>
            <ul className="list-disc list-inside pl-4">
              <li><strong>Session Cookies:</strong> Temporary cookies that are deleted when you close your browser</li>
              <li><strong>Persistent Cookies:</strong> Cookies that remain on your device for a set period or until you delete them</li>
              <li><strong>First-Party Cookies:</strong> Cookies set by the website you're visiting</li>
              <li><strong>Third-Party Cookies:</strong> Cookies set by external services integrated into the website</li>
            </ul>

            <h2 className="text-2xl font-semibold text-slate-800 pt-4">How We Use Cookies</h2>
            <p>We use cookies for several purposes to enhance your experience and improve our services:</p>
            
            <h3 className="text-xl font-semibold text-slate-800 pt-2">Essential Cookies</h3>
            <p>These cookies are necessary for the website to function properly and cannot be disabled in our systems. They are usually only set in response to actions made by you which amount to a request for services.</p>
            <ul className="list-disc list-inside pl-4">
              <li>Maintaining user session state</li>
              <li>Remembering your resume data during editing</li>
              <li>Managing authentication (if you create an account)</li>
              <li>Security and fraud prevention</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-800 pt-2">Analytics Cookies</h3>
            <p>These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.</p>
            <ul className="list-disc list-inside pl-4">
              <li><strong>Google Analytics:</strong> Measures website traffic and user behavior</li>
              <li><strong>Vercel Analytics:</strong> Monitors website performance and user engagement</li>
              <li>Tracking which pages are most popular</li>
              <li>Measuring time spent on different sections</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-800 pt-2">Functional Cookies</h3>
            <p>These cookies allow us to remember choices you make and provide enhanced features.</p>
            <ul className="list-disc list-inside pl-4">
              <li>Remembering your preferred resume template</li>
              <li>Saving your progress in the resume builder</li>
              <li>Customizing content based on your preferences</li>
              <li>Language and region preferences</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-800 pt-2">Advertising Cookies (Future Use)</h3>
            <p>These cookies are used to deliver advertisements that are relevant to you and your interests. Currently, we are not using advertising cookies as we are in the process of applying for Google AdSense approval.</p>
            <ul className="list-disc list-inside pl-4">
              <li>Personalized ad delivery (when implemented)</li>
              <li>Ad frequency capping</li>
              <li>Measuring ad campaign effectiveness</li>
            </ul>

            <h2 className="text-2xl font-semibold text-slate-800 pt-4">Third-Party Cookies</h2>
            <p>We use various third-party services that may set their own cookies on your device. These include:</p>
            
            <h4 className="font-semibold">Google Services</h4>
            <ul className="list-disc list-inside pl-4">
              <li><strong>Google Analytics:</strong> Uses cookies to analyze website traffic (_ga, _gid, _gat)</li>
              <li><strong>Google AdSense:</strong> Will use cookies for ad serving when approved (id, doubleclick)</li>
            </ul>

            <h4 className="font-semibold">Other Third Parties</h4>
            <ul className="list-disc list-inside pl-4">
              <li><strong>Supabase:</strong> Authentication and database services</li>
              <li><strong>Vercel:</strong> Hosting and analytics services</li>
            </ul>

            <h2 className="text-2xl font-semibold text-slate-800 pt-4">Cookie Duration</h2>
            <p>Different cookies have different lifespans:</p>
            <ul className="list-disc list-inside pl-4">
              <li><strong>Session Cookies:</strong> Deleted when you close your browser</li>
              <li><strong>Persistent Cookies:</strong> Typically expire after 30 days to 2 years</li>
              <li><strong>Analytics Cookies:</strong> Usually expire after 2 years</li>
              <li><strong>Authentication Cookies:</strong> Expire based on your session settings</li>
            </ul>

            <h2 className="text-2xl font-semibold text-slate-800 pt-4">Managing Your Cookie Preferences</h2>
            <p>You have several options to manage cookies:</p>
            
            <h4 className="font-semibold">Browser Settings</h4>
            <p>Most web browsers allow you to control cookies through their settings:</p>
            <ul className="list-disc list-inside pl-4">
              <li><strong>Accept/Reject All Cookies:</strong> Set your browser to accept or reject all cookies</li>
              <li><strong>Third-Party Cookies:</strong> Block or allow third-party cookies</li>
              <li><strong>Delete Cookies:</strong> Clear existing cookies from your browser</li>
              <li><strong>Notifications:</strong> Set browser to notify you when cookies are set</li>
            </ul>

            <h4 className="font-semibold">Browser-Specific Instructions</h4>
            <ul className="list-disc list-inside pl-4">
              <li><strong>Chrome:</strong> Settings → Privacy and security → Cookies and other site data</li>
              <li><strong>Firefox:</strong> Options → Privacy & Security → Cookies and Site Data</li>
              <li><strong>Safari:</strong> Preferences → Privacy → Cookies and website data</li>
              <li><strong>Edge:</strong> Settings → Privacy, search, and services → Cookies and site data</li>
            </ul>

            <h4 className="font-semibold">Opt-Out of Analytics</h4>
            <p>You can opt out of Google Analytics tracking by installing the Google Analytics Opt-out Browser Add-on or by using the Google Ads Settings.</p>

            <h2 className="text-2xl font-semibold text-slate-800 pt-4">Impact of Disabling Cookies</h2>
            <p>If you choose to disable cookies, some features of our website may not function properly:</p>
            <ul className="list-disc list-inside pl-4">
              <li>You may need to log in more frequently</li>
              <li>Your resume progress may not be saved automatically</li>
              <li>Personalized features may not work</li>
              <li>Some parts of the website may not load correctly</li>
            </ul>

            <h2 className="text-2xl font-semibold text-slate-800 pt-4">Cookie Policy Updates</h2>
            <p>We may update this Cookie Policy from time to time to reflect changes in our use of cookies or in response to legal requirements. Any changes will be posted on this page with an updated date.</p>

            <h2 className="text-2xl font-semibold text-slate-800 pt-4">Contact Us</h2>
            <p>If you have any questions about our use of cookies, please contact us:</p>
            <ul className="list-disc list-inside pl-4">
              <li>Email: createfreecv@gmail.com</li>
              <li>Contact form: Available on our website</li>
              <li>Visit our contact page for more options</li>
            </ul>

            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Cookie Consent</h3>
              <p className="text-blue-800">By continuing to use our website, you consent to the use of cookies in accordance with this Cookie Policy. You can change your cookie preferences at any time by adjusting your browser settings.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
