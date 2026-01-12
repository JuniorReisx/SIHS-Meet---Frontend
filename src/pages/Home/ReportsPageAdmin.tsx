import { useState, useEffect } from "react";
import {
  FileText,
  Download,
  TrendingUp,
  Calendar,
  Users,
  Clock,
  Filter,
  BarChart3,
} from "lucide-react";
import { HeaderAdmin } from "../../components/Admin/Header/HeaderAdmin";
import { API_URL } from "../../config/api";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { ReportsCharts } from "../../components/Admin/Reports/ReportsCharts";
import type { Meeting } from "../../types/types";
import type { Statistics } from "../../types/types";
import type { ReportFilters } from "../../types/types";

type ViewMode = "summary" | "charts" | "detailed";

export function ReportsPage() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(false);
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("summary");

  const [filters, setFilters] = useState<ReportFilters>({
    startDate: "",
    endDate: "",
    status: "all",
    location: "all",
    department: "all",
  });

  // Exemplo: exibir em um console.log
  useEffect(() => {
    if (statistics) {
      console.log("Estatísticas gerais:", statistics);
    }
  }, [statistics]);


  // Carregar dados
  const loadData = async () => {
    setLoading(true);
    try {
      const [meetingsRes, statsRes] = await Promise.all([
        fetch(`${API_URL}/meetingsTotal/all`),
        fetch(`${API_URL}/meetingsTotal/statistics`),
      ]);

      if (meetingsRes.ok) {
        const data = await meetingsRes.json();
        const meetingsData = Array.isArray(data)
          ? data
          : data.meetings || data.data || [];
        setMeetings(meetingsData);
      }

      if (statsRes.ok) {
        const stats = await statsRes.json();
        setStatistics(stats);
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filtrar reuniões
  const filteredMeetings = meetings.filter((meeting) => {
    const meetingDate = new Date(meeting.meeting_date);
    const startDate = filters.startDate ? new Date(filters.startDate) : null;
    const endDate = filters.endDate ? new Date(filters.endDate) : null;

    if (startDate && meetingDate < startDate) return false;
    if (endDate && meetingDate > endDate) return false;
    if (filters.status !== "all" && meeting.status !== filters.status)
      return false;
    if (filters.location !== "all" && meeting.location !== filters.location)
      return false;
    if (
      filters.department !== "all" &&
      meeting.responsible_department !== filters.department
    )
      return false;

    return true;
  });

  // Extrair valores únicos para filtros
  const uniqueLocations = [...new Set(meetings.map((m) => m.location))];
  const uniqueDepartments = [
    ...new Set(meetings.map((m) => m.responsible_department)),
  ];

  // Estatísticas filtradas
  const filteredStats = {
    total: filteredMeetings.length,
    confirmed: filteredMeetings.filter((m) => m.status === "confirmed").length,
    pending: filteredMeetings.filter((m) => m.status === "pending").length,
    denied: filteredMeetings.filter((m) => m.status === "denied").length,
    totalParticipants: filteredMeetings.reduce(
      (sum, m) => sum + m.participants_count,
      0
    ),
    avgParticipants:
      filteredMeetings.length > 0
        ? Math.round(
            filteredMeetings.reduce((sum, m) => sum + m.participants_count, 0) /
              filteredMeetings.length
          )
        : 0,
  };

  // Reuniões por departamento
  const meetingsByDepartment = filteredMeetings.reduce((acc, meeting) => {
    const dept = meeting.responsible_department || "Sem departamento";
    acc[dept] = (acc[dept] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Reuniões por local
  const meetingsByLocation = filteredMeetings.reduce((acc, meeting) => {
    acc[meeting.location] = (acc[meeting.location] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Função para gerar PDF
  const generatePDF = async () => {
    setGeneratingPDF(true);
    try {
      const reportElement = document.getElementById("report-content");
      if (!reportElement) return;

      const canvas = await html2canvas(reportElement, {
        scale: 2,
        logging: false,
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const fileName = `relatorio-reunioes-${
        new Date().toISOString().split("T")[0]
      }.pdf`;
      pdf.save(fileName);
      alert("PDF gerado com sucesso!");
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      alert("Erro ao gerar PDF. Tente novamente.");
    } finally {
      setGeneratingPDF(false);
    }
  };

  // Limpar filtros
  const clearFilters = () => {
    setFilters({
      startDate: "",
      endDate: "",
      status: "all",
      location: "all",
      department: "all",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando relatórios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      <HeaderAdmin />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Cabeçalho */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
              <FileText className="text-purple-600" size={36} />
              Relatórios de Reuniões
            </h1>
            <p className="text-gray-600 mt-2">
              Análise completa e exportação de dados
            </p>
          </div>

          <button
            onClick={generatePDF}
            disabled={generatingPDF || filteredMeetings.length === 0}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {generatingPDF ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Gerando PDF...
              </>
            ) : (
              <>
                <Download size={20} />
                Exportar PDF
              </>
            )}
          </button>
        </div>

        {/* Modo de Visualização */}
        <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setViewMode("summary")}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                viewMode === "summary"
                  ? "bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <FileText size={20} />
              Resumo Executivo
            </button>
            <button
              onClick={() => setViewMode("charts")}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                viewMode === "charts"
                  ? "bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <BarChart3 size={20} />
              Gráficos e Análises
            </button>
            <button
              onClick={() => setViewMode("detailed")}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                viewMode === "detailed"
                  ? "bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <TrendingUp size={20} />
              Relatório Detalhado
            </button>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="text-blue-600" size={24} />
            <h3 className="text-xl font-bold text-gray-800">
              Filtros de Relatório
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Data Inicial
              </label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) =>
                  setFilters({ ...filters, startDate: e.target.value })
                }
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Data Final
              </label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) =>
                  setFilters({ ...filters, endDate: e.target.value })
                }
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) =>
                  setFilters({ ...filters, status: e.target.value })
                }
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
              >
                <option value="all">Todos</option>
                <option value="confirmed">Confirmadas</option>
                <option value="pending">Pendentes</option>
                <option value="denied">Negadas</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Local
              </label>
              <select
                value={filters.location}
                onChange={(e) =>
                  setFilters({ ...filters, location: e.target.value })
                }
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
              >
                <option value="all">Todos</option>
                {uniqueLocations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Departamento
              </label>
              <select
                value={filters.department}
                onChange={(e) =>
                  setFilters({ ...filters, department: e.target.value })
                }
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
              >
                <option value="all">Todos</option>
                {uniqueDepartments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4">
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-semibold transition-colors"
            >
              Limpar Filtros
            </button>
          </div>
        </div>

        {/* Conteúdo do Relatório */}
        <div id="report-content">
          {viewMode === "summary" && (
            <div className="bg-white rounded-xl shadow-lg p-8">
              {/* Cabeçalho do Relatório */}
              <div className="border-b-4 border-purple-600 pb-6 mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  Resumo Executivo
                </h2>
                <p className="text-gray-600">
                  Gerado em:{" "}
                  {new Date().toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
                {(filters.startDate || filters.endDate) && (
                  <p className="text-gray-600 mt-1">
                    Período:{" "}
                    {filters.startDate
                      ? new Date(filters.startDate).toLocaleDateString("pt-BR")
                      : "Início"}{" "}
                    até{" "}
                    {filters.endDate
                      ? new Date(filters.endDate).toLocaleDateString("pt-BR")
                      : "Hoje"}
                  </p>
                )}
              </div>

              {/* Cards de Estatísticas */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
                  <div className="flex items-center justify-between mb-2">
                    <Calendar size={28} />
                    <span className="text-3xl font-bold">
                      {filteredStats.total}
                    </span>
                  </div>
                  <p className="text-sm opacity-90">Total de Reuniões</p>
                </div>

                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
                  <div className="flex items-center justify-between mb-2">
                    <TrendingUp size={28} />
                    <span className="text-3xl font-bold">
                      {filteredStats.confirmed}
                    </span>
                  </div>
                  <p className="text-sm opacity-90">Confirmadas</p>
                </div>

                <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-6 text-white">
                  <div className="flex items-center justify-between mb-2">
                    <Clock size={28} />
                    <span className="text-3xl font-bold">
                      {filteredStats.pending}
                    </span>
                  </div>
                  <p className="text-sm opacity-90">Pendentes</p>
                </div>

                <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-6 text-white">
                  <div className="flex items-center justify-between mb-2">
                    <FileText size={28} />
                    <span className="text-3xl font-bold">
                      {filteredStats.denied}
                    </span>
                  </div>
                  <p className="text-sm opacity-90">Negadas</p>
                </div>

                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
                  <div className="flex items-center justify-between mb-2">
                    <Users size={28} />
                    <span className="text-3xl font-bold">
                      {filteredStats.totalParticipants}
                    </span>
                  </div>
                  <p className="text-sm opacity-90">Total Participantes</p>
                </div>

                <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl p-6 text-white">
                  <div className="flex items-center justify-between mb-2">
                    <Users size={28} />
                    <span className="text-3xl font-bold">
                      {filteredStats.avgParticipants}
                    </span>
                  </div>
                  <p className="text-sm opacity-90">Média Participantes</p>
                </div>
              </div>

              {/* Insights Rápidos */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
                  <h4 className="font-bold text-gray-800 mb-2">
                    Departamento Mais Ativo
                  </h4>
                  <p className="text-gray-700">
                    {Object.entries(meetingsByDepartment).sort(
                      (a, b) => b[1] - a[1]
                    )[0]?.[0] || "N/A"}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {Object.entries(meetingsByDepartment).sort(
                      (a, b) => b[1] - a[1]
                    )[0]?.[1] || 0}{" "}
                    reuniões
                  </p>
                </div>

                <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-r-lg">
                  <h4 className="font-bold text-gray-800 mb-2">
                    Local Mais Utilizado
                  </h4>
                  <p className="text-gray-700">
                    {Object.entries(meetingsByLocation).sort(
                      (a, b) => b[1] - a[1]
                    )[0]?.[0] || "N/A"}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {Object.entries(meetingsByLocation).sort(
                      (a, b) => b[1] - a[1]
                    )[0]?.[1] || 0}{" "}
                    reuniões
                  </p>
                </div>
              </div>

              {/* Rodapé */}
              <div className="mt-8 pt-6 border-t-2 border-gray-200 text-center text-gray-500 text-sm">
                <p>Sistema de Gestão de Reuniões - Relatório Confidencial</p>
                <p className="mt-1">
                  © {new Date().getFullYear()} - Todos os direitos reservados
                </p>
              </div>
            </div>
          )}

          {viewMode === "charts" && (
            <ReportsCharts meetings={filteredMeetings} />
          )}

          {viewMode === "detailed" && (
            <div className="space-y-6">
              {/* Reuniões por Departamento */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  Reuniões por Departamento
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-gray-300">
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">
                          Departamento
                        </th>
                        <th className="text-center py-3 px-4 font-semibold text-gray-700">
                          Quantidade
                        </th>
                        <th className="text-right py-3 px-4 font-semibold text-gray-700">
                          Percentual
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(meetingsByDepartment)
                        .sort((a, b) => b[1] - a[1])
                        .map(([dept, count]) => (
                          <tr
                            key={dept}
                            className="border-b border-gray-200 hover:bg-gray-50"
                          >
                            <td className="py-3 px-4 text-gray-800">{dept}</td>
                            <td className="py-3 px-4 text-center font-semibold text-blue-600">
                              {count}
                            </td>
                            <td className="py-3 px-4 text-right text-gray-600">
                              {((count / filteredStats.total) * 100).toFixed(1)}
                              %
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Reuniões por Local */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  Reuniões por Local
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-gray-300">
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">
                          Local
                        </th>
                        <th className="text-center py-3 px-4 font-semibold text-gray-700">
                          Quantidade
                        </th>
                        <th className="text-right py-3 px-4 font-semibold text-gray-700">
                          Percentual
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(meetingsByLocation)
                        .sort((a, b) => b[1] - a[1])
                        .map(([location, count]) => (
                          <tr
                            key={location}
                            className="border-b border-gray-200 hover:bg-gray-50"
                          >
                            <td className="py-3 px-4 text-gray-800">
                              {location}
                            </td>
                            <td className="py-3 px-4 text-center font-semibold text-green-600">
                              {count}
                            </td>
                            <td className="py-3 px-4 text-right text-gray-600">
                              {((count / filteredStats.total) * 100).toFixed(1)}
                              %
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Lista Detalhada */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  Detalhamento Completo
                </h3>
                <div className="overflow-x-auto max-h-96 overflow-y-auto">
                  <table className="w-full text-sm">
                    <thead className="sticky top-0 bg-white">
                      <tr className="border-b-2 border-gray-300">
                        <th className="text-left py-3 px-2 font-semibold text-gray-700">
                          Data
                        </th>
                        <th className="text-left py-3 px-2 font-semibold text-gray-700">
                          Título
                        </th>
                        <th className="text-left py-3 px-2 font-semibold text-gray-700">
                          Local
                        </th>
                        <th className="text-left py-3 px-2 font-semibold text-gray-700">
                          Responsável
                        </th>
                        <th className="text-center py-3 px-2 font-semibold text-gray-700">
                          Part.
                        </th>
                        <th className="text-center py-3 px-2 font-semibold text-gray-700">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredMeetings.map((meeting) => (
                        <tr
                          key={meeting.id}
                          className="border-b border-gray-200 hover:bg-gray-50"
                        >
                          <td className="py-2 px-2 text-gray-800">
                            {new Date(meeting.meeting_date).toLocaleDateString(
                              "pt-BR"
                            )}
                          </td>
                          <td className="py-2 px-2 text-gray-800">
                            {meeting.title}
                          </td>
                          <td className="py-2 px-2 text-gray-600">
                            {meeting.location}
                          </td>
                          <td className="py-2 px-2 text-gray-600">
                            {meeting.responsible}
                          </td>
                          <td className="py-2 px-2 text-center font-semibold">
                            {meeting.participants_count}
                          </td>
                          <td className="py-2 px-2 text-center">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                meeting.status === "confirmed"
                                  ? "bg-green-100 text-green-700"
                                  : meeting.status === "pending"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {meeting.status === "confirmed"
                                ? "Confirmada"
                                : meeting.status === "pending"
                                ? "Pendente"
                                : "Negada"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
