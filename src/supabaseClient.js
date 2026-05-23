import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cejqgpysbvsdpxdrqbpd.supabase.co';
const supabaseAnonKey = 'sb_publishable_lM27u2c8C2DN4c1AR7_bcg_zncvI2-8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);