import logo from "/src/assets/SIHS.jpg";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function HeaderAdmin() {
  const navigate = useNavigate();

      const handleLogout = () => {
    if (confirm("Tem certeza que deseja sair?")) {
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("userRole");
      localStorage.removeItem("username");
      localStorage.removeItem("userSetor");
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
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 hover:bg-black/20 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <LogOut size={20} />
              Sair
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
