import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { useAuth } from '@/components/auth-provider';
import { Button, Heading, MutedText, Page, Panel, Subheading } from '@/components/page';
import { deleteBookmark, getBookmark } from '@/lib/bookmarks';
import type { Bookmark } from '@/lib/database.types';

export default function DeleteBookmarkScreen() {
  const { session, loading } = useAuth();
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const [bookmark, setBookmark] = useState<Bookmark | null>(null);
  const [busy, setBusy] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

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

  async function handleDelete() {
    if (!bookmark) {
      return;
    }

    setDeleting(true);
    setNotice(null);

    try {
      await deleteBookmark(bookmark.id);
      router.replace('/bookmarks');
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Unable to delete bookmark.');
    } finally {
      setDeleting(false);
    }
  }

  if (loading || (!session && !loading)) {
    return (
      <Page centered>
        <Panel>
          <Heading>Delete Bookmark</Heading>
          <MutedText>Checking access...</MutedText>
        </Panel>
      </Page>
    );
  }

  return (
    <Page centered>
      <Panel>
        <Heading>Delete Bookmark</Heading>
        {busy ? (
          <MutedText>Loading bookmark...</MutedText>
        ) : notice ? (
          <MutedText style={{ color: '#b42318' }}>{notice}</MutedText>
        ) : bookmark ? (
          <View style={{ gap: 14 }}>
            <Subheading>{bookmark.description || 'Untitled bookmark'}</Subheading>
            <MutedText>{bookmark.url}</MutedText>
            <MutedText>This action cannot be undone.</MutedText>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
              <Button title="Delete bookmark" variant="danger" onPress={handleDelete} busy={deleting} />
              <Button title="Cancel" variant="secondary" onPress={() => router.back()} />
            </View>
          </View>
        ) : null}
      </Panel>
    </Page>
  );
}
