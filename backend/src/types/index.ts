import { Request } from 'express';

export interface ConversionOptions {
  fileCount?: number;
  totalPages?: number;
  pageCount?: number;
  angle?: number;
  watermarkText?: string;
  opacity?: number;
  position?: string;
  startNumber?: number;
  [key: string]: unknown;
}

export interface ConversionResult {
  success: boolean;
  downloadUrl?: string;
  filename?: string;
  files?: { downloadUrl: string; filename: string; size: number }[];
  pageCount?: number;
  size?: number;
  originalSize?: number;
  compressedSize?: number;
  compressionRatio?: string;
  angle?: number;
  processingTime: number;
  conversionId: string;
}

export interface StatsResponse {
  success: boolean;
  totalConversions: number;
  completedConversions: number;
  failedConversions: number;
  successRate: string | number;
  totalDataProcessed: number;
  toolStats: unknown[];
}

export interface FileInputData {
  originalName: string;
  storedName: string;
  mimeType: string;
  size: number;
  filePath: string;
}

export interface CompletionData {
  outputFilename: string;
  outputSize: number;
  originalSize?: number;
  pageCount?: number;
  compressionRatio?: number;
}
