import React, { useEffect, useMemo, useState } from 'react';
import { Button, Card, Col, Form, Input, InputNumber, Modal, Progress, Row, Space, Table, Tag, Typography, message } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import moment from 'moment';

const { Title, Text } = Typography;

interface HealthRecord {
  id: string;
  date: string;
  weight: number;
  height: number;
  heartRate: number;
  sleepHours: number;
  notes: string;
}

const STORAGE_KEY = 'fitnessHealthLog';

const initialData: HealthRecord[] = [
  {
    id: '1',
    date: moment().subtract(1, 'days').format('YYYY-MM-DD'),
    weight: 68,
    height: 173,
    heartRate: 62,
    sleepHours: 7,
    notes: 'Ngủ tốt, ăn uống cân bằng.',
  },
  {
    id: '2',
    date: moment().subtract(2, 'days').format('YYYY-MM-DD'),
    weight: 68.2,
    height: 173,
    heartRate: 64,
    sleepHours: 6.5,
    notes: 'Cảm thấy hơi mệt sau buổi tập.',
  },
  {
    id: '3',
    date: moment().subtract(3, 'days').format('YYYY-MM-DD'),
    weight: 67.9,
    height: 173,
    heartRate: 60,
    sleepHours: 8,
    notes: 'Tinh thần tốt.',
  },
];

const calculateBMI = (weight: number, height: number) => {
  const m = height / 100;
  return weight > 0 && m > 0 ? Number((weight / (m * m)).toFixed(1)) : 0;
};

const getBMICategory = (bmi: number) => {
  if (bmi < 18.5) return { label: 'Thiếu cân', color: 'blue' };
  if (bmi < 25) return { label: 'Bình thường', color: 'green' };
  if (bmi < 30) return { label: 'Thừa cân', color: 'gold' };
  return { label: 'Béo phì', color: 'red' };
};

const HealthLog: React.FC = () => {
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<HealthRecord | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setRecords(JSON.parse(stored));
    } else {
      setRecords(initialData);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  }, [records]);

  const latestBMI = useMemo(() => {
    if (records.length === 0) return 0;
    const latest = records[0];
    return calculateBMI(latest.weight, latest.height);
  }, [records]);

  const bmiCategory = getBMICategory(latestBMI);

  const handleOpenModal = (record?: HealthRecord) => {
    if (record) {
      setEditingRecord(record);
      form.setFieldsValue(record);
    } else {
      setEditingRecord(null);
      form.resetFields();
    }
    setModalVisible(true);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const payload: HealthRecord = {
        id: editingRecord ? editingRecord.id : Date.now().toString(),
        date: values.date,
        weight: values.weight,
        height: values.height,
        heartRate: values.heartRate,
        sleepHours: values.sleepHours,
        notes: values.notes || '',
      };
      const updated = editingRecord
        ? records.map((record) => (record.id === editingRecord.id ? payload : record))
        : [payload, ...records];
      setRecords(updated);
      setModalVisible(false);
      message.success(editingRecord ? 'Cập nhật chỉ số sức khỏe thành công' : 'Thêm chỉ số sức khỏe thành công');
      form.resetFields();
    } catch (error) {
      // validation error
    }
  };

  const handleDelete = (id: string) => {
    setRecords(records.filter((record) => record.id !== id));
    message.success('Xóa chỉ số sức khỏe thành công');
  };

  const columns = [
    {
      title: 'Ngày',
      dataIndex: 'date',
      key: 'date',
      sorter: (a: HealthRecord, b: HealthRecord) => moment(a.date).unix() - moment(b.date).unix(),
    },
    {
      title: 'Cân nặng (kg)',
      dataIndex: 'weight',
      key: 'weight',
      align: 'center' as const,
    },
    {
      title: 'Chiều cao (cm)',
      dataIndex: 'height',
      key: 'height',
      align: 'center' as const,
    },
    {
      title: 'BMI',
      key: 'bmi',
      align: 'center' as const,
      render: (_: any, record: HealthRecord) => {
        const bmi = calculateBMI(record.weight, record.height);
        const category = getBMICategory(bmi);
        return <Tag color={category.color}>{bmi} ({category.label})</Tag>;
      },
    },
    {
      title: 'Nhịp tim (bpm)',
      dataIndex: 'heartRate',
      key: 'heartRate',
      align: 'center' as const,
    },
    {
      title: 'Giờ ngủ',
      dataIndex: 'sleepHours',
      key: 'sleepHours',
      align: 'center' as const,
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: HealthRecord) => (
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
        <Title level={3}>Nhật ký chỉ số sức khỏe</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => handleOpenModal()}>
          Thêm chỉ số sức khỏe
        </Button>
      </Row>

      <Card style={{ marginBottom: 24 }}>
        <Row gutter={[24, 24]}>
          <Col xs={24} md={8}>
            <Text strong>Chỉ số BMI hiện tại</Text>
            <div style={{ marginTop: 12 }}>
              <Tag color={bmiCategory.color} style={{ fontSize: 16, padding: '8px 12px' }}>
                {latestBMI} - {bmiCategory.label}
              </Tag>
            </div>
          </Col>
          <Col xs={24} md={8}>
            <Text strong>Lượt ghi nhận</Text>
            <div style={{ marginTop: 12 }}>
              <Text>{records.length} lần</Text>
            </div>
          </Col>
          <Col xs={24} md={8}>
            <Text strong>Giấc ngủ trung bình</Text>
            <div style={{ marginTop: 12 }}>
              <Text>{records.length ? (records.reduce((sum, item) => sum + item.sleepHours, 0) / records.length).toFixed(1) : 0} giờ</Text>
            </div>
          </Col>
        </Row>
      </Card>

      <Card>
        <Table dataSource={records} columns={columns} rowKey="id" pagination={{ pageSize: 8 }} />
      </Card>

      <Modal
        title={editingRecord ? 'Cập nhật chỉ số sức khỏe' : 'Thêm chỉ số sức khỏe mới'}
        visible={modalVisible}
        onOk={handleSave}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
          setEditingRecord(null);
        }}
        width={700}
      >
        <Form form={form} layout="vertical" initialValues={{ date: moment().format('YYYY-MM-DD'), weight: 65, height: 170, heartRate: 60, sleepHours: 7 }}>
          <Form.Item name="date" label="Ngày" rules={[{ required: true, message: 'Vui lòng nhập ngày' }]}>
            <Input placeholder="YYYY-MM-DD" />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="weight" label="Cân nặng (kg)" rules={[{ required: true, message: 'Vui lòng nhập cân nặng' }]}>
                <InputNumber min={20} max={200} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="height" label="Chiều cao (cm)" rules={[{ required: true, message: 'Vui lòng nhập chiều cao' }]}>
                <InputNumber min={100} max={250} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="heartRate" label="Nhịp tim nghỉ (bpm)" rules={[{ required: true, message: 'Vui lòng nhập nhịp tim' }]}>
                <InputNumber min={30} max={200} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="sleepHours" label="Giờ ngủ" rules={[{ required: true, message: 'Vui lòng nhập giờ ngủ' }]}>
                <InputNumber min={0} max={24} step={0.5} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="notes" label="Ghi chú">
            <Input.TextArea rows={4} placeholder="Nhập ghi chú" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default HealthLog;
