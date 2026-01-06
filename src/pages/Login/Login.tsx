import { useState } from "react";
import {
  User,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  Shield,
  X,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { API_URL } from "../../config/api";
// Interface para tipar a resposta da API
interface LoginResponse {
  token?: string;
  user?: {
    id: string;
    username: string;
    email?: string;
    role?: string;
  };
  message?: string;
}

export default function Login() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [tipoLogin, setTipoLogin] = useState("usuario");
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Dados temporários para o modal de confirmação
  const [loginData, setLoginData] = useState<LoginResponse | null>(null);

  const handleSubmit = async () => {
    // Validação básica
    if (!usuario || !password) {
      setError("Por favor, preencha todos os campos");
      return;
    }

    setLoading(true);
    setError("");

    try {
      if (tipoLogin === "admin") {
        // Admin só tem uma rota
        const endpoint = `${API_URL}/admin/login`;
        
        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: usuario,
            password: password,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Usuário ou senha incorretos!");
        }

        // Salva os dados da resposta para usar no modal
        setLoginData(data as LoginResponse);
        
        // Abre o modal de confirmação
        handleOpen();
      } else {
        // Usuário: tenta primeira rota
        let endpoint = `${API_URL}/users/login`;
        
        let response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: usuario,
            password: password,
          }),
        });

        let data = await response.json();

        // Se a primeira rota falhar, tenta a rota LDAP
        if (!response.ok) {
          endpoint = `${API_URL}/ldap/login`;
          
          response = await fetch(endpoint, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username: usuario,
              password: password,
            }),
          });

          data = await response.json();

          // Se a segunda rota também falhar, mostra erro
          if (!response.ok) {
            throw new Error(data.message || "Usuário ou senha incorretos!");
          }
        }

        // Se uma das rotas funcionou, salva os dados e abre o modal
        setLoginData(data as LoginResponse);
        handleOpen();
      }
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : "Erro ao fazer login. Tente novamente.";
      setError(errorMessage);
      console.error("Erro no login:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmLogin = () => {
    if (!loginData) return;

    // Salva as informações no localStorage
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("userRole", tipoLogin);
    localStorage.setItem("username", usuario);
    
    // Se o backend retornar um token, salve-o também
    if (loginData.token) {
      localStorage.setItem("authToken", loginData.token);
    }

    // Se houver outros dados do usuário, salve-os
    if (loginData.user) {
      localStorage.setItem("userData", JSON.stringify(loginData.user));
    }

    // Navega para a página apropriada
    if (tipoLogin === "admin") {
      navigate("/ScheduledMeetingsADMIN");
    } else {
      navigate("/ScheduledMeetings");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !loading) {
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div
            className={`${
              tipoLogin === "admin"
                ? "bg-gradient-to-r from-purple-800 via-purple-700 to-purple-800"
                : "bg-gradient-to-r from-gray-800 via-slate-700 to-gray-800"
            } p-8 text-center transition-all duration-300`}
          >
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
            <p className="text-blue-100">
              Sistema de Gerenciamento de Reuniões
            </p>
          </div>

          <div className="p-6 pb-0">
            <div className="flex gap-2 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => {
                  setTipoLogin("usuario");
                  setError("");
                }}
                disabled={loading}
                className={`flex-1 py-2 px-4 rounded-md font-semibold transition-all duration-200 ${
                  tipoLogin === "usuario"
                    ? "bg-white text-blue-600 shadow-md"
                    : "text-gray-600 hover:text-gray-800"
                } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                Usuário
              </button>
              <button
                onClick={() => {
                  setTipoLogin("admin");
                  setError("");
                }}
                disabled={loading}
                className={`flex-1 py-2 px-4 rounded-md font-semibold transition-all duration-200 ${
                  tipoLogin === "admin"
                    ? "bg-white text-purple-600 shadow-md"
                    : "text-gray-600 hover:text-gray-800"
                } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                Admin
              </button>
            </div>
          </div>

          <div className="p-8 space-y-6">
            {/* Mensagem de erro */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg flex items-start gap-3 animate-shake">
                <AlertCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

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
                  onChange={(e) => {
                    setUsuario(e.target.value);
                    setError("");
                  }}
                  onKeyPress={handleKeyPress}
                  disabled={loading}
                  className={`w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none transition-colors ${
                    tipoLogin === "admin"
                      ? "focus:border-purple-500"
                      : "focus:border-blue-500"
                  } ${loading ? "bg-gray-100 cursor-not-allowed" : ""}`}
                  placeholder={tipoLogin === "admin" ? "admin" : "usuario"}
                />
              </div>
            </div>
            
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
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  onKeyPress={handleKeyPress}
                  disabled={loading}
                  className={`w-full pl-10 pr-12 py-3 border-2 border-gray-200 rounded-lg focus:outline-none transition-colors ${
                    tipoLogin === "admin"
                      ? "focus:border-purple-500"
                      : "focus:border-blue-500"
                  } ${loading ? "bg-gray-100 cursor-not-allowed" : ""}`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`w-full font-bold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 ${
                tipoLogin === "admin"
                  ? "bg-gradient-to-r from-purple-800 via-purple-700 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white"
                  : "bg-gradient-to-r from-gray-800 via-slate-700 to-gray-800 hover:from-gray-700 hover:to-gray-900 text-white"
              } ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Entrando...</span>
                </>
              ) : (
                <>
                  {tipoLogin === "admin" ? (
                    <Shield size={20} />
                  ) : (
                    <LogIn size={20} />
                  )}
                  {tipoLogin === "admin" ? "Entrar como Admin" : "Entrar"}
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Modal de Confirmação */}
      {open && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={handleClose}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header do Modal */}
            <div className={`${
              tipoLogin === "admin"
                ? "bg-gradient-to-r from-purple-600 to-purple-800"
                : "bg-gradient-to-r from-blue-600 to-indigo-600"
            } p-6 relative`}>
              <button
                onClick={handleClose}
                className="absolute right-4 top-4 text-white hover:bg-white/20 rounded-full p-1 transition-colors"
              >
                <X size={20} />
              </button>
              
              <div className="flex items-center justify-center mb-3">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                  {tipoLogin === "admin" ? (
                    <Shield size={32} className="text-purple-600" />
                  ) : (
                    <CheckCircle size={32} className="text-blue-600" />
                  )}
                </div>
              </div>
              
              <h2 className="text-white text-center font-bold text-2xl">
                Login Bem-sucedido!
              </h2>
              <p className="text-white/90 text-center mt-1 text-sm">
                {tipoLogin === "admin" ? "Acesso Administrativo" : "Acesso de Usuário"}
              </p>
            </div>

            {/* Conteúdo do Modal */}
            <div className="p-6">
              <div className="space-y-3 mb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Usuário:</p>
                  <p className="font-semibold text-gray-800">{usuario}</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Tipo de Acesso:</p>
                  <p className="font-semibold text-gray-800">
                    {tipoLogin === "admin" ? "Administrador" : "Usuário"}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={handleClose}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 rounded-lg transition-all duration-200"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleConfirmLogin}
                  className={`flex-1 font-bold py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl text-white ${
                    tipoLogin === "admin"
                      ? "bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900"
                      : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  }`}
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
}