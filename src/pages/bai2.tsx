import React, { useState, useEffect } from 'react';
import { 
  Card, Tabs, Button, Form, Input, Select, Table, Modal, 
  Popconfirm, message, Space, Tag, Typography, InputNumber 
} from 'antd';
import { PlusOutlined, DeleteOutlined, SettingOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;

// Định nghĩa các kiểu dữ liệu
interface KhoiKienThuc { id: string; tenKhoi: string; }
interface MonHoc { maMon: string; tenMon: string; soTinChi: number; }
interface CauHoi { maCH: string; maMon: string; noiDung: string; doKho: string; maKhoi: string; }
interface ChiTietCauTruc { maKhoi: string; doKho: string; soLuong: number; }
interface DeThi { id: string; tenDe: string; maMon: string; danhSachCauHoi: CauHoi[]; }

const Bai2: React.FC = () => {
  // --- Các State chứa dữ liệu ---
  const [danhSachKhoi, setDanhSachKhoi] = useState<KhoiKienThuc[]>([]);
  const [danhSachMon, setDanhSachMon] = useState<MonHoc[]>([]);
  const [nganHangCauHoi, setNganHangCauHoi] = useState<CauHoi[]>([]);
  const [danhSachDeThi, setDanhSachDeThi] = useState<DeThi[]>([]);

  // State bộ lọc tìm kiếm
  const [locMonHoc, setLocMonHoc] = useState<string>('');
  const [locDoKho, setLocDoKho] = useState<string>('');
  const [locKhoiKT, setLocKhoiKT] = useState<string>('');

  // State quản lý việc hiển thị (bật/tắt) các Modal (Sử dụng cho visible)
  const [hienThiModalKhoi, setHienThiModalKhoi] = useState(false);
  const [hienThiModalMon, setHienThiModalMon] = useState(false);
  const [hienThiModalCauHoi, setHienThiModalCauHoi] = useState(false);
  const [hienThiModalTaoDe, setHienThiModalTaoDe] = useState(false);
  const [hienThiModalXemDe, setHienThiModalXemDe] = useState(false);

  // State phục vụ tạo đề thi
  const [cauTrucDangTao, setCauTrucDangTao] = useState<ChiTietCauTruc[]>([]);
  const [monHocDuocChonDeTao, setMonHocDuocChonDeTao] = useState<string>('');
  const [deThiDangXem, setDeThiDangXem] = useState<DeThi | null>(null);

  // Form của Ant Design
  const [formKhoi] = Form.useForm();
  const [formMon] = Form.useForm();
  const [formCauHoi] = Form.useForm();
  const [formChiTietDe] = Form.useForm();
  const [formLuuCauTruc] = Form.useForm();

  // Hàm chạy 1 lần lúc trang web vừa tải xong để lấy dữ liệu từ localStorage
  useEffect(() => {
    let dlKhoi = localStorage.getItem('bt2_khoi');
    let dlMon = localStorage.getItem('bt2_mon');
    let dlCauHoi = localStorage.getItem('bt2_cauhoi');
    let dlDeThi = localStorage.getItem('bt2_dethi');

    // Nạp Khối kiến thức
    if (dlKhoi) {
      setDanhSachKhoi(JSON.parse(dlKhoi));
    } else {
      let khoiMacDinh = [
        { id: 'K1', tenKhoi: 'Tổng quan' }, 
        { id: 'K2', tenKhoi: 'Chuyên sâu' }
      ];
      setDanhSachKhoi(khoiMacDinh);
      localStorage.setItem('bt2_khoi', JSON.stringify(khoiMacDinh));
    }

    // Nạp Môn học
    if (dlMon) {
      setDanhSachMon(JSON.parse(dlMon));
    } else {
      let monMacDinh = [{ maMon: 'IT01', tenMon: 'Lập trình Web', soTinChi: 3 }];
      setDanhSachMon(monMacDinh);
      localStorage.setItem('bt2_mon', JSON.stringify(monMacDinh));
    }

    if (dlCauHoi) setNganHangCauHoi(JSON.parse(dlCauHoi));
    if (dlDeThi) setDanhSachDeThi(JSON.parse(dlDeThi));
  }, []);

  // --- CÁC HÀM THÊM / XÓA ---
  const xuLyThemKhoi = (values: any) => {
    let khoiMoi = { id: 'K' + Date.now(), tenKhoi: values.tenKhoi };
    let mangMoi = [...danhSachKhoi, khoiMoi];
    
    setDanhSachKhoi(mangMoi);
    localStorage.setItem('bt2_khoi', JSON.stringify(mangMoi)); // Sinh viên lưu trực tiếp
    setHienThiModalKhoi(false);
    formKhoi.resetFields();
    message.success('Thêm khối kiến thức thành công');
  };

  const xuLyThemMon = (values: any) => {
    let monMoi = { maMon: values.maMon, tenMon: values.tenMon, soTinChi: values.soTinChi };
    let mangMoi = [...danhSachMon, monMoi];

    setDanhSachMon(mangMoi);
    localStorage.setItem('bt2_mon', JSON.stringify(mangMoi));
    setHienThiModalMon(false);
    formMon.resetFields();
    message.success('Thêm môn học thành công');
  };

  const xuLyThemCauHoi = (values: any) => {
    let cauHoiMoi = { 
      maCH: values.maCH, 
      maMon: values.maMon, 
      noiDung: values.noiDung, 
      doKho: values.doKho, 
      maKhoi: values.maKhoi 
    };
    let mangMoi = [...nganHangCauHoi, cauHoiMoi];

    setNganHangCauHoi(mangMoi);
    localStorage.setItem('bt2_cauhoi', JSON.stringify(mangMoi));
    setHienThiModalCauHoi(false);
    formCauHoi.resetFields();
    message.success('Thêm câu hỏi thành công');
  };

  const xuLyXoaCauHoi = (maCH: string) => {
    let mangMoi = [];
    for(let i = 0; i < nganHangCauHoi.length; i++) {
      if(nganHangCauHoi[i].maCH !== maCH) {
        mangMoi.push(nganHangCauHoi[i]);
      }
    }
    setNganHangCauHoi(mangMoi);
    localStorage.setItem('bt2_cauhoi', JSON.stringify(mangMoi));
    message.success('Đã xóa câu hỏi');
  };

  // --- CHỨC NĂNG TẠO ĐỀ THI ---
  const themYeuCauVaoCauTruc = (values: any) => {
    let mangTam = [...cauTrucDangTao];
    let daCoTrongMang = false;

    // Tìm xem đã có khối này và độ khó này trong bảng chưa
    for (let i = 0; i < mangTam.length; i++) {
      if (mangTam[i].maKhoi === values.maKhoi && mangTam[i].doKho === values.doKho) {
        mangTam[i].soLuong = mangTam[i].soLuong + values.soLuong;
        daCoTrongMang = true;
      }
    }

    if (daCoTrongMang === false) {
      mangTam.push({ maKhoi: values.maKhoi, doKho: values.doKho, soLuong: values.soLuong });
    }

    setCauTrucDangTao(mangTam);
    formChiTietDe.resetFields();
  };

  const xoaYeuCauKhoiCauTruc = (index: number) => {
    let mangTam = [...cauTrucDangTao];
    mangTam.splice(index, 1); 
    setCauTrucDangTao(mangTam);
  };

  const xuLySinhDeThi = (values: any) => {
    if (monHocDuocChonDeTao === '') {
      message.error("Vui lòng chọn môn học trước!");
      return;
    }
    if (cauTrucDangTao.length === 0) {
      message.error("Cấu trúc đề đang trống, vui lòng thêm yêu cầu!");
      return;
    }

    let danhSachCauHoiCuaDeMoi: CauHoi[] = [];
    let kiemTraDuCauHoi = true;
    let cauBaoLoi = "";

    // Duyệt qua từng dòng yêu cầu trong cấu trúc đề
    for (let i = 0; i < cauTrucDangTao.length; i++) {
      let yeuCau = cauTrucDangTao[i];
      let danhSachPhuHop: CauHoi[] = [];

      // Lọc thủ công tìm câu hỏi phù hợp trong ngân hàng
      for (let j = 0; j < nganHangCauHoi.length; j++) {
        let ch = nganHangCauHoi[j];
        if (ch.maMon === monHocDuocChonDeTao && ch.maKhoi === yeuCau.maKhoi && ch.doKho === yeuCau.doKho) {
          danhSachPhuHop.push(ch);
        }
      }

      // Kiểm tra xem số lượng câu hỏi trong kho có đủ không
      if (danhSachPhuHop.length < yeuCau.soLuong) {
        kiemTraDuCauHoi = false;
        cauBaoLoi = "Lỗi: Mức độ " + yeuCau.doKho + " (Khối " + layTenKhoi(yeuCau.maKhoi) + ") yêu cầu " + yeuCau.soLuong + " câu nhưng kho chỉ có " + danhSachPhuHop.length + " câu.";
        break; // Dừng vòng lặp ngay
      } else {
        // Trộn ngẫu nhiên câu hỏi bằng sort và random (Cách sinh viên hay làm)
        let cauHoiDaTron = danhSachPhuHop.sort(() => 0.5 - Math.random());
        
        // Bốc đủ số lượng câu hỏi yêu cầu bỏ vào đề thi
        for (let k = 0; k < yeuCau.soLuong; k++) {
          danhSachCauHoiCuaDeMoi.push(cauHoiDaTron[k]);
        }
      }
    }

    if (kiemTraDuCauHoi === false) {
      message.error(cauBaoLoi);
      return;
    }

    // Đủ câu hỏi -> Tiến hành lưu Đề thi
    let deThiMoi = {
      id: 'DE' + Date.now(),
      tenDe: values.tenDeThi,
      maMon: monHocDuocChonDeTao,
      danhSachCauHoi: danhSachCauHoiCuaDeMoi
    };

    let mangDeThiMoi = [...danhSachDeThi, deThiMoi];
    setDanhSachDeThi(mangDeThiMoi);
    localStorage.setItem('bt2_dethi', JSON.stringify(mangDeThiMoi));

    message.success("Tuyệt vời! Đã tạo đề thi thành công!");
    setHienThiModalTaoDe(false);
    setCauTrucDangTao([]);
    formLuuCauTruc.resetFields();
  };

  // --- CÁC HÀM TIỆN ÍCH TÌM TÊN ---
  const layTenMon = (maMon: string) => {
    for(let i=0; i<danhSachMon.length; i++) {
      if(danhSachMon[i].maMon === maMon) return danhSachMon[i].tenMon;
    }
    return maMon;
  };

  const layTenKhoi = (idKhoi: string) => {
    for(let i=0; i<danhSachKhoi.length; i++) {
      if(danhSachKhoi[i].id === idKhoi) return danhSachKhoi[i].tenKhoi;
    }
    return idKhoi;
  };

  // --- LỌC CÂU HỎI HIỂN THỊ (Viết kiểu thủ công dễ hiểu) ---
  const layDanhSachCauHoiHienThi = () => {
    let ketQua = [];
    for(let i = 0; i < nganHangCauHoi.length; i++) {
      let ch = nganHangCauHoi[i];
      let thoaManKhoi = true;

      if (locMonHoc !== '' && ch.maMon !== locMonHoc) thoaManKhoi = false;
      if (locDoKho !== '' && ch.doKho !== locDoKho) thoaManKhoi = false;
      if (locKhoiKT !== '' && ch.maKhoi !== locKhoiKT) thoaManKhoi = false;

      if (thoaManKhoi === true) {
        ketQua.push(ch);
      }
    }
    return ketQua;
  };

  return (
    <Card title={<Title level={3} style={{ margin: 0 }}>Bài 2: Ngân hàng câu hỏi & Đề thi</Title>} bordered={false}>
      <Tabs defaultActiveKey="3">
        
        {/* --- TAB 1: KHỐI KIẾN THỨC --- */}
        <Tabs.TabPane tab="1. Khối kiến thức" key="1">
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setHienThiModalKhoi(true)} style={{ marginBottom: 16 }}>Thêm khối kiến thức</Button>
          <Table dataSource={danhSachKhoi} rowKey="id" pagination={{ pageSize: 5 }} columns={[
            { title: 'Mã khối', dataIndex: 'id' }, 
            { title: 'Tên khối', dataIndex: 'tenKhoi' }
          ]} />
        </Tabs.TabPane>

        {/* --- TAB 2: MÔN HỌC --- */}
        <Tabs.TabPane tab="2. Môn học" key="2">
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setHienThiModalMon(true)} style={{ marginBottom: 16 }}>Thêm môn học</Button>
          <Table dataSource={danhSachMon} rowKey="maMon" pagination={{ pageSize: 5 }} columns={[ 
            { title: 'Mã môn', dataIndex: 'maMon' }, 
            { title: 'Tên môn', dataIndex: 'tenMon' }, 
            { title: 'Số tín chỉ', dataIndex: 'soTinChi' } 
          ]} />
        </Tabs.TabPane>

        {/* --- TAB 3: NGÂN HÀNG CÂU HỎI --- */}
        <Tabs.TabPane tab="3. Ngân hàng câu hỏi" key="3">
          <Space style={{ marginBottom: 16 }}>
            <Select placeholder="Lọc theo môn" allowClear style={{ width: 150 }} onChange={val => setLocMonHoc(val || '')}>
              {danhSachMon.map(m => <Option key={m.maMon} value={m.maMon}>{m.tenMon}</Option>)}
            </Select>
            <Select placeholder="Lọc độ khó" allowClear style={{ width: 150 }} onChange={val => setLocDoKho(val || '')}>
              <Option value="Dễ">Dễ</Option>
              <Option value="Trung bình">Trung bình</Option>
              <Option value="Khó">Khó</Option>
              <Option value="Rất khó">Rất khó</Option>
            </Select>
            <Select placeholder="Lọc khối kiến thức" allowClear style={{ width: 180 }} onChange={val => setLocKhoiKT(val || '')}>
              {danhSachKhoi.map(k => <Option key={k.id} value={k.id}>{k.tenKhoi}</Option>)}
            </Select>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setHienThiModalCauHoi(true)}>Thêm câu hỏi mới</Button>
          </Space>
          <Table dataSource={layDanhSachCauHoiHienThi()} rowKey="maCH" pagination={{ pageSize: 5 }} columns={[
            { title: 'Mã CH', dataIndex: 'maCH' },
            { title: 'Nội dung', dataIndex: 'noiDung' },
            { title: 'Môn học', render: (_, r) => layTenMon(r.maMon) },
            { title: 'Độ khó', render: (_, r) => {
                let mauSac = 'default';
                if(r.doKho === 'Dễ') mauSac = 'green';
                else if(r.doKho === 'Trung bình') mauSac = 'blue';
                else if(r.doKho === 'Khó') mauSac = 'orange';
                else if(r.doKho === 'Rất khó') mauSac = 'red';
                return <Tag color={mauSac}>{r.doKho}</Tag>;
            }},
            { title: 'Khối KT', render: (_, r) => layTenKhoi(r.maKhoi) },
            { title: 'Xóa', render: (_, r) => <Popconfirm title="Xóa câu này?" onConfirm={() => xuLyXoaCauHoi(r.maCH)}><Button danger icon={<DeleteOutlined/>}/></Popconfirm> }
          ]} />
        </Tabs.TabPane>

        {/* --- TAB 4: QUẢN LÝ ĐỀ THI --- */}
        <Tabs.TabPane tab="4. Quản lý Đề thi" key="4">
          <Button type="primary" icon={<SettingOutlined />} onClick={() => setHienThiModalTaoDe(true)} style={{ marginBottom: 16 }}>Tạo Đề Thi Mới</Button>
          <Table dataSource={danhSachDeThi} rowKey="id" pagination={{ pageSize: 5 }} columns={[
            { title: 'Mã Đề', dataIndex: 'id' },
            { title: 'Tên Đề Thi', dataIndex: 'tenDe' },
            { title: 'Môn thi', render: (_, r) => layTenMon(r.maMon) },
            { title: 'Số lượng câu', render: (_, r) => r.danhSachCauHoi.length + ' câu' },
            { title: 'Thao tác', render: (_, r) => <Button type="dashed" onClick={() => { setDeThiDangXem(r); setHienThiModalXemDe(true); }}>Xem đề</Button> }
          ]} />
        </Tabs.TabPane>
      </Tabs>

      {/* --- CÁC BẢNG MODAL (Dùng visible thay vì open) --- */}
      <Modal title="Thêm Khối Kiến Thức" visible={hienThiModalKhoi} onCancel={() => setHienThiModalKhoi(false)} onOk={() => formKhoi.submit()} destroyOnClose>
        <Form form={formKhoi} layout="vertical" onFinish={xuLyThemKhoi}>
          <Form.Item name="tenKhoi" label="Tên Khối" rules={[{required: true, message: 'Nhập tên khối'}]}><Input /></Form.Item>
        </Form>
      </Modal>

      <Modal title="Thêm Môn Học Mới" visible={hienThiModalMon} onCancel={() => setHienThiModalMon(false)} onOk={() => formMon.submit()} destroyOnClose>
        <Form form={formMon} layout="vertical" onFinish={xuLyThemMon}>
          <Form.Item name="maMon" label="Mã Môn" rules={[{required: true}]}><Input /></Form.Item>
          <Form.Item name="tenMon" label="Tên Môn" rules={[{required: true}]}><Input /></Form.Item>
          <Form.Item name="soTinChi" label="Số tín chỉ" rules={[{required: true}]}><InputNumber min={1} style={{width:'100%'}} /></Form.Item>
        </Form>
      </Modal>

      <Modal title="Nhập Câu Hỏi Vào Ngân Hàng" visible={hienThiModalCauHoi} onCancel={() => setHienThiModalCauHoi(false)} onOk={() => formCauHoi.submit()} destroyOnClose>
        <Form form={formCauHoi} layout="vertical" onFinish={xuLyThemCauHoi}>
          <Form.Item name="maCH" label="Mã Câu Hỏi" rules={[{required: true}]}><Input /></Form.Item>
          <Form.Item name="maMon" label="Môn học" rules={[{required: true}]}>
            <Select>{danhSachMon.map(m => <Option key={m.maMon} value={m.maMon}>{m.tenMon}</Option>)}</Select>
          </Form.Item>
          <Form.Item name="maKhoi" label="Khối kiến thức" rules={[{required: true}]}>
            <Select>{danhSachKhoi.map(k => <Option key={k.id} value={k.id}>{k.tenKhoi}</Option>)}</Select>
          </Form.Item>
          <Form.Item name="doKho" label="Mức độ khó" rules={[{required: true}]}>
            <Select>
              <Option value="Dễ">Dễ</Option>
              <Option value="Trung bình">Trung bình</Option>
              <Option value="Khó">Khó</Option>
              <Option value="Rất khó">Rất khó</Option>
            </Select>
          </Form.Item>
          <Form.Item name="noiDung" label="Nội dung câu hỏi" rules={[{required: true}]}><Input.TextArea rows={4}/></Form.Item>
        </Form>
      </Modal>

      {/* MODAL TẠO ĐỀ THI LỚN */}
      <Modal title="Thiết Lập Cấu Trúc & Tạo Đề" visible={hienThiModalTaoDe} width={700} onCancel={() => setHienThiModalTaoDe(false)} onOk={() => formLuuCauTruc.submit()} okText="Sinh Đề Thi" destroyOnClose>
        <div style={{ marginBottom: 16 }}>
          <Text strong>1. Chọn môn học cần tạo đề:</Text>
          <Select placeholder="Bấm để chọn môn" style={{ width: '100%', marginTop: 8 }} onChange={val => { setMonHocDuocChonDeTao(val); setCauTrucDangTao([]); }}>
            {danhSachMon.map(m => <Option key={m.maMon} value={m.maMon}>{m.tenMon}</Option>)}
          </Select>
        </div>

        {monHocDuocChonDeTao !== '' && (
          <>
            <div style={{ padding: 12, border: '1px dashed #d9d9d9', marginBottom: 16, borderRadius: 4 }}>
              <Text strong>2. Thêm yêu cầu vào cấu trúc đề:</Text>
              <Form form={formChiTietDe} layout="inline" onFinish={themYeuCauVaoCauTruc} style={{ marginTop: 8 }}>
                <Form.Item name="maKhoi" rules={[{required: true}]}><Select placeholder="Khối KT" style={{width: 150}}>{danhSachKhoi.map(k => <Option key={k.id} value={k.id}>{k.tenKhoi}</Option>)}</Select></Form.Item>
                <Form.Item name="doKho" rules={[{required: true}]}><Select placeholder="Độ khó" style={{width: 120}}><Option value="Dễ">Dễ</Option><Option value="Trung bình">TB</Option><Option value="Khó">Khó</Option><Option value="Rất khó">Rất khó</Option></Select></Form.Item>
                <Form.Item name="soLuong" rules={[{required: true}]}><InputNumber placeholder="Số lượng" min={1} style={{width: 90}} /></Form.Item>
                <Form.Item><Button type="default" htmlType="submit">Thêm</Button></Form.Item>
              </Form>
            </div>

            <Text strong>3. Cấu trúc đề hiện tại:</Text>
            <Table dataSource={cauTrucDangTao} rowKey={(r) => r.maKhoi + r.doKho} pagination={false} size="small" style={{ marginTop: 8, marginBottom: 16 }} columns={[
              { title: 'Khối KT', render: (_, r) => layTenKhoi(r.maKhoi) },
              { title: 'Độ khó', dataIndex: 'doKho' },
              { title: 'Số lượng câu', dataIndex: 'soLuong' },
              { title: 'Bỏ', render: (_, __, index) => <Button danger size="small" icon={<DeleteOutlined/>} onClick={() => xoaYeuCauKhoiCauTruc(index)} /> }
            ]} />

            <Form form={formLuuCauTruc} layout="vertical" onFinish={xuLySinhDeThi}>
              <Form.Item name="tenDeThi" label="4. Nhập Tên Đề Thi để lưu trữ:" rules={[{required: true}]}><Input placeholder="VD: Đề thi cuối kỳ Lập trình Web" /></Form.Item>
            </Form>
          </>
        )}
      </Modal>

      {/* MODAL XEM LẠI ĐỀ THI ĐÃ TẠO */}
      <Modal title={`Chi tiết Đề Thi: ${deThiDangXem?.tenDe}`} visible={hienThiModalXemDe} width={700} footer={[<Button key="dong" onClick={() => setHienThiModalXemDe(false)}>Đóng</Button>]} onCancel={() => setHienThiModalXemDe(false)}>
        {deThiDangXem && deThiDangXem.danhSachCauHoi.map((ch, index) => (
          <div key={ch.maCH} style={{ padding: 12, borderBottom: '1px solid #f0f0f0' }}>
            <Text strong>Câu {index + 1} [{ch.doKho} - {layTenKhoi(ch.maKhoi)}]: </Text>
            <Text>{ch.noiDung}</Text>
          </div>
        ))}
      </Modal>

    </Card>
  );
};

export default Bai2;