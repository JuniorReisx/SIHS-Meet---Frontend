import { Calendar, Clock, MapPin, Users, User, Building2, X, Check, ChevronDown, Loader2, AlertCircle, Monitor } from "lucide-react";
import { useState } from "react";
import { API_URL } from "../../../../config/api";
import { formatEquipment } from "../../../../config/equipment";
import { convertToPayload } from "../../../../services/meetingService";
import type { Meeting } from "../../../../types/types";

interface Props {
  meeting: Meeting;
  onApprove: (meetingId: number) => void;
  onDeny: (meetingId: number) => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

import { cn } from "../../../../lib/cn";

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
    <div className={cn("info-chip", full && "col-span-2")}>
      <div className="flex items-center gap-1 mb-0.5">
        {icon}
        <p className="text-xs text-slate-400 font-medium">{label}</p>
      </div>
      <p className="text-sm font-semibold text-slate-700 truncate">{value}</p>
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
        body: JSON.stringify(convertToPayload(meeting)),
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
        body: JSON.stringify(convertToPayload(meeting)),
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
  const equipmentText = formatEquipment(meeting.equipment, meeting.other_equipment);
  const description = meeting.description ?? meeting.MeetingCalendar;

  return (
    <div className="card-interactive overflow-hidden">
      <div className="status-stripe-pending" />

      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex-1 min-w-0">
            <span className="badge-pending mb-2">
              <Clock size={11} />
              Pendente
            </span>
            <h3 className="text-base font-bold text-slate-900 truncate">{meeting.title}</h3>
          </div>
          <span className="flex-shrink-0 flex items-center gap-1 text-xs text-slate-500 bg-slate-50 border border-surface-border px-2.5 py-1 rounded-full">
            <Users size={11} />
            {meeting.participants_count}
          </span>
        </div>

        {/* Error */}
        {error && (
          <div role="alert" className="alert-error mb-3 text-xs">
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
          <div className="mt-2 pt-3 border-t border-surface-border space-y-2 mb-2">
            <InfoChip icon={<User size={13} className="text-orange-500" />}     label="Responsável"  value={meeting.responsible}           full />
            <InfoChip icon={<Building2 size={13} className="text-gray-400" />}  label="Departamento" value={meeting.responsible_department} full />
            {equipmentText && (
              <InfoChip icon={<Monitor size={13} className="text-cyan-500" />} label="Equipamentos" value={equipmentText} full />
            )}
            {description && (
              <div className="info-chip">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">Descrição</p>
                <p className="text-sm text-slate-700 leading-relaxed">{description}</p>
              </div>
            )}
          </div>
        )}

        {/* Toggle */}
        <button
          onClick={() => setExpanded((p) => !p)}
          className="w-full flex items-center justify-center gap-1 py-1.5 text-xs font-semibold text-slate-400 hover:text-slate-600 transition-colors"
        >
          <ChevronDown size={14} className={cn("transition-transform duration-200", expanded && "rotate-180")} />
          {expanded ? "Ocultar detalhes" : "Ver detalhes"}
        </button>

        {/* Actions */}
        <div className="flex gap-2 mt-3 pt-3 border-t border-surface-border">
          <button
            onClick={handleDeny}
            disabled={busy}
            className="btn-secondary flex-1 hover:!text-red-600 hover:!bg-red-50 hover:!border-red-200"
          >
            {loading === "deny"
              ? <Loader2 size={14} className="animate-spin" />
              : <X size={14} />}
            Negar
          </button>
          <button
            onClick={handleApprove}
            disabled={busy}
            className="btn flex-1 bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm focus-visible:ring-emerald-500"
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