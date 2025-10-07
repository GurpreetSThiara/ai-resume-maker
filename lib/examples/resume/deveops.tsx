import { ResumeData, SECTION_TYPES } from "@/types/resume";

export const devopsResumeData1: ResumeData = {
  basics: {
    name: "John Doe",
    email: "john.doe.devops@gmail.com",
    phone: "+91-9876543210",
    location: "Bengaluru, India",
    linkedin: "https://linkedin.com/in/johndoe",
    summary:
      "DevOps Engineer with 5+ years of experience in cloud infrastructure, CI/CD automation, and container orchestration. Expertise in AWS, Kubernetes, and Infrastructure as Code with a proven track record of reducing deployment times by 70% and improving system reliability."
  },
  custom: {
    portfolio: {
      title: "Portfolio",
      content: "https://johndoe.dev",
      hidden: false,
      id: "portfolio-1",
      link: true
    }
  },
  sections: [
    {
      id: "edu-1",
      title: "Education",
      type: SECTION_TYPES.EDUCATION,
      items: [
        {
          institution: "Indian Institute of Technology, Delhi",
          degree: "B.Tech in Computer Science",
          startDate: "2015-08",
          endDate: "2019-05",
          location: "New Delhi, India",
          highlights: [
            "Graduated with First Class Honors",
            "Member of Programming & AI Club"
          ]
        },
        {
          institution: "St. Xavier's College",
          degree: "Higher Secondary Certificate (HSC)",
          startDate: "2013-06",
          endDate: "2015-03",
          location: "Mumbai, India",
          highlights: [
            "Science Stream with Mathematics",
            "Secured 92% aggregate marks"
          ]
        }
      ]
    },
    {
      id: "exp-1",
      title: "Experience",
      type: SECTION_TYPES.EXPERIENCE,
      items: [
        {
          company: "TechNova Solutions",
          role: "Senior DevOps Engineer",
          startDate: "2022-04",
          endDate: "Present",
          location: "Bengaluru, India",
          achievements: [
            "Led a team of 5 engineers to develop cloud infrastructure serving 50,000+ users.",
            "Reduced API response times by 40% through performance optimizations.",
            "Implemented CI/CD pipelines, cutting deployment time by 60%.",
            "Automated infrastructure provisioning using Terraform and Ansible."
          ]
        },
        {
          company: "CloudTech Innovations",
          role: "DevOps Engineer",
          startDate: "2019-07",
          endDate: "2022-03",
          location: "Mumbai, India",
          achievements: [
            "Designed and implemented CI/CD pipelines for 15+ microservices.",
            "Containerized legacy applications using Docker and Kubernetes.",
            "Built automated monitoring systems achieving 99.9% uptime."
          ]
        }
      ]
    },
    {
      id: "skills-1",
      title: "Skills",
      type: SECTION_TYPES.SKILLS,
      items: [
        "Cloud Platforms: AWS, Azure, Google Cloud",
        "Container Orchestration: Kubernetes, Docker",
        "CI/CD: Jenkins, GitLab CI, GitHub Actions",
        "Infrastructure as Code: Terraform, CloudFormation",
        "Monitoring: Prometheus, Grafana, ELK Stack",
        "Scripting: Python, Bash, PowerShell"
      ]
    },
    {
      id: "certs-1",
      title: "Certifications",
      type: SECTION_TYPES.CERTIFICATIONS,
      items: [
        "AWS Certified DevOps Engineer – Professional (2023)",
        "Certified Kubernetes Administrator (CKA, 2022)",
        "HashiCorp Certified: Terraform Associate (2023)"
      ]
    }
  ]
};

export const devopsResumeData2: ResumeData = {
  basics: {
    name: "John Doe",
    email: "john.doe.sre@outlook.com",
    phone: "+91-8765432109",
    location: "Pune, India",
    linkedin: "https://linkedin.com/in/johndoesre",
    summary:
      "Site Reliability Engineer with 6+ years of experience building resilient, scalable systems. Expert in incident management, performance optimization, and automation. Passionate about reliability engineering and observability."
  },
  custom: {
    blog: {
      title: "Tech Blog",
      content: "https://johndoe.blog",
      hidden: false,
      id: "blog-1",
      link: true
    }
  },
  sections: [
    {
      id: "edu-1",
      title: "Education",
      type: SECTION_TYPES.EDUCATION,
      items: [
        {
          institution: "Indian Institute of Technology, Bombay",
          degree: "B.Tech in Computer Science",
          startDate: "2014-07",
          endDate: "2018-05",
          location: "Mumbai, India",
          highlights: [
            "Graduated Magna Cum Laude",
            "President of Computer Science Society"
          ]
        },
        {
          institution: "Stanford University Online",
          degree: "Certificate in Machine Learning",
          startDate: "2020-01",
          endDate: "2020-06",
          location: "Online",
          highlights: [
            "Completed with distinction",
            "Focus on MLOps and AI Infrastructure"
          ]
        }
      ]
    },
    {
      id: "exp-1",
      title: "Experience",
      type: SECTION_TYPES.EXPERIENCE,
      items: [
        {
          company: "Netflix India",
          role: "Senior Site Reliability Engineer",
          startDate: "2021-03",
          endDate: "Present",
          location: "Mumbai, India",
          achievements: [
            "Maintained 99.99% uptime for streaming services serving 60M+ subscribers.",
            "Implemented automated incident response, reducing MTTR from 45 minutes to 8 minutes.",
            "Built comprehensive observability stack with custom SLI/SLO dashboards.",
            "Led chaos engineering initiatives improving system resilience."
          ]
        },
        {
          company: "Flipkart",
          role: "DevOps Engineer",
          startDate: "2018-06",
          endDate: "2021-02",
          location: "Bengaluru, India",
          achievements: [
            "Managed e-commerce platform infrastructure handling 10x traffic spikes during sales.",
            "Implemented blue-green deployments for 200+ microservices with zero downtime.",
            "Built automated testing pipelines reducing release cycle from 2 weeks to 2 days."
          ]
        }
      ]
    },
    {
      id: "skills-1",
      title: "Skills",
      type: SECTION_TYPES.SKILLS,
      items: [
        "SRE: Incident Management, Error Budgets, SLI/SLO",
        "Observability: Prometheus, Grafana, Jaeger, New Relic",
        "Chaos Engineering: Chaos Monkey, Litmus, Gremlin",
        "Cloud: AWS, Kubernetes, Service Mesh (Istio)",
        "Automation: Python, Ansible, Terraform",
        "Databases: MySQL, PostgreSQL, Redis"
      ]
    },
    {
      id: "certs-1",
      title: "Certifications",
      type: SECTION_TYPES.CERTIFICATIONS,
      items: [
        "Google Site Reliability Engineering Certificate (2023)",
        "AWS Certified Solutions Architect (2022)",
        "Certified Kubernetes Application Developer (CKAD, 2023)"
      ]
    }
  ]
};

export const devopsResumeData3: ResumeData = {
  basics: {
    name: "John Doe",
    email: "john.doe.cloud@gmail.com",
    phone: "+91-7654321098",
    location: "Chennai, India",
    linkedin: "https://linkedin.com/in/johndoecloud",
    summary:
      "Cloud Infrastructure Specialist with 7+ years of experience in Azure and AWS environments. Expert in automation, security, and scalable architecture design. Successfully managed infrastructure for Fortune 500 companies with 99.95% uptime and $2M+ cost savings."
  },
  custom: {
    website: {
      title: "Website",
      content: "https://johndoecloud.com",
      hidden: false,
      id: "website-1",
      link: true
    },
    github: {
      title: "GitHub",
      content: "https://github.com/johndoecloud",
      hidden: false,
      id: "github-1",
      link: true
    }
  },
  sections: [
    {
      id: "edu-1",
      title: "Education",
      type: SECTION_TYPES.EDUCATION,
      items: [
        {
          institution: "Anna University",
          degree: "M.E. in Software Engineering",
          startDate: "2013-06",
          endDate: "2015-04",
          location: "Chennai, India",
          highlights: [
            "Thesis on Cloud Computing Optimization",
            "Teaching Assistant for Database Systems",
            "CGPA: 8.9/10",
            "Published 2 research papers on distributed systems"
          ]
        },
        {
          institution: "PSG College of Technology",
          degree: "B.E. in Computer Science and Engineering",
          startDate: "2009-06",
          endDate: "2013-04",
          location: "Coimbatore, India",
          highlights: [
            "First Class with Distinction (CGPA: 8.7/10)",
            "Head of Technical Symposium organizing committee",
            "Winner of Inter-college Programming Contest",
            "Captain of College Cricket Team"
          ]
        }
      ]
    },
    {
      id: "exp-1",
      title: "Experience",
      type: SECTION_TYPES.EXPERIENCE,
      items: [
        {
          company: "Microsoft India",
          role: "Principal Cloud Engineer",
          startDate: "2022-01",
          endDate: "Present",
          location: "Hyderabad, India",
          achievements: [
            "Lead cloud initiatives for Azure services team, managing infrastructure for 10M+ users.",
            "Designed automated disaster recovery solutions, reducing RTO from 4 hours to 30 minutes.",
            "Implemented zero-downtime deployment strategies using blue-green deployments.",
            "Mentored 15+ engineers on cloud-native best practices and architecture patterns.",
            "Architected multi-region active-active setup improving global latency by 35%.",
            "Led cost optimization initiatives resulting in $800K annual savings through reserved instances and rightsizing."
          ]
        },
        {
          company: "Amazon Web Services",
          role: "Senior Cloud Engineer",
          startDate: "2018-07",
          endDate: "2021-12",
          location: "Chennai, India",
          achievements: [
            "Built highly available infrastructure supporting 500+ microservices with 99.99% SLA.",
            "Reduced infrastructure costs by 35% through optimization and automation using AWS Cost Explorer.",
            "Implemented comprehensive security and compliance automation for SOC 2 and ISO 27001.",
            "Designed serverless architectures using Lambda, API Gateway, and DynamoDB serving 1M+ requests daily.",
            "Built real-time data processing pipelines using Kinesis and EMR for analytics workloads."
          ]
        },
        {
          company: "Infosys Limited",
          role: "Cloud Solutions Architect",
          startDate: "2015-06",
          endDate: "2018-06",
          location: "Bengaluru, India",
          achievements: [
            "Led cloud migration projects for 20+ enterprise clients across banking and retail sectors.",
            "Designed hybrid cloud solutions integrating on-premises infrastructure with public cloud.",
            "Implemented Infrastructure as Code practices using CloudFormation and Terraform.",
            "Built automated CI/CD pipelines reducing deployment time from 6 hours to 20 minutes."
          ]
        }
      ]
    },
    {
      id: "skills-1",
      title: "Skills",
      type: SECTION_TYPES.SKILLS,
      items: [
        "Cloud Platforms: Azure, AWS, Google Cloud Platform, Oracle Cloud",
        "Containers: Kubernetes, Docker, OpenShift, Azure Container Instances",
        "Infrastructure as Code: Terraform, ARM Templates, CloudFormation, Bicep",
        "Monitoring & Observability: Azure Monitor, CloudWatch, Datadog, New Relic, Prometheus",
        "Security: Azure Security Center, AWS Security Hub, Azure Sentinel, GuardDuty",
        "DevOps Tools: Jenkins, Azure DevOps, GitLab CI, GitHub Actions, Ansible",
        "Databases: Azure SQL, RDS, CosmosDB, DynamoDB, Redis, MongoDB",
        "Networking: VNet, VPC, Load Balancers, Application Gateway, CDN",
        "Languages: Python, Go, PowerShell, Bash, C#, Java",
        "Message Queues: Service Bus, SQS, Event Hubs, Kafka"
      ]
    },
    {
      id: "lang-1",
      title: "Languages",
      type: SECTION_TYPES.LANGUAGES,
      items: ["English (Fluent)", "Tamil (Native)", "Hindi (Conversational)", "Telugu (Basic)"]
    },
    {
      id: "certs-1",
      title: "Certifications",
      type: SECTION_TYPES.CERTIFICATIONS,
      items: [
        "Microsoft Azure Solutions Architect Expert (2023)",
        "AWS Solutions Architect Professional (2022)",
        "Certified Kubernetes Security Specialist (CKS, 2024)",
        "Google Cloud Professional Cloud Architect (2023)",
        "HashiCorp Certified: Terraform Associate (2023)",
        "Microsoft Azure DevOps Engineer Expert (2022)",
        "AWS Certified Security - Specialty (2023)"
      ]
    },
    {
      id: "projects-1",
      title: "Projects",
      type: "custom",
      content: [
        "**Global E-commerce Platform Migration** – Led migration of legacy monolithic application to cloud-native microservices architecture on Azure, serving 5M+ users across 15 countries with 99.9% uptime.",
        "**Multi-Cloud Disaster Recovery Solution** – Designed and implemented cross-cloud disaster recovery strategy between Azure and AWS, achieving RPO of 15 minutes and RTO of 1 hour.",
        "**Serverless Data Analytics Pipeline** – Built real-time analytics platform using Azure Functions, Event Hubs, and Synapse Analytics processing 10TB+ data daily for business intelligence.",
        "**Cloud Cost Optimization Framework** – Developed automated cost monitoring and optimization system reducing cloud spend by 40% across multiple business units through rightsizing and scheduling."
      ]
    },
    {
      id: "achievements-1",
      title: "Achievements",
      type: "custom",
      content: [
        "**Microsoft Azure MVP Award** – Recognized as Most Valuable Professional for contributions to Azure community (2023-2024)",
        "**AWS Community Builder** – Selected as community leader for sharing cloud expertise and best practices (2022-Present)",
        "**Patent Filed** – Filed patent for 'Automated Cloud Resource Optimization Using Machine Learning' (Patent Pending, 2023)",
        "**Conference Speaker** – Delivered keynote at CloudTech Summit 2023 on 'Future of Multi-Cloud Architecture'"
      ]
    }
  ]
};


export const devopsResumeData4: ResumeData = {
  basics: {
    name: "John Doe",
    email: "john.doe.security@protonmail.com",
    phone: "+91-6543210987",
    location: "Delhi, India",
    linkedin: "https://linkedin.com/in/johndoesecurity",
    summary:
      "DevSecOps Engineer with 4+ years of experience integrating security into CI/CD pipelines. Specialized in container security, compliance automation, and vulnerability management. Expert in building secure-by-design infrastructure."
  },
  custom: {
    github: {
      title: "GitHub",
      content: "https://github.com/johndoe",
      hidden: false,
      id: "github-1",
      link: true
    }
  },
  sections: [
    {
      id: "edu-1",
      title: "Education",
      type: SECTION_TYPES.EDUCATION,
      items: [
        {
          institution: "Delhi Technological University",
          degree: "B.Tech in Computer Science",
          startDate: "2016-08",
          endDate: "2020-05",
          location: "New Delhi, India",
          highlights: [
            "Specialized in Cybersecurity",
            "Winner of National Cyber Security Competition"
          ]
        },
        {
          institution: "Cybersecurity Institute of India",
          degree: "Advanced Diploma in Ethical Hacking",
          startDate: "2020-07",
          endDate: "2021-01",
          location: "New Delhi, India",
          highlights: [
            "Hands-on penetration testing certification",
            "Graduated with distinction"
          ]
        }
      ]
    },
    {
      id: "exp-1",
      title: "Experience",
      type: SECTION_TYPES.EXPERIENCE,
      items: [
        {
          company: "HDFC Bank",
          role: "Lead DevSecOps Engineer",
          startDate: "2022-09",
          endDate: "Present",
          location: "Mumbai, India",
          achievements: [
            "Implemented security scanning in CI/CD pipelines covering 200+ applications.",
            "Built automated compliance reporting for RBI and PCI DSS requirements.",
            "Designed secure container images and Kubernetes security policies.",
            "Led security incident response maintaining zero security breaches."
          ]
        },
        {
          company: "Paytm",
          role: "Security Engineer",
          startDate: "2020-06",
          endDate: "2022-08",
          location: "Noida, India",
          achievements: [
            "Integrated SAST/DAST tools identifying and fixing 500+ vulnerabilities.",
            "Implemented infrastructure security scanning using automated tools.",
            "Built threat modeling process preventing security issues at design phase."
          ]
        }
      ]
    },
    {
      id: "skills-1",
      title: "Skills",
      type: SECTION_TYPES.SKILLS,
      items: [
        "Security Scanning: SonarQube, Checkmarx, Veracode, Snyk",
        "Container Security: Twistlock, Aqua Security, Falco",
        "Compliance: PCI DSS, SOX, GDPR, ISO 27001",
        "SIEM: Splunk, ELK Stack, QRadar",
        "Vulnerability Management: Nessus, OpenVAS, Qualys",
        "Security Tools: OWASP ZAP, Burp Suite, Nmap"
      ]
    },
    {
      id: "certs-1",
      title: "Certifications",
      type: SECTION_TYPES.CERTIFICATIONS,
      items: [
        "Certified Ethical Hacker (CEH, 2023)",
        "Certified Information Security Manager (CISM, 2022)",
        "AWS Certified Security - Specialty (2023)",
        "Certified Kubernetes Security Specialist (CKS, 2024)"
      ]
    }
  ]
};

export const devopsResumeData5: ResumeData = {
  basics: {
    name: "John Doe",
    email: "john.doe.k8s@yahoo.com",
    phone: "+91-5432109876",
    location: "Hyderabad, India",
    linkedin: "https://linkedin.com/in/johndoek8s",
    summary:
      "Kubernetes Platform Engineer with 5+ years of experience building and managing container orchestration platforms. Certified Kubernetes expert with deep expertise in service mesh, GitOps, and cloud-native security."
  },
  custom: {
    portfolio: {
      title: "Portfolio",
      content: "https://johndoek8s.dev",
      hidden: false,
      id: "portfolio-1",
      link: true
    }
  },
  sections: [
    {
      id: "edu-1",
      title: "Education",
      type: SECTION_TYPES.EDUCATION,
      items: [
        {
          institution: "International Institute of Information Technology",
          degree: "B.Tech in Computer Science",
          startDate: "2016-07",
          endDate: "2020-05",
          location: "Hyderabad, India",
          highlights: [
            "Dean's List for 4 consecutive semesters",
            "Winner of Cloud Computing Hackathon"
          ]
        },
        {
          institution: "Linux Professional Institute",
          degree: "Advanced Linux System Administration Certificate",
          startDate: "2020-08",
          endDate: "2020-12",
          location: "Online",
          highlights: [
            "Comprehensive Linux and container technologies training",
            "Achieved LPIC-2 certification level"
          ]
        }
      ]
    },
    {
      id: "exp-1",
      title: "Experience",
      type: SECTION_TYPES.EXPERIENCE,
      items: [
        {
          company: "Red Hat India",
          role: "Senior Kubernetes Engineer",
          startDate: "2023-02",
          endDate: "Present",
          location: "Pune, India",
          achievements: [
            "Lead development of OpenShift platform serving 10,000+ developers.",
            "Implemented service mesh architecture using Istio improving security by 90%.",
            "Built custom Kubernetes operators for automated database provisioning.",
            "Contributed to upstream Kubernetes project with 15+ merged PRs."
          ]
        },
        {
          company: "VMware India",
          role: "Platform Engineer",
          startDate: "2020-07",
          endDate: "2023-01",
          location: "Bengaluru, India",
          achievements: [
            "Designed multi-tenant Kubernetes platform supporting 100+ teams.",
            "Built GitOps workflows using ArgoCD enabling continuous deployment.",
            "Implemented Pod Security Standards achieving SOC 2 compliance."
          ]
        }
      ]
    },
    {
      id: "skills-1",
      title: "Skills",
      type: SECTION_TYPES.SKILLS,
      items: [
        "Orchestration: Kubernetes, OpenShift, Rancher",
        "Service Mesh: Istio, Linkerd, Consul Connect",
        "GitOps: ArgoCD, Flux, Jenkins X",
        "Security: Falco, OPA Gatekeeper, Twistlock",
        "Storage: Rook, Longhorn, CSI Drivers",
        "Languages: Go, Python, YAML, Helm"
      ]
    },
    {
      id: "certs-1",
      title: "Certifications",
      type: SECTION_TYPES.CERTIFICATIONS,
      items: [
        "Certified Kubernetes Administrator (CKA, 2023)",
        "Certified Kubernetes Application Developer (CKAD, 2022)",
        "Certified Kubernetes Security Specialist (CKS, 2024)",
        "Red Hat Certified Specialist in OpenShift (2023)"
      ]
    }
  ]
};

//export { devopsResumeData1, devopsResumeData2, devopsResumeData3, devopsResumeData4, devopsResumeData5 };
