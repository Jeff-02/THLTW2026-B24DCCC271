import React, { useState, useEffect } from 'react';
import { Card, Table, Row, Col, Statistic, Empty, Typography, Select } from 'antd';

const { Text } = Typography;
const { Option } = Select;

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

const ThongKe: React.FC = () => {
  const [danhSachNhanVien, setDanhSachNhanVien] = useState<NhanVien[]>([]);
  const [danhSachDichVu, setDanhSachDichVu] = useState<DichVu[]>([]);
  const [danhSachLichHen, setDanhSachLichHen] = useState<LichHen[]>([]);
  const [loaiThongKe, setLoaiThongKe] = useState<'nhanvien' | 'dichvu' | 'thang'>('nhanvien');

  useEffect(() => {
    let dlNhanVien = localStorage.getItem('dl_nhanvien');
    let dlDichVu = localStorage.getItem('dl_dichvu');
    let dlLichHen = localStorage.getItem('dl_lichhen');

    if (dlNhanVien) setDanhSachNhanVien(JSON.parse(dlNhanVien));
    if (dlDichVu) setDanhSachDichVu(JSON.parse(dlDichVu));
    if (dlLichHen) setDanhSachLichHen(JSON.parse(dlLichHen));
  }, []);


  const layGiaDichVu = (id: string) => {
    for(let i=0; i<danhSachDichVu.length; i++) if(danhSachDichVu[i].id === id) return danhSachDichVu[i].gia;
    return 0;
  };

  const tinhThongKeNhanVien = () => {
    let ketQua = [];
    for(let i = 0; i < danhSachNhanVien.length; i++) {
      let nv = danhSachNhanVien[i];
      let tongLich = 0;
      let tongDoanhThu = 0;
      let tongSao = 0;
      let luotDanhGia = 0;

      for(let j = 0; j < danhSachLichHen.length; j++) {
        let lich = danhSachLichHen[j];
        if (lich.nhanVienId === nv.id && lich.trangThai === 'Hoàn thành') {
          tongLich++;
          tongDoanhThu += layGiaDichVu(lich.dichVuId);
          if (lich.danhGia) {
            tongSao += lich.danhGia.diemSo;
            luotDanhGia++;
          }
        }
      }

      let saoTrungBinh = luotDanhGia === 0 ? 0 : (tongSao / luotDanhGia);

      ketQua.push({
        id: nv.id,
        tenNV: nv.tenNV,
        soLichHoanThanh: tongLich,
        doanhThu: tongDoanhThu,
        danhGia: saoTrungBinh.toFixed(1)
      });
    }
    return ketQua;
  };

  const tinhThongKeDichVu = () => {
    let ketQua = [];
    for(let i = 0; i < danhSachDichVu.length; i++) {
      let dv = danhSachDichVu[i];
      let tongSuDung = 0;
      let tongDoanhThu = 0;
      let tongSao = 0;
      let luotDanhGia = 0;

      for(let j = 0; j < danhSachLichHen.length; j++) {
        let lich = danhSachLichHen[j];
        if (lich.dichVuId === dv.id && lich.trangThai === 'Hoàn thành') {
          tongSuDung++;
          tongDoanhThu += dv.gia;
          if (lich.danhGia) {
            tongSao += lich.danhGia.diemSo;
            luotDanhGia++;
          }
        }
      }

      let saoTrungBinh = luotDanhGia === 0 ? 0 : (tongSao / luotDanhGia);

      ketQua.push({
        id: dv.id,
        tenDV: dv.tenDV,
        giaCoBan: dv.gia,
        soLanSuDung: tongSuDung,
        doanhThu: tongDoanhThu,
        danhGia: saoTrungBinh.toFixed(1)
      });
    }
    return ketQua;
  };

  const tinhThongKeThang = () => {
    let ketQua: any = {};

    for(let i = 0; i < danhSachLichHen.length; i++) {
      let lich = danhSachLichHen[i];
      if (lich.trangThai !== 'Hoàn thành') continue;

      let ngay = lich.ngayGioHen.split(' ')[0]; 
      let thang = ngay.substring(0, 7); 

      if (!ketQua[thang]) {
        ketQua[thang] = { thang, soLich: 0, doanhThu: 0, tongDanhGia: 0, soLuotDanhGia: 0 };
      }

      ketQua[thang].soLich++;
      ketQua[thang].doanhThu += layGiaDichVu(lich.dichVuId);
      
      if (lich.danhGia) {
        ketQua[thang].tongDanhGia += lich.danhGia.diemSo;
        ketQua[thang].soLuotDanhGia++;
      }
    }

    let danhSach = Object.values(ketQua).map((item: any) => ({
      ...item,
      danhGia: item.soLuotDanhGia === 0 ? 0 : (item.tongDanhGia / item.soLuotDanhGia).toFixed(1)
    }));

    return danhSach.sort((a: any, b: any) => a.thang.localeCompare(b.thang));
  };

  const hopDongHoanThanh = danhSachLichHen.filter(l => l.trangThai === 'Hoàn thành').length;
  const hopDongCho = danhSachLichHen.filter(l => l.trangThai === 'Chờ duyệt').length;
  const hopDongXacNhan = danhSachLichHen.filter(l => l.trangThai === 'Xác nhận').length;
  
  const tongDoanhThuChung = danhSachLichHen
    .filter(l => l.trangThai === 'Hoàn thành')
    .reduce((sum, lich) => sum + layGiaDichVu(lich.dichVuId), 0);

  const soLuotDanhGia = danhSachLichHen.filter(l => l.danhGia).length;
  const tongDiemDanhGia = danhSachLichHen
    .filter(l => l.danhGia)
    .reduce((sum, lich) => sum + (lich.danhGia?.diemSo || 0), 0);
  const danhGiaTrungBinh = soLuotDanhGia === 0 ? 0 : (tongDiemDanhGia / soLuotDanhGia).toFixed(1);

  return (
    <div>
      {/* THỐNG KÊ CHUNG */}
      <Card style={{ marginBottom: 24 }}>
        <h3>Thống kê Chung</h3>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={6}>
            <Statistic
              title="Lịch hẹn hoàn thành"
              value={hopDongHoanThanh}
              valueStyle={{ color: '#52c41a' }}
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Statistic
              title="Chờ duyệt"
              value={hopDongCho}
              valueStyle={{ color: '#faad14' }}
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Statistic
              title="Đã xác nhận"
              value={hopDongXacNhan}
              valueStyle={{ color: '#1890ff' }}
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Statistic
              title="Tổng doanh thu"
              value={tongDoanhThuChung}
              suffix="đ"
              valueStyle={{ color: '#1890ff' }}
            />
          </Col>
        </Row>
        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
          <Col xs={24} sm={12} lg={6}>
            <Statistic
              title="Đánh giá trung bình"
              value={parseFloat(danhGiaTrungBinh as string)}
              precision={1}
              suffix="/5"
              valueStyle={{ color: '#faad14' }}
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Statistic
              title="Số lần đánh giá"
              value={soLuotDanhGia}
            />
          </Col>
        </Row>
      </Card>

      {/* LỰA CHỌN LOẠI THỐNG KÊ */}
      <Card style={{ marginBottom: 24 }}>
        <div style={{ marginBottom: 16 }}>
          <Text strong>Chọn loại thống kê: </Text>
          <Select value={loaiThongKe} onChange={setLoaiThongKe} style={{ width: 300, marginLeft: 8 }}>
            <Option value="nhanvien">Thống kê theo Nhân viên</Option>
            <Option value="dichvu">Thống kê theo Dịch vụ</Option>
            <Option value="thang">Thống kê theo Tháng</Option>
          </Select>
        </div>

        {loaiThongKe === 'nhanvien' && (
          <div>
            <h4>Thống kê Doanh thu & Đánh giá theo Nhân viên (Chỉ tính lịch Hoàn thành)</h4>
            {tinhThongKeNhanVien().length === 0 ? (
              <Empty description="Chưa có dữ liệu" />
            ) : (
              <Table dataSource={tinhThongKeNhanVien()} rowKey="id" pagination={false} size="small" columns={[
                { title: 'Tên Nhân viên', dataIndex: 'tenNV' },
                { title: 'Số lịch phục vụ', dataIndex: 'soLichHoanThanh', align: 'center' as const },
                { title: 'Doanh thu (VNĐ)', dataIndex: 'doanhThu', render: (dt) => <Text style={{ color: 'green' }} strong>{dt.toLocaleString('vi-VN')} đ</Text> },
                { title: 'Đánh giá TB', dataIndex: 'danhGia', render: (dg) => <Text>{dg}/5 ⭐</Text>, align: 'center' as const }
              ]} />
            )}
          </div>
        )}

        {loaiThongKe === 'dichvu' && (
          <div>
            <h4>Thống kê Doanh thu & Đánh giá theo Dịch vụ (Chỉ tính lịch Hoàn thành)</h4>
            {tinhThongKeDichVu().length === 0 ? (
              <Empty description="Chưa có dữ liệu" />
            ) : (
              <Table dataSource={tinhThongKeDichVu()} rowKey="id" pagination={false} size="small" columns={[
                { title: 'Tên Dịch vụ', dataIndex: 'tenDV' },
                { title: 'Giá cơ bản (VNĐ)', dataIndex: 'giaCoBan', render: (gia) => gia.toLocaleString('vi-VN') },
                { title: 'Số lần sử dụng', dataIndex: 'soLanSuDung', align: 'center' as const },
                { title: 'Tổng doanh thu (VNĐ)', dataIndex: 'doanhThu', render: (dt) => <Text style={{ color: 'green' }} strong>{dt.toLocaleString('vi-VN')} đ</Text> },
                { title: 'Đánh giá TB', dataIndex: 'danhGia', render: (dg) => <Text>{dg}/5 ⭐</Text>, align: 'center' as const }
              ]} />
            )}
          </div>
        )}

        {loaiThongKe === 'thang' && (
          <div>
            <h4>Thống kê Doanh thu & Đánh giá theo Tháng (Chỉ tính lịch Hoàn thành)</h4>
            {tinhThongKeThang().length === 0 ? (
              <Empty description="Chưa có dữ liệu" />
            ) : (
              <Table dataSource={tinhThongKeThang()} rowKey="thang" pagination={false} size="small" columns={[
                { title: 'Tháng', dataIndex: 'thang' },
                { title: 'Số lịch hoàn thành', dataIndex: 'soLich', align: 'center' as const },
                { title: 'Doanh thu (VNĐ)', dataIndex: 'doanhThu', render: (dt) => <Text style={{ color: 'green' }} strong>{dt.toLocaleString('vi-VN')} đ</Text> },
                { title: 'Đánh giá TB', dataIndex: 'danhGia', render: (dg) => <Text>{dg}/5 ⭐</Text>, align: 'center' as const }
              ]} />
            )}
          </div>
        )}
      </Card>
    </div>
  );
};

export default ThongKe;
