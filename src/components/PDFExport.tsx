'use client';

import { Download } from 'lucide-react';
import { useState } from 'react';

interface PDFExportProps {
  disabled?: boolean;
}

export default function PDFExport({ disabled }: PDFExportProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      console.log('[PDFExport] Iniciando exportação PDF...');
      // Import dinâmico para evitar erro de SSR
      const html2pdf = (await import('html2pdf.js')).default;

      const element = document.getElementById('dashboard-content');
      if (!element) {
        console.error('[PDFExport] Elemento #dashboard-content não encontrado no DOM.');
        alert('Dashboard não encontrado na tela. Certifique-se que o dashboard está visível.');
        return;
      }

      const opt = {
        margin: 0.5,
        filename: `tabsee-dashboard-${new Date().toISOString().slice(0, 10)}.pdf`,
        image: { type: 'jpeg' as const, quality: 0.95 },
        html2canvas: { 
          scale: 1.5, 
          useCORS: true, 
          backgroundColor: '#111827',
          width: 1200,
          height: undefined,
          scrollX: 0,
          scrollY: 0,
          allowTaint: true,
          logging: false,
          ignoreElements: (element: Element) => {
            // Ignorar elementos que podem causar problemas
            return element.classList.contains('recharts-wrapper') && false;
          },
          onclone: (clonedDoc: Document) => {
            // Corrigir layout e cores no documento clonado
            const style = clonedDoc.createElement('style');
            style.textContent = `
              * {
                color: inherit !important;
                background-color: inherit !important;
                box-sizing: border-box !important;
              }
              
              /* Cores específicas */
              .text-gray-400 { color: #9ca3af !important; }
              .text-white { color: #ffffff !important; }
              .bg-gray-800 { background-color: #1f2937 !important; }
              .bg-gray-900 { background-color: #111827 !important; }
              .border-gray-700 { border-color: #374151 !important; }
              
              /* Layout fixes para PDF */
              .space-y-6 > * + * { 
                margin-top: 1.5rem !important; 
              }
              
              /* Grid fixes */
              .grid {
                display: block !important;
                overflow: visible !important;
              }
              
              .grid > * {
                display: block !important;
                margin-bottom: 1rem !important;
                page-break-inside: avoid !important;
              }
              
              /* Flex fixes */
              .flex {
                display: block !important;
              }
              
              .flex > * {
                display: block !important;
                margin-bottom: 0.5rem !important;
              }
              
              /* Chart container fixes */
              .recharts-wrapper {
                margin-bottom: 2rem !important;
                page-break-inside: avoid !important;
              }
              
              /* Espaçamento geral */
              div, section, article {
                overflow: visible !important;
                position: static !important;
              }
              
              /* Prevent overlap */
              * {
                transform: none !important;
                position: static !important;
              }
            `;
            clonedDoc.head.appendChild(style);
          }
        },
        jsPDF: { 
          unit: 'in', 
          format: 'a4', 
          orientation: 'portrait' as const,
          compress: true
        },
      };

      console.log('[PDFExport] Opções:', opt);
      await html2pdf().set(opt).from(element).save();
      alert('PDF exportado com sucesso!');
    } catch (error) {
      console.error('Erro ao exportar PDF:', error);
      alert('Erro ao exportar PDF: ' + (error instanceof Error ? error.message : String(error)));
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={disabled || isExporting}
      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white px-4 py-2 rounded-md transition-colors"
    >
      <Download className="w-5 h-5" />
      {isExporting ? 'Exportando...' : 'Exportar PDF'}
    </button>
  );
}
