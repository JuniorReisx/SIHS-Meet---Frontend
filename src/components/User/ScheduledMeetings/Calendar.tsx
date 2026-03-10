import { useEffect, useState, useMemo } from "react";
import {
  Clock,
  Users,
  MapPin,
  AlertCircle,
  Loader2,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  X,
  Plus,
  TriangleAlert,
} from "lucide-react";
import { getAllMeetings } from "../../../services/meetingService";
import type { Meeting } from "../../../types/types";

// ─── Types ────────────────────────────────────────────────────────────────────

type ViewMode = "day" | "week" | "month";

// ─── Constantes ───────────────────────────────────────────────────────────────

const DIAS_SEMANA_FULL = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const MESES = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toLocalDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function startOfWeek(d: Date) {
  const clone = new Date(d);
  clone.setDate(d.getDate() - d.getDay());
  return clone;
}

function addDays(d: Date, n: number) {
  const clone = new Date(d);
  clone.setDate(d.getDate() + n);
  return clone;
}

function meetingsForDay(meetings: Meeting[], day: Date) {
  return meetings.filter((m) => isSameDay(toLocalDate(m.meeting_date), day));
}

function formatHour(time: string) {
  return time.slice(0, 5);
}

/** Retorna true se o dia for anterior a hoje (hoje não conta como passado) */
function isPastDay(date: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d < today;
}

function toDateInputValue(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/**
 * Verifica se dois intervalos de tempo se sobrepõem.
 * Retorna true se houver conflito.
 */
function hasTimeConflict(
  startA: string,
  endA: string | undefined,
  startB: string,
  endB: string | undefined,
): boolean {
  const toMinutes = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  };

  const sA = toMinutes(startA);
  const eA = endA ? toMinutes(endA) : sA + 60; // assume 1h se sem fim
  const sB = toMinutes(startB);
  const eB = endB ? toMinutes(endB) : sB + 60;

  return sA < eB && sB < eA;
}

// ─── New Meeting Modal ────────────────────────────────────────────────────────

interface NewMeetingForm {
  start_time: string;
  end_time: string;
}

function NewMeetingPrompt({
  date,
  existingMeetings,
  onConfirm,
  onClose,
}: {
  date: Date;
  existingMeetings: Meeting[];
  onConfirm: (date: Date, times: NewMeetingForm) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState<NewMeetingForm>({
    start_time: "09:00",
    end_time: "10:00",
  });
  const [touched, setTouched] = useState(false);

  const diaSemana = DIAS_SEMANA_FULL[date.getDay()];
  const dataFormatada = `${String(date.getDate()).padStart(2, "0")}/${String(
    date.getMonth() + 1,
  ).padStart(2, "0")}/${date.getFullYear()}`;

  /** Reuniões do dia que conflitam com o horário escolhido */
  const conflicts = useMemo(() => {
    if (!touched) return [];
    return existingMeetings.filter((m) =>
      hasTimeConflict(form.start_time, form.end_time, m.start_time, m.end_time),
    );
  }, [form, existingMeetings, touched]);

  const hasConflict = conflicts.length > 0;

  const handleChange = (field: keyof NewMeetingForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setTouched(true);
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
        style={{ animation: "slideUp 0.2s ease-out" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-blue-200 text-sm font-medium mb-1">
                Nova reunião
              </p>
              <h3 className="text-xl font-bold">
                {diaSemana}, {dataFormatada}
              </h3>
              {existingMeetings.length > 0 && (
                <p className="text-blue-200 text-xs mt-1">
                  {existingMeetings.length} reunião
                  {existingMeetings.length !== 1 ? "ões" : ""} já agendada
                  {existingMeetings.length !== 1 ? "s" : ""} neste dia
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="bg-white/20 hover:bg-white/30 rounded-lg p-2 transition-colors flex-shrink-0"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Body */}
{/* Body */}
        <div className="p-4 sm:p-6 space-y-4">

          {/* Horário — 2 colunas sempre, mas com min-w-0 para não vazar */}
          <div className="grid grid-cols-2 gap-3">
            <div className="min-w-0">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                Início
              </label>
              <input
                type="time"
                value={form.start_time}
                onChange={(e) => handleChange("start_time", e.target.value)}
                className="w-full min-w-0 border border-gray-200 rounded-lg px-3 py-2.5 text-sm font-medium focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>
            <div className="min-w-0">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                Término
              </label>
              <input
                type="time"
                value={form.end_time}
                onChange={(e) => handleChange("end_time", e.target.value)}
                className="w-full min-w-0 border border-gray-200 rounded-lg px-3 py-2.5 text-sm font-medium focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>
          </div>

          {/* Reuniões existentes no dia */}
          {existingMeetings.length > 0 && (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 space-y-2">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                Reuniões neste dia
              </p>
              {existingMeetings.map((m) => {
                const isConflicting = conflicts.some((c) => c.id === m.id);
                return (
                  <div
                    key={m.id}
                    className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                      isConflicting
                        ? "bg-red-50 border border-red-200"
                        : "bg-white border border-gray-200"
                    }`}
                  >
                    <Clock
                      size={13}
                      className={`flex-shrink-0 ${isConflicting ? "text-red-500" : "text-gray-400"}`}
                    />
                    <span
                      className={`font-medium whitespace-nowrap flex-shrink-0 ${isConflicting ? "text-red-700" : "text-gray-700"}`}
                    >
                      {formatHour(m.start_time)}
                      {m.end_time && ` – ${formatHour(m.end_time)}`}
                    </span>
                    <span
                      className={`truncate min-w-0 ${isConflicting ? "text-red-600" : "text-gray-500"}`}
                    >
                      · {m.title}
                    </span>
                    {isConflicting && (
                      <TriangleAlert
                        size={13}
                        className="text-red-500 flex-shrink-0 ml-auto"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Alerta de conflito */}
          {hasConflict && touched && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-3">
              <TriangleAlert
                size={16}
                className="text-amber-500 flex-shrink-0 mt-0.5"
              />
              <div className="min-w-0">
                <p className="text-amber-800 font-semibold text-sm">
                  Conflito de horário
                </p>
                <p className="text-amber-700 text-xs mt-0.5 leading-relaxed">
                  O horário escolhido conflita com {conflicts.length} reunião
                  {conflicts.length !== 1 ? "ões" : ""} existente
                  {conflicts.length !== 1 ? "s" : ""}. Você ainda pode
                  continuar, mas verifique a disponibilidade.
                </p>
              </div>
            </div>
          )}

          {/* Ações */}
          <div className="flex gap-3 pt-1">
            <button
              onClick={onClose}
              className="flex-1 min-w-0 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl transition-colors text-sm"
            >
              Cancelar
            </button>
            <button
              onClick={() => onConfirm(date, form)}
              className={`flex-1 min-w-0 font-semibold py-3 rounded-xl transition-all shadow-sm text-white flex items-center justify-center gap-2 text-sm ${
                hasConflict
                  ? "bg-amber-500 hover:bg-amber-600"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              <Plus size={16} className="flex-shrink-0" />
              <span className="truncate">
                {hasConflict ? "Agendar mesmo assim" : "Agendar"}
              </span>
            </button>
          </div>

        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

// ─── Meeting Pill ─────────────────────────────────────────────────────────────

function MeetingPill({
  meeting,
  onClick,
  compact = false,
}: {
  meeting: Meeting;
  onClick: (m: Meeting) => void;
  compact?: boolean;
}) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick(meeting);
      }}
      className={`w-full text-left bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-150 shadow-sm hover:shadow-md ${
        compact ? "px-2 py-1" : "px-3 py-2"
      }`}
    >
      <p
        className={`font-semibold truncate ${compact ? "text-xs" : "text-sm"}`}
      >
        {meeting.title}
      </p>
      {!compact && (
        <p className="text-blue-200 text-xs mt-0.5 flex items-center gap-1">
          <Clock size={10} />
          {formatHour(meeting.start_time)}
          {meeting.end_time && ` – ${formatHour(meeting.end_time)}`}
        </p>
      )}
    </button>
  );
}

// ─── Detail Modal ─────────────────────────────────────────────────────────────

function MeetingModal({
  meeting,
  onClose,
}: {
  meeting: Meeting;
  onClose: () => void;
}) {
  const date = toLocalDate(meeting.meeting_date);
  const diaSemana = DIAS_SEMANA_FULL[date.getDay()];
  const dataFormatada = `${String(date.getDate()).padStart(2, "0")}/${String(
    date.getMonth() + 1,
  ).padStart(2, "0")}/${date.getFullYear()}`;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: "slideUp 0.2s ease-out" }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-blue-200 text-sm font-medium mb-1">
                {diaSemana}, {dataFormatada}
              </p>
              <h3 className="text-xl font-bold leading-tight">
                {meeting.title}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="bg-white/20 hover:bg-white/30 rounded-lg p-2 transition-colors flex-shrink-0"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <InfoCard
              icon={<Clock size={16} className="text-indigo-600" />}
              label="Horário"
              value={`${formatHour(meeting.start_time)}${
                meeting.end_time ? ` – ${formatHour(meeting.end_time)}` : ""
              }`}
              bg="bg-indigo-50"
            />
            <InfoCard
              icon={<Users size={16} className="text-green-600" />}
              label="Participantes"
              value={`${meeting.participants_count} pessoa${meeting.participants_count !== 1 ? "s" : ""}`}
              bg="bg-green-50"
            />
          </div>

          <InfoCard
            icon={<MapPin size={16} className="text-purple-600" />}
            label="Local"
            value={meeting.location}
            bg="bg-purple-50"
            full
          />

          {meeting.responsible && (
            <InfoCard
              icon={
                <span className="text-orange-600 text-xs font-bold">👤</span>
              }
              label="Responsável"
              value={`${meeting.responsible}${
                meeting.responsible_department
                  ? ` · ${meeting.responsible_department}`
                  : ""
              }`}
              bg="bg-orange-50"
              full
            />
          )}
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

function InfoCard({
  icon,
  label,
  value,
  bg,
  full,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  bg: string;
  full?: boolean;
}) {
  return (
    <div className={`${bg} rounded-xl p-3 ${full ? "col-span-2" : ""}`}>
      <div className="flex items-center gap-1.5 mb-1">
        {icon}
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">
          {label}
        </p>
      </div>
      <p className="font-semibold text-gray-800 text-sm">{value}</p>
    </div>
  );
}

// ─── Day View ─────────────────────────────────────────────────────────────────

function DayView({
  currentDate,
  meetings,
  onMeetingClick,
  onDayClick,
}: {
  currentDate: Date;
  meetings: Meeting[];
  onMeetingClick: (m: Meeting) => void;
  onDayClick: (day: Date) => void;
}) {
  const dayMeetings = meetingsForDay(meetings, currentDate);
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const isToday = isSameDay(currentDate, new Date());
  const past = isPastDay(currentDate);

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
      {/* Day header — clicável para nova reunião apenas em dias futuros/hoje */}
      <button
        onClick={() => !past && onDayClick(currentDate)}
        disabled={past}
        className={`w-full text-left p-4 border-b border-gray-100 transition-colors group ${
          past
            ? "bg-gray-100 cursor-not-allowed"
            : isToday
              ? "bg-blue-50 hover:bg-blue-100"
              : "bg-gray-50 hover:bg-gray-100"
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <p
              className={`text-sm font-medium ${past ? "text-gray-400" : "text-gray-500"}`}
            >
              {DIAS_SEMANA_FULL[currentDate.getDay()]}
            </p>
            <p
              className={`text-3xl font-bold ${past ? "text-gray-400" : isToday ? "text-blue-600" : "text-gray-800"}`}
            >
              {String(currentDate.getDate()).padStart(2, "0")}
            </p>
            <p
              className={`text-sm ${past ? "text-gray-400" : "text-gray-500"}`}
            >
              {MESES[currentDate.getMonth()]} {currentDate.getFullYear()}
            </p>
            <p
              className={`text-xs mt-1 ${past ? "text-gray-400" : "text-gray-400"}`}
            >
              {past
                ? "Dia já encerrado"
                : `${dayMeetings.length} reunião${dayMeetings.length !== 1 ? "ões" : ""}`}
            </p>
          </div>
          {!past && (
            <div className="flex items-center gap-1.5 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity pr-2">
              <Plus size={16} />
              <span className="text-xs font-semibold">Nova reunião</span>
            </div>
          )}
        </div>
      </button>

      {/* Hour grid */}
      <div className="overflow-y-auto max-h-[600px]">
        {hours.map((hour) => {
          const slotMeetings = dayMeetings.filter(
            (m) => parseInt(m.start_time.split(":")[0]) === hour,
          );
          return (
            <div
              key={hour}
              className={`flex border-b border-gray-50 min-h-[60px] ${past ? "bg-gray-50" : ""}`}
            >
              <div
                className={`w-16 flex-shrink-0 px-3 py-2 text-xs font-mono border-r border-gray-100 ${past ? "text-gray-300" : "text-gray-400"}`}
              >
                {`${String(hour).padStart(2, "0")}:00`}
              </div>
              <div
                className={`flex-1 px-3 py-2 space-y-1 ${past ? "opacity-40" : ""}`}
              >
                {slotMeetings.map((m) => (
                  <MeetingPill
                    key={m.id}
                    meeting={m}
                    onClick={onMeetingClick}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Week View ────────────────────────────────────────────────────────────────

function WeekView({
  currentDate,
  meetings,
  onMeetingClick,
  onDayClick,
}: {
  currentDate: Date;
  meetings: Meeting[];
  onMeetingClick: (m: Meeting) => void;
  onDayClick: (day: Date) => void;
}) {
  const weekStart = startOfWeek(currentDate);
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const today = new Date();
  const hours = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
      {/* Week header — cada dia é clicável */}
      <div className="grid grid-cols-8 border-b border-gray-200 bg-gray-50">
        <div className="p-3 border-r border-gray-200" />
        {days.map((day) => {
          const isToday = isSameDay(day, today);
          const past = isPastDay(day);
          return (
            <button
              key={day.toISOString()}
              onClick={() => !past && onDayClick(day)}
              disabled={past}
              className={`p-3 text-center border-r border-gray-200 last:border-r-0 transition-colors group ${
                past
                  ? "bg-gray-100 cursor-not-allowed"
                  : isToday
                    ? "bg-blue-50 hover:bg-blue-100"
                    : "hover:bg-gray-100"
              }`}
            >
              <p
                className={`text-xs font-medium ${past ? "text-gray-400" : "text-gray-500"}`}
              >
                {DIAS_SEMANA_FULL[day.getDay()]}
              </p>
              <p
                className={`text-lg font-bold ${past ? "text-gray-400" : isToday ? "text-blue-600" : "text-gray-700"}`}
              >
                {day.getDate()}
              </p>
              {!past && (
                <Plus
                  size={12}
                  className="mx-auto text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity mt-0.5"
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Hour rows */}
      <div className="overflow-y-auto max-h-[560px]">
        {hours.map((hour) => (
          <div
            key={hour}
            className="grid grid-cols-8 border-b border-gray-50 min-h-[56px]"
          >
            <div className="px-3 py-1 text-xs text-gray-400 font-mono border-r border-gray-100 flex items-start pt-2">
              {`${String(hour).padStart(2, "0")}:00`}
            </div>
            {days.map((day) => {
              const slotMeetings = meetingsForDay(meetings, day).filter(
                (m) => parseInt(m.start_time.split(":")[0]) === hour,
              );
              const past = isPastDay(day);
              return (
                <div
                  key={day.toISOString()}
                  className={`border-r border-gray-50 last:border-r-0 px-1 py-1 space-y-1 ${
                    past ? "bg-gray-50" : ""
                  }`}
                >
                  <div className={past ? "opacity-40" : ""}>
                    {slotMeetings.map((m) => (
                      <MeetingPill
                        key={m.id}
                        meeting={m}
                        onClick={onMeetingClick}
                        compact
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Month View ───────────────────────────────────────────────────────────────

function MonthView({
  currentDate,
  meetings,
  onMeetingClick,
  onDayClick,
}: {
  currentDate: Date;
  meetings: Meeting[];
  onMeetingClick: (m: Meeting) => void;
  onDayClick: (day: Date) => void;
}) {
  const today = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startPad = firstDay.getDay();
  const weeks = Math.ceil((startPad + lastDay.getDate()) / 7);

  const cells = Array.from({ length: weeks * 7 }, (_, i) => {
    const dayNum = i - startPad + 1;
    if (dayNum < 1 || dayNum > lastDay.getDate()) return null;
    return new Date(year, month, dayNum);
  });

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
      {/* Weekday headers */}
      <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50">
        {DIAS_SEMANA_FULL.map((d) => (
          <div
            key={d}
            className="py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 divide-x divide-y divide-gray-100">
        {cells.map((day, idx) => {
          if (!day)
            return <div key={`empty-${idx}`} className="h-28 bg-gray-50/50" />;

          const isToday = isSameDay(day, today);
          const past = isPastDay(day);
          const dayMeetings = meetingsForDay(meetings, day);
          const extra = dayMeetings.length > 2 ? dayMeetings.length - 2 : 0;

          return (
            <div
              key={day.toISOString()}
              onClick={() => !past && onDayClick(day)}
              className={`h-28 p-2 flex flex-col transition-colors group relative ${
                past
                  ? "bg-gray-100 cursor-not-allowed"
                  : isToday
                    ? "bg-blue-50 hover:bg-blue-100 cursor-pointer"
                    : "hover:bg-gray-50 cursor-pointer"
              }`}
            >
              {/* Day number */}
              <div className="flex items-center justify-between mb-1">
                <span
                  className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-sm font-bold ${
                    past
                      ? "text-gray-400"
                      : isToday
                        ? "bg-blue-600 text-white"
                        : "text-gray-700"
                  }`}
                >
                  {day.getDate()}
                </span>
                {/* Ícone "+" aparece no hover apenas em dias futuros */}
                {!past && (
                  <Plus
                    size={14}
                    className="text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                )}
              </div>

              {/* Meetings */}
              <div
                className={`flex-1 space-y-0.5 overflow-hidden ${past ? "opacity-40" : ""}`}
              >
                {dayMeetings.slice(0, 2).map((m) => (
                  <MeetingPill
                    key={m.id}
                    meeting={m}
                    onClick={onMeetingClick}
                    compact
                  />
                ))}
                {extra > 0 && (
                  <p className="text-xs text-gray-500 font-medium pl-1">
                    +{extra} mais
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface MeetingCalendarProps {
  /** Chamado quando o usuário confirma a criação de uma nova reunião. */
  onNewMeeting?: (date: string, startTime: string, endTime: string) => void;
}

export function MeetingCalendar({ onNewMeeting }: MeetingCalendarProps) {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("month");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);

  /** Dia selecionado para nova reunião */
  const [newMeetingDay, setNewMeetingDay] = useState<Date | null>(null);

  useEffect(() => {
    loadMeetings();
  }, []);

  const loadMeetings = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllMeetings();
      setMeetings(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao carregar reuniões",
      );
    } finally {
      setLoading(false);
    }
  };

  // ── Navegação ──────────────────────────────────────────────────────────────

  const navigate = (direction: -1 | 1) => {
    const d = new Date(currentDate);
    if (viewMode === "day") d.setDate(d.getDate() + direction);
    else if (viewMode === "week") d.setDate(d.getDate() + direction * 7);
    else d.setMonth(d.getMonth() + direction);
    setCurrentDate(d);
  };

  const goToToday = () => setCurrentDate(new Date());

  // ── Header label ───────────────────────────────────────────────────────────

  const headerLabel = useMemo(() => {
    if (viewMode === "day") {
      return `${DIAS_SEMANA_FULL[currentDate.getDay()]}, ${String(currentDate.getDate()).padStart(2, "0")} de ${MESES[currentDate.getMonth()]} de ${currentDate.getFullYear()}`;
    }
    if (viewMode === "week") {
      const ws = startOfWeek(currentDate);
      const we = addDays(ws, 6);
      if (ws.getMonth() === we.getMonth())
        return `${ws.getDate()} – ${we.getDate()} de ${MESES[ws.getMonth()]} ${ws.getFullYear()}`;
      return `${ws.getDate()} ${MESES[ws.getMonth()]} – ${we.getDate()} ${MESES[we.getMonth()]} ${ws.getFullYear()}`;
    }
    return `${MESES[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
  }, [viewMode, currentDate]);

  // ── Nova Reunião ───────────────────────────────────────────────────────────

  const handleDayClick = (day: Date) => {
    setNewMeetingDay(day);
  };

  const handleConfirmNewMeeting = (date: Date, times: NewMeetingForm) => {
    onNewMeeting?.(toDateInputValue(date), times.start_time, times.end_time);
    setNewMeetingDay(null);
  };

  // ─── Loading ───────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-16 border border-gray-100 flex flex-col items-center justify-center">
        <Loader2 size={40} className="text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600 font-medium">Carregando calendário...</p>
      </div>
    );
  }

  // ─── Error ─────────────────────────────────────────────────────────────────

  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        <div className="flex items-start gap-4 bg-red-50 border-l-4 border-red-500 p-6 rounded-r-xl">
          <AlertCircle size={28} className="text-red-500 flex-shrink-0" />
          <div>
            <p className="font-bold text-red-800 text-lg mb-1">
              Erro ao carregar
            </p>
            <p className="text-red-700 mb-4">{error}</p>
            <button
              onClick={loadMeetings}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors"
            >
              <RefreshCw size={16} /> Tentar Novamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── Main Render ───────────────────────────────────────────────────────────

  return (
    <div className="space-y-4">
      {/* ── Top Bar ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-800">
            Calendário de Reuniões
          </h2>
          <p className="text-gray-500 text-sm mt-0.5">
            {meetings.length} reunião{meetings.length !== 1 ? "ões" : ""}{" "}
            cadastrada{meetings.length !== 1 ? "s" : ""}
            {" · "}
            <span className="text-blue-500 font-medium">
              Clique em um dia para agendar
            </span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadMeetings}
            className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-500 transition-colors"
            title="Atualizar"
          >
            <RefreshCw size={18} />
          </button>

          <div className="flex bg-gray-100 rounded-xl p-1 gap-1">
            {(["day", "week", "month"] as ViewMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  viewMode === mode
                    ? "bg-white text-blue-700 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {mode === "day" ? "Dia" : mode === "week" ? "Semana" : "Mês"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Navigation Bar ── */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl border border-gray-200 hover:bg-gray-100 text-gray-600 transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={goToToday}
          className="px-4 py-2 rounded-xl border border-gray-200 hover:bg-gray-100 text-sm font-semibold text-gray-600 transition-colors"
        >
          Hoje
        </button>
        <button
          onClick={() => navigate(1)}
          className="p-2 rounded-xl border border-gray-200 hover:bg-gray-100 text-gray-600 transition-colors"
        >
          <ChevronRight size={20} />
        </button>
        <span className="text-gray-800 font-bold text-lg ml-1">
          {headerLabel}
        </span>
      </div>

      {/* ── Calendar View ── */}
      {viewMode === "day" && (
        <DayView
          currentDate={currentDate}
          meetings={meetings}
          onMeetingClick={setSelectedMeeting}
          onDayClick={handleDayClick}
        />
      )}
      {viewMode === "week" && (
        <WeekView
          currentDate={currentDate}
          meetings={meetings}
          onMeetingClick={setSelectedMeeting}
          onDayClick={handleDayClick}
        />
      )}
      {viewMode === "month" && (
        <MonthView
          currentDate={currentDate}
          meetings={meetings}
          onMeetingClick={setSelectedMeeting}
          onDayClick={handleDayClick}
        />
      )}

      {/* ── Modal: detalhes da reunião ── */}
      {selectedMeeting && (
        <MeetingModal
          meeting={selectedMeeting}
          onClose={() => setSelectedMeeting(null)}
        />
      )}

      {/* ── Modal: nova reunião ── */}
      {newMeetingDay && (
        <NewMeetingPrompt
          date={newMeetingDay}
          existingMeetings={meetingsForDay(meetings, newMeetingDay)}
          onConfirm={handleConfirmNewMeeting}
          onClose={() => setNewMeetingDay(null)}
        />
      )}
    </div>
  );
}
