import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | CreateFreeCV.com',
  description: 'Read the privacy policy for CreateFreeCV.com to understand how we handle your data.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-white p-8 shadow-lg rounded-lg border-gray-200">
          <h1 className="text-3xl font-bold text-slate-900 mb-6">Privacy Policy</h1>
          <div className="space-y-6 text-slate-700">
            <p>Last updated: October 11, 2025</p>
            
            <p>CreateFreeCV.com ("us", "we", or "our") operates the https://createfreecv.com website (the "Service").</p>
            
            <p>This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data. We use your data to provide and improve the Service. By using the Service, you agree to the collection and use of information in accordance with this policy.</p>

            <h2 className="text-2xl font-semibold text-slate-800 pt-4">Information Collection and Use</h2>
            <p>We collect several different types of information for various purposes to provide and improve our Service to you.</p>

            <h3 className="text-xl font-semibold text-slate-800 pt-2">Types of Data Collected</h3>
            <h4>Personal Data</h4>
            <p>While using our Service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you ("Personal Data"). Personally identifiable information may include, but is not limited to:</p>
            <ul className="list-disc list-inside pl-4">
              <li>Email address</li>
              <li>First name and last name</li>
              <li>Cookies and Usage Data</li>
            </ul>

            <h4>Usage Data</h4>
            <p>We may also collect information on how the Service is accessed and used ("Usage Data"). This Usage Data may include information such as your computer's Internet Protocol address (e.g. IP address), browser type, browser version, the pages of our Service that you visit, the time and date of your visit, the time spent on those pages, unique device identifiers and other diagnostic data.</p>

            <h2 className="text-2xl font-semibold text-slate-800 pt-4">Use of Data</h2>
            <p>CreateFreeCV.com uses the collected data for various purposes:</p>
            <ul className="list-disc list-inside pl-4">
              <li>To provide and maintain the Service</li>
              <li>To notify you about changes to our Service</li>
              <li>To allow you to participate in interactive features of our Service when you choose to do so</li>
              <li>To provide customer care and support</li>
              <li>To provide analysis or valuable information so that we can improve the Service</li>
              <li>To monitor the usage of the Service</li>
              <li>To detect, prevent and address technical issues</li>
            </ul>

            <h2 className="text-2xl font-semibold text-slate-800 pt-4">Changes to This Privacy Policy</h2>
            <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.</p>

            <h2 className="text-2xl font-semibold text-slate-800 pt-4">Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us by visiting the contact page on our website.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
