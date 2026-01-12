
export interface UserLoginCredentials {
  user: string;
  password: string;
}
export interface UserCredentials {
  user: string;
  password: string;
  departments: string;
}
export interface AdminLoginCredentials {
  user: string;
  password: string;
}
export interface AdminCredentials {
  user: string;
  password: string;
}




export interface Meeting {
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
  status?: 'confirmed' | 'pending' | 'denied';
}

export interface Statistics {
  total: number;
  confirmed: number;
  pending: number;
  denied: number;
  upcoming: number;
  past: number;
}

export type TabType = "total" | "confirmed" | "pending" | "denied";

export type FilterType = "all" | "last-10-days" | "last-20-days" | "last-month" | "last-year" | "upcoming" | "past" | "custom" | "month";

export interface MeetingFormData {
  title: string;
  meeting_date: string;
  start_time: string;
  end_time: string;
  location: string;
  participants_count: number;
  description: string;
  responsible: string;
  responsible_department: string;
}

export interface ReportFilters {
  startDate: string;
  endDate: string;
  status: string;
  location: string;
  department: string;
}