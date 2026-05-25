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

  try {
    return await postLogin(ENDPOINTS.user, username, password);
  } catch (userErr) {
    if (!(userErr as Error & { isNetwork?: boolean }).isNetwork) {
      throw userErr;
    }
    try {
      return await postLogin(ENDPOINTS.ldap, username, password);
    } catch {
      throw new Error("Você errou o usuário ou a senha.");
    }
  }
}

import { cn } from "../../lib/cn";
import { roleTheme } from "../../theme/variants";

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

  const theme = roleTheme[isAdmin ? "admin" : "user"];

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
      const message = err instanceof Error ? err.message : DEFAULT_ERROR;
      setError(isNetworkError(err) ? NETWORK_ERROR : message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !loading) handleSubmit();
  };

  const handleConfirmLogin = () => {
    if (!loginData) return;

    // ✅ sessionStorage: apaga automaticamente ao fechar o navegador/aba
    sessionStorage.setItem("isAuthenticated", "true");
    sessionStorage.setItem("userRole",        tipoLogin);
    sessionStorage.setItem("username",        usuario);
    if (loginData.token) sessionStorage.setItem("authToken", loginData.token);
    if (loginData.user)  sessionStorage.setItem("userData",  JSON.stringify(loginData.user));

    navigate(ROUTES[tipoLogin]);
  };

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen flex">
      {/* Painel institucional — desktop */}
      <aside className="hidden lg:flex lg:w-[42%] xl:w-[45%] relative overflow-hidden bg-gradient-to-br from-brand-800 via-brand-700 to-brand-900 text-white p-10 flex-col justify-between">
        <div className="absolute inset-0 opacity-[0.07]" aria-hidden>
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white" />
          <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-white translate-y-1/2 -translate-x-1/4" />
        </div>
        <div className="relative z-10">
          <p className="text-brand-200 text-sm font-semibold tracking-widest uppercase mb-6">
            SIHS Meet
          </p>
          <h1 className="text-3xl xl:text-4xl font-bold leading-tight tracking-tight">
            Agendamento inteligente de reuniões
          </h1>
          <p className="text-brand-100/90 mt-4 text-base leading-relaxed max-w-md">
            Gerencie salas, horários e aprovações em um só lugar — com visão clara do calendário e fluxo simplificado.
          </p>
        </div>
        <p className="relative z-10 text-sm text-brand-200/80">
          Secretaria de Infraestrutura Hídrica e Saneamento
        </p>
      </aside>

      {/* Formulário */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8 bg-gradient-to-br from-slate-50 via-white to-brand-50/30">
        <div className="w-full max-w-[400px] animate-fade-in">
          <div className="card-elevated overflow-hidden">
            <div className="px-6 sm:px-8 pt-8 pb-6 text-center border-b border-surface-border bg-slate-50/50">
              <div
                className={cn(
                  "w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-card",
                  theme.iconBg,
                )}
              >
                {isAdmin ? (
                  <Shield size={26} className={theme.iconColor} />
                ) : (
                  <LogIn size={26} className={theme.iconColor} />
                )}
              </div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                {isAdmin ? "Acesso Administrativo" : "Bem-vindo de volta"}
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Entre para gerenciar suas reuniões
              </p>
            </div>

            <div className="px-6 sm:px-8 py-6 space-y-5">
              <div className="segmented" role="tablist" aria-label="Tipo de acesso">
                {(["usuario", "admin"] as LoginType[]).map((tipo) => {
                  const active = tipoLogin === tipo;
                  const t = roleTheme[tipo === "admin" ? "admin" : "user"];
                  return (
                    <button
                      key={tipo}
                      role="tab"
                      aria-selected={active}
                      onClick={() => handleTipoLoginChange(tipo)}
                      disabled={loading}
                      className={cn(
                        active ? "segmented-item-active" : "segmented-item-inactive",
                        active && t.segmentedActive,
                      )}
                    >
                      {tipo === "usuario" ? "Usuário" : "Admin"}
                    </button>
                  );
                })}
              </div>

              {error && (
                <div role="alert" className="alert-error text-xs">
                  <AlertCircle size={15} className="flex-shrink-0 mt-0.5" />
                  {error}
                </div>
              )}

              <div>
                <label className="label" htmlFor="login-user">
                  {isAdmin ? "Administrador" : "Usuário"}
                </label>
                <div className="relative">
                  <User
                    size={15}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  />
                  <input
                    id="login-user"
                    type="text"
                    autoComplete="username"
                    value={usuario}
                    onChange={(e) => {
                      setUsuario(e.target.value);
                      clearError();
                    }}
                    onKeyDown={handleKeyDown}
                    disabled={loading}
                    placeholder={isAdmin ? "suporte.setor" : "setor.sihs"}
                    className={cn("input pl-10", theme.inputFocus)}
                  />
                </div>
              </div>

              <div>
                <label className="label" htmlFor="login-password">
                  Senha
                </label>
                <div className="relative">
                  <Lock
                    size={15}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  />
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      clearError();
                    }}
                    onKeyDown={handleKeyDown}
                    disabled={loading}
                    placeholder="••••••••"
                    className={cn("input pl-10 pr-11", theme.inputFocus)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    disabled={loading}
                    aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className={cn("w-full !py-3", theme.btnPrimary)}
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Entrando...
                  </>
                ) : (
                  <>
                    {isAdmin ? <Shield size={16} /> : <LogIn size={16} />}
                    {isAdmin ? "Entrar como Administrador" : "Entrar"}
                  </>
                )}
              </button>
            </div>
          </div>

          <p className="text-center text-xs text-slate-400 mt-5 lg:hidden">
            SIHS · Secretaria de Infraestrutura Hídrica e Saneamento
          </p>
        </div>
      </main>

      {modalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="login-success-title"
          className="modal-overlay"
          onClick={() => setModalOpen(false)}
        >
          <div className="modal-panel max-w-sm" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 pt-6 pb-5 border-b border-surface-border text-center relative">
              <button
                onClick={() => setModalOpen(false)}
                aria-label="Fechar"
                className="absolute right-4 top-4 p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X size={16} />
              </button>
              <div
                className={cn(
                  "w-12 h-12 rounded-2xl mx-auto mb-3 flex items-center justify-center",
                  theme.iconBg,
                )}
              >
                {isAdmin ? (
                  <Shield size={24} className={theme.iconColor} />
                ) : (
                  <CheckCircle size={24} className={theme.iconColor} />
                )}
              </div>
              <h2 id="login-success-title" className="text-base font-bold text-slate-900">
                Login realizado com sucesso
              </h2>
              <p className="text-sm text-slate-500 mt-0.5">
                Confirme seus dados antes de continuar
              </p>
            </div>

            <div className="px-6 py-5 space-y-4">
              <div className="space-y-2">
                {[
                  { label: "Usuário", value: usuario },
                  { label: "Tipo de acesso", value: isAdmin ? "Administrador" : "Usuário" },
                ].map(({ label, value }) => (
                  <div key={label} className="info-chip">
                    <p className="text-xs text-slate-400 mb-0.5">{label}</p>
                    <p className={cn("text-sm font-bold", theme.iconColor)}>{value}</p>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 pt-1">
                <button onClick={() => setModalOpen(false)} className="btn-secondary flex-1">
                  Cancelar
                </button>
                <button onClick={handleConfirmLogin} className={cn("flex-1", theme.btnPrimary)}>
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}