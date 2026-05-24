"use client";

import React, { useState } from 'react';
import Navbar from '@/components/Navbar.js';
import Footer from '@/components/Footer.js';
import Home from '@/pages/Home.js';
import Survey from '@/pages/Survey.js';
import Info from '@/pages/Info.js';
import Report from '@/pages/Report.js';
import Dashboard from '@/pages/Dashboard.js';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home setPage={setCurrentPage} />;
      case 'survey':
        return <Survey />;
      case 'info':
        return <Info />;
      case 'report':
        return <Report />;
      case 'dashboard':
        return <Dashboard />;
      default:
        return <Home setPage={setCurrentPage} />;
    }
  };

  return (
    <div className="app-wrapper">
      <Navbar currentPage={currentPage} setPage={setCurrentPage} />
      <main className="container">
        {renderPage()}
      </main>
      <Footer />
    </div>
  );
}

export default App;