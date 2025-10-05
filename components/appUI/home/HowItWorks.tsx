import { CREATE_STEPS } from "@/app/constants/global";

export const HowItWorks: React.FC = () => {
    return (
      <section className="py-20 px-4 bg-green-50">
        <div className="container mx-auto">
          {/* Section Heading */}
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-800">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Create your professional resume in just 3 simple steps. Our step-by-step process makes resume writing easy and
              effective.
            </p>
          </div>
  
          {/* Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {CREATE_STEPS.map((step) => (
              <div key={step.number} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-green-800 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                  {step.number}
                </div>
                <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };
  