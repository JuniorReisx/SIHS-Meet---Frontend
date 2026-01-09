import { List } from 'lucide-react';
import { MeetingCard } from './MeetingCard';

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
  status?: 'confirmed' | 'pending' | 'denied';
}

interface MeetingsListProps {
  meetings: Meeting[];
}

export function TotalMeetingsList({ meetings }: MeetingsListProps) {
  if (meetings.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-8 text-center">
        <List size={48} className="mx-auto text-gray-300 mb-4" />
        <p className="text-gray-500 text-lg font-medium">
          Nenhuma reunião encontrada
        </p>
        <p className="text-gray-400 text-sm mt-2">
          As reuniões aparecerão aqui quando forem criadas
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-600">
          Exibindo <strong>{meetings.length}</strong>{' '}
          {meetings.length === 1 ? 'reunião' : 'reuniões'}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {meetings.map((meeting) => (
          <MeetingCard
            key={`${meeting.status}-${meeting.id}`}
            meeting={meeting}
          />
        ))}
      </div>
    </div>
  );
}