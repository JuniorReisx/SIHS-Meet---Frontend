import { useState } from "react";
import { Plus } from "lucide-react";
import { ScheduledMeetings } from "../../components/ScheduledMeetings/ScheduledMeetings";
import { MeetingForm } from "../../components/MeetingForm/MeetingForm";
import { HeaderUser } from "../../components/Header/HeaderUser";
import { FooterUser } from "../../components/Footer/FooterUser";

interface Reuniao {
  id: number;
  titulo: string;
  data: string;
  horario: string;
  local: string;
  participantes: string;
  descricao: string;
}

export function Home() {
  const [reunioes, setReunioes] = useState<Reuniao[]>([
    {
      id: 1,
      titulo: "Planejamento de Obras - Estação de Tratamento",
      data: "2025-11-25",
      horario: "09:00",
      local: "Sala de Reuniões - SIHS",
      participantes: "Equipe de Engenharia, Diretoria",
      descricao: "Discussão sobre cronograma e orçamento da nova estação",
    },
    {
      id: 2,
      titulo: "Revisão de Contratos - Fornecedores",
      data: "2025-11-28",
      horario: "14:00",
      local: "Auditório Administrativo",
      participantes: "Setor Jurídico, Compras",
      descricao: "Análise das renovações e novos contratos de fornecedores",
    },
    {
      id: 3,
      titulo: "Reunião de Alinhamento - Projetos Internos",
      data: "2025-12-02",
      horario: "10:30",
      local: "Sala 03 - SIHS",
      participantes: "Gestores de Setor",
      descricao: "Planejamento trimestral das atividades internas",
    },
    {
      id: 4,
      titulo: "Apresentação de Resultados - TI",
      data: "2025-12-05",
      horario: "16:00",
      local: "Sala de Conferências",
      participantes: "Equipe de TI, Diretoria",
      descricao: "Demonstração dos indicadores e melhorias do setor de TI",
    },
    {
      id: 5,
      titulo: "Reunião Extraordinária - Manutenção",
      data: "2025-12-10",
      horario: "08:00",
      local: "Oficina de Manutenção",
      participantes: "Equipe de Manutenção",
      descricao: "Discussão urgente sobre falha em equipamento crítico",
    },
  ]);

  const [modoEdicao, setModoEdicao] = useState(false);
  const [reuniaoSelecionada, setReuniaoSelecionada] = useState<Reuniao | null>(
    null
  );
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const [formData, setFormData] = useState<Omit<Reuniao, "id">>({
    titulo: "",
    data: "",
    horario: "",
    local: "",
    participantes: "",
    descricao: "",
  });

  const resetForm = () => {
    setFormData({
      titulo: "",
      data: "",
      horario: "",
      local: "",
      participantes: "",
      descricao: "",
    });
    setModoEdicao(false);
    setReuniaoSelecionada(null);
    setMostrarFormulario(false);
  };

  const handleSubmit = () => {
    if (
      !formData.titulo ||
      !formData.data ||
      !formData.horario ||
      !formData.local ||
      !formData.participantes
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
      const novaReuniao: Reuniao = {
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
