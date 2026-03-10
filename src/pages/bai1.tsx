import React, { useState } from 'react';
import { Card, Button, Typography, Space, Table, Tag, message } from 'antd';

const { Title, Text } = Typography;

interface VanDau {
  lan: number;
  nguoiChon: string;
  mayChon: string;
  ketQua: string;
}

const Bai1: React.FC = () => {
  const [lichSu, setLichSu] = useState<VanDau[]>([]);
  const [soTran, setSoTran] = useState(0);

  const danhSachLuaChon = [
    { id: 'Keo', ten: 'Kéo' },
    { id: 'Bua', ten: 'Búa' },
    { id: 'Bao', ten: 'Bao' }
  ];

  const xuLyChoi = (luaChonCuaNguoi: string) => {
    let soNgauNhien = Math.floor(Math.random() * 3);
    let luaChonCuaMay = danhSachLuaChon[soNgauNhien].id;

    let ketQuaVanNay = '';

    if (luaChonCuaNguoi === luaChonCuaMay) {
      ketQuaVanNay = 'Hòa';
    } else if (luaChonCuaNguoi === 'Keo' && luaChonCuaMay === 'Bao') {
      ketQuaVanNay = 'Thắng';
    } else if (luaChonCuaNguoi === 'Bua' && luaChonCuaMay === 'Keo') {
      ketQuaVanNay = 'Thắng';
    } else if (luaChonCuaNguoi === 'Bao' && luaChonCuaMay === 'Bua') {
      ketQuaVanNay = 'Thắng';
    } else {
      ketQuaVanNay = 'Thua';
    }

    if (ketQuaVanNay === 'Thắng') {
      message.success('Tuyệt vời! Bạn đã thắng!');
    } else if (ketQuaVanNay === 'Thua') {
      message.error('Rất tiếc! Bạn thua rồi!');
    } else {
      message.info('Hòa nhau rồi!');
    }

    let vanMoi: VanDau = {
      lan: soTran + 1,
      nguoiChon: luaChonCuaNguoi,
      mayChon: luaChonCuaMay,
      ketQua: ketQuaVanNay
    };

    let mangLichSuMoi = [vanMoi, ...lichSu];
    setLichSu(mangLichSuMoi);
    setSoTran(soTran + 1);
  };

  const xoaLichSu = () => {
    setLichSu([]);
    setSoTran(0);
    message.success('Đã xóa lịch sử chơi!');
  };

  return (
    <Card title={<Title level={3} style={{ margin: 0 }}>Bài 1: Oẳn Tù Tì</Title>} bordered={false} style={{ maxWidth: 600, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <Text strong style={{ fontSize: 16, display: 'block', marginBottom: 16 }}>Mời bạn ra chiêu:</Text>
        <Space size="large">
          {danhSachLuaChon.map(item => (
            <Button 
              key={item.id} 
              size="large" 
              onClick={() => xuLyChoi(item.id)}
              style={{ width: 100, height: 60, fontSize: 18, fontWeight: 'bold' }}
            >
              {item.ten}
            </Button>
          ))}
        </Space>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <Text strong>Lịch sử các ván đấu:</Text>
        <Button danger size="small" onClick={xoaLichSu}>Xóa lịch sử</Button>
      </div>

      <Table 
        dataSource={lichSu} 
        rowKey="lan" 
        pagination={{ pageSize: 5 }} 
        size="small"
        columns={[
          { title: 'Lượt', dataIndex: 'lan' },
          { title: 'Bạn chọn', dataIndex: 'nguoiChon' },
          { title: 'Máy chọn', dataIndex: 'mayChon' },
          { 
            title: 'Kết quả', 
            dataIndex: 'ketQua', 
            render: (kq: string) => {
              if (kq === 'Thắng') return <Tag color="green">{kq}</Tag>;
              if (kq === 'Thua') return <Tag color="red">{kq}</Tag>;
              return <Tag color="default">{kq}</Tag>;
            }
          },
        ]} 
      />
    </Card>
  );
};

export default Bai1;