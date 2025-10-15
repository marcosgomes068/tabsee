import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    console.log('[Upload] ===== INÍCIO DO PROCESSAMENTO =====');
    console.log('[Upload] Headers:', Object.fromEntries(request.headers.entries()));
    
    const formData = await request.formData();
    console.log('[Upload] FormData recebido');
    
    const file = formData.get('file') as File;

    if (!file) {
      console.error('[Upload] ❌ Nenhum arquivo na requisição');
      return NextResponse.json(
        { success: false, message: 'Nenhum arquivo enviado' },
        { status: 400 }
      );
    }

    console.log('[Upload] ✓ Arquivo recebido:', {
      name: file.name,
      size: file.size,
      type: file.type
    });

    // Validar extensão
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      console.error('[Upload] ❌ Extensão inválida:', file.name);
      return NextResponse.json(
        { success: false, message: 'Apenas arquivos Excel são permitidos' },
        { status: 400 }
      );
    }

    // Verificar tamanho do arquivo (limite de 10MB)
    const MAX_SIZE = 10 * 1024 * 1024; // 10MB
    if (file.size > MAX_SIZE) {
      console.error('[Upload] ❌ Arquivo muito grande:', file.size);
      return NextResponse.json(
        { success: false, message: 'Arquivo muito grande. Máximo: 10MB' },
        { status: 400 }
      );
    }

    // Processar arquivo - sempre em memória (compatível com Vercel)
    console.log('[Upload] Convertendo para buffer...');
    const bytes = await file.arrayBuffer();
    console.log('[Upload] ✓ ArrayBuffer criado:', bytes.byteLength, 'bytes');
    
    const buffer = Buffer.from(bytes);
    console.log('[Upload] ✓ Buffer criado:', buffer.length, 'bytes');
    
    console.log('[Upload] Convertendo para base64...');
    const base64 = buffer.toString('base64');
    console.log('[Upload] ✓ Base64 criado. Length:', base64.length);

    console.log('[Upload] ===== SUCESSO! =====');
    return NextResponse.json({
      success: true,
      fileName: file.name,
      fileData: base64,
      fileSize: file.size,
      message: 'Arquivo enviado com sucesso!',
    });
  } catch (error) {
    console.error('[Upload] ===== ERRO CRÍTICO =====');
    console.error('[Upload] Erro completo:', error);
    console.error('[Upload] Stack:', error instanceof Error ? error.stack : 'N/A');
    
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    return NextResponse.json(
      { 
        success: false, 
        message: `Erro ao fazer upload: ${errorMessage}`,
        error: errorMessage,
        stack: errorStack,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
