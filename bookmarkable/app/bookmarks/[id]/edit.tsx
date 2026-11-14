import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { useAuth } from '@/components/auth-provider';
import { Button, Heading, MutedText, Page, Panel, TextField } from '@/components/page';
import { getBookmark, updateBookmark } from '@/lib/bookmarks';
import type { Bookmark } from '@/lib/database.types';

export default function EditBookmarkScreen() {
  const { session, loading } = useAuth();
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const [bookmark, setBookmark] = useState<Bookmark | null>(null);
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [busy, setBusy] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [urlError, setUrlError] = useState<string | undefined>();

  useEffect(() => {
    if (!loading && !session) {
      router.replace('/login');
    }
  }, [loading, router, session]);

  useEffect(() => {
    const id = params.id;

    if (!id) {
      setNotice('Missing bookmark id.');
      setBusy(false);
      return;
    }

    let active = true;

    async function load() {
      setBusy(true);

      try {
        const item = await getBookmark(id);

        if (active) {
          setBookmark(item);
          setUrl(item.url);
          setDescription(item.description);
        }
      } catch (loadError) {
        if (active) {
          setNotice(loadError instanceof Error ? loadError.message : 'Unable to load bookmark.');
        }
      } finally {
        if (active) {
          setBusy(false);
        }
      }
    }

    load();

    return () => {
      active = false;
    };
  }, [params.id]);

  async function handleSave() {
    if (!bookmark) {
      return;
    }

    setSaving(true);
    setNotice(null);
    setUrlError(undefined);

    try {
      await updateBookmark(bookmark.id, { url, description });
      router.replace(`/bookmarks/${bookmark.id}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to update bookmark.';

      if (message.toLowerCase().includes('url')) {
        setUrlError(message);
      } else {
        setNotice(message);
      }
    } finally {
      setSaving(false);
    }
  }

  if (loading || (!session && !loading)) {
    return (
      <Page centered>
        <Panel>
          <Heading>Edit Bookmark</Heading>
          <MutedText>Checking access...</MutedText>
        </Panel>
      </Page>
    );
  }

  return (
    <Page centered>
      <Panel>
        <Heading>Edit Bookmark</Heading>
        <MutedText>Change the URL or description and save the updated version.</MutedText>
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
        <Button title="Save changes" onPress={handleSave} busy={saving || busy} />
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
          <Button title="Back" variant="secondary" onPress={() => router.back()} />
          <Button title="Delete" variant="danger" onPress={() => router.push(`/bookmarks/${params.id}/delete`)} />
        </View>
      </Panel>
    </Page>
  );
}
