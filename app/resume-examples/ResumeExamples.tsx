"use client"

import { useState } from "react"
import Link from "next/link"
import { RESUME_EXAMPLES, INDUSTRIES, ResumeExample } from "@/data/resume-examples"
import { CREATE_RESUME } from "@/config/urls"
import { setLocalStorageJSON, LS_KEYS, setLocalStorageItem } from "@/utils/localstorage"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, Briefcase, TrendingUp } from "lucide-react"

export function ResumeExamples() {
    const [selectedIndustry, setSelectedIndustry] = useState("All Industries")
    const router = useRouter()

    const filteredExamples = selectedIndustry === "All Industries"
        ? RESUME_EXAMPLES
        : RESUME_EXAMPLES.filter(example => example.industry === selectedIndustry)

    const handleUseExample = (example: ResumeExample) => {
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
            case "entry":
                return "bg-green-100 text-green-800 border-green-200"
            case "mid":
                return "bg-blue-100 text-blue-800 border-blue-200"
            case "senior":
                return "bg-purple-100 text-purple-800 border-purple-200"
            case "executive":
                return "bg-orange-100 text-orange-800 border-orange-200"
            default:
                return "bg-gray-100 text-gray-800 border-gray-200"
        }
    }

    return (
        <main className="max-w-7xl mx-auto px-4 py-10">
            {/* Header Section */}
            <header className="mb-12 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-full mb-4">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-700">Professional Resume Examples</span>
                </div>

                <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-slate-900 via-blue-800 to-slate-900 bg-clip-text text-transparent">
                    Real Resume Examples
                </h1>

                <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto mb-6">
                    Browse professional resume samples from various industries. Each example is fully editable and ready to customize with your own information.
                </p>

                {/* Filter */}
                <div className="flex justify-center items-center gap-3 mb-8">
                    <span className="text-sm font-medium text-slate-700">Filter by industry:</span>
                    <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Select industry" />
                        </SelectTrigger>
                        <SelectContent>
                            {INDUSTRIES.map((industry) => (
                                <SelectItem key={industry} value={industry}>
                                    {industry}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="text-sm text-slate-500">
                    Showing {filteredExamples.length} {filteredExamples.length === 1 ? 'example' : 'examples'}
                </div>
            </header>

            {/* Examples Grid */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                {filteredExamples.map((example) => (
                    <Card key={example.id} className="flex flex-col hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <div className="flex items-start justify-between gap-2 mb-2">
                                <Briefcase className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                                <div className="flex-1">
                                    <CardTitle className="text-xl mb-1">{example.title}</CardTitle>
                                </div>
                            </div>
                            <CardDescription>{example.description}</CardDescription>
                        </CardHeader>

                        <CardContent className="flex-1">
                            <div className="flex flex-wrap gap-2 mb-4">
                                <Badge variant="outline" className="bg-slate-50">
                                    {example.industry}
                                </Badge>
                                <Badge variant="outline" className={getExperienceBadgeColor(example.experienceLevel)}>
                                    {example.experienceLevel.charAt(0).toUpperCase() + example.experienceLevel.slice(1)} Level
                                </Badge>
                            </div>

                            {/* Key highlights from the example */}
                            <div className="space-y-2 text-sm text-slate-600">
                                <div className="flex items-start gap-2">
                                    <TrendingUp className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                                    <span>{example.data.basics.name}</span>
                                </div>
                                <div className="flex items-start gap-2">
                                    <FileText className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                                    <span>{example.data.sections.length} sections included</span>
                                </div>
                            </div>
                        </CardContent>

                        <CardFooter className="flex flex-col gap-2">
                            <Button
                                className="w-full"
                                onClick={() => handleUseExample(example)}
                            >
                                Use This Example
                            </Button>
                            <p className="text-xs text-center text-slate-500">
                                Opens in editor • Fully customizable
                            </p>
                        </CardFooter>
                    </Card>
                ))}
            </section>

            {/* Info Section */}
            <section className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 md:p-12 border border-blue-100">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-2xl md:text-3xl font-bold mb-4 text-slate-900">
                        How to Use These Resume Examples
                    </h2>
                    <div className="grid md:grid-cols-3 gap-6 mt-8">
                        <div className="bg-white rounded-xl p-6 shadow-sm">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                                <span className="text-xl font-bold text-blue-600">1</span>
                            </div>
                            <h3 className="font-semibold mb-2">Choose Your Example</h3>
                            <p className="text-sm text-slate-600">
                                Browse examples from your industry or career level
                            </p>
                        </div>

                        <div className="bg-white rounded-xl p-6 shadow-sm">
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                                <span className="text-xl font-bold text-green-600">2</span>
                            </div>
                            <h3 className="font-semibold mb-2">Click "Use This Example"</h3>
                            <p className="text-sm text-slate-600">
                                The example will load directly into our resume editor
                            </p>
                        </div>

                        <div className="bg-white rounded-xl p-6 shadow-sm">
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                                <span className="text-xl font-bold text-purple-600">3</span>
                            </div>
                            <h3 className="font-semibold mb-2">Customize & Download</h3>
                            <p className="text-sm text-slate-600">
                                Replace with your information and download as PDF or DOCX
                            </p>
                        </div>
                    </div>

                    <div className="mt-8 pt-8 border-t border-blue-200">
                        <p className="text-slate-700 mb-4">
                            Want to start from scratch instead?
                        </p>
                        <Link href="/free-ats-resume-templates">
                            <Button variant="outline" size="lg">
                                Browse Resume Templates
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Additional Tips */}
            <section className="mt-16 bg-white rounded-2xl p-8 border border-slate-200">
                <h2 className="text-2xl font-bold mb-6 text-slate-900">Tips for Using Resume Examples</h2>
                <div className="grid md:grid-cols-2 gap-6 text-slate-700">
                    <div>
                        <h3 className="font-semibold mb-2 text-slate-900">✅ Do:</h3>
                        <ul className="space-y-2 text-sm">
                            <li>• Use examples as inspiration for formatting and structure</li>
                            <li>• Adapt the language and tone to match your experience</li>
                            <li>• Customize every section with your own achievements</li>
                            <li>• Keep the ATS-friendly formatting intact</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-2 text-slate-900">❌ Don't:</h3>
                        <ul className="space-y-2 text-sm">
                            <li>• Copy the content word-for-word</li>
                            <li>• Use fake or exaggerated information</li>
                            <li>• Skip proofreading your customized version</li>
                            <li>• Forget to update contact information</li>
                        </ul>
                    </div>
                </div>
            </section>
        </main>
    )
}
