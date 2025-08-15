"use client"
import { ClassicATSResume } from './ats-classic';
import { GoogleResume } from './google-resume';

export async function getResumePreview(options: any) {
  const { template } = options;

  switch (template.id) {
    case 'google':
      return GoogleResume

    case 'ats-classic':
      return ClassicATSResume

    default:
      return null;
  }
}
