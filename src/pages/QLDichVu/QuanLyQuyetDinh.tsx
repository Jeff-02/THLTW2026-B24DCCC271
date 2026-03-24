import React, { useEffect, useState } from 'react';
import { Button, Card, DatePicker, Form, Input, message, Select, Table } from 'antd';

interface SoVanBang { id: string; maSo: string; }
interface QuyetDinh { id: string; soQD: string; ngayBanHanh: string; trichYeu: string; soVanBangId: string; }

const getStorage = <T,>(key: string, defaultValue: T): T => {
  try { const v = localStorage.getItem(key); return v ? (JSON.parse(v) as T) : defaultValue; } catch { return defaultValue; }
};

const QuanLyQuyetDinh: React.FC = () => {
  const [soVanBangList] = useState<SoVanBang[]>(() => getStorage('soVanBangList', []));
  const [list, setList] = useState<QuyetDinh[]>(() => getStorage('quyetDinhList', []));

  useEffect(() => { localStorage.setItem('quyetDinhList', JSON.stringify(list)); }, [list]);

  const onFinish = (values: any) => {
    if (!values.soVanBangId) { message.error('Chọn sổ văn bằng.'); return; }
    setList(prev => [...prev, {
      id: `qd-${Date.now()}`,
      soQD: values.soQD,
      ngayBanHanh: values.ngayBanHanh.format('YYYY-MM-DD'),
      trichYeu: values.trichYeu,
      soVanBangId: values.soVanBangId,
    }]);
    message.success('Thêm quyết định thành công.');
  };

  return (
    <Card title="Quyết định tốt nghiệp">
      <Form layout="vertical" onFinish={onFinish} style={{ marginBottom: 16 }}>
        <Form.Item name="soVanBangId" label="Sổ văn bằng" rules={[{ required: true }]}> 
          <Select placeholder="Chọn sổ" options={soVanBangList.map(x => ({ value: x.id, label: x.maSo }))} />
        </Form.Item>
        <Form.Item name="soQD" label="Số QĐ" rules={[{ required: true }]}><Input /></Form.Item>
        <Form.Item name="ngayBanHanh" label="Ngày ban hành" rules={[{ required: true }]}><DatePicker style={{ width: '100%' }} /></Form.Item>
        <Form.Item name="trichYeu" label="Trích yếu"><Input.TextArea rows={2} /></Form.Item>
        <Form.Item><Button type="primary" htmlType="submit">Lưu</Button></Form.Item>
      </Form>

      <Table<QuyetDinh> dataSource={list} rowKey="id" pagination={{ pageSize: 8 }} columns={[
        { title: 'Số QĐ', dataIndex: 'soQD' },
        { title: 'Ngày', dataIndex: 'ngayBanHanh' },
        { title: 'Trích yếu', dataIndex: 'trichYeu' },
        { title: 'Sổ văn bằng', dataIndex: 'soVanBangId', render: (v) => soVanBangList.find(x => x.id === v)?.maSo || '-' },
      ]} />
    </Card>
  );
};

export default QuanLyQuyetDinh;
