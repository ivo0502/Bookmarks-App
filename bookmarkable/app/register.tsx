import { useEffect, useState } from 'react';
import { Link, useRouter } from 'expo-router';
import { View } from 'react-native';

import { useAuth } from '@/components/auth-provider';
import { Button, Heading, MutedText, Page, Panel, TextField } from '@/components/page';
import { supabase } from '@/lib/supabase';

export default function RegisterScreen() {
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

  async function handleRegister() {
    setBusy(true);
    setNotice(null);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
      });

      if (error) {
        setNotice(error.message);
        return;
      }

      if (data.session) {
        router.replace('/bookmarks');
        return;
      }

      setNotice('Check your email to confirm your account, then come back and log in.');
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Unable to register.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <Page centered>
      <Panel>
        <Heading>Register</Heading>
        <MutedText>Create a Supabase Auth account to save bookmarks to your own profile.</MutedText>
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
          autoComplete="new-password"
          value={password}
          onChangeText={setPassword}
          placeholder="Create a password"
        />
        {notice ? <MutedText style={{ color: '#b42318' }}>{notice}</MutedText> : null}
        <Button title="Create account" onPress={handleRegister} busy={busy} />
        <View style={{ gap: 10 }}>
          <MutedText>
            Already have an account? <Link href="/login">Login here</Link>.
          </MutedText>
          <MutedText>
            Back to <Link href="/">home</Link>.
          </MutedText>
        </View>
      </Panel>
    </Page>
  );
}
