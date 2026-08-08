import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_KEY as string

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Variáveis de ambiente do Supabase ausentes. ' +
    'Crie um arquivo .env na pasta natacao-unaerp/ (use .env.example como modelo) ' +
    'com VITE_SUPABASE_URL e VITE_SUPABASE_KEY e reinicie o npm run dev.'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
