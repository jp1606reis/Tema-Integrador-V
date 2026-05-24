"use client";

// pages/Survey.js — Questionário anônimo integrado ao banco de dados
// Alterações em relação ao original:
//   • handleSubmit agora faz POST real para /api/surveys
//   • Feedback visual de sucesso/erro após envio
//   • Botão desabilitado durante o envio (evita duplo clique)

import React, { useState } from 'react';

export default function Survey() {
  const [formData, setFormData] = useState({
    ageRange: '',
    internetUsageTime: '',
    usageReasons: [],
    favoriteApps: [],
  });

  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [errorMsg, setErrorMsg] = useState('');

  const handleCheckboxChange = (e, field) => {
    const { value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [field]: checked
        ? [...prev[field], value]
        : prev[field].filter((item) => item !== value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    try {
      const response = await fetch('/api/surveys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ageRange: formData.ageRange,
          internetUsageTime: formData.internetUsageTime,
          usageReasons: formData.usageReasons,
          favoriteApps: formData.favoriteApps,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao enviar questionário.');
      }

      setStatus('success');
      // Limpa o formulário após sucesso
      setFormData({ ageRange: '', internetUsageTime: '', usageReasons: [], favoriteApps: [] });
    } catch (err) {
      setStatus('error');
      setErrorMsg(err.message);
    }
  };

  return (
    <div id="survey" className="page active">
      <h1>Questionário Anônimo</h1>
      <p className="subtitle">
        Suas respostas nos ajudam a entender padrões de experiências digitais. Nenhum dado pessoal
        é coletado.
      </p>

      {status === 'success' && (
        <div className="message success">
          ✅ Questionário enviado com sucesso! Obrigado pela participação.
        </div>
      )}

      {status === 'error' && (
        <div className="message error">❌ {errorMsg}</div>
      )}

      <form className="form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Qual é sua faixa etária?</label>
          <select
            required
            value={formData.ageRange}
            onChange={(e) => setFormData({ ...formData, ageRange: e.target.value })}
          >
            <option value="">Selecione...</option>
            <option value="18-25">18-25 anos</option>
            <option value="26-30">26-30 anos</option>
            <option value="31-38">31-38 anos</option>
            <option value="38-45">38-45 anos</option>
            <option value="46-55">46-55 anos</option>
            <option value="55+">Acima de 55 anos</option>
          </select>
        </div>

        <div className="form-group">
          <label>Quando você mais usa a internet?</label>
          <select
            required
            value={formData.internetUsageTime}
            onChange={(e) => setFormData({ ...formData, internetUsageTime: e.target.value })}
          >
            <option value="">Selecione...</option>
            <option value="morning">Manhã (6h-12h)</option>
            <option value="afternoon">Tarde (12h-18h)</option>
            <option value="evening">Noite (18h-24h)</option>
            <option value="night">Madrugada (24h-6h)</option>
          </select>
        </div>

        <div className="form-group">
          <label>Por que você usa a internet? (Selecione todas que se aplicam)</label>
          <div className="checkbox-group">
            {[
              { value: 'work', label: 'Trabalho' },
              { value: 'school', label: 'Escola/Estudos' },
              { value: 'entertainment', label: 'Entretenimento' },
            ].map(({ value, label }) => (
              <label key={value}>
                <input
                  type="checkbox"
                  value={value}
                  checked={formData.usageReasons.includes(value)}
                  onChange={(e) => handleCheckboxChange(e, 'usageReasons')}
                />
                {' '}{label}
              </label>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>Quais aplicativos você mais usa? (Selecione todas que se aplicam)</label>
          <div className="checkbox-group">
            {[
              { value: 'messages', label: 'Mensagens' },
              { value: 'videos', label: 'Vídeos' },
              { value: 'work', label: 'Trabalho' },
              { value: 'courses', label: 'Cursos' },
              { value: 'games', label: 'Jogos' },
            ].map(({ value, label }) => (
              <label key={value}>
                <input
                  type="checkbox"
                  value={value}
                  checked={formData.favoriteApps.includes(value)}
                  onChange={(e) => handleCheckboxChange(e, 'favoriteApps')}
                />
                {' '}{label}
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={status === 'loading'}
        >
          {status === 'loading' ? 'Enviando...' : 'Enviar Questionário'}
        </button>
      </form>
    </div>
  );
}
