"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Briefcase, TrendingUp, FileText } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { RESUME_EXAMPLES } from "@/data/resume-examples"
import { setLocalStorageJSON, setLocalStorageItem, LS_KEYS } from "@/utils/localstorage"
import { CREATE_RESUME } from "@/config/urls"

export function FeaturedExamplesSection() {
    const router = useRouter()

    // Select 3 featured examples (Software Engineer, Product Manager, UX Designer)
    const featuredExamples = RESUME_EXAMPLES.filter(example =>
        ['senior-software-engineer', 'product-manager', 'ux-ui-designer'].includes(example.id)
    )

    const handleUseExample = (example: typeof RESUME_EXAMPLES[0]) => {
        // Store the example data in localStorage
        setLocalStorageJSON(LS_KEYS.resumeData, example.data)

        // Reset step tracking
        setLocalStorageItem(LS_KEYS.currentStep, "0")
        setLocalStorageJSON(LS_KEYS.completedSteps, [])

        // Navigate to editor with template as URL parameter
        router.push(`${CREATE_RESUME}/create?source=example&template=${example.templateId}`)
    }

    const getExperienceBadgeColor = (level: string) => {
        switch (level) {
            case 'entry': return 'bg-green-100 text-green-700 hover:bg-green-200'
            case 'mid': return 'bg-blue-100 text-blue-700 hover:bg-blue-200'
            case 'senior': return 'bg-purple-100 text-purple-700 hover:bg-purple-200'
            case 'executive': return 'bg-orange-100 text-orange-700 hover:bg-orange-200'
            default: return 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }
    }

    return (
        <section className="relative py-20 px-4 overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-purple-50/30 to-pink-50/50 pointer-events-none" />
            <div className="absolute top-20 right-10 w-64 h-64 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-full blur-3xl" />
            <div className="absolute bottom-20 left-10 w-64 h-64 bg-gradient-to-br from-blue-200/30 to-indigo-200/30 rounded-full blur-3xl" />

            <div className="container mx-auto max-w-7xl relative z-10">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <Badge className="mb-4 text-sm px-4 py-1.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0">
                        <FileText className="w-4 h-4 mr-2 inline" />
                        Resume Examples
                    </Badge>
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 bg-clip-text text-transparent">
                        Get Inspired by Real Examples
                    </h2>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Start with a professionally crafted resume example and customize it to match your experience
                    </p>
                </div>

                {/* Featured Examples Grid */}
                <div className="grid md:grid-cols-3 gap-6 mb-10">
                    {featuredExamples.map((example) => (
                        <Card
                            key={example.id}
                            className="group hover:shadow-xl transition-all duration-300 border-slate-200 hover:border-purple-300 bg-white/80 backdrop-blur-sm"
                        >
                            <CardHeader>
                                <div className="flex items-start justify-between mb-2">
                                    <Badge variant="outline" className="text-xs">
                                        {example.industry}
                                    </Badge>
                                    <Badge className={`text-xs ${getExperienceBadgeColor(example.experienceLevel)}`}>
                                        {example.experienceLevel}
                                    </Badge>
                                </div>
                                <CardTitle className="text-xl group-hover:text-purple-600 transition-colors">
                                    {example.title}
                                </CardTitle>
                                <CardDescription className="text-sm line-clamp-2">
                                    {example.description}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3 mb-4">
                                    <div className="flex items-center text-sm text-slate-600">
                                        <Briefcase className="w-4 h-4 mr-2 text-purple-500" />
                                        <span className="font-medium">{example.data.basics.name}</span>
                                    </div>
                                    <div className="flex items-center text-sm text-slate-600">
                                        <TrendingUp className="w-4 h-4 mr-2 text-purple-500" />
                                        <span>{example.data.sections.length} sections included</span>
                                    </div>
                                </div>
                                <Button
                                    onClick={() => handleUseExample(example)}
                                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white group-hover:shadow-lg transition-all"
                                >
                                    Use This Example
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* View All Button */}
                <div className="text-center">
                    <Link href="/resume-examples">
                        <Button
                            size="lg"
                            variant="outline"
                            className="group border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white transition-all"
                        >
                            View All {RESUME_EXAMPLES.length} Examples
                            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    )
}
