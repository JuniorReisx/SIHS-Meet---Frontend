import { Calendar, Clock, Users, MapPin } from "lucide-react";

interface Reuniao {
  id: number;
  titulo: string;
  data: string;
  horario: string;
  local: string;
  participantes: string;
  descricao: string;
}

interface ScheduledMeetingsProps {
  reunioes: Reuniao[];
}

export function ScheduledMeetings({ reunioes }: ScheduledMeetingsProps) {
  const formatData = (data: string) => {
    const [ano, mes, dia] = data.split("-");
    return `${dia}/${mes}/${ano}`;
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-blue-900 mb-6">
        Reuniões Agendadas ({reunioes.length})
      </h2>

      {reunioes.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <Calendar size={64} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg">Nenhuma reunião cadastrada</p>
          <p className="text-gray-400 text-sm mt-2">
            Clique em "Nova Reunião" para começar
          </p>
        </div>
      ) : (
        reunioes.map((reuniao) => (
          <div
            key={reuniao.id}
            className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow border-l-4 border-blue-500"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800 flex-1">
                  {reuniao.titulo}
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="flex items-center gap-3 text-gray-600">
                  <Calendar size={20} className="text-blue-600" />
                  <span className="font-medium">
                    {formatData(reuniao.data)}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <Clock size={20} className="text-blue-600" />
                  <span className="font-medium">{reuniao.horario}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <MapPin size={20} className="text-blue-600" />
                  <span className="font-medium">{reuniao.local}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <Users size={20} className="text-blue-600" />
                  <span className="font-medium">{reuniao.participantes}</span>
                </div>
              </div>

              {reuniao.descricao && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-sm font-semibold text-gray-700 mb-2">
                    Descrição:
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    {reuniao.descricao}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
