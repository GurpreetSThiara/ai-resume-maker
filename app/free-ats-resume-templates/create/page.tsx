import CreateResume from './Create'
import type { Metadata } from 'next';
import { pageSocialMetadata } from '@/lib/seo';

const TITLE = 'Create Free ATS Resume - Choose Template | CreateFreeCV.com';
const DESCRIPTION =
  'Select from a variety of free ATS-friendly resume templates to start building your professional resume. No sign-up required. Download in pdf for free.';

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ template?: string }>;
}): Promise<Metadata> {
  const params = await searchParams; // ✅ REQUIRED in Next.js 16
  const isParamUrl = Boolean(params?.template);

  return {
    title: TITLE,
    description: DESCRIPTION,

    alternates: {
      canonical:
        'https://createfreecv.com/free-ats-resume-templates/create',
    },

    ...pageSocialMetadata({
      title: TITLE,
      description: DESCRIPTION,
      path: '/free-ats-resume-templates/create',
    }),

    robots: isParamUrl
      ? { index: false, follow: true } // ?template= URLs
      : { index: true, follow: true }, // canonical URL
  };
}


const page = () => {
  return (
    <div>
      <CreateResume/>
    </div>
  )
}

export default page