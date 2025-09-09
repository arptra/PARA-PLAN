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

// Типы для нового API анализа SQL
export interface AnalyzeRequest {
  connectionId: string;
  schema: string;
  sql: string;
}

export interface AnalyzeResponse {
  predicted: {
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

// Типы для SQL подсказок
export interface SqlHintsRequest {
  connectionId: string;
  schema: string;
  sql: string;
}

export interface SqlHintsResponse {
  hints: {
    tables: string[];
    columns: string[];
    functions: string[];
    keywords: string[];
    suggestions: string[];
  };
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

// Типы для создания подключения к БД (новый API)
export interface CreateConnectionRequest {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
  info?: string;
}

export interface CreateConnectionResponse {
  id: string;
}

// Типы для списка подключений
export interface Connection {
  id: string;
  host: string;
  port: number;
  database: string;
  user: string;
  info?: string;
  status: 'active' | 'inactive' | 'error';
  createdAt: string;
}

export interface ConnectionsListResponse {
  connections: Connection[];
}

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

