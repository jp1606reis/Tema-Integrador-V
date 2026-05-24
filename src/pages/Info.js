"use client";

import React from 'react';

export default function Info() {
  return (
    <div id="info" className="page active">
      <h1>Direitos Digitais & ODS 16</h1>
      
      <section className="info-section">
        <h2>🔐 O que são Direitos Digitais?</h2>
        <p>Direitos digitais são extensões dos direitos humanos no ambiente digital. Incluem:</p>
        <ul>
          <li><strong>Privacidade:</strong> Controle sobre seus dados pessoais</li>
          <li><strong>Liberdade de Expressão:</strong> Direito de se comunicar online</li>
          <li><strong>Segurança:</strong> Proteção contra violações e crimes digitais</li>
          <li><strong>Acesso à Informação:</strong> Direito de acessar conteúdo público</li>
        </ul>
      </section>

      <section className="info-section">
        <h2>⚠️ Tipos de Violações Digitais</h2>
        <div className="violation-types">
          <div className="violation-card">
            <h3>Cyberbullying</h3>
            <p>Assédio, ameaças ou humilhação através de plataformas digitais.</p>
          </div>
          <div className="violation-card">
            <h3>Assédio Sexual</h3>
            <p>Comportamentos sexuais não consentidos online.</p>
          </div>
          <div className="violation-card">
            <h3>Invasão de Privacidade</h3>
            <p>Acesso não autorizado a dados pessoais ou contas.</p>
          </div>
          <div className="violation-card">
            <h3>Discurso de Ódio</h3>
            <p>Conteúdo que incita violência contra grupos específicos.</p>
          </div>
        </div>
      </section>

      <section className="info-section">
        <h2>📞 Como Denunciar?</h2>
        <p><strong>Se você sofreu uma violação digital:</strong></p>
        <ol>
          <li>Documente a violação (screenshots, URLs)</li>
          <li>Reporte na plataforma onde ocorreu</li>
          <li>Denuncie às autoridades competentes</li>
          <li>Procure apoio psicológico se necessário</li>
        </ol>
      </section>

      <section className="info-section">
        <h2>⚖️ Recursos de Apoio Jurídico</h2>
        <ul>
          <li><strong>Ministério Público:</strong> Denuncie crimes digitais</li>
          <li><strong>Polícia Federal:</strong> Crimes cibernéticos graves</li>
          <li><strong>IDEC:</strong> Instituto Brasileiro de Defesa do Consumidor</li>
          <li><strong>Safernet:</strong> Organização contra crimes na internet</li>
        </ul>
      </section>

      <section className="info-section">
        <h2>💬 Recursos de Apoio Psicológico</h2>
        <ul>
          <li><strong>CVV (Centro de Valorização da Vida):</strong> 188 - Prevenção ao suicídio</li>
          <li><strong>Disque Denúncia:</strong> 100 - Violações de direitos humanos</li>
          <li><strong>Psicólogos Especializados:</strong> Busque por trauma digital</li>
        </ul>
      </section>

      <section className="info-section">
        <h2>🎯 ODS 16 - Paz, Justiça e Instituições Eficazes</h2>
        <p>Esta plataforma contribui para as metas:</p>
        <ul>
          <li><strong>Meta 16.3:</strong> Promover o Estado de Direito e acesso igualitário à justiça</li>
          <li><strong>Meta 16.10:</strong> Garantir acesso público à informação e proteção de liberdades fundamentais</li>
          <li><strong>Meta 16.b:</strong> Promover e implementar políticas não discriminatórias</li>
        </ul>
      </section>
    </div>
  );
}