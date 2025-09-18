'use client';

import { useState } from 'react';
import { useCoverLetter } from '@/contexts/CoverLetterContext';
import { CoverLetter } from '@/types/cover-letter';
import { Loader2, Save, FileText, AlertCircle, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { coverLetterExample } from '@/lib/examples/cover-letter';

export function CoverLetterEditor() {
  const { state, updateCoverLetter, updateContent, syncCoverLetter } = useCoverLetter();
  const {   isSaving, error } = state;
  const coverLetter = coverLetterExample;
  const [activeTab, setActiveTab] = useState<'details' | 'content' | 'formatting' >('details');

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

  const setApplicantAddress = (updates: Partial<CoverLetter['applicant']['contactInfo']['address']>) =>
    updateCoverLetter({
      applicant: {
        ...coverLetter.applicant,
        contactInfo: {
          ...coverLetter.applicant.contactInfo,
          address: { ...coverLetter.applicant.contactInfo.address, ...updates },
        },
      },
    });

  const setPosition = (updates: Partial<CoverLetter['position']>) =>
    updateCoverLetter({ position: { ...coverLetter.position, ...updates } });

  const setRecipient = (updates: Partial<CoverLetter['recipient']>) =>
    updateCoverLetter({ recipient: { ...coverLetter.recipient, ...updates } });

  const setRecipientAddress = (updates: Partial<CoverLetter['recipient']['address']>) =>
    updateCoverLetter({
      recipient: { ...coverLetter.recipient, address: { ...coverLetter.recipient.address, ...updates } },
    });

  const setContentField = (payload: Partial<CoverLetter['content']>) => updateContent(payload);

  const addBodyParagraph = () => {
    const newId = `p${coverLetter.content.bodyParagraphs.length + 1}`;
    const updated = [
      ...coverLetter.content.bodyParagraphs,
      { id: newId, text: '', focus: 'experience' as const, keywords: [] },
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
    await syncCoverLetter().catch(() => {});
  };





  return (
  <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Header */}
   

      {error && (
        <div className="flex items-start gap-2 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700 mb-4" role="alert">
          <AlertCircle className="mt-0.5 h-4 w-4" />
          <div>{error}</div>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="formatting">Formatting</TabsTrigger>
        </TabsList>

        {/* Details Tab */}
        <TabsContent value="details" className="mt-4 space-y-8">
          {/* Applicant */}
          <section>
            <h3 className="text-lg font-semibold mb-3">Applicant</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="firstName">First name</Label>
                <Input id="firstName" value={coverLetter.applicant.firstName}
                  onChange={(e) => setApplicant({ firstName: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="lastName">Last name</Label>
                <Input id="lastName" value={coverLetter.applicant.lastName}
                  onChange={(e) => setApplicant({ lastName: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="title">Professional title</Label>
                <Input id="title" value={coverLetter.applicant.professionalTitle}
                  onChange={(e) => setApplicant({ professionalTitle: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={coverLetter.applicant.contactInfo.email}
                  onChange={(e) => setApplicantContact({ email: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" value={coverLetter.applicant.contactInfo.phone}
                  onChange={(e) => setApplicantContact({ phone: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="linkedin">LinkedIn (optional)</Label>
                <Input id="linkedin" value={coverLetter.applicant.contactInfo.linkedin ?? ''}
                  onChange={(e) => setApplicantContact({ linkedin: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-4">
              <div className="md:col-span-2">
                <Label htmlFor="street">Street</Label>
                <Input id="street" value={coverLetter.applicant.contactInfo.address.street ?? ''}
                  onChange={(e) => setApplicantAddress({ street: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="city">City</Label>
                <Input id="city" value={coverLetter.applicant.contactInfo.address.city}
                  onChange={(e) => setApplicantAddress({ city: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Input id="state" value={coverLetter.applicant.contactInfo.address.state}
                  onChange={(e) => setApplicantAddress({ state: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="zip">ZIP</Label>
                <Input id="zip" value={coverLetter.applicant.contactInfo.address.zipCode}
                  onChange={(e) => setApplicantAddress({ zipCode: e.target.value })} />
              </div>
            </div>
          </section>

          {/* Position */}
          <section>
            <h3 className="text-lg font-semibold mb-3">Position</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="jobTitle">Job title</Label>
                <Input id="jobTitle" value={coverLetter.position.jobTitle}
                  onChange={(e) => setPosition({ jobTitle: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="company">Company</Label>
                <Input id="company" value={coverLetter.position.company}
                  onChange={(e) => setPosition({ company: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="department">Department</Label>
                <Input id="department" value={coverLetter.position.department ?? ''}
                  onChange={(e) => setPosition({ department: e.target.value })} />
              </div>
            </div>
          </section>

          {/* Recipient */}
          <section>
            <h3 className="text-lg font-semibold mb-3">Recipient</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="recipientName">Name</Label>
                <Input id="recipientName" value={coverLetter.recipient.name}
                  onChange={(e) => setRecipient({ name: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="recipientTitle">Title</Label>
                <Input id="recipientTitle" value={coverLetter.recipient.title}
                  onChange={(e) => setRecipient({ title: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="recipientCompany">Company</Label>
                <Input id="recipientCompany" value={coverLetter.recipient.company}
                  onChange={(e) => setRecipient({ company: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
              <div className="md:col-span-2">
                <Label htmlFor="recipientStreet">Street</Label>
                <Input id="recipientStreet" value={coverLetter.recipient.address.street}
                  onChange={(e) => setRecipientAddress({ street: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="recipientCity">City</Label>
                <Input id="recipientCity" value={coverLetter.recipient.address.city}
                  onChange={(e) => setRecipientAddress({ city: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="recipientState">State</Label>
                <Input id="recipientState" value={coverLetter.recipient.address.state}
                  onChange={(e) => setRecipientAddress({ state: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="recipientZip">ZIP</Label>
                <Input id="recipientZip" value={coverLetter.recipient.address.zipCode}
                  onChange={(e) => setRecipientAddress({ zipCode: e.target.value })} />
              </div>
            </div>
          </section>
        </TabsContent>

        {/* Content Tab */}
        <TabsContent value="content" className="mt-4 space-y-8">
          <section>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="salutation">Salutation</Label>
                <Input id="salutation" value={coverLetter.content.salutation}
                  onChange={(e) => setContentField({ salutation: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="date">Date</Label>
                <Input id="date" type="date" value={new Date(coverLetter.content.date).toISOString().slice(0, 10)}
                  onChange={(e) => setContentField({ date: new Date(e.target.value) })} />
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-2">Opening paragraph</h3>
            <Textarea rows={5}
              value={coverLetter.content.openingParagraph.text}
              onChange={(e) => setContentField({
                openingParagraph: { ...coverLetter.content.openingParagraph, text: e.target.value },
              })}
            />
          </section>

          <section>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">Body paragraphs</h3>
              <Button type="button" variant="outline" onClick={addBodyParagraph}>+ Add paragraph</Button>
            </div>
            <div className="space-y-4">
              {coverLetter.content.bodyParagraphs.map((p, idx) => (
                <div key={p.id} className="rounded-md border p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm text-muted-foreground">Paragraph {idx + 1}</div>
                    <div className="flex items-center gap-2">
                      <label className="text-xs text-muted-foreground">
                        Focus
                        <select
                          className="ml-2 border rounded px-2 py-1 text-xs"
                          value={p.focus}
                          onChange={(e) => updateBodyParagraph(idx, { focus: e.target.value as any })}
                        >
                          <option value="experience">Experience</option>
                          <option value="skills">Skills</option>
                          <option value="achievements">Achievements</option>
                          <option value="company_research">Company research</option>
                          <option value="education">Education</option>
                        </select>
                      </label>
                      <Button type="button" variant="ghost" size="sm" onClick={() => removeBodyParagraph(idx)}>
                        Remove
                      </Button>
                    </div>
                  </div>
                  <Textarea rows={5} value={p.text} onChange={(e) => updateBodyParagraph(idx, { text: e.target.value })} />
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-2">Closing paragraph</h3>
            <Textarea rows={4}
              value={coverLetter.content.closingParagraph.text}
              onChange={(e) => setContentField({
                closingParagraph: { ...coverLetter.content.closingParagraph, text: e.target.value },
              })}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
              <div>
                <Label htmlFor="cta">Call to action</Label>
                <Input id="cta" value={coverLetter.content.closingParagraph.callToAction}
                  onChange={(e) => setContentField({
                    closingParagraph: { ...coverLetter.content.closingParagraph, callToAction: e.target.value },
                  })}
                />
              </div>
              <div>
                <Label htmlFor="availability">Availability</Label>
                <Input id="availability" value={coverLetter.content.closingParagraph.availability}
                  onChange={(e) => setContentField({
                    closingParagraph: { ...coverLetter.content.closingParagraph, availability: e.target.value },
                  })}
                />
              </div>
            </div>
          </section>

          <section>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="complimentaryClose">Complimentary close</Label>
                <Input id="complimentaryClose" value={coverLetter.content.complimentaryClose}
                  onChange={(e) => setContentField({ complimentaryClose: e.target.value })} />
              </div>
            </div>
          </section>
        </TabsContent>

        {/* Formatting Tab (basic controls for now) */}
        <TabsContent value="formatting" className="mt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="fontFamily">Font family</Label>
              <Input id="fontFamily" value={coverLetter.formatting.fontFamily}
                onChange={(e) => updateCoverLetter({ formatting: { ...coverLetter.formatting, fontFamily: e.target.value } })} />
            </div>
            <div>
              <Label htmlFor="fontSize">Font size</Label>
              <Input id="fontSize" type="number" value={coverLetter.formatting.fontSize}
                onChange={(e) => updateCoverLetter({ formatting: { ...coverLetter.formatting, fontSize: Number(e.target.value || 0) } })} />
            </div>
            <div>
              <Label htmlFor="lineHeight">Line height</Label>
              <Input id="lineHeight" type="number" step="0.05" value={coverLetter.formatting.lineHeight}
                onChange={(e) => updateCoverLetter({ formatting: { ...coverLetter.formatting, lineHeight: Number(e.target.value || 0) } })} />
            </div>
          </div>
        </TabsContent>

        {/* Export Tab */}
    
      </Tabs>
    </div>
  );
}
