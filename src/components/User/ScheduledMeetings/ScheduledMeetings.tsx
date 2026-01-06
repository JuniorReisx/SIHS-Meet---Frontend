import { useEffect, useState } from "react";
import { Calendar, Clock, Users, MapPin, AlertCircle, Loader2, RefreshCw, FileText } from "lucide-react";
import { getAllMeetings } from "../../../services/meetingService";
import type { Meeting } from "../../../types/types";

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

  const getDiaSemana = (data: string) => {
    const dias = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const date = new Date(data + 'T00:00:00');
    return dias[date.getDay()];
  };

  // Estado de Loading
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
              Reuniões Confirmadas
            </h2>
            <p className="text-gray-600">Carregando suas reuniões...</p>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg p-16 border border-gray-100">
          <div className="flex flex-col items-center justify-center">
            <div className="relative mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center animate-pulse">
                <Loader2 size={40} className="text-white animate-spin" />
              </div>
            </div>
            <p className="text-gray-700 text-xl font-semibold">Carregando reuniões...</p>
            <p className="text-gray-500 text-sm mt-2">Aguarde um momento</p>
          </div>
        </div>
      </div>
    );
  }

  // Estado de Erro
  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
              Reuniões Confirmadas
            </h2>
            <p className="text-gray-600">Gerenciamento de reuniões</p>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <div className="bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-500 p-8 rounded-r-xl">
            <div className="flex items-start gap-4">
              <div className="bg-red-500 p-3 rounded-full flex-shrink-0">
                <AlertCircle size={28} className="text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-red-900 font-bold text-xl mb-3">
                  Ops! Algo deu errado
                </h3>
                <p className="text-red-800 mb-6 text-lg">{error}</p>
                <button
                  onClick={loadMeetings}
                  className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-8 py-3 rounded-xl transition-all duration-200 font-semibold shadow-lg hover:shadow-xl flex items-center gap-2"
                >
                  <RefreshCw size={20} />
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            Reuniões Confirmada
          </h2>
          <p className="text-gray-600">
            {reunioes.length === 0 
              ? "Nenhuma reunião cadastrada" 
              : `${reunioes.length} ${reunioes.length === 1 ? 'reunião encontrada' : 'reuniões encontradas'}`
            }
          </p>
        </div>
        <button
          onClick={loadMeetings}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-3 rounded-xl transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
        >
          <RefreshCw size={18} />
          Atualizar
        </button>
      </div>

      {reunioes.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg p-16 text-center border border-gray-100">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <Calendar size={48} className="text-blue-500" />
          </div>
          <h3 className="text-gray-800 text-2xl font-bold mb-3">Nenhuma reunião agendada</h3>
          <p className="text-gray-500 text-lg">
            Comece criando sua primeira reunião clicando em "Nova Reunião"
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {reunioes.map((reuniao) => (
            <div
              key={reuniao.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden group hover:-translate-y-1"
            >
              {/* Header do Card com Gradiente */}
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-xl font-bold flex-1 leading-tight">
                    {reuniao.title}
                  </h3>
                  <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-lg text-sm font-semibold">
                    {getDiaSemana(reuniao.meeting_date)}
                  </div>
                </div>
              </div>

              {/* Corpo do Card */}
              <div className="p-6 space-y-4">
                {/* Data e Hora - Destaque */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-500 p-2 rounded-lg">
                        <Calendar size={20} className="text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-blue-600 font-semibold uppercase tracking-wide">Data</p>
                        <p className="font-bold text-gray-800 text-lg">
                          {formatData(reuniao.meeting_date)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-4 border border-indigo-200">
                    <div className="flex items-center gap-3">
                      <div className="bg-indigo-500 p-2 rounded-lg">
                        <Clock size={20} className="text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-indigo-600 font-semibold uppercase tracking-wide">Horário</p>
                        <p className="font-bold text-gray-800 text-lg">
                          {reuniao.start_time}
                          {reuniao.end_time && ` - ${reuniao.end_time}`}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Local e Participantes */}
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 border border-gray-200">
                    <div className="bg-purple-500 p-2 rounded-lg flex-shrink-0">
                      <MapPin size={18} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-purple-600 font-semibold uppercase tracking-wide mb-1">Local</p>
                      <p className="font-semibold text-gray-800 truncate">{reuniao.location}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 border border-gray-200">
                    <div className="bg-green-500 p-2 rounded-lg flex-shrink-0">
                      <Users size={18} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-green-600 font-semibold uppercase tracking-wide mb-1">Participantes</p>
                      <p className="font-semibold text-gray-800 line-clamp-2">{reuniao.participants_count}</p>
                    </div>
                  </div>
                </div>

                {/* Descrição */}
                {reuniao.description && (
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-2 mb-3">
                      <FileText size={18} className="text-gray-600" />
                      <p className="text-sm font-bold text-gray-700 uppercase tracking-wide">
                        Descrição
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-200">
                      <p className="text-gray-700 leading-relaxed">
                        {reuniao.description}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer com Animação */}
              <div className="h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}