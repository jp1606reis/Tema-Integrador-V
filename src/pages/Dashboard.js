"use client";

import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

// ── Labels amigáveis ──────────────────────────────────────────
const VIOLATION_LABELS = {
  cyberbullying: 'Cyberbullying',
  harassment:    'Assédio',
  privacy:       'Invasão de Privacidade',
  hate_speech:   'Discurso de Ódio',
  other:         'Outro',
};
const PLATFORM_LABELS = {
  social_media: 'Rede Social',
  messaging:    'Mensagens',
  email:        'Email',
  gaming:       'Jogos',
  other:        'Outro',
};
const SEVERITY_LABELS = {
  low:    'Baixa',
  medium: 'Média',
  high:   'Alta',
};
const AGE_ORDER = ['18-25','26-30','31-38','38-45','46-55','55+'];
const USAGE_TIME_LABELS = {
  morning:   'Manhã (6h-12h)',
  afternoon: 'Tarde (12h-18h)',
  evening:   'Noite (18h-24h)',
  night:     'Madrugada (24h-6h)',
};
const REASON_LABELS = {
  work:          'Trabalho',
  school:        'Escola/Estudos',
  entertainment: 'Entretenimento',
};
const APP_LABELS = {
  messages: 'Mensagens',
  videos:   'Vídeos',
  work:     'Trabalho',
  courses:  'Cursos',
  games:    'Jogos',
};

const COLORS_BLUE   = ['#0066ff','#3385ff','#66a3ff','#99c2ff','#cce0ff','#e5f0ff'];
const COLORS_MULTI  = ['#0066ff','#4caf50','#ff9800','#f44336','#9c27b0','#00bcd4'];
const COLORS_SEV    = ['#4caf50','#ff9800','#f44336'];

// ── Opções base dos gráficos ──────────────────────────────────
const baseOptions = {
  responsive: true,
  plugins: { legend: { position: 'bottom' } },
};
const barOptions = {
  ...baseOptions,
  scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } },
};

// ── Componente de seção vazia ─────────────────────────────────
function EmptyChart({ label }) {
  return (
    <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
      {label}
    </p>
  );
}

// ── Componente de card de gráfico ─────────────────────────────
function ChartCard({ title, full, children }) {
  return (
    <div className={`chart-container${full ? ' full' : ''}`}>
      <h3>{title}</h3>
      {children}
    </div>
  );
}

export default function Dashboard() {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const res = await fetch('/api/dashboard');
        if (!res.ok) throw new Error('Erro ao carregar dashboard.');
        setData(await res.json());
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboard();
  }, []);

  const handleExport = () => {
    if (!data) return;
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url;
    a.download = 'dashboard_dados.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return (
    <div id="dashboard" className="page active">
      <h1>Dashboard - Estatísticas</h1>
      <p className="subtitle">Carregando dados...</p>
    </div>
  );

  if (error) return (
    <div id="dashboard" className="page active">
      <h1>Dashboard - Estatísticas</h1>
      <div className="message error">❌ {error}</div>
    </div>
  );

  const { kpis, charts } = data;

  // ── Dados dos gráficos de DENÚNCIAS ──────────────────────────
  const typeChart = {
    labels: charts.byType.map(d => VIOLATION_LABELS[d.violation_type] ?? d.violation_type),
    datasets: [{ data: charts.byType.map(d => d.total), backgroundColor: COLORS_MULTI, borderWidth: 0 }],
  };
  const severityChart = {
    labels: charts.bySeverity.map(d => SEVERITY_LABELS[d.severity] ?? d.severity),
    datasets: [{ data: charts.bySeverity.map(d => d.total), backgroundColor: COLORS_SEV, borderWidth: 0 }],
  };
  const platformChart = {
    labels: charts.byPlatform.map(d => PLATFORM_LABELS[d.platform] ?? d.platform),
    datasets: [{ label: 'Denúncias', data: charts.byPlatform.map(d => d.total), backgroundColor: '#0066ff', borderRadius: 6 }],
  };

  // ── Dados dos gráficos de QUESTIONÁRIO ───────────────────────
  // Faixa etária — ordena conforme AGE_ORDER
  const ageSorted = AGE_ORDER
    .map(age => ({ age, total: charts.byAge.find(d => d.age_range === age)?.total ?? 0 }))
    .filter(d => d.total > 0);

  const ageChart = {
    labels: ageSorted.map(d => d.age),
    datasets: [{
      label: 'Respondentes',
      data:  ageSorted.map(d => d.total),
      backgroundColor: COLORS_BLUE.slice(0, ageSorted.length),
      borderWidth: 0,
    }],
  };

  // Período de uso
  const usageTimeOrder = ['morning','afternoon','evening','night'];
  const usageTimeSorted = usageTimeOrder
    .map(t => ({ t, total: charts.byUsageTime.find(d => d.internet_usage_time === t)?.total ?? 0 }))
    .filter(d => d.total > 0);

  const usageTimeChart = {
    labels: usageTimeSorted.map(d => USAGE_TIME_LABELS[d.t] ?? d.t),
    datasets: [{
      label: 'Respondentes',
      data:  usageTimeSorted.map(d => d.total),
      backgroundColor: '#0066ff',
      borderRadius: 6,
    }],
  };

  // Razões de uso
  const reasonChart = {
    labels: charts.byUsageReason.map(d => REASON_LABELS[d.reason] ?? d.reason),
    datasets: [{
      label: 'Marcações',
      data:  charts.byUsageReason.map(d => d.total),
      backgroundColor: COLORS_MULTI,
      borderWidth: 0,
    }],
  };

  // Apps favoritos
  const appChart = {
    labels: charts.byFavoriteApp.map(d => APP_LABELS[d.app] ?? d.app),
    datasets: [{
      label: 'Marcações',
      data:  charts.byFavoriteApp.map(d => d.total),
      backgroundColor: COLORS_MULTI,
      borderWidth: 0,
    }],
  };

  const hasReports  = kpis.totalReports > 0;
  const hasSurveys  = kpis.totalSurveys > 0;

  return (
    <div id="dashboard" className="page active">
      <h1>Dashboard - Estatísticas</h1>

      {/* ── KPI Cards ── */}
      <div className="dashboard-grid">
        <div className="kpi-card">
          <h3>Total de Denúncias</h3>
          <p className="kpi-value">{kpis.totalReports}</p>
        </div>
        <div className="kpi-card">
          <h3>Questionários Respondidos</h3>
          <p className="kpi-value">{kpis.totalSurveys}</p>
        </div>
        <div className="kpi-card">
          <h3>Denúncias Críticas</h3>
          <p className="kpi-value">{kpis.criticalReports}</p>
        </div>
      </div>

      {/* ── Seção: Denúncias ── */}
      <h2 style={{ marginTop: '2.5rem', marginBottom: '1rem', color: 'var(--primary)' }}>
        📋 Denúncias Registradas
      </h2>

      {!hasReports ? (
        <div className="message" style={{ background: '#e3f2fd', color: '#1565c0', borderLeft: '4px solid #0066ff', padding: '1rem', borderRadius: '6px', marginBottom: '2rem' }}>
          Ainda não há denúncias registradas. Os gráficos aparecerão após os primeiros envios.
        </div>
      ) : (
        <>
          <div className="charts-grid">
            <ChartCard title="Denúncias por Tipo">
              <Doughnut data={typeChart} options={baseOptions} />
            </ChartCard>
            <ChartCard title="Severidade das Denúncias">
              <Doughnut data={severityChart} options={baseOptions} />
            </ChartCard>
          </div>
          <ChartCard title="Denúncias por Plataforma" full>
            <Bar data={platformChart} options={barOptions} />
          </ChartCard>
        </>
      )}

      {/* ── Seção: Questionário ── */}
      <h2 style={{ marginTop: '2.5rem', marginBottom: '1rem', color: 'var(--primary)' }}>
        📊 Dados do Questionário
      </h2>

      {!hasSurveys ? (
        <div className="message" style={{ background: '#e3f2fd', color: '#1565c0', borderLeft: '4px solid #0066ff', padding: '1rem', borderRadius: '6px', marginBottom: '2rem' }}>
          Ainda não há questionários respondidos. Os gráficos aparecerão após as primeiras respostas.
        </div>
      ) : (
        <>
          <div className="charts-grid">
            <ChartCard title="Faixa Etária dos Respondentes">
              {ageSorted.length > 0
                ? <Bar data={ageChart} options={barOptions} />
                : <EmptyChart label="Sem dados de faixa etária ainda." />}
            </ChartCard>
            <ChartCard title="Período de Uso da Internet">
              {usageTimeSorted.length > 0
                ? <Bar data={usageTimeChart} options={barOptions} />
                : <EmptyChart label="Sem dados de período de uso ainda." />}
            </ChartCard>
          </div>

          <div className="charts-grid">
            <ChartCard title="Por que usam a Internet">
              {charts.byUsageReason.length > 0
                ? <Doughnut data={reasonChart} options={baseOptions} />
                : <EmptyChart label="Sem dados de razões de uso ainda." />}
            </ChartCard>
            <ChartCard title="Aplicativos mais Usados">
              {charts.byFavoriteApp.length > 0
                ? <Doughnut data={appChart} options={baseOptions} />
                : <EmptyChart label="Sem dados de apps ainda." />}
            </ChartCard>
          </div>
        </>
      )}

      <button className="btn btn-secondary" onClick={handleExport} style={{ marginTop: '2rem' }}>
        📥 Exportar Dados (JSON)
      </button>
    </div>
  );
}