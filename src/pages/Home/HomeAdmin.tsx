import { useState, useEffect } from "react";
import {
  CheckCircle,
  XCircle,
  Clock,
  List,
  Filter,
  TrendingUp,
  FileText,
  ChevronDown,
  Loader2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { HeaderAdmin } from "../../components/Admin/Header/HeaderAdmin";
import { PendingMeetingsList } from "../../components/Admin/Meetings/Pending/MeetingsList";
import { DeniedMeetingsList } from "../../components/Admin/Meetings/Denieds/MeetingsList";
import { ConfirmedMeetingsList } from "../../components/Admin/Meetings/Confirmeds/MeetingList";
import { TotalMeetingsList } from "../../components/Admin/Meetings/Total/MeetingList";
import { MeetingForm } from "../../components/User/MeetingForm/MeetingForm";
import { API_URL } from "../../config/api";
import { MeetingCalendar } from "../../components/User/ScheduledMeetings/Calendar";
import type { Meeting as MeetingType } from "../../types/types";
import { FooterAdmin } from "../../components/Admin/Footer/FooterAdmin";

// ─── Types ────────────────────────────────────────────────────────────────────

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
  status?: "confirmed" | "pending" | "denied";
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
type FilterType =
  | "all"
  | "last-10-days"
  | "last-20-days"
  | "last-month"
  | "last-year"
  | "upcoming"
  | "past"
  | "custom"
  | "month";

type FormData = Omit<MeetingType, "id">;

// ─── Constantes ───────────────────────────────────────────────────────────────

const EMPTY_FORM: FormData = {
  title: "",
  meeting_date: "",
  start_time: "",
  end_time: "",
  location: "",
  participants_count: 0,
  MeetingCalendar: "",
  responsible: "",
  responsible_department: "",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const cls = (...c: (string | false | null | undefined)[]) =>
  c.filter(Boolean).join(" ");

const INPUT =
  "w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-100 focus:outline-none transition-all disabled:bg-gray-50";

// ─── Filter Panel ─────────────────────────────────────────────────────────────

function FilterPanel({
  activeFilter, setActiveFilter,
  selectedStatus, setSelectedStatus,
  customStartDate, setCustomStartDate,
  customEndDate, setCustomEndDate,
  selectedMonth, setSelectedMonth,
  onApply, onClear,
}: {
  activeFilter: FilterType;      setActiveFilter: (f: FilterType) => void;
  selectedStatus: string;        setSelectedStatus: (s: string) => void;
  customStartDate: string;       setCustomStartDate: (d: string) => void;
  customEndDate: string;         setCustomEndDate: (d: string) => void;
  selectedMonth: string;         setSelectedMonth: (m: string) => void;
  onApply: () => void;           onClear: () => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-white rounded-xl border border-gray-200 mb-5 overflow-hidden">
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center justify-between px-5 py-3.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Filter size={15} className="text-purple-500" />
          Filtros
        </div>
        <ChevronDown size={16} className={cls("text-gray-400 transition-transform duration-200", open && "rotate-180")} />
      </button>

      {open && (
        <div className="border-t border-gray-100 px-5 py-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Período</label>
              <select value={activeFilter} onChange={(e) => setActiveFilter(e.target.value as FilterType)} className={INPUT}>
                <option value="all">Todas</option>
                <option value="last-10-days">Últimos 10 dias</option>
                <option value="last-20-days">Últimos 20 dias</option>
                <option value="last-month">Último mês</option>
                <option value="last-year">Último ano</option>
                <option value="upcoming">Futuras</option>
                <option value="past">Passadas</option>
                <option value="custom">Período customizado</option>
                <option value="month">Mês específico</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Status</label>
              <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className={INPUT}>
                <option value="all">Todos</option>
                <option value="confirmed">Confirmadas</option>
                <option value="pending">Pendentes</option>
                <option value="denied">Negadas</option>
              </select>
            </div>
            {activeFilter === "month" && (
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Mês</label>
                <input type="month" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} className={INPUT} />
              </div>
            )}
            {activeFilter === "custom" && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Data inicial</label>
                  <input type="date" value={customStartDate} onChange={(e) => setCustomStartDate(e.target.value)} className={INPUT} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Data final</label>
                  <input type="date" value={customEndDate} onChange={(e) => setCustomEndDate(e.target.value)} className={INPUT} />
                </div>
              </>
            )}
          </div>
          <div className="flex gap-2 pt-1">
            <button onClick={onClear} className="px-4 py-2 text-sm font-semibold text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              Limpar
            </button>
            <button onClick={onApply} className="px-4 py-2 text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-lg flex items-center gap-1.5 transition-colors shadow-sm">
              <TrendingUp size={14} /> Aplicar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Section Header ───────────────────────────────────────────────────────────

function SectionHeader({ icon, title, count }: { icon: React.ReactNode; title: string; count: number }) {
  return (
    <div className="flex items-center gap-2">
      {icon}
      <h2 className="text-base font-bold text-gray-700">{title}</h2>
      <span className="text-xs text-gray-400 font-medium">
        ({count} {count === 1 ? "reunião" : "reuniões"})
      </span>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export function HomeADMIN() {
  const [confirmedMeetings, setConfirmedMeetings] = useState<Meeting[]>([]);
  const [pendingMeetings,   setPendingMeetings]   = useState<Meeting[]>([]);
  const [deniedMeetings,    setDeniedMeetings]    = useState<Meeting[]>([]);
  const [totalMeetings,     setTotalMeetings]     = useState<Meeting[]>([]);
  const [statistics,        setStatistics]        = useState<Statistics | null>(null);
  const [loading,           setLoading]           = useState(true);
  const [activeTab,         setActiveTab]         = useState<TabType>("total");

  const [activeFilter,    setActiveFilter]    = useState<FilterType>("all");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate,   setCustomEndDate]   = useState("");
  const [selectedMonth,   setSelectedMonth]   = useState("");
  const [selectedStatus,  setSelectedStatus]  = useState("all");

  // Formulário inline — mesma lógica do HomeUser
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<FormData>(EMPTY_FORM);

  // ── Data fetching ──────────────────────────────────────────────────────────

  const extractMeetings = (data: unknown): Meeting[] => {
    if (Array.isArray(data)) return data;
    if (data && Array.isArray((data as { meetings?: Meeting[] }).meetings))
      return (data as { meetings: Meeting[] }).meetings;
    if (data && Array.isArray((data as { data?: Meeting[] }).data))
      return (data as { data: Meeting[] }).data;
    return [];
  };

  const loadStatistics = async () => {
    try {
      const res = await fetch(`${API_URL}/meetingsTotal/statistics`);
      if (res.ok) setStatistics(await res.json());
    } catch { /* silencioso */ }
  };

  const loadConfirmedMeetings = async () => {
    try {
      const res = await fetch(`${API_URL}/meetingsConfirmed/all`);
      if (!res.ok) throw new Error();
      setConfirmedMeetings(extractMeetings(await res.json()).map((m) => ({ ...m, status: "confirmed" as const })));
    } catch { setConfirmedMeetings([]); }
  };

  const loadPendingMeetings = async () => {
    try {
      const res = await fetch(`${API_URL}/meetingsPending/all`);
      if (!res.ok) throw new Error();
      setPendingMeetings(extractMeetings(await res.json()).map((m) => ({ ...m, status: "pending" as const })));
    } catch { setPendingMeetings([]); }
  };

  const loadDeniedMeetings = async () => {
    try {
      const res = await fetch(`${API_URL}/meetingsDenied/all`);
      if (!res.ok) throw new Error();
      setDeniedMeetings(extractMeetings(await res.json()).map((m) => ({ ...m, status: "denied" as const })));
    } catch { setDeniedMeetings([]); }
  };

  const loadTotalMeetingsWithFilter = async (filter: FilterType) => {
    try {
      let url = `${API_URL}/meetingsTotal/all`;
      if (filter === "last-10-days")      url = `${API_URL}/meetingsTotal/filter/last-10-days`;
      else if (filter === "last-20-days") url = `${API_URL}/meetingsTotal/filter/last-20-days`;
      else if (filter === "last-month")   url = `${API_URL}/meetingsTotal/filter/last-month`;
      else if (filter === "last-year")    url = `${API_URL}/meetingsTotal/filter/last-year`;
      else if (filter === "upcoming")     url = `${API_URL}/meetingsTotal/filter/upcoming`;
      else if (filter === "past")         url = `${API_URL}/meetingsTotal/filter/past`;
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFilter, customStartDate, customEndDate, selectedMonth, selectedStatus]);

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleApproveMeeting = async (id: number) => {
    setPendingMeetings((p) => p.filter((m) => m.id !== id));
    await loadAllMeetings();
  };

  const handleDenyMeeting = async (id: number) => {
    setPendingMeetings((p) => p.filter((m) => m.id !== id));
    await loadAllMeetings();
  };

  const handleRestoreMeeting = async (id: number) => {
    setDeniedMeetings((p) => p.filter((m) => m.id !== id));
    await loadAllMeetings();
  };

  const handleDeleteMeeting = async (id: number) => {
    setDeniedMeetings((p) => p.filter((m) => m.id !== id));
    await loadAllMeetings();
  };

  /**
   * Calendário → pré-preenche o formulário e faz scroll até ele.
   * Mesma lógica do HomeUser.
   */
  const handleNewMeetingFromCalendar = (date: string, startTime: string, endTime: string) => {
    setFormData({ ...EMPTY_FORM, meeting_date: date, start_time: startTime, end_time: endTime });
    setShowForm(true);
    setTimeout(() =>
      document.getElementById("admin-meeting-form")?.scrollIntoView({ behavior: "smooth", block: "start" }),
      50
    );
  };

  const handleFormSuccess = () => {
    setFormData(EMPTY_FORM);
    setShowForm(false);
    loadAllMeetings();
    setActiveTab("pending");
  };

  const handleFormCancel = () => {
    setFormData(EMPTY_FORM);
    setShowForm(false);
  };

  const clearFilters = () => {
    setActiveFilter("all");
    setSelectedStatus("all");
    setCustomStartDate("");
    setCustomEndDate("");
    setSelectedMonth("");
  };

  // ─── Tabs ──────────────────────────────────────────────────────────────────

  const TABS: { key: TabType; label: string; icon: React.ReactNode; count: number; activeColor: string }[] = [
    { key: "total",     label: "Todas",       icon: <List size={15} />,        count: totalMeetings.length,     activeColor: "bg-gray-800 text-white"   },
    { key: "confirmed", label: "Confirmadas", icon: <CheckCircle size={15} />, count: confirmedMeetings.length, activeColor: "bg-emerald-600 text-white" },
    { key: "pending",   label: "Pendentes",   icon: <Clock size={15} />,       count: pendingMeetings.length,   activeColor: "bg-amber-500 text-white"  },
    { key: "denied",    label: "Negadas",     icon: <XCircle size={15} />,     count: deniedMeetings.length,    activeColor: "bg-red-600 text-white"    },
  ];

  // ─── Loading ───────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={36} className="text-purple-600 animate-spin" />
          <p className="text-sm text-gray-500 font-medium">Carregando...</p>
        </div>
      </div>
    );
  }

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderAdmin />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">

        {/* ── Top bar ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold text-purple-600 uppercase tracking-widest mb-0.5">
              Painel administrativo
            </p>
            <h1 className="text-2xl font-bold text-gray-800">Gestão de Reuniões</h1>
            {statistics && (
              <p className="text-gray-500 text-sm mt-0.5">
                {statistics.total} reunião{statistics.total !== 1 ? "ões" : ""} cadastrada{statistics.total !== 1 ? "s" : ""}
                {" · "}
                <span className="text-purple-500 font-medium">
                  Clique em um dia no calendário para agendar
                </span>
              </p>
            )}
          </div>

          <Link
            to="/admin/reports"
            className="self-start sm:self-auto flex items-center gap-2 px-4 py-2.5 border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 rounded-xl text-sm font-semibold transition-colors shadow-sm"
          >
            <FileText size={15} />
            Relatórios
          </Link>
        </div>

        {/* ── Formulário inline ── */}
        {showForm && (
          <div id="admin-meeting-form">
            <MeetingForm
              formData={formData}
              modoEdicao={false}
              onFormChange={setFormData}
              onSuccess={handleFormSuccess}
              onCancel={handleFormCancel}
            />
          </div>
        )}

        {/* ── Tabs ── */}
        <div className="bg-white rounded-xl border border-gray-200 p-1 flex gap-1 flex-wrap">
          {TABS.map(({ key, label, icon, count, activeColor }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={cls(
                "flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all",
                activeTab === key
                  ? activeColor + " shadow-sm"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              )}
            >
              {icon}
              {label}
              <span className={cls(
                "text-xs px-1.5 py-0.5 rounded-full font-bold",
                activeTab === key ? "bg-white/25 text-white" : "bg-gray-100 text-gray-500"
              )}>
                {count}
              </span>
            </button>
          ))}
        </div>

        {/* ── Tab content ── */}
        <div>
          {activeTab === "total" && (
            <div className="space-y-4">
              <FilterPanel
                activeFilter={activeFilter}       setActiveFilter={setActiveFilter}
                selectedStatus={selectedStatus}   setSelectedStatus={setSelectedStatus}
                customStartDate={customStartDate} setCustomStartDate={setCustomStartDate}
                customEndDate={customEndDate}     setCustomEndDate={setCustomEndDate}
                selectedMonth={selectedMonth}     setSelectedMonth={setSelectedMonth}
                onApply={() => loadTotalMeetingsWithFilter(activeFilter)}
                onClear={clearFilters}
              />
              <SectionHeader icon={<List size={16} className="text-gray-500" />} title="Todas as Reuniões" count={totalMeetings.length} />
              <TotalMeetingsList meetings={totalMeetings} />
            </div>
          )}

          {activeTab === "pending" && (
            <div className="space-y-4">
              <SectionHeader icon={<Clock size={16} className="text-amber-500" />} title="Reuniões Pendentes" count={pendingMeetings.length} />
              <PendingMeetingsList meetings={pendingMeetings} onApprove={handleApproveMeeting} onDeny={handleDenyMeeting} />
            </div>
          )}

          {activeTab === "confirmed" && (
            <div className="space-y-4">
              <SectionHeader icon={<CheckCircle size={16} className="text-emerald-500" />} title="Reuniões Confirmadas" count={confirmedMeetings.length} />
              <ConfirmedMeetingsList meetings={confirmedMeetings} onUpdate={loadAllMeetings} />
            </div>
          )}

          {activeTab === "denied" && (
            <div className="space-y-4">
              <SectionHeader icon={<XCircle size={16} className="text-red-500" />} title="Reuniões Negadas" count={deniedMeetings.length} />
              <DeniedMeetingsList meetings={deniedMeetings} onRestore={handleRestoreMeeting} onDelete={handleDeleteMeeting} />
            </div>
          )}
        </div>

        {/* ── Calendário ── */}
        <MeetingCalendar onNewMeeting={handleNewMeetingFromCalendar} />

      </div>
      <FooterAdmin/>
    </div>
  );
}