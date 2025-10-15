import { NextResponse } from 'next/server';
import { readdir, unlink, rmdir } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';

export async function DELETE() {
  try {
    let deletedFiles = 0;
    const directories = [
      path.join(process.cwd(), 'data', 'input'),
      path.join(process.cwd(), 'data', 'output'),
    ];

    for (const dir of directories) {
      if (existsSync(dir)) {
        const files = await readdir(dir);
        
        for (const file of files) {
          const filePath = path.join(dir, file);
          await unlink(filePath);
          deletedFiles++;
        }

        // Tentar remover o diretório se estiver vazio
        try {
          await rmdir(dir);
        } catch {
          // Ignorar se não puder remover (não está vazio ou em uso)
        }
      }
    }

    return NextResponse.json({
      success: true,
      deletedFiles,
      message: `${deletedFiles} arquivo(s) removido(s) com sucesso!`,
    });
  } catch (error) {
    console.error('Erro ao limpar dados:', error);
    return NextResponse.json(
      { success: false, message: 'Erro ao limpar dados' },
      { status: 500 }
    );
  }
}
