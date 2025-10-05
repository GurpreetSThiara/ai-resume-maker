import { ResumeData } from "@/types/resume";

export const sampleResumeData: ResumeData = {
  basics: {
    name: "Arjun Mehta",
    email: "arjun.mehta.dev@gmail.com",
    phone: "+91-9876543210",
    location: "Bengaluru, India",
    linkedin: "https://linkedin.com/in/arjunmehta",
    summary:
      "Full-stack developer with 4+ years of experience building scalable web applications using React, Node.js, and cloud-native technologies. Passionate about solving real-world problems with clean code and intuitive user experiences."
  },

  custom: {
    dob: {
      title: "Date of Birth",
      content: "1995-03-12",
      hidden: false,
      id: "dob-1",
      link: false
    },

    portfolio: {
      title: "Portfolio",
      content: "https://arjun.dev",
      hidden: false,
      id: "portfolio-1",
      link: true
    }
  },

  sections: [
    {
      id: "edu-1",
      title: "Education",
      type: "education",
      items: [
        {
          institution: "Indian Institute of Technology, Delhi",
          degree: "B.Tech in Computer Science",
          startDate: "2013-08",
          endDate: "2017-05",
          location: "New Delhi, India",
          highlights: [
            "Graduated with First Class Honors",
            "Member of Programming & AI Club"
          ]
        }
      ]
    },
    {
      id: "exp-1",
      title: "Experience",
      type: "experience",
      items: [
        {
          company: "TechNova Solutions",
          role: "Senior Software Engineer",
          startDate: "2021-04",
          endDate: "Present",
          location: "Bengaluru, India",
          achievements: [
            "Led a team of 5 engineers to develop a SaaS product used by 50,000+ users.",
            "Reduced API response times by 40% through performance optimizations.",
            "Implemented CI/CD pipelines, cutting deployment time by 60%."
          ]
        }
      ]
    },
    {
      id: "skills-1",
      title: "Skills",
      type: "skills",
      items: [
        "JavaScript / TypeScript",
        "React.js / Next.js",
        "Node.js / Express",
        "MongoDB / PostgreSQL",
        "AWS (Lambda, S3, EC2)",
        "Docker & Kubernetes",
        "CI/CD (GitHub Actions, Jenkins)"
      ]
    },
    {
      id: "lang-1",
      title: "Languages",
      type: "languages",
      items: ["English (Fluent)", "Hindi (Native)", "Kannada (Intermediate)"]
    },
    {
      id: "certs-1",
      title: "Certifications",
      type: "certifications",
      items: [
        "AWS Certified Solutions Architect – Associate (2022)",
        "Certified Kubernetes Administrator (CKA, 2021)"
      ]
    },
    {
      id: "projects-1",
      title: "Projects",
      type: "custom",
      content: [
        "🚀 **TaskFlow Pro** – A productivity web app with real-time collaboration, built using Next.js, GraphQL, and WebSockets.",
        "📊 **FinTrack** – A personal finance tracker with data visualization, deployed on AWS with serverless architecture."
      ]
    }
  ]
}
