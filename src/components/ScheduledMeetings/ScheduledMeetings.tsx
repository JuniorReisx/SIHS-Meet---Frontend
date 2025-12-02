import { useEffect, useState } from "react";
import { Calendar, Clock, Users, MapPin, AlertCircle, Loader2 } from "lucide-react";
import { getAllMeetings } from "../../services/meetingService";
import type { Meeting } from "../../types/types";

export function ScheduledMeetings() {
  const [reunioes, setReunioes] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadMeetings();
  }, []);

  const loadMeetings = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllMeetings();
      setReunioes(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao carregar reuniões";
      setError(errorMessage);
      console.error("Erro ao carregar reuniões:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatData = (data: string) => {
    const [ano, mes, dia] = data.split("-");
    return `${dia}/${mes}/${ano}`;
  };

  // Estado de Loading
  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-blue-900 mb-6">
          Reuniões Agendadas
        </h2>
        <div className="bg-white rounded-xl shadow-md p-12">
          <div className="flex flex-col items-center justify-center">
            <Loader2 size={48} className="text-blue-500 animate-spin mb-4" />
            <p className="text-gray-600 text-lg font-medium">Carregando reuniões...</p>
            <p className="text-gray-400 text-sm mt-2">Aguarde um momento</p>
          </div>
        </div>
      </div>
    );
  }

  // Estado de Erro
  if (error) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-blue-900 mb-6">
          Reuniões Agendadas
        </h2>
        <div className="bg-white rounded-xl shadow-md p-8">
          <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-lg">
            <div className="flex items-start gap-3">
              <AlertCircle size={24} className="text-red-500 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="text-red-800 font-semibold text-lg mb-2">
                  Erro ao carregar reuniões
                </h3>
                <p className="text-red-700 mb-4">{error}</p>
                <button
                  onClick={loadMeetings}
                  className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-colors font-medium"
                >
                  Tentar Novamente
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Estado Normal - Lista de Reuniões
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-blue-900">
          Reuniões Agendadas ({reunioes.length})
        </h2>
        <button
          onClick={loadMeetings}
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Atualizar
        </button>
      </div>

      {reunioes.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <Calendar size={64} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg font-medium">Nenhuma reunião cadastrada</p>
          <p className="text-gray-400 text-sm mt-2">
            Clique em "Nova Reunião" para começar
          </p>
        </div>
      ) : (
        reunioes.map((reuniao) => (
          <div
            key={reuniao.id}
            className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 border-l-4 border-blue-500 transform hover:-translate-y-1"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800">
                  {reuniao.title}
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="flex items-center gap-3 text-gray-600">
                  <div className="bg-blue-50 p-2 rounded-lg">
                    <Calendar size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Data</p>
                    <span className="font-semibold text-gray-800">
                      {formatData(reuniao.date)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-gray-600">
                  <div className="bg-blue-50 p-2 rounded-lg">
                    <Clock size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Horário</p>
                    <span className="font-semibold text-gray-800">
                      {reuniao.time}
                      {reuniao.endTime && ` - ${reuniao.endTime}`}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-gray-600">
                  <div className="bg-blue-50 p-2 rounded-lg">
                    <MapPin size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Local</p>
                    <span className="font-semibold text-gray-800">{reuniao.location}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-gray-600">
                  <div className="bg-blue-50 p-2 rounded-lg">
                    <Users size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Participantes</p>
                    <span className="font-semibold text-gray-800">{reuniao.participants}</span>
                  </div>
                </div>
              </div>

              {reuniao.description && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Descrição:
                  </p>
                  <p className="text-gray-600 leading-relaxed bg-gray-50 p-3 rounded-lg">
                    {reuniao.description}
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