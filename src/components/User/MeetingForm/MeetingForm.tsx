import { Save, X, Loader2, Monitor, Tv, Volume2, Coffee, Utensils, Info, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { createMeeting, updateMeeting } from "../../../services/meetingService";
import type { Meeting } from "../../../types/types";

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
  onFormChange: (data: FormData) => void;
  onSuccess: () => void;
  onCancel: () => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const cls = (...classes: (string | false | null | undefined)[]) =>
  classes.filter(Boolean).join(" ");

const INPUT =
  "w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all placeholder:text-gray-400 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed";

// ─── Sub-components ───────────────────────────────────────────────────────────

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
          className={cls(
            "h-full rounded-full transition-all duration-300",
            over ? "bg-red-500" : warn ? "bg-amber-400" : "bg-emerald-500"
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function MeetingForm({
  formData, modoEdicao, meetingId, onFormChange, onSuccess, onCancel,
}: MeetingFormProps) {
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
    const required: (keyof FormData)[] = [
      "title", "meeting_date", "start_time", "end_time",
      "location", "responsible", "responsible_department",
    ];
    if (required.some((f) => !formData[f]) || !formData.participants_count) {
      setError("Preencha todos os campos obrigatórios (*).");
      return;
    }
    if (maxCapacity !== null && formData.participants_count > maxCapacity) {
      setError(`Número de participantes excede a capacidade da sala (${maxCapacity}).`);
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
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

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden w-full">

      {/* ── Header ── */}
      <div className="flex items-center justify-between px-4 sm:px-5 py-4 border-b border-gray-100 bg-gray-50 sticky top-0 z-10">
        <div>
          <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-0.5">
            {modoEdicao ? "Editar" : "Novo agendamento"}
          </p>
          <h2 className="text-base sm:text-lg font-bold text-gray-800 leading-tight">
            {modoEdicao ? "Editar Reunião" : "Agendar Reunião"}
          </h2>
        </div>
        <button
          onClick={onCancel}
          disabled={submitting}
          aria-label="Fechar formulário"
          className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition-colors disabled:opacity-40 flex-shrink-0"
        >
          <X size={20} />
        </button>
      </div>

      <div className="px-4 sm:px-5 py-5 space-y-6">

        {/* Error */}
        {error && (
          <div role="alert" className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
            <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* ── Informações Básicas ── */}
        <div className="space-y-4">
          <SectionDivider title="Informações básicas" />

          {/* Título */}
          <div>
            <FieldLabel text="Título *" />
            <input
              type="text"
              value={formData.title}
              onChange={(e) => patch({ title: e.target.value })}
              className={INPUT}
              placeholder="Ex: Reunião de Planejamento Trimestral"
              disabled={submitting}
            />
          </div>

          {/*
           * Data, Início e Término — todos empilhados (1 coluna), largura máxima limitada.
           * Isso elimina qualquer problema de overflow em qualquer tamanho de tela.
           * No desktop ficam lado a lado (3 colunas) para não desperdiçar espaço.
           */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Data — largura máxima para não esticar demais no desktop */}
            <div className="w-full max-w-xs sm:max-w-none">
              <FieldLabel text="Data *" />
              <input
                type="date"
                value={formData.meeting_date}
                onChange={(e) => patch({ meeting_date: e.target.value })}
                className={INPUT}
                disabled={submitting}
              />
            </div>

            {/* Início — largura máxima limitada no mobile */}
            <div className="w-full max-w-xs sm:max-w-none">
              <FieldLabel text="Início *" />
              <input
                type="time"
                value={formData.start_time}
                onChange={(e) => patch({ start_time: e.target.value })}
                className={INPUT}
                disabled={submitting}
              />
            </div>

            {/* Término — largura máxima limitada no mobile */}
            <div className="w-full max-w-xs sm:max-w-none">
              <FieldLabel text="Término *" />
              <input
                type="time"
                value={formData.end_time || ""}
                onChange={(e) => patch({ end_time: e.target.value })}
                className={INPUT}
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
              className={INPUT}
              disabled={submitting}
            >
              <option value="">Selecione um local</option>
              {Object.keys(ROOM_CONFIG).map((room) => (
                <option key={room} value={room}>{room}</option>
              ))}
            </select>
          </div>

          {roomConfig && (
            <div className="grid grid-cols-3 gap-2 bg-slate-50 border border-slate-200 rounded-xl p-3">
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
                    className={cls(
                      "flex items-center gap-1.5 px-3 py-2 rounded-lg border text-sm font-medium transition-all",
                      active
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-200 bg-white text-gray-600 hover:border-gray-300",
                      "disabled:opacity-50 disabled:cursor-not-allowed"
                    )}
                  >
                    <Icon size={14} />
                    {label}
                    <span className={cls(
                      "w-3.5 h-3.5 rounded border flex items-center justify-center text-[9px] font-bold transition-colors flex-shrink-0",
                      active ? "border-blue-500 bg-blue-500 text-white" : "border-gray-300"
                    )}>
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
              className={INPUT}
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
                className={cls(INPUT, capacityWarning ? "border-red-400 focus:border-red-500 focus:ring-red-100" : "")}
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
                className={INPUT}
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
                className={INPUT}
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
            className={cls(INPUT, "resize-none")}
            placeholder="Descreva a pauta e objetivos da reunião..."
            disabled={submitting}
          />
        </div>

        {/* ── Actions ── */}
        <div className="flex flex-col-reverse sm:flex-row gap-2 pt-2 pb-1">
          <button
            onClick={onCancel}
            disabled={submitting}
            className="w-full sm:w-auto px-5 py-2.5 rounded-lg border border-gray-200 bg-white text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting || !!capacityWarning}
            className="w-full sm:flex-1 flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <><Loader2 size={16} className="animate-spin" /> Salvando...</>
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
      <span className={cls(
        "text-xs font-semibold",
        positive === undefined ? "text-slate-700" : positive ? "text-emerald-600" : "text-gray-400"
      )}>
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
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm overflow-y-auto"
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