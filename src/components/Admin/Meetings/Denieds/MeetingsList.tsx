import { XCircle } from "lucide-react";
import { DeniedMeetingCard } from "./MeetingCard";
import type { Meeting } from "../../../../types/types";

interface MeetingsListProps {
  meetings: Meeting[];
  onRestore: (id: number) => void;
  onDelete: (id: number) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function DeniedMeetingsList({ meetings, onRestore, onDelete }: MeetingsListProps) {
  const safeMeetings = Array.isArray(meetings) ? meetings : [];

  if (safeMeetings.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
        <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-red-50 flex items-center justify-center">
          <XCircle size={28} className="text-red-400" />
        </div>
        <p className="font-semibold text-gray-700 mb-1">Nenhuma reunião negada</p>
        <p className="text-sm text-gray-400">As reuniões recusadas aparecerão aqui.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Dica discreta: restaurar volta como pendente */}
      <p className="text-xs text-gray-400 px-1">
        <span className="font-semibold text-gray-500">Restaurar</span> move a reunião de volta para pendentes ·{" "}
        <span className="font-semibold text-gray-500">Excluir</span> remove permanentemente
      </p>

      {safeMeetings.map((meeting) => (
        <DeniedMeetingCard
          key={meeting.id}
          meeting={meeting}
          onRestore={onRestore}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}