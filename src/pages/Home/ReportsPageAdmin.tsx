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
  ArrowLeft,
} from "lucide-react";
import { HeaderAdmin } from "../../components/Admin/Header/HeaderAdmin";
import { API_URL } from "../../config/api";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { ReportsCharts } from "../../components/Admin/Reports/ReportsCharts";
import type { Meeting } from "../../types/types";
import type { Statistics } from "../../types/types";
import type { ReportFilters } from "../../types/types";
import { Link } from "react-router-dom";

type ViewMode = "summary" | "charts" | "detailed";

// ─── Helpers de estilo ────────────────────────────────────────────────────────

const SELECT = "input input-accent";
const INPUT = "input input-accent";

const STAT_CARDS = [
  { key: "total",             label: "Total de Reuniões",   icon: Calendar,    color: "text-blue-600",   bg: "bg-blue-50",   border: "border-blue-100"   },
  { key: "confirmed",         label: "Confirmadas",         icon: TrendingUp,  color: "text-green-600",  bg: "bg-green-50",  border: "border-green-100"  },
  { key: "pending",           label: "Pendentes",           icon: Clock,       color: "text-yellow-600", bg: "bg-yellow-50", border: "border-yellow-100" },
  { key: "denied",            label: "Negadas",             icon: FileText,    color: "text-red-600",    bg: "bg-red-50",    border: "border-red-100"    },
  { key: "totalParticipants", label: "Total Participantes", icon: Users,       color: "text-purple-600", bg: "bg-purple-50", border: "border-purple-100" },
  { key: "avgParticipants",   label: "Média Participantes", icon: Users,       color: "text-indigo-600", bg: "bg-indigo-50", border: "border-indigo-100" },
] as const;

// ─── Componente ───────────────────────────────────────────────────────────────

export function ReportsPage() {
  const [meetings,       setMeetings]       = useState<Meeting[]>([]);
  const [statistics,     setStatistics]     = useState<Statistics | null>(null);
  const [loading,        setLoading]        = useState(false);
  const [generatingPDF,  setGeneratingPDF]  = useState(false);
  const [viewMode,       setViewMode]       = useState<ViewMode>("summary");

  const [filters, setFilters] = useState<ReportFilters>({
    startDate:  "",
    endDate:    "",
    status:     "all",
    location:   "all",
    department: "all",
  });

  useEffect(() => {
    if (statistics) console.log("Estatísticas gerais:", statistics);
  }, [statistics]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [meetingsRes, statsRes] = await Promise.all([
        fetch(`${API_URL}/meetingsTotal/all`),
        fetch(`${API_URL}/meetingsTotal/statistics`),
      ]);
      if (meetingsRes.ok) {
        const data = await meetingsRes.json();
        setMeetings(Array.isArray(data) ? data : data.meetings || data.data || []);
      }
      if (statsRes.ok) setStatistics(await statsRes.json());
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const filteredMeetings = meetings.filter((meeting) => {
    const meetingDate = new Date(meeting.meeting_date);
    const startDate   = filters.startDate ? new Date(filters.startDate) : null;
    const endDate     = filters.endDate   ? new Date(filters.endDate)   : null;
    if (startDate && meetingDate < startDate)                                     return false;
    if (endDate   && meetingDate > endDate)                                       return false;
    if (filters.status     !== "all" && meeting.status                 !== filters.status)     return false;
    if (filters.location   !== "all" && meeting.location               !== filters.location)   return false;
    if (filters.department !== "all" && meeting.responsible_department !== filters.department) return false;
    return true;
  });

  const uniqueLocations   = [...new Set(meetings.map((m) => m.location))];
  const uniqueDepartments = [...new Set(meetings.map((m) => m.responsible_department))];

  const filteredStats = {
    total:             filteredMeetings.length,
    confirmed:         filteredMeetings.filter((m) => m.status === "confirmed").length,
    pending:           filteredMeetings.filter((m) => m.status === "pending").length,
    denied:            filteredMeetings.filter((m) => m.status === "denied").length,
    totalParticipants: filteredMeetings.reduce((sum, m) => sum + m.participants_count, 0),
    avgParticipants:
      filteredMeetings.length > 0
        ? Math.round(filteredMeetings.reduce((sum, m) => sum + m.participants_count, 0) / filteredMeetings.length)
        : 0,
  };

  const meetingsByDepartment = filteredMeetings.reduce((acc, meeting) => {
    const dept = meeting.responsible_department || "Sem departamento";
    acc[dept] = (acc[dept] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const meetingsByLocation = filteredMeetings.reduce((acc, meeting) => {
    acc[meeting.location] = (acc[meeting.location] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const generatePDF = async () => {
    setGeneratingPDF(true);
    try {
      const reportElement = document.getElementById("report-content");
      if (!reportElement) return;
      const canvas = await html2canvas(reportElement, {
        scale: 2, logging: false, useCORS: true, backgroundColor: "#ffffff",
      });
      const imgData   = canvas.toDataURL("image/png");
      const pdf       = new jsPDF("p", "mm", "a4");
      const imgWidth  = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft  = imgHeight;
      let position    = 0;
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      pdf.save(`relatorio-reunioes-${new Date().toISOString().split("T")[0]}.pdf`);
      alert("PDF gerado com sucesso!");
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      alert("Erro ao gerar PDF. Tente novamente.");
    } finally {
      setGeneratingPDF(false);
    }
  };

  const clearFilters = () =>
    setFilters({ startDate: "", endDate: "", status: "all", location: "all", department: "all" });

  // ── Loading ──────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="page-shell-admin min-h-screen flex flex-col">
        <HeaderAdmin />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center animate-fade-in">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-accent-200 border-t-accent-600 mx-auto" />
            <p className="mt-4 text-sm text-slate-500 font-medium">Carregando relatórios...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell-admin flex flex-col min-h-screen">
      <HeaderAdmin />

      <div className="page-container flex-1">

        {/* ── Cabeçalho da página ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">

            {/* Voltar */}
            <Link
              to="/ScheduledMeetingsADMIN"
              className="btn-secondary flex-shrink-0"
            >
              <ArrowLeft size={15} className="transition-transform group-hover:-translate-x-0.5" />
              <span className="hidden sm:inline">Voltar ao Painel</span>
              <span className="sm:hidden">Voltar</span>
            </Link>

            {/* Título */}
            <div>
              <div className="flex items-center gap-2">
                <FileText size={18} className="text-accent-600 flex-shrink-0" />
                <h1 className="section-title text-base sm:text-xl leading-tight">
                  <span className="hidden sm:inline">Relatórios de Reuniões</span>
                  <span className="sm:hidden">Relatórios</span>
                </h1>
              </div>
              <p className="text-xs text-gray-400 mt-0.5 hidden sm:block">
                Análise completa e exportação de dados
              </p>
            </div>
          </div>

          {/* Exportar PDF */}
          <button
            onClick={generatePDF}
            disabled={generatingPDF || filteredMeetings.length === 0}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
          >
            {generatingPDF ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                Gerando PDF...
              </>
            ) : (
              <>
                <Download size={15} />
                Exportar PDF
              </>
            )}
          </button>
        </div>

        {/* ── Seletor de modo de visualização ── */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-1 mb-5 inline-flex gap-1 w-full sm:w-auto">
          {([
            { mode: "summary",  icon: FileText,  label: "Resumo"   },
            { mode: "charts",   icon: BarChart3,  label: "Gráficos" },
            { mode: "detailed", icon: TrendingUp, label: "Detalhado"},
          ] as const).map(({ mode, icon: Icon, label }) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`flex items-center gap-2 flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm font-semibold transition-all
                ${viewMode === mode
                  ? "bg-purple-600 text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"}`}
            >
              <Icon size={15} />
              {label}
            </button>
          ))}
        </div>

        {/* ── Filtros ── */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter size={15} className="text-purple-600" />
            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">
              Filtros
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                Data Inicial
              </label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                className={INPUT}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                Data Final
              </label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                className={INPUT}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className={SELECT}
              >
                <option value="all">Todos</option>
                <option value="confirmed">Confirmadas</option>
                <option value="pending">Pendentes</option>
                <option value="denied">Negadas</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                Local
              </label>
              <select
                value={filters.location}
                onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                className={SELECT}
              >
                <option value="all">Todos</option>
                {uniqueLocations.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                Departamento
              </label>
              <select
                value={filters.department}
                onChange={(e) => setFilters({ ...filters, department: e.target.value })}
                className={SELECT}
              >
                <option value="all">Todos</option>
                {uniqueDepartments.map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100">
            <button
              onClick={clearFilters}
              className="px-3 py-1.5 text-xs font-semibold text-gray-500 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Limpar Filtros
            </button>
          </div>
        </div>

        {/* ── Conteúdo do Relatório ── */}
        <div id="report-content">

          {/* RESUMO EXECUTIVO */}
          {viewMode === "summary" && (
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 sm:p-8">

              {/* Cabeçalho do relatório */}
              <div className="border-b border-gray-200 pb-5 mb-7">
                <h2 className="text-xl font-bold text-gray-800">Resumo Executivo</h2>
                <p className="text-xs text-gray-400 mt-1">
                  Gerado em:{" "}
                  {new Date().toLocaleDateString("pt-BR", {
                    day: "2-digit", month: "long", year: "numeric",
                    hour: "2-digit", minute: "2-digit",
                  })}
                </p>
                {(filters.startDate || filters.endDate) && (
                  <p className="text-xs text-gray-400 mt-0.5">
                    Período:{" "}
                    {filters.startDate ? new Date(filters.startDate).toLocaleDateString("pt-BR") : "Início"}
                    {" "}até{" "}
                    {filters.endDate   ? new Date(filters.endDate).toLocaleDateString("pt-BR")   : "Hoje"}
                  </p>
                )}
              </div>

              {/* Cards de estatísticas */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-7">
                {STAT_CARDS.map(({ key, label, icon: Icon, color, bg, border }) => (
                  <div
                    key={key}
                    className={`${bg} border ${border} rounded-xl p-4 flex items-center justify-between`}
                  >
                    <div>
                      <p className="text-xs text-gray-500 font-medium mb-1">{label}</p>
                      <p className={`text-2xl font-bold ${color}`}>
                        {filteredStats[key]}
                      </p>
                    </div>
                    <Icon size={22} className={`${color} opacity-60`} />
                  </div>
                ))}
              </div>

              {/* Insights rápidos */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-7">
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                  <p className="text-xs font-semibold text-blue-500 uppercase tracking-wide mb-1">
                    Departamento Mais Ativo
                  </p>
                  <p className="text-sm font-bold text-gray-800">
                    {Object.entries(meetingsByDepartment).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A"}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {Object.entries(meetingsByDepartment).sort((a, b) => b[1] - a[1])[0]?.[1] || 0} reuniões
                  </p>
                </div>

                <div className="bg-green-50 border border-green-100 rounded-xl p-4">
                  <p className="text-xs font-semibold text-green-500 uppercase tracking-wide mb-1">
                    Local Mais Utilizado
                  </p>
                  <p className="text-sm font-bold text-gray-800">
                    {Object.entries(meetingsByLocation).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A"}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {Object.entries(meetingsByLocation).sort((a, b) => b[1] - a[1])[0]?.[1] || 0} reuniões
                  </p>
                </div>
              </div>

              {/* Rodapé do relatório */}
              <div className="pt-5 border-t border-gray-100 text-center">
                <p className="text-xs text-gray-400">Sistema de Gestão de Reuniões — Relatório Confidencial</p>
                <p className="text-xs text-gray-300 mt-0.5">© {new Date().getFullYear()} · Todos os direitos reservados</p>
              </div>
            </div>
          )}

          {/* GRÁFICOS */}
          {viewMode === "charts" && (
            <ReportsCharts meetings={filteredMeetings} />
          )}

          {/* RELATÓRIO DETALHADO */}
          {viewMode === "detailed" && (
            <div className="space-y-5">

              {/* Por Departamento */}
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5">
                <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-4">
                  Reuniões por Departamento
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2.5 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Departamento</th>
                        <th className="text-center py-2.5 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Quantidade</th>
                        <th className="text-right py-2.5 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">%</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(meetingsByDepartment)
                        .sort((a, b) => b[1] - a[1])
                        .map(([dept, count]) => (
                          <tr key={dept} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                            <td className="py-2.5 px-3 text-gray-800">{dept}</td>
                            <td className="py-2.5 px-3 text-center font-semibold text-purple-600">{count}</td>
                            <td className="py-2.5 px-3 text-right text-gray-400 text-xs">
                              {((count / filteredStats.total) * 100).toFixed(1)}%
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Por Local */}
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5">
                <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-4">
                  Reuniões por Local
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2.5 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Local</th>
                        <th className="text-center py-2.5 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Quantidade</th>
                        <th className="text-right py-2.5 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">%</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(meetingsByLocation)
                        .sort((a, b) => b[1] - a[1])
                        .map(([location, count]) => (
                          <tr key={location} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                            <td className="py-2.5 px-3 text-gray-800">{location}</td>
                            <td className="py-2.5 px-3 text-center font-semibold text-green-600">{count}</td>
                            <td className="py-2.5 px-3 text-right text-gray-400 text-xs">
                              {((count / filteredStats.total) * 100).toFixed(1)}%
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Detalhamento completo */}
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5">
                <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-4">
                  Detalhamento Completo
                </h3>
                <div className="overflow-x-auto">
                  <div className="max-h-96 overflow-y-auto">
                    <table className="w-full text-sm">
                      <thead className="sticky top-0 bg-white">
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-2.5 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Data</th>
                          <th className="text-left py-2.5 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Título</th>
                          <th className="text-left py-2.5 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Local</th>
                          <th className="text-left py-2.5 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Responsável</th>
                          <th className="text-center py-2.5 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Part.</th>
                          <th className="text-center py-2.5 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredMeetings.map((meeting) => (
                          <tr key={meeting.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                            <td className="py-2.5 px-3 text-gray-600 whitespace-nowrap">
                              {new Date(meeting.meeting_date).toLocaleDateString("pt-BR")}
                            </td>
                            <td className="py-2.5 px-3 text-gray-800 font-medium">{meeting.title}</td>
                            <td className="py-2.5 px-3 text-gray-500">{meeting.location}</td>
                            <td className="py-2.5 px-3 text-gray-500">{meeting.responsible}</td>
                            <td className="py-2.5 px-3 text-center font-semibold text-gray-700">
                              {meeting.participants_count}
                            </td>
                            <td className="py-2.5 px-3 text-center">
                              <span
                                className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold
                                  ${meeting.status === "confirmed" ? "bg-green-100 text-green-700"
                                  : meeting.status === "pending"   ? "bg-yellow-100 text-yellow-700"
                                  :                                   "bg-red-100 text-red-700"}`}
                              >
                                {meeting.status === "confirmed" ? "Confirmada"
                                  : meeting.status === "pending" ? "Pendente"
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
}