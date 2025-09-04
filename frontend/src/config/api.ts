export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:8080/api',
  
  TIMEOUT: 30000,
  
  ENDPOINTS: {
    // Анализ SQL запроса
    ANALYZE_SQL: '/sql/analyze',
    
    // Подключение к БД
    CONNECT_DB: '/database/connect',
    DISCONNECT_DB: '/database/disconnect',
    
    // Выполнение запроса на подключенной БД
    EXECUTE_QUERY: '/database/execute',
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
