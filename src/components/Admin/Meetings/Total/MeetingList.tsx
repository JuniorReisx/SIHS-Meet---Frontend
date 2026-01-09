
import { FileText } from "lucide-react";
import { MeetingCard } from "./MeetingCard";

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
  status: 'confirmed' | 'pending' | 'denied';
}

interface TotalMeetingsListProps {
  meetings: Meeting[];
}

export function MeetingList({ meetings }: TotalMeetingsListProps) {
  const safeMeetings = Array.isArray(meetings) ? meetings : [];

  if (safeMeetings.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-md border-2 border-purple-200 overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-purple-400 via-indigo-400 to-blue-400"></div>
        <div className="p-16 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center">
            <FileText size={40} className="text-purple-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            Nenhuma reunião encontrada
          </h3>
          <p className="text-gray-500">
            Ajuste os filtros para visualizar reuniões
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-300 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-400 flex items-center justify-center">
              <FileText size={20} className="text-white" />
            </div>
            <div>
              <h4 className="font-bold text-gray-800">
                {safeMeetings.length} {safeMeetings.length === 1 ? 'reunião encontrada' : 'reuniões encontradas'}
              </h4>
              <p className="text-sm text-gray-600">Visualização completa do sistema</p>
            </div>
          </div>
        </div>
      </div>

      {safeMeetings.map(meeting => (
        <MeetingCard
          key={meeting.id}
          meeting={meeting}
        />
      ))}
    </div>
  );
}