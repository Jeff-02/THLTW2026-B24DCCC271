import React, { useEffect } from 'react';
import { Button, DatePicker, Form, Input, Radio, Select, Space } from 'antd';
import moment, { Moment } from 'moment';
import { TodoFormValues, TodoItem, TodoPriority, TodoStatus } from './types';

interface FormTodoListProps {
	task?: TodoItem;
	onFinish: (values: TodoFormValues) => void;
	onCancel: () => void;
}

const priorityOptions: TodoPriority[] = ['Cao', 'Trung bình', 'Thấp'];
const statusOptions: TodoStatus[] = ['Cần làm', 'Đang làm', 'Hoàn thành'];

const FormTodoList: React.FC<FormTodoListProps> = ({ task, onFinish, onCancel }) => {
	const [form] = Form.useForm();

	useEffect(() => {
		form.setFieldsValue({
			title: task?.title || '',
			description: task?.description || '',
			deadline: task?.deadline ? moment(task.deadline, 'YYYY-MM-DD') : moment(),
			priority: task?.priority || 'Trung bình',
			tag: task?.tag || '',
			status: task?.status || 'Cần làm',
		});
	}, [task, form]);

	const initialValues = {
		title: task?.title || '',
		description: task?.description || '',
		deadline: task?.deadline ? moment(task.deadline, 'YYYY-MM-DD') : moment(),
		priority: task?.priority || 'Trung bình',
		tag: task?.tag || '',
		status: task?.status || 'Cần làm',
	};

	return (
		<Form
			layout='vertical'
			form={form}
			initialValues={initialValues}
			onFinish={(values) => {
				const payload: TodoFormValues = {
					...values,
					deadline: values.deadline as Moment,
				};
				onFinish(payload);
			}}
		>
			<Form.Item
				name='title'
				label='Tên task'
				rules={[{ required: true, message: 'Vui lòng nhập tên task' }]}
			>
				<Input placeholder='Nhập tên task' />
			</Form.Item>
			<Form.Item name='description' label='Mô tả'>
				<Input.TextArea rows={4} placeholder='Mô tả chi tiết task' />
			</Form.Item>
			<Form.Item
				name='deadline'
				label='Deadline'
				rules={[{ required: true, message: 'Vui lòng chọn deadline' }]}
			>
				<DatePicker style={{ width: '100%' }} format='YYYY-MM-DD' />
			</Form.Item>
			<Form.Item name='priority' label='Mức độ ưu tiên' rules={[{ required: true, message: 'Vui lòng chọn mức độ ưu tiên' }]}> 
				<Select options={priorityOptions.map((value) => ({ value, label: value }))} />
			</Form.Item>
			<Form.Item name='tag' label='Tag'>
				<Input placeholder='Nhập tag của task' />
			</Form.Item>
			<Form.Item name='status' label='Trạng thái'>
				<Radio.Group>
					{statusOptions.map((value) => (
						<Radio key={value} value={value}>
							{value}
						</Radio>
					))}
				</Radio.Group>
			</Form.Item>
			<Form.Item>
				<Space>
					<Button type='primary' htmlType='submit'>
						Lưu
					</Button>
					<Button onClick={onCancel}>Hủy</Button>
				</Space>
			</Form.Item>
		</Form>
	);
};

export default FormTodoList;
