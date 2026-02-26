import { useState, useEffect } from "react";
import { CheckCircle, XCircle, Clock, Plus, X, List, Filter, TrendingUp, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { HeaderAdmin } from "../../components/Admin/Header/HeaderAdmin";
import { PendingMeetingsList } from "../../components/Admin/Meetings/Pending/MeetingsList";
import { DeniedMeetingsList } from "../../components/Admin/Meetings/Denieds/MeetingsList";
import { ConfirmedMeetingsList } from "../../components/Admin/Meetings/Confirmeds/MeetingList";
import { TotalMeetingsList } from "../../components/Admin/Meetings/Total/MeetingList";
import { AdminMeetingForm } from "../../components/Admin/AdminMeetingForm/AdminMeetingForm";
import { API_URL } from "../../config/api";
import { CalendarAdmin } from "../../components/User/ScheduledMeetings/CalendarAdmin";

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
  status?: 'confirmed' | 'pending' | 'denied';
}

interface Statistics {
  total: number;
  confirmed: number;
  pending: number;
  denied: number;
  upcoming: number;
  past: number;
}

type TabType = "total" | "confirmed" | "pending" | "denied";
type FilterType = "all" | "last-10-days" | "last-20-days" | "last-month" | "last-year" | "upcoming" | "past" | "custom" | "month";

// ─── Modal de criação ─────────────────────────────────────────────────────────
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
    responsible_department: '',
    equipment: [] as string[],
    other_equipment: '',
  });

  const handleSubmit = async () => {
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Erro ao criar reunião');

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

        {/* Header fixo */}
        <div className="sticky top-0 bg-white border-b-2 border-blue-100 p-6 flex items-center justify-between z-10">
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
          {/* Erro global */}
          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          )}

          {/* Aviso de pendência */}
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

          {/* Formulário com todos os recursos de sala */}
          <AdminMeetingForm
            formData={formData}
            setFormData={setFormData}
            loading={loading}
            onClose={onClose}
            handleSubmit={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Cards de estatísticas ────────────────────────────────────────────────────
function StatisticsCards({ stats }: { stats: Statistics | null }) {
  if (!stats) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white shadow-lg">
        <div className="text-2xl font-bold">{stats.total}</div>
        <div className="text-sm opacity-90">Total</div>
      </div>
      <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 text-white shadow-lg">
        <div className="text-2xl font-bold">{stats.confirmed}</div>
        <div className="text-sm opacity-90">Confirmadas</div>
      </div>
      <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-4 text-white shadow-lg">
        <div className="text-2xl font-bold">{stats.pending}</div>
        <div className="text-sm opacity-90">Pendentes</div>
      </div>
      <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-4 text-white shadow-lg">
        <div className="text-2xl font-bold">{stats.denied}</div>
        <div className="text-sm opacity-90">Negadas</div>
      </div>
      <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white shadow-lg">
        <div className="text-2xl font-bold">{stats.upcoming}</div>
        <div className="text-sm opacity-90">Futuras</div>
      </div>
      <div className="bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl p-4 text-white shadow-lg">
        <div className="text-2xl font-bold">{stats.past}</div>
        <div className="text-sm opacity-90">Passadas</div>
      </div>
    </div>
  );
}

// ─── Página principal ─────────────────────────────────────────────────────────
export function HomeADMIN() {
  const [confirmedMeetings, setConfirmedMeetings] = useState<Meeting[]>([]);
  const [pendingMeetings, setPendingMeetings] = useState<Meeting[]>([]);
  const [deniedMeetings, setDeniedMeetings] = useState<Meeting[]>([]);
  const [totalMeetings, setTotalMeetings] = useState<Meeting[]>([]);
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>("total");
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  const loadStatistics = async () => {
    try {
      const response = await fetch(`${API_URL}/meetingsTotal/statistics`);
      if (response.ok) setStatistics(await response.json());
    } catch (error) {
      console.error("Erro ao carregar estatísticas:", error);
    }
  };

  const extractMeetings = (data: unknown): Meeting[] => {
    if (Array.isArray(data)) return data;
    if (data && Array.isArray((data as { meetings?: Meeting[] }).meetings)) return (data as { meetings: Meeting[] }).meetings;
    if (data && Array.isArray((data as { data?: Meeting[] }).data)) return (data as { data: Meeting[] }).data;
    return [];
  };

  const loadConfirmedMeetings = async () => {
    try {
      const res = await fetch(`${API_URL}/meetingsConfirmed/all`);
      if (!res.ok) throw new Error();
      const meetings = extractMeetings(await res.json()).map((m) => ({ ...m, status: 'confirmed' as const }));
      setConfirmedMeetings(meetings);
    } catch { setConfirmedMeetings([]); }
  };

  const loadPendingMeetings = async () => {
    try {
      const res = await fetch(`${API_URL}/meetingsPending/all`);
      if (!res.ok) throw new Error();
      const meetings = extractMeetings(await res.json()).map((m) => ({ ...m, status: 'pending' as const }));
      setPendingMeetings(meetings);
    } catch { setPendingMeetings([]); }
  };

  const loadDeniedMeetings = async () => {
    try {
      const res = await fetch(`${API_URL}/meetingsDenied/all`);
      if (!res.ok) throw new Error();
      const meetings = extractMeetings(await res.json()).map((m) => ({ ...m, status: 'denied' as const }));
      setDeniedMeetings(meetings);
    } catch { setDeniedMeetings([]); }
  };

  const loadTotalMeetingsWithFilter = async (filter: FilterType) => {
    try {
      let url = `${API_URL}/meetingsTotal/all`;

      if (filter === "last-10-days") url = `${API_URL}/meetingsTotal/filter/last-10-days`;
      else if (filter === "last-20-days") url = `${API_URL}/meetingsTotal/filter/last-20-days`;
      else if (filter === "last-month") url = `${API_URL}/meetingsTotal/filter/last-month`;
      else if (filter === "last-year") url = `${API_URL}/meetingsTotal/filter/last-year`;
      else if (filter === "upcoming") url = `${API_URL}/meetingsTotal/filter/upcoming`;
      else if (filter === "past") url = `${API_URL}/meetingsTotal/filter/past`;
      else if (filter === "custom" && customStartDate && customEndDate)
        url = `${API_URL}/meetingsTotal/range/dates?start=${customStartDate}&end=${customEndDate}`;
      else if (filter === "month" && selectedMonth)
        url = `${API_URL}/meetingsTotal/month/${selectedMonth}`;

      if (selectedStatus !== "all" && filter !== "custom" && filter !== "month")
        url = `${API_URL}/meetingsTotal/status/${selectedStatus}`;

      const res = await fetch(url);
      if (!res.ok) throw new Error();
      setTotalMeetings(extractMeetings(await res.json()));
    } catch { setTotalMeetings([]); }
  };

  const loadAllMeetings = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadConfirmedMeetings(),
        loadPendingMeetings(),
        loadDeniedMeetings(),
        loadTotalMeetingsWithFilter(activeFilter),
        loadStatistics(),
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadAllMeetings(); }, []);

  useEffect(() => {
    if (!loading) loadTotalMeetingsWithFilter(activeFilter);
  }, [activeFilter, customStartDate, customEndDate, selectedMonth, selectedStatus]);

  const handleApproveMeeting = async (id: number) => {
    setPendingMeetings((prev) => prev.filter((m) => m.id !== id));
    await loadAllMeetings();
  };

  const handleDenyMeeting = async (id: number) => {
    setPendingMeetings((prev) => prev.filter((m) => m.id !== id));
    await loadAllMeetings();
  };

  const handleRestoreMeeting = async (id: number) => {
    setDeniedMeetings((prev) => prev.filter((m) => m.id !== id));
    await loadAllMeetings();
  };

  const handleDeleteMeeting = async (id: number) => {
    setDeniedMeetings((prev) => prev.filter((m) => m.id !== id));
    await loadAllMeetings();
  };

  const handleCreateSuccess = () => {
    loadAllMeetings();
    setActiveTab("pending");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto" />
          <p className="mt-4 text-gray-600">Carregando reuniões...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      <HeaderAdmin />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Gestão de Reuniões</h1>

          <div className="flex items-center gap-3">
            <Link
              to="/admin/reports"
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl group"
            >
              <FileText size={20} className="group-hover:scale-110 transition-transform" />
              Relatórios
            </Link>

            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl group"
            >
              <Plus size={20} className="group-hover:scale-110 transition-transform" />
              Nova Reunião
            </button>
          </div>
        </div>

        {/* Estatísticas */}
        <StatisticsCards stats={statistics} />

        {/* Abas */}
        <div className="mb-6">
          <div className="bg-white rounded-lg shadow-md p-1 inline-flex gap-1 flex-wrap">
            {[
              { key: "total", label: "Todas", icon: <List size={20} />, color: "bg-blue-600", count: totalMeetings.length },
              { key: "confirmed", label: "Confirmadas", icon: <CheckCircle size={20} />, color: "bg-green-500", count: confirmedMeetings.length },
              { key: "pending", label: "Pendentes", icon: <Clock size={20} />, color: "bg-yellow-500", count: pendingMeetings.length },
              { key: "denied", label: "Negadas", icon: <XCircle size={20} />, color: "bg-red-500", count: deniedMeetings.length },
            ].map(({ key, label, icon, color, count }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key as TabType)}
                className={`flex items-center gap-2 px-6 py-3 rounded-md font-semibold transition-all ${
                  activeTab === key ? `${color} text-white shadow-md` : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {icon}
                {label}
                <span className="ml-1 px-2 py-0.5 rounded-full text-xs bg-white/20">{count}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Filtros */}
        {activeTab === "total" && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="text-blue-600" size={24} />
              <h3 className="text-xl font-bold text-gray-800">Filtros</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Período</label>
                <select
                  value={activeFilter}
                  onChange={(e) => setActiveFilter(e.target.value as FilterType)}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                >
                  <option value="all">Todas</option>
                  <option value="last-10-days">Últimos 10 dias</option>
                  <option value="last-20-days">Últimos 20 dias</option>
                  <option value="last-month">Último mês</option>
                  <option value="last-year">Último ano</option>
                  <option value="upcoming">Futuras</option>
                  <option value="past">Passadas</option>
                  <option value="custom">Período customizado</option>
                  <option value="month">Por mês específico</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                >
                  <option value="all">Todos</option>
                  <option value="confirmed">Confirmadas</option>
                  <option value="pending">Pendentes</option>
                  <option value="denied">Negadas</option>
                </select>
              </div>

              {activeFilter === "month" && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Selecione o Mês</label>
                  <input
                    type="month"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                  />
                </div>
              )}

              {activeFilter === "custom" && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Data Inicial</label>
                    <input
                      type="date"
                      value={customStartDate}
                      onChange={(e) => setCustomStartDate(e.target.value)}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Data Final</label>
                    <input
                      type="date"
                      value={customEndDate}
                      onChange={(e) => setCustomEndDate(e.target.value)}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </>
              )}
            </div>

            <div className="mt-4 flex gap-3">
              <button
                onClick={() => {
                  setActiveFilter("all");
                  setSelectedStatus("all");
                  setCustomStartDate("");
                  setCustomEndDate("");
                  setSelectedMonth("");
                }}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-semibold transition-colors"
              >
                Limpar Filtros
              </button>
              <button
                onClick={() => loadTotalMeetingsWithFilter(activeFilter)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
              >
                <TrendingUp size={18} />
                Aplicar Filtros
              </button>
            </div>
          </div>
        )}

        {/* Conteúdo das abas */}
        {activeTab === "total" && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <List className="text-blue-600" />
              Todas as Reuniões
              <span className="text-sm font-normal text-gray-500 ml-2">
                ({totalMeetings.length} {totalMeetings.length === 1 ? 'reunião' : 'reuniões'})
              </span>
            </h2>
            <TotalMeetingsList meetings={totalMeetings} />
          </div>
        )}

        <br />
        <CalendarAdmin />

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
              onUpdate={loadAllMeetings}
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