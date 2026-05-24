"use client";

// pages/Dashboard.js — Dashboard integrado ao banco de dados
// Alterações em relação ao original:
//   • Busca dados reais de /api/dashboard ao montar
//   • Renderiza gráficos Chart.js com dados reais
//   • Botão de exportação gera JSON real dos dados

import React, { useEffect, useState, useRef } from 'react';
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

// Labels amigáveis para os valores do banco
const VIOLATION_LABELS = {
  cyberbullying: 'Cyberbullying',
  harassment: 'Assédio',
  privacy: 'Invasão de Privacidade',
  hate_speech: 'Discurso de Ódio',
  other: 'Outro',
};
const PLATFORM_LABELS = {
  social_media: 'Rede Social',
  messaging: 'Mensagens',
  email: 'Email',
  gaming: 'Jogos',
  other: 'Outro',
};
const SEVERITY_LABELS = {
  low: 'Baixa',
  medium: 'Média',
  high: 'Alta',
};

const COLORS = ['#0066ff', '#4caf50', '#ff9800', '#f44336', '#9c27b0', '#00bcd4'];

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const res = await fetch('/api/dashboard');
        if (!res.ok) throw new Error('Erro ao carregar dashboard.');
        const json = await res.json();
        setData(json);
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
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dashboard_dados.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div id="dashboard" className="page active">
        <h1>Dashboard - Estatísticas</h1>
        <p className="subtitle">Carregando dados...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div id="dashboard" className="page active">
        <h1>Dashboard - Estatísticas</h1>
        <div className="message error">❌ {error}</div>
      </div>
    );
  }

  const { kpis, charts } = data;

  // Prepara dados para Chart.js
  const typeChartData = {
    labels: charts.byType.map((d) => VIOLATION_LABELS[d.violation_type] ?? d.violation_type),
    datasets: [{
      data: charts.byType.map((d) => d.total),
      backgroundColor: COLORS,
      borderWidth: 0,
    }],
  };

  const severityChartData = {
    labels: charts.bySeverity.map((d) => SEVERITY_LABELS[d.severity] ?? d.severity),
    datasets: [{
      data: charts.bySeverity.map((d) => d.total),
      backgroundColor: ['#4caf50', '#ff9800', '#f44336'],
      borderWidth: 0,
    }],
  };

  const platformChartData = {
    labels: charts.byPlatform.map((d) => PLATFORM_LABELS[d.platform] ?? d.platform),
    datasets: [{
      label: 'Denúncias',
      data: charts.byPlatform.map((d) => d.total),
      backgroundColor: '#0066ff',
      borderRadius: 6,
    }],
  };

  const chartOptions = {
    responsive: true,
    plugins: { legend: { position: 'bottom' } },
  };

  const barOptions = {
    ...chartOptions,
    scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } },
  };

  return (
    <div id="dashboard" className="page active">
      <h1>Dashboard - Estatísticas</h1>

      {/* KPI Cards */}
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

      {/* Gráficos */}
      {kpis.totalReports === 0 ? (
        <div className="message" style={{ background: '#e3f2fd', color: '#1565c0', borderLeft: '4px solid #0066ff', padding: '1rem', borderRadius: '6px', margin: '2rem 0' }}>
          📊 Ainda não há denúncias registradas. Os gráficos aparecerão após os primeiros envios.
        </div>
      ) : (
        <>
          <div className="charts-grid">
            <div className="chart-container">
              <h3>Denúncias por Tipo</h3>
              <Doughnut data={typeChartData} options={chartOptions} />
            </div>
            <div className="chart-container">
              <h3>Severidade das Denúncias</h3>
              <Doughnut data={severityChartData} options={chartOptions} />
            </div>
          </div>

          <div className="chart-container full">
            <h3>Denúncias por Plataforma</h3>
            <Bar data={platformChartData} options={barOptions} />
          </div>
        </>
      )}

      <button className="btn btn-secondary" onClick={handleExport} style={{ marginTop: '2rem' }}>
        📥 Exportar Dados (JSON)
      </button>
    </div>
  );
}
