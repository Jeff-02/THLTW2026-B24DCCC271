import { PlusOutlined } from '@ant-design/icons';
import { Button, Card, Col, Divider, Input, Modal, Radio, Row, Space, Statistic, Table, Tabs, Tag, Typography } from 'antd';
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd';
import moment from 'moment';
import { useEffect, useMemo, useState } from 'react';
import FormTodoList from './Form';
import TodoCard from './TodoItem';
import { TodoFormValues, TodoItem, TodoPriority, TodoStatus } from './types';

const { Title } = Typography;
const { TabPane } = Tabs;
const STORAGE_KEY = 'todolist-kanban';
const STATUS_LIST: TodoStatus[] = ['Cần làm', 'Đang làm', 'Hoàn thành'];
const STATUS_COLORS: Record<TodoStatus, string> = {
	'Cần làm': '#faad14',
	'Đang làm': '#1890ff',
	'Hoàn thành': '#52c41a',
};

const TodoList: React.FC = () => {
	const [tasks, setTasks] = useState<TodoItem[]>([]);
	const [visible, setVisible] = useState(false);
	const [editingTask, setEditingTask] = useState<TodoItem | undefined>();
	const [searchText, setSearchText] = useState('');
	const [statusFilter, setStatusFilter] = useState<TodoStatus | 'Tất cả'>('Tất cả');
	const [activeTab, setActiveTab] = useState('dashboard');

	const saveTasks = (updated: TodoItem[]) => {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
		setTasks(updated);
	};

	useEffect(() => {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (stored) {
			setTasks(JSON.parse(stored));
		} else {
			const initial: TodoItem[] = [
				{
					id: 'task-1',
					title: 'Lập kế hoạch học tập',
					description: 'Ghi lại các môn học và deadline quan trọng',
					deadline: moment().add(3, 'days').format('YYYY-MM-DD'),
					priority: 'Cao',
					tag: 'Học tập',
					status: 'Cần làm',
					createdAt: moment().format('YYYY-MM-DD'),
				},
				{
					id: 'task-2',
					title: 'Hoàn thành báo cáo',
					description: 'Tập trung viết phần kết luận và hiệu chỉnh nội dung',
					deadline: moment().add(1, 'days').format('YYYY-MM-DD'),
					priority: 'Trung bình',
					tag: 'Công việc',
					status: 'Đang làm',
					createdAt: moment().format('YYYY-MM-DD'),
				},
				{
					id: 'task-3',
					title: 'Kiểm tra bài tập cuối tuần',
					description: 'Đánh giá lại tiến trình và hoàn thành nhiệm vụ còn lại',
					deadline: moment().subtract(1, 'days').format('YYYY-MM-DD'),
					priority: 'Thấp',
					tag: 'Cá nhân',
					status: 'Hoàn thành',
					createdAt: moment().format('YYYY-MM-DD'),
				},
			];
			saveTasks(initial);
		}
	}, []);

	const totalTasks = tasks.length;
	const completedTasks = tasks.filter((item) => item.status === 'Hoàn thành').length;
	const overdueTasks = tasks.filter(
		(item) => moment(item.deadline, 'YYYY-MM-DD').isBefore(moment(), 'day') && item.status !== 'Hoàn thành',
	).length;
	const progress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

	const tasksByStatus = useMemo(
		() =>
			STATUS_LIST.reduce<Record<TodoStatus, TodoItem[]>>((acc, status) => {
				acc[status] = tasks.filter((task) => task.status === status);
				return acc;
			}, {
				'Cần làm': [],
				'Đang làm': [],
				'Hoàn thành': [],
			}),
		[tasks],
	);

	const filteredTasks = useMemo(() => {
		return tasks.filter((task) => {
			const matchesKeyword = task.title.toLowerCase().includes(searchText.toLowerCase());
			const matchesStatus = statusFilter === 'Tất cả' || task.status === statusFilter;
			return matchesKeyword && matchesStatus;
		});
	}, [searchText, statusFilter, tasks]);

	const handleDragEnd = (result: DropResult) => {
		if (!result.destination) return;
		const { source, destination } = result;
		if (source.droppableId === destination.droppableId) return;
		const sourceTasks = tasksByStatus[source.droppableId as TodoStatus];
		const task = sourceTasks[source.index];
		const updated = tasks.map((item) =>
			item.id === task.id ? { ...item, status: destination.droppableId as TodoStatus } : item,
		);
		saveTasks(updated);
	};

	const openCreateModal = () => {
		setEditingTask(undefined);
		setVisible(true);
	};

	const openEditModal = (task: TodoItem) => {
		setEditingTask(task);
		setVisible(true);
	};

	const handleDelete = (taskId: string) => {
		saveTasks(tasks.filter((task) => task.id !== taskId));
	};

	const handleSubmit = (values: TodoFormValues) => {
		const payload: TodoItem = {
			id: editingTask?.id || `task-${Date.now()}`,
			title: values.title,
			description: values.description,
			deadline: values.deadline.format('YYYY-MM-DD'),
			priority: values.priority,
			tag: values.tag,
			status: values.status,
			createdAt: editingTask?.createdAt || moment().format('YYYY-MM-DD'),
		};
		const updated = editingTask ? tasks.map((task) => (task.id === editingTask.id ? payload : task)) : [payload, ...tasks];
		saveTasks(updated);
		setVisible(false);
	};

	const columns = [
		{
			title: 'Tên task',
			dataIndex: 'title',
			key: 'title',
			render: (value: string) => <strong>{value}</strong>,
		},
		{
			title: 'Mô tả',
			dataIndex: 'description',
			key: 'description',
			ellipsis: true,
		},
		{
			title: 'Deadline',
			dataIndex: 'deadline',
			key: 'deadline',
			sorter: (a: TodoItem, b: TodoItem) =>
				moment(a.deadline, 'YYYY-MM-DD').diff(moment(b.deadline, 'YYYY-MM-DD')),
			render: (value: string) => moment(value, 'YYYY-MM-DD').format('DD/MM/YYYY'),
		},
		{
			title: 'Ưu tiên',
			dataIndex: 'priority',
			key: 'priority',
			render: (value: TodoPriority) => {
				const color = value === 'Cao' ? 'red' : value === 'Trung bình' ? 'orange' : 'green';
				return <span style={{ color }}>{value}</span>;
			},
		},
		{
			title: 'Tag',
			dataIndex: 'tag',
			key: 'tag',
			render: (value: string) => <Tag>{value}</Tag>,
		},
		{
			title: 'Trạng thái',
			dataIndex: 'status',
			key: 'status',
			render: (value: TodoStatus) => <Tag color={value === 'Hoàn thành' ? 'green' : value === 'Đang làm' ? 'blue' : 'gold'}>{value}</Tag>,
		},
		{
			title: 'Hành động',
			key: 'actions',
			render: (_: any, record: TodoItem) => (
				<Space>
					<Button type='link' onClick={() => openEditModal(record)}>
						Chỉnh sửa
					</Button>
					<Button type='link' danger onClick={() => handleDelete(record.id)}>
						Xóa
					</Button>
				</Space>
			),
		},
	];

	return (
		<div style={{ padding: 24, minHeight: '100vh', background: '#f0f2f5' }}>
			<Row justify='space-between' align='middle' style={{ marginBottom: 24 }}>
				<Col>
					<Title level={3}>Ứng dụng theo dõi công việc cá nhân</Title>
					<p>Quản lý task bằng Dashboard, Kanban board và danh sách chi tiết.</p>
				</Col>
				<Col>
					<Button type='primary' icon={<PlusOutlined />} onClick={openCreateModal}>
						Thêm task mới
					</Button>
				</Col>
			</Row>

			<Tabs activeKey={activeTab} onChange={(key) => setActiveTab(key)}>
				<TabPane tab='Dashboard' key='dashboard'>
					<Row gutter={16}>
						<Col xs={24} sm={12} md={8}>
							<Card>
								<Statistic title='Tổng số task' value={totalTasks} />
							</Card>
						</Col>
						<Col xs={24} sm={12} md={8}>
							<Card>
								<Statistic title='Hoàn thành' value={completedTasks} suffix={`/ ${totalTasks}`} />
							</Card>
						</Col>
						<Col xs={24} sm={12} md={8}>
							<Card>
								<Statistic title='Quá hạn' value={overdueTasks} />
							</Card>
						</Col>
					</Row>
					<Divider />
					<Card>
						<Title level={5}>Tiến độ tổng</Title>
						<div style={{ width: '100%', height: 12, background: '#f0f0f0', borderRadius: 8, overflow: 'hidden' }}>
							<div
								style={{ width: `${progress}%`, height: 12, backgroundColor: '#1890ff', transition: 'width 0.2s' }}
							/>
						</div>
						<p style={{ marginTop: 12 }}>{progress}% task đã hoàn thành</p>
					</Card>
				</TabPane>
				<TabPane tab='Kanban Board' key='kanban'>
					<DragDropContext onDragEnd={handleDragEnd}>
						<Row gutter={16}>
							{STATUS_LIST.map((status) => (
								<Col key={status} xs={24} md={8}>
									<Card
										title={
											<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
												<span>{status}</span>
												<Tag color={STATUS_COLORS[status]}>{tasksByStatus[status].length} task</Tag>
											</div>
										}
										bordered={false}
										headStyle={{ backgroundColor: '#fafafa', borderBottom: '1px solid #f0f0f0' }}
										bodyStyle={{ padding: 12 }}
									>
										<Droppable droppableId={status}>
											{(provided, snapshot) => (
												<div
													ref={provided.innerRef}
													{...provided.droppableProps}
													style={{
														minHeight: 280,
														background: snapshot.isDraggingOver ? '#f5f7ff' : '#ffffff',
														padding: 12,
														borderRadius: 12,
														border: snapshot.isDraggingOver ? '1px dashed #91d5ff' : '1px solid #f0f0f0',
														transition: 'background 0.2s ease',
													}}
											>
												{tasksByStatus[status].length === 0 ? (
													<div style={{ padding: 32, textAlign: 'center', color: '#999' }}>
														<p style={{ margin: 0 }}>Chưa có task trong cột này.</p>
													</div>
												) : (
													tasksByStatus[status].map((task, index) => (
														<Draggable key={task.id} draggableId={task.id} index={index}>
															{(dragProvided, dragSnapshot) => (
																<div
																			ref={dragProvided.innerRef}
																			{...dragProvided.draggableProps}
																			{...dragProvided.dragHandleProps}
																			style={{
																				marginBottom: 14,
																			boxShadow: dragSnapshot.isDragging ? '0 10px 24px rgba(0,0,0,0.16)' : '0 1px 6px rgba(0,0,0,0.08)',
																			borderRadius: 16,
																			background: dragSnapshot.isDragging ? '#fafafc' : '#fff',
																			...dragProvided.draggableProps.style,
																		}}
															>
																	<TodoCard task={task} onEdit={openEditModal} onDelete={handleDelete} />
																</div>
															)}
														</Draggable>
													))
												)}
												{provided.placeholder}
											</div>
											)}
											</Droppable>
									</Card>
								</Col>
							))}
						</Row>
					</DragDropContext>
				</TabPane>
				<TabPane tab='Danh sách task' key='list'>
					<Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
						<Col xs={24} md={12}>
							<Input.Search
								placeholder='Tìm theo tên task'
								allowClear
								onSearch={(value) => setSearchText(value)}
								value={searchText}
								onChange={(event) => setSearchText(event.target.value)}
							/>
						</Col>
						<Col xs={24} md={12}>
							<Radio.Group value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
								<Radio.Button value='Tất cả'>Tất cả</Radio.Button>
								{STATUS_LIST.map((status) => (
									<Radio.Button key={status} value={status}>
										{status}
									</Radio.Button>
								))}
							</Radio.Group>
						</Col>
					</Row>
					<Table rowKey='id' columns={columns} dataSource={filteredTasks} pagination={{ pageSize: 6 }} />
				</TabPane>
			</Tabs>

			<Modal
				destroyOnClose
				visible={visible}
				title={editingTask ? 'Chỉnh sửa task' : 'Thêm task mới'}
				footer={null}
				onCancel={() => setVisible(false)}
			>
				<FormTodoList task={editingTask} onFinish={handleSubmit} onCancel={() => setVisible(false)} />
			</Modal>
		</div>
	);
};

export default TodoList;
