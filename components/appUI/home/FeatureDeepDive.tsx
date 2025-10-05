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
    title: "ATS Optimization",
    description:
      "Our templates are specifically designed to pass through Applicant Tracking Systems. Use industry-standard formatting and keywords to increase your chances of getting noticed.",
  },
  {
    icon: Clock,
    bgColor: "bg-blue-100",
    iconColor: "text-blue-600",
    title: "Quick & Easy",
    description:
      "Create a professional resume in under 5 minutes. Our streamlined process guides you through each section with helpful tips and suggestions.",
  },
  {
    icon: Award,
    bgColor: "bg-green-100",
    iconColor: "text-green-600",
    title: "Professional Templates",
    description:
      "Choose from a variety of professionally designed templates suitable for different industries and career levels. All templates are ATS-friendly.",
  },
  {
    icon: TrendingUp,
    bgColor: "bg-yellow-100",
    iconColor: "text-yellow-600",
    title: "Career Growth",
    description:
      "Our resume builder helps you highlight your achievements and skills effectively, positioning you for career advancement and better job opportunities.",
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
