import { useState } from "react";
import { MeetingForm } from "../../components/User/MeetingForm/MeetingForm";
import { HeaderUser } from "../../components/User/Header/HeaderUser";
import { FooterUser } from "../../components/User/Footer/FooterUser";
import type { Meeting } from "../../types/types";
import { MeetingCalendar } from "../../components/User/ScheduledMeetings/Calendar";

// ─── Types ────────────────────────────────────────────────────────────────────

type MeetingFormData = Omit<Meeting, "id">;

const EMPTY_FORM: MeetingFormData = {
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

// ─── Component ────────────────────────────────────────────────────────────────

export function HomeUser() {
  const [showForm, setShowForm] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState<Meeting | null>(null);
  const [formData, setFormData] = useState<MeetingFormData>(EMPTY_FORM);

  // ── Handlers ────────────────────────────────────────────────────────────────

  /**
   * Chamado pelo calendário quando o usuário clica num dia e confirma nova reunião.
   * Pré-preenche a data e horários no formulário e o abre.
   */
  const handleNewMeetingFromCalendar = (
    date: string,
    startTime: string,
    endTime: string
  ) => {
    setFormData({ ...EMPTY_FORM, meeting_date: date, start_time: startTime, end_time: endTime });
    setEditingMeeting(null);
    setShowForm(true);
  };

  const handleSuccess = () => {
    setFormData(EMPTY_FORM);
    setShowForm(false);
    setEditingMeeting(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingMeeting(null);
  };

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <HeaderUser />

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">

        {/* Formulário — exibido quando o usuário escolhe agendar pelo calendário */}
        {showForm && (
          <MeetingForm
            formData={formData}
            modoEdicao={!!editingMeeting}
            meetingId={editingMeeting?.id}
            onFormChange={setFormData}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        )}

        {/* Calendário */}
        <MeetingCalendar onNewMeeting={handleNewMeetingFromCalendar} />
      </div>

      <FooterUser />
    </div>
  );
}