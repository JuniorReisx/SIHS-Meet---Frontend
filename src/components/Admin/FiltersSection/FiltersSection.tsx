import { Filter, TrendingUp } from "lucide-react";

type FilterType = "all" | "last-10-days" | "last-20-days" | "last-month" | "last-year" | "upcoming" | "past" | "custom" | "month";

interface FiltersSectionProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  selectedMonth: string;
  onMonthChange: (month: string) => void;
  customStartDate: string;
  onStartDateChange: (date: string) => void;
  customEndDate: string;
  onEndDateChange: (date: string) => void;
  onClearFilters: () => void;
  onApplyFilters: () => void;
}

export function FiltersSection({
  activeFilter,
  onFilterChange,
  selectedStatus,
  onStatusChange,
  selectedMonth,
  onMonthChange,
  customStartDate,
  onStartDateChange,
  customEndDate,
  onEndDateChange,
  onClearFilters,
  onApplyFilters,
}: FiltersSectionProps) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="text-blue-600" size={24} />
        <h3 className="text-xl font-bold text-gray-800">Filtros</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Filtros por período */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Período</label>
          <select
            value={activeFilter}
            onChange={(e) => onFilterChange(e.target.value as FilterType)}
            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
          >
            <option value="all">Todas</option>
            <option value="last-10-days">Últimos 10 dias</option>
            <option value="last-20-days">Últimos 20 dias</option>
            <option value="last-month">Último mês</option>
            <option value="last-year">Último ano</option>
            <option value="upcoming">Futuras</option>
            <option value="past">Passadas</option>
            <option value="custom">Período customizado</option>
            <option value="month">Por mês específico</option>
          </select>
        </div>

        {/* Filtro por status */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
          >
            <option value="all">Todos</option>
            <option value="confirmed">Confirmadas</option>
            <option value="pending">Pendentes</option>
            <option value="denied">Negadas</option>
          </select>
        </div>

        {/* Filtro por mês (aparece apenas se "month" estiver selecionado) */}
        {activeFilter === "month" && (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Selecione o Mês</label>
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => onMonthChange(e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
            />
          </div>
        )}

        {/* Filtro customizado (aparece apenas se "custom" estiver selecionado) */}
        {activeFilter === "custom" && (
          <>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Data Inicial</label>
              <input
                type="date"
                value={customStartDate}
                onChange={(e) => onStartDateChange(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Data Final</label>
              <input
                type="date"
                value={customEndDate}
                onChange={(e) => onEndDateChange(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
              />
            </div>
          </>
        )}
      </div>

      {/* Botões de ação */}
      <div className="mt-4 flex gap-3">
        <button
          onClick={onClearFilters}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-semibold transition-colors"
        >
          Limpar Filtros
        </button>
        <button
          onClick={onApplyFilters}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
        >
          <TrendingUp size={18} />
          Aplicar Filtros
        </button>
      </div>
    </div>
  );
}