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
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../config/api";

// ─── Types ────────────────────────────────────────────────────────────────────

type LoginType = "usuario" | "admin";

interface LoginResponse {
  token?: string;
  user?: { id: string; username: string; email?: string; role?: string };
  message?: string;
}

// ─── Constantes ───────────────────────────────────────────────────────────────

const ENDPOINTS = {
  admin: `${API_URL}/admin/login`,
  user:  `${API_URL}/users/login`,
  ldap:  `${API_URL}/ldap/login`,
} as const;

const ROUTES = {
  admin:   "/ScheduledMeetingsADMIN",
  usuario: "/ScheduledMeetings",
} as const;

// Mensagens por status HTTP
const ERROR_MESSAGES: Record<number, string> = {
  400: "Dados inválidos. Verifique usuário e senha.",
  401: "Você errou o usuário ou a senha.",
  403: "Você não tem permissão para acessar este sistema.",
  404: "Serviço indisponível. Tente novamente mais tarde.",
  429: "Muitas tentativas. Aguarde alguns minutos e tente novamente.",
  500: "Erro interno do servidor. Contate o suporte.",
  502: "Serviço temporariamente indisponível.",
  503: "Sistema em manutenção. Tente novamente em breve.",
};

const DEFAULT_ERROR   = "Não foi possível realizar o login. Tente novamente.";
const NETWORK_ERROR   = "Você errou o usuário ou a senha.";

// ─── Utilitários ──────────────────────────────────────────────────────────────

function isNetworkError(err: unknown): boolean {
  if (!(err instanceof Error)) return false;
  const msg = err.message.toLowerCase();
  // "Load failed", "Failed to fetch", "NetworkError", "net::ERR_*"
  return (
    msg.includes("load failed") ||
    msg.includes("failed to fetch") ||
    msg.includes("networkerror") ||
    msg.includes("network request failed") ||
    msg.includes("err_")
  );
}

async function postLogin(
  endpoint: string,
  username: string,
  password: string
): Promise<LoginResponse> {
  let response: Response;

  try {
    response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
  } catch {
    // Erro de rede real (sem conexão, CORS, timeout, etc.)
    // Relançamos com flag para distinguir de erro de credencial
    const e = new Error(NETWORK_ERROR);
    (e as Error & { isNetwork: boolean }).isNetwork = true;
    throw e;
  }

  if (!response.ok) {
    let serverMessage: string | undefined;
    try {
      const errorData = await response.json();
      serverMessage = errorData?.message;
    } catch { /* sem corpo JSON */ }

    // 401 / 403 → mensagem de credencial, não de rede
    const friendlyMsg =
      response.status === 401 || response.status === 403
        ? "Você errou o usuário ou a senha."
        : (ERROR_MESSAGES[response.status] ?? DEFAULT_ERROR);

    throw new Error(serverMessage?.includes("não encontrado") || serverMessage?.includes("incorreta")
      ? "Você errou o usuário ou a senha."
      : friendlyMsg
    );
  }

  return response.json() as Promise<LoginResponse>;
}

async function authenticate(
  tipoLogin: LoginType,
  username: string,
  password: string
): Promise<LoginResponse> {
  if (tipoLogin === "admin") {
    return postLogin(ENDPOINTS.admin, username, password);
  }

  // Tenta /users primeiro, depois /ldap como fallback
  // Se os DOIS falharem por credencial → mostra mensagem de credencial
  // Se os DOIS falharem por rede → mostra mensagem de rede (mas não trava)
  try {
    return await postLogin(ENDPOINTS.user, username, password);
  } catch (userErr) {
    // Se o erro do /users foi de credencial (não de rede), não tenta LDAP
    if (!(userErr as Error & { isNetwork?: boolean }).isNetwork) {
      throw userErr;
    }
    // Só tenta LDAP se /users teve erro de rede (usuário LDAP)
    try {
      return await postLogin(ENDPOINTS.ldap, username, password);
    } catch {
      // LDAP também falhou — mostra mensagem de credencial de qualquer forma
      throw new Error("Você errou o usuário ou a senha.");
    }
  }
}

// ─── Helpers de estilo ────────────────────────────────────────────────────────

const INPUT =
  "w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none transition-all placeholder:text-gray-400 disabled:bg-gray-50 disabled:cursor-not-allowed";

// ─── Componente ───────────────────────────────────────────────────────────────

export default function Login() {
  const navigate = useNavigate();

  const [tipoLogin,    setTipoLogin]    = useState<LoginType>("usuario");
  const [usuario,      setUsuario]      = useState("");
  const [password,     setPassword]     = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading,      setLoading]      = useState(false);
  const [error,        setError]        = useState("");
  const [modalOpen,    setModalOpen]    = useState(false);
  const [loginData,    setLoginData]    = useState<LoginResponse | null>(null);

  const isAdmin    = tipoLogin === "admin";
  const clearError = () => setError("");

  const accentFocus  = isAdmin
    ? "focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
    : "focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

  const accentButton = isAdmin
    ? "bg-purple-600 hover:bg-purple-700"
    : "bg-gray-800 hover:bg-gray-900";

  const accentConfirm = isAdmin
    ? "bg-purple-600 hover:bg-purple-700"
    : "bg-blue-600 hover:bg-blue-700";

  const accentBadge = isAdmin ? "text-purple-700" : "text-blue-700";
  const accentIcon  = isAdmin ? "bg-purple-50"    : "bg-blue-50";
  const accentColor = isAdmin ? "text-purple-600"  : "text-blue-600";

  // ── Handlers ────────────────────────────────────────────────────────────────

  const handleTipoLoginChange = (tipo: LoginType) => {
    setTipoLogin(tipo);
    clearError();
  };

  const handleSubmit = async () => {
    if (!usuario.trim() || !password) {
      setError("Por favor, preencha todos os campos.");
      return;
    }

    setLoading(true);
    clearError();

    try {
      const data = await authenticate(tipoLogin, usuario.trim(), password);
      setLoginData(data);
      setModalOpen(true);
    } catch (err) {
      // Garante que o loading sempre para, mesmo com erros inesperados
      const message = err instanceof Error ? err.message : DEFAULT_ERROR;
      // Erros de rede brutos que escaparam → normaliza para mensagem amigável
      setError(isNetworkError(err) ? NETWORK_ERROR : message);
    } finally {
      // finally SEMPRE executa — resolve o problema de "trava" após o erro
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !loading) handleSubmit();
  };

  const handleConfirmLogin = () => {
    if (!loginData) return;
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("userRole",        tipoLogin);
    localStorage.setItem("username",        usuario);
    if (loginData.token) localStorage.setItem("authToken", loginData.token);
    if (loginData.user)  localStorage.setItem("userData",  JSON.stringify(loginData.user));
    navigate(ROUTES[tipoLogin]);
  };

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">

        {/* Card principal */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

          {/* Header */}
          <div className="px-6 pt-8 pb-6 text-center border-b border-gray-100">
            <div className={`w-12 h-12 rounded-xl mx-auto mb-4 flex items-center justify-center ${accentIcon}`}>
              {isAdmin
                ? <Shield size={24} className={accentColor} />
                : <LogIn  size={24} className={accentColor} />}
            </div>
            <h1 className="text-xl font-bold text-gray-800 tracking-tight">
              {isAdmin ? "Acesso Administrativo" : "Bem-vindo"}
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              Sistema de Gerenciamento de Reuniões
            </p>
          </div>

          <div className="px-6 py-6 space-y-4">

            {/* Seletor de tipo */}
            <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
              {(["usuario", "admin"] as LoginType[]).map((tipo) => (
                <button
                  key={tipo}
                  onClick={() => handleTipoLoginChange(tipo)}
                  disabled={loading}
                  className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all duration-150
                    ${tipoLogin === tipo
                      ? `bg-white shadow-sm ${tipo === "admin" ? "text-purple-600" : "text-blue-600"}`
                      : "text-gray-500 hover:text-gray-700"}
                    disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {tipo === "usuario" ? "Usuário" : "Admin"}
                </button>
              ))}
            </div>

            {/* Erro */}
            {error && (
              <div
                role="alert"
                className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg px-3 py-2.5"
              >
                <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
                {error}
              </div>
            )}

            {/* Usuário */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                {isAdmin ? "Administrador" : "Usuário"}
              </label>
              <div className="relative">
                <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  value={usuario}
                  onChange={(e) => { setUsuario(e.target.value); clearError(); }}
                  onKeyDown={handleKeyDown}
                  disabled={loading}
                  placeholder={isAdmin ? "suporte.setor" : "setor.sihs"}
                  className={`${INPUT} pl-9 ${accentFocus}`}
                />
              </div>
            </div>

            {/* Senha */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                Senha
              </label>
              <div className="relative">
                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); clearError(); }}
                  onKeyDown={handleKeyDown}
                  disabled={loading}
                  placeholder="••••••••"
                  className={`${INPUT} pl-9 pr-10 ${accentFocus}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  disabled={loading}
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold text-white shadow-sm transition-colors mt-2
                ${accentButton} disabled:opacity-70 disabled:cursor-not-allowed`}
            >
              {loading
                ? <><Loader2 size={14} className="animate-spin" /> Entrando...</>
                : <>{isAdmin ? <Shield size={14} /> : <LogIn size={14} />}
                   {isAdmin ? "Entrar como Administrador" : "Entrar"}</>}
            </button>
          </div>
        </div>

        {/* Rodapé */}
        <p className="text-center text-xs text-gray-400 mt-4">
          SIHS · Secretaria de Infraestrutura Hídrica e Saneamento
        </p>
      </div>

      {/* ── Modal de confirmação ── */}
      {modalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl border border-gray-200 shadow-2xl max-w-sm w-full overflow-hidden"
            style={{ animation: "slideUp 0.2s ease-out" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header modal */}
            <div className="px-6 pt-6 pb-5 border-b border-gray-100 text-center relative">
              <button
                onClick={() => setModalOpen(false)}
                aria-label="Fechar"
                className="absolute right-4 top-4 p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <X size={15} />
              </button>
              <div className={`w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center ${accentIcon}`}>
                {isAdmin
                  ? <Shield      size={24} className={accentColor} />
                  : <CheckCircle size={24} className={accentColor} />}
              </div>
              <h2 className="text-base font-bold text-gray-800">Login realizado com sucesso</h2>
              <p className="text-xs text-gray-400 mt-0.5">Confirme seus dados antes de continuar</p>
            </div>

            {/* Corpo modal */}
            <div className="px-6 py-5 space-y-4">
              <div className="space-y-2">
                {[
                  { label: "Usuário",        value: usuario                               },
                  { label: "Tipo de acesso", value: isAdmin ? "Administrador" : "Usuário" },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-gray-50 rounded-lg px-4 py-3">
                    <p className="text-xs text-gray-400 mb-0.5">{label}</p>
                    <p className={`text-sm font-bold ${accentBadge}`}>{value}</p>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => setModalOpen(false)}
                  className="flex-1 py-2.5 text-sm font-semibold text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirmLogin}
                  className={`flex-1 py-2.5 text-sm font-semibold text-white rounded-lg shadow-sm transition-colors ${accentConfirm}`}
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
      `}</style>
    </div>
  );
}