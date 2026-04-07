import React, { useEffect, useMemo, useState } from 'react';
import { Button, Card, Col, Form, Input, InputNumber, Row, Select, Space, Table, Typography } from 'antd';
import { ArrowDownOutlined, ArrowUpOutlined, DeleteOutlined } from '@ant-design/icons';
import { Destination, defaultDestinations } from './Home';

export interface ItineraryItem {
  id: string;
  day: number;
  destinationId: string;
  note: string;
  createdAt: string; // Thêm trường này để phục vụ thống kê Admin
}

const destinationStorageKey = 'travelDestinations';
const storageKey = 'travelItinerary';

const loadDestinations = (): Destination[] => {
  try {
    const storage = localStorage.getItem(destinationStorageKey);
    return storage ? JSON.parse(storage) : defaultDestinations;
  } catch {
    return defaultDestinations;
  }
};

const loadItinerary = (): ItineraryItem[] => {
  try {
    const data = localStorage.getItem(storageKey);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const Itinerary: React.FC = () => {
  const [list, setList] = useState<ItineraryItem[]>(loadItinerary);
  const [destinations] = useState<Destination[]>(loadDestinations);
  const [form] = Form.useForm();

  const destinationMap = useMemo(
    () => destinations.reduce<Record<string, Destination>>((map, item) => {
      map[item.id] = item;
      return map;
    }, {}),
    [destinations],
  );

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(list));
  }, [list]);

  const byDay = useMemo(() => [...list].sort((a, b) => a.day - b.day), [list]);

  const summary = useMemo(() => {
    let totalCost = 0;
    let totalTime = 0;
    
    byDay.forEach(item => {
      const dest = destinationMap[item.destinationId];
      if (dest) {
        totalCost += dest.foodCost + dest.accommodationCost + dest.transportCost;
        totalTime += dest.visitDuration; // Lấy trực tiếp từ database
      }
    });
    return { totalCost, totalTime };
  }, [byDay, destinationMap]);

  const moveItem = (id: string, direction: 'up' | 'down') => {
    setList((prev) => {
      const index = prev.findIndex((item) => item.id === id);
      if (index === -1) return prev;
      const newList = [...prev];
      const swapIndex = direction === 'up' ? index - 1 : index + 1;
      if (swapIndex < 0 || swapIndex >= newList.length) return prev;
      [newList[index], newList[swapIndex]] = [newList[swapIndex], newList[index]];
      return newList;
    });
  };

  const columns = [
    { title: 'Ngày', dataIndex: 'day', width: 80 },
    {
      title: 'Điểm đến', dataIndex: 'destinationId',
      render: (id: string) => destinationMap[id]?.name || 'Chưa chọn',
    },
    {
      title: 'Chi phí dự kiến', dataIndex: 'destinationId',
      render: (id: string) => {
        const d = destinationMap[id];
        return d ? `${(d.foodCost + d.accommodationCost + d.transportCost).toLocaleString('vi-VN')} VNĐ` : '-';
      }, 
    },
    {
      title: 'TG Tham quan', dataIndex: 'destinationId',
      render: (id: string) => destinationMap[id] ? `${destinationMap[id].visitDuration} giờ` : '-', 
    },
    { title: 'Ghi chú', dataIndex: 'note', ellipsis: true },
    {
      title: 'Hành động',
      render: (_: any, record: ItineraryItem) => (
        <Space>
          <Button icon={<ArrowUpOutlined />} size="small" disabled={record.day === 1} onClick={() => moveItem(record.id, 'up')} />
          <Button icon={<ArrowDownOutlined />} size="small" disabled={record.day === byDay.length} onClick={() => moveItem(record.id, 'down')} />
          <Button icon={<DeleteOutlined />} danger size="small" onClick={() => setList((prev) => prev.filter((item) => item.id !== record.id))} />
        </Space>
      ),
      width: 130,
    },
  ];

  return (
    <div>
      <Typography.Title level={3}>Tạo lịch trình du lịch</Typography.Title>

      <Card style={{ marginBottom: 24 }}>
        <Form form={form} layout="vertical" onFinish={(values) => {
          setList((prev) => [
            ...prev,
            {
              id: `itinerary-${Date.now()}`,
              day: values.day,
              destinationId: values.destination,
              note: values.note || '',
              createdAt: new Date().toISOString() // Thêm ngày tạo để tính số lượt theo tháng
            },
          ].sort((a, b) => a.day - b.day));
          form.resetFields();
        }}>
          <Row gutter={16}>
            <Col xs={24} sm={8}>
              <Form.Item name="day" label="Ngày" rules={[{ required: true, message: 'Chọn ngày' }]}> 
                <InputNumber min={1} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={10}>
              <Form.Item name="destination" label="Chọn điểm đến" rules={[{ required: true, message: 'Chọn điểm đến' }]}> 
                <Select placeholder="Chọn điểm đến">
                  {destinations.map((item) => (
                    <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={6}>
              <Form.Item label=" "> 
                <Button type="primary" htmlType="submit" style={{ width: '100%' }}>Thêm vào lịch trình</Button>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24}>
              <Form.Item name="note" label="Ghi chú">
                <Input.TextArea rows={1} placeholder="Ghi chú thêm" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} md={12}>
          <Card>
            <Typography.Text>Chi phí tổng dự kiến</Typography.Text>
            <Typography.Title level={3} style={{ marginTop: 8 }}>{summary.totalCost.toLocaleString('vi-VN')} VNĐ</Typography.Title>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card>
            <Typography.Text>Thời gian tham quan tổng cộng</Typography.Text>
            <Typography.Title level={3} style={{ marginTop: 8 }}>{summary.totalTime} giờ</Typography.Title>
          </Card>
        </Col>
      </Row>

      <Card title="Lịch trình theo ngày">
        <Table<ItineraryItem>
          rowKey="id"
          dataSource={byDay}
          columns={columns}
          pagination={false}
          locale={{ emptyText: 'Chưa có điểm đến nào trong lịch trình.' }}
          scroll={{ x: 600 }}
        />
      </Card>
    </div>
  );
};

export default Itinerary;