import { CoreFeatures, AIFeatures } from "@/app/constants/global";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const Values = () => {
    return (
          <section className="py-20 px-4 bg-linear-to-b from-white to-slate-50/30">
                <div className="container mx-auto">
                  <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-linear-to-r from-green-50 to-emerald-50 border border-green-200 rounded-full mb-6">
                      <Badge className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-sm font-medium text-green-700">Core Features</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 mb-6">
                      Everything You Need to Build a Professional Resume
                    </h2>
                    <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                      Powerful features completely free, no strings attached. Start building your perfect resume right away.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
                    {CoreFeatures.map((feature, index) => {
                      const Icon = feature.icon;
                      return (
                        <Card 
                          key={index} 
                          className={`group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 bg-linear-to-br ${feature.gradientFrom} ${feature.gradientTo} rounded-2xl`}
                        >
                          <div className="absolute inset-0 bg-linear-to-br from-white/0 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                          <div className="absolute -top-4 -right-4 w-24 h-24 bg-linear-to-br from-white/30 to-transparent rounded-full blur-2xl" />
                          
                          <CardHeader className="flex flex-col items-center text-center p-8 relative z-10">
                            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-linear-to-r ${feature.gradientFrom} ${feature.gradientTo} shadow-lg mb-6 transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 border border-white/50`}>
                              <Icon className={`w-8 h-8 ${feature.iconColor}`} />
                            </div>
                            <CardTitle className="text-xl md:text-2xl mb-4 font-bold text-slate-800">
                              {feature.title}
                            </CardTitle>
                            <CardDescription className="text-slate-600 leading-relaxed text-base">
                              {feature.description}
                            </CardDescription>
                          </CardHeader>
                        </Card>
                      );
                    })}
                  </div>
{/* 
                  <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-linear-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-full mb-6">
                      <Badge className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                      <span className="text-sm font-medium text-purple-700">Coming Soon</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 mb-6">
                      Supercharge Your Resume with AI
                    </h2>
                    <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                      Create a free account to unlock powerful AI features that will make your resume stand out from the crowd.
                    </p>
                  </div> */}
                  
                  {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {AIFeatures.map((feature, index) => {
                      const Icon = feature.icon;
                      return (
                        <Card 
                          key={index} 
                          className={`group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 bg-linear-to-br ${feature.gradientFrom} ${feature.gradientTo} rounded-2xl opacity-75`}
                        >
                          <div className="absolute inset-0 bg-linear-to-br from-white/0 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                          <div className="absolute -top-4 -right-4 w-24 h-24 bg-linear-to-br from-white/30 to-transparent rounded-full blur-2xl" />
                          
                          <CardHeader className="flex flex-col items-center text-center p-8 relative z-10">
                            <div className="relative">
                              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-linear-to-r ${feature.gradientFrom} ${feature.gradientTo} shadow-lg mb-6 transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 border border-white/50`}>
                                <Icon className={`w-8 h-8 ${feature.iconColor}`} />
                              </div>
                              <div className="absolute -top-1 -right-1">
                                <Badge className="bg-linear-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full">
                                  Soon
                                </Badge>
                              </div>
                            </div>
                            <CardTitle className="text-xl md:text-2xl mb-4 font-bold text-slate-800">
                              {feature.title}
                            </CardTitle>
                            <CardDescription className="text-slate-600 leading-relaxed text-base">
                              {feature.description}
                            </CardDescription>
                          </CardHeader>
                        </Card>
                      );
                    })}
                  </div> */}
                </div>
              </section>
    )
}