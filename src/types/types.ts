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
}
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
