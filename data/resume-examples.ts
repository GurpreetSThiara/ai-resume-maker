import { ResumeData, SECTION_TYPES } from "@/types/resume"

export interface ResumeExample {
    id: string
    title: string
    industry: string
    experienceLevel: "entry" | "mid" | "senior" | "executive"
    description: string
    templateId: string
    data: ResumeData
}

// Software Engineer - Senior Level
const softwareEngineerExample: ResumeExample = {
    id: "senior-software-engineer",
    title: "Senior Software Engineer",
    industry: "Technology",
    experienceLevel: "senior",
    description: "Full-stack developer with 7 years of experience in building scalable web applications",
    templateId: "ats-classic",
    data: {
        basics: {
            name: "Alex Chen",
            email: "alex.chen@email.com",
            phone: "+1 (555) 123-4567",
            location: "San Francisco, CA",
            linkedin: "linkedin.com/in/alexchen",
            summary: "Results-driven Senior Software Engineer with 7+ years of experience building scalable web applications. Proven track record of leading development teams and delivering high-impact features that serve millions of users. Expert in React, Node.js, and cloud architecture."
        },
        custom: {},
        sections: [
            {
                id: "experience-1",
                title: "Experience",
                type: SECTION_TYPES.EXPERIENCE,
                order: 1,
                items: [
                    {
                        company: "TechCorp Inc.",
                        role: "Senior Software Engineer",
                        startDate: "Jan 2021",
                        endDate: "Present",
                        location: "San Francisco, CA",
                        achievements: [
                            "Led development of microservices architecture serving 5M+ daily active users, reducing load times by 40%",
                            "Mentored team of 5 junior engineers, improving code quality metrics by 35% through pair programming",
                            "Architected and deployed CI/CD pipeline using GitHub Actions, reducing deployment time from 2 hours to 15 minutes",
                            "Implemented comprehensive monitoring using DataDog, reducing production incidents by 60%"
                        ]
                    },
                    {
                        company: "StartupXYZ",
                        role: "Software Engineer",
                        startDate: "Jun 2018",
                        endDate: "Dec 2020",
                        location: "Remote",
                        achievements: [
                            "Built real-time chat feature using WebSockets and Redis, handling 100K concurrent connections",
                            "Optimized database queries resulting in 50% reduction in API response times",
                            "Developed RESTful APIs using Node.js and Express, serving 1M+ requests daily",
                            "Collaborated with product team to design and implement user analytics dashboard"
                        ]
                    },
                    {
                        company: "Digital Solutions Ltd.",
                        role: "Junior Software Engineer",
                        startDate: "Jul 2017",
                        endDate: "May 2018",
                        location: "Austin, TX",
                        achievements: [
                            "Developed responsive web applications using React and TypeScript",
                            "Participated in Agile ceremonies and contributed to sprint planning",
                            "Fixed 100+ bugs and improved test coverage from 40% to 75%"
                        ]
                    }
                ]
            },
            {
                id: "education-1",
                title: "Education",
                type: SECTION_TYPES.EDUCATION,
                order: 2,
                items: [
                    {
                        institution: "University of California, Berkeley",
                        degree: "Bachelor of Science in Computer Science",
                        startDate: "2013",
                        endDate: "2017",
                        location: "Berkeley, CA",
                        highlights: ["GPA: 3.7/4.0", "Dean's List (6 semesters)"]
                    }
                ]
            },
            {
                id: "skills-1",
                title: "Skills",
                type: SECTION_TYPES.SKILLS,
                order: 3,
                items: [
                    "JavaScript",
                    "TypeScript",
                    "React",
                    "Node.js",
                    "Python",
                    "AWS",
                    "Docker",
                    "Kubernetes",
                    "PostgreSQL",
                    "MongoDB",
                    "Redis",
                    "GraphQL",
                    "Git",
                    "CI/CD"
                ]
            },
            {
                id: "certifications-1",
                title: "Certifications",
                type: SECTION_TYPES.CERTIFICATIONS,
                order: 4,
                items: [
                    "AWS Certified Solutions Architect - Associate",
                    "Google Cloud Professional Developer"
                ]
            }
        ]
    }
}

// Product Manager - Mid Level
const productManagerExample: ResumeExample = {
    id: "product-manager",
    title: "Product Manager",
    industry: "Product",
    experienceLevel: "mid",
    description: "Strategic product manager with 5 years of experience launching successful B2B SaaS products",
    templateId: "classic_blue",
    data: {
        basics: {
            name: "Sarah Johnson",
            email: "sarah.johnson@email.com",
            phone: "+1 (555) 234-5678",
            location: "New York, NY",
            linkedin: "linkedin.com/in/sarahjohnson",
            summary: "Data-driven Product Manager with 5 years of experience launching B2B SaaS products that drive revenue growth. Expertise in user research, roadmap planning, and cross-functional collaboration. Successfully launched 8+ features with 95% user satisfaction rate."
        },
        custom: {},
        sections: [
            {
                id: "experience-1",
                title: "Experience",
                type: SECTION_TYPES.EXPERIENCE,
                order: 1,
                items: [
                    {
                        company: "CloudTech Solutions",
                        role: "Product Manager",
                        startDate: "Mar 2021",
                        endDate: "Present",
                        location: "New York, NY",
                        achievements: [
                            "Led product strategy for enterprise collaboration platform, growing ARR from $2M to $8M in 2 years",
                            "Defined and prioritized product roadmap based on customer feedback, market research, and business goals",
                            "Launched mobile app that achieved 50K downloads and 4.7 App Store rating within first 3 months",
                            "Conducted 100+ user interviews and usability tests to validate product hypotheses",
                            "Collaborated with engineering, design, and marketing teams to deliver 15+ major features on time"
                        ]
                    },
                    {
                        company: "DataMetrics Inc.",
                        role: "Associate Product Manager",
                        startDate: "Jun 2019",
                        endDate: "Feb 2021",
                        location: "Boston, MA",
                        achievements: [
                            "Managed analytics dashboard feature used by 10K+ daily active users",
                            "Increased user engagement by 35% through A/B testing and iterative improvements",
                            "Created product requirements documents and user stories for engineering team",
                            "Presented quarterly product updates to C-suite executives and board members"
                        ]
                    }
                ]
            },
            {
                id: "education-1",
                title: "Education",
                type: SECTION_TYPES.EDUCATION,
                order: 2,
                items: [
                    {
                        institution: "New York University",
                        degree: "Master of Business Administration (MBA)",
                        startDate: "2017",
                        endDate: "2019",
                        location: "New York, NY",
                        highlights: ["Concentration: Product Management & Strategy"]
                    },
                    {
                        institution: "Cornell University",
                        degree: "Bachelor of Science in Business Administration",
                        startDate: "2013",
                        endDate: "2017",
                        location: "Ithaca, NY",
                        highlights: ["GPA: 3.8/4.0", "Magna Cum Laude"]
                    }
                ]
            },
            {
                id: "skills-1",
                title: "Skills",
                type: SECTION_TYPES.SKILLS,
                order: 3,
                items: [
                    "Product Strategy",
                    "User Research",
                    "A/B Testing",
                    "Data Analysis",
                    "SQL",
                    "Jira",
                    "Figma",
                    "Agile/Scrum",
                    "Roadmap Planning",
                    "Stakeholder Management",
                    "Market Research",
                    "Wireframing"
                ]
            },
            {
                id: "certifications-1",
                title: "Certifications",
                type: SECTION_TYPES.CERTIFICATIONS,
                order: 4,
                items: [
                    "Certified Scrum Product Owner (CSPO)",
                    "Product Management Certificate - General Assembly"
                ]
            }
        ]
    }
}

// Marketing Professional - Mid Level
const marketingProfessionalExample: ResumeExample = {
    id: "marketing-manager",
    title: "Digital Marketing Manager",
    industry: "Marketing",
    experienceLevel: "mid",
    description: "Creative marketing professional with 4 years driving growth through digital campaigns and content strategy",
    templateId: "ats-yellow",
    data: {
        basics: {
            name: "Michael Rodriguez",
            email: "michael.rodriguez@email.com",
            phone: "+1 (555) 345-6789",
            location: "Los Angeles, CA",
            linkedin: "linkedin.com/in/michaelrodriguez",
            summary: "Results-oriented Digital Marketing Manager with 4+ years of experience driving brand awareness and customer acquisition. Expertise in content marketing, SEO/SEM, and social media strategy. Proven track record of increasing organic traffic by 200% and generating $5M+ in revenue through digital campaigns."
        },
        custom: {},
        sections: [
            {
                id: "experience-1",
                title: "Experience",
                type: SECTION_TYPES.EXPERIENCE,
                order: 1,
                items: [
                    {
                        company: "GrowthHub Marketing",
                        role: "Digital Marketing Manager",
                        startDate: "Jan 2022",
                        endDate: "Present",
                        location: "Los Angeles, CA",
                        achievements: [
                            "Developed and executed content marketing strategy that increased organic traffic by 200% in 12 months",
                            "Managed $500K annual marketing budget across Google Ads, Facebook, and LinkedIn campaigns",
                            "Led email marketing campaigns with average open rate of 35% and CTR of 8% (2x industry average)",
                            "Improved conversion rate by 45% through landing page optimization and A/B testing",
                            "Grew Instagram following from 5K to 50K through engaging content and influencer partnerships"
                        ]
                    },
                    {
                        company: "BrandBuilders Agency",
                        role: "Marketing Coordinator",
                        startDate: "Jul 2020",
                        endDate: "Dec 2021",
                        location: "San Diego, CA",
                        achievements: [
                            "Created and managed social media content calendar for 15+ client accounts",
                            "Increased average client engagement rate by 60% through data-driven content strategy",
                            "Conducted keyword research and implemented SEO best practices, improving rankings for 50+ keywords",
                            "Designed email campaigns that generated $2M in revenue for e-commerce clients"
                        ]
                    }
                ]
            },
            {
                id: "education-1",
                title: "Education",
                type: SECTION_TYPES.EDUCATION,
                order: 2,
                items: [
                    {
                        institution: "University of Southern California",
                        degree: "Bachelor of Arts in Marketing",
                        startDate: "2016",
                        endDate: "2020",
                        location: "Los Angeles, CA",
                        highlights: ["GPA: 3.6/4.0", "Marketing Association President"]
                    }
                ]
            },
            {
                id: "skills-1",
                title: "Skills",
                type: SECTION_TYPES.SKILLS,
                order: 3,
                items: [
                    "Content Marketing",
                    "SEO/SEM",
                    "Google Analytics",
                    "Google Ads",
                    "Facebook Ads",
                    "Email Marketing",
                    "Social Media Management",
                    "Copywriting",
                    "HubSpot",
                    "WordPress",
                    "Photoshop",
                    "Canva"
                ]
            },
            {
                id: "certifications-1",
                title: "Certifications",
                type: SECTION_TYPES.CERTIFICATIONS,
                order: 4,
                items: [
                    "Google Analytics Certified",
                    "HubSpot Content Marketing Certification",
                    "Google Ads Certification"
                ]
            }
        ]
    }
}

// Data Scientist - Senior Level
const dataScientistExample: ResumeExample = {
    id: "senior-data-scientist",
    title: "Senior Data Scientist",
    industry: "Data Science",
    experienceLevel: "senior",
    description: "Data scientist with 6 years of experience building ML models and driving business insights",
    templateId: "ats-classic",
    data: {
        basics: {
            name: "Dr. Emily Watson",
            email: "emily.watson@email.com",
            phone: "+1 (555) 456-7890",
            location: "Seattle, WA",
            linkedin: "linkedin.com/in/emilywatson",
            summary: "Senior Data Scientist with PhD in Statistics and 6+ years of experience building machine learning models that drive business value. Expert in Python, R, and deep learning frameworks. Successfully deployed models that generated $10M+ in annual revenue and reduced operational costs by 25%."
        },
        custom: {},
        sections: [
            {
                id: "experience-1",
                title: "Experience",
                type: SECTION_TYPES.EXPERIENCE,
                order: 1,
                items: [
                    {
                        company: "Amazon",
                        role: "Senior Data Scientist",
                        startDate: "Apr 2021",
                        endDate: "Present",
                        location: "Seattle, WA",
                        achievements: [
                            "Built recommendation system using collaborative filtering and deep learning, increasing sales by $8M annually",
                            "Developed churn prediction model with 92% accuracy, enabling retention campaigns that saved $2M in revenue",
                            "Led team of 3 data scientists in building fraud detection system that reduced false positives by 40%",
                            "Deployed production ML models using AWS SageMaker, processing 1M+ predictions daily",
                            "Presented insights to VP-level stakeholders to inform strategic decision-making"
                        ]
                    },
                    {
                        company: "Microsoft",
                        role: "Data Scientist",
                        startDate: "Jun 2018",
                        endDate: "Mar 2021",
                        location: "Redmond, WA",
                        achievements: [
                            "Developed NLP model for customer sentiment analysis, processing 100K+ reviews monthly",
                            "Created demand forecasting model that improved inventory management and reduced costs by 15%",
                            "Built A/B testing framework used by product teams across the organization",
                            "Automated data pipelines using Azure Data Factory, saving 20 hours of manual work weekly"
                        ]
                    }
                ]
            },
            {
                id: "education-1",
                title: "Education",
                type: SECTION_TYPES.EDUCATION,
                order: 2,
                items: [
                    {
                        institution: "Stanford University",
                        degree: "PhD in Statistics",
                        startDate: "2014",
                        endDate: "2018",
                        location: "Stanford, CA",
                        highlights: ["Dissertation: 'Advanced Methods in Predictive Modeling'", "Published 8 peer-reviewed papers"]
                    },
                    {
                        institution: "MIT",
                        degree: "Bachelor of Science in Mathematics",
                        startDate: "2010",
                        endDate: "2014",
                        location: "Cambridge, MA",
                        highlights: ["GPA: 3.9/4.0", "Summa Cum Laude"]
                    }
                ]
            },
            {
                id: "skills-1",
                title: "Skills",
                type: SECTION_TYPES.SKILLS,
                order: 3,
                items: [
                    "Python",
                    "R",
                    "SQL",
                    "TensorFlow",
                    "PyTorch",
                    "Scikit-learn",
                    "Pandas",
                    "NumPy",
                    "AWS",
                    "Azure",
                    "Spark",
                    "Tableau",
                    "Machine Learning",
                    "Deep Learning",
                    "NLP",
                    "Statistics"
                ]
            },
            {
                id: "publications-1",
                title: "Publications",
                type: SECTION_TYPES.CUSTOM,
                order: 4,
                content: [
                    "Watson, E. et al. (2020). 'Advanced Ensemble Methods for Predictive Analytics' - Journal of Machine Learning Research",
                    "Watson, E. (2019). 'Deep Learning Applications in E-commerce' - IEEE Conference on Data Science"
                ]
            }
        ]
    }
}

// Healthcare Professional - Entry Level
const healthcareProfessionalExample: ResumeExample = {
    id: "registered-nurse",
    title: "Registered Nurse",
    industry: "Healthcare",
    experienceLevel: "entry",
    description: "Compassionate registered nurse with 2 years of experience in acute care settings",
    templateId: "ats-green",
    data: {
        basics: {
            name: "Jessica Martinez",
            email: "jessica.martinez@email.com",
            phone: "+1 (555) 567-8901",
            location: "Houston, TX",
            linkedin: "linkedin.com/in/jessicamartinez",
            summary: "Dedicated Registered Nurse with 2 years of experience providing high-quality patient care in fast-paced hospital environments. BLS and ACLS certified with strong clinical skills and commitment to patient advocacy. Excellent communication and teamwork abilities."
        },
        custom: {},
        sections: [
            {
                id: "experience-1",
                title: "Experience",
                type: SECTION_TYPES.EXPERIENCE,
                order: 1,
                items: [
                    {
                        company: "Memorial Hermann Hospital",
                        role: "Registered Nurse - Medical/Surgical Unit",
                        startDate: "Jul 2022",
                        endDate: "Present",
                        location: "Houston, TX",
                        achievements: [
                            "Provide direct patient care for 6-8 patients per shift in medical/surgical unit",
                            "Administer medications, monitor vital signs, and document patient progress using Epic EMR system",
                            "Collaborate with interdisciplinary team including physicians, physical therapists, and social workers",
                            "Educate patients and families on post-discharge care and medication management",
                            "Received 'Nurse of the Month' award for exceptional patient satisfaction scores (98%)"
                        ]
                    },
                    {
                        company: "Texas Children's Hospital",
                        role: "Nursing Intern",
                        startDate: "May 2021",
                        endDate: "Jun 2022",
                        location: "Houston, TX",
                        achievements: [
                            "Assisted registered nurses in providing patient care in pediatric intensive care unit",
                            "Performed vital signs monitoring, wound care, and patient hygiene assistance",
                            "Participated in morning rounds and contributed to patient care planning",
                            "Completed 500+ clinical hours across various hospital departments"
                        ]
                    }
                ]
            },
            {
                id: "education-1",
                title: "Education",
                type: SECTION_TYPES.EDUCATION,
                order: 2,
                items: [
                    {
                        institution: "University of Texas Health Science Center",
                        degree: "Bachelor of Science in Nursing (BSN)",
                        startDate: "2017",
                        endDate: "2021",
                        location: "Houston, TX",
                        highlights: ["GPA: 3.7/4.0", "Dean's List (All Semesters)", "Sigma Theta Tau Honor Society"]
                    }
                ]
            },
            {
                id: "skills-1",
                title: "Skills",
                type: SECTION_TYPES.SKILLS,
                order: 3,
                items: [
                    "Patient Assessment",
                    "Medication Administration",
                    "Wound Care",
                    "IV Therapy",
                    "Epic EMR",
                    "Patient Education",
                    "Critical Thinking",
                    "Team Collaboration",
                    "BLS Certified",
                    "ACLS Certified"
                ]
            },
            {
                id: "certifications-1",
                title: "Certifications & Licenses",
                type: SECTION_TYPES.CERTIFICATIONS,
                order: 4,
                items: [
                    "Registered Nurse License - Texas Board of Nursing",
                    "Basic Life Support (BLS) Certification",
                    "Advanced Cardiac Life Support (ACLS) Certification"
                ]
            }
        ]
    }
}

// Finance Professional - Mid Level
const financeProfessionalExample: ResumeExample = {
    id: "financial-analyst",
    title: "Financial Analyst",
    industry: "Finance",
    experienceLevel: "mid",
    description: "Detail-oriented financial analyst with 4 years of experience in corporate finance and FP&A",
    templateId: "ats-classic-compact",
    data: {
        basics: {
            name: "David Kim",
            email: "david.kim@email.com",
            phone: "+1 (555) 678-9012",
            location: "Chicago, IL",
            linkedin: "linkedin.com/in/davidkim",
            summary: "Detail-oriented Financial Analyst with 4+ years of experience in financial planning, analysis, and reporting. CFA Level II candidate with expertise in financial modeling, budgeting, and variance analysis. Proven ability to provide actionable insights that drive business performance and cost optimization."
        },
        custom: {},
        sections: [
            {
                id: "experience-1",
                title: "Experience",
                type: SECTION_TYPES.EXPERIENCE,
                order: 1,
                items: [
                    {
                        company: "Goldman Sachs",
                        role: "Financial Analyst",
                        startDate: "Aug 2021",
                        endDate: "Present",
                        location: "Chicago, IL",
                        achievements: [
                            "Conduct financial analysis and modeling to support M&A transactions valued at $500M+",
                            "Build complex Excel models for DCF, comparable company analysis, and precedent transactions",
                            "Prepare quarterly earnings presentations and financial reports for C-suite executives",
                            "Identified cost-saving opportunities that reduced operational expenses by $2M annually",
                            "Collaborate with cross-functional teams to develop annual budgets and 3-year strategic plans"
                        ]
                    },
                    {
                        company: "Deloitte",
                        role: "Associate Financial Analyst",
                        startDate: "Jun 2020",
                        endDate: "Jul 2021",
                        location: "Chicago, IL",
                        achievements: [
                            "Performed variance analysis and identified key drivers impacting financial performance",
                            "Developed automated financial dashboards using Power BI, reducing reporting time by 50%",
                            "Supported monthly close process and ensured accuracy of financial statements",
                            "Conducted competitive analysis and market research for client engagements"
                        ]
                    }
                ]
            },
            {
                id: "education-1",
                title: "Education",
                type: SECTION_TYPES.EDUCATION,
                order: 2,
                items: [
                    {
                        institution: "University of Chicago Booth School of Business",
                        degree: "Master of Business Administration (MBA)",
                        startDate: "2018",
                        endDate: "2020",
                        location: "Chicago, IL",
                        highlights: ["Concentration: Finance & Accounting", "GPA: 3.8/4.0"]
                    },
                    {
                        institution: "Northwestern University",
                        degree: "Bachelor of Science in Economics",
                        startDate: "2014",
                        endDate: "2018",
                        location: "Evanston, IL",
                        highlights: ["GPA: 3.7/4.0", "Dean's List"]
                    }
                ]
            },
            {
                id: "skills-1",
                title: "Skills",
                type: SECTION_TYPES.SKILLS,
                order: 3,
                items: [
                    "Financial Modeling",
                    "Excel (Advanced)",
                    "PowerPoint",
                    "SQL",
                    "Power BI",
                    "Bloomberg Terminal",
                    "Valuation",
                    "Budgeting & Forecasting",
                    "Variance Analysis",
                    "SAP",
                    "QuickBooks"
                ]
            },
            {
                id: "certifications-1",
                title: "Certifications",
                type: SECTION_TYPES.CERTIFICATIONS,
                order: 4,
                items: [
                    "CFA Level II Candidate",
                    "Financial Modeling & Valuation Analyst (FMVA)"
                ]
            }
        ]
    }
}

// UX/UI Designer - Mid Level
const uxDesignerExample: ResumeExample = {
    id: "ux-ui-designer",
    title: "UX/UI Designer",
    industry: "Design",
    experienceLevel: "mid",
    description: "Creative designer with 5 years crafting intuitive user experiences for web and mobile applications",
    templateId: "classic_blue",
    data: {
        basics: {
            name: "Maya Patel",
            email: "maya.patel@email.com",
            phone: "+1 (555) 789-0123",
            location: "Portland, OR",
            linkedin: "linkedin.com/in/mayapatel",
            summary: "User-centered UX/UI Designer with 5 years of experience creating intuitive digital products. Skilled in user research, wireframing, prototyping, and visual design. Successfully designed interfaces that improved user satisfaction by 40% and increased conversion rates by 25%."
        },
        custom: {},
        sections: [
            {
                id: "experience-1",
                title: "Experience",
                type: SECTION_TYPES.EXPERIENCE,
                order: 1,
                items: [
                    {
                        company: "DesignLab Studios",
                        role: "Senior UX/UI Designer",
                        startDate: "Mar 2022",
                        endDate: "Present",
                        location: "Portland, OR",
                        achievements: [
                            "Led design for e-commerce platform redesign, increasing conversion rate by 35% and revenue by $3M",
                            "Conducted user research with 200+ participants to inform design decisions and validate solutions",
                            "Created comprehensive design system used across 12 product teams, improving design consistency",
                            "Mentored 3 junior designers on UX best practices and design thinking methodologies",
                            "Collaborated with product and engineering teams in agile environment to deliver 20+ features"
                        ]
                    },
                    {
                        company: "CreativeFlow Agency",
                        role: "UX/UI Designer",
                        startDate: "Jun 2019",
                        endDate: "Feb 2022",
                        location: "Seattle, WA",
                        achievements: [
                            "Designed mobile app for healthcare client that achieved 4.8-star rating and 100K+ downloads",
                            "Performed usability testing sessions that identified critical pain points and improved task completion by 50%",
                            "Created wireframes, mockups, and interactive prototypes using Figma and Adobe XD",
                            "Presented design concepts to clients and stakeholders, securing approval for 95% of proposals"
                        ]
                    }
                ]
            },
            {
                id: "education-1",
                title: "Education",
                type: SECTION_TYPES.EDUCATION,
                order: 2,
                items: [
                    {
                        institution: "Rhode Island School of Design",
                        degree: "Bachelor of Fine Arts in Graphic Design",
                        startDate: "2015",
                        endDate: "2019",
                        location: "Providence, RI",
                        highlights: ["GPA: 3.8/4.0", "Digital Design Award 2018"]
                    }
                ]
            },
            {
                id: "skills-1",
                title: "Skills",
                type: SECTION_TYPES.SKILLS,
                order: 3,
                items: [
                    "User Research",
                    "Wireframing",
                    "Prototyping",
                    "Figma",
                    "Adobe XD",
                    "Sketch",
                    "Adobe Creative Suite",
                    "InVision",
                    "Usability Testing",
                    "Design Systems",
                    "HTML/CSS",
                    "Responsive Design"
                ]
            },
            {
                id: "certifications-1",
                title: "Certifications",
                type: SECTION_TYPES.CERTIFICATIONS,
                order: 4,
                items: [
                    "Google UX Design Professional Certificate",
                    "Nielsen Norman Group UX Certification"
                ]
            }
        ]
    }
}

// Sales Manager - Senior Level
const salesManagerExample: ResumeExample = {
    id: "sales-manager",
    title: "Sales Manager",
    industry: "Sales",
    experienceLevel: "senior",
    description: "Results-driven sales leader with 8 years building high-performing teams and exceeding revenue targets",
    templateId: "ats-compact-lines",
    data: {
        basics: {
            name: "James Thompson",
            email: "james.thompson@email.com",
            phone: "+1 (555) 890-1234",
            location: "Atlanta, GA",
            linkedin: "linkedin.com/in/jamesthompson",
            summary: "Dynamic Sales Manager with 8+ years driving revenue growth in B2B SaaS. Proven leader who built and scaled teams from 5 to 25 reps while consistently exceeding quota by 120%+. Expert in strategic planning, pipeline development, and enterprise sales. Generated $50M+ in total revenue."
        },
        custom: {},
        sections: [
            {
                id: "experience-1",
                title: "Experience",
                type: SECTION_TYPES.EXPERIENCE,
                order: 1,
                items: [
                    {
                        company: "SalesTech Solutions",
                        role: "Regional Sales Manager",
                        startDate: "Jan 2020",
                        endDate: "Present",
                        location: "Atlanta, GA",
                        achievements: [
                            "Built and led team of 15 sales representatives, achieving 130% of annual quota for 3 consecutive years",
                            "Generated $18M in new business revenue through strategic account planning and relationship building",
                            "Reduced sales cycle from 6 months to 3.5 months through process optimization and training",
                            "Implemented Salesforce CRM best practices, improving forecast accuracy from 65% to 92%",
                            "Developed sales playbooks and training programs that decreased ramp time for new hires by 40%"
                        ]
                    },
                    {
                        company: "CloudFirst Inc.",
                        role: "Senior Account Executive",
                        startDate: "Mar 2017",
                        endDate: "Dec 2019",
                        location: "Miami, FL",
                        achievements: [
                            "Exceeded annual quota by average of 145% for 3 consecutive years",
                            "Closed largest deal in company history worth $2.5M in ARR",
                            "Managed pipeline of 80+ enterprise accounts across multiple verticals",
                            "Achieved #1 sales rep ranking 8 out of 10 quarters"
                        ]
                    }
                ]
            },
            {
                id: "education-1",
                title: "Education",
                type: SECTION_TYPES.EDUCATION,
                order: 2,
                items: [
                    {
                        institution: "University of Florida",
                        degree: "Bachelor of Business Administration in Marketing",
                        startDate: "2013",
                        endDate: "2017",
                        location: "Gainesville, FL",
                        highlights: ["GPA: 3.5/4.0"]
                    }
                ]
            },
            {
                id: "skills-1",
                title: "Skills",
                type: SECTION_TYPES.SKILLS,
                order: 3,
                items: [
                    "B2B Sales",
                    "Enterprise Sales",
                    "Team Leadership",
                    "Salesforce",
                    "Pipeline Management",
                    "Negotiation",
                    "Account Management",
                    "Sales Strategy",
                    "Revenue Forecasting",
                    "CRM",
                    "Cold Calling",
                    "Presentation Skills"
                ]
            }
        ]
    }
}

// HR Specialist - Mid Level
const hrSpecialistExample: ResumeExample = {
    id: "hr-specialist",
    title: "Human Resources Specialist",
    industry: "Human Resources",
    experienceLevel: "mid",
    description: "Strategic HR professional with 4 years managing full-cycle recruitment and employee relations",
    templateId: "ats-green",
    data: {
        basics: {
            name: "Rachel Green",
            email: "rachel.green@email.com",
            phone: "+1 (555) 901-2345",
            location: "Denver, CO",
            linkedin: "linkedin.com/in/rachelgreen",
            summary: "Strategic Human Resources Specialist with 4+ years of experience in talent acquisition, employee relations, and HR operations. Successfully reduced time-to-hire by 35% and improved employee retention by 20%. Skilled in HRIS systems, compliance, and creating positive workplace culture."
        },
        custom: {},
        sections: [
            {
                id: "experience-1",
                title: "Experience",
                type: SECTION_TYPES.EXPERIENCE,
                order: 1,
                items: [
                    {
                        company: "TechVentures Inc.",
                        role: "HR Specialist",
                        startDate: "Feb 2021",
                        endDate: "Present",
                        location: "Denver, CO",
                        achievements: [
                            "Managed full-cycle recruitment for 60+ positions annually across engineering, sales, and operations",
                            "Reduced average time-to-hire from 45 days to 28 days through process optimization",
                            "Implemented employee onboarding program that improved 90-day retention by 25%",
                            "Conducted 150+ interviews and hired 50+ employees with 95% hiring manager satisfaction rate",
                            "Led employee engagement initiatives resulting in 15% improvement in annual survey scores"
                        ]
                    },
                    {
                        company: "People First Consulting",
                        role: "HR Coordinator",
                        startDate: "Jul 2020",
                        endDate: "Jan 2021",
                        location: "Boulder, CO",
                        achievements: [
                            "Supported recruitment efforts for 10+ client companies across various industries",
                            "Maintained HRIS system and ensured data accuracy for 500+ employee records",
                            "Coordinated benefits enrollment and managed employee inquiries",
                            "Assisted with compliance audits and ensured adherence to employment laws"
                        ]
                    }
                ]
            },
            {
                id: "education-1",
                title: "Education",
                type: SECTION_TYPES.EDUCATION,
                order: 2,
                items: [
                    {
                        institution: "University of Colorado Boulder",
                        degree: "Bachelor of Arts in Human Resources Management",
                        startDate: "2016",
                        endDate: "2020",
                        location: "Boulder, CO",
                        highlights: ["GPA: 3.6/4.0", "SHRM Student Member"]
                    }
                ]
            },
            {
                id: "skills-1",
                title: "Skills",
                type: SECTION_TYPES.SKILLS,
                order: 3,
                items: [
                    "Talent Acquisition",
                    "Employee Relations",
                    "HRIS (Workday, BambooHR)",
                    "Applicant Tracking Systems",
                    "Onboarding",
                    "Performance Management",
                    "HR Compliance",
                    "Benefits Administration",
                    "Interviewing",
                    "Conflict Resolution",
                    "MS Office Suite"
                ]
            },
            {
                id: "certifications-1",
                title: "Certifications",
                type: SECTION_TYPES.CERTIFICATIONS,
                order: 4,
                items: [
                    "SHRM Certified Professional (SHRM-CP)",
                    "LinkedIn Recruiter Certified"
                ]
            }
        ]
    }
}

// Project Manager - Senior Level
const projectManagerExample: ResumeExample = {
    id: "project-manager",
    title: "Project Manager",
    industry: "Project Management",
    experienceLevel: "senior",
    description: "Experienced PM with 7 years leading cross-functional teams and delivering complex projects on time",
    templateId: "ats-classic",
    data: {
        basics: {
            name: "Robert Chen",
            email: "robert.chen@email.com",
            phone: "+1 (555) 012-3456",
            location: "Boston, MA",
            linkedin: "linkedin.com/in/robertchen",
            summary: "Results-oriented Project Manager with 7+ years successfully delivering complex technical projects. PMP certified with expertise in Agile and Waterfall methodologies. Led 20+ projects with budgets up to $5M, achieving 98% on-time delivery rate. Skilled in stakeholder management, risk mitigation, and team leadership."
        },
        custom: {},
        sections: [
            {
                id: "experience-1",
                title: "Experience",
                type: SECTION_TYPES.EXPERIENCE,
                order: 1,
                items: [
                    {
                        company: "Enterprise Solutions Corp",
                        role: "Senior Project Manager",
                        startDate: "May 2020",
                        endDate: "Present",
                        location: "Boston, MA",
                        achievements: [
                            "Lead portfolio of 5 concurrent enterprise software projects with combined budget of $12M",
                            "Delivered ERP implementation project 2 weeks ahead of schedule, saving company $400K",
                            "Managed cross-functional teams of 15-30 members including developers, designers, and QA engineers",
                            "Implemented Agile transformation across 3 teams, improving sprint velocity by 40%",
                            "Reduced project risk incidents by 60% through proactive risk management and mitigation strategies"
                        ]
                    },
                    {
                        company: "Digital Innovations LLC",
                        role: "Project Manager",
                        startDate: "Aug 2017",
                        endDate: "Apr 2020",
                        location: "Cambridge, MA",
                        achievements: [
                            "Successfully delivered 12 software development projects with 100% client satisfaction",
                            "Managed project budgets ranging from $500K to $2M with 95% budget accuracy",
                            "Coordinated with stakeholders at all levels including C-suite executives",
                            "Developed project management framework adopted company-wide across 20+ teams"
                        ]
                    }
                ]
            },
            {
                id: "education-1",
                title: "Education",
                type: SECTION_TYPES.EDUCATION,
                order: 2,
                items: [
                    {
                        institution: "Boston University",
                        degree: "Master of Science in Project Management",
                        startDate: "2015",
                        endDate: "2017",
                        location: "Boston, MA"
                    },
                    {
                        institution: "Northeastern University",
                        degree: "Bachelor of Science in Business Administration",
                        startDate: "2011",
                        endDate: "2015",
                        location: "Boston, MA",
                        highlights: ["GPA: 3.7/4.0"]
                    }
                ]
            },
            {
                id: "skills-1",
                title: "Skills",
                type: SECTION_TYPES.SKILLS,
                order: 3,
                items: [
                    "Project Management",
                    "Agile/Scrum",
                    "Waterfall",
                    "Jira",
                    "Microsoft Project",
                    "Risk Management",
                    "Stakeholder Management",
                    "Budget Management",
                    "Resource Planning",
                    "Team Leadership",
                    "Change Management",
                    "Process Improvement"
                ]
            },
            {
                id: "certifications-1",
                title: "Certifications",
                type: SECTION_TYPES.CERTIFICATIONS,
                order: 4,
                items: [
                    "Project Management Professional (PMP)",
                    "Certified ScrumMaster (CSM)",
                    "SAFe 5 Agilist"
                ]
            }
        ]
    }
}

// Operations Manager - Mid Level
const operationsManagerExample: ResumeExample = {
    id: "operations-manager",
    title: "Operations Manager",
    industry: "Operations",
    experienceLevel: "mid",
    description: "Process-oriented operations professional with 5 years optimizing workflows and reducing costs",
    templateId: "ats-compact-lines",
    data: {
        basics: {
            name: "Amanda Lee",
            email: "amanda.lee@email.com",
            phone: "+1 (555) 123-4567",
            location: "Phoenix, AZ",
            linkedin: "linkedin.com/in/amandalee",
            summary: "Strategic Operations Manager with 5+ years improving efficiency and reducing costs in fast-paced environments. Expert in process optimization, supply chain management, and team leadership. Successfully reduced operational costs by 30% while improving service quality metrics by 25%."
        },
        custom: {},
        sections: [
            {
                id: "experience-1",
                title: "Experience",
                type: SECTION_TYPES.EXPERIENCE,
                order: 1,
                items: [
                    {
                        company: "LogiTech Distribution",
                        role: "Operations Manager",
                        startDate: "Apr 2021",
                        endDate: "Present",
                        location: "Phoenix, AZ",
                        achievements: [
                            "Oversee daily operations of 50,000 sq ft warehouse managing $20M in annual inventory",
                            "Reduced operational costs by 28% through process improvements and vendor renegotiations",
                            "Implemented inventory management system that reduced stock discrepancies from 5% to 0.5%",
                            "Led team of 25 employees across shipping, receiving, and inventory management",
                            "Improved on-time delivery rate from 82% to 97% through workflow optimization"
                        ]
                    },
                    {
                        company: "Southwest Logistics Inc.",
                        role: "Operations Coordinator",
                        startDate: "Jun 2019",
                        endDate: "Mar 2021",
                        location: "Tempe, AZ",
                        achievements: [
                            "Coordinated daily operations for distribution center processing 1,000+ orders daily",
                            "Analyzed operational data and provided recommendations that improved efficiency by 20%",
                            "Managed vendor relationships and negotiated contracts saving $150K annually",
                            "Trained and developed 15+ team members on new systems and procedures"
                        ]
                    }
                ]
            },
            {
                id: "education-1",
                title: "Education",
                type: SECTION_TYPES.EDUCATION,
                order: 2,
                items: [
                    {
                        institution: "Arizona State University",
                        degree: "Bachelor of Science in Supply Chain Management",
                        startDate: "2015",
                        endDate: "2019",
                        location: "Tempe, AZ",
                        highlights: ["GPA: 3.6/4.0", "Supply Chain Management Association Member"]
                    }
                ]
            },
            {
                id: "skills-1",
                title: "Skills",
                type: SECTION_TYPES.SKILLS,
                order: 3,
                items: [
                    "Operations Management",
                    "Process Improvement",
                    "Supply Chain",
                    "Inventory Management",
                    "Lean Six Sigma",
                    "Team Leadership",
                    "Vendor Management",
                    "Budget Planning",
                    "Data Analysis",
                    "ERP Systems",
                    "Microsoft Excel",
                    "KPI Tracking"
                ]
            },
            {
                id: "certifications-1",
                title: "Certifications",
                type: SECTION_TYPES.CERTIFICATIONS,
                order: 4,
                items: [
                    "Lean Six Sigma Green Belt",
                    "Certified in Production and Inventory Management (CPIM)"
                ]
            }
        ]
    }
}

export const RESUME_EXAMPLES: ResumeExample[] = [
    softwareEngineerExample,
    productManagerExample,
    marketingProfessionalExample,
    dataScientistExample,
    healthcareProfessionalExample,
    financeProfessionalExample,
    uxDesignerExample,
    salesManagerExample,
    hrSpecialistExample,
    projectManagerExample,
    operationsManagerExample
]

export const INDUSTRIES = [
    "All Industries",
    "Technology",
    "Product",
    "Marketing",
    "Data Science",
    "Healthcare",
    "Finance",
    "Design",
    "Sales",
    "Human Resources",
    "Project Management",
    "Operations"
]

