"use client";

// pages/Report.js — Denúncia anônima integrada ao banco de dados
// Alterações em relação ao original:
//   • handleSubmit agora faz POST real para /api/reports
//   • Feedback visual de sucesso/erro após envio
//   • Botão desabilitado durante o envio

import React, { useState } from 'react';

export default function Report() {
  const [report, setReport] = useState({
    violationType: '',
    platform: '',
    severity: '',
    description: '',
  });

  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    try {
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          violationType: report.violationType,
          platform: report.platform,
          severity: report.severity,
          description: report.description,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao enviar denúncia.');
      }

      setStatus('success');
      // Limpa o formulário após sucesso
      setReport({ violationType: '', platform: '', severity: '', description: '' });
    } catch (err) {
      setStatus('error');
      setErrorMsg(err.message);
    }
  };

  return (
    <div id="report" className="page active">
      <h1>Denunciar Violação</h1>
      <p className="subtitle">
        Sua denúncia é completamente anônima e confidencial. Seus dados não serão compartilhados.
      </p>

      {status === 'success' && (
        <div className="message success">
          ✅ Denúncia registrada com sucesso. Obrigado por contribuir.
        </div>
      )}

      {status === 'error' && (
        <div className="message error">❌ {errorMsg}</div>
      )}

      <form className="form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Tipo de Violação</label>
          <select
            required
            value={report.violationType}
            onChange={(e) => setReport({ ...report, violationType: e.target.value })}
          >
            <option value="">Selecione...</option>
            <option value="cyberbullying">Cyberbullying</option>
            <option value="harassment">Assédio</option>
            <option value="privacy">Invasão de Privacidade</option>
            <option value="hate_speech">Discurso de Ódio</option>
            <option value="other">Outro</option>
          </select>
        </div>

        <div className="form-group">
          <label>Plataforma</label>
          <select
            required
            value={report.platform}
            onChange={(e) => setReport({ ...report, platform: e.target.value })}
          >
            <option value="">Selecione...</option>
            <option value="social_media">Rede Social</option>
            <option value="messaging">Mensagens</option>
            <option value="email">Email</option>
            <option value="gaming">Jogos</option>
            <option value="other">Outro</option>
          </select>
        </div>

        <div className="form-group">
          <label>Severidade</label>
          <select
            required
            value={report.severity}
            onChange={(e) => setReport({ ...report, severity: e.target.value })}
          >
            <option value="">Selecione...</option>
            <option value="low">Baixa</option>
            <option value="medium">Média</option>
            <option value="high">Alta</option>
          </select>
        </div>

        <div className="form-group">
          <label>Descrição (mínimo 20 caracteres)</label>
          <textarea
            placeholder="Descreva o que aconteceu..."
            minLength={20}
            maxLength={2000}
            required
            value={report.description}
            onChange={(e) => setReport({ ...report, description: e.target.value })}
          />
          <small style={{ color: 'var(--text-light)', fontSize: '0.85rem' }}>
            {report.description.length}/2000 caracteres
          </small>
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={status === 'loading'}
        >
          {status === 'loading' ? 'Enviando...' : 'Enviar Denúncia'}
        </button>
      </form>
    </div>
  );
}
