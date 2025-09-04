// Типы для анализа SQL запросов
export interface AnalysisResult {
  query: string;
  analysis: {
    tables: string[];
    columns: string[];
    joins: string[];
    whereConditions: string[];
    orderBy: string[];
    groupBy: string[];
    estimatedRows: number;
    complexity: 'LOW' | 'MEDIUM' | 'HIGH';
    suggestions: string[];
  };
  executionTime?: number;
}

// Типы для подключения к БД
export interface DatabaseConfig {
  host: string;
  port: string;
  database: string;
  username: string;
  password: string;
  type: DatabaseType;
}

export type DatabaseType = 'postgresql' | 'mysql' | 'sqlserver' | 'oracle';

// Типы для результатов запросов
export interface QueryResult {
  columns: string[];
  rows: any[][];
  rowCount: number;
  executionTime: number;
  error?: string;
}

// Типы для API ответов
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Типы для состояния подключения
export interface ConnectionStatus {
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  databaseInfo?: {
    type: DatabaseType;
    host: string;
    port: string;
    database: string;
  };
}

// Типы для состояния запросов
export interface QueryStatus {
  isExecuting: boolean;
  lastQuery?: string;
  error: string | null;
}

