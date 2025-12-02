import { useState, useEffect } from "react";
import { Calendar, Clock, MapPin, Users, FileText, Edit, Trash2, Plus, X, Shield, ChevronDown, ChevronUp, Loader2, AlertCircle } from "lucide-react";
import { HeaderAdmin } from "../../components/Header/HeaderAdmin";
import { 
  getAllMeetings, 
  createMeeting, 
  updateMeeting, 
  deleteMeeting 
} from "../../services/meetingService";
import type { Meeting } from "../../types/types";

export function HomeADMIN() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  
  const [editMode, setEditMode] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [expandedMeetings, setExpandedMeetings] = useState<Set<number>>(new Set());

  const [formData, setFormData] = useState<Omit<Meeting, "id">>({
    title: "",
    date: "",
    time: "",
    endTime: "",
    location: "",
    participants: "",
    description: "",
  });

  // Carregar reuniões ao montar o componente
  useEffect(() => {
    loadMeetings();
  }, []);

  const loadMeetings = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllMeetings();
      setMeetings(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao carregar reuniões";
      setError(errorMessage);
      console.error("Erro ao carregar reuniões:", err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      date: "",
      time: "",
      endTime: "",
      location: "",
      participants: "",
      description: "",
    });
    
    setEditMode(false);
    setSelectedMeeting(null);
    setShowForm(false);
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.date || !formData.time || !formData.endTime || !formData.location || !formData.participants) {
      alert("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    setSubmitting(true);
    try {
      if (editMode && selectedMeeting) {
        await updateMeeting(selectedMeeting.id, formData);
        alert("Reunião atualizada com sucesso!");
      } else {
        await createMeeting(formData);
        alert("Reunião criada com sucesso!");
      }
      
      await loadMeetings();
      resetForm();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao salvar reunião";
      alert(`Erro: ${errorMessage}`);
      console.error("Erro ao salvar reunião:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (meeting: Meeting) => {
    setSelectedMeeting(meeting);
    setFormData({
      title: meeting.title,
      date: meeting.date,
      time: meeting.time,
      endTime: meeting.endTime || "",
      location: meeting.location,
      participants: meeting.participants,
      description: meeting.description,
    });
    setEditMode(true);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir esta reunião?")) {
      return;
    }

    try {
      await deleteMeeting(id);
      alert("Reunião excluída com sucesso!");
      await loadMeetings();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao excluir reunião";
      alert(`Erro: ${errorMessage}`);
      console.error("Erro ao excluir reunião:", err);
    }
  };

  const toggleExpansion = (id: number) => {
    const newExpanded = new Set(expandedMeetings);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedMeetings(newExpanded);
  };

  // Estado de Loading
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
        <HeaderAdmin />
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="bg-white rounded-xl shadow-lg p-12">
            <div className="flex flex-col items-center justify-center">
              <Loader2 size={64} className="text-purple-500 animate-spin mb-4" />
              <p className="text-gray-600 text-xl font-medium">Carregando painel administrativo...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Estado de Erro
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
        <HeaderAdmin />
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-lg">
              <div className="flex items-start gap-3">
                <AlertCircle size={24} className="text-red-500 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="text-red-800 font-semibold text-lg mb-2">
                    Erro ao carregar dados
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
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      <HeaderAdmin />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold">Total de Reuniões</p>
                <p className="text-3xl font-bold text-purple-600">{meetings.length}</p>
              </div>
              <Calendar size={48} className="text-purple-300" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold">Próximas 7 dias</p>
                <p className="text-3xl font-bold text-blue-600">
                  {meetings.filter(m => {
                    const meetingDate = new Date(m.date);
                    const today = new Date();
                    const sevenDays = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
                    return meetingDate >= today && meetingDate <= sevenDays;
                  }).length}
                </p>
              </div>
              <Clock size={48} className="text-blue-300" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold">Locais Únicos</p>
                <p className="text-3xl font-bold text-green-600">
                  {new Set(meetings.map(m => m.location).filter(Boolean)).size}
                </p>
              </div>
              <MapPin size={48} className="text-green-300" />
            </div>
          </div>
        </div>

        {/* Botão Nova Reunião */}
        {!showForm && (
          <div className="mb-8">
            <button
              onClick={() => setShowForm(true)}
              className="w-full bg-gradient-to-r from-purple-800 via-purple-700 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Plus size={24} />
              Nova Reunião (Poder Admin)
            </button>
          </div>
        )}

        {/* Formulário */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-2xl p-8 mb-8 border-t-4 border-purple-600">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <Shield className="text-purple-600" size={28} />
                {editMode ? "Editar Reunião" : "Nova Reunião"}
              </h2>
              <button
                onClick={resetForm}
                className="text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100"
                disabled={submitting}
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-6">
              {/* Título */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Título da Reunião *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                  placeholder="Ex: Reunião de Planejamento Estratégico"
                  disabled={submitting}
                />
              </div>

              {/* Data e Horários em Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Data *
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                    disabled={submitting}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Horário de Início *
                  </label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                    disabled={submitting}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Horário de Término *
                  </label>
                  <input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                    disabled={submitting}
                  />
                </div>
              </div>

              {/* Local */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Local *
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                  placeholder="Ex: Sala de Reuniões - SIHS"
                  disabled={submitting}
                />
              </div>

              {/* Participantes */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Participantes *
                </label>
                <input
                  type="text"
                  value={formData.participants}
                  onChange={(e) => setFormData({ ...formData, participants: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                  placeholder="Ex: 10 participantes"
                  disabled={submitting}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Formato sugerido: "10" apenas o número
                </p>
              </div>

              {/* Descrição */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Descrição
                </label>
                <textarea
                  value={formData.description || ""}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                  rows={4}
                  placeholder="Descrição detalhada da reunião..."
                  disabled={submitting}
                />
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex-1 bg-gradient-to-r from-purple-800 via-purple-700 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white font-bold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Salvando...
                  </>
                ) : (
                  editMode ? "Salvar Alterações" : "Criar Reunião"
                )}
              </button>
              <button
                onClick={resetForm}
                disabled={submitting}
                className="px-8 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* Lista de Reuniões */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Calendar size={28} className="text-purple-600" />
              Todas as Reuniões
            </h2>
            <button
              onClick={loadMeetings}
              className="flex items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Atualizar
            </button>
          </div>

          {meetings.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <Calendar size={64} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg">Nenhuma reunião agendada</p>
            </div>
          ) : (
            meetings.map((meeting) => (
              <div
                key={meeting.id}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow border-l-4 border-purple-600"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">{meeting.title}</h3>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Calendar size={16} className="text-purple-600" />
                          {new Date(meeting.date + 'T00:00:00').toLocaleDateString('pt-BR')}
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock size={16} className="text-purple-600" />
                          {meeting.time}
                          {meeting.endTime && ` - ${meeting.endTime}`}
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin size={16} className="text-purple-600" />
                          {meeting.location}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(meeting)}
                        className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <Edit size={20} />
                      </button>
                      <button
                        onClick={() => handleDelete(meeting.id)}
                        className="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition-colors"
                        title="Excluir"
                      >
                        <Trash2 size={20} />
                      </button>
                      <button
                        onClick={() => toggleExpansion(meeting.id)}
                        className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg transition-colors"
                        title={expandedMeetings.has(meeting.id) ? "Recolher" : "Expandir"}
                      >
                        {expandedMeetings.has(meeting.id) ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </button>
                    </div>
                  </div>

                  {expandedMeetings.has(meeting.id) && (
                    <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
                      <div className="flex items-start gap-2">
                        <Users size={18} className="text-purple-600 mt-1 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-semibold text-gray-700">Participantes:</p>
                          <p className="text-gray-600">{meeting.participants}</p>
                        </div>
                      </div>
                      {meeting.description && (
                        <div className="flex items-start gap-2">
                          <FileText size={18} className="text-purple-600 mt-1 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-semibold text-gray-700">Descrição:</p>
                            <p className="text-gray-600">{meeting.description}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}