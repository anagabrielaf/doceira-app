import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ilrurnlyaqhmozwaiujq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlscnVybmx5YXFobW96d2FpdWpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkxMTc4NDksImV4cCI6MjA5NDY5Mzg0OX0.sDEoQKvw51a8QQBPOAvyLJdB4c489wYDNARPaBrbDMI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});