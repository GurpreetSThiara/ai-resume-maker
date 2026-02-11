"use client"
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, ArrowRight, Search, X } from "lucide-react";
import { useState } from 'react';

interface BlogPost {
    id: string;
    title: string;
    excerpt: string;
    content?: string;
    author: string;
    publishedAt: string;
    readingTime: string;
    category: string;
    featured: boolean;
    image: string;
}

interface BlogClientProps {
    blogPosts: BlogPost[];
}

function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function getCategoryColor(category: string) {
    const colors: Record<string, string> = {
        'Resume Writing': 'bg-gradient-to-r from-blue-500 to-blue-600 text-white border-none',
        'ATS Tips': 'bg-gradient-to-r from-green-500 to-emerald-600 text-white border-none',
    };
    return colors[category] || 'bg-gradient-to-r from-gray-500 to-gray-600 text-white border-none';
}

export default function BlogClient({ blogPosts }: BlogClientProps) {
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [searchQuery, setSearchQuery] = useState<string>('');

    // Sort posts by latest date
    const sortedPosts = [...blogPosts].sort((a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );

    const featuredPost = sortedPosts.find(post => post.featured);

    // Get unique categories
    const categories = ['All', ...Array.from(new Set(blogPosts.map(post => post.category)))];

    // Filter posts
    let filteredPosts = sortedPosts.filter(post => !post.featured);

    if (selectedCategory !== 'All') {
        filteredPosts = filteredPosts.filter(post => post.category === selectedCategory);
    }

    if (searchQuery) {
        filteredPosts = filteredPosts.filter(post =>
            post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }

    return (
        <main className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
            {/* Hero Section with Gradient */}
            <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-background border-b">
                {/* Animated background pattern */}
                <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>

                <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
                    <div className="text-center space-y-6 animate-fade-in">
                        <div className="inline-block">
                            <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-1.5 text-sm font-medium">
                                Latest Insights
                            </Badge>
                        </div>

                        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent leading-tight">
                            Resume & Career Blog
                        </h1>

                        <p className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                            Expert guides and insights to help you create professional resumes and advance your career
                        </p>

                        {/* Search Bar */}
                        <div className="max-w-2xl mx-auto pt-6">
                            <div className="relative group">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Search articles..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full px-12 py-4 rounded-xl border-2 border-border bg-background/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all text-lg placeholder:text-muted-foreground/60"
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery('')}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Category Filter Tabs */}
                <div className="mb-12">
                    <div className="flex flex-wrap gap-3 justify-center">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-6 py-2.5 rounded-full font-medium transition-all duration-300 ${selectedCategory === category
                                        ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30 scale-105'
                                        : 'bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground'
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Featured Post */}
                {featuredPost && selectedCategory === 'All' && !searchQuery && (
                    <section className="mb-16 animate-fade-in">
                        <div className="flex items-center gap-3 mb-6">
                            <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-none px-4 py-1.5">
                                ⭐ Featured
                            </Badge>
                            <span className="text-sm text-muted-foreground font-medium">Latest Article</span>
                        </div>

                        <Link href={`/blog/${featuredPost.id}`} className="block group">
                            <Card className="overflow-hidden border-2 border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1 bg-gradient-to-br from-background to-primary/5">
                                <div className="grid md:grid-cols-2 gap-0">
                                    {/* Image side */}
                                    <div className="relative h-64 md:h-auto bg-gradient-to-br from-primary/20 to-primary/10 overflow-hidden">
                                        <div className="absolute inset-0 flex items-center justify-center text-primary/20">
                                            <div className="text-center p-8">
                                                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                                                    <Calendar className="w-12 h-12" />
                                                </div>
                                                <p className="text-sm font-medium">Featured Article</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Content side */}
                                    <div className="p-8 flex flex-col justify-between">
                                        <div>
                                            <div className="flex items-center gap-4 mb-4">
                                                <Badge className={getCategoryColor(featuredPost.category)}>
                                                    {featuredPost.category}
                                                </Badge>
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <Clock className="w-4 h-4" />
                                                    <span>{featuredPost.readingTime}</span>
                                                </div>
                                            </div>

                                            <h2 className="text-3xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors line-clamp-2">
                                                {featuredPost.title}
                                            </h2>

                                            <p className="text-muted-foreground mb-6 leading-relaxed line-clamp-3">
                                                {featuredPost.excerpt}
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-between pt-4 border-t">
                                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                <div className="flex items-center gap-2">
                                                    <User className="w-4 h-4" />
                                                    <span>{featuredPost.author}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-4 h-4" />
                                                    <span>{formatDate(featuredPost.publishedAt)}</span>
                                                </div>
                                            </div>

                                            <div className="inline-flex items-center gap-2 text-primary font-semibold group-hover:gap-3 transition-all">
                                                Read Article
                                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </Link>
                    </section>
                )}

                {/* Regular Posts Grid */}
                {filteredPosts.length > 0 ? (
                    <section>
                        <h2 className="text-3xl font-bold text-foreground mb-8">
                            {searchQuery ? 'Search Results' : selectedCategory === 'All' ? 'Latest Articles' : `${selectedCategory} Articles`}
                        </h2>

                        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
                            {filteredPosts.map((post, index) => (
                                <Link
                                    key={post.id}
                                    href={`/blog/${post.id}`}
                                    className="group animate-fade-in"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    <Card className="h-full overflow-hidden border hover:border-primary/40 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-2 bg-card">
                                        {/* Image Header */}
                                        <div className="relative h-48 bg-gradient-to-br from-primary/20 to-primary/10 overflow-hidden">
                                            <div className="absolute inset-0 flex items-center justify-center text-primary/20">
                                                <div className="text-center p-6">
                                                    <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-primary/10 flex items-center justify-center">
                                                        <Calendar className="w-8 h-8" />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Category badge overlay */}
                                            <div className="absolute top-4 left-4">
                                                <Badge className={getCategoryColor(post.category)}>
                                                    {post.category}
                                                </Badge>
                                            </div>
                                        </div>

                                        <CardContent className="p-6 flex flex-col h-[calc(100%-12rem)]">
                                            <div className="flex items-center gap-3 mb-3 text-sm text-muted-foreground">
                                                <div className="flex items-center gap-1.5">
                                                    <Clock className="w-4 h-4" />
                                                    <span>{post.readingTime}</span>
                                                </div>
                                                <span>•</span>
                                                <div className="flex items-center gap-1.5">
                                                    <Calendar className="w-4 h-4" />
                                                    <span>{formatDate(post.publishedAt)}</span>
                                                </div>
                                            </div>

                                            <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
                                                {post.title}
                                            </h3>

                                            <p className="text-muted-foreground mb-4 leading-relaxed line-clamp-3 flex-grow">
                                                {post.excerpt}
                                            </p>

                                            <div className="flex items-center justify-between pt-4 border-t mt-auto">
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <User className="w-4 h-4" />
                                                    <span>{post.author}</span>
                                                </div>

                                                <div className="inline-flex items-center gap-2 text-primary font-medium group-hover:gap-3 transition-all">
                                                    Read More
                                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    </section>
                ) : (
                    <div className="text-center py-20">
                        <div className="inline-block p-6 rounded-full bg-muted mb-6">
                            <Search className="w-12 h-12 text-muted-foreground" />
                        </div>
                        <h3 className="text-2xl font-bold text-foreground mb-3">No articles found</h3>
                        <p className="text-muted-foreground mb-6">
                            {searchQuery
                                ? `No articles match "${searchQuery}". Try a different search term.`
                                : `No articles in ${selectedCategory} category yet.`
                            }
                        </p>
                        <button
                            onClick={() => {
                                setSearchQuery('');
                                setSelectedCategory('All');
                            }}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
                        >
                            <X className="w-4 h-4" />
                            Clear Filters
                        </button>
                    </div>
                )}
            </div>

            <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
        
        .bg-grid-pattern {
          background-image: 
            linear-gradient(to right, hsl(var(--primary) / 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, hsl(var(--primary) / 0.1) 1px, transparent 1px);
          background-size: 40px 40px;
        }
      `}</style>
        </main>
    );
}
