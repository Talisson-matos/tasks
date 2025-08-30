export interface Task {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
  isUrgent: boolean;
}

export interface Column {
  id: string;
  title: string;
  tasks: Task[];
}