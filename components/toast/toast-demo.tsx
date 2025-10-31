"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Zap, Palette, Settings, Code } from "lucide-react"
import { SHOW_ERROR, SHOW_INFO, SHOW_SUCCESS, SHOW_WARNING } from "@/utils/toast"

export function ToastDemo() {
  const [selectedPosition, setSelectedPosition] = useState<
    "top-left" | "top-center" | "top-right" | "bottom-left" | "bottom-center" | "bottom-right"
  >("bottom-right")

  const positions = [
    { value: "top-left" as const, label: "Top Left" },
    { value: "top-center" as const, label: "Top Center" },
    { value: "top-right" as const, label: "Top Right" },
    { value: "bottom-left" as const, label: "Bottom Left" },
    { value: "bottom-center" as const, label: "Bottom Center" },
    { value: "bottom-right" as const, label: "Bottom Right" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Zap className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Premium Toast System</h1>
          </div>
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            Fully customizable, responsive toast notifications with animations and progress bars
          </p>
        </div>

        <Tabs defaultValue="variants" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto">
            <TabsTrigger value="variants" className="flex items-center gap-2">
              <Palette className="w-4 h-4" />
              <span className="hidden sm:inline">Variants</span>
            </TabsTrigger>
            <TabsTrigger value="positions" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Positions</span>
            </TabsTrigger>
            <TabsTrigger value="advanced" className="flex items-center gap-2">
              <Code className="w-4 h-4" />
              <span className="hidden sm:inline">Advanced</span>
            </TabsTrigger>
          </TabsList>

          {/* Variants Tab */}
          <TabsContent value="variants" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Toast Variants</CardTitle>
                <CardDescription>Choose from multiple toast variants with automatic icons</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Button
                    onClick={() =>
                      SHOW_SUCCESS({
                        title: "Success!",
                        description: "Your action was completed successfully.",
                        position: selectedPosition,
                      })
                    }
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    Success Toast
                  </Button>
                  <Button
                    onClick={() =>
                      SHOW_ERROR({
                        title: "Error!",
                        description: "Something went wrong. Please try again.",
                        position: selectedPosition,
                      })
                    }
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    Error Toast
                  </Button>
                  <Button
                    onClick={() =>
                      SHOW_WARNING({
                        title: "Warning!",
                        description: "Please review this important information.",
                        position: selectedPosition,
                      })
                    }
                    className="bg-amber-600 hover:bg-amber-700 text-white"
                  >
                    Warning Toast
                  </Button>
                  <Button
                    onClick={() =>
                      SHOW_INFO({
                        title: "Info",
                        description: "Here is some useful information for you.",
                        position: selectedPosition,
                      })
                    }
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Info Toast
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Positions Tab */}
          <TabsContent value="positions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Toast Positions</CardTitle>
                <CardDescription>Select a position and trigger a toast to see it appear</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {positions.map((pos) => (
                    <Button
                      key={pos.value}
                      variant={selectedPosition === pos.value ? "default" : "outline"}
                      onClick={() => setSelectedPosition(pos.value)}
                      className="text-sm"
                    >
                      {pos.label}
                    </Button>
                  ))}
                </div>
                <Button
                  onClick={() =>
                    SHOW_SUCCESS({
                      title: "Position Test",
                      description: `Toast at ${selectedPosition}`,
                      position: selectedPosition,
                    })
                  }
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Show Toast at {selectedPosition}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Advanced Tab */}
          <TabsContent value="advanced" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Advanced Features</CardTitle>
                <CardDescription>Explore advanced customization options</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Button
                    onClick={() =>
                      SHOW_SUCCESS({
                        title: "With Action",
                        description: "Click the action button below",
                        position: selectedPosition,
                        action: {
                          label: "Undo",
                          onClick: () => {},
                        },
                      })
                    }
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    With Action Button
                  </Button>
                  <Button
                    onClick={() =>
                      SHOW_INFO({
                        title: "Long Duration",
                        description: "This toast will stay for 10 seconds",
                        position: selectedPosition,
                        duration: 10000,
                      })
                    }
                    className="bg-indigo-600 hover:bg-indigo-700 text-white"
                  >
                    Long Duration (10s)
                  </Button>
                  <Button
                    onClick={() =>
                      SHOW_WARNING({
                        title: "No Progress Bar",
                        description: "This toast has no progress bar",
                        position: selectedPosition,
                        showProgress: false,
                      })
                    }
                    className="bg-orange-600 hover:bg-orange-700 text-white"
                  >
                    No Progress Bar
                  </Button>
                  <Button
                    onClick={() =>
                      SHOW_ERROR({
                        title: "Persistent",
                        description: "This toast will not auto-dismiss",
                        position: selectedPosition,
                        duration: 0,
                        dismissible: true,
                      })
                    }
                    className="bg-rose-600 hover:bg-rose-700 text-white"
                  >
                    Persistent Toast
                  </Button>
                  <Button
                    onClick={() => {
                      SHOW_SUCCESS({
                        title: "Multiple Toasts",
                        description: "Toast 1 of 3",
                        position: selectedPosition,
                      })
                      setTimeout(() => {
                        SHOW_INFO({
                          title: "Multiple Toasts",
                          description: "Toast 2 of 3",
                          position: selectedPosition,
                        })
                      }, 300)
                      setTimeout(() => {
                        SHOW_WARNING({
                          title: "Multiple Toasts",
                          description: "Toast 3 of 3",
                          position: selectedPosition,
                        })
                      }, 600)
                    }}
                    className="bg-cyan-600 hover:bg-cyan-700 text-white"
                  >
                    Multiple Toasts
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Features List */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Features</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    "Multiple variants (success, error, warning, info)",
                    "6 position options",
                    "Animated progress bars",
                    "Custom icons support",
                    "Action buttons",
                    "Auto-dismiss with duration control",
                    "Dismissible toasts",
                    "Responsive design",
                    "Dark mode support",
                    "Stacking support",
                    "Accessibility features",
                    "TypeScript support",
                  ].map((feature, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Badge variant="secondary" className="w-2 h-2 rounded-full p-0" />
                      <span className="text-sm text-slate-700 dark:text-slate-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
