import { History } from "lucide-react";
import { MeetingCard } from "../Total/MeetingCard";
import type { Meeting } from "../../../../types/types";

interface HistoricoMeetingsListProps {
  meetings: Meeting[];
}

export function HistoricoMeetingsList({ meetings }: HistoricoMeetingsListProps) {
  const safe = Array.isArray(meetings) ? meetings : [];

  if (safe.length === 0) {
    return (
      <div className="card p-12 text-center">
        <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-slate-100 flex items-center justify-center">
          <History size={28} className="text-slate-400" />
        </div>
        <p className="font-semibold text-slate-700 mb-1">Nenhuma reunião no histórico</p>
        <p className="text-sm text-slate-500 max-w-sm mx-auto">
          Reuniões encerradas aparecem aqui. No calendário você ainda pode consultar datas passadas.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-500">
        <strong className="text-slate-700">{safe.length}</strong>{" "}
        {safe.length === 1 ? "reunião encerrada" : "reuniões encerradas"}
        {" · "}
        Ordenadas da mais recente para a mais antiga
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {safe.map((meeting) => (
          <div key={`hist-${meeting.status ?? "x"}-${meeting.id}`} className="opacity-90">
            <MeetingCard meeting={meeting} />
          </div>
        ))}
      </div>
    </div>
  );
}
