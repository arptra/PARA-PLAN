import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import ArchitectureSelect from './pages/ArchitectureSelect/ArchitectureSelect';
import SqlAnalyzer from './pages/SqlAnalyzer/SqlAnalyzer';
import styles from './App.module.css';
import DatabaseConnection from './pages/DatabaseConnection/DatabaseConnection';

function App() {
  return (
    <div className={styles.app}>
      {/* <header className={styles.header}>
        <h1 className={styles.title}>PARA-PLAN Analyzer</h1>
        <nav className={styles.nav}>
          <Link to="/" className={styles.navLink}>Architectures</Link>
          <Link to="/single-node" className={styles.navLink}>Single Node</Link>
        </nav>
      </header> */}
      
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
