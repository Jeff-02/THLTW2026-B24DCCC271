declare module TodoList {
	export type TodoPriority = 'Cao' | 'Trung bình' | 'Thấp';
	export type TodoStatus = 'Cần làm' | 'Đang làm' | 'Hoàn thành';

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
		deadline: moment.Moment;
		priority: TodoPriority;
		tag: string;
		status: TodoStatus;
	}
}
