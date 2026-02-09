import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, ArrowRight } from "lucide-react";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog | CreateFreeCV.com - Resume Tips & Career Advice',
  description: 'Expert tips, tricks, and insights on resume building, career advice, and job searching from the CreateFreeCV team.',
  keywords: ['resume blog', 'career advice', 'job search tips', 'resume writing tips', 'career guidance', 'interview tips'],
};

// Actual blog posts we have
const blogPosts = [
  {
    id: 'resume-for-freshers',
    title: 'Resume for Freshers: Complete Guide to Create Your First Job-Winning Resume (2026)',
    excerpt: 'Learn how to create a professional fresher resume with our step-by-step guide. Includes 25+ examples, ATS-friendly tips, and real resume samples for students and recent graduates.',
    content: 'Creating a resume as a fresher is often confusing. You may feel stuck because you don\'t have years of work experience...',
    author: 'CreateFreeCV Team',
    publishedAt: '2026-02-09',
    readingTime: '8 min read',
    category: 'Resume Writing',
    featured: true,
    image: '/blog/fresher-resume-guide.jpg'
  },
  {
    id: 'ats-resume-guide',
    title: 'ATS Resume Guide 2026 – How to Create a Resume That Gets Interviews',
    excerpt: 'Learn how to create an ATS-optimized resume in 2026 with real examples for developers, marketers, students, and freshers. Step-by-step guide to pass Applicant Tracking Systems.',
    author: 'CreateFreeCV Team',
    publishedAt: '2026-02-08',
    readingTime: '6 min read',
    category: 'ATS Tips',
    featured: false,
    image: '/blog/ats-resume-guide.jpg'
  }
];

// Sort posts by latest date
const sortedPosts = [...blogPosts].sort((a, b) => 
  new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
);

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
    'Resume Writing': 'bg-blue-100 text-blue-700',
    'ATS Tips': 'bg-green-100 text-green-700',
  };
  return colors[category] || 'bg-gray-100 text-gray-700';
}

export default function BlogPage() {
  const featuredPost = sortedPosts.find(post => post.featured);
  const regularPosts = sortedPosts.filter(post => !post.featured);

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <section className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-6 text-balance">
            Resume & Career Blog
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Expert guides and insights to help you create professional resumes and advance your career
          </p>
        </section>

        {/* Featured Post */}
        {featuredPost && (
          <section className="mb-12">
            <div className="flex items-center gap-2 mb-4">
              <Badge className="bg-yellow-100 text-yellow-700">Featured</Badge>
              <span className="text-sm text-muted-foreground">Latest Article</span>
            </div>
            
            <Card className="overflow-hidden border-2 border-primary/20 hover:border-primary/40 transition-colors">
              <div className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <Badge className={getCategoryColor(featuredPost.category)}>
                    {featuredPost.category}
                  </Badge>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{featuredPost.readingTime}</span>
                  </div>
                </div>
                
                <h2 className="text-3xl font-bold text-primary mb-4">
                  {featuredPost.title}
                </h2>
                
                <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                  {featuredPost.excerpt}
                </p>
                
                <div className="flex items-center justify-between">
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
                  
                  <Link 
                    href={`/blog/${featuredPost.id}`}
                    className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium"
                  >
                    Read Full Article
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </Card>
          </section>
        )}

        {/* Other Posts */}
        {regularPosts.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-primary mb-8">Other Articles</h2>
            
            <div className="space-y-6">
              {regularPosts.map((post) => (
                <Card key={post.id} className="hover:border-primary/40 transition-colors">
                  <div className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <Badge className={getCategoryColor(post.category)}>
                        {post.category}
                      </Badge>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>{post.readingTime}</span>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-primary mb-3">
                      {post.title}
                    </h3>
                    
                    <p className="text-muted-foreground mb-4 leading-relaxed">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <span>{post.author}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(post.publishedAt)}</span>
                        </div>
                      </div>
                      
                      <Link 
                        href={`/blog/${post.id}`}
                        className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium"
                      >
                        Read Article
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Newsletter Signup */}
        {/* <section className="mt-16">
          <div className="bg-primary/10 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-primary mb-4">Stay Updated</h2>
            <p className="text-muted-foreground mb-6">
              Get the latest resume tips and career advice delivered to your inbox
            </p>
            <div className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </section> */}
      </div>
    </main>
  );
}
