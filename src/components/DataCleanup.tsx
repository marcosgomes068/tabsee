'use client';

import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import axios from 'axios';

interface DataCleanupProps {
  onCleanup?: () => void;
}

export default function DataCleanup({ onCleanup }: DataCleanupProps) {
  const [isClearing, setIsClearing] = useState(false);

  const handleCleanup = async () => {
    const confirmed = confirm(
      'Tem certeza que deseja limpar todos os dados? Esta ação não pode ser desfeita.'
    );

    if (!confirmed) return;

    setIsClearing(true);
    try {
      const response = await axios.delete('/api/cleanup');
      
      if (response.data.success) {
        alert(
          `Limpeza concluída! ${response.data.deletedFiles} arquivo(s) removido(s).`
        );
        onCleanup?.();
      }
    } catch (error) {
      console.error('Erro ao limpar dados:', error);
      alert('Erro ao limpar dados. Veja o console para mais detalhes.');
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <button
      onClick={handleCleanup}
      disabled={isClearing}
      className="flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white px-4 py-2 rounded-md transition-colors"
    >
      <Trash2 className="w-5 h-5" />
      {isClearing ? 'Limpando...' : 'Limpar Dados'}
    </button>
  );
}
