import React, { useEffect, useMemo, useState } from 'react';
import { Button, Card, Col, DatePicker, Form, Input, InputNumber, message, Modal, Row, Select, Space, Table, Tag, Typography } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import moment, { Moment } from 'moment';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

interface TrainingSession {
  id: string;
  date: string;
  exercise: string;
  type: string;
  duration: number;
  calories: number;
  notes: string;
  status: string;
}

const STORAGE_KEY = 'fitnessTrainingLog';
const EXERCISE_TYPES = ['Cardio', 'Strength', 'Yoga', 'HIIT', 'Other'];
const STATUS_OPTIONS = ['Hoàn thành', 'Đang thực hiện', 'Bỏ lỡ'];

const initialData: TrainingSession[] = [
  {
    id: '1',
    date: moment().subtract(1, 'days').format('YYYY-MM-DD'),
    exercise: 'Chạy bộ sáng',
    type: 'Cardio',
    duration: 45,
    calories: 380,
    notes: 'Chạy nhẹ tại công viên',
    status: 'Hoàn thành',
  },
  {
    id: '2',
    date: moment().subtract(2, 'days').format('YYYY-MM-DD'),
    exercise: 'Tạ ngực',
    type: 'Strength',
    duration: 60,
    calories: 520,
    notes: 'Tập gồm Bench Press và Push up',
    status: 'Hoàn thành',
  },
  {
    id: '3',
    date: moment().subtract(3, 'days').format('YYYY-MM-DD'),
    exercise: 'Yoga thư giãn',
    type: 'Yoga',
    duration: 40,
    calories: 180,
    notes: 'Tập giãn cơ và thở',
    status: 'Hoàn thành',
  },
  {
    id: '4',
    date: moment().subtract(5, 'days').format('YYYY-MM-DD'),
    exercise: 'Circuit HIIT',
    type: 'HIIT',
    duration: 30,
    calories: 420,
    notes: '6 bài tập liên tiếp',
    status: 'Hoàn thành',
  },
  {
    id: '5',
    date: moment().subtract(7, 'days').format('YYYY-MM-DD'),
    exercise: 'Xe đạp tại chỗ',
    type: 'Cardio',
    duration: 50,
    calories: 360,
    notes: 'Đạp nhẹ sau giờ làm',
    status: 'Hoàn thành',
  },
];

const TrainingLog: React.FC = () => {
  const [sessions, setSessions] = useState<TrainingSession[]>([]);
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<string | undefined>(undefined);
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>(undefined);
  const [dateRange, setDateRange] = useState<[Moment, Moment] | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingSession, setEditingSession] = useState<TrainingSession | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setSessions(JSON.parse(stored));
    } else {
      setSessions(initialData);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  }, [sessions]);

  const filteredSessions = useMemo(() => {
    return sessions.filter((session) => {
      const matchSearch = session.exercise.toLowerCase().includes(search.toLowerCase()) ||
        session.notes.toLowerCase().includes(search.toLowerCase());
      const matchType = !selectedType || session.type === selectedType;
      const matchStatus = !selectedStatus || session.status === selectedStatus;
      const matchDate = !dateRange || dateRange.length === 0 ||
        moment(session.date).isBetween(dateRange[0].startOf('day'), dateRange[1].endOf('day'), null, '[]');
      return matchSearch && matchType && matchStatus && matchDate;
    });
  }, [sessions, search, selectedType, selectedStatus, dateRange]);

  const handleOpenModal = (session?: TrainingSession) => {
    if (session) {
      setEditingSession(session);
      form.setFieldsValue({
        ...session,
        date: moment(session.date),
      });
    } else {
      setEditingSession(null);
      form.resetFields();
    }
    setModalVisible(true);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const payload: TrainingSession = {
        id: editingSession ? editingSession.id : Date.now().toString(),
        date: values.date.format('YYYY-MM-DD'),
        exercise: values.exercise,
        type: values.type,
        duration: values.duration,
        calories: values.calories,
        notes: values.notes || '',
        status: values.status,
      };
      const updated = editingSession
        ? sessions.map((session) => (session.id === editingSession.id ? payload : session))
        : [payload, ...sessions];
      setSessions(updated);
      setModalVisible(false);
      message.success(editingSession ? 'Cập nhật buổi tập thành công' : 'Thêm buổi tập thành công');
      form.resetFields();
    } catch (error) {
      // validation lỗi
    }
  };

  const handleDelete = (id: string) => {
    setSessions(sessions.filter((session) => session.id !== id));
    message.success('Xóa buổi tập thành công');
  };

  const columns = [
    {
      title: 'Ngày',
      dataIndex: 'date',
      key: 'date',
      sorter: (a: TrainingSession, b: TrainingSession) => moment(a.date).unix() - moment(b.date).unix(),
    },
    {
      title: 'Tên bài tập',
      dataIndex: 'exercise',
      key: 'exercise',
    },
    {
      title: 'Loại',
      dataIndex: 'type',
      key: 'type',
      filters: EXERCISE_TYPES.map((type) => ({ text: type, value: type })),
      onFilter: (value: string | number | boolean, record: TrainingSession) => record.type === value,
    },
    {
      title: 'Thời lượng (phút)',
      dataIndex: 'duration',
      key: 'duration',
      align: 'center' as const,
      sorter: (a: TrainingSession, b: TrainingSession) => a.duration - b.duration,
    },
    {
      title: 'Calo',
      dataIndex: 'calories',
      key: 'calories',
      align: 'center' as const,
      sorter: (a: TrainingSession, b: TrainingSession) => a.calories - b.calories,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const color = status === 'Hoàn thành' ? 'green' : status === 'Đang thực hiện' ? 'blue' : 'volcano';
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: TrainingSession) => (
        <Space>
          <Button type="link" icon={<EditOutlined />} onClick={() => handleOpenModal(record)}>
            Sửa
          </Button>
          <Button type="link" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)}>
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Title level={3}>Nhật ký tập luyện</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => handleOpenModal()}>
          Thêm buổi tập
        </Button>
      </Row>

      <Card style={{ marginBottom: 24 }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <Input
              placeholder="Tìm kiếm tên bài tập hoặc ghi chú"
              prefix={<SearchOutlined />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Col>
          <Col xs={24} md={8}>
            <Select
              placeholder="Lọc theo loại"
              value={selectedType}
              onChange={setSelectedType}
              allowClear
              style={{ width: '100%' }}
            >
              {EXERCISE_TYPES.map((type) => (
                <Select.Option key={type} value={type}>
                  {type}
                </Select.Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} md={8}>
            <Select
              placeholder="Lọc theo trạng thái"
              value={selectedStatus}
              onChange={setSelectedStatus}
              allowClear
              style={{ width: '100%' }}
            >
              {STATUS_OPTIONS.map((status) => (
                <Select.Option key={status} value={status}>
                  {status}
                </Select.Option>
              ))}
            </Select>
          </Col>
        </Row>

        <Row style={{ marginTop: 16 }}>
          <Col xs={24} md={12}>
            <RangePicker
              value={dateRange}
              onChange={(values) => setDateRange(values as [Moment, Moment] | null)}
              style={{ width: '100%' }}
            />
          </Col>
          <Col xs={24} md={12} style={{ textAlign: 'right' }}>
            <Button onClick={() => {
              setSearch('');
              setSelectedType(undefined);
              setSelectedStatus(undefined);
              setDateRange(null);
            }}>
              Xóa bộ lọc
            </Button>
          </Col>
        </Row>
      </Card>

      <Card>
        <Table
          dataSource={filteredSessions}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 8 }}
        />
      </Card>

      <Modal
        title={editingSession ? 'Cập nhật buổi tập' : 'Thêm buổi tập mới'}
        visible={modalVisible}
        onOk={handleSave}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
          setEditingSession(null);
        }}
        width={700}
      >
        <Form form={form} layout="vertical" initialValues={{ type: EXERCISE_TYPES[0], status: STATUS_OPTIONS[0], duration: 30, calories: 200 }}>
          <Form.Item name="date" label="Ngày tập" rules={[{ required: true, message: 'Vui lòng chọn ngày tập' }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="exercise" label="Tên bài tập" rules={[{ required: true, message: 'Vui lòng nhập tên bài tập' }]}>
            <Input placeholder="Ví dụ: Chạy bộ, Tạ ngực" />
          </Form.Item>
          <Form.Item name="type" label="Loại bài tập" rules={[{ required: true, message: 'Vui lòng chọn loại bài tập' }]}>
            <Select>
              {EXERCISE_TYPES.map((type) => (
                <Select.Option key={type} value={type}>
                  {type}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="duration" label="Thời lượng (phút)" rules={[{ required: true, message: 'Vui lòng nhập thời lượng' }]}>
                <InputNumber min={1} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="calories" label="Calo tiêu hao" rules={[{ required: true, message: 'Vui lòng nhập calo' }]}>
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="status" label="Trạng thái" rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}>
            <Select>
              {STATUS_OPTIONS.map((status) => (
                <Select.Option key={status} value={status}>
                  {status}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="notes" label="Ghi chú">
            <Input.TextArea rows={4} placeholder="Nhập ghi chú thêm" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TrainingLog;
