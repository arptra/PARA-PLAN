import React, { useEffect, useRef, useState } from 'react';
import styles from './SqlAnalyzer.module.css';

import { AnalysisResult } from '../../types';
import { submitSqlJob, getJobResult } from '../../services/apiClient';

const LAST_JOB_KEY = 'para_plan_last_job_id';

const SqlAnalyzer: React.FC = () => {
  const [sqlQuery, setSqlQuery] = useState('');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Job flow state
  const [jobId, setJobId] = useState('');
  const [lastIssuedJobId, setLastIssuedJobId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPolling, setIsPolling] = useState(false);
  const [jobResult, setJobResult] = useState<AnalysisResult | null>(null);
  const pollTimer = useRef<number | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(LAST_JOB_KEY);
    if (saved) {
      setLastIssuedJobId(saved);
      setJobId(saved);
    }
  }, []);

  useEffect(() => {
    if (lastIssuedJobId) localStorage.setItem(LAST_JOB_KEY, lastIssuedJobId);
  }, [lastIssuedJobId]);

  useEffect(() => {
    return () => {
      if (pollTimer.current) window.clearTimeout(pollTimer.current);
    };
  }, []);

  const startPolling = (id: string) => {
    if (pollTimer.current) window.clearTimeout(pollTimer.current);
    setIsPolling(true);
    const tick = async () => {
      const resp = await getJobResult<AnalysisResult>(id);
      if (resp.success && resp.data) {
        // If backend provides status, we could branch on it. Mock may not include it strictly typed.
        setJobResult(resp.data);
        setIsPolling(false);
      } else {
        // keep polling if pending
        pollTimer.current = window.setTimeout(tick, 1200);
      }
    };
    pollTimer.current = window.setTimeout(tick, 800);
  };

  const handleStartAnalysis = async () => {
    if (!sqlQuery.trim()) {
      setError('Please enter a SQL query');
      return;
    }
    setError(null);
    setResult(null);
    setJobResult(null);
    setIsSubmitting(true);
    try {
      const id = await submitSqlJob(sqlQuery);
      setLastIssuedJobId(id);
      setJobId(id);
      startPolling(id);
    } catch (e) {
      setError('Failed to submit analysis job');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResumeByJobId = async () => {
    if (!jobId.trim()) {
      setError('Please enter a Job ID');
      return;
    }
    setError(null);
    setJobResult(null);
    setLastIssuedJobId(jobId);
    startPolling(jobId);
  };

  const handleCopyJobId = async () => {
    if (!lastIssuedJobId) return;
    try {
      await navigator.clipboard.writeText(lastIssuedJobId);
    } catch {}
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
        <p>Submit query to run analysis in background. You'll get a Job ID to resume anytime.</p>
      </div>

      {lastIssuedJobId && (
        <div className={styles.jobBanner}>
          <div className={styles.jobBannerRow}>
            <span className={styles.jobLabel}>Job ID</span>
            <code className={styles.jobCode}>{lastIssuedJobId}</code>
            <button className={styles.copyButton} onClick={handleCopyJobId}>Copy</button>
          </div>
          <div className={styles.jobHint}>{isPolling ? 'Waiting for result…' : 'Use this ID to resume later.'}</div>
        </div>
      )}

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
            onClick={handleStartAnalysis}
            disabled={isSubmitting || !sqlQuery.trim()}
            className={styles.analyzeButton}
          >
            {isSubmitting ? 'Submitting…' : 'Start Analysis (async)'}
          </button>
          <button
            onClick={handleClear}
            className={styles.clearButton}
          >
            Clear
          </button>
        </div>
      </div>

      <div className={styles.inputSection}>
        <div className={styles.textareaContainer}>
          <h3>Resume by Job ID</h3>
          <p>Enter an existing Job ID to fetch the current status/result.</p>
        </div>
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
            onClick={handleResumeByJobId}
            disabled={!jobId.trim()}
            className={styles.analyzeButton}
          >
            {isPolling ? 'Checking…' : 'Fetch Result'}
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
