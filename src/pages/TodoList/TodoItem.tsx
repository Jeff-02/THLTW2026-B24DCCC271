import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Badge, Card, Space, Tag, Tooltip, Typography } from 'antd';
import moment from 'moment';
import { TodoItem, TodoPriority } from './types';

const { Text, Paragraph } = Typography;
const priorityColors: Record<TodoPriority, string> = {
	Cao: '#f5222d',
	'Trung bình': '#fa8c16',
	Thấp: '#52c41a',
};

interface TodoCardProps {
	task: TodoItem;
	onEdit: (task: TodoItem) => void;
	onDelete: (taskId: string) => void;
}

const TodoCard: React.FC<TodoCardProps> = ({ task, onEdit, onDelete }) => {
	return (
		<Card size='small' style={{ borderRadius: 8 }} bodyStyle={{ padding: 16 }}>
			<Space direction='vertical' style={{ width: '100%' }}>
				<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
					<Text strong>{task.title}</Text>
					<Space>
						<Tooltip title='Chỉnh sửa'>
							<EditOutlined onClick={() => onEdit(task)} />
						</Tooltip>
						<Tooltip title='Xóa'>
							<DeleteOutlined onClick={() => onDelete(task.id)} style={{ color: '#f5222d' }} />
						</Tooltip>
					</Space>
				</div>
				<Paragraph style={{ margin: 0 }} ellipsis={{ rows: 2, tooltip: task.description }}>
					{task.description}
				</Paragraph>
				<Space wrap>
					<Tag color={priorityColors[task.priority]}>{task.priority}</Tag>
					<Tag color={task.status === 'Hoàn thành' ? 'green' : task.status === 'Đang làm' ? 'blue' : 'gold'}>
						{task.status}
					</Tag>
					<Badge color={task.tag ? '#722ed1' : 'gray'} text={task.tag || 'Không có tag'} />
				</Space>
				<div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
					<Text type={moment(task.deadline, 'YYYY-MM-DD').isBefore(moment(), 'day') ? 'danger' : 'secondary'}>
						Deadline: {moment(task.deadline, 'YYYY-MM-DD').format('DD/MM/YYYY')}
					</Text>
					<Text type='secondary'>{moment(task.createdAt, 'YYYY-MM-DD').format('DD/MM/YYYY')}</Text>
				</div>
			</Space>
		</Card>
	);
};

export default TodoCard;
