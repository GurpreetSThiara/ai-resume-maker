import { ValueProps } from "@/app/constants/global";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const Values = () => {
    return (
          <section className="py-20 px-4">
                <div className="container mx-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {ValueProps.map((feature, index) => {
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