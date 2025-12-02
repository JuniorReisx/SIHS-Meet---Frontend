import { Save, X, Loader2 } from "lucide-react";
import { useState } from "react";
import { createMeeting, updateMeeting } from "../../services/meetingService";
import type { Meeting } from "../../types/types";

interface MeetingFormProps {
  formData: Omit<Meeting, "id">;
  modoEdicao: boolean;
  meetingId?: number; // ID da reunião quando em modo de edição
  onFormChange: (data: Omit<Meeting, "id">) => void;
  onSuccess: () => void; // Callback quando salvar com sucesso
  onCancel: () => void;
}

export function MeetingForm({
  formData,
  modoEdicao,
  meetingId,
  onFormChange,
  onSuccess,
  onCancel,
}: MeetingFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    // Validação dos campos obrigatórios
    if (!formData.title || !formData.date || !formData.time || !formData.endTime || !formData.location || !formData.participants) {
      setError("Por favor, preencha todos os campos obrigatórios (*)");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      if (modoEdicao && meetingId) {
        // Atualizar reunião existente
        await updateMeeting(meetingId, formData);
        alert("✅ Reunião atualizada com sucesso!");
      } else {
        // Criar nova reunião
        await createMeeting(formData);
        alert("✅ Reunião cadastrada com sucesso!");
      }
      
      // Chama o callback de sucesso (para recarregar a lista, limpar form, etc)
      onSuccess();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao salvar reunião";
      setError(errorMessage);
      console.error("Erro ao salvar reunião:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border-2 border-blue-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-blue-900">
          {modoEdicao ? "Editar Reunião" : "Nova Reunião"}
        </h2>
        <button
          onClick={onCancel}
          disabled={submitting}
          className="text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-50"
        >
          <X size={24} />
        </button>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
          <p className="text-red-700 font-medium">{error}</p>
        </div>
      )}

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
              disabled={submitting}
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
              disabled={submitting}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Horário de Início *
            </label>
            <input
              type="time"
              value={formData.time}
              onChange={(e) =>
                onFormChange({ ...formData, time: e.target.value })
              }
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
              disabled={submitting}
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Horário de Término *
            </label>
            <input
              type="time"
              value={formData.endTime || ""}
              onChange={(e) =>
                onFormChange({ ...formData, endTime: e.target.value })
              }
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
              disabled={submitting}
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
              disabled={submitting}
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
              disabled={submitting}
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
              disabled={submitting}
            />
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg shadow-md flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save size={20} />
                {modoEdicao ? "Salvar Alterações" : "Cadastrar Reunião"}
              </>
            )}
          </button>
          <button
            onClick={onCancel}
            disabled={submitting}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold px-8 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}