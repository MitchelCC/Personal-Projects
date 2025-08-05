
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dybmkrpdujbxmpuvpmra.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR5Ym1rcnBkdWpieG1wdXZwbXJhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyOTkyNTksImV4cCI6MjA2NTg3NTI1OX0.yh31KSGITzG2Xo4xNjXRkC-i1MwrkIRrMLkODdKt79g';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
