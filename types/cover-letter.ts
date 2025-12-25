import { TemplateLayout } from '@/lib/config/cover-letter-templates';

// Core interfaces for cover letter structure
export interface ContactInfo {
  email: string;
  phone: string;
  address: string;
  linkedin?: string;
  // portfolio?: string;
  website?: string;
  github?: string;
}

export interface RecipientInfo {
  name: string;
  title: string;
  company: string;
  address: string;
  department?: string;
}

export interface Achievement {
  id: string;
  description: string;
  metrics?: {
    value: number;
    unit: string; // "percent", "dollars", "users", etc.
    context?: string;
  };
  keywords?: string[];
}

export interface SkillCategory {
  category: string;
  skills: string[];
  proficiencyLevel?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

export interface Education {
  degree: string;
  institution: string;
  graduationYear?: number;
  major?: string;
  gpa?: number;
  relevantCoursework?: string[];
}

export interface Certification {
  name: string;
  issuer: string;
  dateObtained: Date;
  expirationDate?: Date;
  credentialId?: string;
}

export interface WorkExperience {
  jobTitle: string;
  company: string;
  startDate: Date;
  endDate?: Date; // undefined if current position
  isCurrentPosition: boolean;
  keyResponsibilities: string[];
  achievements: Achievement[];
  technologies?: string[];
}

// Main cover letter interface
export interface CoverLetter {
  // Document metadata
  id: string;
  createdDate: Date;
  lastModified: Date;
  version: string;
  
  // Applicant information
  applicant: {
    firstName: string;
    lastName: string;
    professionalTitle: string;
    contactInfo: ContactInfo;
    summary?: string;
  };

  // Position and company details
  position: {
    jobTitle: string;
    jobReferenceNumber?: string;
    company: string;
    department?: string;
    applicationSource: string; // "company website", "LinkedIn", "referral", etc.
    salaryExpectation?: {
      min: number;
      max: number;
      currency: string;
      negotiable: boolean;
    };
  };

  // Recipient details
  recipient: RecipientInfo;

  // Document structure
  content: {
    date: Date;
    salutation: string; // "Dear Mr. Smith", "Dear Hiring Manager", etc.
    
    // Main body paragraphs
    openingParagraph: {
      text: string;
      positionMentioned: boolean;
      companyMentioned: boolean;
      experienceYears?: number;
    };
    
    bodyParagraphs: {
      id: string;
      text: string;
      keywords: string[];
    }[];
    
    closingParagraph: {
      text: string;
      callToAction: string;
      availability: string;
    };
    
    complimentaryClose: string; // "Sincerely", "Best regards", etc.
  };

  // Supporting information
  qualifications: {
    workExperience: WorkExperience[];
    education: Education[];
    certifications: Certification[];
    skills: SkillCategory[];
    achievements: Achievement[];
    languages?: {
      language: string;
      proficiency: 'basic' | 'conversational' | 'fluent' | 'native';
    }[];
  };

  // ATS optimization
  atsOptimization: {
    targetKeywords: string[];
    industryTerms: string[];
    jobRequirementMatch: {
      requirement: string;
      matchingExperience: string;
      matchScore: number; // 1-10 scale
    }[];
    readabilityScore?: number;
    keywordDensity?: number;
  };

  // Customization and targeting
  customization: {
    companyResearch: {
      companyValues: string[];
      recentNews?: string[];
      productsServices: string[];
      culture: string[];
    };
    positionAlignment: {
      requirementsMet: string[];
      uniqueValueProposition: string[];
      careerGoalAlignment: string;
    };
    personalizations: {
      connectionToCompany?: string;
      referralSource?: string;
      specificProjectsInterested?: string[];
    };
  };

  // Formatting and style
  formatting: {
    fontFamily: string;
    fontSize: number;
    lineHeight: number;
    margins: {
      top: number;
      bottom: number;
      left: number;
      right: number;
    };
    colorScheme: {
      primary: string;
      text: string;
      background: string;
    };
    layout: TemplateLayout;
  };

  // Attachments and additional documents
  attachments?: {
    resume: boolean;
    // portfolio: boolean;
    references: boolean;
    coverLetter: boolean;
    other?: string[];
  };

  // Tracking and analytics
  tracking?: {
    applicationDate?: Date;
    responseReceived?: boolean;
    responseDate?: Date;
    interviewRequested?: boolean;
    status: 'draft' | 'sent' | 'reviewed' | 'rejected' | 'interview_scheduled' | 'hired';
    notes?: string[];
  };
}

// Utility types for validation and processing
export type RequiredCoverLetterFields = Pick<CoverLetter, 
  'id' | 'applicant' | 'position' | 'recipient' | 'content'
>;

export type CoverLetterDraft = Partial<CoverLetter> & RequiredCoverLetterFields;

// Example validation function interface
export interface CoverLetterValidator {
  validateContent(coverLetter: CoverLetter): ValidationResult;
  checkATSCompatibility(coverLetter: CoverLetter): ATSCompatibilityScore;
  calculateMatchScore(coverLetter: CoverLetter, jobDescription: string): number;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  suggestions: string[];
}

export interface ValidationError {
  field: keyof CoverLetter;
  message: string;
  severity: 'critical' | 'error' | 'warning';
}

export interface ValidationWarning {
  field: keyof CoverLetter;
  message: string;
  impact: 'high' | 'medium' | 'low';
}

export interface ATSCompatibilityScore {
  overallScore: number; // 1-100
  fontCompatibility: number;
  layoutCompatibility: number;
  keywordOptimization: number;
  formatStructure: number;
  recommendations: string[];
}

// Factory function interface for creating cover letters
export interface CoverLetterFactory {
  createFromTemplate(template: CoverLetterTemplate): CoverLetter;
  createCustom(applicantData: ApplicantProfile, jobData: JobPosting): CoverLetter;
  generateContent(coverLetter: CoverLetter): string;
  exportToPDF(coverLetter: CoverLetter): Buffer;
  exportToHTML(coverLetter: CoverLetter): string;
}

export interface CoverLetterTemplate {
  id: string;
  name: string;
  industry: string;
  level: 'entry' | 'mid' | 'senior' | 'executive';
  structure: Partial<CoverLetter>;
  placeholders: Record<string, string>;
}

export interface ApplicantProfile {
  personalInfo: CoverLetter['applicant'];
  experience: WorkExperience[];
  skills: SkillCategory[];
  education: Education[];
  preferences: {
    industries: string[];
    roles: string[];
    locations: string[];
  };
}

export interface JobPosting {
  title: string;
  company: string;
  description: string;
  requirements: string[];
  preferredQualifications: string[];
  keywords: string[];
  industry: string;
  level: string;
}

// Note: All types are exported via their interface/type declarations above.
