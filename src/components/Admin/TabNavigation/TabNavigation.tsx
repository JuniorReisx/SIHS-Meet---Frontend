import { CheckCircle, XCircle, Clock, List } from "lucide-react";

type TabType = "total" | "confirmed" | "pending" | "denied";

interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  totalCount: number;
  confirmedCount: number;
  pendingCount: number;
  deniedCount: number;
}

export function TabNavigation({
  activeTab,
  onTabChange,
  totalCount,
  confirmedCount,
  pendingCount,
  deniedCount,
}: TabNavigationProps) {
  return (
    <div className="mb-6">
      <div className="bg-white rounded-lg shadow-md p-1 inline-flex gap-1 flex-wrap">
        <button
          onClick={() => onTabChange("total")}
          className={`flex items-center gap-2 px-6 py-3 rounded-md font-semibold transition-all ${
            activeTab === "total"
              ? "bg-blue-600 text-white shadow-md"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <List size={20} />
          Todas
          <span className="ml-1 px-2 py-0.5 rounded-full text-xs bg-white/20">
            {totalCount}
          </span>
        </button>

        <button
          onClick={() => onTabChange("confirmed")}
          className={`flex items-center gap-2 px-6 py-3 rounded-md font-semibold transition-all ${
            activeTab === "confirmed"
              ? "bg-green-500 text-white shadow-md"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <CheckCircle size={20} />
          Confirmadas
          <span className="ml-1 px-2 py-0.5 rounded-full text-xs bg-white/20">
            {confirmedCount}
          </span>
        </button>

        <button
          onClick={() => onTabChange("pending")}
          className={`flex items-center gap-2 px-6 py-3 rounded-md font-semibold transition-all ${
            activeTab === "pending"
              ? "bg-yellow-500 text-white shadow-md"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <Clock size={20} />
          Pendentes
          <span className="ml-1 px-2 py-0.5 rounded-full text-xs bg-white/20">
            {pendingCount}
          </span>
        </button>

        <button
          onClick={() => onTabChange("denied")}
          className={`flex items-center gap-2 px-6 py-3 rounded-md font-semibold transition-all ${
            activeTab === "denied"
              ? "bg-red-500 text-white shadow-md"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <XCircle size={20} />
          Negadas
          <span className="ml-1 px-2 py-0.5 rounded-full text-xs bg-white/20">
            {deniedCount}
          </span>
        </button>
      </div>
    </div>
  );
}