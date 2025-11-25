import { useState } from "react";
import { Calendar, Clock, MapPin, Users, FileText, Edit, Trash2, Plus, X, Shield, ChevronDown, ChevronUp } from "lucide-react";
import { HeaderAdmin } from "../../components/Header/HeaderAdmin";
import { database } from "../../data/data";
import type { Meeting } from "../../types/types";

export function HomeADMIN() {
  // Estado para gerenciar as reuniões (inicializado com os dados do database)
  const [meetings, setMeetings] = useState<Meeting[]>(database);
  
  const [editMode, setEditMode] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [expandedMeetings, setExpandedMeetings] = useState<Set<number>>(new Set());

  const [formData, setFormData] = useState<Omit<Meeting, "id">>({
    title: "",
    date: "",
    time: "",
    location: "",
    participants: "",
    description: "",
  });

  const resetForm = () => {
    setFormData({
      title: "",
      date: "",
      time: "",
      location: "",
      participants: "",
      description: "",
    });
    
    setEditMode(false);
    setSelectedMeeting(null);
    setShowForm(false);
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.date || !formData.time || !formData.location || !formData.participants) {
      alert("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    if (editMode && selectedMeeting) {
      setMeetings(meetings.map((m) => m.id === selectedMeeting.id ? { ...formData, id: selectedMeeting.id } : m));
      alert("Reunião atualizada com sucesso!");
    } else {
      const newMeeting: Meeting = {
        ...formData,
        id: Math.max(0, ...meetings.map((m) => m.id)) + 1,
      };
      setMeetings([...meetings, newMeeting]);
      alert("Reunião criada com sucesso!");
    }

    resetForm();
  };

  const handleEdit = (meeting: Meeting) => {
    setSelectedMeeting(meeting);
    setFormData(meeting);
    setEditMode(true);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: number) => {
    if (confirm("Tem certeza que deseja excluir esta reunião?")) {
      setMeetings(meetings.filter((m) => m.id !== id));
      alert("Reunião excluída com sucesso!");
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      {/* Header Admin */}
      <HeaderAdmin/>

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
                <p className="text-gray-600 text-sm font-semibold">Setores Ativos</p>
                <p className="text-3xl font-bold text-green-600">
                  {new Set(meetings.map(m => m.description).filter(Boolean)).size}
                </p>
              </div>
              <Users size={48} className="text-green-300" />
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
              >
                <X size={24} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Título da Reunião *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                  placeholder="Ex: Reunião de Planejamento Estratégico"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Data *
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Horário *
                </label>
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                />
              </div>

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
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Setor Responsável
                </label>
                <input
                  type="text"
                  value={formData.description || ""}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                  placeholder="Ex: Administração"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Participantes *
                </label>
                <input
                  type="text"
                  value={formData.participants}
                  onChange={(e) => setFormData({ ...formData, participants: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                  placeholder="Ex: Equipe de TI, Diretoria, Gestores"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Descrição
                </label>
                <textarea
                  value={formData.description || ""}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                  rows={4}
                  placeholder="Descrição detalhada da reunião..."
                />
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={handleSubmit}
                className="flex-1 bg-gradient-to-r from-purple-800 via-purple-700 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white font-bold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all"
              >
                {editMode ? "Salvar Alterações" : "Criar Reunião"}
              </button>
              <button
                onClick={resetForm}
                className="px-8 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 rounded-lg transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* Lista de Reuniões */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Calendar size={28} className="text-purple-600" />
            Todas as Reuniões
          </h2>

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
                      {meeting.description && (
                        <div className="flex items-center gap-2">
                          <Shield size={18} className="text-purple-600" />
                          <p className="text-sm">
                            <span className="font-semibold text-gray-700">Setor:</span> {meeting.description}
                          </p>
                        </div>
                      )}
                      {meeting && (
                        <div className="flex items-center gap-2">
                          <Users size={18} className="text-purple-600" />
                          <p className="text-sm">
                            <span className="font-semibold text-gray-700">Criado por:</span> Criador...
                          </p>
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