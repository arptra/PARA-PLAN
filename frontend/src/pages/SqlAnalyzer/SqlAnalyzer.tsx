import React, { useState } from 'react';
import styles from './SqlAnalyzer.module.css';

import { AnalysisResult } from '../../types';

const SqlAnalyzer: React.FC = () => {
  const [sqlQuery, setSqlQuery] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Job flow state
  const [jobId, setJobId] = useState('');
  const [lastIssuedJobId, setLastIssuedJobId] = useState<string | null>(null);
  const [isSubmittingJob, setIsSubmittingJob] = useState(false);
  const [isCheckingJob, setIsCheckingJob] = useState(false);
  const [jobResult, setJobResult] = useState<AnalysisResult | null>(null);

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

  // Submit SQL to get Job ID (mock)
  const handleSubmitJob = async () => {
    if (!sqlQuery.trim()) {
      setError('Please enter a SQL query');
      return;
    }
    setError(null);
    setIsSubmittingJob(true);
    setLastIssuedJobId(null);
    try {
      await new Promise(r => setTimeout(r, 800));
      const mockJobId = 'JOB-' + Math.random().toString(36).slice(2, 8).toUpperCase();
      setLastIssuedJobId(mockJobId);
      setJobId(mockJobId);
    } catch (e) {
      setError('Failed to submit job');
    } finally {
      setIsSubmittingJob(false);
    }
  };

  // Check Job by ID (mock)
  const handleCheckJob = async () => {
    if (!jobId.trim()) {
      setError('Please enter a Job ID');
      return;
    }
    setError(null);
    setIsCheckingJob(true);
    setJobResult(null);
    try {
      await new Promise(r => setTimeout(r, 900));
      const mock: AnalysisResult = {
        query: '-- restored by job ' + jobId,
        analysis: {
          tables: ['users'],
          columns: ['id', 'email', 'status'],
          joins: [],
          whereConditions: ["status = 'active'"],
          orderBy: ['id DESC'],
          groupBy: [],
          estimatedRows: 4200,
          complexity: 'MEDIUM',
          suggestions: ['Consider partial index on status']
        },
        executionTime: 32
      };
      setJobResult(mock);
    } catch (e) {
      setError('Failed to fetch job result');
    } finally {
      setIsCheckingJob(false);
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
        <h2>SQL Analysis</h2>
        <p>Advanced SQL query analysis powered by Discrete Taburetka technology</p>
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
            {isAnalyzing ? 'Analyzing...' : 'Analyze Query (sync mock)'}
          </button>
          <button
            onClick={handleClear}
            className={styles.clearButton}
          >
            Clear
          </button>
        </div>
      </div>

      {/* Job submit/check flow */}
      <div className={styles.inputSection}>
        <div className={styles.textareaContainer}>
          <h3>Async Job Flow</h3>
          <p>Submit SQL to receive a Job ID or enter a Job ID to fetch result.</p>
        </div>
        <div className={styles.buttonGroup}>
          <button
            onClick={handleSubmitJob}
            disabled={isSubmittingJob || !sqlQuery.trim()}
            className={styles.analyzeButton}
          >
            {isSubmittingJob ? 'Submitting…' : 'Submit SQL → Get Job ID'}
          </button>
        </div>
        {lastIssuedJobId && (
          <div className={styles.resultSection}>
            <div className={styles.metrics}>
              <div className={styles.metric}>
                <span className={styles.metricLabel}>Last Job ID:</span>
                <span className={styles.metricValue}><code>{lastIssuedJobId}</code></span>
              </div>
            </div>
          </div>
        )}

        <div className={styles.textareaContainer}>
          <label htmlFor="jobId" className={styles.label}>Job ID:</label>
          <input
            id="jobId"
            value={jobId}
            onChange={(e) => setJobId(e.target.value)}
            placeholder="JOB-XXXXXX"
            className={styles.textarea}
          />
        </div>
        <div className={styles.buttonGroup}>
          <button
            onClick={handleCheckJob}
            disabled={isCheckingJob || !jobId.trim()}
            className={styles.analyzeButton}
          >
            {isCheckingJob ? 'Checking…' : 'Check Job Result'}
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
          <h3>Discrete PARA-PLAN Taburetka Analysis Results</h3>
          
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

      {jobResult && (
        <div className={styles.resultSection}>
          <h3>Job Result</h3>
          <div className={styles.resultGrid}>
            <div className={styles.resultCard}>
              <h4>Query Overview</h4>
              <div className={styles.queryPreview}>
                <code>{jobResult.query}</code>
              </div>
            </div>
            {/* Reuse the same blocks for jobResult */}
            <div className={styles.resultCard}>
              <h4>Tables Involved</h4>
              <ul className={styles.list}>
                {jobResult.analysis.tables.map((table, index) => (
                  <li key={index} className={styles.listItem}>{table}</li>
                ))}
              </ul>
            </div>
            <div className={styles.resultCard}>
              <h4>Performance Metrics</h4>
              <div className={styles.metrics}>
                <div className={styles.metric}>
                  <span className={styles.metricLabel}>Estimated Rows:</span>
                  <span className={styles.metricValue}>{jobResult.analysis.estimatedRows.toLocaleString()}</span>
                </div>
                <div className={styles.metric}>
                  <span className={styles.metricLabel}>Complexity:</span>
                  <span className={`${styles.complexity} ${styles[jobResult.analysis.complexity.toLowerCase()]}`}>
                    {jobResult.analysis.complexity}
                  </span>
                </div>
                {jobResult.executionTime && (
                  <div className={styles.metric}>
                    <span className={styles.metricLabel}>Execution Time:</span>
                    <span className={styles.metricValue}>{jobResult.executionTime}ms</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SqlAnalyzer;
