import React, { useMemo, useState } from 'react';
import { Badge, Card, Col, Input, Row, Select, Space, Tag, Typography } from 'antd';
import { StarFilled } from '@ant-design/icons';

export interface Destination {
  id: string;
  name: string;
  region: string;
  category: string;
  foodCost: number;
  accommodationCost: number;
  transportCost: number;
  visitDuration: number;
  rating: number;
  image: string;
  description: string;
}

export const defaultDestinations: Destination[] = [
  {
    id: 'da-nang', name: 'Đà Nẵng', region: 'Miền Trung', category: 'Bãi biển',
    foodCost: 300000, accommodationCost: 500000, transportCost: 180000, visitDuration: 4,
    rating: 4.8, image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80',
    description: 'Bãi biển Mỹ Khê, cầu Rồng và ẩm thực tuyệt vời.',
  },
  {
    id: 'phu-quoc', name: 'Phú Quốc', region: 'Miền Nam', category: 'Bãi biển',
    foodCost: 320000, accommodationCost: 620000, transportCost: 230000, visitDuration: 5,
    rating: 4.7, image: 'https://images.unsplash.com/photo-1493558103817-58b2924bce98?auto=format&fit=crop&w=900&q=80',
    description: 'Biển xanh trong, resort sang trọng và chợ đêm nhộn nhịp.',
  },
  {
    id: 'da-lat', name: 'Đà Lạt', region: 'Tây Nguyên', category: 'Đồi núi',
    foodCost: 250000, accommodationCost: 400000, transportCost: 170000, visitDuration: 5,
    rating: 4.6, image: 'https://images.unsplash.com/photo-1512345234105-1d1f3e0084a3?auto=format&fit=crop&w=900&q=80',
    description: 'Thung lũng mây, hoa và thời tiết mát mẻ quanh năm.',
  },
  {
    id: 'hanoi', name: 'Hà Nội', region: 'Miền Bắc', category: 'Thành phố',
    foodCost: 200000, accommodationCost: 350000, transportCost: 100000, visitDuration: 3,
    rating: 4.4, image: 'https://images.unsplash.com/photo-1562118294-7b78cd749b4b?auto=format&fit=crop&w=900&q=80',
    description: 'Thủ đô lịch sử với ẩm thực đường phố và văn hóa độc đáo.',
  },
  {
    id: 'cao-bang', name: 'Cao Bằng', region: 'Miền Bắc', category: 'Thác nước',
    foodCost: 220000, accommodationCost: 280000, transportCost: 160000, visitDuration: 4,
    rating: 4.5, image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=80',
    description: 'Phong cảnh thiên nhiên hoang sơ và hang động núi đá.',
  },
];

const storageKey = 'travelDestinations';

const loadDestinations = (): Destination[] => {
  try {
    const data = localStorage.getItem(storageKey);
    return data ? JSON.parse(data) : defaultDestinations;
  } catch {
    return defaultDestinations;
  }
};

const Home: React.FC = () => {
  const [destinations] = useState<Destination[]>(loadDestinations);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Tất cả');
  const [region, setRegion] = useState('Tất cả');
  const [sortBy, setSortBy] = useState('rating');

  const filtered = useMemo(() => {
    return destinations
      .filter((item) =>
        [item.name, item.region, item.category, item.description]
          .join(' ')
          .toLowerCase()
          .includes(search.trim().toLowerCase())
      )
      .filter((item) => (category === 'Tất cả' ? true : item.category === category))
      .filter((item) => (region === 'Tất cả' ? true : item.region === region))
      .sort((a, b) => {
        const costA = [a.foodCost, a.accommodationCost, a.transportCost].reduce((sum, value) => sum + (typeof value === 'number' ? value : 0), 0);
        const costB = [b.foodCost, b.accommodationCost, b.transportCost].reduce((sum, value) => sum + (typeof value === 'number' ? value : 0), 0);
        if (sortBy === 'price') return costA - costB;
        if (sortBy === 'rating') return b.rating - a.rating;
        return 0;
      });
  }, [destinations, search, category, region, sortBy]);

  const categories = ['Tất cả', 'Bãi biển', 'Đồi núi', 'Thành phố', 'Thác nước'];
  const regions = ['Tất cả', 'Miền Bắc', 'Miền Trung', 'Tây Nguyên', 'Miền Nam'];

  return (
    <div>
      <Typography.Title level={3}>Trang chủ - Khám phá điểm đến</Typography.Title>

      <Card style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]}> 
          <Col xs={24} md={12} lg={10}>
            <Input.Search placeholder="Tìm điểm đến, vùng miền..." value={search} onChange={(e) => setSearch(e.target.value)} allowClear />
          </Col>
          <Col xs={12} sm={8} md={6} lg={4}>
            <Select value={category} onChange={setCategory} style={{ width: '100%' }} options={categories.map(c => ({label: c, value: c}))} />
          </Col>
          <Col xs={12} sm={8} md={6} lg={4}>
            <Select value={region} onChange={setRegion} style={{ width: '100%' }} options={regions.map(r => ({label: r, value: r}))} />
          </Col>
          <Col xs={24} sm={8} md={4} lg={6}>
            <Select value={sortBy} onChange={setSortBy} style={{ width: '100%' }}>
              <Select.Option value="rating">Sắp xếp: Đánh giá cao</Select.Option>
              <Select.Option value="price">Sắp xếp: Giá thấp</Select.Option>
            </Select>
          </Col>
        </Row>
      </Card>

      <Row gutter={[24, 24]}>
        {filtered.map((destination) => {
          const totalCost = [destination.foodCost, destination.accommodationCost, destination.transportCost].reduce((sum, value) => sum + (typeof value === 'number' ? value : 0), 0);
          return (
            <Col xs={24} sm={12} lg={8} key={destination.id}>
              <Card
                hoverable
                cover={
                  <img
                    alt={destination.name}
                    src={destination.image}
                    style={{ height: 210, objectFit: 'cover' }}
                    onError={(event) => {
                      (event.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80';
                    }}
                  />
                }
              >
                <Space direction="vertical" size={8} style={{ width: '100%' }}>
                  <Space wrap size={8}>
                    <Tag color="geekblue">{destination.category}</Tag>
                    <Tag color="green">{destination.region}</Tag>
                  </Space>
                  <Typography.Title level={4} style={{ margin: 0 }}>{destination.name}</Typography.Title>
                  <Typography.Text type="secondary" ellipsis>{destination.description}</Typography.Text>
                  <Space>
                    <StarFilled style={{ color: '#fadb14' }} />
                    <Typography.Text strong>{destination.rating.toFixed(1)}</Typography.Text>
                  </Space>
                  <Typography.Title level={5} style={{ marginBottom: 0 }}>
                    {totalCost ? `${totalCost.toLocaleString('vi-VN')} VNĐ / ngày` : 'Giá cập nhật'}
                  </Typography.Title>
                </Space>
              </Card>
            </Col>
          );
        })}
      </Row>

      {filtered.length === 0 && (
        <Card style={{ textAlign: 'center', marginTop: 24 }}>
          <Badge status="warning" text="Không tìm thấy điểm đến phù hợp." />
        </Card>
      )}
    </div>
  );
};

export default Home;