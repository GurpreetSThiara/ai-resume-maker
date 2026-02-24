import { ResumeData } from "@/types/resume";

export const trackResumeDownloadToSheets = async (data: any, isLoggedIn: boolean = false) => {
    try {
        // Data extraction
        // data might be wrapped in `{ resumeData: ... }` or directly the resumeData object.
        const actualData = data?.resumeData || data;

        // template name might be directly on data.template.name or data.template
        const templateName = data?.template?.name || data?.template || 'Unknown Template';

        const payload = {
            name: actualData?.basics?.name || '',
            email: actualData?.basics?.email || '',
            phone: actualData?.basics?.phone || '',
            linkedin: actualData?.basics?.linkedin || '',
            template: templateName,
            isLoggedIn: isLoggedIn
        };

        // Post to our local API route to hide the Google Sheets URL and payload from the network tab inspector
        await fetch('/api/track-sheets', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });
    } catch (error) {
        console.error('Error tracking resume download to Google Sheets:', error);
    }
};
