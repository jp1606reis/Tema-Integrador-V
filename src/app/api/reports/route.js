// src/app/api/reports/route.js
// POST /api/reports → salva uma denúncia anônima
// GET  /api/reports → retorna contagem total (usada pelo Dashboard)

import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabaseClient';

export async function POST(request) {
  try {
    const body = await request.json();
    const { violationType, platform, severity, description } = body;

    // Validações (RN04 / RN06)
    const validTypes = ['cyberbullying', 'harassment', 'privacy', 'hate_speech', 'other'];
    const validPlatforms = ['social_media', 'messaging', 'email', 'gaming', 'other'];
    const validSeverities = ['low', 'medium', 'high'];

    if (!validTypes.includes(violationType)) {
      return NextResponse.json({ error: 'Tipo de violação inválido.' }, { status: 400 });
    }
    if (!validPlatforms.includes(platform)) {
      return NextResponse.json({ error: 'Plataforma inválida.' }, { status: 400 });
    }
    if (!validSeverities.includes(severity)) {
      return NextResponse.json({ error: 'Severidade inválida.' }, { status: 400 });
    }
    if (!description || description.length < 20 || description.length > 2000) {
      return NextResponse.json(
        { error: 'Descrição deve ter entre 20 e 2000 caracteres.' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('reports')
      .insert({ violation_type: violationType, platform, severity, description })
      .select('id')
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, id: data.id }, { status: 201 });
  } catch (err) {
    console.error('[POST /api/reports]', err);
    return NextResponse.json({ error: 'Erro interno ao salvar denúncia.' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const { count, error } = await supabase
      .from('reports')
      .select('*', { count: 'exact', head: true });

    if (error) throw error;

    return NextResponse.json({ total: count ?? 0 });
  } catch (err) {
    console.error('[GET /api/reports]', err);
    return NextResponse.json({ error: 'Erro ao buscar total de denúncias.' }, { status: 500 });
  }
}
