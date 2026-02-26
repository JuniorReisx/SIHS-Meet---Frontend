import { Save, X, Loader2, Monitor, Tv, Volume2, Coffee, Utensils, Info } from "lucide-react";
import { useState, useEffect } from "react";
import { createMeeting, updateMeeting } from "../../../services/meetingService";
import type { Meeting } from "../../../types/types";

// ─── Room Configurations ──────────────────────────────────────────────────────
const ROOM_CONFIG: Record<
  string,
  { capacity: number; hasService: boolean; hasCoffee: boolean }
> = {
  "Reunião Portal da Água": { capacity: 20, hasService: true, hasCoffee: true },
  "Sala de Reunião": { capacity: 10, hasService: false, hasCoffee: true },
};

const EQUIPMENT_OPTIONS = [
  { id: "projetor", label: "Projetor", icon: Monitor },
  { id: "tv", label: "TV", icon: Tv },
  { id: "som", label: "Sistema de Som", icon: Volume2 },
];

// ─── Types ────────────────────────────────────────────────────────────────────
interface MeetingFormProps {
  formData: Omit<Meeting, "id"> & {
    equipment?: string[];
    other_equipment?: string;
  };
  modoEdicao: boolean;
  meetingId?: number;
  onFormChange: (
    data: Omit<Meeting, "id"> & {
      equipment?: string[];
      other_equipment?: string;
    }
  ) => void;
  onSuccess: () => void;
  onCancel: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────
export function MeetingForm({
  formData,
  modoEdicao,
  meetingId,
  onFormChange,
  onSuccess,
  onCancel,
}: MeetingFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [capacityWarning, setCapacityWarning] = useState<string | null>(null);

  // ── Derived room info ──────────────────────────────────────────────────────
  const roomConfig = formData.location ? ROOM_CONFIG[formData.location] : null;
  const maxCapacity = roomConfig?.capacity ?? null;

  // ── Watch participants vs capacity ─────────────────────────────────────────
  useEffect(() => {
    if (maxCapacity !== null && formData.participants_count > maxCapacity) {
      setCapacityWarning(
        `A sala "${formData.location}" comporta no máximo ${maxCapacity} participantes. Reduza o número ou escolha outra sala.`
      );
    } else {
      setCapacityWarning(null);
    }
  }, [formData.participants_count, formData.location, maxCapacity]);

  // ── Equipment helpers ──────────────────────────────────────────────────────
  const selectedEquipment: string[] = formData.equipment ?? [];

  const toggleEquipment = (id: string) => {
    const next = selectedEquipment.includes(id)
      ? selectedEquipment.filter((e) => e !== id)
      : [...selectedEquipment, id];
    onFormChange({ ...formData, equipment: next });
  };

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (
      !formData.title ||
      !formData.meeting_date ||
      !formData.start_time ||
      !formData.end_time ||
      !formData.location ||
      !formData.participants_count ||
      !formData.responsible ||
      !formData.responsible_department
    ) {
      setError("Por favor, preencha todos os campos obrigatórios (*)");
      return;
    }

    // 🔒 Business rule: block if participants exceed room capacity
    if (maxCapacity !== null && formData.participants_count > maxCapacity) {
      setError(
        `Não é possível confirmar a reunião: o número de participantes (${formData.participants_count}) excede a capacidade máxima da sala (${maxCapacity}).`
      );
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
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao salvar reunião";
      setError(errorMessage);
      console.error("Erro ao salvar reunião:", err);
    } finally {
      setSubmitting(false);
    }
  };

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border-2 border-blue-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-blue-900">
          {modoEdicao ? "Editar Reunião" : "Nova Reunião"}
        </h2>
        <button
          onClick={onCancel}
          disabled={submitting}
          className="text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-50"
        >
          <X size={24} />
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
          <p className="text-red-700 font-medium">{error}</p>
        </div>
      )}

      <div className="space-y-8">
        {/* ── Section: Basic Info ── */}
        <Section title="Informações Básicas">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="md:col-span-2">
              <Label text="Título da Reunião *" />
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  onFormChange({ ...formData, title: e.target.value })
                }
                className={inputCls}
                placeholder="Ex: Reunião de Planejamento Trimestral"
                disabled={submitting}
              />
            </div>

            {/* Date */}
            <div>
              <Label text="Data da Reunião *" />
              <input
                type="date"
                value={formData.meeting_date}
                onChange={(e) =>
                  onFormChange({ ...formData, meeting_date: e.target.value })
                }
                className={inputCls}
                disabled={submitting}
              />
            </div>

            {/* Start time */}
            <div>
              <Label text="Horário de Início *" />
              <input
                type="time"
                value={formData.start_time}
                onChange={(e) =>
                  onFormChange({ ...formData, start_time: e.target.value })
                }
                className={inputCls}
                disabled={submitting}
              />
            </div>

            {/* End time */}
            <div>
              <Label text="Horário de Término *" />
              <input
                type="time"
                value={formData.end_time || ""}
                onChange={(e) =>
                  onFormChange({ ...formData, end_time: e.target.value })
                }
                className={inputCls}
                disabled={submitting}
              />
            </div>
          </div>
        </Section>

        {/* ── Section: Room ── */}
        <Section title="🛠️ Recursos da Sala">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Location */}
            <div className="md:col-span-2">
              <Label text="Local *" />
              <select
                value={formData.location}
                onChange={(e) =>
                  onFormChange({
                    ...formData,
                    location: e.target.value,
                    // reset participants warning
                  })
                }
                className={inputCls}
                disabled={submitting}
              >
                <option value="">Selecione um local</option>
                {Object.keys(ROOM_CONFIG).map((room) => (
                  <option key={room} value={room}>
                    {room}
                  </option>
                ))}
              </select>
            </div>

            {/* Room details card */}
            {roomConfig && (
              <div className="md:col-span-2 bg-blue-50 border border-blue-200 rounded-lg p-4 flex flex-wrap gap-6">
                <RoomBadge
                  icon={<Info size={16} className="text-blue-600" />}
                  label="Capacidade máxima"
                  value={`${roomConfig.capacity} pessoas`}
                />
                <RoomBadge
                  icon={<Utensils size={16} className={roomConfig.hasService ? "text-green-600" : "text-gray-400"} />}
                  label="Serviço"
                  value={roomConfig.hasService ? "Disponível" : "Não disponível"}
                  positive={roomConfig.hasService}
                />
                <RoomBadge
                  icon={<Coffee size={16} className={roomConfig.hasCoffee ? "text-green-600" : "text-gray-400"} />}
                  label="Copa"
                  value={roomConfig.hasCoffee ? "Disponível" : "Não disponível"}
                  positive={roomConfig.hasCoffee}
                />
              </div>
            )}

            {/* Equipment checkboxes */}
            <div className="md:col-span-2">
              <Label text="Equipamentos" />
              <div className="flex flex-wrap gap-3 mt-1">
                {EQUIPMENT_OPTIONS.map(({ id, label, icon: Icon }) => {
                  const checked = selectedEquipment.includes(id);
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => toggleEquipment(id)}
                      disabled={submitting}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 font-medium text-sm transition-all
                        ${
                          checked
                            ? "border-blue-500 bg-blue-50 text-blue-700"
                            : "border-gray-200 bg-white text-gray-600 hover:border-blue-300"
                        }
                        disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      <Icon size={16} />
                      {label}
                      {/* checkmark */}
                      <span
                        className={`ml-1 w-4 h-4 rounded border-2 flex items-center justify-center text-xs
                          ${checked ? "border-blue-500 bg-blue-500 text-white" : "border-gray-300"}`}
                      >
                        {checked && "✓"}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Other equipment */}
            <div className="md:col-span-2">
              <Label text="Outros equipamentos" />
              <input
                type="text"
                value={formData.other_equipment || ""}
                onChange={(e) =>
                  onFormChange({ ...formData, other_equipment: e.target.value })
                }
                className={inputCls}
                placeholder="Descreva outros equipamentos necessários..."
                disabled={submitting}
              />
            </div>
          </div>
        </Section>

        {/* ── Section: Participants ── */}
        <Section title="👥 Participantes">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <Label text="Quantidade de Participantes *" />
              <input
                type="number"
                min="1"
                max={maxCapacity ?? undefined}
                value={formData.participants_count}
                onChange={(e) =>
                  onFormChange({
                    ...formData,
                    participants_count: parseInt(e.target.value) || 0,
                  })
                }
                className={`${inputCls} ${
                  capacityWarning ? "border-red-400 focus:border-red-500" : ""
                }`}
                placeholder="Ex: 10"
                disabled={submitting}
              />

              {/* Capacity progress bar */}
              {maxCapacity !== null && formData.participants_count > 0 && (
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>{formData.participants_count} participantes</span>
                    <span>Máx: {maxCapacity}</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        formData.participants_count > maxCapacity
                          ? "bg-red-500"
                          : formData.participants_count / maxCapacity > 0.8
                          ? "bg-yellow-400"
                          : "bg-green-500"
                      }`}
                      style={{
                        width: `${Math.min(
                          (formData.participants_count / maxCapacity) * 100,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Capacity warning */}
              {capacityWarning && (
                <div className="mt-2 flex items-start gap-2 text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg p-3">
                  <span className="text-base">⚠️</span>
                  <span>{capacityWarning}</span>
                </div>
              )}
            </div>

            <div>
              <Label text="Responsável *" />
              <input
                type="text"
                value={formData.responsible}
                onChange={(e) =>
                  onFormChange({ ...formData, responsible: e.target.value })
                }
                className={inputCls}
                placeholder="Ex: João Silva"
                disabled={submitting}
              />
            </div>

            <div>
              <Label text="Departamento do Responsável *" />
              <input
                type="text"
                value={formData.responsible_department}
                onChange={(e) =>
                  onFormChange({
                    ...formData,
                    responsible_department: e.target.value,
                  })
                }
                className={inputCls}
                placeholder="Ex: Recursos Humanos"
                disabled={submitting}
              />
            </div>
          </div>
        </Section>

        {/* ── Section: Description ── */}
        <Section title="Descrição / Pauta">
          <textarea
            value={formData.MeetingCalendar || ""}
            onChange={(e) =>
              onFormChange({ ...formData, MeetingCalendar: e.target.value })
            }
            rows={4}
            className={`${inputCls} resize-none`}
            placeholder="Descreva a pauta e objetivos da reunião..."
            disabled={submitting}
          />
        </Section>

        {/* ── Actions ── */}
        <div className="flex gap-4 pt-2">
          <button
            onClick={handleSubmit}
            disabled={submitting || !!capacityWarning}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg shadow-md flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save size={20} />
                {modoEdicao ? "Salvar Alterações" : "Cadastrar Reunião"}
              </>
            )}
          </button>
          <button
            onClick={onCancel}
            disabled={submitting}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold px-8 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Small helpers ────────────────────────────────────────────────────────────
const inputCls =
  "w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors";

function Label({ text }: { text: string }) {
  return (
    <label className="block text-sm font-semibold text-gray-700 mb-2">
      {text}
    </label>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="text-base font-bold text-blue-800 mb-4 pb-2 border-b border-blue-100">
        {title}
      </h3>
      {children}
    </div>
  );
}

function RoomBadge({
  icon,
  label,
  value,
  positive,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  positive?: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      {icon}
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p
          className={`text-sm font-semibold ${
            positive === undefined
              ? "text-blue-800"
              : positive
              ? "text-green-700"
              : "text-gray-400"
          }`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}