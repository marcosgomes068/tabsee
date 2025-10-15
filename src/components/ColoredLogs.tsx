'use client';

import { LogEntry } from '@/types';
import { useEffect, useRef } from 'react';

interface ColoredLogsProps {
  logs: LogEntry[];
}

const getLogColor = (level: LogEntry['level']) => {
  switch (level) {
    case 'success':
      return 'text-green-400';
    case 'info':
      return 'text-blue-400';
    case 'process':
      return 'text-purple-400';
    case 'warning':
      return 'text-yellow-400';
    case 'error':
      return 'text-red-400';
    default:
      return 'text-gray-300';
  }
};

export default function ColoredLogs({ logs }: ColoredLogsProps) {
  const logsEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll para o fim quando novos logs chegam
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 h-80 overflow-y-auto font-mono text-sm">
      {logs.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          Aguardando processamento...
        </p>
      ) : (
        <div className="space-y-2">
          {logs.map((log) => (
            <div key={log.id} className="flex items-start gap-2">
              <span className="text-base">{log.icon}</span>
              <span className="text-gray-500 text-xs">
                {new Date(log.timestamp).toLocaleTimeString('pt-BR')}
              </span>
              <span className={`flex-1 ${getLogColor(log.level)}`}>
                {log.message}
              </span>
            </div>
          ))}
          <div ref={logsEndRef} />
        </div>
      )}
    </div>
  );
}
