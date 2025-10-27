import { Check, X } from 'lucide-react';

export const WhyChooseUsSection = () => {
  const features = [
    { name: 'Sign Up Required', createFreeCv: false, competitors: true },
    { name: 'Credit Card Required', createFreeCv: false, competitors: true },
    { name: 'Hidden Fees at Download', createFreeCv: false, competitors: true },
    { name: 'ATS-Optimized Templates', createFreeCv: true, competitors: false },
    { name: 'Instant DOCX Download', createFreeCv: true, competitors: false },
    { name: 'No Watermarks', createFreeCv: true, competitors: false },
  ];

  return (
    <section className="py-20 px-4 bg-white">
      <div className="container mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-10 text-center">Why Choose Our Free Resume Builder?</h2>
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg border border-gray-200">
            <div className="grid grid-cols-3 font-semibold text-center border-b border-gray-200">
              <div className="p-4">Feature</div>
              <div className="p-4 bg-green-50 text-green-800">CreateFreeCV</div>
              <div className="p-4 bg-red-50 text-red-800">Other "Free" Builders</div>
            </div>
            {features.map((feature, index) => (
              <div key={index} className="grid grid-cols-3 text-center items-center border-b border-gray-100 last:border-b-0">
                <div className="p-4 text-left font-medium text-slate-700">{feature.name}</div>
                <div className="p-4 flex justify-center">
                  {feature.createFreeCv ? <Check className="w-6 h-6 text-green-500" /> : <X className="w-6 h-6 text-red-500" />}
                </div>
                <div className="p-4 flex justify-center">
                  {feature.competitors ? <Check className="w-6 h-6 text-green-500" /> : <X className="w-6 h-6 text-red-500" />}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
