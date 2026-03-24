import React, { useState, useEffect, useMemo } from 'react';
import { Table, Button, Space, Drawer, Form, Input, DatePicker, InputNumber, Select, Row, Col, Popconfirm, Tabs, Empty } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

interface SoVanBang {
  id: string;
  nam: number;
  maSo: string;
  soHienTai: number;
}

interface QuyetDinh {
  id: string;
  soQD: string;
  ngayBanHanh: string;
  trichYeu: string;
  soVanBangId: string;
}

interface FieldConfig {
  id: string;
  ten: string;
  kieu: 'String' | 'Number' | 'Date';
  batBuoc: boolean;
}

interface ThongTinVanBang {
  id: string;
  soVanBangId: string;
  soHieu: string;
  maSV: string;
  hoTen: string;
  ngaySinh: string;
  danToc?: string;
  heDaoTao?: string;
  noiSinh?: string;
  diemTrungBinh?: number;
  xepHang?: string;
  thoiGianCap?: string;
  quyetDinhId?: string;
  thongTinTuDo?: Record<string, any>;
}

const getStorage = <T,>(key: string, defaultValue: T): T => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : defaultValue;
};

const setStorage = <T,>(key: string, value: T) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const ThongTinVanBang: React.FC = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState<ThongTinVanBang[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<ThongTinVanBang | null>(null);
  const [detailRecord, setDetailRecord] = useState<ThongTinVanBang | null>(null);

  const soVanBangList = useMemo(() => getStorage<SoVanBang[]>('soVanBangList', []), []);
  const quyetDinhList = useMemo(() => getStorage<QuyetDinh[]>('quyetDinhList', []), []);
  const fieldConfigs = useMemo(() => getStorage<FieldConfig[]>('fieldConfigs', []), []);

  useEffect(() => {
    const saved = getStorage<ThongTinVanBang[]>('thongTinVanBangList', []);
    setData(saved);
  }, []);

  const saveData = (newData: ThongTinVanBang[]) => {
    setData(newData);
    setStorage('thongTinVanBangList', newData);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setEditingRecord(null);
    form.resetFields();
  };

  const openAddDrawer = () => {
    setEditingRecord(null);
    form.resetFields();
    setDrawerOpen(true);
  };

  const openEditDrawer = (record: ThongTinVanBang) => {
    setEditingRecord(record);
    const formValues = {
      ...record,
      ngaySinh: record.ngaySinh ? dayjs(record.ngaySinh) : null,
    };
    form.setFieldsValue(formValues);
    setDrawerOpen(true);
  };

  const onFinish = async (values: any) => {
    try {
      if (editingRecord) {
        const updated = data.map(item =>
          item.id === editingRecord.id
            ? {
                ...item,
                ...values,
                ngaySinh: values.ngaySinh ? values.ngaySinh.format('YYYY-MM-DD') : '',
              }
            : item
        );
        saveData(updated);
      } else {
        const newRecord: ThongTinVanBang = {
          id: Date.now().toString(),
          ...values,
          ngaySinh: values.ngaySinh ? values.ngaySinh.format('YYYY-MM-DD') : '',
          thongTinTuDo: {},
        };
        saveData([...data, newRecord]);
      }
      closeDrawer();
    } catch (error) {
      console.error('Lỗi khi lưu:', error);
    }
  };

  const handleDelete = (id: string) => {
    saveData(data.filter(item => item.id !== id));
  };

  const showDetail = (record: ThongTinVanBang) => {
    setDetailRecord(record);
    setDetailDrawerOpen(true);
  };

  const getSoVanBangName = (id: string) => {
    const item = soVanBangList.find(s => s.id === id);
    return item ? `${item.nam} - ${item.maSo}` : id;
  };

  const getQuyetDinhName = (id: string) => {
    const item = quyetDinhList.find(q => q.id === id);
    return item ? item.soQD : id;
  };

  const columns = [
    {
      title: 'Vào Sổ',
      dataIndex: 'soVanBangId',
      key: 'soVanBangId',
      render: (text: string) => getSoVanBangName(text),
    },
    {
      title: 'Số Hiệu',
      dataIndex: 'soHieu',
      key: 'soHieu',
    },
    {
      title: 'Mã SV',
      dataIndex: 'maSV',
      key: 'maSV',
    },
    {
      title: 'Họ Tên',
      dataIndex: 'hoTen',
      key: 'hoTen',
    },
    {
      title: 'Ngày Sinh',
      dataIndex: 'ngaySinh',
      key: 'ngaySinh',
    },
    {
      title: 'Dân Tộc',
      dataIndex: 'danToc',
      key: 'danToc',
    },
    {
      title: 'Điểm TB',
      dataIndex: 'diemTrungBinh',
      key: 'diemTrungBinh',
    },
    {
      title: 'Xếp Hạng',
      dataIndex: 'xepHang',
      key: 'xepHang',
    },
    {
      title: 'Thao Tác',
      key: 'action',
      fixed: 'right' as const,
      width: 120,
      render: (_: any, record: ThongTinVanBang) => (
        <Space>
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => showDetail(record)}
            title="Xem chi tiết"
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => openEditDrawer(record)}
            title="Chỉnh sửa"
          />
          <Popconfirm
            title="Xoá bản ghi"
            onConfirm={() => handleDelete(record.id)}
            okText="Xoá"
            cancelText="Hủy"
          >
            <span>Bạn có chắc muốn xoá bản ghi này không?</span>
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              title="Xoá"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const dynamicFormFields = fieldConfigs.map(config => (
    <Form.Item
      key={config.id}
      label={config.ten}
      name={`dynamic_${config.id}`}
      rules={config.batBuoc ? [{ required: true, message: `Vui lòng nhập ${config.ten}` }] : []}
    >
      {config.kieu === 'String' && <Input placeholder={`Nhập ${config.ten}`} />}
      {config.kieu === 'Number' && <InputNumber style={{ width: '100%' }} placeholder={`Nhập ${config.ten}`} />}
      {config.kieu === 'Date' && <DatePicker style={{ width: '100%' }} />}
    </Form.Item>
  ));

  return (
    <div style={{ padding: '20px' }}>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={openAddDrawer}
        style={{ marginBottom: '16px' }}
      >
        Thêm bản ghi mới
      </Button>

      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        scroll={{ x: 1200 }}
      />

      {/* Drawer thêm/sửa */}
      <Drawer
        title={editingRecord ? 'Chỉnh sửa thông tin văn bằng' : 'Thêm thông tin văn bằng'}
        placement="right"
        onClose={closeDrawer}
        visible={drawerOpen}
        width={700}
        footer={
          <Space style={{ float: 'right' }}>
            <Button onClick={closeDrawer}>Hủy</Button>
            <Button type="primary" onClick={() => form.submit()}>
              Lưu
            </Button>
          </Space>
        }
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
        >
          <Tabs>
            <Tabs.TabPane key="basic" tab="Thông tin cơ bản">
                    <Form.Item
                      label="Vào Sổ"
                      name="soVanBangId"
                      rules={[{ required: true, message: 'Vui lòng chọn sổ văn bằng' }]}
                    >
                      <Select
                        placeholder="Chọn sổ văn bằng"
                        options={soVanBangList.map(item => ({
                          label: `${item.nam} - ${item.maSo}`,
                          value: item.id,
                        }))}
                      />
                    </Form.Item>

                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item
                          label="Số Hiệu"
                          name="soHieu"
                          rules={[{ required: true, message: 'Vui lòng nhập số hiệu' }]}
                        >
                          <Input placeholder="Nhập số hiệu" />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          label="Mã Sinh Viên"
                          name="maSV"
                          rules={[{ required: true, message: 'Vui lòng nhập mã sinh viên' }]}
                        >
                          <Input placeholder="Nhập mã sinh viên" />
                        </Form.Item>
                      </Col>
                    </Row>

                    <Form.Item
                      label="Họ Tên"
                      name="hoTen"
                      rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
                    >
                      <Input placeholder="Nhập họ tên" />
                    </Form.Item>

                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item
                          label="Ngày Sinh"
                          name="ngaySinh"
                          rules={[{ required: true, message: 'Vui lòng chọn ngày sinh' }]}
                        >
                          <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          label="Dân Tộc"
                          name="danToc"
                        >
                          <Input placeholder="Nhập dân tộc" />
                        </Form.Item>
                      </Col>
                    </Row>
            </Tabs.TabPane>

            <Tabs.TabPane key="detail" tab="Thông tin chi tiết">
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item
                          label="Hệ Đào Tạo"
                          name="heDaoTao"
                        >
                          <Input placeholder="Nhập hệ đào tạo" />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          label="Nơi Sinh"
                          name="noiSinh"
                        >
                          <Input placeholder="Nhập nơi sinh" />
                        </Form.Item>
                      </Col>
                    </Row>

                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item
                          label="Điểm Trung Bình"
                          name="diemTrungBinh"
                        >
                          <InputNumber style={{ width: '100%' }} placeholder="Nhập điểm" min={0} max={10} step={0.1} />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          label="Xếp Hạng"
                          name="xepHang"
                        >
                          <Input placeholder="Nhập xếp hạng" />
                        </Form.Item>
                      </Col>
                    </Row>

                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item
                          label="Thời Gian Cấp"
                          name="thoiGianCap"
                        >
                          <Input placeholder="Nhập thời gian cấp" />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          label="Quyết Định"
                          name="quyetDinhId"
                        >
                          <Select
                            placeholder="Chọn quyết định"
                            allowClear
                            options={quyetDinhList.map(item => ({
                              label: item.soQD,
                              value: item.id,
                            }))}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
            </Tabs.TabPane>

            <Tabs.TabPane key="additional" tab="Thông tin bổ sung">
                    {dynamicFormFields.length > 0 ? (
                      <>{dynamicFormFields}</>
                    ) : (
                      <Empty description="Chưa có trường bổ sung nào được cấu hình" />
                    )}
            </Tabs.TabPane>
          </Tabs>
        </Form>
      </Drawer>

      {/* Drawer xem chi tiết */}
      <Drawer
        title="Chi tiết thông tin văn bằng"
        placement="right"
        onClose={() => setDetailDrawerOpen(false)}
        visible={detailDrawerOpen}
        width={700}
      >
        {detailRecord && (
          <div>
            <h3>Thông tin cơ bản</h3>
            <p><strong>Vào Sổ:</strong> {getSoVanBangName(detailRecord.soVanBangId)}</p>
            <p><strong>Số Hiệu:</strong> {detailRecord.soHieu}</p>
            <p><strong>Mã SV:</strong> {detailRecord.maSV}</p>
            <p><strong>Họ Tên:</strong> {detailRecord.hoTen}</p>
            <p><strong>Ngày Sinh:</strong> {detailRecord.ngaySinh}</p>
            {detailRecord.danToc && <p><strong>Dân Tộc:</strong> {detailRecord.danToc}</p>}

            <h3 style={{ marginTop: '20px' }}>Thông tin chi tiết</h3>
            {detailRecord.heDaoTao && <p><strong>Hệ Đào Tạo:</strong> {detailRecord.heDaoTao}</p>}
            {detailRecord.noiSinh && <p><strong>Nơi Sinh:</strong> {detailRecord.noiSinh}</p>}
            {detailRecord.diemTrungBinh && <p><strong>Điểm TB:</strong> {detailRecord.diemTrungBinh}</p>}
            {detailRecord.xepHang && <p><strong>Xếp Hạng:</strong> {detailRecord.xepHang}</p>}
            {detailRecord.thoiGianCap && <p><strong>Thời Gian Cấp:</strong> {detailRecord.thoiGianCap}</p>}
            {detailRecord.quyetDinhId && <p><strong>Quyết Định:</strong> {getQuyetDinhName(detailRecord.quyetDinhId)}</p>}
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default ThongTinVanBang;
