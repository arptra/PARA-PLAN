import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import SqlAnalyzer from './pages/SqlAnalyzer/SqlAnalyzer';
import DatabaseConnection from './pages/DatabaseConnection/DatabaseConnection';
import styles from './App.module.css';

function App() {
  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1 className={styles.title}>SQL Query Analyzer</h1>
        <nav className={styles.nav}>
          <Link to="/" className={styles.navLink}>SQL Analysis</Link>
          <Link to="/database" className={styles.navLink}>Database Connection</Link>
        </nav>
      </header>
      
      <main className={styles.main}>
        <Routes>
          <Route path="/" element={<SqlAnalyzer />} />
          <Route path="/database" element={<DatabaseConnection />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
