import { Download, Globe, Shield, Sparkles, Users, Zap, } from "lucide-react";
import { ChevronLeft, ChevronRight, Trophy, Star, Target, Eye, Save, X } from "lucide-react"


export const stats = [
    { value: "50K+", label: "Resumes Created", color: "text-primary" },
    { value: "95%", label: "Success Rate", color: "text-secondary" },
    { value: "4.9★", label: "User Rating", color: "text-secondary" },
    { value: "2 min", label: "To First Draft", color: "text-emerald-700" },
  ];
  

export const ValueProps = [
    {
      icon: Zap,
      title: "Gamified Experience",
      description: "Unlock achievements and track progress as you build your perfect resume step by step. Make resume writing fun and engaging.",
      gradientFrom: "from-green-50",
      gradientTo: "to-green-100",
      iconColor: "text-green-600"
    },
    {
      icon: Shield,
      title: "ATS-Friendly",
      description: "Our templates are optimized for Applicant Tracking Systems to ensure your resume gets noticed by recruiters and hiring managers.",
      gradientFrom: "from-blue-50",
      gradientTo: "to-blue-100",
      iconColor: "text-blue-600"
    },
    {
      icon: Globe,
      title: "Mobile-First Design",
      description: "Build your resume on any device with our responsive, mobile-optimized interface. Create professional resumes on the go.",
      gradientFrom: "from-indigo-50",
      gradientTo: "to-indigo-100",
      iconColor: "text-indigo-600"
    },
    {
      icon: Download,
      title: "Instant PDF Export",
      description: "Download your professional resume as a high-quality PDF with just one click. Perfect for job applications and interviews.",
      gradientFrom: "from-green-50",
      gradientTo: "to-green-100",
      iconColor: "text-green-600"
    },
    {
      icon: Users,
      title: "Expert Templates",
      description: "Choose from professionally designed templates created by HR experts and career coaches. Stand out in any industry.",
      gradientFrom: "from-yellow-50",
      gradientTo: "to-yellow-100",
      iconColor: "text-yellow-600"
    },
    {
      icon: Sparkles,
      title: "Smart Suggestions",
      description: "Get intelligent recommendations and tips to improve your resume content and formatting. AI-powered insights for better results.",
      gradientFrom: "from-pink-50",
      gradientTo: "to-pink-100",
      iconColor: "text-pink-600"
    }
  ]  


export const CREATE_STEPS = [
    {
      number: 1,
      title: "Enter Your Information",
      description:
        "Fill in your personal details, work experience, education, and skills through our intuitive step-by-step process. Our guided approach ensures you don't miss anything important.",
    },
    {
      number: 2,
      title: "Customize & Preview",
      description:
        "See your resume come to life with our live preview feature. Edit and customize until it's perfect. Choose from multiple professional templates.",
    },
    {
      number: 3,
      title: "Download & Apply",
      description:
        "Download your professional PDF resume and start applying to your dream jobs with confidence. Get ready for more interviews and job offers.",
    },
  ];  


export const CREATE_RESUME_STEPS =  [
    { id: 0, title: "Personal Info", icon: "👤", description: "Tell us about yourself" },
    { id: 1, title: "Professional Summary", icon: "📝", description: "Your career overview" },
    { id: 2, title: "Education", icon: "🎓", description: "Your academic journey" },
    { id: 3, title: "Experience", icon: "💼", description: "Professional background" },
    { id: 4, title: "Skills & More", icon: "🚀", description: "Showcase your abilities" },
    { id: 5, title: "Custom Fields", icon: "⚡", description: "Add personal details" },
    { id: 6, title: "Custom Sections", icon: "🎨", description: "Add additional sections" },
    { id: 7, title: "Review", icon: "✨", description: "Final review" },
  ]  


export const CREATE_RESUME_ACHIEVEMENTS = [
    { id: "first_step", title: "Getting Started", icon: <Star className="w-4 h-4" />, unlocked: false },
    { id: "half_way", title: "Halfway Hero", icon: <Zap className="w-4 h-4" />, unlocked: false },
    { id: "complete", title: "Resume Master", icon: <Trophy className="w-4 h-4" />, unlocked: false },
    { id: "perfectionist", title: "Detail Oriented", icon: <Target className="w-4 h-4" />, unlocked: false },
  ]  