import { useState } from "react";
import { User, Lock, Eye, EyeOff, LogIn, Briefcase, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { databaseCredentials } from "../../data/data";

export default function Login() {
  const navigate = useNavigate();
  
  const [tipoLogin, setTipoLogin] = useState("usuario");
  const [usuario, setUsuario] = useState("");
  const [setor, setSetor] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = () => {
    if (tipoLogin === "admin") {
      if (!usuario || !password) {
        alert("Por favor, preencha todos os campos");
        return;
      }
      
      if (usuario === databaseCredentials[0].user && password === databaseCredentials[0].password) {
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("userRole", "admin");
        localStorage.setItem("username", usuario);
        
        alert("Login de administrador realizado com sucesso!");
        navigate("/ScheduledMeetingsADMIN");
      } else {
        alert("Usuário ou senha incorretos!");
      }
    } else {
      if (!usuario || !setor || !password) {
        alert("Por favor, preencha todos os campos");
        return;
      }
      
      if (usuario === databaseCredentials[1].user && password === databaseCredentials[1].password) {
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("userRole", "usuario");
        localStorage.setItem("username", usuario);
        localStorage.setItem("userSetor", setor);
        
        alert("Login realizado com sucesso!");
        navigate("/ScheduledMeetings");
      } else {
        alert("Usuário ou senha incorretos!");
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className={`${
            tipoLogin === "admin" 
              ? "bg-gradient-to-r from-purple-800 via-purple-700 to-purple-800" 
              : "bg-gradient-to-r from-gray-800 via-slate-700 to-gray-800"
          } p-8 text-center transition-all duration-300`}>
            <div className="w-20 h-20 bg-white rounded-full mx-auto mb-4 flex items-center justify-center">
              {tipoLogin === "admin" ? (
                <Shield size={40} className="text-purple-600" />
              ) : (
                <LogIn size={40} className="text-blue-600" />
              )}
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              {tipoLogin === "admin" ? "Acesso Administrativo" : "Bem-vindo!"}
            </h1>
            <p className="text-blue-100">Sistema de Gerenciamento de Reuniões</p>
          </div>

          <div className="p-6 pb-0">
            <div className="flex gap-2 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setTipoLogin("usuario")}
                className={`flex-1 py-2 px-4 rounded-md font-semibold transition-all duration-200 ${
                  tipoLogin === "usuario"
                    ? "bg-white text-blue-600 shadow-md"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                Usuário
              </button>
              <button
                onClick={() => setTipoLogin("admin")}
                className={`flex-1 py-2 px-4 rounded-md font-semibold transition-all duration-200 ${
                  tipoLogin === "admin"
                    ? "bg-white text-purple-600 shadow-md"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                Admin
              </button>
            </div>
          </div>

          <div className="p-8 space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {tipoLogin === "admin" ? "Usuário Admin" : "Usuário"}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={20} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  value={usuario}
                  onChange={(e) => setUsuario(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className={`w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none transition-colors ${
                    tipoLogin === "admin" ? "focus:border-purple-500" : "focus:border-blue-500"
                  }`}
                  placeholder={tipoLogin === "admin" ? "admin" : "usuario"}
                />
              </div>
            </div>

            {tipoLogin === "usuario" && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Setor
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Briefcase size={20} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={setor}
                    onChange={(e) => setSetor(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                    placeholder="Nome do setor"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Senha
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={20} className="text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className={`w-full pl-10 pr-12 py-3 border-2 border-gray-200 rounded-lg focus:outline-none transition-colors ${
                    tipoLogin === "admin" ? "focus:border-purple-500" : "focus:border-blue-500"
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              className={`w-full font-bold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 ${
                tipoLogin === "admin"
                  ? "bg-gradient-to-r from-purple-800 via-purple-700 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white"
                  : "bg-gradient-to-r from-gray-800 via-slate-700 to-gray-800 hover:from-gray-700 hover:to-gray-900 text-white"
              }`}
            >
              {tipoLogin === "admin" ? <Shield size={20} /> : <LogIn size={20} />}
              {tipoLogin === "admin" ? "Entrar como Admin" : "Entrar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}