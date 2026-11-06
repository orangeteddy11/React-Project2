import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ehjwoeyzdesrideiwilt.supabase.co';
const supabaseAnonKey = 'sb_publishable_yeO1mc2RYO7LwFKBS89GVA_N7Lw6_jp';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);