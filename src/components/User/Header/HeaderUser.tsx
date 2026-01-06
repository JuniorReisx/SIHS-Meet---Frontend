import { LogOut, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import logo from "/src/assets/SIHS.jpg";

export function HeaderUser() {
  const navigate = useNavigate();
  // Inicializa o estado diretamente com o valor do localStorage
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
    <>
      <header className="bg-gradient-to-r from-gray-50 via-slate-100 to-gray-50 shadow-xl border-b-4 border-blue-600">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-white p-3 rounded-xl shadow-md border border-gray-200">
                <img
                  src={logo}
                  alt="Logo SIHS"
                  className="h-16 w-16 object-contain"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
                  SIHS
                </h1>
                <p className="text-gray-600 text-sm mt-0.5 font-medium">
                  Secretaria de Infraestrutura Hídrica e Saneamento
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Badge com nome do usuário */}
              {username && (
                <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg border border-blue-200">
                  <div className="bg-blue-600 p-2 rounded-full">
                    <User size={16} className="text-white" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500 font-medium">Usuário</span>
                    <span className="text-sm font-bold text-gray-800">{username}</span>
                  </div>
                </div>
              )}

              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 hover:bg-red-50 text-gray-700 hover:text-red-600 px-4 py-2 rounded-lg transition-colors border border-transparent hover:border-red-200"
              >
                <LogOut size={20} />
                <span className="font-medium">Sair</span>
              </button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}