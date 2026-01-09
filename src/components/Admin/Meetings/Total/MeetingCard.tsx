
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

interface MeetingCardProps {
  meeting: Meeting;
}

export function MeetingCard({ meeting }: MeetingCardProps) {
  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
            Confirmada
          </span>
        );
      case 'pending':
        return (
          <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">
            Pendente
          </span>
        );
      case 'denied':
        return (
          <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
            Negada
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">
            Indefinido
          </span>
        );
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('pt-BR');
    } catch {
      return dateString;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6">
      <div className="flex items-start justify-between mb-4">
        <h3 className="font-bold text-lg text-gray-800 flex-1 pr-2">
          {meeting.title}
        </h3>
        {getStatusBadge(meeting.status)}
      </div>
      
      <div className="space-y-2 text-sm text-gray-600">
        <p>
          <strong className="text-gray-700">Data:</strong>{' '}
          {formatDate(meeting.meeting_date)}
        </p>
        <p>
          <strong className="text-gray-700">Horário:</strong>{' '}
          {meeting.start_time}
          {meeting.end_time && ` - ${meeting.end_time}`}
        </p>
        <p>
          <strong className="text-gray-700">Local:</strong>{' '}
          {meeting.location}
        </p>
        <p>
          <strong className="text-gray-700">Participantes:</strong>{' '}
          {meeting.participants_count}
        </p>
        <p>
          <strong className="text-gray-700">Responsável:</strong>{' '}
          {meeting.responsible}
        </p>
        <p>
          <strong className="text-gray-700">Departamento:</strong>{' '}
          {meeting.responsible_department}
        </p>
        {meeting.description && (
          <p className="pt-2 border-t border-gray-200">
            <strong className="text-gray-700">Descrição:</strong>{' '}
            <span className="text-gray-600">{meeting.description}</span>
          </p>
        )}
      </div>
    </div>
  );
}