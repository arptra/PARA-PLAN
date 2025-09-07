import { AnalysisResult } from '../types';

type JobStatus = 'PENDING' | 'COMPLETED';

interface StoredJob {
  id: string;
  sql: string;
  status: JobStatus;
  attempts: number;
  createdAt: string;
  completedAt?: string;
}

const STORE_KEY = 'para_plan_mock_jobs_store_v1';

function loadStore(): Record<string, StoredJob> {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveStore(store: Record<string, StoredJob>) {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(store));
  } catch {}
}

function generateJobId(sql: string): string {
  const seed = btoa(unescape(encodeURIComponent(sql))).slice(0, 6).toUpperCase();
  return `JOB-${seed}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

export function mockSubmit(sql: string): string {
  const jobs = loadStore();
  const id = generateJobId(sql);
  jobs[id] = {
    id,
    sql,
    status: 'PENDING',
    attempts: 0,
    createdAt: new Date().toISOString(),
  };
  saveStore(jobs);
  return id;
}

export function mockGet(jobId: string): { success: boolean; data?: AnalysisResult & { jobId: string; status: JobStatus }; error?: string } {
  const jobs = loadStore();
  const job = jobs[jobId];
  if (!job) {
    return { success: false, error: 'Job not found' };
  }
  // Simulate processing: first check => PENDING, next => COMPLETED
  if (job.status === 'PENDING') {
    job.attempts += 1;
    if (job.attempts >= 1) {
      job.status = 'COMPLETED';
      job.completedAt = new Date().toISOString();
      jobs[jobId] = job;
      saveStore(jobs);
    } else {
      jobs[jobId] = job;
      saveStore(jobs);
      return { success: true, data: { jobId, query: job.sql, analysis: pendingAnalysis(job.sql), executionTime: 0, status: 'PENDING' } as any };
    }
  }
  return { success: true, data: { jobId, query: job.sql, analysis: completedAnalysis(job.sql), executionTime: 37, status: 'COMPLETED' } as any };
}

function extractTables(sql: string): string[] {
  const m = sql.match(/from\s+([\w.]+)/i);
  return m ? [m[1]] : ['unknown_table'];
}

function pendingAnalysis(sql: string) {
  return {
    tables: extractTables(sql),
    columns: [],
    joins: [],
    whereConditions: [],
    orderBy: [],
    groupBy: [],
    estimatedRows: 0,
    complexity: 'LOW' as const,
    suggestions: ['Job is being processed...']
  };
}

function completedAnalysis(sql: string) {
  const tables = extractTables(sql);
  return {
    tables,
    columns: ['id', 'created_at'],
    joins: [],
    whereConditions: ["status = 'active'"],
    orderBy: ['id DESC'],
    groupBy: [],
    estimatedRows: 1234,
    complexity: 'MEDIUM' as const,
    suggestions: ['Consider index on status', 'Avoid SELECT *']
  };
}
