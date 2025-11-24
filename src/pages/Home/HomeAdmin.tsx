import { useState } from "react";
import { Calendar, Clock, MapPin, Users, FileText, Edit, Trash2, Plus, X, Shield, ChevronDown, ChevronUp } from "lucide-react";
import { HeaderAdmin } from "../../components/Header/HeaderAdmin";

interface Reuniao {
  id: number;
  titulo: string;
  data: string;
  horario: string;
  local: string;
  participantes: string;
  descricao: string;
  criadoPor?: string;
  setor?: string;
}

export function HomeADMIN() {
  const [reunioes, setReunioes] = useState<Reuniao[]>([
    {
      id: 1,
      titulo: "Planejamento de Obras - Estação de Tratamento",
      data: "2025-11-25",
      horario: "09:00",
      local: "Sala de Reuniões - SIHS",
      participantes: "Equipe de Engenharia, Diretoria",
      descricao: "Discussão sobre cronograma e orçamento da nova estação",
      criadoPor: "João Silva",
      setor: "Engenharia"
    },
    {
      id: 2,
      titulo: "Revisão de Contratos - Fornecedores",
      data: "2025-11-28",
      horario: "14:00",
      local: "Auditório Administrativo",
      participantes: "Setor Jurídico, Compras",
      descricao: "Análise das renovações e novos contratos de fornecedores",
      criadoPor: "Maria Santos",
      setor: "Jurídico"
    },
    {
      id: 3,
      titulo: "Reunião de Alinhamento - Projetos Internos",
      data: "2025-12-02",
      horario: "10:30",
      local: "Sala 03 - SIHS",
      participantes: "Gestores de Setor",
      descricao: "Planejamento trimestral das atividades internas",
      criadoPor: "Carlos Oliveira",
      setor: "Gestão"
    },
    {
      id: 4,
      titulo: "Apresentação de Resultados - TI",
      data: "2025-12-05",
      horario: "16:00",
      local: "Sala de Conferências",
      participantes: "Equipe de TI, Diretoria",
      descricao: "Demonstração dos indicadores e melhorias do setor de TI",
      criadoPor: "Ana Costa",
      setor: "TI"
    },
    {
      id: 5,
      titulo: "Reunião Extraordinária - Manutenção",
      data: "2025-12-10",
      horario: "08:00",
      local: "Oficina de Manutenção",
      participantes: "Equipe de Manutenção",
      descricao: "Discussão urgente sobre falha em equipamento crítico",
      criadoPor: "Pedro Ferreira",
      setor: "Manutenção"
    },
  ]);

  const [modoEdicao, setModoEdicao] = useState(false);
  const [reuniaoSelecionada, setReuniaoSelecionada] = useState<Reuniao | null>(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [reunioesExpandidas, setReunioesExpandidas] = useState<Set<number>>(new Set());

  const [formData, setFormData] = useState<Omit<Reuniao, "id">>({
    titulo: "",
    data: "",
    horario: "",
    local: "",
    participantes: "",
    descricao: "",
    criadoPor: "Admin",
    setor: "Administração"
  });

  const resetForm = () => {
    setFormData({
      titulo: "",
      data: "",
      horario: "",
      local: "",
      participantes: "",
      descricao: "",
      criadoPor: "Admin",
      setor: "Administração"
    });
    setModoEdicao(false);
    setReuniaoSelecionada(null);
    setMostrarFormulario(false);
  };

  const handleSubmit = () => {
    if (!formData.titulo || !formData.data || !formData.horario || !formData.local || !formData.participantes) {
      alert("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    if (modoEdicao && reuniaoSelecionada) {
      setReunioes(reunioes.map((r) => r.id === reuniaoSelecionada.id ? { ...formData, id: reuniaoSelecionada.id } : r));
      alert("Reunião atualizada com sucesso!");
    } else {
      const novaReuniao: Reuniao = {
        ...formData,
        id: Math.max(0, ...reunioes.map((r) => r.id)) + 1,
      };
      setReunioes([...reunioes, novaReuniao]);
      alert("Reunião criada com sucesso!");
    }

    resetForm();
  };

  const handleEditar = (reuniao: Reuniao) => {
    setReuniaoSelecionada(reuniao);
    setFormData(reuniao);
    setModoEdicao(true);
    setMostrarFormulario(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExcluir = (id: number) => {
    if (confirm("Tem certeza que deseja excluir esta reunião?")) {
      setReunioes(reunioes.filter((r) => r.id !== id));
      alert("Reunião excluída com sucesso!");
    }
  };

  const toggleExpansao = (id: number) => {
    const novasExpandidas = new Set(reunioesExpandidas);
    if (novasExpandidas.has(id)) {
      novasExpandidas.delete(id);
    } else {
      novasExpandidas.add(id);
    }
    setReunioesExpandidas(novasExpandidas);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      {/* Header Admin */}
     <HeaderAdmin/>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold">Total de Reuniões</p>
                <p className="text-3xl font-bold text-purple-600">{reunioes.length}</p>
              </div>
              <Calendar size={48} className="text-purple-300" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold">Próximas 7 dias</p>
                <p className="text-3xl font-bold text-blue-600">
                  {reunioes.filter(r => {
                    const dataReuniao = new Date(r.data);
                    const hoje = new Date();
                    const seteDias = new Date(hoje.getTime() + 7 * 24 * 60 * 60 * 1000);
                    return dataReuniao >= hoje && dataReuniao <= seteDias;
                  }).length}
                </p>
              </div>
              <Clock size={48} className="text-blue-300" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold">Setores Ativos</p>
                <p className="text-3xl font-bold text-green-600">
                  {new Set(reunioes.map(r => r.setor)).size}
                </p>
              </div>
              <Users size={48} className="text-green-300" />
            </div>
          </div>
        </div>

        {/* Botão Nova Reunião */}
        {!mostrarFormulario && (
          <div className="mb-8">
            <button
              onClick={() => setMostrarFormulario(true)}
              className="w-full bg-gradient-to-r from-purple-800 via-purple-700 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Plus size={24} />
              Nova Reunião (Poder Admin)
            </button>
          </div>
        )}

        {/* Formulário */}
        {mostrarFormulario && (
          <div className="bg-white rounded-xl shadow-2xl p-8 mb-8 border-t-4 border-purple-600">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <Shield className="text-purple-600" size={28} />
                {modoEdicao ? "Editar Reunião" : "Nova Reunião"}
              </h2>
              <button
                onClick={resetForm}
                className="text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100"
              >
                <X size={24} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Título da Reunião *
                </label>
                <input
                  type="text"
                  value={formData.titulo}
                  onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                  placeholder="Ex: Reunião de Planejamento Estratégico"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Data *
                </label>
                <input
                  type="date"
                  value={formData.data}
                  onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Horário *
                </label>
                <input
                  type="time"
                  value={formData.horario}
                  onChange={(e) => setFormData({ ...formData, horario: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Local *
                </label>
                <input
                  type="text"
                  value={formData.local}
                  onChange={(e) => setFormData({ ...formData, local: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                  placeholder="Ex: Sala de Reuniões - SIHS"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Setor Responsável
                </label>
                <input
                  type="text"
                  value={formData.setor}
                  onChange={(e) => setFormData({ ...formData, setor: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                  placeholder="Ex: Administração"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Participantes *
                </label>
                <input
                  type="text"
                  value={formData.participantes}
                  onChange={(e) => setFormData({ ...formData, participantes: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                  placeholder="Ex: Equipe de TI, Diretoria, Gestores"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Descrição
                </label>
                <textarea
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                  rows={4}
                  placeholder="Descrição detalhada da reunião..."
                />
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={handleSubmit}
                className="flex-1 bg-gradient-to-r from-purple-800 via-purple-700 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white font-bold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all"
              >
                {modoEdicao ? "Salvar Alterações" : "Criar Reunião"}
              </button>
              <button
                onClick={resetForm}
                className="px-8 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 rounded-lg transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* Lista de Reuniões */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Calendar size={28} className="text-purple-600" />
            Todas as Reuniões
          </h2>

          {reunioes.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <Calendar size={64} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg">Nenhuma reunião agendada</p>
            </div>
          ) : (
            reunioes.map((reuniao) => (
              <div
                key={reuniao.id}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow border-l-4 border-purple-600"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">{reuniao.titulo}</h3>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Calendar size={16} className="text-purple-600" />
                          {new Date(reuniao.data + 'T00:00:00').toLocaleDateString('pt-BR')}
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock size={16} className="text-purple-600" />
                          {reuniao.horario}
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin size={16} className="text-purple-600" />
                          {reuniao.local}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditar(reuniao)}
                        className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <Edit size={20} />
                      </button>
                      <button
                        onClick={() => handleExcluir(reuniao.id)}
                        className="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition-colors"
                        title="Excluir"
                      >
                        <Trash2 size={20} />
                      </button>
                      <button
                        onClick={() => toggleExpansao(reuniao.id)}
                        className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg transition-colors"
                        title={reunioesExpandidas.has(reuniao.id) ? "Recolher" : "Expandir"}
                      >
                        {reunioesExpandidas.has(reuniao.id) ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </button>
                    </div>
                  </div>

                  {reunioesExpandidas.has(reuniao.id) && (
                    <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
                      <div className="flex items-start gap-2">
                        <Users size={18} className="text-purple-600 mt-1 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-semibold text-gray-700">Participantes:</p>
                          <p className="text-gray-600">{reuniao.participantes}</p>
                        </div>
                      </div>
                      {reuniao.descricao && (
                        <div className="flex items-start gap-2">
                          <FileText size={18} className="text-purple-600 mt-1 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-semibold text-gray-700">Descrição:</p>
                            <p className="text-gray-600">{reuniao.descricao}</p>
                          </div>
                        </div>
                      )}
                      {reuniao.setor && (
                        <div className="flex items-center gap-2">
                          <Shield size={18} className="text-purple-600" />
                          <p className="text-sm">
                            <span className="font-semibold text-gray-700">Setor:</span> {reuniao.setor}
                          </p>
                        </div>
                      )}
                      {reuniao.criadoPor && (
                        <div className="flex items-center gap-2">
                          <Users size={18} className="text-purple-600" />
                          <p className="text-sm">
                            <span className="font-semibold text-gray-700">Criado por:</span> {reuniao.criadoPor}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}