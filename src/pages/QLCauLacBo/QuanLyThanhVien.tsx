import React, { useMemo, useState } from 'react';
import { Button, Card, Form, message, Modal, Select, Space, Table, Tag } from 'antd';

interface ThanhVien {
  id: string;
  hoTen: string;
  email: string;
  sdt: string;
  soTruong: string;
  cauLacBo: string;
  trangThai: string;
}

const getStorage = <T,>(key: string, defaultValue: T): T => {
  try { const v = localStorage.getItem(key); return v ? (JSON.parse(v) as T) : defaultValue; } catch { return defaultValue; }
};

const QuanLyThanhVien: React.FC = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [targetClub, setTargetClub] = useState('');
  const [clubFilter, setClubFilter] = useState('all');
  
  // Lấy danh sách thành viên từ những đơn đã Approved
  const [members, setMembers] = useState<ThanhVien[]>(() => {
    const source = getStorage<any[]>('donDKList', []);
    return source.filter(d => d.trangThai === 'Approved').map(d => ({
      ...d,
      cauLacBo: String(d.cauLacBo ?? '').trim(),
    }));
  });

  const changeClub = (ids: React.Key[] | string, newClub: string) => {
    const normalizedClub = String(newClub).trim();
    
    // Update local state
    setMembers(prev => prev.map(m => {
      if (Array.isArray(ids)) return ids.includes(m.id) ? { ...m, cauLacBo: normalizedClub } : m;
      return m.id === ids ? { ...m, cauLacBo: normalizedClub } : m;
    }));
    
    setSelectedRowKeys([]);
    
    // Update localStorage để sync ngược lại vào Quản lý đơn đăng ký
    const source = getStorage<any[]>('donDKList', []);
    const updated = source.map(d => {
      if (Array.isArray(ids) ? ids.includes(d.id) : d.id === ids) {
        return { ...d, cauLacBo: newClub };
      }
      return d;
    });
    localStorage.setItem('donDKList', JSON.stringify(updated));
    message.success(`Chuyển CLB thành công cho ${Array.isArray(ids) ? ids.length : 1} thành viên.`);
  };

  const clubOptions = useMemo(() => {
    const normalize = (v: any) => v === undefined || v === null ? '' : String(v).trim();
    const fromMembers = members.map(x => normalize(x.cauLacBo)).filter(Boolean);
    const fromClbList = getStorage<{ ten: any }[]>('clbList', []).map(x => normalize(x.ten)).filter(Boolean);
    const allClubs = Array.from(new Set([...fromMembers, ...fromClbList]));
    return allClubs.map(v => ({ value: v, label: v }));
  }, [members]);

  const visibleMembers = clubFilter === 'all'
    ? members
    : members.filter(m => String(m.cauLacBo).trim() === String(clubFilter).trim());

  return (
    <Card title="Quản lý thành viên câu lạc bộ">
      <p style={{ marginBottom: 16 }}>Danh sách này tự động lấy từ các đơn đăng ký đã được <b>Approved</b>.</p>
      
      <Space style={{ marginBottom: 16 }} size="middle">
        <Select
          value={clubFilter}
          onChange={(value) => setClubFilter(value)}
          style={{ width: 220 }}
          options={[{ value: 'all', label: 'Tất cả CLB' }, ...clubOptions]}
          placeholder="Lọc theo CLB"
        />
        <Button type="primary" onClick={() => {
          if (!selectedRowKeys.length) { message.warning('Chọn ít nhất một thành viên để chuyển CLB.'); return; }
          setIsModalOpen(true);
        }}>
          Chuyển CLB cho thành viên đã chọn
        </Button>
      </Space>

      <Table<ThanhVien>
        rowKey="id"
        dataSource={visibleMembers}
        pagination={{ pageSize: 8 }}
        rowSelection={{ selectedRowKeys, onChange: keys => setSelectedRowKeys(keys) }}
        columns={[
          { title: 'Họ tên', dataIndex: 'hoTen' },
          { title: 'Email', dataIndex: 'email' },
          { title: 'SĐT', dataIndex: 'sdt' },
          { title: 'Sở trường', dataIndex: 'soTruong' },
          { title: 'Câu lạc bộ', dataIndex: 'cauLacBo', render: v => <b>{v}</b> },
          { title: 'Trạng thái', dataIndex: 'trangThai', render: status => <Tag color="green">{status}</Tag> },
          {
            title: 'Hành động', key: 'chuyen', render: (_, record) => (
              <Button type="link" onClick={() => {
                setSelectedRowKeys([record.id]);
                setTargetClub(record.cauLacBo);
                setIsModalOpen(true);
              }}>Chuyển CLB</Button>
            ),
          }
        ]}
      />

      <Modal
        title={`Chuyển CLB cho ${selectedRowKeys.length} thành viên`}
        visible={isModalOpen}
        onOk={() => {
          if (!targetClub) { message.warning('Vui lòng chọn CLB đích.'); return; }
          changeClub(selectedRowKeys, targetClub);
          setIsModalOpen(false);
        }}
        onCancel={() => { setTargetClub(''); setIsModalOpen(false); }}
      >
        <Form layout="vertical">
          <Form.Item label="Chọn CLB đích" required>
            <Select value={targetClub || undefined} onChange={value => setTargetClub(value)} options={clubOptions} placeholder="Chọn CLB" />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default QuanLyThanhVien;