import { Moment } from 'moment';

export type TodoStatus = 'Cần làm' | 'Đang làm' | 'Hoàn thành';
export type TodoPriority = 'Cao' | 'Trung bình' | 'Thấp';

export interface TodoItem {
  id: string;
  title: string;
  description: string;
  deadline: string;
  priority: TodoPriority;
  tag: string;
  status: TodoStatus;
  createdAt: string;
}

export interface TodoFormValues {
  title: string;
  description: string;
  deadline: Moment;
  priority: TodoPriority;
  tag: string;
  status: TodoStatus;
}
