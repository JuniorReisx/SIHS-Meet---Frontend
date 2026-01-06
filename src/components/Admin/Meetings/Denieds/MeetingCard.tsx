import { Calendar, Clock, MapPin, Users, User, Building2, RefreshCw, Trash2 } from "lucide-react";
import { useState } from 'react';
import { API_URL } from "../../../../config/api";

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

interface Props {
  meeting: Meeting;
  onRestore: (meetingId: number) => void;
  onDelete: (meetingId: number) => void;
}

export function DeniedMeetingCard({ meeting, onRestore, onDelete }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState<'restore' | 'delete' | null>(null);

  const handleRestore = async () => {
    setLoading('restore');
    try {
      // POST para meetingsPending (restaurar como pendente)
      const response = await fetch(`${API_URL}/meetingsPending`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(meeting),
      });

      if (!response.ok) {
        throw new Error('Erro ao restaurar reunião');
      }

      // DELETE da tabela denied
      const deleteResponse = await fetch(`${API_URL}/meetingsDenied/${meeting.id}`, {
        method: 'DELETE',
      });

      if (!deleteResponse.ok) {
        throw new Error('Erro ao remover reunião negada');
      }

      onRestore(meeting.id);
    } catch (error) {
      console.error('Erro ao restaurar reunião:', error);
      alert('Erro ao processar a restauração da reunião');
    } finally {
      setLoading(null);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      `Tem certeza que deseja excluir permanentemente a reunião "${meeting.title}"? Esta ação não pode ser desfeita.`
    );

    if (!confirmDelete) return;

    setLoading('delete');
    try {
      // DELETE permanente da tabela denied
      const deleteResponse = await fetch(`${API_URL}/meetingsDenied/${meeting.id}`, {
        method: 'DELETE',
      });

      if (!deleteResponse.ok) {
        throw new Error('Erro ao excluir reunião');
      }

      onDelete(meeting.id);
    } catch (error) {
      console.error('Erro ao excluir reunião:', error);
      alert('Erro ao processar a exclusão da reunião');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border-2 border-red-200 overflow-hidden group">
      <div className="h-2 bg-gradient-to-r from-red-400 via-rose-400 to-pink-400"></div>
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-100 text-red-800 rounded-full text-xs font-bold border-2 border-red-300">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            REUNIÃO NEGADA
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
              <p className="text-sm font-medium">{meeting.meeting_date}</p>
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
          <div className="mt-4 p-5 bg-gradient-to-br from-gray-50 to-red-50 rounded-xl border border-red-100 space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Building2 size={16} className="text-red-600" />
                <h4 className="font-semibold text-gray-800 text-sm">Departamento</h4>
              </div>
              <p className="text-gray-700 text-sm pl-6">{meeting.responsible_department}</p>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h4 className="font-semibold text-gray-800 text-sm">Descrição</h4>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed pl-6">
                {meeting.description || "Sem descrição disponível"}
              </p>
            </div>

            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-xs text-red-700 flex items-start gap-2">
                <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Esta reunião foi negada e pode ser restaurada como pendente ou excluída permanentemente.</span>
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

        <div className="flex gap-3 mt-5 pt-4 border-t border-gray-200">
          <button 
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl transition-all duration-200 font-semibold text-sm shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed group/restore"
            onClick={handleRestore}
            disabled={loading !== null}
          >
            <RefreshCw size={20} className="group-hover/restore:scale-110 transition-transform" />
            {loading === 'restore' ? 'Restaurando...' : 'Restaurar'}
          </button>

          <button 
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white rounded-xl transition-all duration-200 font-semibold text-sm shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed group/delete"
            onClick={handleDelete}
            disabled={loading !== null}
          >
            <Trash2 size={20} className="group-hover/delete:scale-110 transition-transform" />
            {loading === 'delete' ? 'Excluindo...' : 'Excluir'}
          </button>
        </div>
      </div>
    </div>
  );
}