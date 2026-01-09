
import { useState } from "react";
import { Calendar, Clock, MapPin, Users, User, Building2, CheckCircle, XCircle, Clock as PendingIcon } from "lucide-react";

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

interface TotalMeetingCardProps {
  meeting: Meeting;
}

export function MeetingCard({ meeting }: TotalMeetingCardProps) {
  const [expanded, setExpanded] = useState(false);

  const getStatusConfig = () => {
    switch (meeting.status) {
      case 'confirmed':
        return {
          color: 'green',
          label: 'CONFIRMADA',
          icon: CheckCircle,
          gradient: 'from-green-400 via-emerald-400 to-teal-400',
          bg: 'bg-green-100',
          text: 'text-green-800',
          border: 'border-green-300'
        };
      case 'pending':
        return {
          color: 'yellow',
          label: 'PENDENTE',
          icon: PendingIcon,
          gradient: 'from-yellow-400 via-amber-400 to-orange-400',
          bg: 'bg-yellow-100',
          text: 'text-yellow-800',
          border: 'border-yellow-300'
        };
      case 'denied':
        return {
          color: 'red',
          label: 'NEGADA',
          icon: XCircle,
          gradient: 'from-red-400 via-rose-400 to-pink-400',
          bg: 'bg-red-100',
          text: 'text-red-800',
          border: 'border-red-300'
        };
    }
  };

  const statusConfig = getStatusConfig();
  const StatusIcon = statusConfig.icon;

  return (
    <div className={`bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border-2 border-${statusConfig.color}-200 overflow-hidden group`}>
      <div className={`h-2 bg-gradient-to-r ${statusConfig.gradient}`}></div>
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 ${statusConfig.bg} ${statusConfig.text} rounded-full text-xs font-bold border-2 ${statusConfig.border}`}>
            <StatusIcon size={16} />
            {statusConfig.label}
          </span>
        </div>

        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            {meeting.title}
          </h3>
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-medium">
            <Users size={14} />
            {meeting.participants_count} participantes
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <div className="flex items-center gap-2 text-gray-600">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
              <Calendar size={16} className="text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Data</p>
              <p className="text-sm font-medium">{new Date(meeting.meeting_date).toLocaleDateString('pt-BR')}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-gray-600">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
              <Clock size={16} className="text-indigo-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Horário</p>
              <p className="text-sm font-medium">
                {meeting.start_time} - {meeting.end_time || "N/A"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-gray-600">
            <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
              <MapPin size={16} className="text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Local</p>
              <p className="text-sm font-medium">{meeting.location}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-gray-600">
            <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
              <User size={16} className="text-orange-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Responsável</p>
              <p className="text-sm font-medium">{meeting.responsible}</p>
            </div>
          </div>
        </div>

        {expanded && (
          <div className={`mt-4 p-5 bg-gradient-to-br from-gray-50 to-${statusConfig.color}-50 rounded-xl border border-${statusConfig.color}-100 space-y-4`}>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Building2 size={16} className={`text-${statusConfig.color}-600`} />
                <h4 className="font-semibold text-gray-800 text-sm">Departamento</h4>
              </div>
              <p className="text-gray-700 text-sm pl-6">{meeting.responsible_department}</p>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <svg className={`w-4 h-4 text-${statusConfig.color}-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h4 className="font-semibold text-gray-800 text-sm">Descrição</h4>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed pl-6">
                {meeting.description || "Sem descrição disponível"}
              </p>
            </div>
          </div>
        )}

        <button 
          onClick={() => setExpanded(!expanded)} 
          className="w-full mt-4 py-2 text-sm text-gray-600 hover:text-gray-800 font-medium transition-colors"
        >
          {expanded ? "Ocultar detalhes ↑" : "Ver detalhes ↓"}
        </button>
      </div>
    </div>
  );
}