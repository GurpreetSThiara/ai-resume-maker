import { Download, Globe, Shield, Sparkles, Users, Zap, } from "lucide-react";
import { ChevronLeft, ChevronRight, Trophy, Star, Target, Eye, Save, X } from "lucide-react"


export const getStats = () => [
    { value: "50K+", label: "Resumes Created", color: "text-primary", dynamic: true },
    { value: "4.9★", label: "User Rating", color: "text-secondary", dynamic: false },
    { value: "2 min", label: "To First Draft", color: "text-emerald-700", dynamic: false },
    { value: "100%", label: "Free to Use", color: "text-blue-600", dynamic: false },
  ];

export const stats = getStats();
  

export const CoreFeatures = [
    {
      icon: Shield,
      title: "ATS-Friendly Templates",
      description: "Beat the bots. Our resume templates are optimized for Applicant Tracking Systems to ensure your application gets seen by human recruiters.",
      gradientFrom: "from-green-50",
      gradientTo: "to-green-100",
      iconColor: "text-green-600"
    },
    {
      icon: Eye,
      title: "Live Resume Preview",
      description: "See your changes in real-time as you type. What you see is exactly what you get, making the editing process seamless and intuitive.",
      gradientFrom: "from-blue-50",
      gradientTo: "to-blue-100",
      iconColor: "text-blue-600"
    },
    {
      icon: Download,
      title: "Instant PDF Download",
      description: "No sign-up, no watermarks, no hassle. Download your professional resume in PDF format the moment you're done, completely free.",
      gradientFrom: "from-indigo-50",
      gradientTo: "to-indigo-100",
      iconColor: "text-indigo-600"
    },
];

export const AIFeatures = [
    {
      icon: Sparkles,
      title: "AI Content Writer",
      description: "Struggling with words? Generate professional summaries and job descriptions with a single click. (Free Account Required)",
      gradientFrom: "from-yellow-50",
      gradientTo: "to-yellow-100",
      iconColor: "text-yellow-600"
    },
    {
      icon: Zap,
      title: "AI Bullet Point Generator",
      description: "Transform your responsibilities into impactful, achievement-oriented bullet points that catch a recruiter's eye. (Free Account Required)",
      gradientFrom: "from-pink-50",
      gradientTo: "to-pink-100",
      iconColor: "text-pink-600"
    },
    {
      icon: Target,
      title: "AI Keyword Optimization",
      description: "Tailor your resume to a specific job description by letting our AI identify and suggest relevant keywords to include. (Free Account Required)",
      gradientFrom: "from-purple-50",
      gradientTo: "to-purple-100",
      iconColor: "text-purple-600"
    }
];


export const CREATE_STEPS =  [
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