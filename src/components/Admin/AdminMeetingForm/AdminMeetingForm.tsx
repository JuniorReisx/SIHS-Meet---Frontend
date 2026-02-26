import { Save, Monitor, Tv, Volume2, Coffee, Utensils, Info } from "lucide-react";

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

// ─── Helpers ──────────────────────────────────────────────────────────────────
const inputCls =
  "w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors";

function Label({ text }: { text: string }) {
  return (
    <label className="block text-sm font-semibold text-gray-700 mb-2">
      {text}
    </label>
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

// ─── Props (adapte ao tipo real do seu projeto) ───────────────────────────────
interface AdminFormData {
  title: string;
  meeting_date: string;
  start_time: string;
  end_time: string;
  location: string;
  participants_count: number;
  responsible: string;
  responsible_department: string;
  description: string;
  equipment?: string[];
  other_equipment?: string;
}

interface AdminMeetingFormProps {
  formData: AdminFormData;
  setFormData: (data: AdminFormData) => void;
  loading: boolean;
  onClose: () => void;
  handleSubmit: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────
export function AdminMeetingForm({
  formData,
  setFormData,
  loading,
  onClose,
  handleSubmit,
}: AdminMeetingFormProps) {
  // ── Room config derived ────────────────────────────────────────────────────
  const roomConfig = formData.location ? ROOM_CONFIG[formData.location] : null;
  const maxCapacity = roomConfig?.capacity ?? null;

  // ── Capacity warning — computed directly, no effect needed ─────────────────
  const capacityWarning =
    maxCapacity !== null && formData.participants_count > maxCapacity
      ? `A sala "${formData.location}" comporta no máximo ${maxCapacity} participantes. Reduza o número ou escolha outra sala.`
      : null;

  // ── Equipment toggle ───────────────────────────────────────────────────────
  const selectedEquipment: string[] = formData.equipment ?? [];

  const toggleEquipment = (id: string) => {
    const next = selectedEquipment.includes(id)
      ? selectedEquipment.filter((e) => e !== id)
      : [...selectedEquipment, id];
    setFormData({ ...formData, equipment: next });
  };

  // ── Intercept submit to enforce capacity rule ──────────────────────────────
  const onSubmit = () => {
    if (maxCapacity !== null && formData.participants_count > maxCapacity) {
      return; // blocked — button should already be disabled, but guard here too
    }
    handleSubmit();
  };

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">

      {/* ── Basic fields ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Title */}
        <div className="md:col-span-2">
          <Label text="Título da Reunião *" />
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className={inputCls}
            placeholder="Ex: Reunião de Planejamento Trimestral"
            disabled={loading}
          />
        </div>

        {/* Date */}
        <div>
          <Label text="Data da Reunião *" />
          <input
            type="date"
            value={formData.meeting_date}
            onChange={(e) => setFormData({ ...formData, meeting_date: e.target.value })}
            className={inputCls}
            disabled={loading}
          />
        </div>

        {/* Start time */}
        <div>
          <Label text="Horário de Início *" />
          <input
            type="time"
            value={formData.start_time}
            onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
            className={inputCls}
            disabled={loading}
          />
        </div>

        {/* End time */}
        <div className="md:col-span-2">
          <Label text="Horário de Término *" />
          <input
            type="time"
            value={formData.end_time}
            onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
            className={inputCls}
            disabled={loading}
          />
        </div>

        {/* ── Location ── */}
        <div className="md:col-span-2">
          <Label text="Local *" />
          <select
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            className={inputCls}
            disabled={loading}
          >
            <option value="">Selecione um local</option>
            {Object.keys(ROOM_CONFIG).map((room) => (
              <option key={room} value={room}>
                {room}
              </option>
            ))}
          </select>
        </div>

        {/* Room info card */}
        {roomConfig && (
          <div className="md:col-span-2 bg-blue-50 border border-blue-200 rounded-lg p-4 flex flex-wrap gap-6">
            <RoomBadge
              icon={<Info size={16} className="text-blue-600" />}
              label="Capacidade máxima"
              value={`${roomConfig.capacity} pessoas`}
            />
            <RoomBadge
              icon={
                <Utensils
                  size={16}
                  className={roomConfig.hasService ? "text-green-600" : "text-gray-400"}
                />
              }
              label="Serviço"
              value={roomConfig.hasService ? "Disponível" : "Não disponível"}
              positive={roomConfig.hasService}
            />
            <RoomBadge
              icon={
                <Coffee
                  size={16}
                  className={roomConfig.hasCoffee ? "text-green-600" : "text-gray-400"}
                />
              }
              label="Copa"
              value={roomConfig.hasCoffee ? "Disponível" : "Não disponível"}
              positive={roomConfig.hasCoffee}
            />
          </div>
        )}

        {/* ── Equipment checkboxes ── */}
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
                  disabled={loading}
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
              setFormData({ ...formData, other_equipment: e.target.value })
            }
            className={inputCls}
            placeholder="Descreva outros equipamentos necessários..."
            disabled={loading}
          />
        </div>

        {/* ── Participants ── */}
        <div className="md:col-span-2">
          <Label text="Quantidade de Participantes *" />
          <input
            type="number"
            min="1"
            max={maxCapacity ?? undefined}
            value={formData.participants_count}
            onChange={(e) =>
              setFormData({
                ...formData,
                participants_count: parseInt(e.target.value) || 0,
              })
            }
            className={`${inputCls} ${
              capacityWarning ? "border-red-400 focus:border-red-500" : ""
            }`}
            placeholder="Ex: 10"
            disabled={loading}
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

        {/* Responsible */}
        <div>
          <Label text="Responsável *" />
          <input
            type="text"
            value={formData.responsible}
            onChange={(e) =>
              setFormData({ ...formData, responsible: e.target.value })
            }
            className={inputCls}
            placeholder="Ex: João Silva"
            disabled={loading}
          />
        </div>

        {/* Department */}
        <div>
          <Label text="Departamento do Responsável *" />
          <input
            type="text"
            value={formData.responsible_department}
            onChange={(e) =>
              setFormData({ ...formData, responsible_department: e.target.value })
            }
            className={inputCls}
            placeholder="Ex: Recursos Humanos"
            disabled={loading}
          />
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <Label text="Descrição/Pauta" />
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            rows={4}
            className={`${inputCls} resize-none`}
            placeholder="Descreva a pauta e objetivos da reunião..."
            disabled={loading}
          />
        </div>
      </div>

      {/* ── Actions ── */}
      <div className="flex gap-4 pt-4">
        <button
          onClick={onSubmit}
          disabled={loading || !!capacityWarning}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg shadow-md flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
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
  );
}