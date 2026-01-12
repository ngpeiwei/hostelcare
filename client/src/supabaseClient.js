// gateway to Supabase in React

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

// Check if environment variables are set
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '⚠️ Supabase credentials not found!\n' +
    'Please create a .env file in the client folder with:\n' +
    'REACT_APP_SUPABASE_URL=your_supabase_url\n' +
    'REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key\n\n' +
    'For now, using placeholder values to allow compilation.'
  );
}

// Create client with actual values or placeholders
// Using valid format placeholders to prevent validation errors
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDAwMDAwMDAsImV4cCI6MTk1NTU1NTU1NX0.placeholder'
);
