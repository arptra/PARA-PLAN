import React, { useState } from 'react';
import styles from './SingleNode.module.css';

const SingleNode: React.FC = () => {
  const [sql, setSql] = useState('');
  const [jobId, setJobId] = useState('');
  const [lastIssuedJobId, setLastIssuedJobId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmitSql = async () => {
    if (!sql.trim()) {
      setError('Enter SQL to submit');
      return;
    }
    setError(null);
    setIsSubmitting(true);
    setResult(null);
    try {
      // mock network
      await new Promise(r => setTimeout(r, 800));
      const mockJobId = 'JOB-' + Math.random().toString(36).slice(2, 8).toUpperCase();
      setLastIssuedJobId(mockJobId);
      setJobId(mockJobId);
    } catch (e) {
      setError('Failed to submit SQL');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCheckJob = async () => {
    if (!jobId.trim()) {
      setError('Enter a Job ID to check');
      return;
    }
    setError(null);
    setIsChecking(true);
    setResult(null);
    try {
      // mock polling result
      await new Promise(r => setTimeout(r, 900));
      setResult({
        jobId,
        status: 'COMPLETED',
        analysis: {
          tables: ['users'],
          estimatedRows: 4200,
          complexity: 'MEDIUM',
        },
        completedAt: new Date().toISOString(),
      });
    } catch (e) {
      setError('Failed to fetch job result');
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Single DB / Single Model</h2>
        <p>Submit SQL to get a Job ID or check an existing Job ID</p>
      </div>

      <div className={styles.grid}>
        <section className={styles.card}>
          <h3>1) Submit SQL</h3>
          <textarea
            className={styles.textarea}
            rows={8}
            placeholder="SELECT * FROM users WHERE status = 'active'"
            value={sql}
            onChange={(e) => setSql(e.target.value)}
          />
          <button
            className={styles.primary}
            onClick={handleSubmitSql}
            disabled={isSubmitting || !sql.trim()}
          >
            {isSubmitting ? 'Submitting…' : 'Submit SQL'}
          </button>
          {lastIssuedJobId && (
            <div className={styles.info}>
              Last Job ID: <code>{lastIssuedJobId}</code>
            </div>
          )}
        </section>

        <section className={styles.card}>
          <h3>2) Check Job Result</h3>
          <input
            className={styles.input}
            placeholder="Enter Job ID"
            value={jobId}
            onChange={(e) => setJobId(e.target.value)}
          />
          <button
            className={styles.secondary}
            onClick={handleCheckJob}
            disabled={isChecking || !jobId.trim()}
          >
            {isChecking ? 'Checking…' : 'Check Status'}
          </button>

          {error && <div className={styles.error}>{error}</div>}

          {result && (
            <div className={styles.result}>
              <div className={styles.kv}><span>Job ID:</span><code>{result.jobId}</code></div>
              <div className={styles.kv}><span>Status:</span><strong>{result.status}</strong></div>
              <div className={styles.kv}><span>Tables:</span><span>{result.analysis.tables.join(', ')}</span></div>
              <div className={styles.kv}><span>Estimated Rows:</span><span>{result.analysis.estimatedRows}</span></div>
              <div className={styles.kv}><span>Complexity:</span><span>{result.analysis.complexity}</span></div>
              <div className={styles.kv}><span>Completed:</span><span>{new Date(result.completedAt).toLocaleString()}</span></div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default SingleNode;
