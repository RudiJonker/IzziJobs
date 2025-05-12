import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hceoednqxvubealrjhkf.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhjZW9lZG5xeHZ1YmVhbHJqaGtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1MzA0ODcsImV4cCI6MjA2MjEwNjQ4N30.0CykB638ty5dSpapFN4Xf-AD_7qYf6ScQvfDxaHH30Y';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});