import logo from "/src/assets/SIHS.jpg";
import { LogOut, Shield, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { cn } from "../../lib/cn";
import { roleTheme, type AppRole } from "../../theme/variants";

interface AppHeaderProps {
  role: AppRole;
}

export function AppHeader({ role }: AppHeaderProps) {
  const navigate = useNavigate();
  const theme = roleTheme[role];
  const isAdmin = role === "admin";
  const [username] = useState(
    () => sessionStorage.getItem("username") || localStorage.getItem("username") || "",
  );

  const handleLogout = () => {
    if (!confirm("Tem certeza que deseja sair?")) return;
    ["isAuthenticated", "userRole", "username", "userSetor", "authToken", "userData"].forEach(
      (key) => {
        sessionStorage.removeItem(key);
        localStorage.removeItem(key);
      },
    );
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-surface-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative flex-shrink-0">
              <img
                src={logo}
                alt="Logo SIHS"
                className="h-10 w-10 object-contain rounded-xl ring-2 ring-white shadow-card"
              />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base font-bold text-slate-900 leading-tight">
                  SIHS Meet
                </h1>
                <span className="hidden sm:inline text-slate-300">·</span>
                <span className="hidden sm:inline text-sm text-slate-500 truncate">
                  Agendamento de Reuniões
                </span>
              </div>
              <p className={cn("text-xs font-semibold uppercase tracking-widest sm:hidden", theme.mobileLabel)}>
                {isAdmin ? "Painel Admin" : "Área do Usuário"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {username && (
              <div
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-xl border",
                  theme.headerBadge,
                )}
              >
                {isAdmin ? (
                  <Shield size={14} className={cn("flex-shrink-0", theme.badgeIcon)} />
                ) : (
                  <User size={14} className={cn("flex-shrink-0", theme.badgeIcon)} />
                )}
                <div className="hidden sm:block">
                  <p className={cn("text-[10px] font-medium leading-none mb-0.5", theme.badgeLabel)}>
                    {isAdmin ? "Administrador" : "Usuário"}
                  </p>
                  <p className="text-sm font-bold text-slate-800 leading-none truncate max-w-[140px]">
                    {username}
                  </p>
                </div>
                <span className="sm:hidden text-sm font-bold text-slate-800 max-w-[72px] truncate">
                  {username}
                </span>
              </div>
            )}

            <button
              onClick={handleLogout}
              aria-label="Sair do sistema"
              className="btn-danger-ghost !py-2 !px-3"
            >
              <LogOut size={15} />
              <span className="hidden sm:inline">Sair</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
