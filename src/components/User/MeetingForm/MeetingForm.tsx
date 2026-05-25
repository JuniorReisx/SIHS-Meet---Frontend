import {
  Save, X, Loader2, Monitor, Tv, Volume2,
  Coffee, Utensils, Info, AlertCircle,
} from "lucide-react";
import { useState, useEffect } from "react";
import { createMeeting, updateMeeting, getAllMeetings } from "../../../services/meetingService";
import type { Meeting } from "../../../types/types";
import { cn } from "../../../lib/cn";
import { roleTheme, type AppRole } from "../../../theme/variants";

// ─── Configurações ────────────────────────────────────────────────────────────

const ROOM_CONFIG: Record<string, { capacity: number; hasService: boolean; hasCoffee: boolean }> = {
  "Reunião Portal da Água": { capacity: 20, hasService: true,  hasCoffee: true  },
  "Sala de Reunião":        { capacity: 10, hasService: false, hasCoffee: true  },
};

const EQUIPMENT_OPTIONS = [
  { id: "projetor", label: "Projetor",       icon: Monitor },
  { id: "tv",       label: "TV",             icon: Tv      },
  { id: "som",      label: "Sistema de Som", icon: Volume2 },
];

// ─── Types ────────────────────────────────────────────────────────────────────

type FormData = Omit<Meeting, "id"> & {
  equipment?: string[];
  other_equipment?: string;
};

interface MeetingFormProps {
  formData: FormData;
  modoEdicao: boolean;
  meetingId?: number;
  role?: AppRole;
  onFormChange: (data: FormData) => void;
  onSuccess: () => void;
  onCancel: () => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────


// Converte "HH:MM" ou "HH:MM:SS" em minutos desde meia-noite
function toMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

// Verifica se dois intervalos de tempo se sobrepõem
// Lógica: A começa antes de B terminar E A termina depois de B começar
function timesOverlap(
  aStart: string, aEnd: string,
  bStart: string, bEnd: string,
): boolean {
  const a1 = toMinutes(aStart);
  const a2 = toMinutes(aEnd);
  const b1 = toMinutes(bStart);
  const b2 = toMinutes(bEnd);
  return a1 < b2 && a2 > b1;
}

// Verifica conflito de sala: mesma data + mesma sala + horário sobreposto
function findRoomConflict(
  meetings: Meeting[],
  date: string,
  location: string,
  startTime: string,
  endTime: string,
  excludeId?: number, // ignora a própria reunião no modo edição
): Meeting | null {
  return meetings.find((m) => {
    if (excludeId !== undefined && m.id === excludeId) return false;
    if (m.meeting_date !== date)     return false;
    if (m.location     !== location) return false;
    if (!m.end_time)                 return false;
    return timesOverlap(startTime, endTime, m.start_time, m.end_time);
  }) ?? null;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function FieldLabel({ text }: { text: string }) {
  return <label className="label">{text}</label>;
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

function CapacityBar({ current, max }: { current: number; max: number }) {
  const pct  = Math.min((current / max) * 100, 100);
  const over = current > max;
  const warn = !over && current / max > 0.8;
  return (
    <div className="mt-2.5 space-y-1">
      <div className="flex justify-between text-xs text-gray-400">
        <span>{current} participante{current !== 1 ? "s" : ""}</span>
        <span>Máx {max}</span>
      </div>
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-300",
            over ? "bg-red-500" : warn ? "bg-amber-400" : "bg-emerald-500",
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function MeetingForm({
  formData, modoEdicao, meetingId, role = "user", onFormChange, onSuccess, onCancel,
}: MeetingFormProps) {
  const theme = roleTheme[role];
  const inputClass = cn("input", theme.inputFocus);
  const [submitting,      setSubmitting]      = useState(false);
  const [error,           setError]           = useState<string | null>(null);
  const [capacityWarning, setCapacityWarning] = useState<string | null>(null);

  const patch = (fields: Partial<FormData>) =>
    onFormChange({ ...formData, ...fields });

  const roomConfig  = formData.location ? ROOM_CONFIG[formData.location] : null;
  const maxCapacity = roomConfig?.capacity ?? null;

  useEffect(() => {
    if (maxCapacity !== null && formData.participants_count > maxCapacity) {
      setCapacityWarning(`"${formData.location}" comporta no máximo ${maxCapacity} participantes.`);
    } else {
      setCapacityWarning(null);
    }
  }, [formData.participants_count, formData.location, maxCapacity]);

  const selectedEquipment: string[] = formData.equipment ?? [];
  const toggleEquipment = (id: string) => {
    const next = selectedEquipment.includes(id)
      ? selectedEquipment.filter((e) => e !== id)
      : [...selectedEquipment, id];
    patch({ equipment: next });
  };

  const handleSubmit = async () => {
    // ── Validação de campos obrigatórios ──────────────────────────────────────
    const required: (keyof FormData)[] = [
      "title", "meeting_date", "start_time", "end_time",
      "location", "responsible", "responsible_department",
    ];
    if (required.some((f) => !formData[f]) || !formData.participants_count) {
      setError("Preencha todos os campos obrigatórios (*).");
      return;
    }

    // ── Validação de horário (início < término) ───────────────────────────────
    if (toMinutes(formData.start_time) >= toMinutes(formData.end_time!)) {
      setError("O horário de término deve ser depois do horário de início.");
      return;
    }

    // ── Validação de capacidade ───────────────────────────────────────────────
    if (maxCapacity !== null && formData.participants_count > maxCapacity) {
      setError(`Número de participantes excede a capacidade da sala (${maxCapacity}).`);
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      // ── Verificação de conflito de sala ───────────────────────────────────
      // Busca todas as reuniões confirmadas para checar sobreposição
      const allMeetings = await getAllMeetings();

      const conflict = findRoomConflict(
        allMeetings,
        formData.meeting_date,
        formData.location,
        formData.start_time,
        formData.end_time!,
        modoEdicao ? meetingId : undefined,
      );

      if (conflict) {
        // Formata o horário do conflito de forma amigável
        const confStart = conflict.start_time.slice(0, 5);
        const confEnd   = conflict.end_time ? conflict.end_time.slice(0, 5) : "?";
        setError(
          `Esta sala já está ocupada das ${confStart} às ${confEnd} com "${conflict.title}". ` +
          `Escolha outro horário ou outra sala.`
        );
        return;
      }

      // ── Salva a reunião ───────────────────────────────────────────────────
      if (modoEdicao && meetingId) {
        await updateMeeting(meetingId, formData);
      } else {
        await createMeeting(formData);
      }
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar reunião.");
    } finally {
      setSubmitting(false);
    }
  };

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="card overflow-hidden w-full animate-slide-up">

      <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-surface-border bg-slate-50/80 sticky top-0 z-10">
        <div>
          <p className={cn("text-xs font-bold uppercase tracking-widest mb-0.5", theme.iconColor)}>
            {modoEdicao ? "Editar" : "Novo agendamento"}
          </p>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
            {modoEdicao ? "Editar Reunião" : "Agendar Reunião"}
          </h2>
        </div>
        <button
          onClick={onCancel}
          disabled={submitting}
          aria-label="Fechar formulário"
          className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors disabled:opacity-40 flex-shrink-0"
        >
          <X size={20} />
        </button>
      </div>

      <div className="px-4 sm:px-5 py-5 space-y-6">

        {/* Error */}
        {error && (
          <div role="alert" className="alert-error">
            <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* ── Informações Básicas ── */}
        <div className="space-y-4">
          <SectionDivider title="Informações básicas" />

          <div>
            <FieldLabel text="Título *" />
            <input
              type="text"
              value={formData.title}
              onChange={(e) => patch({ title: e.target.value })}
              className={inputClass}
              placeholder="Ex: Reunião de Planejamento Trimestral"
              disabled={submitting}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="w-full max-w-xs sm:max-w-none">
              <FieldLabel text="Data *" />
              <input
                type="date"
                value={formData.meeting_date}
                onChange={(e) => patch({ meeting_date: e.target.value })}
                className={inputClass}
                disabled={submitting}
              />
            </div>
            <div className="w-full max-w-xs sm:max-w-none">
              <FieldLabel text="Início *" />
              <input
                type="time"
                value={formData.start_time}
                onChange={(e) => patch({ start_time: e.target.value })}
                className={inputClass}
                disabled={submitting}
              />
            </div>
            <div className="w-full max-w-xs sm:max-w-none">
              <FieldLabel text="Término *" />
              <input
                type="time"
                value={formData.end_time || ""}
                onChange={(e) => patch({ end_time: e.target.value })}
                className={inputClass}
                disabled={submitting}
              />
            </div>
          </div>
        </div>

        {/* ── Sala & Recursos ── */}
        <div className="space-y-4">
          <SectionDivider title="Sala e recursos" />

          <div>
            <FieldLabel text="Local *" />
            <select
              value={formData.location}
              onChange={(e) => patch({ location: e.target.value })}
              className={inputClass}
              disabled={submitting}
            >
              <option value="">Selecione um local</option>
              {Object.keys(ROOM_CONFIG).map((room) => (
                <option key={room} value={room}>{room}</option>
              ))}
            </select>
          </div>

          {roomConfig && (
            <div className="grid grid-cols-3 gap-2 bg-slate-50 border border-surface-border rounded-xl p-3">
              <RoomInfoItem
                icon={<Info size={14} className="text-blue-500" />}
                label="Capacidade"
                value={`${roomConfig.capacity} pessoas`}
              />
              <RoomInfoItem
                icon={<Utensils size={14} className={roomConfig.hasService ? "text-emerald-500" : "text-gray-300"} />}
                label="Serviço"
                value={roomConfig.hasService ? "Sim" : "Não"}
                positive={roomConfig.hasService}
              />
              <RoomInfoItem
                icon={<Coffee size={14} className={roomConfig.hasCoffee ? "text-emerald-500" : "text-gray-300"} />}
                label="Copa"
                value={roomConfig.hasCoffee ? "Sim" : "Não"}
                positive={roomConfig.hasCoffee}
              />
            </div>
          )}

          <div>
            <FieldLabel text="Equipamentos" />
            <div className="flex flex-wrap gap-2">
              {EQUIPMENT_OPTIONS.map(({ id, label, icon: Icon }) => {
                const active = selectedEquipment.includes(id);
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => toggleEquipment(id)}
                    disabled={submitting}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-2 rounded-xl border text-sm font-medium transition-all",
                      active
                        ? role === "admin"
                          ? "border-accent-500 bg-accent-50 text-accent-700"
                          : "border-brand-500 bg-brand-50 text-brand-700"
                        : "border-surface-border bg-white text-slate-600 hover:border-slate-300",
                      "disabled:opacity-50 disabled:cursor-not-allowed",
                    )}
                  >
                    <Icon size={14} />
                    {label}
                    <span
                      className={cn(
                        "w-3.5 h-3.5 rounded border flex items-center justify-center text-[9px] font-bold transition-colors flex-shrink-0",
                        active
                          ? role === "admin"
                            ? "border-accent-500 bg-accent-500 text-white"
                            : "border-brand-500 bg-brand-500 text-white"
                          : "border-slate-300",
                      )}
                    >
                      {active && "✓"}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <FieldLabel text="Outros equipamentos" />
            <input
              type="text"
              value={formData.other_equipment || ""}
              onChange={(e) => patch({ other_equipment: e.target.value })}
              className={inputClass}
              placeholder="Descreva outros equipamentos necessários..."
              disabled={submitting}
            />
          </div>
        </div>

        {/* ── Participantes ── */}
        <div className="space-y-4">
          <SectionDivider title="Participantes" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2">
              <FieldLabel text="Quantidade *" />
              <input
                type="number"
                min="1"
                max={maxCapacity ?? undefined}
                value={formData.participants_count || ""}
                onChange={(e) => patch({ participants_count: parseInt(e.target.value) || 0 })}
                className={cn(
                  inputClass,
                  capacityWarning && "!border-red-400 focus:!border-red-500 focus:shadow-[0_0_0_3px_rgb(239_68_68/0.15)]",
                )}
                placeholder="Ex: 10"
                disabled={submitting}
              />
              {maxCapacity !== null && formData.participants_count > 0 && (
                <CapacityBar current={formData.participants_count} max={maxCapacity} />
              )}
              {capacityWarning && (
                <p className="mt-2 text-xs text-red-600 flex items-center gap-1.5">
                  <AlertCircle size={13} />
                  {capacityWarning}
                </p>
              )}
            </div>
            <div>
              <FieldLabel text="Responsável *" />
              <input
                type="text"
                value={formData.responsible}
                onChange={(e) => patch({ responsible: e.target.value })}
                className={inputClass}
                placeholder="Ex: João Silva"
                disabled={submitting}
              />
            </div>
            <div>
              <FieldLabel text="Departamento *" />
              <input
                type="text"
                value={formData.responsible_department}
                onChange={(e) => patch({ responsible_department: e.target.value })}
                className={inputClass}
                placeholder="Ex: Recursos Humanos"
                disabled={submitting}
              />
            </div>
          </div>
        </div>

        {/* ── Pauta ── */}
        <div className="space-y-4">
          <SectionDivider title="Pauta / Descrição" />
          <textarea
            value={formData.MeetingCalendar || ""}
            onChange={(e) => patch({ MeetingCalendar: e.target.value })}
            rows={3}
            className={cn(inputClass, "resize-none")}
            placeholder="Descreva a pauta e objetivos da reunião..."
            disabled={submitting}
          />
        </div>

        {/* ── Actions ── */}
        <div className="flex flex-col-reverse sm:flex-row gap-2 pt-2 pb-1">
          <button onClick={onCancel} disabled={submitting} className="btn-secondary w-full sm:w-auto">
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting || !!capacityWarning}
            className={cn("w-full sm:flex-1", theme.btnPrimary)}
          >
            {submitting ? (
              <><Loader2 size={16} className="animate-spin" /> Verificando...</>
            ) : (
              <><Save size={16} /> {modoEdicao ? "Salvar Alterações" : "Cadastrar Reunião"}</>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}

// ─── Helpers internos ─────────────────────────────────────────────────────────

function RoomInfoItem({
  icon, label, value, positive,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  positive?: boolean;
}) {
  return (
    <div className="flex flex-col items-center text-center gap-1 py-1">
      <div className="flex items-center gap-1">
        {icon}
        <span className="text-xs text-gray-400">{label}</span>
      </div>
      <span
        className={cn(
          "text-xs font-semibold",
          positive === undefined ? "text-slate-700" : positive ? "text-emerald-600" : "text-slate-400",
        )}
      >
        {value}
      </span>
    </div>
  );
}

// ─── Modal Wrapper ────────────────────────────────────────────────────────────

interface MeetingFormModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function MeetingFormModal({ open, onClose, children }: MeetingFormModalProps) {
  if (!open) return null;
  return (
    <div
      className="modal-overlay overflow-y-auto"
      onClick={onClose}
    >
      <div className="flex min-h-full items-start sm:items-center justify-center px-4 py-6">
        <div className="w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
          {children}
        </div>
      </div>
    </div>
  );
}