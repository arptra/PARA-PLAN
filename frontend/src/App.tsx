import React from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import ArchitectureSelect from './pages/ArchitectureSelect/ArchitectureSelect';
import SqlAnalyzer from './pages/SqlAnalyzer/SqlAnalyzer';
import DatabaseConnection from './pages/DatabaseConnection/DatabaseConnection';
import styles from './App.module.css';

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const isRoot = location.pathname === '/';

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <div className={styles.headerRow}>
          {!isRoot && (
            <button className={styles.backButton} onClick={() => navigate(-1)}>
              ← Back
            </button>
          )}
          <h1 className={styles.title}>PARA-PLAN Analyzer</h1>
        </div>
        {/* <nav className={styles.nav}>
          <Link to="/" className={styles.navLink}>Architectures</Link>
          <Link to="/single-node" className={styles.navLink}>Single Node</Link>
          <Link to="/database" className={styles.navLink}>Database</Link>
        </nav> */}
      </header>
      
      <main className={styles.main}>
        <Routes>
          <Route path="/" element={<ArchitectureSelect />} />
          <Route path="/single" element={<SqlAnalyzer />} />
          <Route path="/database" element={<DatabaseConnection />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
