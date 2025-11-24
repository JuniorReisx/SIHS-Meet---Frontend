import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import logo from "/src/assets/SIHS.jpg";

export function HeaderUser() {
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
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 hover:bg-black/20 text-gray-700 px-4 py-2 rounded-lg transition-colors"
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