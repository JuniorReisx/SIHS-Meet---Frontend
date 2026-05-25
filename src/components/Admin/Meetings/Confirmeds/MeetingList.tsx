import { useState } from "react";
import {
  CheckCircle,
  Pencil,
  Trash2,
  Calendar,
  Clock,
  MapPin,
  Users,
  User,
  Building2,
  X,
  Save,
  Loader2,
  ChevronDown,
  AlertCircle,
} from "lucide-react";
import { API_URL } from "../../../../config/api";
import type { Meeting } from "../../../../types/types";

interface ConfirmedMeetingsListProps {
  meetings: Meeting[];
  onUpdate?: () => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const cls = (...c: (string | false | null | undefined)[]) =>
  c.filter(Boolean).join(" ");

const INPUT =
  "w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 focus:outline-none transition-all placeholder:text-gray-400 disabled:bg-gray-50 disabled:cursor-not-allowed";

function FieldLabel({ text }: { text: string }) {
  return (
    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
      {text}
    </label>
  );
}

function SectionDivider({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-3 py-1">
      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">
        {title}
      </span>
      <div className="flex-1 h-px bg-gray-100" />
    </div>
  );
}

function formatDate(dateStr: string) {
  const [y, m, d] = dateStr.split("-");
  return `${d}/${m}/${y}`;
}

function formatTime(t?: string) {
  return t ? t.slice(0, 5) : "—";
}

// ─── Edit Form ────────────────────────────────────────────────────────────────

function EditForm({
  meeting,
  onCancel,
  onSaved,
}: {
  meeting: Meeting;
  onCancel: () => void;
  onSaved: () => void;
}) {
  const [formData, setFormData] = useState(meeting);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);

  const patch = (fields: Partial<Meeting>) =>
    setFormData((prev) => ({ ...prev, ...fields }));

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/meetingsConfirmed/${meeting.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Erro ao atualizar reunião.");
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gray-50">
        <div>
          <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-0.5">
            Editar reunião
          </p>
          <h3 className="text-base font-bold text-gray-800 leading-tight truncate max-w-xs">
            {meeting.title}
          </h3>
        </div>
        <button
          onClick={onCancel}
          disabled={loading}
          aria-label="Cancelar edição"
          className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition-colors disabled:opacity-40"
        >
          <X size={18} />
        </button>
      </div>

      <div className="px-5 py-5 space-y-5">
        {/* Erro */}
        {error && (
          <div role="alert" className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
            <AlertCircle size={15} className="flex-shrink-0 mt-0.5" />
            {error}
          </div>
        )}

        {/* Informações básicas */}
        <div className="space-y-4">
          <SectionDivider title="Informações básicas" />

          <div>
            <FieldLabel text="Título" />
            <input type="text" value={formData.title} onChange={(e) => patch({ title: e.target.value })} className={INPUT} disabled={loading} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <FieldLabel text="Data" />
              <input type="date" value={formData.meeting_date} onChange={(e) => patch({ meeting_date: e.target.value })} className={INPUT} disabled={loading} />
            </div>
            <div>
              <FieldLabel text="Início" />
              <input type="time" value={formData.start_time} onChange={(e) => patch({ start_time: e.target.value })} className={INPUT} disabled={loading} />
            </div>
            <div>
              <FieldLabel text="Término" />
              <input type="time" value={formData.end_time || ""} onChange={(e) => patch({ end_time: e.target.value })} className={INPUT} disabled={loading} />
            </div>
          </div>
        </div>

        {/* Sala & Participantes */}
        <div className="space-y-4">
          <SectionDivider title="Sala e participantes" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <FieldLabel text="Local" />
              <input type="text" value={formData.location} onChange={(e) => patch({ location: e.target.value })} className={INPUT} disabled={loading} />
            </div>
            <div>
              <FieldLabel text="Participantes" />
              <input type="number" min="1" value={formData.participants_count} onChange={(e) => patch({ participants_count: parseInt(e.target.value) || 1 })} className={INPUT} disabled={loading} />
            </div>
          </div>
        </div>

        {/* Responsável */}
        <div className="space-y-4">
          <SectionDivider title="Responsável" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <FieldLabel text="Nome" />
              <input type="text" value={formData.responsible} onChange={(e) => patch({ responsible: e.target.value })} className={INPUT} disabled={loading} />
            </div>
            <div>
              <FieldLabel text="Departamento" />
              <input type="text" value={formData.responsible_department} onChange={(e) => patch({ responsible_department: e.target.value })} className={INPUT} disabled={loading} />
            </div>
          </div>
        </div>

        {/* Descrição */}
        <div className="space-y-4">
          <SectionDivider title="Descrição" />
          <textarea
            value={formData.description}
            onChange={(e) => patch({ description: e.target.value })}
            rows={3}
            className={cls(INPUT, "resize-none")}
            placeholder="Descreva a pauta..."
            disabled={loading}
          />
        </div>

        {/* Actions */}
        <div className="flex flex-col-reverse sm:flex-row gap-2 pt-1">
          <button
            onClick={onCancel}
            disabled={loading}
            className="w-full sm:w-auto px-5 py-2.5 rounded-lg border border-gray-200 bg-white text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="w-full sm:flex-1 flex items-center justify-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors disabled:opacity-50"
          >
            {loading
              ? <><Loader2 size={15} className="animate-spin" /> Salvando...</>
              : <><Save size={15} /> Salvar alterações</>
            }
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Meeting Card ─────────────────────────────────────────────────────────────

function ConfirmedMeetingCard({
  meeting,
  onUpdate,
}: {
  meeting: Meeting;
  onUpdate?: () => void;
}) {
  const [expanded,  setExpanded]  = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [deleting,  setDeleting]  = useState(false);
  const [error,     setError]     = useState<string | null>(null);

  const handleDelete = async () => {
    if (!window.confirm(`Excluir a reunião "${meeting.title}"?`)) return;
    setDeleting(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/meetingsConfirmed/${meeting.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Erro ao excluir reunião.");
      onUpdate?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao excluir.");
    } finally {
      setDeleting(false);
    }
  };

  if (isEditing) {
    return (
      <EditForm
        meeting={meeting}
        onCancel={() => setIsEditing(false)}
        onSaved={() => { setIsEditing(false); onUpdate?.(); }}
      />
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      {/* Status stripe */}
      <div className="h-0.5 bg-emerald-500" />

      <div className="p-5">
        {/* Top row */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                <CheckCircle size={11} />
                Confirmada
              </span>
            </div>
            <h3 className="text-base font-bold text-gray-800 truncate">{meeting.title}</h3>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button
              onClick={() => setIsEditing(true)}
              disabled={deleting}
              aria-label="Editar reunião"
              className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors disabled:opacity-40"
            >
              <Pencil size={15} />
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              aria-label="Excluir reunião"
              className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-40"
            >
              {deleting ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div role="alert" className="mb-3 flex items-center gap-2 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            <AlertCircle size={13} /> {error}
          </div>
        )}

        {/* Info grid */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <InfoChip icon={<Calendar size={13} className="text-blue-500" />}   label="Data"         value={formatDate(meeting.meeting_date)} />
          <InfoChip icon={<Clock size={13} className="text-indigo-500" />}    label="Horário"      value={`${formatTime(meeting.start_time)} – ${formatTime(meeting.end_time)}`} />
          <InfoChip icon={<MapPin size={13} className="text-purple-500" />}   label="Local"        value={meeting.location} />
          <InfoChip icon={<Users size={13} className="text-emerald-500" />}   label="Participantes" value={`${meeting.participants_count} pessoa${meeting.participants_count !== 1 ? "s" : ""}`} />
        </div>

        {/* Expanded details */}
        {expanded && (
          <div className="mt-3 pt-3 border-t border-gray-100 space-y-3">
            <InfoChip icon={<User size={13} className="text-orange-500" />}     label="Responsável"  value={meeting.responsible}            full />
            <InfoChip icon={<Building2 size={13} className="text-gray-400" />}  label="Departamento" value={meeting.responsible_department}  full />
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
          className="mt-3 w-full flex items-center justify-center gap-1 py-1.5 text-xs font-semibold text-gray-400 hover:text-gray-600 transition-colors"
        >
          <ChevronDown size={14} className={cls("transition-transform duration-200", expanded && "rotate-180")} />
          {expanded ? "Ocultar detalhes" : "Ver detalhes"}
        </button>
      </div>
    </div>
  );
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

// ─── List ─────────────────────────────────────────────────────────────────────

export function ConfirmedMeetingsList({ meetings, onUpdate }: ConfirmedMeetingsListProps) {
  const safeMeetings = Array.isArray(meetings) ? meetings : [];

  if (safeMeetings.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
        <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-emerald-50 flex items-center justify-center">
          <CheckCircle size={28} className="text-emerald-400" />
        </div>
        <p className="font-semibold text-gray-700 mb-1">Nenhuma reunião confirmada</p>
        <p className="text-sm text-gray-400">As reuniões aprovadas aparecerão aqui.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {safeMeetings.map((meeting) => (
        <ConfirmedMeetingCard key={meeting.id} meeting={meeting} onUpdate={onUpdate} />
      ))}
    </div>
  );
}