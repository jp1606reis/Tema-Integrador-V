// src/app/api/dashboard/route.js
// GET /api/dashboard → retorna todos os dados agregados para o Dashboard.js
// Uma única chamada busca tudo para evitar múltiplos requests no front.

import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabaseClient';

export async function GET() {
  try {
    // Executa todas as queries em paralelo para performance
    const [
      totalReportsRes,
      totalSurveysRes,
      criticalReportsRes,
      byTypeRes,
      bySeverityRes,
      byPlatformRes,
    ] = await Promise.all([
      // Total de denúncias
      supabase.from('reports').select('*', { count: 'exact', head: true }),

      // Total de questionários
      supabase.from('surveys').select('*', { count: 'exact', head: true }),

      // Denúncias críticas
      supabase
        .from('reports')
        .select('*', { count: 'exact', head: true })
        .eq('severity', 'high'),

      // Denúncias por tipo
      supabase.from('vw_reports_by_type').select('violation_type, total'),

      // Denúncias por severidade
      supabase.from('vw_reports_by_severity').select('severity, total'),

      // Denúncias por plataforma
      supabase.from('vw_reports_by_platform').select('platform, total'),
    ]);

    // Checa erros individualmente para facilitar debug
    for (const res of [totalReportsRes, totalSurveysRes, criticalReportsRes, byTypeRes, bySeverityRes, byPlatformRes]) {
      if (res.error) throw res.error;
    }

    return NextResponse.json({
      kpis: {
        totalReports: totalReportsRes.count ?? 0,
        totalSurveys: totalSurveysRes.count ?? 0,
        criticalReports: criticalReportsRes.count ?? 0,
      },
      charts: {
        byType: byTypeRes.data ?? [],
        bySeverity: bySeverityRes.data ?? [],
        byPlatform: byPlatformRes.data ?? [],
      },
    });
  } catch (err) {
    console.error('[GET /api/dashboard]', err);
    return NextResponse.json({ error: 'Erro ao carregar dados do dashboard.' }, { status: 500 });
  }
}
