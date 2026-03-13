export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  assignedTo: string;
  dueDate: string;
  priority: "low" | "medium" | "high";
}
