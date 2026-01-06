import { X, Shield, Loader2 } from "lucide-react";
import type { Meeting } from "../../../types/types";

interface Props {
  formData: Omit<Meeting, "id">;
  setFormData: (d: Omit<Meeting, "id">) => void;

  editMode: boolean;
  submitting: boolean;
  onSubmit: () => void;
  onCancel: () => void;
}

export function MeetingForm({
  formData,
  setFormData,
  editMode,
  submitting,
  onSubmit,
  onCancel,
}: Props) {
  return (
    <div className="bg-white rounded-xl shadow-2xl p-8 mb-8 border-t-4 border-purple-600">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Shield className="text-purple-600" size={28} />
          {editMode ? "Editar Reunião" : "Nova Reunião"}
        </h2>

        <button onClick={onCancel} disabled={submitting}>
          <X size={24} />
        </button>
      </div>

      {/* Inputs reduzidos para exemplo */}
      <div className="space-y-6">
        {/* Título */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Título da Reunião *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
            placeholder="Ex: Reunião de Planejamento Estratégico"
            disabled={submitting}
          />
        </div>

        {/* Data e Horários em Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Data *
            </label>
            <input
              type="date"
              value={formData.meeting_date}
              onChange={(e) =>
                setFormData({ ...formData, meeting_date: e.target.value })
              }
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
              disabled={submitting}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Horário de Início *
            </label>
            <input
              type="time"
              value={formData.start_time}
              onChange={(e) =>
                setFormData({ ...formData, start_time: e.target.value })
              }
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
              disabled={submitting}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Horário de Término *
            </label>
            <input
              type="time"
              value={formData.end_time}
              onChange={(e) =>
                setFormData({ ...formData, end_time: e.target.value })
              }
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
              disabled={submitting}
            />
          </div>
        </div>

        {/* Local */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Local *
          </label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) =>
              setFormData({ ...formData, location: e.target.value })
            }
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
            placeholder="Ex: Sala de Reuniões - SIHS"
            disabled={submitting}
          />
        </div>

        {/* Participantes */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Número de Participantes *
          </label>
          <input
            type="number"
            min="1"
            value={formData.participants_count}
            onChange={(e) =>
              setFormData({
                ...formData,
                participants_count: parseInt(e.target.value) || 0,
              })
            }
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
            placeholder="Ex: 10"
            disabled={submitting}
          />
        </div>

        {/* Responsável */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Responsável *
            </label>
            <input
              type="text"
              value={formData.responsible}
              onChange={(e) =>
                setFormData({ ...formData, responsible: e.target.value })
              }
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
              placeholder="Ex: João Silva"
              disabled={submitting}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Departamento *
            </label>
            <input
              type="text"
              value={formData.responsible_department}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  responsible_department: e.target.value,
                })
              }
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
              placeholder="Ex: Recursos Humanos"
              disabled={submitting}
            />
          </div>
        </div>

        {/* Descrição */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Descrição
          </label>
          <textarea
            value={formData.description || ""}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
            rows={4}
            placeholder="Descrição detalhada da reunião..."
            disabled={submitting}
          />
        </div>
      </div>
      <div className="flex gap-4 mt-6">
        <button
          onClick={onSubmit}
          disabled={submitting}
          className="flex-1 bg-purple-700 text-white py-3 rounded-lg"
        >
          {submitting ? (
            <div className="flex items-center gap-2 justify-center">
              <Loader2 className="animate-spin" /> Salvando...
            </div>
          ) : editMode ? (
            "Salvar"
          ) : (
            "Criar"
          )}
        </button>

        <button
          onClick={onCancel}
          disabled={submitting}
          className="px-8 bg-gray-200 py-3 rounded-lg"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
