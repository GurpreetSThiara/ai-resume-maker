import { ResumeData } from "@/types/resume";

  export const sanitizeResumeData = (data: ResumeData): ResumeData => ({
    ...data,
    basics: {
      ...data.basics,
      name: data.basics.name || '',
      email: data.basics.email || '',
      phone: data.basics.phone || '',
      location: data.basics.location || '',
      linkedin: data.basics.linkedin || '',
      summary: data.basics.summary || ''
    },
    custom: Object.fromEntries(
      Object.entries(data.custom || {}).map(([key, field]) => [
        key,
        {
          ...field,
          title: field.title || '',
          content: field.content || ''
        }
      ])
    ),
    sections: data.sections
  });
  