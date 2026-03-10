import logo from "/src/assets/SIHS.jpg";
import { LogOut, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export function HeaderUser() {
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
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between gap-4">

          {/* Logo + Título */}
          <div className="flex items-center gap-3 min-w-0">
            <img
              src={logo}
              alt="Logo SIHS"
              className="h-9 w-9 sm:h-10 sm:w-10 object-contain rounded-lg flex-shrink-0"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base font-bold text-gray-800 leading-tight">
                  SIHS
                </h1>
                <span className="hidden sm:inline text-gray-300">·</span>
                <span className="hidden sm:inline text-sm text-gray-500 truncate">
                  Sistema de Gerenciamento de Reuniões
                </span>
              </div>
              <p className="text-xs text-blue-600 font-semibold uppercase tracking-widest sm:hidden">
                Painel Usuário
              </p>
            </div>
          </div>

          {/* Direita: badge usuário + logout */}
          <div className="flex items-center gap-2 flex-shrink-0">

            {/* Badge do usuário */}
            {username && (
              <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-lg">
                <User size={13} className="text-blue-600 flex-shrink-0" />
                <div className="hidden sm:block">
                  <p className="text-xs text-blue-500 font-medium leading-none mb-0.5">Usuário</p>
                  <p className="text-sm font-bold text-blue-800 leading-none">{username}</p>
                </div>
                <span className="sm:hidden text-sm font-bold text-blue-800 max-w-[72px] truncate">
                  {username}
                </span>
              </div>
            )}

            {/* Logout */}
            <button
              onClick={handleLogout}
              aria-label="Sair"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold text-gray-500 hover:text-red-600 hover:bg-red-50 border border-gray-200 hover:border-red-200 transition-all"
            >
              <LogOut size={15} />
              <span className="hidden sm:inline">Sair</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}