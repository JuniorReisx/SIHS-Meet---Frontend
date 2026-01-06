export function FooterUser() {
  return (
    <>
      <footer className="bg-gradient-to-r from-gray-800 via-slate-700 to-gray-800 text-white mt-16 py-8 border-t-4 border-blue-600">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <p className="text-sm font-semibold text-gray-200">
                © 2025 SIHS - Secretaria de Infraestrutura Hídrica e Saneamento
              </p>
              <p className="text-gray-400 text-xs mt-1">
                Sistema de Gerenciamento de Reuniões
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
