import { useState } from 'react';
import { Calendar, Clock, Users, MapPin, Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import  logo  from '/src/assets/SIHS.jpg' 

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
    descricao: "Discussão sobre cronograma e orçamento da nova estação"
  },
  {
    id: 2,
    titulo: "Revisão de Contratos - Fornecedores",
    data: "2025-11-28",
    horario: "14:00",
    local: "Auditório Administrativo",
    participantes: "Setor Jurídico, Compras",
    descricao: "Análise das renovações e novos contratos de fornecedores"
  },
  {
    id: 3,
    titulo: "Reunião de Alinhamento - Projetos Internos",
    data: "2025-12-02",
    horario: "10:30",
    local: "Sala 03 - SIHS",
    participantes: "Gestores de Setor",
    descricao: "Planejamento trimestral das atividades internas"
  },
  {
    id: 4,
    titulo: "Apresentação de Resultados - TI",
    data: "2025-12-05",
    horario: "16:00",
    local: "Sala de Conferências",
    participantes: "Equipe de TI, Diretoria",
    descricao: "Demonstração dos indicadores e melhorias do setor de TI"
  },
  {
    id: 5,
    titulo: "Reunião Extraordinária - Manutenção",
    data: "2025-12-10",
    horario: "08:00",
    local: "Oficina de Manutenção",
    participantes: "Equipe de Manutenção",
    descricao: "Discussão urgente sobre falha em equipamento crítico"
  }
]);


  const [modoEdicao, setModoEdicao] = useState(false);
  const [reuniaoSelecionada, setReuniaoSelecionada] = useState<Reuniao | null>(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const [formData, setFormData] = useState<Omit<Reuniao, 'id'>>({
    titulo: '',
    data: '',
    horario: '',
    local: '',
    participantes: '',
    descricao: ''
  });

  const resetForm = () => {
    setFormData({
      titulo: '',
      data: '',
      horario: '',
      local: '',
      participantes: '',
      descricao: ''
    });
    setModoEdicao(false);
    setReuniaoSelecionada(null);
    setMostrarFormulario(false);
  };

  const handleSubmit = () => {
    if (!formData.titulo || !formData.data || !formData.horario || !formData.local || !formData.participantes) {
      alert('Por favor, preencha todos os campos obrigatórios');
      return;
    }
    
    if (modoEdicao && reuniaoSelecionada) {
      setReunioes(reunioes.map(r => 
        r.id === reuniaoSelecionada.id 
          ? { ...formData, id: reuniaoSelecionada.id }
          : r
      ));
    } else {
      const novaReuniao: Reuniao = {
        ...formData,
        id: Math.max(0, ...reunioes.map(r => r.id)) + 1
      };
      setReunioes([...reunioes, novaReuniao]);
    }
    
    resetForm();
  };

  const handleEdit = (reuniao: Reuniao) => {
    setFormData({
      titulo: reuniao.titulo,
      data: reuniao.data,
      horario: reuniao.horario,
      local: reuniao.local,
      participantes: reuniao.participantes,
      descricao: reuniao.descricao
    });
    setReuniaoSelecionada(reuniao);
    setModoEdicao(true);
    setMostrarFormulario(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('Deseja realmente excluir esta reunião?')) {
      setReunioes(reunioes.filter(r => r.id !== id));
    }
  };

  const formatData = (data: string) => {
    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}/${ano}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
     {/* Header */}
      <header className="bg-gradient-to-r from-gray-50 via-slate-100 to-gray-50 shadow-xl border-b-4 border-blue-600">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-white p-3 rounded-xl shadow-md border border-gray-200">
                <img 
                  src={logo} 
                  alt="Logo SIHS" 
                  className="h-16 w-16 object-contain"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800 tracking-tight">SIHS</h1>
                <p className="text-gray-600 text-sm mt-0.5 font-medium">
                  Secretaria de Infraestrutura Hídrica e Saneamento
                </p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 px-6 py-3 rounded-xl shadow-lg">
              <p className="text-white text-sm font-bold tracking-wide">Sistema de Reuniões</p>
            </div>
          </div>
        </div>
      </header>

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
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border-2 border-blue-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-blue-900">
                {modoEdicao ? 'Editar Reunião' : 'Nova Reunião'}
              </h2>
              <button
                onClick={resetForm}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Título da Reunião *
                  </label>
                  <input
                    type="text"
                    value={formData.titulo}
                    onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                    placeholder="Ex: Reunião de Planejamento Trimestral"
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
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
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
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Local *
                  </label>
                  <input
                    type="text"
                    value={formData.local}
                    onChange={(e) => setFormData({ ...formData, local: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                    placeholder="Ex: Sala de Reuniões - 2º Andar"
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
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                    placeholder="Ex: João Silva, Maria Santos, Equipe Técnica"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Descrição/Pauta
                  </label>
                  <textarea
                    value={formData.descricao}
                    onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors resize-none"
                    placeholder="Descreva a pauta e objetivos da reunião..."
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={handleSubmit}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg shadow-md flex items-center gap-2 transition-colors"
                >
                  <Save size={20} />
                  {modoEdicao ? 'Salvar Alterações' : 'Cadastrar Reunião'}
                </button>
                <button
                  onClick={resetForm}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold px-8 py-3 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Lista de Reuniões */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-blue-900 mb-6">
            Reuniões Agendadas ({reunioes.length})
          </h2>

          {reunioes.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <Calendar size={64} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg">Nenhuma reunião cadastrada</p>
              <p className="text-gray-400 text-sm mt-2">
                Clique em "Nova Reunião" para começar
              </p>
            </div>
          ) : (
            reunioes.map((reuniao) => (
              <div
                key={reuniao.id}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow border-l-4 border-blue-500"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-800 flex-1">
                      {reuniao.titulo}
                    </h3>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleEdit(reuniao)}
                        className="bg-blue-100 hover:bg-blue-200 text-blue-700 p-2 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(reuniao.id)}
                        className="bg-red-100 hover:bg-red-200 text-red-700 p-2 rounded-lg transition-colors"
                        title="Excluir"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-3 text-gray-600">
                      <Calendar size={20} className="text-blue-600" />
                      <span className="font-medium">{formatData(reuniao.data)}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                      <Clock size={20} className="text-blue-600" />
                      <span className="font-medium">{reuniao.horario}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                      <MapPin size={20} className="text-blue-600" />
                      <span className="font-medium">{reuniao.local}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                      <Users size={20} className="text-blue-600" />
                      <span className="font-medium">{reuniao.participantes}</span>
                    </div>
                  </div>

                  {reuniao.descricao && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-sm font-semibold text-gray-700 mb-2">Descrição:</p>
                      <p className="text-gray-600 leading-relaxed">{reuniao.descricao}</p>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Footer */}
         <footer className="bg-gradient-to-r from-gray-800 via-slate-700 to-gray-800 text-white mt-16 py-8 border-t-4 border-blue-600">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <p className="text-sm font-semibold text-gray-200">
                © 2025 SIHS - Secretaria de Infraestrutura Hídrica e Saneamento
              </p>
              <p className="text-gray-400 text-xs mt-1">
                Sistema de Gerenciamento de Reuniões
              </p>
            </div>
            <div className="flex items-center gap-2 bg-blue-600 px-4 py-2 rounded-lg shadow-md">
              <Calendar size={16} className="text-white" />
              <span className="text-xs font-semibold text-white">Versão 1.0</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}