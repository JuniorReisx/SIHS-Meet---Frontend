export interface Meeting {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  participants: string;
  description: string;
}


export interface Credentials {
  user: string;
  password: string;
  departments?: string;
}

