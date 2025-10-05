import React, { useState } from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Textarea } from './ui/textarea';
import type { ResumeData } from '@/types/resume';
import { useAi } from '@/hooks/use-ai';
import { supabase } from '@/lib/supabase/client';
import { sanitizeTextForPdf } from '@/lib/utils';
import { useAuth } from '@/contexts/auth-context';

interface AIResumeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onResumeDataGenerated: (data: ResumeData) => void;
}

interface OpenRouterMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export const AIResumeModal: React.FC<AIResumeModalProps> = ({ 
  open, 
  onOpenChange, 
  onResumeDataGenerated 
}) => {
  const { effectiveAiEnabled, usage, refreshUsage } = useAi();
  const { user } = useAuth();
  const [userInput, setUserInput] = useState('');
  const [aiResponse, setAIResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [parsedData, setParsedData] = useState<ResumeData | null>(null);

// Enhanced prompt to extract structured data
const systemPrompt = `You are an expert resume parser and builder. Your task is to extract information from the user's input and convert it into a structured JSON format that matches this exact schema:

{
  "basics": {
    "name": "Full Name",
    "email": "email@example.com",
    "phone": "phone number or empty string",
    "location": "City, Country",
    "linkedin": "linkedin profile URL or empty string",
    "summary": "Professional summary or empty string"
  },

  "custom": {
    "custom_dob_001": {
      "title": "Date of Birth",
      "content": "January 1, 1990",
      "hidden": false,
      "id": "custom_dob_001",
      "link": false
    },
    "custom_nationality_002": {
      "title": "Nationality",
      "content": "Your Nationality",
      "hidden": false,
      "id": "custom_nationality_002",
      "link": false
    },
    "custom_website_003": {
      "title": "Website",
      "content": "https://example.com",
      "hidden": false,
      "id": "custom_website_003",
      "link": true
    }
  },

  "sections": [
    {
      "id": "edu-1",
      "title": "Education",
      "type": "education",
      "items": [
        {
          "institution": "University Name",
          "degree": "Degree Name",
          "startDate": "2015-09",
          "endDate": "2019-06",
          "location": "City, Country",
          "highlights": ["Special achievements or GPA"]
        }
      ]
    },
    {
      "id": "exp-1",
      "title": "Professional Experience",
      "type": "experience",
      "items": [
        {
          "company": "Company Name",
          "role": "Job Title",
          "startDate": "2020-01",
          "endDate": "2023-12",
          "location": "City, Country",
          "achievements": [
            "Key responsibility or achievement 1",
            "Key responsibility or achievement 2"
          ]
        }
      ]
    },
    {
      "id": "skills-1",
      "title": "Skills & Technologies",
      "type": "skills",
      "items": ["JavaScript", "React", "Node.js"]
    },
    {
      "id": "lang-1",
      "title": "Languages",
      "type": "languages",
      "items": ["English (Fluent)", "Spanish (Intermediate)"]
    },
    {
      "id": "cert-1",
      "title": "Certifications",
      "type": "certifications",
      "items": ["AWS Certified Solutions Architect - 2022"]
    },
    {
      "id": "custom-1",
      "title": "Projects & Achievements",
      "type": "custom",
      "content": [
        "Project Name - Short description - Technologies Used",
        "Achievement 1",
        "Achievement 2"
      ]
    }
  ]
}

IMPORTANT RULES:
1. Extract ALL available information from the user's input, even if not explicitly stated in traditional resume format.
2. Use professional, ATS-optimized language.
3. If information is missing, use empty strings or empty arrays.
4. Always return valid JSON that can be parsed.
5. Make skills and achievements specific and quantifiable.
6. Use bullet points for job responsibilities and achievements.
7. Format dates consistently (e.g., "2020-2023" or "2020 - Present").
8. For work experience: If user mentions years of experience but no specific jobs, create a generic job entry like "Software Engineer - Freelance/Self-Employed - X years" with bullet points from their description.
9. For projects: Extract any mentioned projects, side projects, or work examples.
10. For achievements: Extract any accomplishments, contributions, or notable work mentioned.
11. Be creative but accurate - if someone says "3 years experience building SaaS apps", create a job entry reflecting that.
12. OUTPUT MUST BE PDF-LIB SAFE: Replace all non-ASCII characters (e.g., smart quotes, curly quotes, em/en dashes, non-breaking hyphens, special minus signs) with standard ASCII equivalents (" for quotes, ' for apostrophes, - for all dash/hyphen types). Remove any characters that cannot be encoded in WinAnsi.

Parse the user's information and return ONLY the JSON object, no additional text.`;

  const handleStart = async () => {
    if (!user) {
      setError('You must be logged in to use AI.');
      return;
    }
    if (!effectiveAiEnabled) {
      setError('AI is disabled. Enable it in settings or ensure you are logged in.');
      return;
    }
    if (usage && usage.monthUsdRemaining <= 0) {
      setError('You have exhausted your monthly AI credits.');
      return;
    }
    setLoading(true);
    setError(null);
    setAIResponse('');
    setParsedData(null);
    
    try {
      const messages: OpenRouterMessage[] = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userInput || 'I want to create a resume.' },
      ];
      
      // attach supabase access token for server auth
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch('/api/openrouter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(session?.access_token ? { 'Authorization': `Bearer ${session.access_token}` } : {}),
        },
        body: JSON.stringify({
          messages,
          model: 'openai/gpt-oss-20b:free',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get AI response');
      }

      const result = await response.json();
      const aiContent = result.choices[0]?.message?.content || '';
      setAIResponse(aiContent);

      // Try to parse the JSON response
      try {
        const parsed = JSON.parse(aiContent);
        setParsedData(parsed);
      } catch (parseError) {
        setError('AI response could not be parsed. Please try again with more specific information.');
      }
    } catch (err: any) {
      setError(err.message || 'Unknown error');
    } finally {
      setLoading(false);
      // Refresh usage after an attempt (success or fail may still count)
      try { await refreshUsage(); } catch {}
    }
  };

  const handleUseData = () => {
    if (parsedData) {
      onResumeDataGenerated(parsedData);
      onOpenChange(false);
      setUserInput('');
      setAIResponse('');
      setParsedData(null);
    }
  };

  // Sanitize resume data to ensure PDF compatibility
  const sanitizeResumeData = (data: ResumeData): ResumeData => {
    return {
      ...data,
      name: sanitizeTextForPdf(data.name || ''),
      email: sanitizeTextForPdf(data.email || ''),
      phone: sanitizeTextForPdf(data.phone || ''),
      location: sanitizeTextForPdf(data.location || ''),
      linkedin: sanitizeTextForPdf(data.linkedin || ''),
      custom: Object.fromEntries(
        Object.entries(data.custom || {}).map(([key, field]) => [
          key,
          {
            ...field,
            title: sanitizeTextForPdf(field.title || ''),
            content: sanitizeTextForPdf(field.content || ''),
          }
        ])
      ),
      sections: data.sections?.map(section => ({
        ...section,
        title: sanitizeTextForPdf(section.title || ''),
        content: Object.fromEntries(
          Object.entries(section?.content || {}).map(([key, values]) => [
            key,
            values?.map(value => sanitizeTextForPdf(value || '')) || []
          ]
        ))
      })) || [],
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>AI Resume Builder</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {user && usage && (
            <div className="text-xs text-gray-600">
              Monthly AI credits: ${'{'}usage.totalUsdUsedThisMonth.toFixed(2){'}'} used / ${'{'}usage.monthUsdLimit.toFixed(2){'}'} limit
            </div>
          )}
          <div>
            <label className="text-sm font-medium mb-2 block">
              Tell us about yourself, your experience, education, and skills:
            </label>
            <Textarea
              value={userInput}
              onChange={e => setUserInput(e.target.value)}
              placeholder="Example: I'm John Doe, a software engineer with 5 years of experience in React and Node.js. I graduated from MIT in 2019 with a Computer Science degree. I've worked at Google and Microsoft, specializing in full-stack development..."
              rows={6}
              disabled={loading}
            />
          </div>
          
          <Button onClick={handleStart} disabled={loading || !userInput}>
            {loading ? 'Analyzing...' : 'Parse with AI'}
          </Button>
          
          {error && <div className="text-red-500 text-sm">{error}</div>}
          
          {parsedData && (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-800 mb-2">✅ Resume Data Extracted!</h3>
                <div className="text-sm text-green-700 space-y-1">
                  <p><strong>Name:</strong> {parsedData.name}</p>
                  <p><strong>Email:</strong> {parsedData.email}</p>
                  <p><strong>Location:</strong> {parsedData.location}</p>
                  <p><strong>Sections:</strong> {parsedData.sections.length} sections extracted</p>
                </div>
              </div>
              
              <Button onClick={handleUseData} className="w-full">
                Use This Data in Resume Builder
              </Button>
            </div>
          )}
          
          {aiResponse && !parsedData && (
            <div className="bg-muted p-4 rounded text-sm whitespace-pre-line">
              <h4 className="font-semibold mb-2">AI Response:</h4>
              {aiResponse}
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={() => onOpenChange(false)} disabled={loading}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AIResumeModal;