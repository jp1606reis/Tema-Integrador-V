"use client";

import React from 'react';

export default function Navbar({ currentPage, setPage }) {
  const navItems = [
    { id: 'home', label: 'Início' },
    { id: 'survey', label: 'Questionário' },
    { id: 'info', label: 'Saiba Mais' },
    { id: 'report', label: 'Reportar' },
    { id: 'dashboard', label: 'Dashboard' }
  ];

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-brand">
          <h1>🛡️ Direitos Digitais</h1>
        </div>
        <ul className="nav-links">
          {navItems.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className={currentPage === item.id ? 'active' : ''}
                onClick={(e) => {
                  e.preventDefault();
                  setPage(item.id);
                }}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}