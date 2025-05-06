import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hceoednqxvubealrjhkf.supabase.co'; // Replace with your Supabase URL
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhjZW9lZG5xeHZ1YmVhbHJqaGtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1MzA0ODcsImV4cCI6MjA2MjEwNjQ4N30.0CykB638ty5dSpapFN4Xf-AD_7qYf6ScQvfDxaHH30Y'; // Replace with your anon key

export const supabase = createClient(supabaseUrl, supabaseAnonKey);