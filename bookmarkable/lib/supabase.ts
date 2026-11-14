import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';

import type { Database } from '@/lib/database.types';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Check EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY.',
  );
}

// Fallback in-memory storage for Expo Go (which doesn't have native AsyncStorage)
const memoryStorage: Record<string, string> = {};

const storage = {
  async getItem(key: string) {
    if (Platform.OS === 'web') {
      return typeof window === 'undefined' ? null : window.localStorage.getItem(key);
    }

    try {
      return await AsyncStorage.getItem(key);
    } catch {
      // Fall back to memory storage in Expo Go where AsyncStorage isn't available
      return memoryStorage[key] ?? null;
    }
  },
  async setItem(key: string, value: string) {
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, value);
      }

      return;
    }

    try {
      await AsyncStorage.setItem(key, value);
    } catch {
      // Fall back to memory storage in Expo Go
      memoryStorage[key] = value;
    }
  },
  async removeItem(key: string) {
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }

      return;
    }

    try {
      await AsyncStorage.removeItem(key);
    } catch {
      // Fall back to memory storage in Expo Go
      delete memoryStorage[key];
    }
  },
};

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
