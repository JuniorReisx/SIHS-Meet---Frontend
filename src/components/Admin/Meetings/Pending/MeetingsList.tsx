import { Calendar, Clock } from "lucide-react";
import { PendingMeetingCard } from "./MeetingCard";

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
  onApprove: (id: number) => void;
  onDeny: (id: number) => void;
}

export function PendingMeetingsList({
  meetings,
  onApprove,
  onDeny
}: MeetingsListProps) {
  // Garante que meetings é sempre um array
  const safeMeetings = Array.isArray(meetings) ? meetings : [];
  
  if (safeMeetings.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-md border-2 border-yellow-200 overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400"></div>
        <div className="p-16 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-yellow-100 to-orange-100 flex items-center justify-center">
            <Clock size={40} className="text-yellow-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            Tudo em dia!
          </h3>
          <p className="text-gray-500 mb-6">
            Não há reuniões pendentes de aprovação no momento
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-50 text-yellow-600 rounded-lg text-sm font-medium border-2 border-yellow-200">
            <Calendar size={16} />
            Todas as reuniões foram processadas
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center">
              <Clock size={20} className="text-white" />
            </div>
            <div>
              <h4 className="font-bold text-gray-800">
                {safeMeetings.length} {safeMeetings.length === 1 ? 'reunião pendente' : 'reuniões pendentes'}
              </h4>
              <p className="text-sm text-gray-600">Aguardando sua aprovação</p>
            </div>
          </div>
        </div>
      </div>

      {safeMeetings.map(meeting => (
        <PendingMeetingCard
          key={meeting.id}
          meeting={meeting}
          onApprove={onApprove}
          onDeny={onDeny}
        />
      ))}
    </div>
  );
}