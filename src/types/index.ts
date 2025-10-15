// Tipos do sistema Tabsee

export interface ExcelData {
  sheets: Sheet[];
  fileName: string;
  uploadDate: string;
}

export interface Sheet {
  name: string;
  data: Record<string, unknown>[];
  columns: string[];
}

export interface ProcessedData {
  originalData: ExcelData;
  jsonData: string;
  analyzedData?: Record<string, unknown>;
  timestamp: string;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'success' | 'info' | 'process' | 'warning' | 'error';
  message: string;
  icon: string;
}

export interface DashboardData {
  charts: ChartData[];
  summary: SummaryData;
}

export interface ChartData {
  id: string;
  type: 'bar' | 'line' | 'pie' | 'area';
  title: string;
  data: Record<string, unknown>[];
  xKey?: string;
  yKey?: string;
}

export interface SummaryData {
  totalRows: number;
  totalColumns: number;
  sheets: number;
  processedAt: string;
}

export interface UploadResponse {
  success: boolean;
  filePath: string;
  fileName: string;
  message: string;
}

export interface ProcessResponse {
  success: boolean;
  data: ProcessedData;
  dashboardData: DashboardData;
  message: string;
  logs: LogEntry[];
}

export interface CleanupResponse {
  success: boolean;
  deletedFiles: number;
  message: string;
}

export interface CohereRequest {
  data: Record<string, unknown>;
  prompt: string;
}

export interface CohereResponse {
  success: boolean;
  optimizedData: Record<string, unknown>;
  suggestions: string[];
}
