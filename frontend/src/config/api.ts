export const API_CONFIG = {
  BASE_URL: (import.meta as any).env?.VITE_API_URL || 'http://localhost:8080/api',
  
  TIMEOUT: 30000,
  
  ENDPOINTS: {
    // Анализ SQL запроса
    ANALYZE_SQL: '/sql/analyze',
    
    // Подключение к БД
    CONNECT_DB: '/database/connect',
    DISCONNECT_DB: '/database/disconnect',
    
    // Выполнение запроса на подключенной БД
    EXECUTE_QUERY: '/database/execute',

    // Джобы
    SUBMIT_JOB: '/jobs/submit',
    GET_JOB: (jobId: string) => `/jobs/${jobId}`,
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
