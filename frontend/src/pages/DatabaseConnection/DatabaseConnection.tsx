import React, { useState } from 'react';
import styles from './DatabaseConnection.module.css';

import { DatabaseConfig, QueryResult, AnalyzeResponse } from '../../types';
import { createConnection, analyzeSql } from '../../services/apiClient';

const DatabaseConnection: React.FC = () => {
  const [dbConfig, setDbConfig] = useState<DatabaseConfig>({
    host: '',
    port: '',
    database: '',
    username: '',
    password: '',
    type: 'postgresql'
  });
  
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [connectionId, setConnectionId] = useState<string | null>(null);
  
  const [sqlQuery, setSqlQuery] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [queryResult, setQueryResult] = useState<QueryResult | null>(null);
  const [queryError, setQueryError] = useState<string | null>(null);
  // Детальный анализ (для модалки/трея)
  const [analysisDetails, setAnalysisDetails] = useState<AnalyzeResponse | null>(null);
  const [isAnalysisOpen, setIsAnalysisOpen] = useState(false);

  const handleConfigChange = (field: keyof DatabaseConfig, value: string) => {
    setDbConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleConnect = async () => {
    if (!dbConfig.host || !dbConfig.port || !dbConfig.database || !dbConfig.username || !dbConfig.password) {
      setConnectionError('Please fill in all database connection fields');
      return;
    }

    setIsConnecting(true);
    setConnectionError(null);

    try {
      // Создаем подключение через API
      // Для Docker контейнеров используем host.docker.internal вместо localhost
      const host = dbConfig.host === 'localhost' ? 'host.docker.internal' : dbConfig.host;
      
      const result = await createConnection({
        host: host,
        port: parseInt(dbConfig.port),
        database: dbConfig.database,
        user: dbConfig.username,
        password: dbConfig.password,
        info: `PostgreSQL connection`
      });
      
      // Сохраняем ID подключения
      setConnectionId(result.id);
      setIsConnected(true);
      setConnectionError(null);
    } catch (err) {
      setConnectionError(err instanceof Error ? err.message : 'Failed to connect to database. Please check your credentials.');
      setIsConnected(false);
      setConnectionId(null);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setConnectionId(null);
    setQueryResult(null);
    setQueryError(null);
    setSqlQuery('');
  };

  const handleExecuteQuery = async () => {
    if (!sqlQuery.trim()) {
      setQueryError('Please enter a SQL query');
      return;
    }

    if (!connectionId) {
      setQueryError('No connection ID available. Please reconnect to database.');
      return;
    }

    setIsExecuting(true);
    setQueryError(null);
    setQueryResult(null);

    try {
      // Анализируем SQL запрос через API
      const result = await analyzeSql({
        connectionId: connectionId,
        schema: "public",
        sql: sqlQuery
      });

      // Преобразуем результат анализа в формат QueryResult
      const queryResult: QueryResult = {
        columns: result.predicted.columns || [],
        rows: [], // Анализ не возвращает данные, только метаданные
        rowCount: result.predicted.planRows || 0,
        executionTime: result.predicted.p50ms || 0
      };

      setQueryResult(queryResult);
      setAnalysisDetails(result);
      setIsAnalysisOpen(true);
    } catch (err) {
      setQueryError(err instanceof Error ? err.message : 'Failed to analyze SQL query.');
    } finally {
      setIsExecuting(false);
    }
  };

  const handleClearQuery = () => {
    setSqlQuery('');
    setQueryResult(null);
    setQueryError(null);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Database Connection</h2>
        <p>Connect to your database and execute SQL queries with Discrete Taburetka technology</p>
      </div>

      {!isConnected ? (
        <div className={styles.connectionSection}>
          <h3>Database Configuration</h3>
          
          <div className={styles.configForm}>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="dbType" className={styles.label}>
                  Database Type:
                </label>
                <select
                  id="dbType"
                  value={dbConfig.type}
                  onChange={(e) => handleConfigChange('type', e.target.value)}
                  className={styles.select}
                  disabled
                >
                  <option value="postgresql">PostgreSQL</option>
                </select>
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="host" className={styles.label}>
                  Host:
                </label>
                <input
                  type="text"
                  id="host"
                  value={dbConfig.host}
                  onChange={(e) => handleConfigChange('host', e.target.value)}
                  placeholder="host.docker.internal"
                  className={styles.input}
                />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="port" className={styles.label}>
                  Port:
                </label>
                <input
                  type="text"
                  id="port"
                  value={dbConfig.port}
                  onChange={(e) => handleConfigChange('port', e.target.value)}
                  placeholder="5401"
                  className={styles.input}
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="database" className={styles.label}>
                  Database Name:
                </label>
                <input
                  type="text"
                  id="database"
                  value={dbConfig.database}
                  onChange={(e) => handleConfigChange('database', e.target.value)}
                  placeholder="demo"
                  className={styles.input}
                />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="username" className={styles.label}>
                  Username:
                </label>
                <input
                  type="text"
                  id="username"
                  value={dbConfig.username}
                  onChange={(e) => handleConfigChange('username', e.target.value)}
                  placeholder="paraplan"
                  className={styles.input}
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="password" className={styles.label}>
                  Password:
                </label>
                <input
                  type="password"
                  id="password"
                  value={dbConfig.password}
                  onChange={(e) => handleConfigChange('password', e.target.value)}
                  placeholder="paraplan"
                  className={styles.input}
                />
              </div>
            </div>

            <div className={styles.buttonContainer}>
              <button
                onClick={handleConnect}
                disabled={isConnecting}
                className={styles.connectButton}
              >
                {isConnecting ? 'Connecting...' : 'Connect to Database'}
              </button>
            </div>
            {analysisDetails && !isAnalysisOpen && (
              <button
                className={styles.executeButton}
                onClick={() => setIsAnalysisOpen(true)}
                title="Открыть полный анализ"
              >
                долбич сука
              </button>
            )}
          </div>

          {connectionError && (
            <div className={styles.error}>
              <p>{connectionError}</p>
            </div>
          )}
        </div>
      ) : (
        <div className={styles.querySection}>
          <div className={styles.connectionStatus}>
            <div className={styles.statusIndicator}>
              <span className={styles.statusDot}></span>
              Connected to {dbConfig.type}://{dbConfig.host}:{dbConfig.port}/{dbConfig.database}
              {connectionId && <span className={styles.connectionId}> (ID: {connectionId})</span>}
            </div>
            <button onClick={handleDisconnect} className={styles.disconnectButton}>
              Disconnect
            </button>
          </div>

          <div className={styles.queryInput}>
            <label htmlFor="sqlQuery" className={styles.label}>
              SQL Query:
            </label>
            <textarea
              id="sqlQuery"
              value={sqlQuery}
              onChange={(e) => setSqlQuery(e.target.value)}
              placeholder="SELECT * FROM users WHERE status = 'active'"
              className={styles.textarea}
              rows={6}
            />
            
            <div className={styles.queryButtons}>
              <button
                onClick={handleExecuteQuery}
                disabled={isExecuting || !sqlQuery.trim()}
                className={styles.executeButton}
              >
                {isExecuting ? 'Executing...' : 'Execute Query'}
              </button>
              <button onClick={handleClearQuery} className={styles.clearButton}>
                Clear
              </button>
            </div>
          </div>

          {queryError && (
            <div className={styles.error}>
              <p>{queryError}</p>
            </div>
          )}

          {queryResult && (
            <div className={styles.resultSection}>
              <h3>Discrete PARA-PLAN Taburetka Query Results</h3>
              
              <div className={styles.resultInfo}>
                <span>Estimated Rows: {queryResult.rowCount}</span>
                <span>Execution Time: {queryResult.executionTime}ms</span>
              </div>

              <div className={styles.analysisContainer}>
                <h4>Detected Columns:</h4>
                <div className={styles.columnsList}>
                  {queryResult.columns.length > 0 ? (
                    queryResult.columns.map((column, index) => (
                      <span key={index} className={styles.columnTag}>{column}</span>
                    ))
                  ) : (
                    <span className={styles.noColumns}>No columns detected</span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      {/* Модалка с полным анализом */}
      {analysisDetails && isAnalysisOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsAnalysisOpen(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Полный анализ SQL</h3>
              <button className={styles.modalClose} onClick={() => setIsAnalysisOpen(false)}>×</button>
            </div>
            <div className={styles.modalBody}>
              {Array.isArray(analysisDetails.advice) && analysisDetails.advice.length > 0 && (
                <section className={styles.section}>
                  <h4>Советы</h4>
                  <ul className={styles.list}>
                    {analysisDetails.advice.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </section>
              )}

              {analysisDetails.distribution && (
                <section className={styles.section}>
                  <h4>Распределение времени</h4>
                  <div className={styles.kvRow}>
                    <div>p50</div><div>{analysisDetails.distribution.p50ms} ms</div>
                    <div>p95</div><div>{analysisDetails.distribution.p95ms} ms</div>
                    <div>p99</div><div>{analysisDetails.distribution.p99ms} ms</div>
                  </div>
                </section>
              )}

              {analysisDetails.predicted && (
                <section className={styles.section}>
                  <h4>Прогноз</h4>
                  <div className={styles.kvRow}>
                    <div>p50</div><div>{analysisDetails.predicted.p50ms} ms</div>
                    <div>p95</div><div>{analysisDetails.predicted.p95ms} ms</div>
                    <div>Temp Spill Risk</div><div>{analysisDetails.predicted.tempSpillRisk}</div>
                    <div>IO Risk</div><div>{analysisDetails.predicted.ioRisk}</div>
                  </div>
                </section>
              )}

              {analysisDetails.features && (
                <section className={styles.section}>
                  <h4>Особенности плана</h4>
                  <div className={styles.kvRow}>
                    <div>Total cost</div><div>{analysisDetails.features.totalCost}</div>
                    <div>Plan rows</div><div>{analysisDetails.features.planRows}</div>
                    <div>Depth</div><div>{analysisDetails.features.depth}</div>
                    <div>Seq scans</div><div>{analysisDetails.features.seqScans}</div>
                  </div>
                </section>
              )}

              {analysisDetails.locks && (
                <section className={styles.section}>
                  <h4>Блокировки</h4>
                  <div className={styles.kvRow}>
                    <div>Level</div><div>{analysisDetails.locks.level}</div>
                    <div>Estimated</div><div>{analysisDetails.locks.estimatedMs} ms</div>
                  </div>
                </section>
              )}

              {Array.isArray(analysisDetails.recommendations) && analysisDetails.recommendations.length > 0 && (
                <section className={styles.section}>
                  <h4>Рекомендации</h4>
                  <ul className={styles.list}>
                    {analysisDetails.recommendations.map((r, i) => (
                      <li key={i}><strong>{r.kind}</strong>: {r.title}</li>
                    ))}
                  </ul>
                </section>
              )}

              {analysisDetails.serverFit && (
                <section className={styles.section}>
                  <h4>Ресурсы сервера</h4>
                  <div className={styles.kvRow}>
                    <div>work_mem</div><div>{analysisDetails.serverFit.workMem}</div>
                    <div>shared_buffers</div><div>{analysisDetails.serverFit.sharedBuffers}</div>
                    <div>effective_cache_size</div><div>{analysisDetails.serverFit.effectiveCacheSize}</div>
                  </div>
                </section>
              )}

            </div>
            <div className={styles.modalFooter}>
              <button className={styles.secondaryButton} onClick={() => setIsAnalysisOpen(false)}>Свернуть в трей</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DatabaseConnection;