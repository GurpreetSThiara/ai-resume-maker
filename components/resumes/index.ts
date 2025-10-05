"use client"
import { RESUME_NAMES } from '@/config/resumeConfig';
import {  ATS_GREEN_HEADERS } from './ats-green-headers';
import { ClassicATSResume } from './ats-classic';
import { GoogleResume } from './google-resume';
import { ATS_GREEN } from '@/lib/templates';

export async function getResumePreview(options: any) {
  const { template } = options;

  switch (template.id) {
    case 'google':
     
     return GoogleResume

    case 'ats-classic':
      return ClassicATSResume

    case ATS_GREEN.id:
     return ATS_GREEN_HEADERS  

    default:
      return null;
  }
}
