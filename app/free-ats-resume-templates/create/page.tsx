import CreateResume from './Create'
import type { Metadata } from 'next';

export async function generateMetadata({
  searchParams,
}: {
  searchParams: { template?: string };
}): Promise<Metadata> {
  const isParamUrl = Boolean(searchParams?.template);

  return {
    title: 'Create Free Resume - No Sign Up | No Credit Card | CreateFreeCV.com',
    description:
      'Select from a variety of free ATS-friendly resume templates to start building your professional resume. No sign-up required. Download pdf for free.',

    alternates: {
      canonical:
        'https://www.createfreecv.com/free-ats-resume-templates/create',
    },

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