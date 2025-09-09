export const API_CONFIG = {
  BASE_URL: (import.meta as any).env?.VITE_API_URL || '',
  
  TIMEOUT: 30000,
  
  ENDPOINTS: {
    // Управление подключениями к БД
    CONNECTIONS: '/connections',
    
    // Анализ SQL запроса
    ANALYZE: '/api/analyze',
    
    // SQL подсказки
    SQL_HINTS: '/api/sql-hints',
    

    ANALYZE_SQL: '/api/sql/analyze',
    CONNECT_DB: '/api/database/connect',
    DISCONNECT_DB: '/api/database/disconnect',
    EXECUTE_QUERY: '/api/database/execute',
    SUBMIT_JOB: '/api/jobs/submit',
    GET_JOB: (jobId: string) => `/api/jobs/${jobId}`,
  }
};

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp?: string;
}
