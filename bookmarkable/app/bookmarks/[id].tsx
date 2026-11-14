import { useEffect, useState } from 'react';
import { ActivityIndicator, Linking, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { useAuth } from '@/components/auth-provider';
import { BodyText, Button, Heading, MutedText, Page, Panel, Subheading } from '@/components/page';
import { getBookmark, normalizeBookmarkUrl } from '@/lib/bookmarks';
import type { Bookmark } from '@/lib/database.types';

function formatDate(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

export default function ViewBookmarkScreen() {
  const { session, loading } = useAuth();
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const [bookmark, setBookmark] = useState<Bookmark | null>(null);
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !session) {
      router.replace('/login');
    }
  }, [loading, router, session]);

  useEffect(() => {
    const id = params.id;

    if (!id) {
      setError('Missing bookmark id.');
      setBusy(false);
      return;
    }

    let active = true;

    async function load() {
      setBusy(true);
      setError(null);

      try {
        const item = await getBookmark(id);

        if (active) {
          setBookmark(item);
        }
      } catch (loadError) {
        if (active) {
          setError(loadError instanceof Error ? loadError.message : 'Unable to load bookmark.');
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

  async function handleOpen() {
    if (!bookmark) {
      return;
    }

    await Linking.openURL(normalizeBookmarkUrl(bookmark.url));
  }

  if (loading || (!session && !loading)) {
    return (
      <Page centered>
        <Panel>
          <Heading>View Bookmark</Heading>
          <MutedText>Checking access...</MutedText>
        </Panel>
      </Page>
    );
  }

  return (
    <Page centered>
      <Panel>
        <Heading>View Bookmark</Heading>
        {busy ? (
          <View style={{ alignItems: 'center', gap: 12 }}>
            <ActivityIndicator />
            <MutedText>Loading bookmark...</MutedText>
          </View>
        ) : error ? (
          <View style={{ gap: 12 }}>
            <Subheading>Bookmark not available</Subheading>
            <MutedText>{error}</MutedText>
            <Button title="Back to bookmarks" onPress={() => router.replace('/bookmarks')} />
          </View>
        ) : bookmark ? (
          <View style={{ gap: 16 }}>
            <Subheading numberOfLines={2}>{bookmark.description || 'Untitled bookmark'}</Subheading>
            <BodyText>{bookmark.url}</BodyText>
            <MutedText>Created {formatDate(bookmark.created_at)}</MutedText>
            <MutedText>Updated {formatDate(bookmark.updated_at)}</MutedText>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
              <Button title="Open bookmark" onPress={handleOpen} />
              <Button title="Edit" variant="secondary" onPress={() => router.push(`/bookmarks/${bookmark.id}/edit`)} />
              <Button title="Delete" variant="danger" onPress={() => router.push(`/bookmarks/${bookmark.id}/delete`)} />
            </View>
          </View>
        ) : null}
      </Panel>
    </Page>
  );
}
