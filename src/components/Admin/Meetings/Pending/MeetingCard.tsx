import { Calendar, Clock, MapPin, Users, User, Building2, X, Check, ChevronDown, Loader2, AlertCircle } from "lucide-react";
import { useState } from "react";
import { API_URL } from "../../../../config/api";

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
}

interface Props {
  meeting: Meeting;
  onApprove: (meetingId: number) => void;
  onDeny: (meetingId: number) => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const cls = (...c: (string | false | null | undefined)[]) =>
  c.filter(Boolean).join(" ");

function formatDate(dateStr: string) {
  const [y, m, d] = dateStr.split("-");
  return `${d}/${m}/${y}`;
}

function formatTime(t?: string) {
  return t ? t.slice(0, 5) : "—";
}

// ─── Info Chip ────────────────────────────────────────────────────────────────

function InfoChip({
  icon,
  label,
  value,
  full,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  full?: boolean;
}) {
  return (
    <div className={cls("bg-gray-50 rounded-lg px-3 py-2", full && "col-span-2")}>
      <div className="flex items-center gap-1 mb-0.5">
        {icon}
        <p className="text-xs text-gray-400 font-medium">{label}</p>
      </div>
      <p className="text-sm font-semibold text-gray-700 truncate">{value}</p>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function PendingMeetingCard({ meeting, onApprove, onDeny }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [loading,  setLoading]  = useState<"approve" | "deny" | null>(null);
  const [error,    setError]    = useState<string | null>(null);

  const handleApprove = async () => {
    setLoading("approve");
    setError(null);
    try {
      const res = await fetch(`${API_URL}/meetingsConfirmed`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(meeting),
      });
      if (!res.ok) throw new Error("Erro ao aprovar reunião.");

      const del = await fetch(`${API_URL}/meetingsPending/${meeting.id}`, { method: "DELETE" });
      if (!del.ok) throw new Error("Erro ao remover reunião pendente.");

      onApprove(meeting.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao aprovar.");
    } finally {
      setLoading(null);
    }
  };

  const handleDeny = async () => {
    setLoading("deny");
    setError(null);
    try {
      const res = await fetch(`${API_URL}/meetingsDenied`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(meeting),
      });
      if (!res.ok) throw new Error("Erro ao negar reunião.");

      const del = await fetch(`${API_URL}/meetingsPending/${meeting.id}`, { method: "DELETE" });
      if (!del.ok) throw new Error("Erro ao remover reunião pendente.");

      onDeny(meeting.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao negar.");
    } finally {
      setLoading(null);
    }
  };

  const busy = loading !== null;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      {/* Status stripe */}
      <div className="h-0.5 bg-amber-400" />

      <div className="p-5">
        {/* Top row */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex-1 min-w-0">
            <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full mb-1">
              <Clock size={11} />
              Pendente
            </span>
            <h3 className="text-base font-bold text-gray-800 truncate">{meeting.title}</h3>
          </div>
          <span className="flex-shrink-0 flex items-center gap-1 text-xs text-gray-400 bg-gray-50 border border-gray-200 px-2 py-0.5 rounded-full">
            <Users size={11} />
            {meeting.participants_count}
          </span>
        </div>

        {/* Error */}
        {error && (
          <div role="alert" className="mb-3 flex items-center gap-2 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            <AlertCircle size={13} /> {error}
          </div>
        )}

        {/* Info grid */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <InfoChip icon={<Calendar size={13} className="text-blue-500" />}  label="Data"    value={formatDate(meeting.meeting_date)} />
          <InfoChip icon={<Clock size={13} className="text-indigo-500" />}   label="Horário" value={`${formatTime(meeting.start_time)} – ${formatTime(meeting.end_time)}`} />
          <InfoChip icon={<MapPin size={13} className="text-purple-500" />}  label="Local"   value={meeting.location} full />
        </div>

        {/* Expanded details */}
        {expanded && (
          <div className="mt-2 pt-3 border-t border-gray-100 space-y-2 mb-2">
            <InfoChip icon={<User size={13} className="text-orange-500" />}     label="Responsável"  value={meeting.responsible}           full />
            <InfoChip icon={<Building2 size={13} className="text-gray-400" />}  label="Departamento" value={meeting.responsible_department} full />
            {meeting.description && (
              <div className="bg-gray-50 rounded-lg px-3 py-2.5">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Descrição</p>
                <p className="text-sm text-gray-700 leading-relaxed">{meeting.description}</p>
              </div>
            )}
          </div>
        )}

        {/* Toggle */}
        <button
          onClick={() => setExpanded((p) => !p)}
          className="w-full flex items-center justify-center gap-1 py-1.5 text-xs font-semibold text-gray-400 hover:text-gray-600 transition-colors"
        >
          <ChevronDown size={14} className={cls("transition-transform duration-200", expanded && "rotate-180")} />
          {expanded ? "Ocultar detalhes" : "Ver detalhes"}
        </button>

        {/* Actions */}
        <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
          <button
            onClick={handleDeny}
            disabled={busy}
            className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 border border-gray-200 bg-white hover:bg-red-50 hover:border-red-300 text-gray-600 hover:text-red-600 text-sm font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading === "deny"
              ? <Loader2 size={14} className="animate-spin" />
              : <X size={14} />}
            Negar
          </button>
          <button
            onClick={handleApprove}
            disabled={busy}
            className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading === "approve"
              ? <Loader2 size={14} className="animate-spin" />
              : <Check size={14} />}
            Aprovar
          </button>
        </div>
      </div>
    </div>
  );
}