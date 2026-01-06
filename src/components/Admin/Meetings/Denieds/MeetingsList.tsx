import { XCircle, RefreshCw } from "lucide-react";
import { DeniedMeetingCard } from "./MeetingCard";

interface Meeting {
  id: number;
  title: string;
  meeting_date: string;
  start_time: string;
  end_time?: string;
  location: string;
  participants_count: number;
  description: string;
  responsible: string;
  responsible_department: string;
}

interface MeetingsListProps {
  meetings: Meeting[];
  onRestore: (id: number) => void;
  onDelete: (id: number) => void;
}

export function DeniedMeetingsList({
  meetings,
  onRestore,
  onDelete
}: MeetingsListProps) {
  // Garante que meetings é sempre um array
  const safeMeetings = Array.isArray(meetings) ? meetings : [];
  
  if (safeMeetings.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-md border-2 border-red-200 overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-red-400 via-rose-400 to-pink-400"></div>
        <div className="p-16 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-red-100 to-rose-100 flex items-center justify-center">
            <XCircle size={40} className="text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            Nenhuma reunião negada
          </h3>
          <p className="text-gray-500 mb-6">
            As reuniões recusadas aparecerão aqui
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium border-2 border-red-200">
            <XCircle size={16} />
            Nenhuma reunião foi negada
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-red-50 to-rose-50 border-2 border-red-300 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-400 flex items-center justify-center">
              <XCircle size={20} className="text-white" />
            </div>
            <div>
              <h4 className="font-bold text-gray-800">
                {safeMeetings.length} {safeMeetings.length === 1 ? 'reunião negada' : 'reuniões negadas'}
              </h4>
              <p className="text-sm text-gray-600">Você pode restaurar ou excluir permanentemente</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-red-200">
            <RefreshCw size={16} className="text-red-600" />
            <span className="text-xs font-medium text-gray-700">Restaurar = Volta como pendente</span>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h5 className="text-sm font-semibold text-blue-900 mb-1">Informação</h5>
            <p className="text-xs text-blue-800">
              <strong>Restaurar:</strong> Move a reunião de volta para a lista de pendentes, permitindo nova análise.
              <br />
              <strong>Excluir:</strong> Remove permanentemente a reunião do sistema. Esta ação não pode ser desfeita.
            </p>
          </div>
        </div>
      </div>

      {safeMeetings.map(meeting => (
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