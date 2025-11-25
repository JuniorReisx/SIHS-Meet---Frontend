export interface Meeting {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  participants: string;
  description: string;
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
