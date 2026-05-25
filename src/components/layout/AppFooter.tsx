export function AppFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-surface-border bg-white/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <p className="text-xs font-medium text-slate-600">
            © {year} SIHS · Secretaria de Infraestrutura Hídrica e Saneamento
          </p>
          <p className="text-xs text-slate-400">
            Sistema de Gerenciamento de Reuniões
          </p>
        </div>
      </div>
    </footer>
  );
}
