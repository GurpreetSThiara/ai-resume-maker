import { createClient } from '@/lib/supabase/client';
import { CoverLetter, CreateCoverLetterInput, UpdateCoverLetterInput } from '@/types/cover-letter';

const TABLE_NAME = 'cover_letters';

export async function createCoverLetter(input: CreateCoverLetterInput): Promise<CoverLetter> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .insert({
      user_id: input.userId,
      title: input.title,
      content: input.content,
      template_id: input.templateId,
    })
    .select()
    .single();

  if (error) throw error;
  return mapToCoverLetter(data);
}

export async function getCoverLetter(id: string): Promise<CoverLetter> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return mapToCoverLetter(data);
}

export async function updateCoverLetter(
  id: string,
  updates: UpdateCoverLetterInput
): Promise<CoverLetter> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return mapToCoverLetter(data);
}

export async function deleteCoverLetter(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from(TABLE_NAME)
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function listCoverLetters(userId: string): Promise<CoverLetter[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });

  if (error) throw error;
  return data.map(mapToCoverLetter);
}

// Helper function to map database row to CoverLetter type
function mapToCoverLetter(data: any): CoverLetter {
  return {
    id: data.id,
    userId: data.user_id,
    title: data.title,
    content: data.content,
    templateId: data.template_id,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}
