import { supabase } from '@/lib/supabase';

import type { Bookmark } from '@/lib/database.types';

export type BookmarkInput = {
  url: string;
  description: string;
};

export function normalizeBookmarkUrl(rawUrl: string) {
  const trimmed = rawUrl.trim();

  if (!trimmed) {
    throw new Error('URL is required.');
  }

  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;

  try {
    return new URL(withProtocol).toString();
  } catch {
    throw new Error('Enter a valid URL.');
  }
}

export async function listBookmarks(): Promise<Bookmark[]> {
  const { data, error } = await supabase
    .from('bookmarks')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return data ?? [];
}

export async function getBookmark(id: string): Promise<Bookmark> {
  const { data, error } = await supabase.from('bookmarks').select('*').eq('id', id).single();

  if (error) {
    throw error;
  }

  return data;
}

export async function createBookmark(input: BookmarkInput): Promise<Bookmark> {
  // Ensure the current authenticated user's id is set on insert so RLS policies pass
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error('Not authenticated');
  }

  const { data, error } = await supabase
    .from('bookmarks')
    .insert({
      user_id: user.id,
      url: normalizeBookmarkUrl(input.url),
      description: input.description.trim(),
    })
    .select('*')
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function updateBookmark(id: string, input: BookmarkInput): Promise<Bookmark> {
  const { data, error } = await supabase
    .from('bookmarks')
    .update({
      url: normalizeBookmarkUrl(input.url),
      description: input.description.trim(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select('*')
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function deleteBookmark(id: string): Promise<void> {
  const { error } = await supabase.from('bookmarks').delete().eq('id', id);

  if (error) {
    throw error;
  }
}
