'use client';

import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { CoverLetter } from '@/types/cover-letter';

type CoverLetterState = {
  coverLetter: CoverLetter;
  isSaving: boolean;
  isLoading: boolean;
  error: string | null;
};

type CoverLetterAction =
  | { type: 'SET_COVER_LETTER'; payload: CoverLetter }
  | { type: 'UPDATE_CONTENT'; payload: Partial<CoverLetter['content']> }
  | { type: 'SET_SAVING'; payload: boolean }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'RESET_COVER_LETTER' };

const getDefaultCoverLetter = (): CoverLetter => ({
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
      address: { street: '', city: '', state: '', zipCode: '' },
    },
    summary: '',
  },

  position: {
    jobTitle: '',
    company: '',
    applicationSource: 'company website',
    department: '',
  },

  recipient: {
    name: 'Hiring Manager',
    title: '',
    company: '',
    address: { street: '', city: '', state: '', zipCode: '' },
  },

  content: {
    date: new Date(),
    salutation: 'Dear Hiring Manager,',
    openingParagraph: { text: '', positionMentioned: false, companyMentioned: false },
    bodyParagraphs: [
      { id: 'p1', text: '', focus: 'experience', keywords: [] },
    ],
    closingParagraph: { text: 'Sincerely,', callToAction: '', availability: '' },
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
    readabilityScore: undefined,
    keywordDensity: undefined,
  },

  customization: {
    companyResearch: {
      companyValues: [],
      recentNews: [],
      productsServices: [],
      culture: [],
    },
    positionAlignment: {
      requirementsMet: [],
      uniqueValueProposition: [],
      careerGoalAlignment: '',
    },
    personalizations: {
      connectionToCompany: '',
      referralSource: '',
      specificProjectsInterested: [],
    },
  },

  formatting: {
    fontFamily: 'Arial',
    fontSize: 12,
    lineHeight: 1.5,
    margins: { top: 1440, bottom: 1440, left: 1440, right: 1440 },
    colorScheme: { primary: '#000000', text: '#111111', background: '#FFFFFF' },
    layout: 'traditional',
  },

  attachments: { resume: false, portfolio: false, references: false, coverLetter: true, other: [] },

  tracking: { status: 'draft', applicationDate: undefined, responseReceived: false },
});

const getInitialState = (initialCoverLetter?: CoverLetter): CoverLetterState => {
  const defaultState = {
    coverLetter: initialCoverLetter || getDefaultCoverLetter(),
    isSaving: false,
    error: null,
    isLoading: false,
  };

  if (typeof window === 'undefined') {
    return defaultState;
  }

  try {
    const id = initialCoverLetter?.id || 'new';
    const savedData = localStorage.getItem(`coverLetter_${id}`);
    if (savedData) {
      const savedCoverLetter = JSON.parse(savedData) as CoverLetter;
      // Merge with initialCoverLetter to respect fetched data over stale local data if timestamps differ
      if (initialCoverLetter && new Date(initialCoverLetter.lastModified) > new Date(savedCoverLetter.lastModified)) {
        return { ...defaultState, coverLetter: initialCoverLetter };
      }
      return { ...defaultState, coverLetter: savedCoverLetter };
    }
  } catch (error) {
    console.error('Failed to load cover letter from local storage:', error);
    // Fallback to default state
  }

  return defaultState;
};

const reducer = (state: CoverLetterState, action: CoverLetterAction): CoverLetterState => {
  switch (action.type) {
    case 'SET_COVER_LETTER':
      return { ...state, coverLetter: action.payload };
    case 'UPDATE_CONTENT':
      if (!state.coverLetter) return state;
      return {
        ...state,
        coverLetter: {
          ...state.coverLetter,
          content: {
            ...state.coverLetter.content,
            ...action.payload,
          },
        },
      };
    case 'SET_SAVING':
      return { ...state, isSaving: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'RESET_COVER_LETTER':
      return { ...state, coverLetter: getDefaultCoverLetter() };
    default:
      return state;
  }
};

type CoverLetterContextType = {
  state: CoverLetterState;
  updateContent: (content: Partial<CoverLetter['content']>) => void;
  updateCoverLetter: (updates: Partial<CoverLetter>) => void;
  syncCoverLetter: () => Promise<CoverLetter | undefined>;
  resetCoverLetter: () => void;
};

const CoverLetterContext = createContext<CoverLetterContextType | undefined>(undefined);

interface CoverLetterProviderProps {
  children: React.ReactNode;
  initialCoverLetter?: CoverLetter;
}

export const CoverLetterProvider: React.FC<CoverLetterProviderProps> = ({ 
  children, 
  initialCoverLetter 
}) => {
  const [state, dispatch] = useReducer(reducer, getInitialState(initialCoverLetter));

  useEffect(() => {
    if (state.coverLetter) {
      try {
        localStorage.setItem(`coverLetter_${state.coverLetter.id}`, JSON.stringify(state.coverLetter));
      } catch (error) {
        console.error('Failed to save cover letter to local storage:', error);
      }
    }
  }, [state.coverLetter]);

  const updateContent = useCallback((content: Partial<CoverLetter['content']>) => {
    dispatch({ type: 'UPDATE_CONTENT', payload: content });
  }, []);

  const syncCoverLetter = useCallback(async () => {
    if (!state.coverLetter) return;
    
    dispatch({ type: 'SET_SAVING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      const isNew = state.coverLetter.id === 'new';
      const url = isNew 
        ? '/api/cover-letters'
        : `/api/cover-letters/${state.coverLetter.id}`;
      
      const method = isNew ? 'POST' : 'PUT';
      const payload = state.coverLetter;

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 403) {
          throw new Error(errorData.error || 'Save limit reached');
        }
        throw new Error(errorData.error || 'Failed to save cover letter');
      }

      const data = await response.json();
      
      // If this was a new cover letter, update the URL with the new ID
      if (isNew && typeof window !== 'undefined') {
        window.history.replaceState({}, '', `/cover-letter/editor/${data.id}`);
      }
      
      dispatch({ type: 'SET_COVER_LETTER', payload: data });
      return data;
    } catch (error) {
      console.error('Error saving cover letter:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to save cover letter';
      dispatch({
        type: 'SET_ERROR',
        payload: errorMessage,
      });
      throw error;
    } finally {
      dispatch({ type: 'SET_SAVING', payload: false });
    }
  }, [state.coverLetter]);

  const updateCoverLetter = useCallback((updates: Partial<CoverLetter>) => {
    if (state.coverLetter) {
      dispatch({
        type: 'SET_COVER_LETTER',
        payload: { ...state.coverLetter, ...updates },
      });
    }
  }, [state.coverLetter]);

  const resetCoverLetter = useCallback(() => {
    dispatch({ type: 'RESET_COVER_LETTER' });
  }, []);

  const value = {
    state,
    updateContent,
    updateCoverLetter,
    syncCoverLetter,
    resetCoverLetter,
  };

  return (
    <CoverLetterContext.Provider value={value}>
      {children}
    </CoverLetterContext.Provider>
  );
};

interface UseCoverLetterOptions {
  // All properties are optional since we don't have any required options yet
  [key: string]: any;
}

export const useCoverLetter = (): CoverLetterContextType => {
  const context = useContext(CoverLetterContext);
  if (context === undefined) {
    throw new Error('useCoverLetter must be used within a CoverLetterProvider');
  }
  return context;
};
