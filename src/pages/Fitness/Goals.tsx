import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Drawer, Form, Input, InputNumber, Progress, Row, Select, Space, Tag, Typography, Popconfirm, message } from 'antd';
import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import moment from 'moment';

const { Title, Text } = Typography;

interface GoalItem {
  id: string;
  title: string;
  type: string;
  target: string;
  progress: number;
  currentValue: number;
  deadline: string;
  status: string;
}

const STORAGE_KEY = 'fitnessGoals';
const GOAL_TYPES = ['Giảm cân', 'Tăng cơ', 'Cải thiện sức bền', 'Tăng sức mạnh'];
const STATUS_LIST = ['Đang thực hiện', 'Đã đạt', 'Đã hủy'];

const initialGoals: GoalItem[] = [
  {
    id: 'goal-1',
    title: 'Giảm cân 3kg',
    type: 'Giảm cân',
    target: '65kg',
    progress: 70,
    currentValue: 67,
    deadline: moment().add(20, 'days').format('YYYY-MM-DD'),
    status: 'Đang thực hiện',
  },
  {
    id: 'goal-2',
    title: 'Tăng cơ tay',
    type: 'Tăng cơ',
    target: 'Cơ bắp săn chắc',
    progress: 40,
    currentValue: 40,
    deadline: moment().add(45, 'days').format('YYYY-MM-DD'),
    status: 'Đang thực hiện',
  },
];

const Goals: React.FC = () => {
  const [goals, setGoals] = useState<GoalItem[]>([]);
  const [filterStatus, setFilterStatus] = useState<string | undefined>(undefined);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [editingGoal, setEditingGoal] = useState<GoalItem | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setGoals(JSON.parse(stored));
    } else {
      setGoals(initialGoals);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialGoals));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
  }, [goals]);

  const filteredGoals = filterStatus ? goals.filter((goal) => goal.status === filterStatus) : goals;

  const openDrawer = (goal?: GoalItem) => {
    if (goal) {
      setEditingGoal(goal);
      form.setFieldsValue(goal);
    } else {
      setEditingGoal(null);
      form.resetFields();
    }
    setDrawerVisible(true);
  };

  const saveGoal = async () => {
    try {
      const values = await form.validateFields();
      const newGoal: GoalItem = {
        id: editingGoal ? editingGoal.id : Date.now().toString(),
        title: values.title,
        type: values.type,
        target: values.target,
        progress: values.progress,
        currentValue: values.currentValue,
        deadline: values.deadline,
        status: values.status,
      };
      const updated = editingGoal
        ? goals.map((goal) => (goal.id === editingGoal.id ? newGoal : goal))
        : [newGoal, ...goals];
      setGoals(updated);
      setDrawerVisible(false);
      form.resetFields();
      message.success(editingGoal ? 'Cập nhật mục tiêu thành công' : 'Thêm mục tiêu thành công');
    } catch (error) {
      // validation
    }
  };

  const deleteGoal = (id: string) => {
    setGoals(goals.filter((goal) => goal.id !== id));
    message.success('Xóa mục tiêu thành công');
  };

  const statusColor = (status: string) => {
    switch (status) {
      case 'Đã đạt':
        return 'green';
      case 'Đã hủy':
        return 'red';
      default:
        return 'blue';
    }
  };

  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Title level={3}>Quản lý mục tiêu</Title>
        <Space>
          <Select
            placeholder="Lọc trạng thái"
            value={filterStatus}
            onChange={setFilterStatus}
            allowClear
            style={{ minWidth: 180 }}
          >
            {STATUS_LIST.map((status) => (
              <Select.Option key={status} value={status}>
                {status}
              </Select.Option>
            ))}
          </Select>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => openDrawer()}>
            Thêm mục tiêu
          </Button>
        </Space>
      </Row>

      <Row gutter={[24, 24]}>
        {filteredGoals.map((goal) => (
          <Col xs={24} sm={12} lg={8} key={goal.id}>
            <Card
              title={goal.title}
              actions={[
                <Button type="link" icon={<EditOutlined />} onClick={() => openDrawer(goal)}>
                  Sửa
                </Button>,
              ]}
            >
              <Space direction="vertical" style={{ width: '100%' }}>
                <Text>
                  <strong>Loại:</strong> {goal.type}
                </Text>
                <Text>
                  <strong>Mục tiêu:</strong> {goal.target}
                </Text>
                <Text>
                  <strong>Deadline:</strong> {goal.deadline}
                </Text>
                <Space size="small">
                  <Text>
                    <strong>Hiện tại:</strong> {goal.currentValue}
                  </Text>
                  <Tag color={statusColor(goal.status)}>{goal.status}</Tag>
                </Space>
                <Progress percent={goal.progress} status={goal.progress >= 100 ? 'success' : 'active'} />
                <Popconfirm
                  title="Bạn có chắc muốn xóa mục tiêu này?"
                  onConfirm={() => deleteGoal(goal.id)}
                  okText="Có"
                  cancelText="Không"
                >
                  <Button type="link" danger>
                    Xóa mục tiêu
                  </Button>
                </Popconfirm>
              </Space>
            </Card>
          </Col>
        ))}
      </Row>

      <Drawer
        title={editingGoal ? 'Cập nhật mục tiêu' : 'Thêm mục tiêu mới'}
        visible={drawerVisible}
        onClose={() => {
          setDrawerVisible(false);
          form.resetFields();
          setEditingGoal(null);
        }}
        width={520}
      >
        <Form form={form} layout="vertical" initialValues={{ type: GOAL_TYPES[0], status: STATUS_LIST[0], progress: 0, currentValue: 0, deadline: moment().add(30, 'days').format('YYYY-MM-DD') }}>
          <Form.Item name="title" label="Tên mục tiêu" rules={[{ required: true, message: 'Vui lòng nhập tên mục tiêu' }]}>
            <Input placeholder="Ví dụ: Giảm 3kg" />
          </Form.Item>
          <Form.Item name="type" label="Loại mục tiêu" rules={[{ required: true, message: 'Vui lòng chọn loại mục tiêu' }]}>
            <Select>
              {GOAL_TYPES.map((type) => (
                <Select.Option key={type} value={type}>
                  {type}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="target" label="Mục tiêu cụ thể" rules={[{ required: true, message: 'Vui lòng nhập mục tiêu' }]}>
            <Input placeholder="Ví dụ: 65kg hoặc Tăng sức mạnh" />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="currentValue" label="Giá trị hiện tại" rules={[{ required: true, message: 'Vui lòng nhập giá trị hiện tại' }]}>
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="progress" label="Tiến độ (%)" rules={[{ required: true, message: 'Vui lòng nhập tiến độ' }]}>
                <InputNumber min={0} max={100} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="deadline" label="Deadline" rules={[{ required: true, message: 'Vui lòng nhập deadline' }]}>
            <Input placeholder="YYYY-MM-DD" />
          </Form.Item>
          <Form.Item name="status" label="Trạng thái" rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}>
            <Select>
              {STATUS_LIST.map((status) => (
                <Select.Option key={status} value={status}>
                  {status}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
        <Space style={{ marginTop: 24 }}>
          <Button type="primary" onClick={saveGoal}>
            Lưu
          </Button>
          <Button onClick={() => {
            setDrawerVisible(false);
            form.resetFields();
            setEditingGoal(null);
          }}>
            Hủy
          </Button>
        </Space>
      </Drawer>
    </div>
  );
};

export default Goals;
