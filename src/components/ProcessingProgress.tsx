'use client';

interface ProcessingProgressProps {
  progress: number;
  status: string;
}

export default function ProcessingProgress({ progress, status }: ProcessingProgressProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-300">{status}</span>
        <span className="text-gray-400">{progress}%</span>
      </div>
      
      <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
        <div
          className="bg-gradient-to-r from-blue-500 to-purple-500 h-full transition-all duration-300 ease-out rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
