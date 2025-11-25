import { Save, X } from "lucide-react";
import type { Meeting } from "../../types/types";


interface MeetingFormProps {
  formData: Omit<Meeting, "id">;
  modoEdicao: boolean;
  onFormChange: (data: Omit<Meeting, "id">) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export function MeetingForm({
  formData,
  modoEdicao,
  onFormChange,
  onSubmit,
  onCancel,
}: MeetingFormProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border-2 border-blue-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-blue-900">
          {modoEdicao ? "Editar Reunião" : "Nova Reunião"}
        </h2>
        <button
          onClick={onCancel}
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
              value={formData.title}
              onChange={(e) =>
                onFormChange({ ...formData, title: e.target.value })
              }
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
              value={formData.date}
              onChange={(e) =>
                onFormChange({ ...formData, date: e.target.value })
              }
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Horário *
            </label>
            <input
              type="time"
              value={formData.time}
              onChange={(e) =>
                onFormChange({ ...formData, time: e.target.value })
              }
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Local *
            </label>
            <select
              value={formData.location}
              onChange={(e) =>
                onFormChange({ ...formData, location: e.target.value })
              }
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
            >
              <option value="">Selecione um local</option>
              <option value="Reunião Portal da Água">
                Reunião Portal da Água
              </option>
              <option value="Sala de Reunião">Sala de Reunião</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Quantidade de Participantes *
            </label>
            <input
              type="number"
              min="1"
              value={formData.participants}
              onChange={(e) =>
                onFormChange({
                  ...formData,
                  participants: e.target.value,
                })
              }
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
              placeholder="Ex: 10"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Descrição/Pauta
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                onFormChange({ ...formData, description: e.target.value })
              }
              rows={4}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none resize-none"
              placeholder="Descreva a pauta e objetivos da reunião..."
            />
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            onClick={onSubmit}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg shadow-md flex items-center gap-2 transition-colors"
          >
            <Save size={20} />
            {modoEdicao ? "Salvar Alterações" : "Cadastrar Reunião"}
          </button>
          <button
            onClick={onCancel}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold px-8 py-3 rounded-lg transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}