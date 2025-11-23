import { ResumeData } from "@/types/resume";

export const sampleResume: ResumeData = {
  basics: {
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 555-123-4567",
    location: "San Francisco, CA, USA",
    linkedin: "https://linkedin.com/in/johndoe",
    summary:
      "Full-stack JavaScript developer with 4+ years of experience building scalable, user-centric applications. Strong expertise in React, Node.js, and cloud-native deployments. Passionate about performance optimization and clean architecture."
  },

  custom: {
    dob: {
      title: "Date of Birth",
      content: "1995-03-22",
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
      content: "https://johndoe.dev",
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
          institution: "University of California, Berkeley",
          degree: "B.Sc. in Computer Science",
          startDate: "2013",
          endDate: "2017",
          location: "Berkeley, CA",
          highlights: [
            "Graduated with Distinction",
            "Completed senior project on real-time data visualization using WebSockets"
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
          company: "BlueWave Technologies",
          role: "Full-Stack Developer",
          startDate: "2022-01",
          endDate: "Present",
          location: "San Francisco, CA",
          achievements: [
            "Developed internal dashboards using React and TypeScript",
            "Improved backend performance by 30% using Node.js and Redis caching",
            "Worked on microservices architecture with Docker and Kubernetes"
          ]
        },
        {
          company: "Innovate Labs",
          role: "Frontend Developer",
          startDate: "2020-03",
          endDate: "2021-12",
          location: "Remote",
          achievements: [
            "Built modular UI components using React and Tailwind CSS",
            "Implemented form validation and API integrations",
            "Optimized page load times through code-splitting and lazy loading"
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
        "React",
        "Next.js",
        "TypeScript",
        "Node.js",
        "Express",
        "MongoDB",
        "PostgreSQL",
        "Docker",
        "Git"
      ]
    },
    {
      id: "lang-1",
      title: "Languages",
      type: "languages",
      order: 4,
      items: ["English", "Spanish"]
    },
    {
      id: "cert-1",
      title: "Certifications",
      type: "certifications",
      order: 5,
      items: [
        "AWS Certified Developer – Associate",
        "JavaScript Algorithms and Data Structures (freeCodeCamp)"
      ]
    },
    {
      id: "proj-1",
      title: "Projects",
      type: "projects",
      order: 6,
      items: [
        {
          name: "Smart Resume Builder",
          link: "https://resume-demo.app",
          repo: "https://github.com/johndoe/smart-resume-builder",
          description: [
            "Built a customizable resume builder using React and pdf-lib",
            "Implemented drag-and-drop blocks and autosave functionality",
            "Added export options with ATS-optimized formatting"
          ]
        },
        {
          name: "Travel Explorer",
          link: "https://travelexplorer.app",
          description: [
            "Created a location-based travel recommendation platform",
            "Integrated Google Maps API with custom search filters",
            "Implemented responsive UI with Tailwind CSS"
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
        "Playing chess",
        "Photography",
        "Travel blogging",
        "Exploring new JavaScript frameworks"
      ]
    }
  ]
};
