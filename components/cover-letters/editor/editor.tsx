'use client';

import { useState } from 'react';
import { useCoverLetter } from '@/contexts/CoverLetterContext';
import { CoverLetter } from '@/types/cover-letter';
import { AlertCircle, User, Calendar, Building } from 'lucide-react';
import DownloadDropDown from './download-dropdown';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Divider } from '@/components/ui/divider';

interface CoverLetterEditorProps {
  activeStep?: number;
}

export function CoverLetterEditor({ activeStep = 0 }: CoverLetterEditorProps) {
  const { state, updateCoverLetter, updateContent, syncCoverLetter } = useCoverLetter();
  const { coverLetter, isSaving, error } = state;

  // Derived helpers
  const title: string | undefined = (coverLetter as any)?.title ?? "sample";
  const canExport = Boolean(title && title.trim().length > 0);

  // Field updaters
  const setApplicant = (updates: Partial<CoverLetter['applicant']>) =>
    updateCoverLetter({ applicant: { ...coverLetter.applicant, ...updates } });

  const setApplicantContact = (updates: Partial<CoverLetter['applicant']['contactInfo']>) =>
    updateCoverLetter({
      applicant: {
        ...coverLetter.applicant,
        contactInfo: { ...coverLetter.applicant.contactInfo, ...updates },
      },
    });


  const setPosition = (updates: Partial<CoverLetter['position']>) =>
    updateCoverLetter({ position: { ...coverLetter.position, ...updates } });

  const setRecipient = (updates: Partial<CoverLetter['recipient']>) =>
    updateCoverLetter({ recipient: { ...coverLetter.recipient, ...updates } });


  const setContentField = (payload: Partial<CoverLetter['content']>) => updateContent(payload);

  const addBodyParagraph = () => {
    const newId = `p${coverLetter.content.bodyParagraphs.length + 1}`;
    const updated = [
      ...coverLetter.content.bodyParagraphs,
      { id: newId, text: '', keywords: [] },
    ];
    setContentField({ bodyParagraphs: updated });
  };

  const updateBodyParagraph = (idx: number, updates: Partial<CoverLetter['content']['bodyParagraphs'][number]>) => {
    const updated = coverLetter.content.bodyParagraphs.map((p, i) => (i === idx ? { ...p, ...updates } : p));
    setContentField({ bodyParagraphs: updated });
  };

  const removeBodyParagraph = (idx: number) => {
    const updated = coverLetter.content.bodyParagraphs.filter((_, i) => i !== idx);
    setContentField({ bodyParagraphs: updated });
  };

  const handleSave = async () => {
    // Supabase save disabled - cover letters are saved locally only
    console.log('Save button clicked - using local storage only');
  };

  const renderDetailsStep = () => (
    <div className="space-y-4 sm:space-y-6">
      <Card className="border-0 shadow-none w-full">
        <CardHeader className=" p-0">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg ">
            <User className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="truncate">Applicant Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6 px-0 md:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <div>
              <Label htmlFor="firstName" className="text-sm">First name</Label>
              <Input
                id="firstName"
                value={coverLetter.applicant.firstName}
                onChange={(e) => setApplicant({ firstName: e.target.value })}
                className="mobile-input"
              />
            </div>
            <div>
              <Label htmlFor="lastName" className="text-sm">Last name</Label>
              <Input
                id="lastName"
                value={coverLetter.applicant.lastName}
                onChange={(e) => setApplicant({ lastName: e.target.value })}
                className="mobile-input"
              />
            </div>
            <div className="sm:col-span-2 lg:col-span-1">
              <Label htmlFor="title" className="text-sm">Professional title</Label>
              <Input
                id="title"
                value={coverLetter.applicant.professionalTitle}
                onChange={(e) => setApplicant({ professionalTitle: e.target.value })}
                className="mobile-input"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <div>
              <Label htmlFor="email" className="text-sm">Email</Label>
              <Input
                id="email"
                type="email"
                value={coverLetter.applicant.contactInfo.email}
                onChange={(e) => setApplicantContact({ email: e.target.value })}
                className="mobile-input"
              />
            </div>
            <div>
              <Label htmlFor="phone" className="text-sm">Phone</Label>
              <Input
                id="phone"
                value={coverLetter.applicant.contactInfo.phone}
                onChange={(e) => setApplicantContact({ phone: e.target.value })}
                className="mobile-input"
              />
            </div>
            <div className="sm:col-span-2 lg:col-span-1">
              <Label htmlFor="linkedin" className="text-sm">LinkedIn (optional)</Label>
              <Input
                id="linkedin"
                value={coverLetter.applicant.contactInfo.linkedin ?? ''}
                onChange={(e) => setApplicantContact({ linkedin: e.target.value })}
                className="mobile-input"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:gap-4">
            <div>
              <Label htmlFor="address" className="text-sm">Address</Label>
              <Textarea
                id="address"
                value={coverLetter.applicant.contactInfo.address}
                onChange={(e) => setApplicantContact({ address: e.target.value })}
                placeholder="Enter your complete address (street, city, state, zip, country)"
                rows={3}
                className="mobile-input"
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Divider />

      <Card className="border-0 shadow-none">
        <CardHeader className="mobile-header p-0">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="truncate">Date</span>
          </CardTitle>
        </CardHeader>
        <CardContent className=" px-0 md:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <Label htmlFor="date" className="text-sm">Letter date</Label>
              <Input
                id="date"
                type="date"
                value={new Date(coverLetter.content.date).toISOString().slice(0, 10)}
                onChange={(e) => setContentField({ date: new Date(e.target.value) })}
                className="mobile-input"
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Divider />

      <Card className="border-0 shadow-none">
        <CardHeader className="mobile-header p-0 ">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Building className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="truncate">Recipient Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6  px-0 md:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <div>
              <Label htmlFor="recipientName" className="text-sm">Name</Label>
              <Input
                id="recipientName"
                value={coverLetter.recipient.name}
                onChange={(e) => setRecipient({ name: e.target.value })}
                className="mobile-input"
              />
            </div>
            <div>
              <Label htmlFor="recipientTitle" className="text-sm">Title</Label>
              <Input
                id="recipientTitle"
                value={coverLetter.recipient.title}
                onChange={(e) => setRecipient({ title: e.target.value })}
                className="mobile-input"
              />
            </div>
            <div className="sm:col-span-2 lg:col-span-1">
              <Label htmlFor="recipientCompany" className="text-sm">Company</Label>
              <Input
                id="recipientCompany"
                value={coverLetter.recipient.company}
                onChange={(e) => setRecipient({ company: e.target.value })}
                className="mobile-input"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:gap-4">
            <div>
              <Label htmlFor="recipientAddress" className="text-sm">Recipient Address</Label>
              <Textarea
                id="recipientAddress"
                value={coverLetter.recipient.address}
                onChange={(e) => setRecipient({ address: e.target.value })}
                placeholder="Enter recipient's complete address (street, city, state, zip)"
                rows={3}
                className="mobile-input"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderContentStep = () => (
    <div className="space-y-6 sm:space-y-8 mobile-space-y-4">
      <section className="mobile-card">
        <div className="p-4 sm:p-0">
          <div className="grid grid-cols-1 gap-3 sm:gap-4">
            <div>
              <Label htmlFor="salutation" className="text-sm">Salutation</Label>
              <Input
                id="salutation"
                value={coverLetter.content.salutation}
                onChange={(e) => setContentField({ salutation: e.target.value })}
                className="mobile-input"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mobile-card">
        <div className="p-4 sm:p-0">
          <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">Opening paragraph</h3>
          <Textarea
            rows={5}
            value={coverLetter.content.openingParagraph.text}
            onChange={(e) =>
              setContentField({
                openingParagraph: { ...coverLetter.content.openingParagraph, text: e.target.value },
              })
            }
            className="mobile-input"
          />
        </div>
      </section>

      <section className="mobile-card">
        <div className="p-4 sm:p-0">
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <h3 className="text-base sm:text-lg font-semibold">Body paragraphs</h3>
            <Button 
              type="button" 
              variant="outline" 
              onClick={addBodyParagraph}
              className="mobile-button btn-mobile"
              size="sm"
            >
              + Add paragraph
            </Button>
          </div>
          <div className="space-y-3 sm:space-y-4">
            {coverLetter.content.bodyParagraphs.map((p, idx) => (
              <div key={p.id} className="rounded-md border p-3 sm:p-4 mobile-card">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm text-muted-foreground">Paragraph {idx + 1}</div>
                  <div className="flex items-center gap-2">
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => removeBodyParagraph(idx)}
                      className="mobile-button"
                    >
                      <span className="hidden sm:inline">Remove</span>
                      <span className="sm:hidden">×</span>
                    </Button>
                  </div>
                </div>
                <Textarea
                  rows={5}
                  value={p.text}
                  onChange={(e) => updateBodyParagraph(idx, { text: e.target.value })}
                  className="mobile-input"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mobile-card">
        <div className="p-4 sm:p-0">
          <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">Closing paragraph</h3>
          <Textarea
            rows={4}
            value={coverLetter.content.closingParagraph.text}
            onChange={(e) =>
              setContentField({
                closingParagraph: { ...coverLetter.content.closingParagraph, text: e.target.value },
              })
            }
            className="mobile-input"
          />
        </div>
      </section>
    </div>
  );


  const renderStep = () => {
    switch (activeStep) {
      case 0:
        return renderDetailsStep();
      case 1:
        return renderContentStep();
      default:
        return renderDetailsStep();
    } 
  };

  return (
    <div className="max-w-5xl mx-auto px-0 sm:px-0 md:px-4 py-0 md:py-6 ">
      {error && (
        <div
          className="flex items-start gap-2 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700 mb-4 mobile-card"
          role="alert"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <div className="flex-1 min-w-0">{error}</div>
        </div>
      )}

      <div className="mt-2 sm:mt-4">{renderStep()}</div>
    </div>
  );
}
