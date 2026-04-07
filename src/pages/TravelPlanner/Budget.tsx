import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Button, Card, Col, Form, InputNumber, Row, Select, Statistic, Typography } from 'antd';
import { Pie, PieChart, ResponsiveContainer, Cell, Tooltip } from 'recharts';

interface BudgetItem {
  category: string;
  budget: number;
  spent: number;
}

const defaultBudget: BudgetItem[] = [
  { category: 'Ăn uống', budget: 4500000, spent: 3200000 },
  { category: 'Di chuyển', budget: 2800000, spent: 1900000 },
  { category: 'Lưu trú', budget: 7200000, spent: 6500000 },
  { category: 'Vui chơi', budget: 2600000, spent: 2200000 },
  { category: 'Dự phòng', budget: 1500000, spent: 900000 },
];

const colors = ['#1890ff', '#52c41a', '#faad14', '#f5222d', '#13c2c2'];
const storageKey = 'travelBudget';

const loadBudget = (): BudgetItem[] => {
  try {
    const data = localStorage.getItem(storageKey);
    return data ? JSON.parse(data) : defaultBudget;
  } catch {
    return defaultBudget;
  }
};

const saveBudget = (items: BudgetItem[]) => {
  localStorage.setItem(storageKey, JSON.stringify(items));
};

const Budget: React.FC = () => {
  const [items, setItems] = useState<BudgetItem[]>(loadBudget);
  const [form] = Form.useForm();

  useEffect(() => {
    saveBudget(items);
  }, [items]);

  const summary = useMemo(() => {
    const totalBudget = items.reduce((sum, item) => sum + item.budget, 0);
    const totalSpent = items.reduce((sum, item) => sum + item.spent, 0);
    return { totalBudget, totalSpent, difference: totalBudget - totalSpent };
  }, [items]);

  const onFinish = (values: { category: string; budget: number; spent: number }) => {
    setItems((prev) => prev.map((item) => (item.category === values.category ? { ...item, budget: values.budget, spent: values.spent } : item)));
  };

  return (
    <div>
      <Typography.Title level={3}>Quản lý ngân sách</Typography.Title>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} md={8}>
          <Card>
            <Statistic title="Tổng ngân sách" value={summary.totalBudget.toLocaleString('vi-VN')} suffix="VNĐ" />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card>
            <Statistic title="Đã chi" value={summary.totalSpent.toLocaleString('vi-VN')} suffix="VNĐ" />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card>
            <Statistic
              title="Còn lại"
              value={summary.difference.toLocaleString('vi-VN')}
              suffix="VNĐ"
              valueStyle={{ color: summary.difference < 0 ? '#cf1322' : '#3f8600' }}
            />
          </Card>
        </Col>
      </Row>

      {summary.difference < 0 && (
        <Alert
          message="Bạn đã vượt ngân sách!"
          description="Vui lòng điều chỉnh lại các khoản chi tiêu để tránh thâm hụt kế hoạch du lịch."
          type="warning"
          showIcon
          style={{ marginBottom: 24 }}
        />
      )}

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={12}>
          <Card title="Phân bổ ngân sách">
            <div style={{ width: '100%', height: 360 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={items} dataKey="spent" nameKey="category" cx="50%" cy="50%" innerRadius={70} outerRadius={110} paddingAngle={4} label>
                    {items.map((entry, index) => (
                      <Cell key={entry.category} fill={colors[index % colors.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Cập nhật ngân sách">
            <Form form={form} layout="vertical" initialValues={{ category: items[0]?.category, budget: items[0]?.budget, spent: items[0]?.spent }} onFinish={onFinish}>
              <Form.Item name="category" label="Danh mục" rules={[{ required: true }]}> 
                <Select onChange={(category: string) => {
                  const item = items.find((entry) => entry.category === category);
                  form.setFieldsValue({ budget: item?.budget ?? 0, spent: item?.spent ?? 0 });
                }}>
                  {items.map((item) => (
                    <Select.Option key={item.category} value={item.category}>{item.category}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item name="budget" label="Ngân sách" rules={[{ required: true, message: 'Nhập ngân sách' }]}> 
                <InputNumber min={0} style={{ width: '100%' }} formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
              </Form.Item>
              <Form.Item name="spent" label="Chi tiêu" rules={[{ required: true, message: 'Nhập chi tiêu' }]}> 
                <InputNumber min={0} style={{ width: '100%' }} formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" style={{ width: '100%' }}>Lưu thay đổi</Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Budget;
