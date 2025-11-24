import { useState } from "react";
import { User, Mail, Lock, Eye, EyeOff, UserPlus } from "lucide-react";

export function Registration() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [aceitarTermos, setAceitarTermos] = useState(false);

  const handleSubmit = () => {
    if (!nome || !email || !password || !confirmPassword) {
      alert("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    if (password !== confirmPassword) {
      alert("As senhas não coincidem");
      return;
    }

    if (!aceitarTermos) {
      alert("Você precisa aceitar os termos de uso");
      return;
    }

    console.log("Cadastro:", { nome, email, password });
    alert("Cadastro realizado com sucesso!");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-gray-800 via-slate-700 to-gray-800 p-8 text-center">
            <div className="w-20 h-20 bg-white rounded-full mx-auto mb-4 flex items-center justify-center">
              <UserPlus size={40} className="text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Criar Conta</h1>
            <p className="text-blue-100">
              Sistema de Gerenciamento de Reuniões
            </p>
          </div>

          <div className="p-8 space-y-6">
            {/* Campo Nome */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nome Completo
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={20} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                  placeholder="João Silva"
                />
              </div>
            </div>

            {/* Campo Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                E-mail
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={20} className="text-gray-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            {/* Campo Senha */}
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
                  className="w-full pl-10 pr-12 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
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

            {/* Campo Confirmar Senha */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Confirmar Senha
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={20} className="text-gray-400" />
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full pl-10 pr-12 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
            </div>

            {/* Aceitar Termos */}
            <div className="flex items-start">
              <input
                type="checkbox"
                checked={aceitarTermos}
                onChange={(e) => setAceitarTermos(e.target.checked)}
                className="w-4 h-4 mt-1 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label className="ml-2 text-sm text-gray-600">
                Eu aceito os{" "}
                <button className="text-blue-600 hover:text-blue-700 font-semibold">
                  termos de uso
                </button>{" "}
                e a{" "}
                <button className="text-blue-600 hover:text-blue-700 font-semibold">
                  política de privacidade
                </button>
              </label>
            </div>

            {/* Botão de Cadastro */}
            <button
              onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-gray-800 via-slate-700 to-gray-800 hover:from-gray-700 hover:to-gray-900 text-white font-bold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
            >
              <UserPlus size={20} />
              Criar Conta
            </button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">ou</span>
              </div>
            </div>

            {/* Link para Login */}
            <div className="text-center">
              <p className="text-gray-600">
                Já tem uma conta?{" "}
                <button className="text-blue-600 hover:text-blue-700 font-semibold">
                  Faça login
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
