# Tabsee Next.js - Instruções de Desenvolvimento

## Visão Geral do Projeto
Tabsee é um sistema web de automação de dashboards que processa planilhas Excel e gera dashboards interativos com otimização de IA.

## Stack Tecnológica
- **Framework**: Next.js 15+ com TypeScript e App Router
- **Estilo**: Tailwind CSS
- **Backend**: Next.js API Routes
- **Processamento**: xlsx (leitura de Excel), Cohere AI
- **Visualização**: Recharts
- **Export PDF**: html2pdf.js
- **Ícones**: Lucide React

## Funcionalidades Principais
1. **Upload de Excel**: Drag-and-drop para upload de planilhas .xlsx
2. **Conversão JSON**: Processamento automático Excel → JSON
3. **Otimização IA**: Análise opcional com Cohere API (key: lXInEtdWZndCJb2a44x3CNo0c8twHlW5GFD5wnQZ)
4. **Dashboard Interativo**: Gráficos dinâmicos e responsivos
5. **Export PDF**: Captura do dashboard em formato PDF
6. **Limpeza de Dados**: Botão para limpar arquivos temporários
7. **Página de Créditos**: Criador (Marcos Gomes), data (10/2025), licença MIT
8. **Logs Coloridos**: Feedback visual em tempo real do processamento

## Design System
- **Cores**: Tons de cinza (bg-gray-900, text-gray-400, border-gray-700)
- **Tipografia**: font-sans (Inter/system fonts)
- **Estilo**: Minimalista, bordas sutis, sombras suaves, cantos arredondados
- **Logs**: 🟢 Sucesso | 🔵 Info | 🟣 Processamento | 🟡 Aviso | 🔴 Erro

## Estrutura de Arquivos Next.js
```
tabsee-react/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Página principal
│   │   ├── creditos/
│   │   │   └── page.tsx          # Página de créditos
│   │   ├── api/
│   │   │   ├── upload/
│   │   │   │   └── route.ts      # POST upload Excel
│   │   │   ├── process/
│   │   │   │   └── route.ts      # POST processar dados
│   │   │   └── cleanup/
│   │   │       └── route.ts      # DELETE limpar dados
│   │   ├── layout.tsx            # Layout raiz
│   │   └── globals.css           # Estilos globais
│   ├── components/
│   │   ├── FileUpload.tsx        # Drag-and-drop de Excel
│   │   ├── ProcessingProgress.tsx # Barra de progresso
│   │   ├── ColoredLogs.tsx       # Logs em tempo real
│   │   ├── Dashboard.tsx         # Gráficos interativos
│   │   ├── PDFExport.tsx         # Botão de export PDF
│   │   └── DataCleanup.tsx       # Botão de limpeza
│   ├── lib/
│   │   ├── excel-processor.ts    # Leitura de Excel
│   │   ├── json-converter.ts     # Conversão JSON
│   │   ├── cohere-client.ts      # Cliente Cohere AI
│   │   └── utils.ts              # Utilitários
│   └── types/
│       └── index.ts              # TypeScript interfaces
└── public/
    ├── favicon.ico
    └── marcos-gomes.png          # Foto do criador
```

## Pipeline de Processamento
1. **Upload**: Arquivo Excel enviado via drag-and-drop → API /api/upload
2. **Leitura**: xlsx lê planilha → dados brutos
3. **Conversão**: Dados brutos → JSON estruturado
4. **Análise**: (Opcional) Cohere API otimiza estrutura de dados
5. **Dashboard**: JSON → Gráficos com Recharts
6. **Export**: Dashboard → PDF via html2pdf.js

## Configuração da API Cohere
- **API Key**: lXInEtdWZndCJb2a44x3CNo0c8twHlW5GFD5wnQZ
- **Modelo**: command-r-plus
- **Uso**: Análise opcional de dados para otimização

## Instruções de Estilo de Código
- Use TypeScript estrito (strict mode)
- Componentes de servidor por padrão, "use client" quando necessário
- Async/await para operações assíncronas
- Error handling completo com try/catch
- Logs detalhados em todas as etapas
- Comentários em português brasileiro
- Tailwind CSS para todos os estilos

## Classes Tailwind Principais
- Container: `max-w-7xl mx-auto px-4 py-8`
- Card: `bg-gray-800 border border-gray-700 rounded-lg p-6 shadow-lg`
- Button: `bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors`
- Input: `bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500`
- Log success: `text-green-400`
- Log info: `text-blue-400`
- Log process: `text-purple-400`
- Log warning: `text-yellow-400`
- Log error: `text-red-400`
