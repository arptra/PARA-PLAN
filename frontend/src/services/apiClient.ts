import { API_CONFIG, ApiResponse } from '../config/api';
import { mockSubmit, mockGet } from './mockBackend';

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
