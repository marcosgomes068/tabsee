import { NextRequest, NextResponse } from 'next/server';

const isVercel = process.env.VERCEL === '1';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { success: false, message: 'Nenhum arquivo enviado' },
        { status: 400 }
      );
    }

    // Validar extensão
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      return NextResponse.json(
        { success: false, message: 'Apenas arquivos Excel são permitidos' },
        { status: 400 }
      );
    }

    // Processar arquivo
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    if (isVercel) {
      // No Vercel, retornar o buffer como base64 para processar na memória
      const base64 = buffer.toString('base64');
      return NextResponse.json({
        success: true,
        fileName: file.name,
        fileData: base64,
        message: 'Arquivo enviado com sucesso!',
      });
    } else {
      // Localmente, também retornar base64 para consistência
      // Mas também podemos salvar no disco se necessário
      const base64 = buffer.toString('base64');
      
      // Tentar salvar no disco (apenas localmente)
      try {
        const { writeFile, mkdir } = await import('fs/promises');
        const path = await import('path');
        const { existsSync } = await import('fs');
        
        const uploadDir = path.join(process.cwd(), 'data', 'input');
        if (!existsSync(uploadDir)) {
          await mkdir(uploadDir, { recursive: true });
        }

        const filePath = path.join(uploadDir, file.name);
        await writeFile(filePath, buffer);
        
        return NextResponse.json({
          success: true,
          filePath,
          fileName: file.name,
          fileData: base64,
          message: 'Arquivo enviado com sucesso!',
        });
      } catch (fsError) {
        // Se falhar ao salvar no disco, retornar apenas base64
        console.warn('Não foi possível salvar arquivo no disco, usando memória:', fsError);
        return NextResponse.json({
          success: true,
          fileName: file.name,
          fileData: base64,
          message: 'Arquivo enviado com sucesso!',
        });
      }
    }
  } catch (error) {
    console.error('Erro no upload:', error);
    return NextResponse.json(
      { success: false, message: 'Erro ao fazer upload do arquivo' },
      { status: 500 }
    );
  }
}
