import { Calendar, Clock, MapPin } from "lucide-react";
import type { Meeting } from "../../../../types/types";

interface Props {
  meetings: Meeting[];
}

export function MeetingDashboard({ meetings }: Props) {
  const upcoming7days = meetings.filter(m => {
    const meetingDate = new Date(m.meeting_date);
    const today = new Date();
    const sevenDays = new Date(today.getTime() + 7 * 86400000);
    return meetingDate >= today && meetingDate <= sevenDays;
  }).length;

  const uniqueLocations = new Set(
    meetings.map(m => m.location).filter(Boolean)
  ).size;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Total */}
      <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-600">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm font-semibold">Total de Reuniões</p>
            <p className="text-3xl font-bold text-purple-600">{meetings.length}</p>
          </div>
          <Calendar size={48} className="text-purple-300" />
        </div>
      </div>

      {/* Próximos 7 dias */}
      <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-600">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm font-semibold">Próximos 7 dias</p>
            <p className="text-3xl font-bold text-blue-600">{upcoming7days}</p>
          </div>
          <Clock size={48} className="text-blue-300" />
        </div>
      </div>

      {/* Locais únicos */}
      <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-600">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm font-semibold">Locais únicos</p>
            <p className="text-3xl font-bold text-green-600">{uniqueLocations}</p>
          </div>
          <MapPin size={48} className="text-green-300" />
        </div>
      </div>
    </div>
  );
}
