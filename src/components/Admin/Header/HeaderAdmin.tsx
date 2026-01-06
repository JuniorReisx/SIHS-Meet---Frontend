import logo from "/src/assets/SIHS.jpg";
import { LogOut, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export function HeaderAdmin() {
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
      <header className="bg-gradient-to-r from-purple-800 via-purple-700 to-purple-800 shadow-xl border-b-4 border-purple-900">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-white p-3 rounded-xl shadow-md border border-purple-200">
                <img
                  src={logo}
                  alt="Logo SIHS"
                  className="h-16 w-16 object-contain"
                />
              </div>
              <div className="flex items-center gap-3">
                <div>
                  <h1 className="text-2xl font-bold text-white tracking-tight">
                    Painel Administrativo - SIHS
                  </h1>
                  <p className="text-purple-100 text-sm mt-0.5 font-medium">
                    Sistema de Gerenciamento de Reuniões
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Badge com nome do admin */}
              {username && (
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
                  <div className="bg-white p-2 rounded-full">
                    <Shield size={16} className="text-purple-600" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-purple-200 font-medium">Administrador</span>
                    <span className="text-sm font-bold text-white">{username}</span>
                  </div>
                </div>
              )}

              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 hover:bg-white/10 text-white px-4 py-2 rounded-lg transition-colors border border-white/20 hover:border-white/40"
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