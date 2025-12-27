export const DEFAULT_EDUCATION = {
  institution: "",
  degree: "",
  startDate: "",
  endDate: "",
  location: "",
  highlights: []
}

export const RESUME_IMAGES = {
  CLASSIC: "https://cdn.jsdelivr.net/gh/GurpreetSThiara/ai-resume-maker-images@main/templates/classic.png",
  ATS_GREEN: "https://cdn.jsdelivr.net/gh/GurpreetSThiara/ai-resume-maker-images@main/templates/atsgreen.png",
  ATS_YELLOW: "https://cdn.jsdelivr.net/gh/GurpreetSThiara/ai-resume-maker-images@main/templates/atsyellow.png",
  ATS_TIMELINE: "https://cdn.jsdelivr.net/gh/GurpreetSThiara/ai-resume-maker-images@main/templates/timeline.png",
  COMPACT_LINES: "https://cdn.jsdelivr.net/gh/GurpreetSThiara/ai-resume-maker-images@main/templates/compact-lines.png",
    ATS_COMPACT: "https://cdn.jsdelivr.net/gh/GurpreetSThiara/ai-resume-maker-images@main/templates/ats-compact.png",



  CLASSIC_BLUE: "https://cdn.jsdelivr.net/gh/GurpreetSThiara/ai-resume-maker-images@main/deveops/devops1.png",
  MODERN: "https://cdn.jsdelivr.net/gh/GurpreetSThiara/ai-resume-maker-images@main/templates/modern.png",
  CREATIVE: "https://cdn.jsdelivr.net/gh/GurpreetSThiara/ai-resume-maker-images@main/templates/creative.png",
  ELEGANT: "https://cdn.jsdelivr.net/gh/GurpreetSThiara/ai-resume-maker-images@main/templates/elegant.png",
  GOOGLE_STYLE: "https://cdn.jsdelivr.net/gh/GurpreetSThiara/ai-resume-maker-images@main/templates/google-resume.png",
  TIMELINE_1: "https://cdn.jsdelivr.net/gh/GurpreetSThiara/ai-resume-maker-images@main/templates/timeline_1.png",
}

export const RESUME_TEMPLATES = [
  {
    id: "ats-classic",
    name: "Classic",
    url: RESUME_IMAGES.CLASSIC,
    category: "Professional",
    description: "Clean, minimal and highly readable. Works well for corporate and technical roles.",
    suggestedFor: ["Engineering", "Finance", "Operations"]
  },
  {
    id: "ats-compact-lines",
    name: "ATS Compact Lines",
    url: RESUME_IMAGES.COMPACT_LINES,
    category: "ATS",
    description: "Ultra-compact ATS-friendly layout with minimal line spacing. Maximizes content while staying ATS-safe.",
    suggestedFor: ["Experienced professionals", "Technical roles", "Dense resumes"]
  },
  {
    id: "ats-classic-compact",
    name: "ATS Classic Compact",
    url: RESUME_IMAGES.ATS_COMPACT,
    category: "ATS",
    description: "Compact version of ATS Classic with reduced spacing and no decorative lines for maximum content density.",
    suggestedFor: ["Experienced professionals", "Technical roles", "Dense resumes"]
  },
  {
    id: "ats-green",
    name: "ATS Friendly (Green)",
    url: RESUME_IMAGES.ATS_GREEN,
    category: "ATS",
    description: "Optimized for Applicant Tracking Systems — simple structure and semantic headings.",
    suggestedFor: ["All industries - ATS aware"]
  },
  {
    id: "classic_blue",
    name: "Classic Blue",
    url: RESUME_IMAGES.CLASSIC_BLUE,
    category: "Contemporary",
    description: "A modern layout with subtle accents and clear sectioning for creative and product roles.",
    suggestedFor: ["Product", "Design", "Marketing"]
  },
  {
    id: "ats-yellow",
    name: "Classic Yellow",
    url: RESUME_IMAGES.ATS_YELLOW,
    category: "Contemporary",
    description: "A modern layout with subtle accents and clear sectioning for creative and product roles.",
    suggestedFor: ["Product", "Design", "Marketing"]
  },
  {
    id: "ats-timeline",
    name: "Timeline",
    url: RESUME_IMAGES.TIMELINE_1,
    category: "Modern",
    description: "Visual timeline design with blue accents. Perfect for showcasing career progression clearly.",
    suggestedFor: ["All industries", "Career progression focused"]
  },

  // },
  // {
  //   id: "elegant",
  //   name: "Elegant",
  //   url: RESUME_IMAGES.ELEGANT,
  //   category: "Executive",
  //   description: "Sophisticated layout with refined typography for senior and executive roles.",
  //   suggestedFor: ["Management", "Executive"]
  // },
  // {
  //   id: "google",
  //   name: "Google-Style",
  //   url: RESUME_IMAGES.GOOGLE_STYLE,
  //   category: "Professional",
  //   description: "Inspired by modern tech company resumes: dense but structured for technical applicants.",
  //   suggestedFor: ["Software Engineering", "Data Science"]
  // }
]