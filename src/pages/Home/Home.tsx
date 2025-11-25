import { useState } from "react";
import { Plus } from "lucide-react";
import { ScheduledMeetings } from "../../components/ScheduledMeetings/ScheduledMeetings";
import { MeetingForm } from "../../components/MeetingForm/MeetingForm";
import { HeaderUser } from "../../components/Header/HeaderUser";
import { FooterUser } from "../../components/Footer/FooterUser";
import { database } from "../../data/data";
import type { Meeting } from "../../types/types";

export function Home() {
  const [reunioes, setReunioes] = useState<Meeting[]>(database);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [reuniaoSelecionada, setReuniaoSelecionada] = useState<Meeting | null>(
    null
  );
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const [formData, setFormData] = useState<Omit<Meeting, "id">>({
    title: "",
    date: "",
    time: "",
    location: "",
    participants: "",
    description: "",
  });

  const resetForm = () => {
    setFormData({
      title: "",
      date: "",
      time: "",
      location: "",
      participants: "",
      description: "",
    });
    setModoEdicao(false);
    setReuniaoSelecionada(null);
    setMostrarFormulario(false);
  };

  const handleSubmit = () => {
    if (
      !formData.title ||
      !formData.date ||
      !formData.time ||
      !formData.location ||
      !formData.participants
    ) {
      alert("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    if (modoEdicao && reuniaoSelecionada) {
      setReunioes(
        reunioes.map((r) =>
          r.id === reuniaoSelecionada.id
            ? { ...formData, id: reuniaoSelecionada.id }
            : r
        )
      );
    } else {
      const novaReuniao: Meeting = {
        ...formData,
        id: Math.max(0, ...reunioes.map((r) => r.id)) + 1,
      };
      setReunioes([...reunioes, novaReuniao]);
    }

    resetForm();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <HeaderUser />
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Botão Adicionar */}
        {!mostrarFormulario && (
          <div className="mb-8">
            <button
              onClick={() => setMostrarFormulario(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md flex items-center gap-2 transition-colors"
            >
              <Plus size={20} />
              Nova Reunião
            </button>
          </div>
        )}

        {/* Formulário */}
        {mostrarFormulario && (
          <MeetingForm
            formData={formData}
            modoEdicao={modoEdicao}
            onFormChange={setFormData}
            onSubmit={handleSubmit}
            onCancel={resetForm}
          />
        )}

        {/* Lista de Reuniões */}
        <ScheduledMeetings reunioes={reunioes} />
      </div>
      <FooterUser />
    </div>
  );
}