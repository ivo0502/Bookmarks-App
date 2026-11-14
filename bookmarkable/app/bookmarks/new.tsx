import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';

import { useAuth } from '@/components/auth-provider';
import { Button, Heading, MutedText, Page, Panel, TextField } from '@/components/page';
import { createBookmark } from '@/lib/bookmarks';

export default function AddBookmarkScreen() {
  const { session, loading } = useAuth();
  const router = useRouter();
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [urlError, setUrlError] = useState<string | undefined>();

  useEffect(() => {
    if (!loading && !session) {
      router.replace('/login');
    }
  }, [loading, router, session]);

  if (loading || (!session && !loading)) {
    return (
      <Page centered>
        <Panel>
          <Heading>Add Bookmark</Heading>
          <MutedText>Checking access...</MutedText>
        </Panel>
      </Page>
    );
  }

  async function handleCreate() {
    setBusy(true);
    setNotice(null);
    setUrlError(undefined);

    try {
      await createBookmark({ url, description });
      router.replace('/bookmarks');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to create bookmark.';

      if (message.toLowerCase().includes('url')) {
        setUrlError(message);
      } else {
        setNotice(message);
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <Page centered>
      <Panel>
        <Heading>Add Bookmark</Heading>
        <MutedText>Save a URL and a short note so the link is easy to remember later.</MutedText>
        <TextField
          label="URL"
          autoCapitalize="none"
          keyboardType="url"
          autoComplete="url"
          value={url}
          onChangeText={setUrl}
          placeholder="https://example.com"
          errorText={urlError}
        />
        <TextField
          label="Description"
          multiline
          numberOfLines={4}
          value={description}
          onChangeText={setDescription}
          placeholder="What is this link for?"
          style={{ minHeight: 120, textAlignVertical: 'top' }}
        />
        {notice ? <MutedText style={{ color: '#b42318' }}>{notice}</MutedText> : null}
        <Button title="Save bookmark" onPress={handleCreate} busy={busy} />
        <Button title="Back" variant="secondary" onPress={() => router.back()} />
      </Panel>
    </Page>
  );
}
