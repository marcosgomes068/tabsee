import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';

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

    // Criar diretório se não existir
    const uploadDir = path.join(process.cwd(), 'data', 'input');
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Salvar arquivo
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filePath = path.join(uploadDir, file.name);
    await writeFile(filePath, buffer);

    return NextResponse.json({
      success: true,
      filePath,
      fileName: file.name,
      message: 'Arquivo enviado com sucesso!',
    });
  } catch (error) {
    console.error('Erro no upload:', error);
    return NextResponse.json(
      { success: false, message: 'Erro ao fazer upload do arquivo' },
      { status: 500 }
    );
  }
}
