import { useState } from "react";
import { Plus } from "lucide-react";
import { ScheduledMeetings } from "../../components/User/ScheduledMeetings/ScheduledMeetings";
import { MeetingForm } from "../../components/MeetingForm/MeetingForm";
import { HeaderUser } from "../../components/User/Header/HeaderUser";
import { FooterUser } from "../../components/User/Footer/FooterUser";
import type { Meeting } from "../../types/types";

export function HomeUser() {
  const [reunioes, setReunioes] = useState<Meeting[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState<Meeting | null>(null);
  
  const [formData, setFormData] = useState<Omit<Meeting, "id">>({
    title: "",
    meeting_date: "",
    start_time: "",
    end_time: "",
    location: "",
    participants_count: 0,
    description: "",
    responsible: "",
    responsible_department: "",
  });

  const loadMeetings = async () => {
    // Se você tiver uma API, carregue os dados aqui
    // Por enquanto, mantém o estado atual
    setReunioes([...reunioes]);
  };

  const handleSuccess = async () => {
    // Recarregar lista de reuniões
    await loadMeetings();
    
    // Resetar formulário
    setFormData({
      title: "",
      meeting_date: "",
      start_time: "",
      end_time: "",
      location: "",
      participants_count: 0,
      description: "",
      responsible: "",
      responsible_department: "",
    });
    
    setShowForm(false);
    setEditingMeeting(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <HeaderUser />
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Botão Adicionar */}
        {!showForm && (
          <div className="mb-8">
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md flex items-center gap-2 transition-colors"
            >
              <Plus size={20} />
              Nova Reunião
            </button>
          </div>
        )}

        {/* Formulário */}
        {showForm && (
          <MeetingForm
            formData={formData}
            modoEdicao={!!editingMeeting}
            meetingId={editingMeeting?.id}
            onFormChange={setFormData}
            onSuccess={handleSuccess}
            onCancel={() => {
              setShowForm(false);
              setEditingMeeting(null);
            }}
          />
        )}

        {/* Lista de Reuniões */}
        <ScheduledMeetings />
      </div>
      <FooterUser />
    </div>
  );
}