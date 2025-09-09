import { CoverLetter } from "@/types/cover-letter";

export const coverLetterExample: CoverLetter = {
    // Document metadata
    id: "cl_2025_09_001_sr_swe_meta",
    createdDate: new Date("2025-09-07T11:36:00.000Z"),
    lastModified: new Date("2025-09-07T11:36:00.000Z"),
    version: "1.0.0",
    
    // Applicant information
    applicant: {
      firstName: "Sarah",
      lastName: "Chen",
      professionalTitle: "Senior Software Engineer",
      contactInfo: {
        email: "sarah.chen.dev@gmail.com",
        phone: "+1-555-234-7890",
        address: {
          street: "1425 Oak Street, Apt 4B",
          city: "San Francisco",
          state: "CA",
          zipCode: "94117",
          country: "United States"
        },
        linkedin: "https://linkedin.com/in/sarahchendev",
        portfolio: "https://sarahchen.dev",
        website: "https://sarahchen.dev",
        github: "https://github.com/sarahchendev"
      },
      summary: "Results-driven Senior Software Engineer with 7+ years of experience building scalable web applications and leading cross-functional teams."
    },
  
    // Position and company details
    position: {
      jobTitle: "Senior Software Engineer - Platform Team",
      jobReferenceNumber: "REQ-2025-SWE-001",
      company: "Meta Platforms, Inc.",
      department: "Engineering",
      applicationSource: "LinkedIn",
      salaryExpectation: {
        min: 180000,
        max: 220000,
        currency: "USD",
        negotiable: true
      }
    },
  
    // Recipient details
    recipient: {
      name: "Alex Rodriguez",
      title: "Senior Engineering Manager",
      company: "Meta Platforms, Inc.",
      address: {
        street: "1 Hacker Way",
        city: "Menlo Park",
        state: "CA",
        zipCode: "94025"
      },
      department: "Platform Engineering"
    },
  
    // Document structure
    content: {
      date: new Date("2025-09-07T00:00:00.000Z"),
      salutation: "Dear Mr. Rodriguez",
      
      openingParagraph: {
        text: "I am writing to express my strong interest in the Senior Software Engineer position on Meta's Platform Team. With over 7 years of experience building large-scale distributed systems and a proven track record of delivering high-impact features that serve millions of users, I am excited about the opportunity to contribute to Meta's mission of connecting people worldwide through innovative technology solutions.",
        positionMentioned: true,
        companyMentioned: true,
        experienceYears: 7
      },
      
      bodyParagraphs: [
        {
          id: "bp_001_experience",
          text: "In my current role as Senior Software Engineer at Stripe, I lead the development of payment processing infrastructure that handles over $50 billion in annual transaction volume. I architected and implemented a microservices-based system using Python, Go, and Kubernetes that improved system reliability by 99.9% uptime and reduced latency by 35%. My experience with distributed systems, API design, and performance optimization directly aligns with Meta's platform engineering challenges.",
          focus: "experience",
          keywords: ["distributed systems", "microservices", "Python", "Go", "Kubernetes", "API design", "performance optimization", "scalability"]
        },
        {
          id: "bp_002_achievements",
          text: "Throughout my career, I have consistently delivered measurable business impact through technical excellence. At my previous role at Airbnb, I spearheaded the migration of the booking system to a React and GraphQL architecture, resulting in a 40% improvement in page load times and a 25% increase in conversion rates. I also mentored 8 junior engineers and established code review standards that reduced production bugs by 60%, demonstrating my commitment to both technical leadership and team development.",
          focus: "achievements",
          keywords: ["React", "GraphQL", "technical leadership", "mentoring", "code review", "performance improvement"]
        },
        {
          id: "bp_003_company_research",
          text: "I am particularly drawn to Meta's commitment to building the next generation of social technology and your recent investments in AR/VR platforms. Your focus on creating immersive experiences that bring people together resonates with my passion for leveraging technology to solve complex human connection challenges. I am excited about the opportunity to work on Meta's platform infrastructure that enables billions of users to connect, share, and build communities globally.",
          focus: "company_research",
          keywords: ["social technology", "AR/VR", "platform infrastructure", "user experience", "community building"]
        }
      ],
      
      closingParagraph: {
        text: "I would welcome the opportunity to discuss how my technical expertise, leadership experience, and passion for building scalable systems can contribute to Meta's platform engineering goals. I am available for an interview at your convenience and look forward to hearing from you.",
        callToAction: "I would welcome the opportunity to discuss how my technical expertise can contribute to Meta's platform engineering goals",
        availability: "available for an interview at your convenience"
      },
      
      complimentaryClose: "Best regards"
    },
  
    // Supporting information
    qualifications: {
      workExperience: [
        {
          jobTitle: "Senior Software Engineer",
          company: "Stripe",
          startDate: new Date("2022-03-01T00:00:00.000Z"),
          endDate: undefined,
          isCurrentPosition: true,
          keyResponsibilities: [
            "Lead development of payment processing infrastructure serving $50B+ annual volume",
            "Design and implement microservices architecture using Python, Go, and Kubernetes",
            "Collaborate with cross-functional teams to deliver high-impact platform features",
            "Mentor junior engineers and establish engineering best practices"
          ],
          achievements: [
            {
              id: "ach_001",
              description: "Improved system reliability and reduced latency",
              metrics: {
                value: 35,
                unit: "percent",
                context: "latency reduction through optimization"
              },
              keywords: ["performance", "optimization", "latency"]
            }
          ],
          technologies: ["Python", "Go", "Kubernetes", "PostgreSQL", "Redis", "Docker", "AWS"]
        },
        {
          jobTitle: "Software Engineer II",
          company: "Airbnb",
          startDate: new Date("2019-06-01T00:00:00.000Z"),
          endDate: new Date("2022-02-28T00:00:00.000Z"),
          isCurrentPosition: false,
          keyResponsibilities: [
            "Developed and maintained booking platform serving millions of users",
            "Migrated legacy systems to modern React and GraphQL architecture",
            "Implemented A/B testing framework for feature experimentation",
            "Collaborated with product managers and designers on user experience improvements"
          ],
          achievements: [
            {
              id: "ach_002",
              description: "Improved page load times and conversion rates",
              metrics: {
                value: 40,
                unit: "percent",
                context: "page load time improvement"
              },
              keywords: ["performance", "conversion", "user experience"]
            }
          ],
          technologies: ["React", "GraphQL", "Node.js", "PostgreSQL", "TypeScript", "Jest"]
        }
      ],
      
      education: [
        {
          degree: "Master of Science",
          institution: "Stanford University",
          graduationYear: 2018,
          major: "Computer Science",
          gpa: 3.8,
          relevantCoursework: ["Distributed Systems", "Machine Learning", "Advanced Algorithms", "Database Systems"]
        },
        {
          degree: "Bachelor of Science",
          institution: "University of California, Berkeley",
          graduationYear: 2016,
          major: "Computer Science",
          gpa: 3.7,
          relevantCoursework: ["Data Structures", "Software Engineering", "Computer Networks", "Operating Systems"]
        }
      ],
      
      certifications: [
        {
          name: "AWS Solutions Architect Professional",
          issuer: "Amazon Web Services",
          dateObtained: new Date("2024-01-15T00:00:00.000Z"),
          expirationDate: new Date("2027-01-15T00:00:00.000Z"),
          credentialId: "AWS-SAP-2024-001"
        },
        {
          name: "Certified Kubernetes Administrator",
          issuer: "Cloud Native Computing Foundation",
          dateObtained: new Date("2023-06-20T00:00:00.000Z"),
          expirationDate: new Date("2026-06-20T00:00:00.000Z"),
          credentialId: "CKA-2023-001"
        }
      ],
      
      skills: [
        {
          category: "Programming Languages",
          skills: ["Python", "Go", "JavaScript", "TypeScript", "Java", "SQL"],
          proficiencyLevel: "expert"
        },
        {
          category: "Web Technologies",
          skills: ["React", "GraphQL", "REST APIs", "Node.js", "HTML5", "CSS3"],
          proficiencyLevel: "expert"
        },
        {
          category: "Infrastructure & DevOps",
          skills: ["Kubernetes", "Docker", "AWS", "Terraform", "CI/CD", "Monitoring"],
          proficiencyLevel: "advanced"
        },
        {
          category: "Databases",
          skills: ["PostgreSQL", "Redis", "MongoDB", "Elasticsearch"],
          proficiencyLevel: "advanced"
        }
      ],
      
      achievements: [
        {
          id: "ach_003",
          description: "Led cross-functional team to deliver major platform migration ahead of schedule",
          metrics: {
            value: 20,
            unit: "percent",
            context: "ahead of projected timeline"
          },
          keywords: ["leadership", "project management", "migration"]
        },
        {
          id: "ach_004",
          description: "Reduced production incidents through improved monitoring and alerting",
          metrics: {
            value: 60,
            unit: "percent",
            context: "reduction in production bugs"
          },
          keywords: ["monitoring", "reliability", "production"]
        }
      ],
      
      languages: [
        {
          language: "English",
          proficiency: "native"
        },
        {
          language: "Mandarin",
          proficiency: "fluent"
        },
        {
          language: "Spanish",
          proficiency: "conversational"
        }
      ]
    },
  
    // ATS optimization
    atsOptimization: {
      targetKeywords: [
        "Senior Software Engineer",
        "distributed systems",
        "microservices",
        "Python",
        "Go",
        "Kubernetes",
        "scalability",
        "performance optimization",
        "API design",
        "technical leadership",
        "React",
        "GraphQL"
      ],
      industryTerms: [
        "platform engineering",
        "infrastructure",
        "cloud computing",
        "DevOps",
        "continuous integration",
        "system architecture",
        "database optimization",
        "monitoring and alerting",
        "code review",
        "agile development"
      ],
      jobRequirementMatch: [
        {
          requirement: "7+ years of software engineering experience",
          matchingExperience: "7 years of experience building scalable web applications",
          matchScore: 10
        },
        {
          requirement: "Experience with distributed systems and microservices",
          matchingExperience: "Led development of microservices-based payment processing infrastructure",
          matchScore: 10
        },
        {
          requirement: "Proficiency in Python and Go",
          matchingExperience: "Expert-level proficiency in Python and Go with production experience",
          matchScore: 10
        },
        {
          requirement: "Experience with Kubernetes and containerization",
          matchingExperience: "Implemented systems using Kubernetes and Docker, holds CKA certification",
          matchScore: 10
        },
        {
          requirement: "Technical leadership experience",
          matchingExperience: "Mentored 8 junior engineers and established code review standards",
          matchScore: 9
        }
      ],
      readabilityScore: 85,
      keywordDensity: 3.2
    },
  
    // Customization and targeting
    customization: {
      companyResearch: {
        companyValues: [
          "Give people the power to build community and bring the world closer together",
          "Move fast and break things",
          "Focus on long-term impact",
          "Be bold and take risks"
        ],
        recentNews: [
          "Meta's continued investment in AR/VR technology",
          "Launch of new platform infrastructure initiatives",
          "Focus on AI and machine learning capabilities"
        ],
        productsServices: [
          "Facebook",
          "Instagram",
          "WhatsApp",
          "Meta Quest",
          "Workplace",
          "Platform APIs"
        ],
        culture: [
          "Engineering excellence",
          "Data-driven decision making",
          "Collaborative cross-functional teams",
          "Innovation and experimentation",
          "Global impact mindset"
        ]
      },
      positionAlignment: {
        requirementsMet: [
          "7+ years software engineering experience",
          "Distributed systems expertise",
          "Python and Go proficiency",
          "Kubernetes and containerization experience",
          "Technical leadership and mentoring",
          "API design and development",
          "Performance optimization experience"
        ],
        uniqueValueProposition: [
          "Proven track record with high-volume financial systems",
          "Experience scaling systems to handle billions in transaction volume",
          "Strong background in both technical execution and team leadership",
          "Deep expertise in modern cloud-native technologies"
        ],
        careerGoalAlignment: "Seeking to leverage my platform engineering expertise to build systems that connect billions of users globally"
      },
      personalizations: {
        connectionToCompany: "Passionate about Meta's mission to connect people through technology",
        referralSource: undefined,
        specificProjectsInterested: [
          "Platform infrastructure optimization",
          "API gateway development",
          "Microservices architecture",
          "Performance and reliability improvements"
        ]
      }
    },
  
    // Formatting and style
    formatting: {
      fontFamily: "Arial",
      fontSize: 11,
      lineHeight: 1.15,
      margins: {
        top: 1.0,
        bottom: 1.0,
        left: 1.0,
        right: 1.0
      },
      colorScheme: {
        primary: "#000000",
        text: "#000000",
        background: "#FFFFFF"
      },
      layout: "traditional"
    },
  
    // Attachments and additional documents
    attachments: {
      resume: true,
      portfolio: true,
      references: false,
      coverLetter: true,
      other: undefined
    },
  
    // Tracking and analytics
    tracking: {
      applicationDate: new Date("2025-09-07T11:36:00.000Z"),
      responseReceived: false,
      responseDate: undefined,
      interviewRequested: false,
      status: "sent",
      notes: [
        "Applied through LinkedIn job posting",
        "Emphasized platform engineering experience and scalability expertise",
        "Highlighted alignment with Meta's mission and values"
      ]
    }
  };
  