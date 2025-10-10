import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://bcvpepgiidrpvhetbbgq.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJjdnBlcGdpaWRycHZoZXRiYmdxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAxMDA3MzcsImV4cCI6MjA3NTY3NjczN30.XYpG0KVKqiGmXXSrMsqMd3EW9W-CkzWbZbIFvm8Etx0'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)