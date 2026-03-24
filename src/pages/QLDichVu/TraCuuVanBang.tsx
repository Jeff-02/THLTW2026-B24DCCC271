import React, { useEffect, useState } from 'react';
import { Button, Card, DatePicker, Form, Input, message, Select, Table } from 'antd';

interface SoVanBang { id: string; maSo: string; }
interface QuyetDinh { id: string; soQD: string; }
interface ThongTinVanBang { id: string; soVanBangId: string; soHieu: string; maSV: string; hoTen: string; ngaySinh: string; quyetDinhId?: string; }

const getStorage = <T,>(key: string, defaultValue: T): T => {
  try { const v = localStorage.getItem(key); return v ? (JSON.parse(v) as T) : defaultValue; } catch { return defaultValue; }
};

const TraCuuVanBang: React.FC = () => {
  const [soVanBangList] = useState<SoVanBang[]>(() => getStorage('soVanBangList', []));
  const [quyetDinhList] = useState<QuyetDinh[]>(() => getStorage('quyetDinhList', []));
  const [thongTinList] = useState<ThongTinVanBang[]>(() => getStorage('thongTinVanBangList', []));
  const [ketQua, setKetQua] = useState<ThongTinVanBang[]>([]);
  const [condition, setCondition] = useState({ soHieu: '', soVanBang: '', maSV: '', hoTen: '', ngaySinh: '', quyetDinhId: '' });

  const timKiem = () => {
    const filters = Object.entries(condition).filter(([_, v]) => v && v.trim() !== '');
    if (filters.length < 2) { message.warning('Nhập ít nhất 2 điều kiện tra cứu.'); return; }
    let rs = [...thongTinList];
    if (condition.soHieu) rs = rs.filter(x => x.soHieu.toLowerCase().includes(condition.soHieu.toLowerCase()));
    if (condition.soVanBang) rs = rs.filter(x => soVanBangList.find(s => s.id === x.soVanBangId && s.maSo === condition.soVanBang));
    if (condition.maSV) rs = rs.filter(x => x.maSV.toLowerCase().includes(condition.maSV.toLowerCase()));
    if (condition.hoTen) rs = rs.filter(x => x.hoTen.toLowerCase().includes(condition.hoTen.toLowerCase()));
    if (condition.ngaySinh) rs = rs.filter(x => x.ngaySinh === condition.ngaySinh);
    if (condition.quyetDinhId) rs = rs.filter(x => x.quyetDinhId === condition.quyetDinhId);
    setKetQua(rs);
    if (condition.quyetDinhId) {
      const key = `traCuuCnt-${condition.quyetDinhId}`;
      const cur = Number(localStorage.getItem(key) || '0');
      localStorage.setItem(key, String(cur + rs.length));
    }
  };

  const qdTienDo = (id?: string) => { if (!id) return '-'; return `${quyetDinhList.find(q => q.id === id)?.soQD || '-'}`; };

  return (
    <Card title="Tra cứu văn bằng">
      <Form layout="vertical" style={{ marginBottom: 16 }}>
        <Form.Item label="Số hiệu"><Input value={condition.soHieu} onChange={e => setCondition(prev => ({ ...prev, soHieu: e.target.value }))} /></Form.Item>
        <Form.Item label="Sổ văn bằng"><Select allowClear value={condition.soVanBang} onChange={value => setCondition(prev => ({ ...prev, soVanBang: value }))} options={soVanBangList.map(x => ({ value: x.maSo, label: x.maSo }))} /></Form.Item>
        <Form.Item label="Mã SV"><Input value={condition.maSV} onChange={e => setCondition(prev => ({ ...prev, maSV: e.target.value }))} /></Form.Item>
        <Form.Item label="Họ tên"><Input value={condition.hoTen} onChange={e => setCondition(prev => ({ ...prev, hoTen: e.target.value }))} /></Form.Item>
        <Form.Item label="Ngày sinh"><DatePicker style={{ width: '100%' }} onChange={(_d, dateString) => setCondition(prev => ({ ...prev, ngaySinh: dateString }))} /></Form.Item>
        <Form.Item label="Quyết định"><Select allowClear value={condition.quyetDinhId} onChange={value => setCondition(prev => ({ ...prev, quyetDinhId: value }))} options={quyetDinhList.map(x => ({ value: x.id, label: x.soQD }))} /></Form.Item>
        <Form.Item>
          <Button type="primary" onClick={timKiem}>Tra cứu</Button>
          <Button style={{ marginLeft: 8 }} onClick={() => { setCondition({ soHieu: '', soVanBang: '', maSV: '', hoTen: '', ngaySinh: '', quyetDinhId: '' }); setKetQua([]); }}>Xóa</Button>
        </Form.Item>
      </Form>
      <p>Kết quả: {ketQua.length} bản ghi</p>
      <Table<ThongTinVanBang> rowKey="id" dataSource={ketQua} pagination={{ pageSize: 8 }} columns={[
        { title: 'Số hiệu', dataIndex: 'soHieu' },
        { title: 'Mã SV', dataIndex: 'maSV' },
        { title: 'Họ tên', dataIndex: 'hoTen' },
        { title: 'Ngày sinh', dataIndex: 'ngaySinh' },
        { title: 'Quyết định', render: (_, item) => qdTienDo(item.quyetDinhId) },
      ]} />
    </Card>
  );
};

export default TraCuuVanBang;
