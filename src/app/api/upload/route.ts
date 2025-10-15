import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    console.log('[Upload] Recebendo requisição...');
    
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      console.error('[Upload] Nenhum arquivo enviado');
      return NextResponse.json(
        { success: false, message: 'Nenhum arquivo enviado' },
        { status: 400 }
      );
    }

    console.log('[Upload] Arquivo recebido:', file.name, 'Tamanho:', file.size);

    // Validar extensão
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      console.error('[Upload] Extensão inválida:', file.name);
      return NextResponse.json(
        { success: false, message: 'Apenas arquivos Excel são permitidos' },
        { status: 400 }
      );
    }

    // Processar arquivo - sempre em memória (compatível com Vercel)
    console.log('[Upload] Convertendo para buffer...');
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    console.log('[Upload] Convertendo para base64...');
    const base64 = buffer.toString('base64');
    
    console.log('[Upload] Sucesso! Base64 length:', base64.length);

    return NextResponse.json({
      success: true,
      fileName: file.name,
      fileData: base64,
      message: 'Arquivo enviado com sucesso!',
    });
  } catch (error) {
    console.error('[Upload] Erro no upload:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { 
        success: false, 
        message: `Erro ao fazer upload do arquivo: ${errorMessage}`,
        error: errorMessage 
      },
      { status: 500 }
    );
  }
}
