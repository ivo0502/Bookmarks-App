import { useEffect, useState } from 'react';
import { Link, useRouter } from 'expo-router';
import { View } from 'react-native';

import { useAuth } from '@/components/auth-provider';
import { Button, Heading, MutedText, Page, Panel, TextField } from '@/components/page';
import { supabase } from '@/lib/supabase';

export default function LoginScreen() {
  const { session, loading } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && session) {
      router.replace('/bookmarks');
    }
  }, [loading, router, session]);

  async function handleLogin() {
    setBusy(true);
    setNotice(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });

      if (error) {
        setNotice(error.message);
        return;
      }

      router.replace('/bookmarks');
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Unable to sign in.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <Page centered>
      <Panel>
        <Heading>Login</Heading>
        <MutedText>Use the same email and password you registered with in Supabase.</MutedText>
        <TextField
          label="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          autoComplete="email"
          value={email}
          onChangeText={setEmail}
          placeholder="you@example.com"
        />
        <TextField
          label="Password"
          secureTextEntry
          autoComplete="password"
          value={password}
          onChangeText={setPassword}
          placeholder="••••••••"
        />
        {notice ? <MutedText style={{ color: '#b42318' }}>{notice}</MutedText> : null}
        <Button title="Login" onPress={handleLogin} busy={busy} />
        <View style={{ gap: 10 }}>
          <MutedText>
            Don&apos;t have an account? <Link href="/register">Register here</Link>.
          </MutedText>
          <MutedText>
            Back to <Link href="/">home</Link>.
          </MutedText>
        </View>
      </Panel>
    </Page>
  );
}
