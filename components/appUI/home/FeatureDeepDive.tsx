import React from "react";
import { Target, Clock, Award, TrendingUp } from "lucide-react"; // adjust if icons come from elsewhere

interface Feature {
  icon: React.ElementType;
  bgColor: string;
  iconColor: string;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: Target,
    bgColor: "bg-purple-100",
    iconColor: "text-primary",
    title: "ATS-Optimized Resumes",
    description:
      "Our ATS resume generator creates resumes that are fully optimized for Applicant Tracking Systems. We use the one-page format preferred by 95% of US hiring managers, ensuring your resume gets seen.",
  },
  {
    icon: Clock,
    bgColor: "bg-blue-100",
    iconColor: "text-blue-600",
    title: "Create a Resume in Minutes",
    description:
      "With our intuitive builder, you can create an ATS-optimized resume in under 5 minutes. No watermarks, no locked features, and no surprise charges—just a professional resume, fast.",
  },
  {
    icon: Award,
    bgColor: "bg-green-100",
    iconColor: "text-green-600",
    title: "Free Professional Templates",
    description:
      "Our free resume templates require no sign up and are designed by experts to be both visually appealing and highly functional. Make a great first impression without spending a dime.",
  },
  {
    icon: TrendingUp,
    bgColor: "bg-yellow-100",
    iconColor: "text-yellow-600",
    title: "No Hidden Fees, Ever",
    description:
      "This is a truly free resume builder with no credit card required and no hidden fees. We believe everyone deserves a chance to build a great resume, so our core features are free forever.",
  },
];

const AdvancedFeatures: React.FC = () => {
  return (
    <section className="py-20 px-4 bg-white/50 backdrop-blur-sm">
      <div className="container mx-auto">
        {/* Section Heading */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-gray-800">Advanced Features for Professional Results</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Our resume builder includes powerful features designed to help you create resumes that get results.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="flex items-start gap-4">
                <div
                  className={`w-12 h-12 ${feature.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}
                >
                  <Icon className={`w-6 h-6 ${feature.iconColor}`} />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AdvancedFeatures;
