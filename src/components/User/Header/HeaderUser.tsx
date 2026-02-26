import { LogOut, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import logo from "/src/assets/SIHS.jpg";

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
    <header className="bg-gradient-to-r from-gray-50 via-slate-100 to-gray-50 shadow-xl border-b-4 border-blue-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-5">
        <div className="flex items-center justify-between gap-3">

          {/* Logo + Título */}
          <div className="flex items-center gap-2 sm:gap-4 min-w-0">
            <div className="bg-white p-2 sm:p-3 rounded-xl shadow-md border border-gray-200 flex-shrink-0">
              <img
                src={logo}
                alt="Logo SIHS"
                className="h-10 w-10 sm:h-16 sm:w-16 object-contain"
              />
            </div>
            <div className="min-w-0">
              <h1 className="text-lg sm:text-2xl font-bold text-gray-800 tracking-tight">
                SIHS
              </h1>
              <p className="text-gray-600 text-xs sm:text-sm font-medium leading-tight hidden xs:block sm:block">
                Secretaria de Infraestrutura Hídrica e Saneamento
              </p>
            </div>
          </div>

          {/* Usuário + Logout */}
          <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">

            {/* Badge usuário — esconde nome no mobile pequeno */}
            {username && (
              <div className="flex items-center gap-2 bg-blue-50 px-2 sm:px-4 py-2 rounded-lg border border-blue-200">
                <div className="bg-blue-600 p-1.5 sm:p-2 rounded-full flex-shrink-0">
                  <User size={14} className="text-white sm:hidden" />
                  <User size={16} className="text-white hidden sm:block" />
                </div>
                <div className="flex-col hidden sm:flex">
                  <span className="text-xs text-gray-500 font-medium">Usuário</span>
                  <span className="text-sm font-bold text-gray-800">{username}</span>
                </div>
                {/* No mobile mostra só o nome, sem label */}
                <span className="text-sm font-bold text-gray-800 sm:hidden max-w-[80px] truncate">
                  {username}
                </span>
              </div>
            )}

            {/* Botão Sair — só ícone no mobile */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 hover:bg-red-50 text-gray-700 hover:text-red-600 px-2 sm:px-4 py-2 rounded-lg transition-colors border border-transparent hover:border-red-200"
            >
              <LogOut size={20} />
              <span className="font-medium hidden sm:inline">Sair</span>
            </button>
          </div>

        </div>

        {/* Subtítulo embaixo no mobile */}
        <p className="text-gray-500 text-xs mt-1 sm:hidden">
          Secretaria de Infraestrutura Hídrica e Saneamento
        </p>
      </div>
    </header>
  );
}