import React, { useState, useEffect } from 'react';
import { Card, Button, Form, Input, Select, Table, Modal, Popconfirm, message, Space, Tag, DatePicker } from 'antd';
import moment from 'moment';

const { Option } = Select;

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

interface LichHen {
  id: string;
  tenKhachHang: string;
  soDienThoai: string;
  nhanVienId: string;
  dichVuId: string;
  ngayGioHen: string;
  trangThai: 'Chờ duyệt' | 'Xác nhận' | 'Hoàn thành' | 'Hủy';
}

const LichHen: React.FC = () => {
  const [danhSachNhanVien, setDanhSachNhanVien] = useState<NhanVien[]>([]);
  const [danhSachDichVu, setDanhSachDichVu] = useState<DichVu[]>([]);
  const [danhSachLichHen, setDanhSachLichHen] = useState<LichHen[]>([]);

  const [hienThiModal, setHienThiModal] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    let dlNhanVien = localStorage.getItem('dl_nhanvien');
    let dlDichVu = localStorage.getItem('dl_dichvu');
    let dlLichHen = localStorage.getItem('dl_lichhen');

    if (dlNhanVien) setDanhSachNhanVien(JSON.parse(dlNhanVien));
    if (dlDichVu) setDanhSachDichVu(JSON.parse(dlDichVu));
    if (dlLichHen) setDanhSachLichHen(JSON.parse(dlLichHen));
  }, []);

  const layTenNhanVien = (id: string) => {
    for(let i=0; i<danhSachNhanVien.length; i++) if(danhSachNhanVien[i].id === id) return danhSachNhanVien[i].tenNV;
    return 'Không rõ';
  };

  const layTenDichVu = (id: string) => {
    for(let i=0; i<danhSachDichVu.length; i++) if(danhSachDichVu[i].id === id) return danhSachDichVu[i].tenDV;
    return 'Không rõ';
  };

  const xuLyDatLich = (values: any) => {
    let thoiGianChon = values.ngayGioHen;
    let gioChon = thoiGianChon.hour();
    let ngayChonStr = thoiGianChon.format('YYYY-MM-DD');
    let ngayGioChonStr = thoiGianChon.format('YYYY-MM-DD HH:mm');

    let nhanVienPhuHop = null;
    for (let i = 0; i < danhSachNhanVien.length; i++) {
      if (danhSachNhanVien[i].id === values.nhanVienId) {
        nhanVienPhuHop = danhSachNhanVien[i];
      }
    }

    if (!nhanVienPhuHop) return message.error('Không tìm thấy nhân viên!');

    if (gioChon < nhanVienPhuHop.gioBatDau || gioChon >= nhanVienPhuHop.gioKetThuc) {
      return message.error(`Nhân viên này chỉ làm việc từ ${nhanVienPhuHop.gioBatDau}h đến ${nhanVienPhuHop.gioKetThuc}h!`);
    }

    let soKhachTrongNgay = 0;
    let biTrungLich = false;

    for (let i = 0; i < danhSachLichHen.length; i++) {
      let lichCu = danhSachLichHen[i];
      
      if (lichCu.trangThai === 'Hủy') continue;

      if (lichCu.nhanVienId === values.nhanVienId) {
        let ngayCuStr = moment(lichCu.ngayGioHen).format('YYYY-MM-DD');
        
        if (ngayCuStr === ngayChonStr) {
          soKhachTrongNgay = soKhachTrongNgay + 1;
        }

        if (lichCu.ngayGioHen === ngayGioChonStr) {
          biTrungLich = true;
        }
      }
    }

    if (soKhachTrongNgay >= nhanVienPhuHop.gioiHanKhach) {
      return message.error('Nhân viên này đã kín lịch (đạt giới hạn khách) trong ngày hôm đó!');
    }

    if (biTrungLich === true) {
      return message.error('Khung giờ này nhân viên đã có khách đặt rồi, vui lòng chọn giờ khác!');
    }

    // Lưu lịch hẹn mới
    let lichMoi: LichHen = {
      id: 'LH' + Date.now(),
      tenKhachHang: values.tenKhachHang,
      soDienThoai: values.soDienThoai,
      nhanVienId: values.nhanVienId,
      dichVuId: values.dichVuId,
      ngayGioHen: ngayGioChonStr,
      trangThai: 'Chờ duyệt'
    };

    let mangMoi = [lichMoi, ...danhSachLichHen];
    setDanhSachLichHen(mangMoi);
    localStorage.setItem('dl_lichhen', JSON.stringify(mangMoi));
    setHienThiModal(false);
    form.resetFields();
    message.success('Đặt lịch thành công, vui lòng chờ duyệt!');
    return;
  };

  // CẬP NHẬT TRẠNG THÁI
  const capNhatTrangThai = (id: string, trangThaiMoi: any) => {
    let mangMoi = [...danhSachLichHen];
    for(let i = 0; i < mangMoi.length; i++) {
      if(mangMoi[i].id === id) {
        mangMoi[i].trangThai = trangThaiMoi;
      }
    }
    setDanhSachLichHen(mangMoi);
    localStorage.setItem('dl_lichhen', JSON.stringify(mangMoi));
    message.success('Đã cập nhật trạng thái');
  };

  const xuLyXoaLichHen = (id: string) => {
    capNhatTrangThai(id, 'Hủy');
  };

  return (
    <Card title={<h3 style={{ margin: 0 }}>Quản lý Lịch hẹn</h3>} bordered={false}>
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={() => setHienThiModal(true)}>
          + Tạo Lịch Hẹn Mới
        </Button>
      </div>

      <Table dataSource={danhSachLichHen} rowKey="id" pagination={{ pageSize: 8 }} columns={[
        { title: 'Khách hàng', dataIndex: 'tenKhachHang', width: 150 },
        { title: 'SĐT', dataIndex: 'soDienThoai', width: 120 },
        { title: 'Nhân viên', render: (_, r) => layTenNhanVien(r.nhanVienId), width: 140 },
        { title: 'Dịch vụ', render: (_, r) => layTenDichVu(r.dichVuId), width: 140 },
        { title: 'Ngày giờ hẹn', dataIndex: 'ngayGioHen', width: 160 },
        { title: 'Trạng thái', render: (_, r) => {
            let color = r.trangThai === 'Xác nhận' ? 'blue' : r.trangThai === 'Hoàn thành' ? 'green' : r.trangThai === 'Hủy' ? 'red' : 'orange';
            return <Tag color={color}>{r.trangThai}</Tag>;
        }, width: 120},
        { title: 'Thao tác', render: (_, r) => (
          <Space size="small">
            {r.trangThai === 'Chờ duyệt' && <Button size="small" type="primary" onClick={() => capNhatTrangThai(r.id, 'Xác nhận')}>Duyệt</Button>}
            {r.trangThai === 'Xác nhận' && <Button size="small" onClick={() => capNhatTrangThai(r.id, 'Hoàn thành')}>Xong</Button>}
            {(r.trangThai === 'Chờ duyệt' || r.trangThai === 'Xác nhận') && <Popconfirm title="Hủy lịch này?" onConfirm={() => xuLyXoaLichHen(r.id)}><Button size="small" danger>Hủy</Button></Popconfirm>}
          </Space>
        ) }
      ]} />

      {/* MODAL ĐẶT LỊCH */}
      <Modal title="Đặt Lịch Hẹn Mới" visible={hienThiModal} onCancel={() => setHienThiModal(false)} onOk={() => form.submit()} destroyOnClose>
        <Form form={form} layout="vertical" onFinish={xuLyDatLich}>
          <Form.Item name="tenKhachHang" label={<Label required>Tên Khách hàng</Label>} rules={[{required: true, message: 'Vui lòng nhập tên'}]}>
            <Input />
          </Form.Item>
          <Form.Item name="soDienThoai" label={<Label required>Số điện thoại</Label>} rules={[{required: true, message: 'Vui lòng nhập SĐT'}]}>
            <Input />
          </Form.Item>
          <Form.Item name="nhanVienId" label={<Label required>Chọn Nhân viên</Label>} rules={[{required: true, message: 'Vui lòng chọn'}]}>
            <Select placeholder="Chọn nhân viên">
              {danhSachNhanVien.map(nv => <Option key={nv.id} value={nv.id}>{nv.tenNV} ({nv.gioBatDau}h-{nv.gioKetThuc}h)</Option>)}
            </Select>
          </Form.Item>
          <Form.Item name="dichVuId" label={<Label required>Chọn Dịch vụ</Label>} rules={[{required: true, message: 'Vui lòng chọn'}]}>
            <Select placeholder="Chọn dịch vụ">
              {danhSachDichVu.map(dv => <Option key={dv.id} value={dv.id}>{dv.tenDV} - {dv.gia.toLocaleString()}đ</Option>)}
            </Select>
          </Form.Item>
          <Form.Item name="ngayGioHen" label={<Label required>Ngày Giờ Hẹn</Label>} rules={[{required: true, message: 'Vui lòng chọn'}]}>
            <DatePicker showTime format="YYYY-MM-DD HH:mm" style={{width:'100%'}} />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default LichHen;
