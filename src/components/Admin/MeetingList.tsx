import { Calendar, CalendarPlus } from "lucide-react";
import type { Meeting } from "../../types/types";
import { MeetingCard } from "./MeetingCard";

interface Props {
  meetings: Meeting[];
  expanded: Set<number>;
  onToggle: (id: number) => void;
  onEdit: (m: Meeting) => void;
  onDelete: (id: number) => void;
}

export function MeetingList({
  meetings,
  expanded,
  onToggle,
  onEdit,
  onDelete
}: Props) {
  if (meetings.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600"></div>
        <div className="p-16 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
            <Calendar size={40} className="text-purple-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            Nenhuma reunião agendada
          </h3>
          <p className="text-gray-500 mb-6">
            Comece criando sua primeira reunião clicando no botão acima
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-600 rounded-lg text-sm font-medium">
            <CalendarPlus size={16} />
            Clique em "Nova Reunião" para começar
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-800">
          Reuniões Agendadas
        </h2>
        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
          {meetings.length} {meetings.length === 1 ? 'reunião' : 'reuniões'}
        </span>
      </div>
      
      {meetings.map(m => (
        <MeetingCard
          key={m.id}
          meeting={m}
          expanded={expanded.has(m.id)}
          onToggle={() => onToggle(m.id)}
          onEdit={() => onEdit(m)}
          onDelete={() => onDelete(m.id)}
        />
      ))}
    </div>
  );
}