import React, { useEffect, useMemo, useState } from 'react';
import { Button, Card, Col, Drawer, Form, Input, List, message, Modal, Popconfirm, Row, Select, Space, Table, Tag, Typography } from 'antd';
import dayjs from 'dayjs';

type Status = 'Pending' | 'Approved' | 'Rejected';

interface DonDangKy {
  id: string;
  hoTen: string;
  email: string;
  sdt: string;
  gioiTinh: string;
  diaChi: string;
  soTruong: string;
  cauLacBo: string;
  lyDo: string;
  trangThai: Status;
  ghiChu?: string;
}

interface LichSuThaoTac {
  id: string;
  donId: string;
  thoiGian: string;
  noiDung: string;
}

const getStorage = <T,>(key: string, defaultValue: T): T => {
  try { const v = localStorage.getItem(key); return v ? (JSON.parse(v) as T) : defaultValue; } catch { return defaultValue; }
};

const statusOptions = [
  { label: 'Pending', value: 'Pending' },
  { label: 'Approved', value: 'Approved' },
  { label: 'Rejected', value: 'Rejected' },
];

const QuanLyDonDangKy: React.FC = () => {
  const [list, setList] = useState<DonDangKy[]>(() => getStorage('donDKList', []));
  const [lichSuList, setLichSuList] = useState<LichSuThaoTac[]>(() => getStorage('lichSuThaoTacList', []));
  const [availableClubs, setAvailableClubs] = useState<string[]>(() => getStorage<{ ten: string }[]>('clbList', []).map(c => c.ten));
  const [form] = Form.useForm();
  const [searchQuery, setSearchQuery] = useState('');
  const [rowSelection, setRowSelection] = useState<React.Key[]>([]);
  
  // States phục vụ Modal và Drawer
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [bulkMode, setBulkMode] = useState<'approve' | 'reject' | null>(null);
  const [bulkReason, setBulkReason] = useState('');
  const [editId, setEditId] = useState<string | null>(null);
  const [historyDrawerVisible, setHistoryDrawerVisible] = useState(false);
  const [currentHistory, setCurrentHistory] = useState<LichSuThaoTac[]>([]);

  useEffect(() => { localStorage.setItem('donDKList', JSON.stringify(list)); }, [list]);
  useEffect(() => { localStorage.setItem('lichSuThaoTacList', JSON.stringify(lichSuList)); }, [lichSuList]);
  useEffect(() => {
    const clbData = getStorage<{ ten: string }[]>('clbList', []);
    setAvailableClubs(clbData.map(c => c.ten));
  }, []);

  const summary = useMemo(() => {
    const counts: Record<Status, number> = { Pending: 0, Approved: 0, Rejected: 0 };
    list.forEach(item => { counts[item.trangThai] += 1; });
    return counts;
  }, [list]);

  const filteredData = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return list;
    return list.filter(item =>
      item.hoTen.toLowerCase().includes(query) ||
      item.email.toLowerCase().includes(query) ||
      item.cauLacBo.toLowerCase().includes(query) ||
      item.sdt.toLowerCase().includes(query)
    );
  }, [list, searchQuery]);

  const addHistory = (donId: string, noiDung: string) => {
    const log: LichSuThaoTac = {
      id: `log-${Date.now()}-${Math.random()}`,
      donId,
      thoiGian: dayjs().format('HH:mm DD/MM/YYYY'),
      noiDung
    };
    setLichSuList(prev => [log, ...prev]);
  };

  const onFinish = (values: any) => {
    if (editId) {
      setList(prev => prev.map(item => item.id === editId ? { ...item, ...values } : item));
      message.success('Đã cập nhật đơn đăng ký.');
      addHistory(editId, 'Admin đã chỉnh sửa thông tin đơn đăng ký');
      setEditId(null);
    } else {
      const newId = `dk-${Date.now()}`;
      setList(prev => [...prev, { id: newId, ...values, trangThai: 'Pending' }]);
      addHistory(newId, 'Đơn đăng ký được tạo mới');
      message.success('Đã thêm đơn đăng ký mới.');
    }
    form.resetFields();
  };

  const updateStatus = (id: string, status: Status, note?: string) => {
    setList(prev => prev.map(item => item.id === id ? { ...item, trangThai: status, ghiChu: note ?? item.ghiChu } : item));
    const actionText = status === 'Approved' ? 'Approved' : 'Rejected';
    const reasonText = note ? ` với lý do: ${note}` : '';
    addHistory(id, `Admin đã ${actionText} đơn đăng ký${reasonText}`);
    message.success(`Đã ${status === 'Approved' ? 'duyệt' : 'từ chối'} đơn.`);
  };

  const onReject = (id: string) => {
    setRejectId(id);
    setBulkMode('reject');
    setIsModalOpen(true);
  };

  const onBulkAction = (mode: 'approve' | 'reject') => {
    if (!rowSelection.length) { message.warning('Chọn ít nhất 1 đơn để thao tác.'); return; }
    setBulkMode(mode);
    setIsModalOpen(mode === 'reject');
    if (mode === 'approve') {
      setList(prev => prev.map(item => rowSelection.includes(item.id) ? { ...item, trangThai: 'Approved' } : item));
      rowSelection.forEach(id => {
        addHistory(id as string, 'Admin đã Approved đơn đăng ký (Duyệt hàng loạt)');
      });
      setRowSelection([]);
      message.success(`Đã duyệt ${rowSelection.length} đơn.`);
    }
  };

  const confirmReject = () => {
    if (!bulkReason.trim()) { message.error('Nhập lý do từ chối'); return; }
    
    if (bulkMode === 'reject' && rejectId) {
      updateStatus(rejectId, 'Rejected', bulkReason);
    } else if (bulkMode === 'reject') {
      setList(prev => prev.map(item => (rowSelection.includes(item.id) ? { ...item, trangThai: 'Rejected', ghiChu: bulkReason } : item)));
      rowSelection.forEach(id => {
        addHistory(id as string, `Admin đã Rejected đơn đăng ký với lý do: ${bulkReason} (Từ chối hàng loạt)`);
      });
      message.success(`Đã từ chối ${rowSelection.length} đơn.`);
      setRowSelection([]);
    }
    setBulkReason('');
    setRejectId(null);
    setBulkMode(null);
    setIsModalOpen(false);
  };

  const deleteItem = (id: string) => {
    setList(prev => prev.filter(item => item.id !== id));
    // Dọn dẹp cả lịch sử của đơn đó
    setLichSuList(prev => prev.filter(log => log.donId !== id));
    message.success('Đã xóa đơn.');
  };

  const editDon = (record: DonDangKy) => {
    setEditId(record.id);
    form.setFieldsValue(record);
  };

  const showHistory = (donId: string) => {
    setCurrentHistory(lichSuList.filter(log => log.donId === donId));
    setHistoryDrawerVisible(true);
  };

  return (
    <div>
      <Card title="Quản lý đơn đăng ký thành viên" style={{ marginBottom: 16 }}>
        <Row gutter={12} style={{ marginBottom: 16 }}>
          <Col flex="1 1 320px">
            <Input.Search placeholder="Tìm kiếm theo tên/email/CLB/SĐT" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} allowClear enterButton />
          </Col>
          <Col>
            <Space>
              <Button type="primary" onClick={() => onBulkAction('approve')}>Duyệt hàng loạt</Button>
              <Button danger onClick={() => onBulkAction('reject')}>Từ chối hàng loạt</Button>
            </Space>
          </Col>
          <Col>
            <Typography.Text>
              Pending: <Tag color="orange">{summary.Pending}</Tag> · Approved: <Tag color="green">{summary.Approved}</Tag> · Rejected: <Tag color="red">{summary.Rejected}</Tag>
            </Typography.Text>
          </Col>
        </Row>

        <Card type="inner" title={editId ? "Xem/Chỉnh sửa đơn đăng ký" : "Thêm đơn đăng ký mới"}>
          <Form form={form} layout="vertical" onFinish={onFinish}>
            <Row gutter={12}>
              <Col span={6}><Form.Item name="hoTen" label="Họ tên" rules={[{ required: true }]}><Input placeholder="Nguyễn Văn A" /></Form.Item></Col>
              <Col span={6}><Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}><Input placeholder="example@gmail.com" /></Form.Item></Col>
              <Col span={6}><Form.Item name="sdt" label="SĐT" rules={[{ required: true }]}><Input placeholder="097xxxxxxx" /></Form.Item></Col>
              <Col span={6}><Form.Item name="gioiTinh" label="Giới tính" rules={[{ required: true }]}>
                <Select options={[{ value: 'Nam', label: 'Nam' }, { value: 'Nữ', label: 'Nữ' }, { value: 'Khác', label: 'Khác' }]} placeholder="Chọn giới tính" />
              </Form.Item></Col>
            </Row>
            <Row gutter={12}>
              <Col span={8}><Form.Item name="soTruong" label="Sở trường"><Input placeholder="Hát, Múa, Thể thao, IT..." /></Form.Item></Col>
              <Col span={8}><Form.Item name="cauLacBo" label="Câu lạc bộ" rules={[{ required: true }]}>
                <Select mode="tags" showSearch placeholder="Chọn CLB đã có hoặc nhập CLB mới" options={availableClubs.map(name => ({ value: name, label: name }))} filterOption={(input, option) => (option?.label?.toString().toLowerCase() || '').includes(input.toLowerCase())} />
              </Form.Item></Col>
              <Col span={8}><Form.Item name="diaChi" label="Địa chỉ"><Input placeholder="Địa chỉ hiện tại" /></Form.Item></Col>
            </Row>
            <Form.Item name="lyDo" label="Lý do đăng ký"><Input.TextArea rows={2} placeholder="Mục tiêu, sở thích..." /></Form.Item>
            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit">{editId ? 'Cập nhật' : 'Thêm đơn mới'}</Button>
                {editId && <Button onClick={() => { setEditId(null); form.resetFields(); }}>Hủy</Button>}
              </Space>
            </Form.Item>
          </Form>
        </Card>
      </Card>

      <Card title="Danh sách đơn đăng ký">
        <Table<DonDangKy>
          rowKey="id"
          dataSource={filteredData}
          pagination={{ pageSize: 9 }}
          rowSelection={{ selectedRowKeys: rowSelection, onChange: keys => setRowSelection(keys) }}
          scroll={{ x: 1200 }}
          columns={[
            { title: 'Họ tên', dataIndex: 'hoTen', sorter: (a, b) => a.hoTen.localeCompare(b.hoTen), ellipsis: true, width: 140 },
            { title: 'Email', dataIndex: 'email', ellipsis: true, width: 180 },
            { title: 'SĐT', dataIndex: 'sdt', width: 110 },
            { title: 'Sở trường', dataIndex: 'soTruong', width: 120, ellipsis: true },
            { title: 'CLB', dataIndex: 'cauLacBo', filters: Array.from(new Set(list.map(i => i.cauLacBo))).map(v => ({ text: v, value: v })), onFilter: (value, record) => record.cauLacBo === value, ellipsis: true, width: 150 },
            { title: 'Trạng thái', dataIndex: 'trangThai', filters: statusOptions.map(item => ({ text: item.label, value: item.value })), onFilter: (value, record) => record.trangThai === value as Status,
              render: status => {
                const color = status === 'Pending' ? 'orange' : status === 'Approved' ? 'green' : 'red';
                return <Tag color={color}>{status}</Tag>;
              }, width: 110
            },
            { title: 'Ghi chú', dataIndex: 'ghiChu', ellipsis: true },
            {
              title: 'Hành động', key: 'action', width: 220, fixed: 'right', render: (_, record) => (
                <Space size="small" wrap>
                  <Button size="small" type="link" onClick={() => editDon(record)}>Chi tiết/Sửa</Button>
                  <Button size="small" type="link" onClick={() => showHistory(record.id)}>Lịch sử</Button>
                  <Button size="small" type="text" onClick={() => updateStatus(record.id, 'Approved')} disabled={record.trangThai === 'Approved'}>Duyệt</Button>
                  <Button size="small" type="text" danger onClick={() => onReject(record.id)} disabled={record.trangThai === 'Rejected'}>Từ chối</Button>
                  <Popconfirm title="Xác nhận xóa?" onConfirm={() => deleteItem(record.id)}>
                    <Button size="small" type="text" danger>Xóa</Button>
                  </Popconfirm>
                </Space>
              ),
            }
          ]}
        />
      </Card>

      {/* Modal nhập lý do từ chối */}
      <Modal title="Lý do từ chối" visible={isModalOpen} onOk={confirmReject} onCancel={() => { setIsModalOpen(false); setBulkReason(''); setRejectId(null); setBulkMode(null); }}>
        <Form layout="vertical">
          <Form.Item label="Lý do" required>
            <Input.TextArea value={bulkReason} onChange={e => setBulkReason(e.target.value)} rows={3} placeholder="Nhập lý do để ghi vào lịch sử" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Drawer xem lịch sử */}
      <Drawer title="Lịch sử thao tác" placement="right" onClose={() => setHistoryDrawerVisible(false)} visible={historyDrawerVisible} width={400}>
        <List
          itemLayout="horizontal"
          dataSource={currentHistory}
          renderItem={item => (
            <List.Item>
              <List.Item.Meta title={<Typography.Text type="secondary">{item.thoiGian}</Typography.Text>} description={item.noiDung} />
            </List.Item>
          )}
          locale={{ emptyText: "Chưa có lịch sử thao tác" }}
        />
      </Drawer>
    </div>
  );
};

export default QuanLyDonDangKy;