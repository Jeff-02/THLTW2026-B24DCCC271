import React, { useEffect, useMemo, useState } from 'react';
import { Avatar, Button, Card, Col, Form, Input, InputNumber, Row, Select, Space, Statistic, Table, Tag, Typography, Upload } from 'antd';
import { DeleteOutlined, EditOutlined, UploadOutlined } from '@ant-design/icons';
import { Destination, defaultDestinations } from './Home';
import { ItineraryItem } from './Itinerary';

const storageKey = 'travelDestinations';

const loadDestinations = (): Destination[] => {
  try {
    const data = localStorage.getItem(storageKey);
    return data ? JSON.parse(data) : defaultDestinations;
  } catch {
    return defaultDestinations;
  }
};

const Admin: React.FC = () => {
  const [list, setList] = useState<Destination[]>(loadDestinations);
  const [editingId, setEditingId] = useState<string>('');
  const [form] = Form.useForm();

  // Load Itinerary Data for Statistics
  const itineraryData: ItineraryItem[] = useMemo(() => {
    try {
      const data = localStorage.getItem('travelItinerary');
      return data ? JSON.parse(data) : [];
    } catch { return []; }
  }, []);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(list));
  }, [list]);

  // Tính toán Thống kê nâng cao
  const stats = useMemo(() => {
    const currentMonth = new Date().getMonth();
    
    // 1. Số lượt lịch trình tạo trong tháng này
    const itinerariesThisMonth = itineraryData.filter(item => {
      return item.createdAt && new Date(item.createdAt).getMonth() === currentMonth;
    }).length;

    // 2. Tìm Địa điểm phổ biến nhất
    const destCount: Record<string, number> = {};
    itineraryData.forEach(item => destCount[item.destinationId] = (destCount[item.destinationId] || 0) + 1);
    const popularDestId = Object.keys(destCount).sort((a, b) => destCount[b] - destCount[a])[0];
    const popularDestName = list.find(d => d.id === popularDestId)?.name || 'Chưa có dữ liệu';

    // 3. Số tiền thu về theo hạng mục từ các lịch trình
    let food = 0, acc = 0, trans = 0;
    itineraryData.forEach(item => {
       const d = list.find(x => x.id === item.destinationId);
       if(d) {
          food += d.foodCost;
          acc += d.accommodationCost;
          trans += d.transportCost;
       }
    });

    return { 
      itinerariesThisMonth, 
      popularDestName, 
      totalMoney: food + acc + trans,
      food, acc, trans 
    };
  }, [list, itineraryData]);

  const handleEdit = (item: Destination) => {
    setEditingId(item.id);
    form.setFieldsValue({
      ...item,
      foodCost: Number(item.foodCost),
      accommodationCost: Number(item.accommodationCost),
      transportCost: Number(item.transportCost),
      visitDuration: Number(item.visitDuration),
      rating: Number(item.rating),
    });
  };

  const handleDelete = (id: string) => {
    setList((prev) => prev.filter((item) => item.id !== id));
    if (editingId === id) {
      setEditingId('');
      form.resetFields();
    }
  };

  // Hàm handle file upload thành base64 (đã fix type thành any để tránh lỗi TypeScript)
  const beforeUpload = (file: any) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      form.setFieldsValue({ image: reader.result as string });
    };
    return false; // Chặn upload mặc định của Ant Design
  };

  return (
    <div>
      <Typography.Title level={3}>Trang quản trị (Admin)</Typography.Title>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} md={6}>
          <Card><Statistic title={`Lượt lịch trình (Tháng ${new Date().getMonth() + 1})`} value={stats.itinerariesThisMonth} /></Card>
        </Col>
        <Col xs={24} md={6}>
          <Card><Statistic title="Địa điểm phổ biến nhất" value={stats.popularDestName} valueStyle={{fontSize: 20}} /></Card>
        </Col>
        <Col xs={24} md={12}>
          <Card>
            <Statistic title="Tổng doanh thu dự kiến (Tất cả lịch trình)" value={stats.totalMoney.toLocaleString('vi-VN')} suffix="VNĐ" />
            <Typography.Text type="secondary" style={{fontSize: 12}}>
              Ăn uống: {stats.food.toLocaleString('vi-VN')} | Lưu trú: {stats.acc.toLocaleString('vi-VN')} | Di chuyển: {stats.trans.toLocaleString('vi-VN')}
            </Typography.Text>
          </Card>
        </Col>
      </Row>

      <Card title={editingId ? 'Chỉnh sửa điểm đến' : 'Thêm điểm đến mới'} style={{ marginBottom: 24 }}>
        <Form form={form} layout="vertical" onFinish={(values) => {
          if (editingId) {
            setList(prev => prev.map(item => item.id === editingId ? { ...item, ...values, id: editingId } : item));
          } else {
            setList(prev => [...prev, { id: `dest-${Date.now()}`, ...values }]);
          }
          setEditingId('');
          form.resetFields();
        }}>
          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item name="name" label="Tên điểm đến" rules={[{ required: true }]}><Input /></Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item name="region" label="Vùng miền" rules={[{ required: true }]}> 
                <Select options={[{value: 'Miền Bắc'}, {value: 'Miền Trung'}, {value: 'Tây Nguyên'}, {value: 'Miền Nam'}]} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item name="category" label="Loại hình" rules={[{ required: true }]}> 
                <Select options={[{value: 'Bãi biển'}, {value: 'Đồi núi'}, {value: 'Thành phố'}, {value: 'Thác nước'}]} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={6}>
              <Form.Item name="foodCost" label="Phí Ăn uống" rules={[{ required: true }]}> 
                <InputNumber min={0} style={{ width: '100%' }} formatter={v => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
              </Form.Item>
            </Col>
            <Col xs={24} md={6}>
              <Form.Item name="accommodationCost" label="Phí Lưu trú" rules={[{ required: true }]}> 
                <InputNumber min={0} style={{ width: '100%' }} formatter={v => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
              </Form.Item>
            </Col>
            <Col xs={24} md={6}>
              <Form.Item name="transportCost" label="Phí Di chuyển" rules={[{ required: true }]}> 
                <InputNumber min={0} style={{ width: '100%' }} formatter={v => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
              </Form.Item>
            </Col>
            <Col xs={24} md={3}>
              <Form.Item name="visitDuration" label="Thời gian (Giờ)" rules={[{ required: true }]}> 
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xs={24} md={3}>
              <Form.Item name="rating" label="Rating" rules={[{ required: true }]}> 
                <InputNumber min={0} max={5} step={0.1} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item label="Hình ảnh (Nhập URL hoặc Tải lên)">
                {/* Đã thay bằng thẻ div flexbox để sửa lỗi Space.Compact */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Form.Item name="image" noStyle rules={[{ required: true, message: 'Vui lòng nhập URL hoặc tải ảnh lên' }]}>
                    <Input placeholder="URL hình ảnh" style={{ flex: 1 }} />
                  </Form.Item>
                  <Upload accept="image/*" showUploadList={false} beforeUpload={beforeUpload}>
                    <Button icon={<UploadOutlined />}>Tải ảnh</Button>
                  </Upload>
                </div>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="description" label="Mô tả" rules={[{ required: true }]}> 
                <Input placeholder="Mô tả ngắn gọn" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">{editingId ? 'Cập nhật' : 'Thêm mới'}</Button>
              {editingId && <Button onClick={() => { setEditingId(''); form.resetFields(); }}>Hủy</Button>}
            </Space>
          </Form.Item>
        </Form>
      </Card>

      <Card title="Danh sách điểm đến">
        <Table<Destination>
          rowKey="id"
          dataSource={list}
          pagination={{ pageSize: 6 }}
          scroll={{ x: 1000 }}
          columns={[
            { title: 'Ảnh', dataIndex: 'image', render: (src) => <Avatar shape="square" size={64} src={src} />, width: 90 },
            { title: 'Tên', dataIndex: 'name', sorter: (a, b) => a.name.localeCompare(b.name) },
            { title: 'Loại', dataIndex: 'category', render: (value) => <Tag>{value}</Tag> },
            { 
              title: 'Tổng chi phí', 
              render: (_, record) => `${(record.foodCost + record.accommodationCost + record.transportCost).toLocaleString('vi-VN')} đ` 
            },
            { title: 'Thời gian', dataIndex: 'visitDuration', render: (v) => `${v} giờ` },
            { title: 'Rating', dataIndex: 'rating' },
            {
              title: 'Thao tác',
              render: (_: any, record: Destination) => (
                <Space>
                  <Button icon={<EditOutlined />} size="small" onClick={() => handleEdit(record)}>Sửa</Button>
                  <Button icon={<DeleteOutlined />} danger size="small" onClick={() => handleDelete(record.id)}>Xóa</Button>
                </Space>
              ),
              width: 140,
            },
          ]}
        />
      </Card>
    </div>
  );
};

export default Admin;