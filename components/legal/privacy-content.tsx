"use client";

import React from "react";

export function PrivacyContent() {
  return (
    <>
      <h1 className="text-3xl font-bold text-slate-900 mb-6">Privacy Policy</h1>
      <div className="space-y-6 text-slate-700">
        <p>Last updated: August 30, 2026</p>

        <p>CreateFreeCV.com ("us", "we", or "our") operates the https://createfreecv.com website (the "Service").</p>

        <p>This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data. We use your data to provide and improve the Service. By using the Service, you agree to the collection and use of information in accordance with this policy.</p>

        <h2 className="text-2xl font-semibold text-slate-800 pt-4">Information Collection and Use</h2>
        <p>We collect several different types of information for various purposes to provide and improve our Service to you.</p>

        <h3 className="text-xl font-semibold text-slate-800 pt-2">Types of Data Collected</h3>
        <h4 className="font-semibold">Personal Data</h4>
        <p>While using our Service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you ("Personal Data"). Personally identifiable information may include, but is not limited to:</p>
        <ul className="list-disc list-inside pl-4">
          <li>Email address (only if you create an optional account)</li>
          <li>First name and last name</li>
          <li>Phone number (optional)</li>
          <li>Cookies and Usage Data</li>
        </ul>

        <h4 className="font-semibold">Usage Data</h4>
        <p>We may also collect information on how the Service is accessed and used ("Usage Data"). This Usage Data may include information such as your computer's Internet Protocol address (e.g. IP address), browser type, browser version, the pages of our Service that you visit, the time and date of your visit, the time spent on those pages, unique device identifiers and other diagnostic data.</p>

        <h4 className="font-semibold">Resume Data</h4>
        <p>When you create a resume, we collect and store the information you input including:</p>
        <ul className="list-disc list-inside pl-4">
          <li>Personal information (name, contact details)</li>
          <li>Work experience and education history</li>
          <li>Skills and certifications</li>
          <li>Professional summary and objectives</li>
        </ul>

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

        <h2 className="text-2xl font-semibold text-slate-800 pt-4">Cookies and Tracking Technologies</h2>
        <p>We use cookies and similar tracking technologies to track activity on our Service and hold certain information. On your first visit, a cookie consent banner lets you accept or decline non-essential (analytics) cookies before any such cookie is set — see "How We Obtain Consent" below.</p>

        <h4 className="font-semibold">What are cookies?</h4>
        <p>Cookies are files with small amount of data which may include an anonymous unique identifier. They are sent to your browser from a website and stored on your device. Tracking technologies also used are beacons, tags, and scripts to collect and track information and to improve and analyze our Service.</p>

        <h4 className="font-semibold">Types of Cookies we use:</h4>
        <ul className="list-disc list-inside pl-4">
          <li><strong>Essential Cookies:</strong> Required for the Service to function properly. These are not gated behind the cookie consent banner.</li>
          <li><strong>Analytics Cookies:</strong> Help us understand how visitors interact with our Service. Only set after you accept the cookie consent banner.</li>
          <li><strong>Advertising Cookies:</strong> Not currently used — we do not serve any advertisements at this time.</li>
          <li><strong>Functional Cookies:</strong> Remember your preferences and settings</li>
        </ul>

        <h2 className="text-2xl font-semibold text-slate-800 pt-4">How We Obtain Consent</h2>
        <p>When you first visit CreateFreeCV.com, a cookie consent banner asks you to Accept or Decline non-essential analytics cookies. Google Analytics, Google Tag Manager, and PostHog are only loaded after you choose Accept. You can change your choice at any time by clearing your browser's local storage for this site, which will show the banner again on your next visit.</p>

        <h2 className="text-2xl font-semibold text-slate-800 pt-4">Third-Party Services</h2>
        <p>We may employ third-party companies and individuals to facilitate our Service, provide the Service on our behalf, perform Service-related services, or assist us in analyzing how our Service is used.</p>

        <h4 className="font-semibold">Current Third-Party Partners:</h4>
        <ul className="list-disc list-inside pl-4">
          <li><strong>Google Analytics:</strong> For website analytics and user behavior tracking (loaded only after cookie consent)</li>
          <li><strong>Google Tag Manager:</strong> Used to manage and deploy the analytics tags listed here (loaded only after cookie consent)</li>
          <li><strong>PostHog:</strong> For product analytics and usage insights (loaded only after cookie consent)</li>
          <li><strong>Supabase:</strong> For optional cloud storage and authentication services</li>
        </ul>

        <h2 className="text-2xl font-semibold text-slate-800 pt-4">Data Retention</h2>
        <p>We retain your personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law.</p>

        <h4 className="font-semibold">Retention Periods:</h4>
        <ul className="list-disc list-inside pl-4">
          <li><strong>Resume Data:</strong> Stored locally in your browser until you clear it</li>
          <li><strong>Account Data:</strong> Retained while your account is active</li>
          <li><strong>Analytics Data:</strong> Retained for 26 months in anonymized form</li>
          <li><strong>Usage Logs:</strong> Automatically deleted after 90 days</li>
        </ul>

        <h2 className="text-2xl font-semibold text-slate-800 pt-4">Your Rights Under GDPR</h2>
        <p>If you are a resident of the European Union, you have certain rights under the General Data Protection Regulation (GDPR):</p>
        <ul className="list-disc list-inside pl-4">
          <li><strong>Right to Access:</strong> Request copies of your personal data</li>
          <li><strong>Right to Rectification:</strong> Request correction of inaccurate data</li>
          <li><strong>Right to Erasure:</strong> Request deletion of your personal data</li>
          <li><strong>Right to Restrict Processing:</strong> Limit how we use your data</li>
          <li><strong>Right to Data Portability:</strong> Transfer your data to another service</li>
          <li><strong>Right to Object:</strong> Object to processing of your data</li>
        </ul>

        <h2 className="text-2xl font-semibold text-slate-800 pt-4">Data Security</h2>
        <p>The security of your data is important to us. We use reasonable administrative, technical, and physical measures to protect your personal information from unauthorized access, use, or disclosure.</p>

        <h2 className="text-2xl font-semibold text-slate-800 pt-4">International Data Transfers</h2>
        <p>Your personal information may be transferred to, and maintained on, computers located outside of your state, province, country or other governmental jurisdiction where the data protection laws may differ from those of your jurisdiction.</p>

        <h2 className="text-2xl font-semibold text-slate-800 pt-4">Children's Privacy</h2>
        <p>Our Service does not address anyone under the age of 13 ("Children"). We do not knowingly collect personally identifiable information from anyone under the age of 13. If you are a parent or guardian and you are aware that your child has provided us with personal information, please contact us.</p>

        <h2 className="text-2xl font-semibold text-slate-800 pt-4">Changes to This Privacy Policy</h2>
        <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.</p>

        <h2 className="text-2xl font-semibold text-slate-800 pt-4">Advertising</h2>
        <p>We do not currently display third-party advertisements on CreateFreeCV.com. If we introduce an advertising partner in the future, we will update this policy beforehand and only load advertising cookies after you provide consent via our cookie consent banner.</p>

        <h2 className="text-2xl font-semibold text-slate-800 pt-4">Contact Us</h2>
        <p>If you have any questions about this Privacy Policy, please contact us by:</p>
        <ul className="list-disc list-inside pl-4">
          <li>Visiting our contact page on our website</li>
          <li>Emailing us at: createfreecv@gmail.com</li>
          <li>Using our contact form available on the website</li>
        </ul>
      </div>
    </>
  );
}
