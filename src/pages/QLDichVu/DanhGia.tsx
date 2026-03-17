import React, { useState, useEffect } from 'react';
import { 
  Card, Button, Form, Input, Table, Modal, message, Rate, Typography, Empty
} from 'antd';

const { Text } = Typography;

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

interface DanhGia {
  diemSo: number;
  nhanXetCuaKhach: string;
  phanHoiCuaNhanVien: string;
}

interface LichHen {
  id: string;
  tenKhachHang: string;
  soDienThoai: string;
  nhanVienId: string;
  dichVuId: string;
  ngayGioHen: string;
  trangThai: 'Chờ duyệt' | 'Xác nhận' | 'Hoàn thành' | 'Hủy';
  danhGia: DanhGia | null;
}

const DanhGia: React.FC = () => {
  const [danhSachNhanVien, setDanhSachNhanVien] = useState<NhanVien[]>([]);
  const [danhSachLichHen, setDanhSachLichHen] = useState<LichHen[]>([]);
  const [lichHenDangChon, setLichHenDangChon] = useState<LichHen | null>(null);
  
  const [hienThiModal, setHienThiModal] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    let dlNhanVien = localStorage.getItem('dl_nhanvien');
    let dlLichHen = localStorage.getItem('dl_lichhen');

    if (dlNhanVien) setDanhSachNhanVien(JSON.parse(dlNhanVien));
    if (dlLichHen) setDanhSachLichHen(JSON.parse(dlLichHen));
  }, []);

  const layTenNhanVien = (id: string) => {
    for(let i=0; i<danhSachNhanVien.length; i++) if(danhSachNhanVien[i].id === id) return danhSachNhanVien[i].tenNV;
    return 'Không rõ';
  };

  const moBangDanhGia = (lich: LichHen) => {
    setLichHenDangChon(lich);
    if (lich.danhGia) {
      form.setFieldsValue({
        diemSo: lich.danhGia.diemSo,
        nhanXetCuaKhach: lich.danhGia.nhanXetCuaKhach,
        phanHoiCuaNhanVien: lich.danhGia.phanHoiCuaNhanVien
      });
    } else {
      form.resetFields();
    }
    setHienThiModal(true);
  };

  const xuLyLuuDanhGia = (values: any) => {
    let mangMoi = [...danhSachLichHen];
    for(let i = 0; i < mangMoi.length; i++) {
      if(mangMoi[i].id === lichHenDangChon?.id) {
        mangMoi[i].danhGia = {
          diemSo: values.diemSo,
          nhanXetCuaKhach: values.nhanXetCuaKhach,
          phanHoiCuaNhanVien: values.phanHoiCuaNhanVien || ""
        };
      }
    }
    setDanhSachLichHen(mangMoi);
    localStorage.setItem('dl_lichhen', JSON.stringify(mangMoi));
    setHienThiModal(false);
    message.success('Đã lưu đánh giá/phản hồi');
  };

  const lichHoanThanh = danhSachLichHen.filter(l => l.trangThai === 'Hoàn thành');

  return (
    <Card title={<h3 style={{ margin: 0 }}>Đánh giá Dịch vụ & Nhân viên</h3>} bordered={false}>
      {lichHoanThanh.length === 0 ? (
        <Empty description="Chưa có lịch hẹn hoàn thành nào" />
      ) : (
        <Table dataSource={lichHoanThanh} rowKey="id" pagination={{ pageSize: 8 }} columns={[
          { title: 'Khách hàng', dataIndex: 'tenKhachHang', width: 150 },
          { title: 'Nhân viên', render: (_, r) => layTenNhanVien(r.nhanVienId), width: 140 },
          { title: 'Ngày hẹn', dataIndex: 'ngayGioHen', width: 160 },
          { 
            title: 'Điểm đánh giá', 
            render: (_, r) => r.danhGia ? <Rate disabled defaultValue={r.danhGia.diemSo} /> : <Text type="secondary">Chưa có</Text>, 
            width: 150 
          },
          { 
            title: 'Nhận xét khách', 
            dataIndex: 'danhGia',
            render: (dg) => dg?.nhanXetCuaKhach || '-',
            ellipsis: true
          },
          { 
            title: 'Thao tác', 
            render: (_, r) => (
              <Button type="primary" onClick={() => moBangDanhGia(r)} size="small">
                {r.danhGia ? 'Xem & Sửa' : 'Thêm Đánh giá'}
              </Button>
            ),
            width: 140
          }
        ]} />
      )}

      {/* MODAL ĐÁNH GIÁ */}
      <Modal 
        title="Đánh giá & Phản hồi" 
        visible={hienThiModal} 
        onCancel={() => setHienThiModal(false)} 
        onOk={() => form.submit()} 
        destroyOnClose
        width={600}
      >
        <div style={{ marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid #f0f0f0' }}>
          <Text strong>Khách hàng: {lichHenDangChon?.tenKhachHang}</Text><br/>
          <Text>Nhân viên: {layTenNhanVien(lichHenDangChon?.nhanVienId || '')}</Text><br/>
          <Text type="secondary">Lịch hẹn: {lichHenDangChon?.ngayGioHen}</Text>
        </div>
        
        <Form form={form} layout="vertical" onFinish={xuLyLuuDanhGia}>
          <Form.Item name="diemSo" label={<Label required>Điểm đánh giá (Sao)</Label>} rules={[{required: true, message: 'Vui lòng chọn điểm'}]}>
            <Rate allowHalf tooltips={['Rất tệ', 'Tệ', 'Bình thường', 'Tốt', 'Xuất sắc']} />
          </Form.Item>
          <Form.Item name="nhanXetCuaKhach" label={<Label required>Nhận xét của khách hàng</Label>} rules={[{required: true, message: 'Vui lòng nhập nhận xét'}]}>
            <Input.TextArea rows={3} placeholder="Nhập nhận xét..." />
          </Form.Item>
          <Form.Item name="phanHoiCuaNhanVien" label="Phản hồi từ nhân viên (Tùy chọn)">
            <Input.TextArea rows={3} placeholder="Phản hồi từ nhân viên (không bắt buộc)..." />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default DanhGia;
