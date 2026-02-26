import logo from "/src/assets/SIHS.jpg";
import { LogOut, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export function HeaderAdmin() {
  const navigate = useNavigate();
  const [username] = useState(() => localStorage.getItem("username") || "");

  const handleLogout = () => {
    if (confirm("Tem certeza que deseja sair?")) {
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("userRole");
      localStorage.removeItem("username");
      localStorage.removeItem("userSetor");
      localStorage.removeItem("authToken");
      localStorage.removeItem("userData");
      navigate("/login");
    }
  };

  return (
    <header className="bg-gradient-to-r from-purple-800 via-purple-700 to-purple-800 shadow-xl border-b-4 border-purple-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-5">
        <div className="flex items-center justify-between gap-3">

          {/* Logo + Título */}
          <div className="flex items-center gap-2 sm:gap-4 min-w-0">
            <div className="bg-white p-2 sm:p-3 rounded-xl shadow-md border border-purple-200 flex-shrink-0">
              <img
                src={logo}
                alt="Logo SIHS"
                className="h-10 w-10 sm:h-16 sm:w-16 object-contain"
              />
            </div>
            <div className="min-w-0">
              <h1 className="text-base sm:text-2xl font-bold text-white tracking-tight leading-tight">
                <span className="hidden sm:inline">Painel Administrativo - </span>SIHS
              </h1>
              <p className="text-purple-200 text-xs sm:text-sm font-medium hidden sm:block">
                Sistema de Gerenciamento de Reuniões
              </p>
            </div>
          </div>

          {/* Admin badge + Logout */}
          <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">

            {username && (
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-2 sm:px-4 py-2 rounded-lg border border-white/20">
                <div className="bg-white p-1.5 sm:p-2 rounded-full flex-shrink-0">
                  <Shield size={14} className="text-purple-600 sm:hidden" />
                  <Shield size={16} className="text-purple-600 hidden sm:block" />
                </div>
                <div className="flex-col hidden sm:flex">
                  <span className="text-xs text-purple-200 font-medium">Administrador</span>
                  <span className="text-sm font-bold text-white">{username}</span>
                </div>
                {/* No mobile mostra só o nome */}
                <span className="text-sm font-bold text-white sm:hidden max-w-[80px] truncate">
                  {username}
                </span>
              </div>
            )}

            {/* Botão Sair — só ícone no mobile */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 hover:bg-white/10 text-white px-2 sm:px-4 py-2 rounded-lg transition-colors border border-white/20 hover:border-white/40"
            >
              <LogOut size={20} />
              <span className="font-medium hidden sm:inline">Sair</span>
            </button>
          </div>

        </div>

        {/* Subtítulo e label admin embaixo no mobile */}
        <div className="sm:hidden mt-1">
          <p className="text-purple-200 text-xs">Painel Administrativo · Sistema de Gerenciamento de Reuniões</p>
        </div>
      </div>
    </header>
  );
}