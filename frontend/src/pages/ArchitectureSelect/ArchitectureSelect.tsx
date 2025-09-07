import React from 'react';
import styles from './ArchitectureSelect.module.css';
import { useNavigate } from 'react-router-dom';

const ArchitectureSelect: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Choose Architecture</h2>
      <p className={styles.subtitle}>Select an analysis architecture to continue</p>

      <div className={styles.grid}>
        <button className={styles.card} onClick={() => navigate('/single')}>
          <div className={styles.cardHeader}>
            <span className={styles.badge}>Available</span>
            <h3>Single DB / Single Model</h3>
          </div>
          <p>
            Analyze a single SQL query against one database schema. Submit a query to get a Job ID and poll later.
          </p>
        </button>

        <button className={styles.card} onClick={() => navigate('/database')}>
          <div className={styles.cardHeader}>
            <span className={styles.badge}>Available</span>
            <h3>Database Connection</h3>
          </div>
          <p>Connect to your database and execute SQL queries.</p>
        </button>

        <div className={styles.cardDisabled}>
          <div className={styles.cardHeader}>
            <span className={styles.badgeDisabled}>Coming soon</span>
            <h3>Streaming / Realtime</h3>
          </div>
          <p>Realtime metrics and streaming query analysis.</p>
        </div>
      </div>
    </div>
  );
};

export default ArchitectureSelect;
