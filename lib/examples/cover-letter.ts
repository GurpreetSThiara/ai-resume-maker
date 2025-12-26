import { CoverLetter } from "@/types/cover-letter";
import { getDefaultTemplate } from '@/lib/config/cover-letter-templates';

export const coverLetterExample: CoverLetter = {
  id: "cl-2025-003",
  createdDate: new Date("2025-11-01"),
  lastModified: new Date("2025-11-10"),
  version: "1.0.0",

  applicant: {
    firstName: "John",
    lastName: "Doe",
    professionalTitle: "Full Stack Developer",
    contactInfo: {
      email: "john.doe@example.com",
      phone: "+1 (415) 555-0187",
      address: "123 Market Street, San Francisco, CA 94103, USA",
      linkedin: "https://linkedin.com/in/john-doe",
      // portfolio: "https://johndoe.dev",
      // github: "https://github.com/johndoe"
    },
    summary: "Experienced full stack developer with 5+ years of expertise building scalable, high-performance web applications."
  },

  position: {
    jobTitle: "Software Engineer",
    jobReferenceNumber: "SE2025-SF",
    company: "InnovaTech Labs",
    department: "Engineering",
    applicationSource: "LinkedIn",
    salaryExpectation: {
      min: 110000,
      max: 130000,
      currency: "USD",
      negotiable: true
    }
  },

  recipient: {
    name: "Riya Patel",
    title: "HR Manager",
    company: "InnovaTech Labs",
    address: "500 Mission Street, San Francisco, CA 94105, USA",
    department: "Human Resources"
  },

  content: {
    date: new Date("2025-11-15"),
    salutation: "Dear Ms. Patel",
    openingParagraph: {
      text: "I am eager to apply for the Software Engineer position at InnovaTech Labs. With over five years of professional experience in full stack JavaScript development, I am confident that my technical expertise and problem-solving mindset align perfectly with your company’s needs.",
      positionMentioned: true,
      companyMentioned: true,
      experienceYears: 5
    },
    bodyParagraphs: [
      {
        id: "bp1",
        text: "At CloudSphere Solutions, I led the redevelopment of a customer analytics dashboard using Next.js and React, improving load times by 35% and enhancing client retention metrics.",
        keywords: ["Next.js", "React", "performance"]
      },
      {
        id: "bp2",
        text: "I bring a deep understanding of modern web stacks—React, Node.js, and TypeScript—enabling me to build stable, scalable applications for enterprise environments.",
        keywords: ["React", "Node.js", "TypeScript"]
      },
      {
        id: "bp3",
        text: "I’m particularly inspired by InnovaTech’s dedication to advancing AI-driven products, and I would be excited to contribute my hands-on experience in machine learning integration to your next-generation platforms.",
        keywords: ["AI", "innovation", "machine learning"]
      }
    ],
    closingParagraph: {
      text: "Thank you for considering my application. I look forward to the opportunity to discuss how my skills and experience can contribute to InnovaTech’s continued success.",
      callToAction: "I am available for an interview at your earliest convenience.",
      availability: "Available immediately"
    },
    complimentaryClose: "Sincerely"
  },

  qualifications: {
    workExperience: [
      {
        jobTitle: "Senior Software Engineer",
        company: "CloudSphere Solutions",
        startDate: new Date("2024-09-01"),
        isCurrentPosition: true,
        keyResponsibilities: [
          "Developed modular React components and reusable services using TypeScript.",
          "Improved API response speed through Node.js optimization and caching.",
          "Collaborated across UI, backend, and QA teams to ensure smooth delivery cycles."
        ],
        achievements: [
          {
            id: "ach1",
            description: "Reduced page load times by 35%.",
            metrics: { value: 35, unit: "percent", context: "page performance" },
            keywords: ["performance", "optimization"]
          }
        ],
        technologies: ["React", "Next.js", "TypeScript", "Node.js", "MongoDB"]
      }
    ],
    education: [
      {
        degree: "Bachelor of Science",
        institution: "University of California, Berkeley",
        graduationYear: 2021,
        major: "Computer Science",
        gpa: 3.7
      }
    ],
    certifications: [
      {
        name: "AWS Certified Developer – Associate",
        issuer: "Amazon Web Services",
        dateObtained: new Date("2024-06-01"),
        expirationDate: new Date("2027-06-01"),
        credentialId: "AWS987654321"
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
        description: "Built a SaaS analytics tool serving 15,000+ active users.",
        metrics: { value: 15000, unit: "users" },
        keywords: ["SaaS", "analytics", "scalability"]
      }
    ],
    languages: [
      { language: "English", proficiency: "native" },
      { language: "Spanish", proficiency: "conversational" }
    ]
  },

  atsOptimization: {
    targetKeywords: ["React", "Next.js", "TypeScript", "Node.js", "full stack"],
    industryTerms: ["agile development", "REST APIs", "cloud computing"],
    jobRequirementMatch: [
      { requirement: "Experience with Next.js", matchingExperience: "Redesigned analytics dashboard in Next.js", matchScore: 9 },
      { requirement: "Proficiency in TypeScript", matchingExperience: "Used TypeScript for all major modules", matchScore: 9 }
    ],
    readabilityScore: 87,
    keywordDensity: 3.0
  },

  customization: {
    companyResearch: {
      companyValues: ["Innovation", "Integrity", "Customer Focus"],
      recentNews: ["InnovaTech launched a cloud data platform for enterprise analytics"],
      productsServices: ["AI analytics tools", "Cloud-based enterprise platforms"],
      culture: ["Collaborative", "Inclusive", "Growth-oriented"]
    },
    positionAlignment: {
      requirementsMet: ["5 years JavaScript experience", "Strong React and Node.js proficiency"],
      uniqueValueProposition: ["Proven track record in scalable web systems", "Hands-on AI integration experience"],
      careerGoalAlignment: "Aiming to build cutting-edge platforms that make a measurable business impact."
    },
    personalizations: {
      connectionToCompany: "Inspired by InnovaTech’s focus on innovation and cloud technology.",
      referralSource: "LinkedIn job listing",
      specificProjectsInterested: ["AI-powered data visualization platform"]
    }
  },

  formatting: {
    fontFamily: "Calibri",
    fontSize: 12,
    lineHeight: 1.5,
    margins: { top: 1, bottom: 1, left: 1, right: 1 },
    colorScheme: {
      primary: "#0044cc",
      text: "#000000",
      background: "#ffffff"
    },
    layout: getDefaultTemplate().value
  },

  attachments: {
    resume: true,
    // portfolio: true,
    references: false,
    coverLetter: true,
    other: ["Certificates.pdf"]
  },

  tracking: {
    applicationDate: new Date("2025-11-15"),
    responseReceived: false,
    status: "sent",
    notes: ["Submitted via LinkedIn job application"]
  }
};
