"use client"
import { DESIGN_RESUME_COMPONENTS } from './design-resumes';

/**
 * Resolve the editable-preview component for a template.
 *
 * Every template — the config-driven designs and the migrated legacy templates
 * (classic-blue, ats-classic, ats-green, modern-sidebar, …) — renders its
 * editable preview through ConfigurableResume via DESIGN_RESUME_COMPONENTS
 * (which includes LEGACY_DESIGNS). Unknown ids fall back to classic-blue.
 */
export async function getResumePreview(options: any) {
  const { template } = options;
  return (
    DESIGN_RESUME_COMPONENTS[template.id] ??
    DESIGN_RESUME_COMPONENTS["classic-blue"] ??
    null
  );
}
