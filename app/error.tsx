'use client'

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, RefreshCw, AlertTriangle } from "lucide-react";
import { CREATE_RESUME } from "@/config/urls";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <div className="relative mb-12">
          <div className="absolute inset-0 bg-destructive/10 rounded-full blur-3xl" />
          <div className="relative">
            <AlertTriangle className="w-16 h-16 text-destructive mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Something went wrong
            </h1>
            <p className="text-lg text-muted-foreground max-w-lg mx-auto leading-relaxed">
              We hit an unexpected error. You can try again, or head back to the homepage.
            </p>
          </div>
        </div>

        <Card className="bg-primary/5 border-primary/20 max-w-md mx-auto">
          <CardContent className="p-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => reset()} size="lg" className="w-full sm:w-auto">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
            <Link href="/">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                <Home className="w-4 h-4 mr-2" />
                Homepage
              </Button>
            </Link>
          </CardContent>
        </Card>

        <div className="mt-8">
          <Link href={CREATE_RESUME} className="text-primary hover:text-primary/80 transition-colors text-sm">
            Or start building a resume →
          </Link>
        </div>
      </div>
    </main>
  );
}
