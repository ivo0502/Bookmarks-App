import { useEffect } from 'react';
import { Link, useRouter } from 'expo-router';
import { useColorScheme, View } from 'react-native';

import { useAuth } from '@/components/auth-provider';
import { BodyText, Button, Heading, MutedText, Page, Panel, Subheading } from '@/components/page';

export default function HomeScreen() {
  const { session, loading } = useAuth();
  const router = useRouter();
  const scheme = useColorScheme() ?? 'light';

  useEffect(() => {
    if (!loading && session) {
      router.replace('/bookmarks');
    }
  }, [loading, router, session]);

  if (loading) {
    return (
      <Page centered>
        <Panel>
          <Heading>Bookmarkable</Heading>
          <MutedText>Loading your session...</MutedText>
        </Panel>
      </Page>
    );
  }

  return (
    <Page centered>
      <Panel>
        <MutedText>{scheme === 'dark' ? 'A sharper reading list for the night shift' : 'A focused home for your saved links'}</MutedText>
        <Heading>Bookmarkable</Heading>
        <BodyText>
          Keep bookmark URLs and descriptions in sync with Supabase Auth. Sign in to manage your
          collection from mobile or desktop web.
        </BodyText>
        <View style={{ gap: 12 }}>
          <Button title="Go to bookmarks" onPress={() => router.push('/bookmarks')} />
          <Button title="Login" variant="secondary" onPress={() => router.push('/login')} />
          <Button title="Register" variant="ghost" onPress={() => router.push('/register')} />
        </View>
        <MutedText>
          New here? <Link href="/register">Create an account</Link> or <Link href="/login">sign in</Link> to continue.
        </MutedText>
      </Panel>
      <Panel>
        <Subheading>What this app does</Subheading>
        <BodyText>• Login and register with Supabase Auth.</BodyText>
        <BodyText>• Add, view, edit, and delete bookmarks in a user-scoped table.</BodyText>
        <BodyText>• Adapt to narrow phones and wide desktop web layouts.</BodyText>
      </Panel>
    </Page>
  );
}
