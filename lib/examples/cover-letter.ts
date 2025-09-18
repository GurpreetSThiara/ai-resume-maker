import { CoverLetter } from "@/types/cover-letter";

export const coverLetterExample: CoverLetter = {
  id: "cl-2025-001",
  createdDate: new Date("2025-09-01"),
  lastModified: new Date("2025-09-10"),
  version: "1.0.0",

  applicant: {
    firstName: "Arjun",
    lastName: "Mehta",
    professionalTitle: "Full Stack Developer",
    contactInfo: {
      email: "arjun.mehta@example.com",
      phone: "+91-9876543210",
      address: {
        street: "123 MG Road",
        city: "Bangalore",
        state: "Karnataka",
        zipCode: "560001",
        country: "India",
      },
      linkedin: "https://linkedin.com/in/arjun-mehta",
      portfolio: "https://arjunportfolio.dev",
      github: "https://github.com/arjunmehta",
    },
    summary: "Passionate full stack developer with 5+ years of experience building scalable web applications."
  },

  position: {
    jobTitle: "Software Engineer",
    jobReferenceNumber: "SE2025-BLR",
    company: "TechNova Solutions",
    department: "Engineering",
    applicationSource: "LinkedIn",
    salaryExpectation: {
      min: 1200000,
      max: 1500000,
      currency: "INR",
      negotiable: true
    }
  },

  recipient: {
    name: "Priya Sharma",
    title: "HR Manager",
    company: "TechNova Solutions",
    address: {
      street: "456 Innovation Park",
      city: "Bangalore",
      state: "Karnataka",
      zipCode: "560100"
    },
    department: "Human Resources"
  },

  content: {
    date: new Date("2025-09-15"),
    salutation: "Dear Ms. Sharma",
    openingParagraph: {
      text: "I am excited to apply for the Software Engineer role at TechNova Solutions. With 5 years of hands-on experience in MERN stack development, I am confident in my ability to contribute to your innovative projects.",
      positionMentioned: true,
      companyMentioned: true,
      experienceYears: 5
    },
    bodyParagraphs: [
      {
        id: "bp1",
        text: "In my current role at Logiceil Solutions, I led the development of a scalable calendar system in Next.js, improving performance by 30%.",
        focus: "experience",
        keywords: ["Next.js", "scalable", "performance"]
      },
      {
        id: "bp2",
        text: "My expertise in React, Node.js, and TypeScript enables me to build reliable, maintainable, and high-performing web applications.",
        focus: "skills",
        keywords: ["React", "Node.js", "TypeScript"]
      },
      {
        id: "bp3",
        text: "I admire TechNova’s commitment to AI-driven solutions and would be thrilled to bring my experience in machine learning integration to your projects.",
        focus: "company_research",
        keywords: ["AI", "innovation", "machine learning"]
      }
    ],
    closingParagraph: {
      text: "Thank you for considering my application. I look forward to discussing how my skills align with TechNova’s mission.",
      callToAction: "I am available for an interview at your earliest convenience.",
      availability: "Available immediately"
    },
    complimentaryClose: "Sincerely"
  },

  qualifications: {
    workExperience: [
      {
        jobTitle: "Associate Software Engineer",
        company: "Logiceil Solutions",
        startDate: new Date("2024-10-01"),
        isCurrentPosition: true,
        keyResponsibilities: [
          "Developed custom calendar components in Next.js",
          "Optimized frontend performance using React memoization",
          "Collaborated with cross-functional teams"
        ],
        achievements: [
          {
            id: "ach1",
            description: "Improved load times of core web app by 30%",
            metrics: { value: 30, unit: "percent", context: "page performance" },
            keywords: ["performance", "optimization"]
          }
        ],
        technologies: ["React", "Next.js", "TypeScript", "Node.js"]
      }
    ],
    education: [
      {
        degree: "B.Tech",
        institution: "IIT Delhi",
        graduationYear: 2023,
        major: "Computer Science",
        gpa: 8.5
      }
    ],
    certifications: [
      {
        name: "AWS Certified Developer – Associate",
        issuer: "Amazon Web Services",
        dateObtained: new Date("2024-05-01"),
        expirationDate: new Date("2027-05-01"),
        credentialId: "AWS123456789"
      }
    ],
    skills: [
      { category: "Frontend", skills: ["React", "Next.js", "Tailwind CSS"], proficiencyLevel: "expert" },
      { category: "Backend", skills: ["Node.js", "Express", "MongoDB"], proficiencyLevel: "advanced" },
      { category: "DevOps", skills: ["Docker", "AWS", "CI/CD"], proficiencyLevel: "intermediate" }
    ],
    achievements: [
      {
        id: "ach2",
        description: "Built an AI-powered resume builder used by 20,000+ users",
        metrics: { value: 20000, unit: "users" },
        keywords: ["AI", "resume builder"]
      }
    ],
    languages: [
      { language: "English", proficiency: "fluent" },
      { language: "Hindi", proficiency: "native" }
    ]
  },

  atsOptimization: {
    targetKeywords: ["React", "Next.js", "TypeScript", "Node.js", "scalable applications"],
    industryTerms: ["full stack", "MERN stack", "agile development"],
    jobRequirementMatch: [
      { requirement: "Experience with Next.js", matchingExperience: "Built custom calendar in Next.js", matchScore: 9 },
      { requirement: "Proficiency in TypeScript", matchingExperience: "Used TypeScript in all major projects", matchScore: 8 }
    ],
    readabilityScore: 85,
    keywordDensity: 3.2
  },

  customization: {
    companyResearch: {
      companyValues: ["Innovation", "Collaboration", "Excellence"],
      recentNews: ["Launched AI-powered project management tool"],
      productsServices: ["Cloud solutions", "AI platforms"],
      culture: ["Open communication", "Employee growth"]
    },
    positionAlignment: {
      requirementsMet: ["5 years of experience", "Proficiency in React and Node.js"],
      uniqueValueProposition: ["Expert in scalable frontend design", "Experience in AI integration"],
      careerGoalAlignment: "I aim to lead innovative full stack projects that impact millions."
    },
    personalizations: {
      connectionToCompany: "Inspired by TechNova’s AI initiatives",
      referralSource: "LinkedIn job post",
      specificProjectsInterested: ["AI-powered collaboration platform"]
    }
  },

  formatting: {
    fontFamily: "Calibri",
    fontSize: 12,
    lineHeight: 1.5,
    margins: { top: 1, bottom: 1, left: 1, right: 1 },
    colorScheme: {
      primary: "#0056b3",
      text: "#000000",
      background: "#ffffff"
    },
    layout: "modern"
  },

  attachments: {
    resume: true,
    portfolio: true,
    references: false,
    coverLetter: true,
    other: ["Certificates.pdf"]
  },

  tracking: {
    applicationDate: new Date("2025-09-15"),
    responseReceived: false,
    status: "sent",
    notes: ["Submitted via LinkedIn job portal"]
  }
};
