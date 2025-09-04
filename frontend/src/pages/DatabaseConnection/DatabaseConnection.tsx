import React, { useState } from 'react';
import styles from './DatabaseConnection.module.css';

import { DatabaseConfig, QueryResult } from '../../types';

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
  
  const [sqlQuery, setSqlQuery] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [queryResult, setQueryResult] = useState<QueryResult | null>(null);
  const [queryError, setQueryError] = useState<string | null>(null);

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
      // Заглушка для API вызова подключения
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Мок успешного подключения
      setIsConnected(true);
      setConnectionError(null);
    } catch (err) {
      setConnectionError('Failed to connect to database. Please check your credentials.');
      setIsConnected(false);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setQueryResult(null);
    setQueryError(null);
    setSqlQuery('');
  };

  const handleExecuteQuery = async () => {
    if (!sqlQuery.trim()) {
      setQueryError('Please enter a SQL query');
      return;
    }

    setIsExecuting(true);
    setQueryError(null);
    setQueryResult(null);

    try {
      // Заглушка для API вызова выполнения запроса
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Мок результат запроса
      const mockResult: QueryResult = {
        columns: ['id', 'name', 'email', 'created_at'],
        rows: [
          [1, 'John Doe', 'john@example.com', '2024-01-15'],
          [2, 'Jane Smith', 'jane@example.com', '2024-01-16'],
          [3, 'Bob Johnson', 'bob@example.com', '2024-01-17'],
          [4, 'Alice Brown', 'alice@example.com', '2024-01-18'],
          [5, 'Charlie Wilson', 'charlie@example.com', '2024-01-19']
        ],
        rowCount: 5,
        executionTime: 23
      };

      setQueryResult(mockResult);
    } catch (err) {
      setQueryError('Failed to execute query. Please try again.');
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
        <p>Connect to your database and execute SQL queries</p>
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
                >
                  <option value="postgresql">PostgreSQL</option>
                  <option value="mysql">MySQL</option>
                  <option value="sqlserver">SQL Server</option>
                  <option value="oracle">Oracle</option>
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
                  placeholder="localhost"
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
                  placeholder={dbConfig.type === 'postgresql' ? '5432' : dbConfig.type === 'mysql' ? '3306' : '1433'}
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
                  placeholder="mydatabase"
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
                  placeholder="username"
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
                  placeholder="password"
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
              <h3>Query Results</h3>
              
              <div className={styles.resultInfo}>
                <span>Rows: {queryResult.rowCount}</span>
                <span>Execution Time: {queryResult.executionTime}ms</span>
              </div>

              <div className={styles.tableContainer}>
                <table className={styles.resultTable}>
                  <thead>
                    <tr>
                      {queryResult.columns.map((column, index) => (
                        <th key={index} className={styles.tableHeader}>{column}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {queryResult.rows.map((row, rowIndex) => (
                      <tr key={rowIndex} className={styles.tableRow}>
                        {row.map((cell, cellIndex) => (
                          <td key={cellIndex} className={styles.tableCell}>{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DatabaseConnection;
