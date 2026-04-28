import React from 'react';
import { Card, Col, Row, Typography } from 'antd';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { FireTwoTone, LineChartOutlined, ThunderboltOutlined, TrophyOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const summaryCards = [
  {
    title: 'Tổng buổi tập',
    value: 16,
    icon: <ThunderboltOutlined style={{ color: '#1890ff', fontSize: 24 }} />,
  },
  {
    title: 'Tổng calo đốt',
    value: '4.320 kcal',
    icon: <FireTwoTone twoToneColor="#fa541c" style={{ fontSize: 24 }} />,
  },
  {
    title: 'Ngày tập liên tiếp',
    value: '5 ngày',
    icon: <LineChartOutlined style={{ color: '#52c41a', fontSize: 24 }} />,
  },
  {
    title: 'Tiến độ mục tiêu',
    value: '80%',
    icon: <TrophyOutlined style={{ color: '#faad14', fontSize: 24 }} />,
  },
];

const chartData = [
  { day: 'T2', calories: 420 },
  { day: 'T3', calories: 380 },
  { day: 'T4', calories: 450 },
  { day: 'T5', calories: 300 },
  { day: 'T6', calories: 520 },
  { day: 'T7', calories: 610 },
  { day: 'CN', calories: 490 },
];

const recentWorkouts = [
  { date: '28/04/2026', title: 'Tập ngực và tay sau', detail: '60 phút, 520 kcal' },
  { date: '27/04/2026', title: 'Chạy bộ ngoài trời', detail: '45 phút, 380 kcal' },
  { date: '26/04/2026', title: 'Yoga thư giãn', detail: '40 phút, 180 kcal' },
  { date: '25/04/2026', title: 'Circuit HIIT', detail: '30 phút, 420 kcal' },
  { date: '24/04/2026', title: 'Đạp xe', detail: '50 phút, 360 kcal' },
];

const TrangChu: React.FC = () => {
  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={2}>Dashboard</Title>
        <Text type="secondary">Tổng quan sức khỏe và tiến độ tập luyện của bạn.</Text>
      </div>

      <Row gutter={[24, 24]}>
        {summaryCards.map((card) => (
          <Col xs={24} sm={12} md={6} key={card.title}>
            <Card>
              <Title level={5}>{card.title}</Title>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text strong style={{ fontSize: 24 }}>{card.value}</Text>
                {card.icon}
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={16}>
          <Card title="Calo tiêu hao trong tuần">
            <ResponsiveContainer width="100%" height={320}>
              <AreaChart data={chartData} margin={{ top: 20, right: 20, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id="caloGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1890ff" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#1890ff" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Area type="monotone" dataKey="calories" stroke="#1890ff" fill="url(#caloGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card title="Buổi tập gần nhất">
            {recentWorkouts.map((item) => (
              <div key={item.date} style={{ marginBottom: 16 }}>
                <Text strong>{item.date}</Text>
                <div>
                  <Text>{item.title}</Text>
                </div>
                <Text type="secondary">{item.detail}</Text>
              </div>
            ))}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default TrangChu;
