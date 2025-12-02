"use client";

import React from "react";

export function PrivacyContent() {
  return (
    <>
      <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4 sm:mb-6">Privacy Policy</h1>
      <div className="space-y-4 sm:space-y-6 text-slate-700 text-sm sm:text-base">
        <p className="text-slate-600">Last updated: November 26, 2025</p>

        <p>
          This Privacy Policy explains how we collect, use, and protect your information when you
          use CreateFreeCV.com. By using the Service, you agree to the collection and use of
          information in accordance with this policy.
        </p>

        <h2 className="text-xl sm:text-2xl font-semibold text-slate-800 pt-4">Information We Collect</h2>
        <p>We may collect the following types of information when you use our Service:</p>
        <ul className="list-disc list-inside pl-4 mt-2 space-y-1">
          <li>Resume content you enter into the builder</li>
          <li>Account information such as email address when you create an account</li>
          <li>Basic usage data to help us improve the product</li>
        </ul>

        <h2 className="text-xl sm:text-2xl font-semibold text-slate-800 pt-4">How We Use Your Information</h2>
        <p>We use your information to:</p>
        <ul className="list-disc list-inside pl-4 mt-2 space-y-1">
          <li>Provide and maintain the resume builder Service</li>
          <li>Save and load your resumes when you sign in</li>
          <li>Improve the performance and usability of the product</li>
          <li>Communicate important updates about the Service</li>
        </ul>

        <h2 className="text-xl sm:text-2xl font-semibold text-slate-800 pt-4">Data Storage and Security</h2>
        <p>
          We take reasonable technical and organizational measures to protect your information from
          unauthorized access, disclosure, alteration, or destruction. However, no method of
          transmission over the Internet or method of electronic storage is 100% secure.
        </p>

        <h2 className="text-xl sm:text-2xl font-semibold text-slate-800 pt-4">Third-Party Services</h2>
        <p>
          We may use trusted third-party services (such as Supabase) to provide authentication,
          storage, and analytics. These providers have access to your information only to perform
          these tasks on our behalf and are obligated not to disclose or use it for other purposes.
        </p>

        <h2 className="text-xl sm:text-2xl font-semibold text-slate-800 pt-4">Your Choices</h2>
        <p>You can:</p>
        <ul className="list-disc list-inside pl-4 mt-2 space-y-1">
          <li>Update your account information in your profile settings</li>
          <li>Delete your account and associated cloud resumes at any time</li>
          <li>Contact us if you have questions about your data</li>
        </ul>

        <h2 className="text-xl sm:text-2xl font-semibold text-slate-800 pt-4">Contact</h2>
        <p>
          If you have any questions about this Privacy Policy, you can contact us at
          createfreecv@gmail.com.
        </p>
      </div>
    </>
  );
}
