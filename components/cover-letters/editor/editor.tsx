'use client';

import { useState, useEffect } from 'react';
import { useCoverLetter } from '@/contexts/CoverLetterContext';
import { CoverLetter, TemplateName } from '@/types/cover-letter';
import { cn } from '@/lib/utils';
import { Loader2, Save, FileText, Settings, AlertCircle, CheckCircle2, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CoverLetterSwitcher } from '@/components/cover-letters/cover-letter-switcher';
import { downloadCoverLetterPDF, downloadCoverLetterDOCX } from '@/lib/export/cover-letter';

export function CoverLetterEditor() {
  const { state, updateContent, updateCoverLetter, syncCoverLetter } = useCoverLetter();
  const [lastSynced, setLastSynced] = useState<Date | null>(null);
  const [isDownloading, setIsDownloading] = useState<'pdf' | 'docx' | null>(null);
  
  const { coverLetter, isSaving, error } = state;
  const content = coverLetter.content;
  const recipient = content.recipient;

  useEffect(() => {
    // When the component loads, if the cover letter has a real ID (not 'new'),
    // we can assume the last synced time is its last update time from the DB.
    if (coverLetter.id !== 'new' && coverLetter.updatedAt) {
      setLastSynced(new Date(coverLetter.updatedAt));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coverLetter.id]);

  const handleSync = async () => {
    const syncedCoverLetter = await syncCoverLetter();
    if (syncedCoverLetter) {
      setLastSynced(new Date(syncedCoverLetter.updatedAt));
    }
  };

  const handleDownload = async (format: 'pdf' | 'docx') => {
    setIsDownloading(format);
    try {
      if (format === 'pdf') {
        await downloadCoverLetterPDF(coverLetter);
      } else {
        await downloadCoverLetterDOCX(coverLetter);
      }
    } catch (error) {
      console.error(`Download failed:`, error);
    } finally {
      setIsDownloading(null);
    }
  };


  const handleChange = (field: keyof Omit<typeof content, 'recipient'>, value: string) => {
    updateContent({ [field]: value });
  };

  const handleRecipientChange = (field: keyof typeof recipient, value: string) => {
    updateContent({
      recipient: {
        ...content.recipient,
        [field]: value
      }
    });
  };

  return (
    <div className="space-y-6 p-6">
      {state.isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
      <>
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <div className="flex-1 pr-4">
            <CoverLetterSwitcher />
            <p className="text-xs text-muted-foreground mt-1">
              {lastSynced ? `Last synced: ${lastSynced.toLocaleString()}` : 'Not synced yet'}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center text-sm text-muted-foreground mr-2">
              <CheckCircle2 className="mr-1 h-3 w-3 text-green-500" />
              <span>Saved locally</span>
            </div>
            <Button 
              onClick={handleSync} 
              disabled={isSaving}
              variant={error ? 'destructive' : 'outline'}
              size="sm"
              className="min-w-[120px]"
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Syncing...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Sync to Cloud
                </>
              )}
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleDownload('pdf')}
              disabled={isDownloading === 'pdf'}
            >
              {isDownloading === 'pdf' ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Download className="mr-2 h-4 w-4" />
              )}
              PDF
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleDownload('docx')}
              disabled={isDownloading === 'docx'}
            >
              {isDownloading === 'docx' ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Download className="mr-2 h-4 w-4" />
              )}
              DOCX
            </Button>
          </div>
        </div>
        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">
            <div className="flex items-start">
              <AlertCircle className="h-4 w-4 mt-0.5 mr-2 flex-shrink-0" />
              <div>
                <p className="font-medium">Failed to save changes</p>
                <p className="text-muted-foreground">{error}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <Tabs defaultValue="content" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md mb-6">
          <TabsTrigger value="content">
            <FileText className="mr-2 h-4 w-4" />
            Content
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="yourName">Your Name</Label>
            <Input
              id="yourName"
              value={content.yourName || ''}
              onChange={(e) => handleChange('yourName', e.target.value)}
              placeholder="John Doe"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="yourEmail">Your Email</Label>
            <Input
              id="yourEmail"
              type="email"
              value={content.yourEmail || ''}
              onChange={(e) => handleChange('yourEmail', e.target.value)}
              placeholder="john@example.com"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="recipientName">Recipient Name</Label>
          <Input
            id="recipientName"
            value={recipient.name}
            onChange={(e) => handleRecipientChange('name', e.target.value)}
            placeholder="Hiring Manager"
          />
          <Label htmlFor="opening">Opening</Label>
          <Textarea
            id="opening"
            value={content.opening}
            onChange={(e) => handleChange('opening', e.target.value)}
            placeholder="Dear [Recipient's Name],"
            rows={2}
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="body">Body</Label>
            <div className="text-xs text-muted-foreground">
              {content.body?.length || 0} characters • {content.body?.trim() ? content.body.trim().split(/\s+/).length : 0} words
            </div>
          </div>
          <Textarea
            id="body"
            value={content.body || ''}
            onChange={(e) => handleChange('body', e.target.value)}
            placeholder="I am excited to apply for the position of..."
            className="min-h-[200px] font-mono text-sm"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="closing">Closing</Label>
          <Textarea
            id="closing"
            value={content.closing || ''}
            onChange={(e) => handleChange('closing', e.target.value)}
            placeholder="Sincerely,"
            rows={2}
          />
        </div>
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-4">
          <div className="space-y-4 p-4 border rounded-lg">
            <h3 className="font-medium">Cover Letter Settings</h3>
            <div className="space-y-2">
              <Label>Template</Label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'classic', name: 'Classic' },
                  { id: 'modern', name: 'Modern' },
                  { id: 'elegant', name: 'Elegant' },
                  { id: 'creative', name: 'Creative' },
                  { id: 'minimalist', name: 'Minimalist' },
                ].map((template) => (
                  <Button
                    key={template.id}
                    variant={coverLetter.template === template.id ? 'default' : 'outline'}
                    onClick={() => updateCoverLetter({ template: template.id as TemplateName })}
                    className="h-20 text-center capitalize"
                  >
                    {template.name}
                  </Button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Font</Label>
              <div className="grid grid-cols-3 gap-2">
                <Button variant="outline" size="sm">Arial</Button>
                <Button variant="outline" size="sm">Times New Roman</Button>
                <Button variant="outline" size="sm">Calibri</Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      </>
      )}
    </div>
  );
}
