import React, { useState } from 'react';
import styles from './SqlAnalyzer.module.css';

import { AnalysisResult } from '../../types';

const SqlAnalyzer: React.FC = () => {
  const [sqlQuery, setSqlQuery] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!sqlQuery.trim()) {
      setError('Please enter a SQL query');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      // Заглушка для API вызова
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Мок данные для демонстрации
      const mockResult: AnalysisResult = {
        query: sqlQuery,
        analysis: {
          tables: ['users', 'orders', 'products'],
          columns: ['id', 'name', 'email', 'order_date', 'total_amount'],
          joins: ['users.id = orders.user_id', 'orders.product_id = products.id'],
          whereConditions: ['users.status = "active"', 'orders.created_at >= "2024-01-01"'],
          orderBy: ['orders.order_date DESC'],
          groupBy: ['users.id'],
          estimatedRows: 1250,
          complexity: 'MEDIUM',
          suggestions: [
            'Consider adding index on users.status',
            'Use LIMIT clause for large result sets',
            'Consider materializing frequently accessed data'
          ]
        },
        executionTime: 45
      };

      setResult(mockResult);
    } catch (err) {
      setError('Failed to analyze query. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleClear = () => {
    setSqlQuery('');
    setResult(null);
    setError(null);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>SQL Query Analysis</h2>
        <p>Analyze your SQL queries for performance and optimization insights</p>
      </div>

      <div className={styles.inputSection}>
        <div className={styles.textareaContainer}>
          <label htmlFor="sqlQuery" className={styles.label}>
            SQL Query:
          </label>
          <textarea
            id="sqlQuery"
            value={sqlQuery}
            onChange={(e) => setSqlQuery(e.target.value)}
            placeholder="Enter your SQL query here..."
            className={styles.textarea}
            rows={8}
          />
        </div>

        <div className={styles.buttonGroup}>
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing || !sqlQuery.trim()}
            className={styles.analyzeButton}
          >
            {isAnalyzing ? 'Analyzing...' : 'Analyze Query'}
          </button>
          <button
            onClick={handleClear}
            className={styles.clearButton}
          >
            Clear
          </button>
        </div>
      </div>

      {error && (
        <div className={styles.error}>
          <p>{error}</p>
        </div>
      )}

      {result && (
        <div className={styles.resultSection}>
          <h3>Analysis Results</h3>
          
          <div className={styles.resultGrid}>
            <div className={styles.resultCard}>
              <h4>Query Overview</h4>
              <div className={styles.queryPreview}>
                <code>{result.query}</code>
              </div>
            </div>

            <div className={styles.resultCard}>
              <h4>Tables Involved</h4>
              <ul className={styles.list}>
                {result.analysis.tables.map((table, index) => (
                  <li key={index} className={styles.listItem}>{table}</li>
                ))}
              </ul>
            </div>

            <div className={styles.resultCard}>
              <h4>Columns Selected</h4>
              <ul className={styles.list}>
                {result.analysis.columns.map((column, index) => (
                  <li key={index} className={styles.listItem}>{column}</li>
                ))}
              </ul>
            </div>

            <div className={styles.resultCard}>
              <h4>Joins</h4>
              <ul className={styles.list}>
                {result.analysis.joins.map((join, index) => (
                  <li key={index} className={styles.listItem}>{join}</li>
                ))}
              </ul>
            </div>

            <div className={styles.resultCard}>
              <h4>Where Conditions</h4>
              <ul className={styles.list}>
                {result.analysis.whereConditions.map((condition, index) => (
                  <li key={index} className={styles.listItem}>{condition}</li>
                ))}
              </ul>
            </div>

            <div className={styles.resultCard}>
              <h4>Performance Metrics</h4>
              <div className={styles.metrics}>
                <div className={styles.metric}>
                  <span className={styles.metricLabel}>Estimated Rows:</span>
                  <span className={styles.metricValue}>{result.analysis.estimatedRows.toLocaleString()}</span>
                </div>
                <div className={styles.metric}>
                  <span className={styles.metricLabel}>Complexity:</span>
                  <span className={`${styles.complexity} ${styles[result.analysis.complexity.toLowerCase()]}`}>
                    {result.analysis.complexity}
                  </span>
                </div>
                {result.executionTime && (
                  <div className={styles.metric}>
                    <span className={styles.metricLabel}>Execution Time:</span>
                    <span className={styles.metricValue}>{result.executionTime}ms</span>
                  </div>
                )}
              </div>
            </div>

            <div className={styles.resultCard}>
              <h4>Optimization Suggestions</h4>
              <ul className={styles.list}>
                {result.analysis.suggestions.map((suggestion, index) => (
                  <li key={index} className={styles.listItem}>{suggestion}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SqlAnalyzer;
