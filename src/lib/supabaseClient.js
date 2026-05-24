// src/lib/supabaseClient.js
// Cliente Supabase — usado em TODAS as API Routes
// As variáveis de ambiente são lidas do .env.local (local) ou
// das Environment Variables da Vercel (produção).

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // chave privada — nunca exposta ao browser

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'Variáveis NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY não configuradas.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey);
