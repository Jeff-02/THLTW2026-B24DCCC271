import React, { useState, useEffect } from 'react';
import { Card, Button, Form, Input, InputNumber, Table, Modal, Popconfirm, message, Space } from 'antd';

const Label = ({ children, required }: any) => (
  <span>{required ? <span style={{ color: 'red' }}>*</span> : ''} {children}</span>
);

interface NhanVien {
  id: string;
  tenNV: string;
  gioiHanKhach: number;
  gioBatDau: number;
  gioKetThuc: number;
}

interface DichVu {
  id: string;
  tenDV: string;
  gia: number;
  thoiGianThucHien: number;
}

const NhanVienDichVu: React.FC = () => {
  const [danhSachNhanVien, setDanhSachNhanVien] = useState<NhanVien[]>([]);
  const [danhSachDichVu, setDanhSachDichVu] = useState<DichVu[]>([]);
  
  const [hienThiModalNV, setHienThiModalNV] = useState(false);
  const [hienThiModalDV, setHienThiModalDV] = useState(false);
  const [nvDangSua, setNVDangSua] = useState<NhanVien | null>(null);
  const [dvDangSua, setDVDangSua] = useState<DichVu | null>(null);

  const [formNV] = Form.useForm();
  const [formDV] = Form.useForm();

  useEffect(() => {
    let dlNhanVien = localStorage.getItem('dl_nhanvien');
    let dlDichVu = localStorage.getItem('dl_dichvu');

    if (dlNhanVien) setDanhSachNhanVien(JSON.parse(dlNhanVien));
    if (dlDichVu) setDanhSachDichVu(JSON.parse(dlDichVu));
  }, []);

  // NHÂN VIÊN 
  const xuLyThemNhanVien = (values: any) => {
    if (nvDangSua) {
      // Cập nhật
      const mangMoi = danhSachNhanVien.map(nv => 
        nv.id === nvDangSua.id 
          ? { ...nv, tenNV: values.tenNV, gioiHanKhach: values.gioiHanKhach, gioBatDau: values.gioBatDau, gioKetThuc: values.gioKetThuc }
          : nv
      );
      setDanhSachNhanVien(mangMoi);
      localStorage.setItem('dl_nhanvien', JSON.stringify(mangMoi));
      message.success('Đã cập nhật nhân viên!');
      setNVDangSua(null);
    } else {
      // Thêm mới
      const nvMoi: NhanVien = {
        id: 'NV' + Date.now(),
        tenNV: values.tenNV,
        gioiHanKhach: values.gioiHanKhach,
        gioBatDau: values.gioBatDau,
        gioKetThuc: values.gioKetThuc
      };
      const mangMoi = [...danhSachNhanVien, nvMoi];
      setDanhSachNhanVien(mangMoi);
      localStorage.setItem('dl_nhanvien', JSON.stringify(mangMoi));
      message.success('Đã thêm nhân viên!');
    }
    setHienThiModalNV(false);
    formNV.resetFields();
  };

  const moModalSuaNV = (nv: NhanVien) => {
    setNVDangSua(nv);
    formNV.setFieldsValue({
      tenNV: nv.tenNV,
      gioiHanKhach: nv.gioiHanKhach,
      gioBatDau: nv.gioBatDau,
      gioKetThuc: nv.gioKetThuc
    });
    setHienThiModalNV(true);
  };

  const xuLyXoaNhanVien = (id: string) => {
    const mangMoi = danhSachNhanVien.filter(x => x.id !== id);
    setDanhSachNhanVien(mangMoi);
    localStorage.setItem('dl_nhanvien', JSON.stringify(mangMoi));
    message.success('Đã xóa nhân viên');
  };

  // DỊCH VỤ 
  const xuLyThemDichVu = (values: any) => {
    if (dvDangSua) {
      // Cập nhật
      const mangMoi = danhSachDichVu.map(dv => 
        dv.id === dvDangSua.id 
          ? { ...dv, tenDV: values.tenDV, gia: values.gia, thoiGianThucHien: values.thoiGianThucHien }
          : dv
      );
      setDanhSachDichVu(mangMoi);
      localStorage.setItem('dl_dichvu', JSON.stringify(mangMoi));
      message.success('Đã cập nhật dịch vụ!');
      setDVDangSua(null);
    } else {
      // Thêm mới
      const dvMoi: DichVu = {
        id: 'DV' + Date.now(),
        tenDV: values.tenDV,
        gia: values.gia,
        thoiGianThucHien: values.thoiGianThucHien
      };
      const mangMoi = [...danhSachDichVu, dvMoi];
      setDanhSachDichVu(mangMoi);
      localStorage.setItem('dl_dichvu', JSON.stringify(mangMoi));
      message.success('Đã thêm dịch vụ!');
    }
    setHienThiModalDV(false);
    formDV.resetFields();
  };

  const moModalSuaDV = (dv: DichVu) => {
    setDVDangSua(dv);
    formDV.setFieldsValue({
      tenDV: dv.tenDV,
      gia: dv.gia,
      thoiGianThucHien: dv.thoiGianThucHien
    });
    setHienThiModalDV(true);
  };

  const xuLyXoaDichVu = (id: string) => {
    const mangMoi = danhSachDichVu.filter(x => x.id !== id);
    setDanhSachDichVu(mangMoi);
    localStorage.setItem('dl_dichvu', JSON.stringify(mangMoi));
    message.success('Đã xóa dịch vụ');
  };

  const dongModal = () => {
    setHienThiModalNV(false);
    setHienThiModalDV(false);
    setNVDangSua(null);
    setDVDangSua(null);
    formNV.resetFields();
    formDV.resetFields();
  };

  return (
    <div>
      {/* NHÂN VIÊN */}
      <Card style={{ marginBottom: 24 }}>
        <div style={{ marginBottom: 16 }}>
          <h3>Danh sách Nhân viên</h3>
          <Button type="primary" onClick={() => { setNVDangSua(null); formNV.resetFields(); setHienThiModalNV(true); }}>
            + Thêm Nhân viên
          </Button>
        </div>
        <Table dataSource={danhSachNhanVien} rowKey="id" pagination={{ pageSize: 8 }} columns={[
          { title: 'Tên NV', dataIndex: 'tenNV' },
          { title: 'Giới hạn khách/ngày', dataIndex: 'gioiHanKhach' },
          { title: 'Giờ làm việc', render: (_, r) => `${r.gioBatDau}h - ${r.gioKetThuc}h` },
          { 
            title: 'Thao tác', 
            render: (_, r) => (
              <Space>
                <Button size="small" onClick={() => moModalSuaNV(r)}>Sửa</Button>
                <Popconfirm title="Xóa nhân viên này?" onConfirm={() => xuLyXoaNhanVien(r.id)}>
                  <Button size="small" danger>Xóa</Button>
                </Popconfirm>
              </Space>
            ) 
          }
        ]} />
      </Card>

      {/* DỊCH VỤ */}
      <Card>
        <div style={{ marginBottom: 16 }}>
          <h3>Danh mục Dịch vụ</h3>
          <Button type="primary" onClick={() => { setDVDangSua(null); formDV.resetFields(); setHienThiModalDV(true); }}>
            + Thêm Dịch vụ
          </Button>
        </div>
        <Table dataSource={danhSachDichVu} rowKey="id" pagination={{ pageSize: 8 }} columns={[
          { title: 'Tên Dịch vụ', dataIndex: 'tenDV' },
          { title: 'Giá (VNĐ)', dataIndex: 'gia', render: (gia) => gia.toLocaleString('vi-VN') },
          { title: 'Thời gian (Phút)', dataIndex: 'thoiGianThucHien' },
          { 
            title: 'Thao tác', 
            render: (_, r) => (
              <Space>
                <Button size="small" onClick={() => moModalSuaDV(r)}>Sửa</Button>
                <Popconfirm title="Xóa dịch vụ này?" onConfirm={() => xuLyXoaDichVu(r.id)}>
                  <Button size="small" danger>Xóa</Button>
                </Popconfirm>
              </Space>
            ) 
          }
        ]} />
      </Card>

      {/* MODAL THÊM/SỬA NHÂN VIÊN */}
      <Modal 
        title={nvDangSua ? "Cập nhật Nhân viên" : "Thêm Nhân viên mới"} 
        visible={hienThiModalNV} 
        onCancel={dongModal} 
        onOk={() => formNV.submit()} 
        destroyOnClose
      >
        <Form form={formNV} layout="vertical" onFinish={xuLyThemNhanVien}>
          <Form.Item name="tenNV" label={<Label required>Tên Nhân viên</Label>} rules={[{required: true, message: 'Vui lòng nhập tên'}]}>
            <Input />
          </Form.Item>
          <Form.Item name="gioiHanKhach" label={<Label required>Giới hạn khách/ngày</Label>} rules={[{required: true}]}>
            <InputNumber min={1} style={{width:'100%'}} />
          </Form.Item>
          <Form.Item name="gioBatDau" label={<Label required>Giờ bắt đầu</Label>} rules={[{required: true}]}>
            <InputNumber min={0} max={23} />
          </Form.Item>
          <Form.Item name="gioKetThuc" label={<Label required>Giờ kết thúc</Label>} rules={[{required: true}]}>
            <InputNumber min={1} max={24} />
          </Form.Item>
        </Form>
      </Modal>

      {/* MODAL THÊM/SỬA DỊCH VỤ */}
      <Modal 
        title={dvDangSua ? "Cập nhật Dịch vụ" : "Thêm Dịch vụ mới"} 
        visible={hienThiModalDV} 
        onCancel={dongModal} 
        onOk={() => formDV.submit()} 
        destroyOnClose
      >
        <Form form={formDV} layout="vertical" onFinish={xuLyThemDichVu}>
          <Form.Item name="tenDV" label={<Label required>Tên Dịch vụ</Label>} rules={[{required: true, message: 'Vui lòng nhập tên'}]}>
            <Input />
          </Form.Item>
          <Form.Item name="gia" label={<Label required>Giá tiền (VNĐ)</Label>} rules={[{required: true}]}>
            <InputNumber min={1000} style={{width:'100%'}} />
          </Form.Item>
          <Form.Item name="thoiGianThucHien" label={<Label required>Thời gian làm (Phút)</Label>} rules={[{required: true}]}>
            <InputNumber min={5} style={{width:'100%'}} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default NhanVienDichVu;
