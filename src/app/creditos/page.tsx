import Link from 'next/link';
import { ArrowLeft, Github, Linkedin } from 'lucide-react';
import Image from 'next/image';

export default function Creditos() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors w-fit"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 shadow-2xl">
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-blue-500 shadow-lg">
              <Image
                src="/perfil.png"
                alt="Marcos Gomes"
                width={160}
                height={160}
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <h1 className="text-4xl font-bold mb-2">Marcos Gomes</h1>
              <p className="text-gray-400 text-lg">Desenvolvedor Full Stack</p>
            </div>

            <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/30 rounded-full px-4 py-2">
              <span className="text-green-400 font-semibold">Licença MIT</span>
            </div>

            <div className="text-gray-300 max-w-2xl">
              <p className="mb-4">
                <strong className="text-white">Tabsee</strong> é um sistema de automação de dashboards
                que transforma planilhas Excel em visualizações interativas com o poder da IA.
              </p>
              <p className="text-sm text-gray-400">
                Desenvolvido em <strong>Outubro de 2025</strong>
              </p>
            </div>

            <div className="flex gap-4 mt-6">
              <a
                href="https://github.com/marcosgomes068"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-md transition-colors"
              >
                <Github className="w-5 h-5" />
                GitHub
              </a>
              <a
                href="https://www.linkedin.com/in/gomesgabriel068"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md transition-colors"
              >
                <Linkedin className="w-5 h-5" />
                LinkedIn
              </a>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-700 w-full">
              <h2 className="text-2xl font-semibold mb-4">Tecnologias Utilizadas</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="bg-gray-700/50 p-3 rounded-lg">
                  <p className="font-semibold text-blue-400">Next.js 15</p>
                  <p className="text-gray-400">Framework React</p>
                </div>
                <div className="bg-gray-700/50 p-3 rounded-lg">
                  <p className="font-semibold text-green-400">TypeScript</p>
                  <p className="text-gray-400">Type Safety</p>
                </div>
                <div className="bg-gray-700/50 p-3 rounded-lg">
                  <p className="font-semibold text-purple-400">Tailwind CSS</p>
                  <p className="text-gray-400">Styling</p>
                </div>
                <div className="bg-gray-700/50 p-3 rounded-lg">
                  <p className="font-semibold text-yellow-400">Recharts</p>
                  <p className="text-gray-400">Visualização</p>
                </div>
                <div className="bg-gray-700/50 p-3 rounded-lg">
                  <p className="font-semibold text-red-400">xlsx</p>
                  <p className="text-gray-400">Excel Processing</p>
                </div>
                <div className="bg-gray-700/50 p-3 rounded-lg">
                  <p className="font-semibold text-indigo-400">Cohere AI</p>
                  <p className="text-gray-400">Otimização</p>
                </div>
                <div className="bg-gray-700/50 p-3 rounded-lg">
                  <p className="font-semibold text-pink-400">html2pdf.js</p>
                  <p className="text-gray-400">Export PDF</p>
                </div>
                <div className="bg-gray-700/50 p-3 rounded-lg">
                  <p className="font-semibold text-orange-400">Lucide React</p>
                  <p className="text-gray-400">Ícones</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}