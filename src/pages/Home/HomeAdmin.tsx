import { useState, useEffect } from "react";
import { HeaderAdmin } from "../../components/Header/HeaderAdmin";
import { MeetingStats } from "../../components/Admin/MeetingStats";
import { MeetingForm } from "../../components/Admin/MeetingForm";
import { MeetingList } from "../../components/Admin/MeetingList";
import { PendingMeetingsList } from "../../components/Admin/Pending/PendingMeetingsList";
import { Plus } from "lucide-react";

import {
  getAllMeetings,
  createMeeting,
  updateMeeting,
  deleteMeeting,
} from "../../services/meetingService";
import { getAllMeetingsPendings } from "../../services/meetingService";

// Tipo da reunião vinda do backend (alguns campos podem ser opcionais)
export interface Meeting {
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

// Tipo do formulário - alinhado com Meeting sem o id
export type MeetingFormData = Omit<Meeting, "id">;

const initialFormData: MeetingFormData = {
  title: "",
  meeting_date: "",
  start_time: "",
  end_time: "",
  location: "",
  participants_count: 0,
  description: "",
  responsible: "",
  responsible_department: "",
};

export function HomeADMIN() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [editMode, setEditMode] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);

  const [expanded, setExpanded] = useState<Set<number>>(new Set());

  const [formData, setFormData] = useState<MeetingFormData>(initialFormData);

  // ---- FUNÇÃO DE CARREGAMENTO ----
  const loadMeetings = async () => {
    try {
      const data = await getAllMeetings();
      setMeetings(data);
    } catch (error) {
      console.error("Erro ao carregar reuniões:", error);
    } finally {
      setLoading(false);
    }
  };
    const loadMeetingsPendings = async () => {
    try {
      const data = await getAllMeetingsPendings();
      setMeetings(data);
    } catch (error) {
      console.error("Erro ao carregar reuniões:", error);
    } finally {
      setLoading(false);
    }
  };

    useEffect(() => {
    loadMeetingsPendings();
  }, []);

  // ---- CARREGAR AO INICIAR ----
  useEffect(() => {
    loadMeetings();
  }, []);

  // ---- RESETAR FORMULÁRIO ----
  const resetForm = () => {
    setFormData(initialFormData);
    setEditMode(false);
    setSelectedMeeting(null);
    setShowForm(false);
  };

  // ---- SUBMETER FORMULÁRIO ----
  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      if (editMode && selectedMeeting) {
        await updateMeeting(selectedMeeting.id, formData);
      } else {
        await createMeeting(formData);
      }
      await loadMeetings();
      resetForm();
    } catch (error) {
      console.error("Erro ao salvar reunião:", error);
      alert("Erro ao salvar reunião. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  // ---- ABRIR FORMULÁRIO PARA NOVA REUNIÃO ----
  const handleNewMeeting = () => {
    resetForm();
    setShowForm(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando reuniões...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      <HeaderAdmin />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <MeetingStats meetings={meetings} />

        {/* BOTÃO NOVA REUNIÃO */}
        {!showForm && (
          <div className="mb-6">
            <button
              onClick={handleNewMeeting}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              Nova Reunião
            </button>
          </div>
        )}

        {/* FORMULÁRIO */}
        {showForm && (
          <MeetingForm
            formData={formData}
            setFormData={setFormData}
            editMode={editMode}
            submitting={submitting}
            onSubmit={handleSubmit}
            onCancel={resetForm}
          />
        )}

        {/* LISTA */}
        <MeetingList
          meetings={meetings}
          expanded={expanded}
          onToggle={(id) => {
            setExpanded((prev) => {
              const newSet = new Set(prev);
              if (newSet.has(id)) {
                newSet.delete(id);
              } else {
                newSet.add(id);
              }
              return newSet;
            });
          }}
          onEdit={(m) => {
            setEditMode(true);
            setSelectedMeeting(m);

            setFormData({
              title: m.title,
              meeting_date: m.meeting_date,
              start_time: m.start_time,
              end_time: m.end_time,
              location: m.location,
              participants_count: m.participants_count,
              description: m.description,
              responsible: m.responsible,
              responsible_department: m.responsible_department,
            });

            setShowForm(true);
          }}
          onDelete={async (id) => {
            if (window.confirm("Tem certeza que deseja excluir esta reunião?")) {
              try {
                await deleteMeeting(id);
                await loadMeetings();
              } catch (error) {
                console.error("Erro ao excluir reunião:", error);
                alert("Erro ao excluir reunião. Tente novamente.");
              }
            }
          }}
        />

        
        
         <PendingMeetingsList
          meetings={meetings}
          expanded={expanded}
          onToggle={(id) => {
            setExpanded((prev) => {
              const newSet = new Set(prev);
              if (newSet.has(id)) {
                newSet.delete(id);
              } else {
                newSet.add(id);
              }
              return newSet;
            });
          }}
          onEdit={(m) => {
            setEditMode(true);
            setSelectedMeeting(m);

            setFormData({
              title: m.title,
              meeting_date: m.meeting_date,
              start_time: m.start_time,
              end_time: m.end_time,
              location: m.location,
              participants_count: m.participants_count,
              description: m.description,
              responsible: m.responsible,
              responsible_department: m.responsible_department,
            });

            setShowForm(true);
          }}
          onDelete={async (id) => {
            if (window.confirm("Tem certeza que deseja excluir esta reunião?")) {
              try {
                await deleteMeeting(id);
                await loadMeetings();
              } catch (error) {
                console.error("Erro ao excluir reunião:", error);
                alert("Erro ao excluir reunião. Tente novamente.");
              }
            }
          }}
        />
      </div>
    </div>
  );
}