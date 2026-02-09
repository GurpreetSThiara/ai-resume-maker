'use client'

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, ArrowLeft, Search, FileText } from "lucide-react";
import { CREATE_RESUME } from "@/config/urls";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          {/* 404 Hero Section */}
          <div className="relative mb-16">
            <div className="absolute inset-0 bg-primary/10 rounded-full blur-3xl"></div>
            <div className="relative">
              <h1 className="text-[12rem] md:text-[16rem] font-black text-primary/30 leading-none mb-8 animate-pulse">
                404
              </h1>
              <h2 className="text-5xl md:text-7xl font-bold text-primary mb-8">
                Page Not Found
              </h2>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed">
                Oops! The page you're looking for seems to have vanished into thin air. 
                But don't worry, we'll help you get back on track.
              </p>
            </div>
          </div>

          {/* Action Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="hover:border-primary/40 transition-colors group">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                  <Home className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-primary mb-2">Go Home</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Return to the homepage and start fresh
                </p>
                <Link href="/">
                  <Button variant="outline" size="sm" className="w-full">
                    <Home className="w-4 h-4 mr-2" />
                    Homepage
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:border-primary/40 transition-colors group">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                  <FileText className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-primary mb-2">Create Resume</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Build your professional resume in minutes
                </p>
                <Link href={CREATE_RESUME}>
                  <Button size="sm" className="w-full">
                    <FileText className="w-4 h-4 mr-2" />
                    Start Building
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:border-primary/40 transition-colors group">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                  <Search className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-primary mb-2">Browse Resources</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Check out our blog and guides
                </p>
                <Link href="/blog">
                  <Button variant="outline" size="sm" className="w-full">
                    <Search className="w-4 h-4 mr-2" />
                    View Blog
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Help Section */}
          <Card className="bg-primary/5 border-primary/20 max-w-2xl mx-auto">
            <CardContent className="p-8">
              <h3 className="text-xl font-semibold text-primary mb-4">
                Looking for something specific?
              </h3>
              <p className="text-muted-foreground mb-6">
                Here are some of our most popular pages:
              </p>
              
              <div className="grid sm:grid-cols-2 gap-4 text-left">
                <div className="space-y-3">
                  <Link href="/" className="block text-primary hover:text-primary/80 transition-colors">
                    <div className="flex items-center gap-2">
                      <ArrowLeft className="w-4 h-4" />
                      Homepage
                    </div>
                  </Link>
                  <Link href={CREATE_RESUME} className="block text-primary hover:text-primary/80 transition-colors">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Resume Builder
                    </div>
                  </Link>
                  <Link href="/cover-letter" className="block text-primary hover:text-primary/80 transition-colors">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Cover Letter Builder
                    </div>
                  </Link>
                </div>
                <div className="space-y-3">
                  <Link href="/blog" className="block text-primary hover:text-primary/80 transition-colors">
                    <div className="flex items-center gap-2">
                      <Search className="w-4 h-4" />
                      Career Blog
                    </div>
                  </Link>
                  <Link href="/blog/resume-for-freshers" className="block text-primary hover:text-primary/80 transition-colors">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Fresher Resume Guide
                    </div>
                  </Link>
                  <Link href="/blog/ats-resume-guide" className="block text-primary hover:text-primary/80 transition-colors">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      ATS Resume Guide
                    </div>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Back Button */}
          <div className="mt-12">
            <Link href="/">
              <Button variant="ghost" size="lg" className="text-muted-foreground hover:text-primary">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Homepage
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
