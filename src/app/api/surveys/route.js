// src/app/api/surveys/route.js
// POST /api/surveys  → salva um questionário anônimo
// GET  /api/surveys  → retorna contagem total (usada pelo Dashboard)

import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabaseClient';

export async function POST(request) {
  try {
    const body = await request.json();
    const { ageRange, internetUsageTime, usageReasons, favoriteApps } = body;

    // Validações básicas (RN02 / RN06)
    const validAgeRanges = ['18-25', '26-30', '31-38', '38-45', '46-55', '55+'];
    const validTimes = ['morning', 'afternoon', 'evening', 'night'];

    if (!validAgeRanges.includes(ageRange)) {
      return NextResponse.json({ error: 'Faixa etária inválida.' }, { status: 400 });
    }
    if (!validTimes.includes(internetUsageTime)) {
      return NextResponse.json({ error: 'Período de uso inválido.' }, { status: 400 });
    }

    // 1. Insere o survey principal
    const { data: survey, error: surveyError } = await supabase
      .from('surveys')
      .insert({ age_range: ageRange, internet_usage_time: internetUsageTime })
      .select('id')
      .single();

    if (surveyError) throw surveyError;

    // 2. Insere razões de uso (múltipla escolha) — RN05
    if (Array.isArray(usageReasons) && usageReasons.length > 0) {
      const reasonRows = usageReasons.map((reason) => ({
        survey_id: survey.id,
        reason,
      }));
      const { error: reasonError } = await supabase
        .from('survey_usage_reasons')
        .insert(reasonRows);
      if (reasonError) throw reasonError;
    }

    // 3. Insere apps favoritos (múltipla escolha) — RN05
    if (Array.isArray(favoriteApps) && favoriteApps.length > 0) {
      const appRows = favoriteApps.map((app) => ({
        survey_id: survey.id,
        app,
      }));
      const { error: appError } = await supabase
        .from('survey_favorite_apps')
        .insert(appRows);
      if (appError) throw appError;
    }

    return NextResponse.json({ success: true, id: survey.id }, { status: 201 });
  } catch (err) {
    console.error('[POST /api/surveys]', err);
    return NextResponse.json({ error: 'Erro interno ao salvar questionário.' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const { count, error } = await supabase
      .from('surveys')
      .select('*', { count: 'exact', head: true });

    if (error) throw error;

    return NextResponse.json({ total: count ?? 0 });
  } catch (err) {
    console.error('[GET /api/surveys]', err);
    return NextResponse.json({ error: 'Erro ao buscar total de questionários.' }, { status: 500 });
  }
}
