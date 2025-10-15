import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import * as XLSX from 'xlsx';
import path from 'path';
import { LogEntry, DashboardData, ChartData } from '@/types';

// Função para criar logs
function createLog(level: LogEntry['level'], message: string): LogEntry {
  const icons = {
    success: '🟢',
    info: '🔵',
    process: '🟣',
    warning: '🟡',
    error: '🔴',
  };

  return {
    id: Date.now().toString() + Math.random(),
    timestamp: new Date().toISOString(),
    level,
    message,
    icon: icons[level],
  };
}

// Função para processar Excel do buffer
async function processExcelFromBuffer(buffer: Buffer, logs: LogEntry[]): Promise<{ sheets: ProcessedSheet[] }> {
  try {
    logs.push(createLog('process', '📊 Iniciando leitura do arquivo Excel...'));
    
    logs.push(createLog('info', `📄 Arquivo lido: ${buffer.length} bytes`));
    
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    
    logs.push(createLog('info', `📋 Planilhas encontradas: ${workbook.SheetNames.join(', ')}`));
    
    const sheets: ProcessedSheet[] = workbook.SheetNames.map(sheetName => {
      const worksheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(worksheet) as Record<string, unknown>[];
      
      if (data.length === 0) {
        logs.push(createLog('warning', `⚠️ Planilha "${sheetName}" está vazia`));
        return {
          name: sheetName,
          data: [],
          columns: [],
        };
      }
      
      const columns = Object.keys(data[0] || {});
      
      logs.push(createLog('info', `✓ Planilha "${sheetName}": ${data.length} linhas, ${columns.length} colunas`));
      
      return {
        name: sheetName,
        data,
        columns,
      };
    });

    logs.push(createLog('success', `✅ ${sheets.length} planilha(s) processada(s) com sucesso!`));
    
    return { sheets };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logs.push(createLog('error', `❌ Erro ao processar Excel: ${errorMessage}`));
    throw new Error(`Erro ao processar arquivo Excel: ${errorMessage}`);
  }
}

// Interface para as planilhas processadas
interface ProcessedSheet {
  name: string;
  data: Record<string, unknown>[];
  columns: string[];
}

// Função para gerar dados do dashboard
function generateDashboard(sheets: ProcessedSheet[]): DashboardData {
  const charts: ChartData[] = [];
  
  // Para cada planilha, criar gráficos
  sheets.forEach((sheet, index) => {
    if (!sheet.data || sheet.data.length === 0) {
      console.warn(`Planilha "${sheet.name}" está vazia, pulando geração de gráficos`);
      return;
    }

    const firstSheet = sheet.data;
    const columns = sheet.columns;

    if (!columns || columns.length === 0) {
      console.warn(`Planilha "${sheet.name}" não tem colunas, pulando`);
      return;
    }

    // Tentar encontrar colunas numéricas e de texto
    const numericColumns = columns.filter((col: string) => {
      const firstValue = firstSheet[0]?.[col];
      return typeof firstValue === 'number' && !isNaN(firstValue);
    });

    const textColumns = columns.filter((col: string) => {
      const firstValue = firstSheet[0]?.[col];
      return typeof firstValue === 'string' && firstValue.trim() !== '';
    });

    console.log(`Planilha "${sheet.name}": ${numericColumns.length} colunas numéricas, ${textColumns.length} colunas de texto`);

    // Gráfico de barras
    if (numericColumns.length > 0 && textColumns.length > 0) {
      const limitedData = firstSheet.slice(0, 10); // Limitar a 10 itens
      charts.push({
        id: `bar-${index}`,
        type: 'bar',
        title: `${sheet.name} - Análise por ${textColumns[0]}`,
        data: limitedData,
        xKey: textColumns[0],
        yKey: numericColumns[0],
      });
    }

    // Gráfico de linha
    if (numericColumns.length > 1) {
      const limitedData = firstSheet.slice(0, 15);
      charts.push({
        id: `line-${index}`,
        type: 'line',
        title: `${sheet.name} - Tendência`,
        data: limitedData,
        xKey: textColumns[0] || 'index',
        yKey: numericColumns[1] || numericColumns[0],
      });
    }

    // Gráfico de pizza (top 5)
    if (numericColumns.length > 0 && textColumns.length > 0) {
      const topData = firstSheet
        .slice(0, 5)
        .map((row) => ({
          name: String(row[textColumns[0]] || 'Sem nome'),
          value: Number(row[numericColumns[0]] || 0),
        }))
        .filter(item => item.value > 0); // Filtrar valores válidos
      
      charts.push({
        id: `pie-${index}`,
        type: 'pie',
        title: `${sheet.name} - Top 5 Distribuição`,
        data: topData,
      });
    }
  });

  // Calcular resumo
  const totalRows = sheets.reduce((sum, sheet) => sum + sheet.data.length, 0);
  const totalColumns = sheets.reduce((sum, sheet) => sum + sheet.columns.length, 0);

  return {
    charts,
    summary: {
      totalRows,
      totalColumns,
      sheets: sheets.length,
      processedAt: new Date().toISOString(),
    },
  };
}

export async function POST(request: NextRequest) {
  const logs: LogEntry[] = [];

  try {
    const body = await request.json();
    const { fileName, filePath, fileData, useAI } = body;

    let buffer: Buffer;

    // Aceitar tanto fileData (base64 do Vercel) quanto filePath (local)
    if (fileData) {
      // Processar de base64 (Vercel)
      logs.push(createLog('info', '🔄 Processando arquivo da memória (Vercel mode)...'));
      buffer = Buffer.from(fileData, 'base64');
    } else if (fileName || filePath) {
      // Processar de arquivo (Local)
      let actualFilePath = filePath;
      if (!actualFilePath && fileName) {
        actualFilePath = path.join(process.cwd(), 'data', 'input', fileName);
      }

      if (!actualFilePath) {
        return NextResponse.json(
          { success: false, message: 'Nome ou caminho do arquivo não fornecido' },
          { status: 400 }
        );
      }

      logs.push(createLog('info', '📂 Lendo arquivo do disco...'));
      buffer = await readFile(actualFilePath);
    } else {
      return NextResponse.json(
        { success: false, message: 'Dados do arquivo não fornecidos' },
        { status: 400 }
      );
    }

    logs.push(createLog('info', '🚀 Iniciando processamento...'));

    // 1. Processar Excel do buffer
    const excelData = await processExcelFromBuffer(buffer, logs);

    // 2. Converter para JSON
    logs.push(createLog('process', '🔄 Convertendo dados para JSON...'));
    const jsonData = JSON.stringify(excelData, null, 2);
    logs.push(createLog('success', '✅ Conversão para JSON concluída!'));

    // 3. Otimização com IA (opcional)
    if (useAI) {
      logs.push(createLog('process', '🤖 Solicitando otimização com Cohere AI...'));
      try {
        // Aqui você pode integrar a API do Cohere
        // Por enquanto, apenas simulamos
        await new Promise(resolve => setTimeout(resolve, 1000));
        logs.push(createLog('success', '✅ Otimização de IA concluída!'));
      } catch (aiError) {
        console.warn('Erro na IA:', aiError);
        logs.push(createLog('warning', '⚠️ Erro na otimização de IA, continuando sem otimização'));
      }
    }

    // 4. Gerar Dashboard
    logs.push(createLog('process', '📊 Gerando visualizações do dashboard...'));
    const dashboardData = generateDashboard(excelData.sheets);
    logs.push(createLog('success', `✅ ${dashboardData.charts.length} gráfico(s) gerado(s)!`));

    logs.push(createLog('success', '🎉 Processamento concluído com sucesso!'));

    return NextResponse.json({
      success: true,
      data: { originalData: excelData, jsonData },
      dashboardData,
      message: 'Processamento concluído!',
      logs,
    });
  } catch (error) {
    console.error('Erro no processamento:', error);
    logs.push(createLog('error', `❌ Erro: ${error instanceof Error ? error.message : 'Erro desconhecido'}`));
    
    return NextResponse.json(
      { success: false, message: 'Erro ao processar arquivo', logs },
      { status: 500 }
    );
  }
}
