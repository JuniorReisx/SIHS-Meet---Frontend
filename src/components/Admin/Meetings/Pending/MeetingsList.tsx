import { Clock } from "lucide-react";
import { PendingMeetingCard } from "./MeetingCard";

// ─── Types ────────────────────────────────────────────────────────────────────

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

interface MeetingsListProps {
  meetings: Meeting[];
  onApprove: (id: number) => void;
  onDeny: (id: number) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function PendingMeetingsList({ meetings, onApprove, onDeny }: MeetingsListProps) {
  const safeMeetings = Array.isArray(meetings) ? meetings : [];

  if (safeMeetings.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
        <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-amber-50 flex items-center justify-center">
          <Clock size={28} className="text-amber-400" />
        </div>
        <p className="font-semibold text-gray-700 mb-1">Tudo em dia!</p>
        <p className="text-sm text-gray-400">Não há reuniões pendentes de aprovação no momento.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {safeMeetings.map((meeting) => (
        <PendingMeetingCard
          key={meeting.id}
          meeting={meeting}
          onApprove={onApprove}
          onDeny={onDeny}
        />
      ))}
    </div>
  );
}