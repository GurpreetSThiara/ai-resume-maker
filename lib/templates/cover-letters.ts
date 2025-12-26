import { CoverLetter } from '@/types/cover-letter';
import { getDefaultTemplate as getConfigDefaultTemplate } from '@/lib/config/cover-letter-templates';

// A default CoverLetter object aligned with the new schema
export const DEFAULT_COVER_LETTER: CoverLetter = {
  id: 'new',
  createdDate: new Date(),
  lastModified: new Date(),
  version: '1.0.0',
  applicant: {
    firstName: '',
    lastName: '',
    professionalTitle: '',
    contactInfo: {
      email: '',
      phone: '',
      address: '',
    },
    summary: '',
  },
  position: {
    jobTitle: '',
    company: '',
    applicationSource: 'company website',
  },
  recipient: {
    name: 'Hiring Manager',
    title: '',
    company: '',
    address: '',
  },
  content: {
    date: new Date(),
    salutation: 'Dear Hiring Manager,',
    openingParagraph: {
      text: '',
      positionMentioned: false,
      companyMentioned: false,
    },
    bodyParagraphs: [
      { id: 'p1', text: '', keywords: [] },
    ],
    closingParagraph: { text: '', callToAction: '', availability: '' },
    complimentaryClose: 'Sincerely',
  },
  qualifications: {
    workExperience: [],
    education: [],
    certifications: [],
    skills: [],
    achievements: [],
    languages: [],
  },
  atsOptimization: {
    targetKeywords: [],
    industryTerms: [],
    jobRequirementMatch: [],
  },
  customization: {
    companyResearch: { companyValues: [], productsServices: [], culture: [] },
    positionAlignment: { requirementsMet: [], uniqueValueProposition: [], careerGoalAlignment: '' },
    personalizations: {},
  },
  formatting: {
    fontFamily: 'Arial',
    fontSize: 12,
    lineHeight: 1.5,
    margins: { top: 1440, bottom: 1440, left: 1440, right: 1440 },
    colorScheme: { primary: '#000000', text: '#111111', background: '#FFFFFF' },
    layout: getConfigDefaultTemplate().value,
  },
  attachments: { resume: false, /* portfolio: false, */ references: false, coverLetter: true, other: [] },
  tracking: { status: 'draft' },
};

// Simple preset templates that pre-fill the content section while keeping the schema intact
export const COVER_LETTER_TEMPLATES: Array<{
  id: string;
  name: string;
  description: string;
  coverLetter: CoverLetter;
}> = [
  {
    id: 'professional',
    name: 'Professional',
    description: 'A clean, professional cover letter template',
    coverLetter: {
      ...DEFAULT_COVER_LETTER,
      content: {
        ...DEFAULT_COVER_LETTER.content,
        openingParagraph: {
          ...DEFAULT_COVER_LETTER.content.openingParagraph,
          text:
            'I am excited to apply for the [Position] position at [Company]. With my background in [relevant experience], I can contribute effectively to your team.',
          positionMentioned: true,
          companyMentioned: true,
        },
        bodyParagraphs: [
          {
            id: 'p1',
            text:
              'In my current role at [Current Company], I have successfully [specific achievement or responsibility].',
            keywords: [],
          },
        ],
        closingParagraph: {
          text:
            'I would welcome the opportunity to discuss how my skills and experiences align with your needs.',
          callToAction: 'Available for interview at your convenience',
          availability: 'Immediate',
        },
        complimentaryClose: 'Sincerely',
      },
    },
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'A modern, creative cover letter template',
    coverLetter: {
      ...DEFAULT_COVER_LETTER,
      content: {
        ...DEFAULT_COVER_LETTER.content,
        salutation: "Hello [Hiring Manager's Name],",
        openingParagraph: {
          ...DEFAULT_COVER_LETTER.content.openingParagraph,
          text:
            'I was thrilled to come across the [Position] opportunity at [Company]. I am passionate about [industry/field].',
          positionMentioned: true,
          companyMentioned: true,
        },
        closingParagraph: {
          text: 'Thank you for your time and consideration.',
          callToAction: 'Looking forward to connecting',
          availability: '2 weeks notice',
        },
        complimentaryClose: 'Best regards',
      },
    },
  },
  {
    id: 'academic',
    name: 'Academic',
    description: 'A formal academic cover letter template',
    coverLetter: {
      ...DEFAULT_COVER_LETTER,
      content: {
        ...DEFAULT_COVER_LETTER.content,
        salutation: 'Dear Dr. [Last Name],',
        openingParagraph: {
          ...DEFAULT_COVER_LETTER.content.openingParagraph,
          text:
            'I am writing to express my interest in the [Position] at [Institution/Company].',
          positionMentioned: true,
          companyMentioned: true,
        },
        closingParagraph: {
          text: 'Please find my CV attached for your review.',
          callToAction: 'Available to discuss research fit',
          availability: 'Next month',
        },
        complimentaryClose: 'Yours sincerely',
      },
    },
  },
];

export function getTemplateById(id: string) {
  return COVER_LETTER_TEMPLATES.find((template) => template.id === id);
}

export function getDefaultTemplate() {
  return COVER_LETTER_TEMPLATES[0];
}

export function getDefaultLayout() {
  return getConfigDefaultTemplate().value;
}
