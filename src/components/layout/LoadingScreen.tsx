import { Loader2 } from "lucide-react";
import { cn } from "../../lib/cn";
import { roleTheme, type AppRole } from "../../theme/variants";

interface LoadingScreenProps {
  message?: string;
  role?: AppRole;
}

export function LoadingScreen({
  message = "Carregando...",
  role = "user",
}: LoadingScreenProps) {
  const theme = roleTheme[role];

  return (
    <div className={cn("flex items-center justify-center min-h-[60vh]", theme.shell)}>
      <div className="flex flex-col items-center gap-4 animate-fade-in">
        <div
          className={cn(
            "w-14 h-14 rounded-2xl flex items-center justify-center shadow-card",
            theme.iconBg,
          )}
        >
          <Loader2 size={28} className={cn("animate-spin", theme.iconColor)} />
        </div>
        <p className="text-sm font-medium text-slate-600">{message}</p>
      </div>
    </div>
  );
}
