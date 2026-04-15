import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ehtrhfmtdrtccrqnglnu.supabase.co'
const supabaseAnonKey = 'sb_publishable__ozokn4q6BgckcXvIL1X4w_d6zpUL9T'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)