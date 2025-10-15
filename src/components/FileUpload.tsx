'use client';

import { useState, useCallback } from 'react';
import { Upload, FileSpreadsheet } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
}

export default function FileUpload({ onFileSelect, disabled }: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (disabled) return;

      const files = e.dataTransfer.files;
      if (files && files[0]) {
        const file = files[0];
        if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
          setSelectedFile(file);
          onFileSelect(file);
        } else {
          alert('Por favor, selecione um arquivo Excel (.xlsx ou .xls)');
        }
      }
    },
    [disabled, onFileSelect]
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;

    const files = e.target.files;
    if (files && files[0]) {
      const file = files[0];
      if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        setSelectedFile(file);
        onFileSelect(file);
      } else {
        alert('Por favor, selecione um arquivo Excel (.xlsx ou .xls)');
      }
    }
  };

  return (
    <div
      className={`relative border-2 border-dashed rounded-lg p-8 transition-all ${
        dragActive
          ? 'border-blue-500 bg-blue-500/10'
          : 'border-gray-700 bg-gray-800/50'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-gray-600'}`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input
        type="file"
        accept=".xlsx,.xls"
        onChange={handleFileInput}
        disabled={disabled}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
      />

      <div className="flex flex-col items-center justify-center gap-4">
        {selectedFile ? (
          <>
            <FileSpreadsheet className="w-16 h-16 text-green-400" />
            <div className="text-center">
              <p className="text-white font-medium">{selectedFile.name}</p>
              <p className="text-gray-400 text-sm mt-1">
                {(selectedFile.size / 1024).toFixed(2)} KB
              </p>
            </div>
          </>
        ) : (
          <>
            <Upload className="w-16 h-16 text-gray-400" />
            <div className="text-center">
              <p className="text-white font-medium">
                Arraste seu arquivo Excel aqui
              </p>
              <p className="text-gray-400 text-sm mt-1">
                ou clique para selecionar
              </p>
              <p className="text-gray-500 text-xs mt-2">
                Formatos suportados: .xlsx, .xls
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
