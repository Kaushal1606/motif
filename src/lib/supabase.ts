import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rrblrtiowqlendbfqyvz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJyYmxydGlvd3FsZW5kYmZxeXZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcxNDkwMzgsImV4cCI6MjA4MjcyNTAzOH0.-jKL0mi-mdtAj9DnffvD0BObhsjWCTLs4O1gZxgMw40';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
