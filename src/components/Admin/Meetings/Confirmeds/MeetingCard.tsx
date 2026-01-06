import { useState } from "react";
import { CheckCircle, Pencil, Trash2, Calendar, Clock, MapPin, Users, User, Building2, X, Save } from "lucide-react";
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

interface ConfirmedMeetingsListProps {
  meetings: Meeting[];
  onUpdate?: () => void;
}

function ConfirmedMeetingCard({ meeting, onUpdate }: { meeting: Meeting; onUpdate?: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(meeting);

  const handleDelete = async () => {
    if (!window.confirm(`Tem certeza que deseja excluir a reunião "${meeting.title}"?`)) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/meetingsConfirmed/${meeting.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erro ao excluir reunião');
      }

      alert('Reunião excluída com sucesso!');
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Erro ao excluir reunião:', error);
      alert('Erro ao excluir reunião');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/meetingsConfirmed/${meeting.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Erro ao atualizar reunião');
      }

      alert('Reunião atualizada com sucesso!');
      setIsEditing(false);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Erro ao atualizar reunião:', error);
      alert('Erro ao atualizar reunião');
    } finally {
      setLoading(false);
    }
  };

  if (isEditing) {
    return (
      <div className="bg-white rounded-2xl shadow-md border-2 border-green-200 overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400"></div>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-800">Editar Reunião</h3>
            <button onClick={() => setIsEditing(false)} className="text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Título</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Data</label>
                <input
                  type="date"
                  value={formData.meeting_date}
                  onChange={(e) => setFormData({...formData, meeting_date: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Participantes</label>
                <input
                  type="number"
                  value={formData.participants_count}
                  onChange={(e) => setFormData({...formData, participants_count: parseInt(e.target.value)})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none"
                  min="1"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Hora Início</label>
                <input
                  type="time"
                  value={formData.start_time}
                  onChange={(e) => setFormData({...formData, start_time: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Hora Fim</label>
                <input
                  type="time"
                  value={formData.end_time || ''}
                  onChange={(e) => setFormData({...formData, end_time: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Local</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Responsável</label>
              <input
                type="text"
                value={formData.responsible}
                onChange={(e) => setFormData({...formData, responsible: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Departamento</label>
              <input
                type="text"
                value={formData.responsible_department}
                onChange={(e) => setFormData({...formData, responsible_department: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Descrição</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none resize-none"
                rows={4}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => setIsEditing(false)}
                disabled={loading}
                className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl font-semibold transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl font-semibold transition-all shadow-md hover:shadow-lg disabled:opacity-50"
              >
                <Save size={20} />
                {loading ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border-2 border-green-200 overflow-hidden group">
      <div className="h-2 bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400"></div>
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-100 text-green-800 rounded-full text-xs font-bold border-2 border-green-300">
            <CheckCircle size={16} />
            CONFIRMADA
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
          <div className="mt-4 p-5 bg-gradient-to-br from-gray-50 to-green-50 rounded-xl border border-green-100 space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Building2 size={16} className="text-green-600" />
                <h4 className="font-semibold text-gray-800 text-sm">Departamento</h4>
              </div>
              <p className="text-gray-700 text-sm pl-6">{meeting.responsible_department}</p>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

        <div className="flex gap-3 mt-5 pt-4 border-t border-gray-200">
          <button 
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl transition-all duration-200 font-semibold text-sm shadow-md hover:shadow-lg group/edit disabled:opacity-50"
            onClick={() => setIsEditing(true)}
            disabled={loading}
          >
            <Pencil size={20} className="group-hover/edit:scale-110 transition-transform" />
            Editar
          </button>

          <button 
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl transition-all duration-200 font-semibold text-sm shadow-md hover:shadow-lg group/delete disabled:opacity-50"
            onClick={handleDelete}
            disabled={loading}
          >
            <Trash2 size={20} className="group-hover/delete:scale-110 transition-transform" />
            {loading ? 'Excluindo...' : 'Excluir'}
          </button>
        </div>
      </div>
    </div>
  );
}

export function ConfirmedMeetingsList({ meetings, onUpdate }: ConfirmedMeetingsListProps) {
  const safeMeetings = Array.isArray(meetings) ? meetings : [];

  if (safeMeetings.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-md border-2 border-green-200 overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400"></div>
        <div className="p-16 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
            <CheckCircle size={40} className="text-green-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            Nenhuma reunião confirmada
          </h3>
          <p className="text-gray-500">
            As reuniões aprovadas aparecerão aqui
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-400 flex items-center justify-center">
              <CheckCircle size={20} className="text-white" />
            </div>
            <div>
              <h4 className="font-bold text-gray-800">
                {safeMeetings.length} {safeMeetings.length === 1 ? 'reunião confirmada' : 'reuniões confirmadas'}
              </h4>
              <p className="text-sm text-gray-600">Você pode visualizar, editar ou excluir</p>
            </div>
          </div>
        </div>
      </div>

      {safeMeetings.map(meeting => (
        <ConfirmedMeetingCard
          key={meeting.id}
          meeting={meeting}
          onUpdate={onUpdate}
        />
      ))}
    </div>
  );
}