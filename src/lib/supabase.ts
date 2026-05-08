import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://afalkyqzvzqusqepyvem.supabase.co/rest/v1/';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFmYWxreXF6dnpxdXNxZXB5dmVtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgyMDkyOTUsImV4cCI6MjA5Mzc4NTI5NX0.l5JjPv4PvE3bEoB0Bx8twBN_K4rSXknBsYaujS-Bt58';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
