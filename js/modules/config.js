import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
export const SUPABASE_URL = 'https://rztobiroldtejkuobnwd.supabase.co'
export const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ6dG9iaXJvbGR0ZWprdW9ibndkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2ODE4NjUsImV4cCI6MjA3NzI1Nzg2NX0.k1fytElEnQDwVhomT9Ctqiy7QoeDohDlyY3VaHHnmQc';
export const supabase = createClient(SUPABASE_URL, API_KEY);


