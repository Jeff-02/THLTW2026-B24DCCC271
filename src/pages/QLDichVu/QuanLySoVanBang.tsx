import React, { useEffect, useState } from 'react';
import { Button, Card, message, Popconfirm, Table } from 'antd';

interface SoVanBang {
  id: string;
  nam: number;
  maSo: string;
  soHienTai: number;
}

const getStorage = <T,>(key: string, defaultValue: T): T => {
  try {
    const v = localStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : defaultValue;
  } catch {
    return defaultValue;
  }
};

const QuanLySoVanBang: React.FC = () => {
  const [list, setList] = useState<SoVanBang[]>(() => getStorage('soVanBangList', []));

  useEffect(() => {
    localStorage.setItem('soVanBangList', JSON.stringify(list));
  }, [list]);

  const themSo = () => {
    const nam = new Date().getFullYear();
    const existing = list.filter(item => item.nam === nam);
    const soHienTai = existing.length + 1;
    const maSo = `${nam}-${soHienTai.toString().padStart(3, '0')}`;
    setList(prev => [...prev, { id: `svb-${Date.now()}`, nam, maSo, soHienTai }]);
    message.success('Đã tạo sổ văn bằng mới.');
  };

  const xoaSo = (id: string) => {
    setList(prev => prev.filter(item => item.id !== id));
    message.success('Đã xóa sổ văn bằng.');
  };

  return (
    <Card title="Quản lý sổ văn bằng" extra={<Button type="primary" onClick={themSo}>Tạo sổ mới</Button>}>
      <Table<SoVanBang>
        rowKey="id"
        dataSource={list}
        pagination={{ pageSize: 8 }}
        columns={[
          { title: 'Năm', dataIndex: 'nam' },
          { title: 'Mã sổ', dataIndex: 'maSo' },
          { title: 'Số hiện tại', dataIndex: 'soHienTai' },
          { title: 'Thao tác', render: (_, record) => (
              <Popconfirm title="Xóa sổ này?" onConfirm={() => xoaSo(record.id)}>
                <Button danger size="small">Xóa</Button>
              </Popconfirm>
            )
          },
        ]}
      />
    </Card>
  );
};

export default QuanLySoVanBang;
