'use client';

import { useState } from 'react';
import { TrendingUp } from 'lucide-react';
import axios from 'axios';
import FileUpload from '@/components/FileUpload';
import ProcessingProgress from '@/components/ProcessingProgress';
import ColoredLogs from '@/components/ColoredLogs';
import Dashboard from '@/components/Dashboard';
import PDFExport from '@/components/PDFExport';
import DataCleanup from '@/components/DataCleanup';
import { LogEntry, DashboardData } from '@/types';
import Link from 'next/link';

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('Aguardando arquivo...');
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [useAI, setUseAI] = useState(false);

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setStatus('Arquivo selecionado');
    setLogs([
      {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        level: 'info',
        message: `Arquivo selecionado: ${selectedFile.name}`,
        icon: '📁',
      },
    ]);
  };

  const handleProcess = async () => {
    if (!file) return;

    setIsProcessing(true);
    setProgress(0);
    setStatus('Fazendo upload...');
    setDashboardData(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      setProgress(20);
      setLogs(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          timestamp: new Date().toISOString(),
          level: 'process',
          message: 'Fazendo upload do arquivo...',
          icon: '⬆️',
        },
      ]);

      const uploadResponse = await axios.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setProgress(40);
      setStatus('Processando dados...');
      setLogs(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          timestamp: new Date().toISOString(),
          level: 'success',
          message: 'Upload concluído com sucesso',
          icon: '✅',
        },
        {
          id: (Date.now() + 1).toString(),
          timestamp: new Date().toISOString(),
          level: 'process',
          message: 'Processando dados...',
          icon: '⚙️',
        },
      ]);

      const processResponse = await axios.post('/api/process', {
        fileName: uploadResponse.data.fileName,
        fileData: uploadResponse.data.fileData, // Para Vercel
        filePath: uploadResponse.data.filePath, // Para local
        useAI,
      });

      setProgress(100);
      setStatus('Processamento concluído!');
      setDashboardData(processResponse.data.dashboardData);
      setLogs(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          timestamp: new Date().toISOString(),
          level: 'success',
          message: 'Dashboard gerado com sucesso!',
          icon: '🎉',
        },
      ]);
    } catch (error) {
      console.error('Erro no processamento:', error);
      setStatus('Erro no processamento');
      setLogs([
        ...logs,
        {
          id: Date.now().toString(),
          timestamp: new Date().toISOString(),
          level: 'error',
          message: `Erro: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
          icon: '❌',
        },
      ]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCleanup = () => {
    setFile(null);
    setDashboardData(null);
    setLogs([]);
    setProgress(0);
    setStatus('Dados limpos');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-10 h-10 text-blue-500" />
              <div>
                <h1 className="text-3xl font-bold">Tabsee</h1>
                <p className="text-gray-400 text-sm">Dashboard Automático</p>
              </div>
            </div>
            <Link
              href="/creditos"
              className="text-gray-400 hover:text-white transition-colors text-sm"
            >
              Créditos
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        <section className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">1. Upload de Planilha</h2>
          <FileUpload onFileSelect={handleFileSelect} />
        </section>

        <section className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">2. Opções de Processamento</h2>
          <div className="flex items-center gap-4 mb-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={useAI}
                onChange={(e) => setUseAI(e.target.checked)}
                className="w-4 h-4 rounded bg-gray-700 border-gray-600"
              />
              <span className="text-gray-300">
                Usar IA para otimizar dados (Cohere API)
              </span>
            </label>
          </div>
          <button
            onClick={handleProcess}
            disabled={!file || isProcessing}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white px-6 py-3 rounded-md font-semibold transition-colors"
          >
            {isProcessing ? 'Processando...' : 'Processar Dados'}
          </button>
        </section>

        <section className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Progresso</h2>
          <ProcessingProgress progress={progress} status={status} />
        </section>

        <section className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">
            Logs do Sistema {logs.length > 0 && `(${logs.length})`}
          </h2>
          <ColoredLogs logs={logs} />
        </section>

        {dashboardData && (
          <section className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Dashboard Gerado</h2>
              <div className="flex gap-2">
                <PDFExport />
                <DataCleanup onCleanup={handleCleanup} />
              </div>
            </div>
            <Dashboard data={dashboardData} />
          </section>
        )}
      </main>
    </div>
  );
}