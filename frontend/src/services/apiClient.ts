import { API_CONFIG, ApiResponse } from '../config/api';
import { mockSubmit, mockGet } from './mockBackend';
import { 
  CreateConnectionRequest, 
  CreateConnectionResponse, 
  ConnectionsListResponse,
  AnalyzeRequest,
  AnalyzeResponse,
  SqlHintsRequest,
  SqlHintsResponse
} from '../types';

const useMock = (import.meta as any).env?.VITE_USE_MOCK_API === 'true';

async function request<T>(path: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);
  try {
    const res = await fetch(`${API_CONFIG.BASE_URL}${path}`, {
      headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
      signal: controller.signal,
      ...options,
    });
    const data = await res.json().catch(() => ({}));
    return data as ApiResponse<T>;
  } finally {
    clearTimeout(timeout);
  }
}

export async function submitSqlJob(sql: string): Promise<string> {
  if (useMock) return mockSubmit(sql);
  try {
    const resp = await request<{ jobId: string }>(API_CONFIG.ENDPOINTS.SUBMIT_JOB, {
      method: 'POST',
      body: JSON.stringify({ sql })
    });
    if (resp?.success && resp.data?.jobId) return resp.data.jobId;
    // fallback to mock
    return mockSubmit(sql);
  } catch {
    return mockSubmit(sql);
  }
}

export async function getJobResult<T = any>(jobId: string): Promise<ApiResponse<T>> {
  if (useMock) return mockGet(jobId) as any;
  try {
    const path = typeof API_CONFIG.ENDPOINTS.GET_JOB === 'function'
      ? API_CONFIG.ENDPOINTS.GET_JOB(jobId)
      : `/jobs/${jobId}`;
    const resp = await request<T>(path, { method: 'GET' });
    if (resp) return resp;
  } catch {}
  return mockGet(jobId) as any;
}

// Новые API методы для работы с подключениями и анализом SQL

/**
 * Создает новое подключение к PostgreSQL
 */
export async function createConnection(connectionData: CreateConnectionRequest): Promise<CreateConnectionResponse> {
  try {
    const resp = await request<CreateConnectionResponse>(API_CONFIG.ENDPOINTS.CONNECTIONS, {
      method: 'POST',
      body: JSON.stringify(connectionData)
    });
    
    // Бэкенд возвращает {id: "..."} напрямую, а не в обертке
    if (resp && 'id' in resp) {
      return resp as CreateConnectionResponse;
    }
    
    // Если ответ в старом формате {success: true, data: {id: "..."}}
    if (resp?.success && resp.data) {
      return resp.data;
    }
    
    throw new Error(resp?.error || 'Failed to create connection');
  } catch (error) {
    throw new Error(`Connection creation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Получает список активных подключений
 */
export async function getConnections(): Promise<ConnectionsListResponse> {
  try {
    const resp = await request<ConnectionsListResponse>(API_CONFIG.ENDPOINTS.CONNECTIONS, {
      method: 'GET'
    });
    if (resp?.success && resp.data) {
      return resp.data;
    }
    throw new Error(resp?.error || 'Failed to get connections');
  } catch (error) {
    throw new Error(`Failed to get connections: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Анализирует SQL запрос в контексте конкретной БД/схемы
 */
export async function analyzeSql(analyzeData: AnalyzeRequest): Promise<AnalyzeResponse> {
  try {
    const resp = await request<AnalyzeResponse>(API_CONFIG.ENDPOINTS.ANALYZE, {
      method: 'POST',
      body: JSON.stringify(analyzeData)
    });
    
    // Бэкенд возвращает ответ напрямую с полями predicted, recommendations и т.д.
    if (resp && 'predicted' in resp) {
      return resp as AnalyzeResponse;
    }
    
    // Если ответ в старом формате {success: true, data: {...}}
    if (resp?.success && resp.data) {
      return resp.data;
    }
    
    throw new Error(resp?.error || 'Failed to analyze SQL');
  } catch (error) {
    throw new Error(`SQL analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Получает умные подсказки для SQL запроса
 */
export async function getSqlHints(hintsData: SqlHintsRequest): Promise<SqlHintsResponse> {
  try {
    const resp = await request<SqlHintsResponse>(API_CONFIG.ENDPOINTS.SQL_HINTS, {
      method: 'POST',
      body: JSON.stringify(hintsData)
    });
    if (resp?.success && resp.data) {
      return resp.data;
    }
    throw new Error(resp?.error || 'Failed to get SQL hints');
  } catch (error) {
    throw new Error(`Failed to get SQL hints: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
