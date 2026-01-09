interface Statistics {
  total: number;
  confirmed: number;
  pending: number;
  denied: number;
  upcoming: number;
  past: number;
}

interface StatisticsCardsProps {
  stats: Statistics | null;
}

export function StatisticsCards({ stats }: StatisticsCardsProps) {
  if (!stats) return null;

  const cards = [
    {
      label: 'Total',
      value: stats.total,
      gradient: 'from-blue-500 to-blue-600',
    },
    {
      label: 'Confirmadas',
      value: stats.confirmed,
      gradient: 'from-green-500 to-green-600',
    },
    {
      label: 'Pendentes',
      value: stats.pending,
      gradient: 'from-yellow-500 to-yellow-600',
    },
    {
      label: 'Negadas',
      value: stats.denied,
      gradient: 'from-red-500 to-red-600',
    },
    {
      label: 'Futuras',
      value: stats.upcoming,
      gradient: 'from-purple-500 to-purple-600',
    },
    {
      label: 'Passadas',
      value: stats.past,
      gradient: 'from-gray-500 to-gray-600',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
      {cards.map((card) => (
        <div
          key={card.label}
          className={`bg-gradient-to-br ${card.gradient} rounded-xl p-4 text-white shadow-lg hover:shadow-xl transition-shadow`}
        >
          <div className="text-2xl font-bold">{card.value}</div>
          <div className="text-sm opacity-90">{card.label}</div>
        </div>
      ))}
    </div>
  );
}