'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { CoverLetter } from '@/types/cover-letter';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function CoverLetterSwitcher() {
  const [coverLetters, setCoverLetters] = useState<CoverLetter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const params = useParams();
  const currentId = params.id as string;

  useEffect(() => {
    const fetchCoverLetters = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/cover-letters');
        if (!response.ok) {
          throw new Error('Failed to fetch cover letters');
        }
        const data = await response.json();
        setCoverLetters(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCoverLetters();
  }, []);

  const handleSwitch = (id: string) => {
    if (id !== currentId) {
      router.push(`/cover-letter/editor/${id}`);
    }
  };

  return (
    <Select onValueChange={handleSwitch} value={currentId} disabled={isLoading}>
      <SelectTrigger className="w-full md:w-[300px] text-2xl font-bold border-0 shadow-none focus-visible:ring-0 p-0 truncate">
        <SelectValue placeholder="Select a cover letter..." />
      </SelectTrigger>
      <SelectContent>
        {coverLetters.map((cl) => (
          <SelectItem key={cl.id} value={cl.id}>
            {cl.title || 'Untitled Cover Letter'}
          </SelectItem>
        ))}
        <SelectItem value="new">
          + Create New Cover Letter
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
