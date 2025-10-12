import { CoreFeatures, AIFeatures } from "@/app/constants/global";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const Values = () => {
    return (
          <section className="py-20 px-4">
                <div className="container mx-auto">
                  <div className="text-center mb-12">
                    <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl mb-4">Core Free Features (No Login Required)</h2>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">Everything you need to build a professional resume, completely free, no strings attached.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
                    {CoreFeatures.map((feature, index) => {
                      const Icon = feature.icon;
                      return (
                        <Card 
                          key={index} 
                          className={`h-full border-0 shadow-lg bg-gradient-to-br ${feature.gradientFrom} ${feature.gradientTo} flex flex-col`}
                        >
                          <CardHeader className="flex flex-col items-center text-center">
                            <div className="flex justify-center w-full">
                              <Icon className={`w-12 h-12 ${feature.iconColor} mb-4`} />
                            </div>
                            <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
                            <CardDescription className="px-2">{feature.description}</CardDescription>
                          </CardHeader>
                        </Card>
                      );
                    })}
                  </div>

                  <div className="text-center mb-12">
                    <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl mb-4">Supercharge Your Resume with a Free AI Account</h2>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">Create a free account to unlock powerful AI features that will make your resume stand out.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {AIFeatures.map((feature, index) => {
                      const Icon = feature.icon;
                      return (
                        <Card 
                          key={index} 
                          className={`h-full border-0 shadow-lg bg-gradient-to-br ${feature.gradientFrom} ${feature.gradientTo} flex flex-col`}
                        >
                          <CardHeader className="flex flex-col items-center text-center">
                            <div className="flex justify-center w-full">
                              <Icon className={`w-12 h-12 ${feature.iconColor} mb-4`} />
                            </div>
                            <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
                            <CardDescription className="px-2">{feature.description}</CardDescription>
                          </CardHeader>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              </section>
    )
}