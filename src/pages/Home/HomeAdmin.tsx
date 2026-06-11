import { useState, useEffect, useMemo } from "react";
import {
  CheckCircle,
  XCircle,
  Clock,
  List,
  Filter,
  TrendingUp,
  FileText,
  ChevronDown,
  History,
} from "lucide-react";
import { Link } from "react-router-dom";
import { HeaderAdmin } from "../../components/Admin/Header/HeaderAdmin";
import { PendingMeetingsList } from "../../components/Admin/Meetings/Pending/MeetingsList";
import { DeniedMeetingsList } from "../../components/Admin/Meetings/Denieds/MeetingsList";
import { ConfirmedMeetingsList } from "../../components/Admin/Meetings/Confirmeds/MeetingList";
import { TotalMeetingsList } from "../../components/Admin/Meetings/Total/MeetingList";
import { HistoricoMeetingsList } from "../../components/Admin/Meetings/Historico/HistoricoMeetingsList";
import { MeetingForm } from "../../components/User/MeetingForm/MeetingForm";
import { API_URL } from "../../config/api";
import { MeetingCalendar } from "../../components/User/ScheduledMeetings/Calendar";
import type { Meeting, TabType } from "../../types/types";
import { FooterAdmin } from "../../components/Admin/Footer/FooterAdmin";
import { LoadingScreen } from "../../components/layout/LoadingScreen";
import { cn } from "../../lib/cn";
import {
  filterActiveMeetings,
  filterPastMeetings,
  sortMeetingsByDateDesc,
} from "../../lib/meetingDates";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Statistics {
  total: number;
  confirmed: number;
  pending: number;
  denied: number;
  upcoming: number;
  past: number;
}

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

type FormData = Omit<Meeting, "id">;

// ─── Constantes ───────────────────────────────────────────────────────────────

const EMPTY_FORM: FormData = {
  title: "",
  meeting_date: "",
  start_time: "",
  end_time: "",
  location: "",
  participants_count: 0,
  MeetingCalendar: "",
  equipment: [],
  other_equipment: "",
  responsible: "",
  responsible_department: "",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const INPUT = "input input-accent";

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
    <div className="card mb-5 overflow-hidden">
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center justify-between px-5 py-3.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Filter size={15} className="text-accent-600" />
          Filtros
        </div>
        <ChevronDown size={16} className={cn("text-slate-400 transition-transform duration-200", open && "rotate-180")} />
      </button>

      {open && (
        <div className="border-t border-surface-border px-5 py-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className="label">Período</label>
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
              <label className="label">Status</label>
              <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className={INPUT}>
                <option value="all">Todos</option>
                <option value="confirmed">Confirmadas</option>
                <option value="pending">Pendentes</option>
                <option value="denied">Negadas</option>
              </select>
            </div>
            {activeFilter === "month" && (
              <div>
                <label className="label">Mês</label>
                <input type="month" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} className={INPUT} />
              </div>
            )}
            {activeFilter === "custom" && (
              <>
                <div>
                  <label className="label">Data inicial</label>
                  <input type="date" value={customStartDate} onChange={(e) => setCustomStartDate(e.target.value)} className={INPUT} />
                </div>
                <div>
                  <label className="label">Data final</label>
                  <input type="date" value={customEndDate} onChange={(e) => setCustomEndDate(e.target.value)} className={INPUT} />
                </div>
              </>
            )}
          </div>
          <div className="flex gap-2 pt-1">
            <button onClick={onClear} className="btn-secondary">
              Limpar
            </button>
            <button onClick={onApply} className="btn-primary-accent">
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
      <h2 className="text-base font-bold text-slate-800">{title}</h2>
      <span className="text-xs text-slate-400 font-medium">
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

  /** União de todas as listas (evita perder reuniões quando o filtro da aba Total está restrito) */
  const allMeetingsMerged = useMemo(() => {
    const map = new Map<number, Meeting>();
    for (const m of [
      ...totalMeetings,
      ...confirmedMeetings,
      ...pendingMeetings,
      ...deniedMeetings,
    ]) {
      const prev = map.get(m.id);
      map.set(m.id, prev ? { ...prev, ...m, status: m.status ?? prev.status } : m);
    }
    return Array.from(map.values());
  }, [totalMeetings, confirmedMeetings, pendingMeetings, deniedMeetings]);

  const activeTotal     = useMemo(() => filterActiveMeetings(totalMeetings), [totalMeetings]);
  const activeConfirmed = useMemo(() => filterActiveMeetings(confirmedMeetings), [confirmedMeetings]);
  const activePending   = useMemo(() => filterActiveMeetings(pendingMeetings), [pendingMeetings]);
  const activeDenied    = useMemo(() => filterActiveMeetings(deniedMeetings), [deniedMeetings]);
  const historicoMeetings = useMemo(
    () => sortMeetingsByDateDesc(filterPastMeetings(allMeetingsMerged)),
    [allMeetingsMerged],
  );

  // ─── Tabs ──────────────────────────────────────────────────────────────────

  const TABS: { key: TabType; label: string; icon: React.ReactNode; count: number; activeColor: string }[] = [
    { key: "total",     label: "Todas",       icon: <List size={15} />,        count: activeTotal.length,     activeColor: "bg-slate-800 text-white"   },
    { key: "confirmed", label: "Confirmadas", icon: <CheckCircle size={15} />, count: activeConfirmed.length, activeColor: "bg-emerald-600 text-white" },
    { key: "pending",   label: "Pendentes",   icon: <Clock size={15} />,       count: activePending.length,   activeColor: "bg-amber-500 text-white"  },
    { key: "denied",    label: "Negadas",     icon: <XCircle size={15} />,     count: activeDenied.length,    activeColor: "bg-red-600 text-white"    },
    { key: "historico", label: "Histórico",   icon: <History size={15} />,     count: historicoMeetings.length, activeColor: "bg-slate-600 text-white" },
  ];

  // ─── Loading ───────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="page-shell-admin min-h-screen flex flex-col">
        <HeaderAdmin />
        <LoadingScreen message="Carregando reuniões..." role="admin" />
      </div>
    );
  }

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="page-shell-admin flex flex-col min-h-screen">
      <HeaderAdmin />

      <div className="page-container flex-1 space-y-6">

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="section-eyebrow-accent">Painel administrativo</p>
            <h1 className="section-title">Gestão de Reuniões</h1>
            {statistics && (
              <p className="section-subtitle">
                {statistics.total} reunião{statistics.total !== 1 ? "ões" : ""} cadastrada{statistics.total !== 1 ? "s" : ""}
                {" · "}
                <span className="text-accent-600 font-medium">
                  Clique em um dia no calendário para agendar
                </span>
              </p>
            )}
          </div>

          <Link to="/admin/reports" className="btn-secondary self-start sm:self-auto">
            <FileText size={15} />
            Relatórios
          </Link>
        </div>

        {/* ── Formulário inline ── */}
        {showForm && (
          <div id="admin-meeting-form">
            <MeetingForm
              role="admin"
              formData={formData}
              modoEdicao={false}
              onFormChange={setFormData}
              onSuccess={handleFormSuccess}
              onCancel={handleFormCancel}
            />
          </div>
        )}

        {/* ── Tabs ── */}
        <div className="tab-group">
          {TABS.map(({ key, label, icon, count, activeColor }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={cn(
                activeTab === key ? "tab-item-active" : "tab-item-inactive",
                activeTab === key && activeColor,
              )}
            >
              {icon}
              {label}
              <span
                className={cn(
                  "text-xs px-1.5 py-0.5 rounded-full font-bold",
                  activeTab === key ? "bg-white/25 text-white" : "bg-slate-100 text-slate-500",
                )}
              >
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
              <SectionHeader icon={<List size={16} className="text-slate-500" />} title="Reuniões Ativas" count={activeTotal.length} />
              <TotalMeetingsList meetings={activeTotal} />
            </div>
          )}

          {activeTab === "pending" && (
            <div className="space-y-4">
              <SectionHeader icon={<Clock size={16} className="text-amber-500" />} title="Reuniões Pendentes" count={activePending.length} />
              <PendingMeetingsList meetings={activePending} onApprove={handleApproveMeeting} onDeny={handleDenyMeeting} />
            </div>
          )}

          {activeTab === "confirmed" && (
            <div className="space-y-4">
              <SectionHeader icon={<CheckCircle size={16} className="text-emerald-500" />} title="Reuniões Confirmadas" count={activeConfirmed.length} />
              <ConfirmedMeetingsList meetings={activeConfirmed} onUpdate={loadAllMeetings} />
            </div>
          )}

          {activeTab === "denied" && (
            <div className="space-y-4">
              <SectionHeader icon={<XCircle size={16} className="text-red-500" />} title="Reuniões Negadas" count={activeDenied.length} />
              <DeniedMeetingsList meetings={activeDenied} onRestore={handleRestoreMeeting} onDelete={handleDeleteMeeting} />
            </div>
          )}

          {activeTab === "historico" && (
            <div className="space-y-4">
              <SectionHeader
                icon={<History size={16} className="text-slate-500" />}
                title="Histórico de Reuniões"
                count={historicoMeetings.length}
              />
              <p className="text-sm text-slate-500 -mt-2">
                Reuniões já encerradas. Elas continuam visíveis no calendário, mas não aparecem nas outras abas.
              </p>
              <HistoricoMeetingsList meetings={historicoMeetings} />
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