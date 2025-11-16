import { ResumeData } from "@/types/resume";

export const devopsResumeData1 : ResumeData = {
  basics: {
    name: "Gurpreet Singh",
    email: "gurpreet.singh@example.com",
    phone: "+91 9876543210",
    location: "Ludhiana, Punjab, India",
    linkedin: "https://linkedin.com/in/gurpreet-singh",
    summary:
      "MERN Stack Developer with 3+ years of experience in building scalable web applications using Next.js, React, Node.js, and MongoDB. Passionate about performance optimization and creating intuitive user interfaces."
  },

  custom: {
    dob: {
      title: "Date of Birth",
      content: "1998-07-12",
      hidden: false,
      id: "dob",
      link: false
    },
    gender: {
      title: "Gender",
      content: "Male",
      hidden: false,
      id: "gender",
      link: false
    },
    portfolio: {
      title: "Portfolio",
      content: "https://gurpreet.dev",
      hidden: false,
      id: "portfolio",
      link: true
    }
  },

  sections: [
    {
      id: "edu-1",
      title: "Education",
      type: "education",
      order: 1,
      items: [
        {
          institution: "Punjab Technical University",
          degree: "B.Tech in Computer Science",
          startDate: "2016",
          endDate: "2020",
          location: "Jalandhar, Punjab",
          highlights: [
            "Graduated with First Class Honors",
            "Completed final-year project on AI-based Chatbot using Python"
          ]
        }
      ]
    },
    {
      id: "exp-1",
      title: "Experience",
      type: "experience",
      order: 2,
      items: [
        {
          company: "Logiceil Solutions",
          role: "Associate Software Engineer",
          startDate: "2024-02",
          endDate: "Present",
          location: "Ludhiana, Punjab",
          achievements: [
            "Developed a fully custom calendar component in Next.js",
            "Implemented secure authentication using JWT and bcrypt",
            "Optimized React rendering using memo and custom hooks"
          ]
        },
        {
          company: "TechNova Labs",
          role: "Frontend Developer Intern",
          startDate: "2023-06",
          endDate: "2023-12",
          location: "Remote",
          achievements: [
            "Built reusable UI components using React and Tailwind CSS",
            "Collaborated on API integration and testing using Postman"
          ]
        }
      ]
    },
    {
      id: "skills-1",
      title: "Skills",
      type: "skills",
      order: 3,
      items: [
        "Next.js",
        "React",
        "TypeScript",
        "Node.js",
        "MongoDB",
        "Tailwind CSS",
        "Cypress",
        "Git"
      ]
    },
    {
      id: "lang-1",
      title: "Languages",
      type: "languages",
      order: 4,
      items: ["English", "Punjabi", "Hindi"]
    },
    {
      id: "cert-1",
      title: "Certifications",
      type: "certifications",
      order: 5,
      items: [
        "JavaScript Algorithms and Data Structures (freeCodeCamp)",
        "Full Stack Web Development (Coursera)"
      ]
    },
    {
      id: "proj-1",
      title: "Projects",
      type: "projects",
      order: 6,
      items: [
        {
          name: "Resume Builder 22333",
          link: "https://resumeai.in",
          repo: "https://github.com/gurpreet/resume-builder",
          description: [
            "Created a customizable resume builder using Next.js and pdf-lib",
            "Implemented data encryption for local resume storage",
            "Added real-time preview with auto-save and PDF download"
          ]
        },
        {
          name: "Friendship Score Tester",
          link: "https://friendshipquiz.fun",
          description: [
            "Developed a fun personality quiz app with unique shareable links",
            "Integrated Google Analytics and Propeller Ads for monetization"
          ]
        }
      ]
    },
    {
      id: "custom-1",
      title: "Hobbies",
      type: "custom",
      order: 7,
      content: [
        "Playing chess in free time",
        "Writing Punjabi poetry",
        "Learning AI and transformers"
      ]
    }
  ]
}
