import { Calendar, Clock, Edit, Trash2, ChevronDown, ChevronUp, MapPin, Users, User, Building2 } from "lucide-react";
import React from 'react'
// Mock type for demo
interface Meeting {
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

interface Props {
  meeting: Meeting;
  expanded: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function MeetingCard({
  meeting,
  expanded,
  onToggle,
  onEdit,
  onDelete
}: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group">
      {/* Header colorido com gradiente */}
      <div className="h-2 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600"></div>
      
      <div className="p-6">
        {/* Título e badge */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-purple-600 transition-colors">
              {meeting.title}
            </h3>
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-medium">
              <Users size={14} />
              {meeting.participants_count} participantes
            </span>
          </div>
        </div>

        {/* Informações principais em grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <div className="flex items-center gap-2 text-gray-600">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
              <Calendar size={16} className="text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Data</p>
              <p className="text-sm font-medium">{meeting.meeting_date}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-gray-600">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
              <Clock size={16} className="text-indigo-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Horário</p>
              <p className="text-sm font-medium">
                {meeting.start_time} - {meeting.end_time || "N/A"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-gray-600">
            <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
              <MapPin size={16} className="text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Local</p>
              <p className="text-sm font-medium">{meeting.location}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-gray-600">
            <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
              <User size={16} className="text-orange-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Responsável</p>
              <p className="text-sm font-medium">{meeting.responsible}</p>
            </div>
          </div>
        </div>

        {/* Botão de expandir */}
        <button 
          onClick={onToggle} 
          className="w-full mt-4 flex items-center justify-center gap-2 py-2.5 px-4 bg-gradient-to-r from-purple-50 to-blue-50 hover:from-purple-100 hover:to-blue-100 text-purple-700 rounded-lg transition-all duration-200 font-medium text-sm group/btn"
        >
          {expanded ? (
            <>
              <ChevronUp size={18} className="group-hover/btn:translate-y-[-2px] transition-transform" />
              Ocultar detalhes
            </>
          ) : (
            <>
              <ChevronDown size={18} className="group-hover/btn:translate-y-[2px] transition-transform" />
              Ver detalhes completos
            </>
          )}
        </button>

        {/* Seção expandida com animação */}
        <div 
          className={`transition-all duration-300 ease-in-out overflow-hidden ${
            expanded ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="p-5 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl border border-gray-100 space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Building2 size={16} className="text-purple-600" />
                <h4 className="font-semibold text-gray-800 text-sm">Departamento</h4>
              </div>
              <p className="text-gray-700 text-sm pl-6">{meeting.responsible_department}</p>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h4 className="font-semibold text-gray-800 text-sm">Descrição</h4>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed pl-6">
                {meeting.description || "Sem descrição disponível"}
              </p>
            </div>
          </div>
        </div>

        {/* Ações com hover melhorado */}
        <div className="flex gap-3 justify-end mt-5 pt-4 border-t border-gray-100">
          <button 
            className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 font-medium text-sm group/edit"
            onClick={onEdit}
          >
            <Edit size={18} className="group-hover/edit:rotate-12 transition-transform" />
            Editar
          </button>

          <button 
            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 font-medium text-sm group/delete"
            onClick={onDelete}
          >
            <Trash2 size={18} className="group-hover/delete:scale-110 transition-transform" />
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
}

// Demo Component
export default function App() {
  const [expanded, setExpanded] = React.useState(false);

  const mockMeeting: Meeting = {
    id: 1,
    title: "Reunião de Planejamento Estratégico 2025",
    meeting_date: "15/12/2024",
    start_time: "14:00",
    end_time: "16:00",
    location: "Sala de Conferências A - 3º Andar",
    participants_count: 12,
    description: "Discussão sobre metas e objetivos estratégicos para o próximo ano fiscal. Apresentação de KPIs, análise de mercado e definição de prioridades departamentais.",
    responsible: "Maria Silva Santos",
    responsible_department: "Gerência de Projetos"
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 p-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Preview do Card de Reunião</h1>
          <p className="text-gray-600">Design moderno com animações suaves e hover effects</p>
        </div>
        
        <MeetingCard
          meeting={mockMeeting}
          expanded={expanded}
          onToggle={() => setExpanded(!expanded)}
          onEdit={() => alert("Editar reunião")}
          onDelete={() => alert("Excluir reunião")}
        />
      </div>
    </div>
  );
}