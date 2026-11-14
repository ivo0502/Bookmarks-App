import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, View, useWindowDimensions } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';

import { useAuth } from '@/components/auth-provider';
import { BodyText, Button, Heading, MutedText, Page, Panel, Subheading } from '@/components/page';
import { listBookmarks } from '@/lib/bookmarks';
import type { Bookmark } from '@/lib/database.types';

function formatDate(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

export default function BookmarksScreen() {
  const { session, loading, signOut } = useAuth();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !session) {
      router.replace('/login');
    }
  }, [loading, router, session]);

  const loadBookmarks = useCallback(async () => {
    setBusy(true);
    setError(null);

    try {
      const items = await listBookmarks();
      setBookmarks(items);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Unable to load bookmarks.');
    } finally {
      setBusy(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (session) {
        loadBookmarks();
      }
    }, [loadBookmarks, session]),
  );

  if (loading || (!session && !loading)) {
    return (
      <Page centered>
        <Panel>
          <Heading>Bookmarks</Heading>
          <MutedText>Checking your session...</MutedText>
        </Panel>
      </Page>
    );
  }

  const cardBasis = width >= 1200 ? '31%' : width >= 900 ? '48%' : '100%';

  async function handleSignOut() {
    await signOut();
    router.replace('/');
  }

  return (
    <Page contentStyle={{ gap: 18 }}>
      <Panel>
        <Heading>Bookmarks</Heading>
        <BodyText>
          Track useful URLs and short descriptions in one place. Use the action cards to view,
          edit, or delete entries.
        </BodyText>
        <View style={{ flexDirection: width >= 700 ? 'row' : 'column', gap: 12 }}>
          <Button title="Add bookmark" onPress={() => router.push('/bookmarks/new')} />
          <Button title="Sign out" variant="secondary" onPress={handleSignOut} />
        </View>
        <MutedText>
          Signed in as {session?.user.email ?? 'your account'}
        </MutedText>
      </Panel>

      {busy ? (
        <Panel>
          <ActivityIndicator />
          <MutedText>Loading your bookmarks...</MutedText>
        </Panel>
      ) : error ? (
        <Panel>
          <Subheading>Could not load bookmarks</Subheading>
          <MutedText>{error}</MutedText>
          <Button title="Try again" onPress={loadBookmarks} />
        </Panel>
      ) : bookmarks.length === 0 ? (
        <Panel>
          <Subheading>No bookmarks yet</Subheading>
          <MutedText>Add your first saved link to get started.</MutedText>
          <Button title="Add bookmark" onPress={() => router.push('/bookmarks/new')} />
        </Panel>
      ) : (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
          {bookmarks.map((bookmark) => (
            <View key={bookmark.id} style={{ flexBasis: cardBasis, flexGrow: 1 }}>
              <Panel style={{ height: '100%' }}>
                <MutedText numberOfLines={1}>{bookmark.url}</MutedText>
                <Subheading numberOfLines={2}>{bookmark.description || 'Untitled bookmark'}</Subheading>
                <MutedText>Created {formatDate(bookmark.created_at)}</MutedText>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                  <Button title="View" variant="secondary" onPress={() => router.push(`/bookmarks/${bookmark.id}`)} />
                  <Button title="Edit" variant="ghost" onPress={() => router.push(`/bookmarks/${bookmark.id}/edit`)} />
                  <Button title="Delete" variant="danger" onPress={() => router.push(`/bookmarks/${bookmark.id}/delete`)} />
                </View>
              </Panel>
            </View>
          ))}
        </View>
      )}
    </Page>
  );
}
