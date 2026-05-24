// src/app/api/dashboard/route.js
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET() {
  try {
    const [
      totalReportsRes,
      totalSurveysRes,
      criticalReportsRes,
      byTypeRes,
      bySeverityRes,
      byPlatformRes,
      byAgeRes,
      byUsageTimeRes,
      byUsageReasonRes,
      byFavoriteAppRes,
    ] = await Promise.all([
      supabase.from('reports').select('*', { count: 'exact', head: true }),
      supabase.from('surveys').select('*', { count: 'exact', head: true }),
      supabase.from('reports').select('*', { count: 'exact', head: true }).eq('severity', 'high'),

      // Denúncias
      supabase.from('vw_reports_by_type').select('violation_type, total'),
      supabase.from('vw_reports_by_severity').select('severity, total'),
      supabase.from('vw_reports_by_platform').select('platform, total'),

      // Questionários — faixa etária
      supabase
        .from('surveys')
        .select('age_range')
        .then(({ data, error }) => {
          if (error) return { data: null, error };
          const counts = {};
          (data || []).forEach(({ age_range }) => {
            counts[age_range] = (counts[age_range] || 0) + 1;
          });
          return {
            data: Object.entries(counts).map(([age_range, total]) => ({ age_range, total })),
            error: null,
          };
        }),

      // Questionários — período de uso
      supabase
        .from('surveys')
        .select('internet_usage_time')
        .then(({ data, error }) => {
          if (error) return { data: null, error };
          const counts = {};
          (data || []).forEach(({ internet_usage_time }) => {
            counts[internet_usage_time] = (counts[internet_usage_time] || 0) + 1;
          });
          return {
            data: Object.entries(counts).map(([internet_usage_time, total]) => ({ internet_usage_time, total })),
            error: null,
          };
        }),

      // Questionários — razões de uso
      supabase
        .from('survey_usage_reasons')
        .select('reason')
        .then(({ data, error }) => {
          if (error) return { data: null, error };
          const counts = {};
          (data || []).forEach(({ reason }) => {
            counts[reason] = (counts[reason] || 0) + 1;
          });
          return {
            data: Object.entries(counts).map(([reason, total]) => ({ reason, total })),
            error: null,
          };
        }),

      // Questionários — apps favoritos
      supabase
        .from('survey_favorite_apps')
        .select('app')
        .then(({ data, error }) => {
          if (error) return { data: null, error };
          const counts = {};
          (data || []).forEach(({ app }) => {
            counts[app] = (counts[app] || 0) + 1;
          });
          return {
            data: Object.entries(counts).map(([app, total]) => ({ app, total })),
            error: null,
          };
        }),
    ]);

    for (const res of [totalReportsRes, totalSurveysRes, criticalReportsRes, byTypeRes, bySeverityRes, byPlatformRes]) {
      if (res.error) throw res.error;
    }

    return NextResponse.json({
      kpis: {
        totalReports:    totalReportsRes.count    ?? 0,
        totalSurveys:    totalSurveysRes.count    ?? 0,
        criticalReports: criticalReportsRes.count ?? 0,
      },
      charts: {
        // Denúncias
        byType:     byTypeRes.data     ?? [],
        bySeverity: bySeverityRes.data ?? [],
        byPlatform: byPlatformRes.data ?? [],
        // Questionários
        byAge:          byAgeRes.data          ?? [],
        byUsageTime:    byUsageTimeRes.data     ?? [],
        byUsageReason:  byUsageReasonRes.data   ?? [],
        byFavoriteApp:  byFavoriteAppRes.data   ?? [],
      },
    });
  } catch (err) {
    console.error('[GET /api/dashboard]', err);
    return NextResponse.json({ error: 'Erro ao carregar dados do dashboard.' }, { status: 500 });
  }
}