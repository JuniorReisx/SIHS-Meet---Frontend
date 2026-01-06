import { useState, useEffect } from "react";
import { CheckCircle, XCircle, Clock, Plus, X, Save } from "lucide-react";
import { HeaderAdmin } from "../../components/Admin/Header/HeaderAdmin";
import { PendingMeetingsList } from "../../components/Admin/Meetings/Pending/MeetingsList";
import { DeniedMeetingsList } from "../../components/Admin/Meetings/Denieds/MeetingsList";
import { API_URL } from "../../config/api";
import { ConfirmedMeetingsList } from "../../components/Admin/Meetings/Confirmeds/MeetingList";

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

type TabType = "confirmed" | "pending" | "denied";

// Modal de criação de reunião
function CreateMeetingModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    meeting_date: '',
    start_time: '',
    end_time: '',
    location: '',
    participants_count: 1,
    description: '',
    responsible: '',
    responsible_department: ''
  });

  const handleSubmit = async () => {
    // Validação dos campos obrigatórios
    if (!formData.title || !formData.meeting_date || !formData.start_time || 
        !formData.end_time || !formData.location || !formData.participants_count ||
        !formData.responsible || !formData.responsible_department) {
      setError("Por favor, preencha todos os campos obrigatórios (*)");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/meetingsPending`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Erro ao criar reunião');
      }

      alert('Reunião criada com sucesso! Ela está pendente de aprovação.');
      onSuccess();
      onClose();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erro ao criar reunião";
      setError(errorMessage);
      console.error('Erro ao criar reunião:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b-2 border-blue-100 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-blue-900">Nova Reunião</h2>
          <button 
            onClick={onClose} 
            disabled={loading}
            className="text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-50"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          )}

          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg mb-6">
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div>
                <h5 className="text-sm font-semibold text-yellow-900 mb-1">Atenção</h5>
                <p className="text-xs text-yellow-800">
                  Esta reunião será criada como <strong>PENDENTE</strong> e precisará ser aprovada por um administrador.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Título da Reunião *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                  placeholder="Ex: Reunião de Planejamento Trimestral"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Data da Reunião *
                </label>
                <input
                  type="date"
                  value={formData.meeting_date}
                  onChange={(e) => setFormData({...formData, meeting_date: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Horário de Início *
                </label>
                <input
                  type="time"
                  value={formData.start_time}
                  onChange={(e) => setFormData({...formData, start_time: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                  disabled={loading}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Horário de Término *
                </label>
                <input
                  type="time"
                  value={formData.end_time}
                  onChange={(e) => setFormData({...formData, end_time: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                  disabled={loading}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Local *
                </label>
                <select
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                  disabled={loading}
                >
                  <option value="">Selecione um local</option>
                  <option value="Reunião Portal da Água">Reunião Portal da Água</option>
                  <option value="Sala de Reunião">Sala de Reunião</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Quantidade de Participantes *
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.participants_count}
                  onChange={(e) => setFormData({...formData, participants_count: parseInt(e.target.value) || 0})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                  placeholder="Ex: 10"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Responsável *
                </label>
                <input
                  type="text"
                  value={formData.responsible}
                  onChange={(e) => setFormData({...formData, responsible: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                  placeholder="Ex: João Silva"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Departamento do Responsável *
                </label>
                <input
                  type="text"
                  value={formData.responsible_department}
                  onChange={(e) => setFormData({...formData, responsible_department: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                  placeholder="Ex: Recursos Humanos"
                  disabled={loading}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Descrição/Pauta
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none resize-none transition-colors"
                  placeholder="Descreva a pauta e objetivos da reunião..."
                  disabled={loading}
                />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg shadow-md flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    Cadastrar Reunião
                  </>
                )}
              </button>
              <button
                onClick={onClose}
                disabled={loading}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold px-8 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function HomeADMIN() {
  const [confirmedMeetings, setConfirmedMeetings] = useState<Meeting[]>([]);
  const [pendingMeetings, setPendingMeetings] = useState<Meeting[]>([]);
  const [deniedMeetings, setDeniedMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>("pending");
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Carregar reuniões confirmadas
  const loadConfirmedMeetings = async () => {
    try {
      console.log("Carregando reuniões confirmadas...");
      const response = await fetch(`${API_URL}/meetingsConfirmed/all`);
      console.log("Response status:", response.status);
      console.log("Response ok:", response.ok);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Dados recebidos (confirmed):", data);
      console.log("É array?", Array.isArray(data));

      // Trata diferentes formatos de resposta
      if (Array.isArray(data)) {
        setConfirmedMeetings(data);
      } else if (data && Array.isArray(data.meetings)) {
        setConfirmedMeetings(data.meetings);
      } else if (data && Array.isArray(data.data)) {
        setConfirmedMeetings(data.data);
      } else {
        console.warn("Formato de dados inesperado (confirmed):", data);
        setConfirmedMeetings([]);
      }
    } catch (error) {
      console.error("Erro ao carregar reuniões confirmadas:", error);
      setConfirmedMeetings([]);
    }
  };

  // Carregar reuniões pendentes
  const loadPendingMeetings = async () => {
    try {
      console.log("Carregando reuniões pendentes...");
      const response = await fetch(`${API_URL}/meetingsPending/all`);
      console.log("Response status:", response.status);
      console.log("Response ok:", response.ok);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Dados recebidos (pending):", data);
      console.log("É array?", Array.isArray(data));

      // Trata diferentes formatos de resposta
      if (Array.isArray(data)) {
        setPendingMeetings(data);
      } else if (data && Array.isArray(data.meetings)) {
        setPendingMeetings(data.meetings);
      } else if (data && Array.isArray(data.data)) {
        setPendingMeetings(data.data);
      } else {
        console.warn("Formato de dados inesperado (pending):", data);
        setPendingMeetings([]);
      }
    } catch (error) {
      console.error("Erro ao carregar reuniões pendentes:", error);
      setPendingMeetings([]);
    }
  };

  // Carregar reuniões negadas
  const loadDeniedMeetings = async () => {
    try {
      console.log("Carregando reuniões negadas...");
      const response = await fetch(`${API_URL}/meetingsDenied/all`);
      console.log("Response status:", response.status);
      console.log("Response ok:", response.ok);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Dados recebidos (denied):", data);
      console.log("É array?", Array.isArray(data));

      // Trata diferentes formatos de resposta
      if (Array.isArray(data)) {
        setDeniedMeetings(data);
      } else if (data && Array.isArray(data.meetings)) {
        setDeniedMeetings(data.meetings);
      } else if (data && Array.isArray(data.data)) {
        setDeniedMeetings(data.data);
      } else {
        console.warn("Formato de dados inesperado (denied):", data);
        setDeniedMeetings([]);
      }
    } catch (error) {
      console.error("Erro ao carregar reuniões negadas:", error);
      setDeniedMeetings([]);
    }
  };

  // Carregar todas as reuniões
  const loadAllMeetings = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadConfirmedMeetings(),
        loadPendingMeetings(),
        loadDeniedMeetings(),
      ]);
    } catch (error) {
      console.error("Erro ao carregar reuniões:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllMeetings();
  }, []);

  // Aprovar reunião (remover de pendente)
  const handleApproveMeeting = async (id: number) => {
    setPendingMeetings((prev) => prev.filter((m) => m.id !== id));
    await loadConfirmedMeetings();
  };

  // Negar reunião (remover de pendente)
  const handleDenyMeeting = async (id: number) => {
    setPendingMeetings((prev) => prev.filter((m) => m.id !== id));
    await loadDeniedMeetings();
  };

  // Restaurar reunião negada (volta como pendente)
  const handleRestoreMeeting = async (id: number) => {
    setDeniedMeetings((prev) => prev.filter((m) => m.id !== id));
    await loadPendingMeetings();
  };

  // Excluir reunião negada permanentemente
  const handleDeleteMeeting = async (id: number) => {
    setDeniedMeetings((prev) => prev.filter((m) => m.id !== id));
  };

  const handleCreateSuccess = () => {
    loadPendingMeetings();
    setActiveTab("pending");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando reuniões...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      <HeaderAdmin />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Gestão de Reuniões
          </h1>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl group"
          >
            <Plus size={20} className="group-hover:scale-110 transition-transform" />
            Nova Reunião
          </button>
        </div>

        {/* Abas de navegação */}
        <div className="mb-6">
          <div className="bg-white rounded-lg shadow-md p-1 inline-flex gap-1">
            <button
              onClick={() => setActiveTab("confirmed")}
              className={`flex items-center gap-2 px-6 py-3 rounded-md font-semibold transition-all ${
                activeTab === "confirmed"
                  ? "bg-green-500 text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <CheckCircle size={20} />
              Confirmadas
              <span className="ml-1 px-2 py-0.5 rounded-full text-xs bg-white/20">
                {confirmedMeetings.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("pending")}
              className={`flex items-center gap-2 px-6 py-3 rounded-md font-semibold transition-all ${
                activeTab === "pending"
                  ? "bg-yellow-500 text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Clock size={20} />
              Pendentes
              <span className="ml-1 px-2 py-0.5 rounded-full text-xs bg-white/20">
                {pendingMeetings.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("denied")}
              className={`flex items-center gap-2 px-6 py-3 rounded-md font-semibold transition-all ${
                activeTab === "denied"
                  ? "bg-red-500 text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <XCircle size={20} />
              Negadas
              <span className="ml-1 px-2 py-0.5 rounded-full text-xs bg-white/20">
                {deniedMeetings.length}
              </span>
            </button>
          </div>
        </div>

        {/* Conteúdo das abas */}
        {activeTab === "pending" && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Clock className="text-yellow-500" />
              Reuniões Pendentes
            </h2>
            <PendingMeetingsList
              meetings={pendingMeetings}
              onApprove={handleApproveMeeting}
              onDeny={handleDenyMeeting}
            />
          </div>
        )}

        {activeTab === "confirmed" && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <CheckCircle className="text-green-500" />
              Reuniões Confirmadas
            </h2>
            <ConfirmedMeetingsList
              meetings={confirmedMeetings}
              onUpdate={loadConfirmedMeetings}
            />
          </div>
        )}

        {activeTab === "denied" && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <XCircle className="text-red-500" />
              Reuniões Negadas
            </h2>
            <DeniedMeetingsList
              meetings={deniedMeetings}
              onRestore={handleRestoreMeeting}
              onDelete={handleDeleteMeeting}
            />
          </div>
        )}
      </div>

      {/* Modal de criação */}
      {showCreateModal && (
        <CreateMeetingModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleCreateSuccess}
        />
      )}
    </div>
  );
}