"use client"
import { RESUME_NAMES } from '@/config/resumeConfig';
import { ATS_GREEN_HEADERS } from './ats-green-headers';
import { ClassicATSResume } from './ats-classic';
import { GoogleResume } from './google-resume';
import { ATS_GREEN, ATS_YELLOW, ATS_TIMELINE, atsCompactLinesTemplate, atsClassicCompactTemplate, modernSidebarTemplate, boldProfessionalTemplate } from '@/lib/templates';
import { BoldProfessionalResume } from './bold-professional';
import { ModernSidebarResume } from './modern-sidebar';
import { ModernSplitResume } from './modern-split';
import { ATS_YELLOW_HEADERS } from './ats-yellow-headers';
import { DESIGN_RESUME_COMPONENTS } from './design-resumes';
// import { ATS_TIMELINE as ATS_TIMELINE_COMPONENT } from './ats-timeline';  // Temporarily disabled

export async function getResumePreview(options: any) {
  const { template } = options;

  switch (template.id) {
    case 'classic-blue':

      return GoogleResume

    case 'ats-classic':
      return ClassicATSResume

    case 'ats-classic-compact':
      return ClassicATSResume

    case ATS_GREEN.id:
      return ATS_GREEN_HEADERS

    case ATS_YELLOW.id:
      // Return the ATS_YELLOW_HEADERS component or any other component for the ATS_YELLOW template
      return ATS_YELLOW_HEADERS;

    // case ATS_TIMELINE.id:  // Temporarily disabled
    //   return ATS_TIMELINE_COMPONENT;

    case atsCompactLinesTemplate.id:
      // Reuse the Google layout for ATS Compact Lines preview
      return GoogleResume;

    case modernSidebarTemplate.id:
      return ModernSidebarResume;

    case boldProfessionalTemplate.id:
      return BoldProfessionalResume;

    case "modern-split":
      return ModernSplitResume;

    default:
      // New premium config-driven designs
      if (DESIGN_RESUME_COMPONENTS[template.id]) {
        return DESIGN_RESUME_COMPONENTS[template.id];
      }
      return null;
  }
}
