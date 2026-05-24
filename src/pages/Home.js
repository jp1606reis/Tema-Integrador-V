"use client";

import React from 'react';

export default function Home({ setPage }) {
  return (
    <div id="home" className="page active">
      <section className="hero">
        <h1>Protegendo Seus Direitos Digitais</h1>
        <p>Uma plataforma para conscientização, denúncia anônima e monitoramento de violações digitais, alinhada com os objetivos de desenvolvimento sustentável da ONU.</p>
        <div className="cta-buttons">
          <button className="btn btn-primary" onClick={() => setPage('survey')}>Participar da Pesquisa</button>
          <button className="btn btn-secondary" onClick={() => setPage('info')}>Conhecer Direitos</button>
        </div>
      </section>

      <section className="features">
        <h2>Como Funciona</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📋</div>
            <h3>Questionário Anônimo</h3>
            <p>Responda perguntas sobre sua experiência digital. Seus dados são completamente anônimos.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🚨</div>
            <h3>Denuncie Violações</h3>
            <p>Reporte cyberbullying, assédio e outras violações de forma anônima e segura.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Dashboard em Tempo Real</h3>
            <p>Visualize estatísticas agregadas e indicadores de proteção de direitos.</p>
          </div>
        </div>
      </section>

      <section className="ods-section">
        <h2>Alinhado com ODS 16 da ONU</h2>
        <p><strong>Meta 16: Paz, Justiça e Instituições Eficazes</strong></p>
        <p>Promovemos o Estado de Direito, acesso à informação e políticas não discriminatórias para proteger direitos digitais.</p>
      </section>
    </div>
  );
}