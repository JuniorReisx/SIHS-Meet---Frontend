import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, CircleDot, BarChart3 } from 'lucide-react';
import type { Meeting } from '../../../types/types';

interface ReportsChartsProps {
  meetings: Meeting[];
}

export function ReportsCharts({ meetings }: ReportsChartsProps) {
  // Dados para gráfico de status
  const statusData = [
    { 
      name: 'Confirmadas', 
      value: meetings.filter(m => m.status === 'confirmed').length,
      color: '#10b981'
    },
    { 
      name: 'Pendentes', 
      value: meetings.filter(m => m.status === 'pending').length,
      color: '#f59e0b'
    },
    { 
      name: 'Negadas', 
      value: meetings.filter(m => m.status === 'denied').length,
      color: '#ef4444'
    }
  ];

  // Dados para gráfico de reuniões por departamento
  const departmentData = Object.entries(
    meetings.reduce((acc, meeting) => {
      const dept = meeting.responsible_department || "Sem departamento";
      acc[dept] = (acc[dept] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }))
   .sort((a, b) => b.value - a.value)
   .slice(0, 8); // Top 8 departamentos

  // Dados para gráfico de reuniões por local
  const locationData = Object.entries(
    meetings.reduce((acc, meeting) => {
      acc[meeting.location] = (acc[meeting.location] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }));

  // Dados para gráfico de linha - reuniões ao longo do tempo (últimos 30 dias)
  const getLast30DaysData = () => {
    const last30Days = [];
    const today = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const count = meetings.filter(m => {
        const meetingDate = new Date(m.meeting_date).toISOString().split('T')[0];
        return meetingDate === dateStr;
      }).length;
      
      last30Days.push({
        date: `${date.getDate()}/${date.getMonth() + 1}`,
        reuniões: count
      });
    }
    
    return last30Days;
  };

  const timelineData = getLast30DaysData();

  // Dados para gráfico de participantes por departamento
  const participantsData = Object.entries(
    meetings.reduce((acc, meeting) => {
      const dept = meeting.responsible_department || "Sem departamento";
      acc[dept] = (acc[dept] || 0) + meeting.participants_count;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }))
   .sort((a, b) => b.value - a.value)
   .slice(0, 8);

  return (
    <div className="space-y-8">
      {/* Gráfico de Pizza - Status das Reuniões */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <CircleDot className="text-purple-600" size={24} />
          Distribuição por Status
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>

            <Pie
              data={statusData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {statusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Gráfico de Barras - Reuniões por Departamento */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <BarChart3 className="text-blue-600" size={24} />
          Top Departamentos (Quantidade de Reuniões)
        </h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={departmentData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name" 
              angle={-45} 
              textAnchor="end" 
              height={100}
              interval={0}
            />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" name="Reuniões" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Gráfico de Linha - Timeline */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <TrendingUp className="text-green-600" size={24} />
          Reuniões nos Últimos 30 Dias
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={timelineData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="reuniões" 
              stroke="#10b981" 
              strokeWidth={2}
              dot={{ fill: '#10b981', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Gráfico de Barras - Total de Participantes por Departamento */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <BarChart3 className="text-purple-600" size={24} />
          Total de Participantes por Departamento
        </h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={participantsData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name" 
              angle={-45} 
              textAnchor="end" 
              height={100}
              interval={0}
            />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" name="Participantes" fill="#8b5cf6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Gráfico de Barras Horizontais - Reuniões por Local */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <BarChart3 className="text-orange-600" size={24} />
          Utilização de Salas
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={locationData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" width={150} />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" name="Reuniões" fill="#f97316" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}