import type { ResumeData } from "@/types/resume"

/**
 * Stress-test resume: deliberately large + full of edge cases to exercise
 * page splitting, orphan-heading avoidance, long-word wrapping, oversized
 * skill pills, sidebar dual-column overflow, and conditional/empty rendering.
 */

const LONG =
  "Led a cross-functional initiative spanning multiple teams and time zones, coordinating engineering, design, and product stakeholders to deliver a high-availability platform serving millions of monthly active users while reducing infrastructure cost by a measurable margin and improving p95 latency across critical paths."

const ach = (n: number) =>
  Array.from({ length: n }, (_, i) =>
    i % 4 === 3
      ? LONG
      : `Achievement ${i + 1}: shipped, measured, and iterated on a meaningful improvement that moved a key business metric and was adopted across the wider organisation.`,
  )

export const largeResume: ResumeData = {
  basics: {
    name: "Alexandra Catherine Montgomery-Whitfield",
    email: "alexandra.montgomery.whitfield@verylongexampledomainname.engineering",
    phone: "+1 (555) 987-6543",
    location: "San Francisco Bay Area, California, United States",
    linkedin: "https://www.linkedin.com/in/alexandra-catherine-montgomery-whitfield-engineer",
    summary:
      "Principal software engineer and engineering leader with 12+ years of experience architecting distributed systems, leading large teams, and shipping consumer and enterprise products at scale. Deep expertise across frontend, backend, infrastructure, and platform engineering. A pragmatic technologist who pairs long-term architectural vision with relentless execution. Reachable at https://averylongportfoliourlthatdoesnotbreaknicely.example.com/portfolio/work/2024 for a full case-study archive.",
  },

  custom: {
    portfolio: { title: "Portfolio", content: "https://alexandra.dev", hidden: false, id: "portfolio", link: true },
    github: { title: "GitHub", content: "https://github.com/alexandra-mw", hidden: false, id: "github", link: true },
    website: {
      title: "Case Studies",
      content: "https://averylongportfoliourlthatdoesnotbreaknicely.example.com/case-studies",
      hidden: false,
      id: "website",
      link: true,
    },
    twitter: { title: "X / Twitter", content: "@alexandra_mw", hidden: false, id: "twitter", link: false },
    hiddenField: { title: "Hidden", content: "should-not-appear", hidden: true, id: "hiddenField", link: false },
  },

  sections: [
    {
      id: "skills-1",
      title: "Technical Skills",
      type: "skills",
      order: 0,
      items: [],
      groups: [
        { id: "g1", title: "Languages", skills: ["TypeScript", "JavaScript", "Python", "Go", "Rust", "Java", "Kotlin", "Ruby", "C++", "SQL"] },
        { id: "g2", title: "Frontend", skills: ["React", "Next.js", "Vue", "Svelte", "Tailwind CSS", "Redux", "React Query", "Webpack", "Vite", "Storybook"] },
        { id: "g3", title: "Backend", skills: ["Node.js", "Express", "NestJS", "GraphQL", "gRPC", "PostgreSQL", "MongoDB", "Redis", "Kafka", "RabbitMQ"] },
        { id: "g4", title: "Cloud & DevOps", skills: ["AWS", "GCP", "Azure", "Docker", "Kubernetes", "Terraform", "Pulumi", "GitHub Actions", "Prometheus", "Grafana"] },
        { id: "g5", title: "Practices", skills: ["Distributed Systems Architecture and Design", "Event-Driven Microservices", "Domain-Driven Design", "Observability", "Site Reliability Engineering"] },
        { id: "g6", title: "Leadership", skills: ["Team Building", "Mentorship", "Technical Strategy", "Cross-functional Collaboration", "Hiring & Interviewing"] },
      ],
    },
    {
      id: "exp-1",
      title: "Professional Experience",
      type: "experience",
      order: 1,
      items: [
        { company: "Hyperscale Cloud Infrastructure Corporation", role: "Principal Software Engineer & Technical Lead", startDate: "2021-06", endDate: "Present", location: "San Francisco, CA", achievements: ach(7) },
        { company: "Meridian Financial Technologies", role: "Staff Software Engineer", startDate: "2019-01", endDate: "2021-05", location: "New York, NY", achievements: ach(6) },
        { company: "Nimbus Analytics", role: "Senior Full-Stack Engineer", startDate: "2016-08", endDate: "2018-12", location: "Remote", achievements: ach(6) },
        { company: "BrightPath Software Solutions and Consulting Group International", role: "Software Engineer II", startDate: "2014-03", endDate: "2016-07", location: "Austin, TX", achievements: ach(5) },
        { company: "StartupForge", role: "Founding Engineer", startDate: "2012-09", endDate: "2014-02", location: "Palo Alto, CA", achievements: ach(5) },
        { company: "Legacy Systems Inc.", role: "Junior Developer (no achievements listed)", startDate: "2011-06", endDate: "2012-08", location: "Boston, MA" },
        { company: "Internship Co.", role: "Engineering Intern", startDate: "2010-06", endDate: "2010-09", location: "Seattle, WA", achievements: ach(4) },
      ],
    },
    {
      id: "proj-1",
      title: "Selected Projects",
      type: "projects",
      order: 2,
      items: [
        { name: "Open-Source Distributed Job Scheduler", link: "https://github.com/alexandra-mw/distributed-scheduler", repo: "https://github.com/alexandra-mw/distributed-scheduler", description: ach(4) },
        { name: "Real-Time Collaborative Document Engine with CRDT Conflict Resolution", link: "https://crdt-docs.example.com", description: ach(3) },
        { name: "Project Without Any Description (edge case)", link: "https://no-description.example.com" },
        { name: "Personal Site Generator", repo: "https://github.com/alexandra-mw/site-gen", description: ["A small static-site generator written in Go with incremental builds and a plugin system."] },
      ],
    },
    {
      id: "edu-1",
      title: "Education",
      type: "education",
      order: 3,
      items: [
        { institution: "Massachusetts Institute of Technology", degree: "Master of Science in Computer Science and Artificial Intelligence", startDate: "2009", endDate: "2011", location: "Cambridge, MA", highlights: ["Thesis on fault-tolerant consensus in geo-distributed databases", "Graduate Teaching Assistant for Distributed Systems", "GPA 3.9 / 4.0"] },
        { institution: "University of California, Berkeley", degree: "Bachelor of Science in Electrical Engineering and Computer Science", startDate: "2005", endDate: "2009", location: "Berkeley, CA", highlights: ["Graduated summa cum laude", "President of the ACM student chapter"] },
        { institution: "Online Continuing Education (no highlights)", degree: "Professional Certificate in Machine Learning", startDate: "2020", endDate: "2020" },
      ],
    },
    {
      id: "cert-1",
      title: "Certifications & Awards",
      type: "certifications",
      order: 4,
      items: [
        "AWS Certified Solutions Architect – Professional",
        "Google Cloud Professional Cloud Architect",
        "Certified Kubernetes Administrator (CKA)",
        "Certified Kubernetes Application Developer (CKAD)",
        "HashiCorp Certified: Terraform Associate",
        "Microsoft Certified: Azure Solutions Architect Expert",
        "Distinguished Engineering Award, Hyperscale Cloud Infrastructure Corporation, 2023",
        "Hackathon Grand Prize Winner, Global Cloud Summit, 2022",
      ],
    },
    {
      id: "custom-1",
      title: "Speaking & Publications",
      type: "custom",
      order: 5,
      content: [
        "Keynote: 'Designing Resilient Systems at Planet Scale' — Global Cloud Summit 2023.",
        "Conference talk: 'The Pragmatic Path to Microservices' — QCon San Francisco 2022.",
        "Co-author of a widely cited paper on consensus protocols in geo-distributed databases.",
        "Regular contributor to several popular open-source infrastructure projects.",
        LONG,
      ],
    },
    {
      id: "lang-1",
      title: "Languages",
      type: "languages",
      order: 6,
      items: ["English (Native)", "Spanish (Fluent)", "French (Professional)", "German (Conversational)", "Mandarin (Basic)"],
    },
    {
      id: "hidden-section",
      title: "Hidden Section (should not render)",
      type: "custom",
      order: 7,
      hidden: true,
      content: ["This entire section is hidden and must not appear in output."],
    },
  ],
}
