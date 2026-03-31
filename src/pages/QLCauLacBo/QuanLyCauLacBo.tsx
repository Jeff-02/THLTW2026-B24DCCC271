import React, { useEffect, useMemo, useState } from "react";
import { Avatar, Button, Card, Col, DatePicker, Form, Input, message, Popconfirm, Row, Select, Space, Table, Tag, Typography } from "antd";
import dayjs from "dayjs";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface CauLacBo {
  id: string;
  anhDaiDien: string;
  ten: string;
  ngayThanhLap: string;
  moTa: string;
  chuNhiem: string;
  hoatDong: boolean;
}

const getStorage = <T,>(key: string, defaultValue: T): T => {
  try {
    const v = localStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : defaultValue;
  } catch {
    return defaultValue;
  }
};

const QuanLyCauLacBo: React.FC = () => {
  const [list, setList] = useState<CauLacBo[]>(() => getStorage("clbList", []));
  const [editId, setEditId] = useState<string>("");
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    localStorage.setItem("clbList", JSON.stringify(list));
  }, [list]);

  const summary = useMemo(() => {
    const active = list.filter((item) => item.hoatDong).length;
    const inactive = list.length - active;
    return { total: list.length, active, inactive };
  }, [list]);

  const visibleData = useMemo(() => {
    const q = searchText.trim().toLowerCase();
    if (!q) return list;
    return list.filter(
      (item) =>
        item.ten.toLowerCase().includes(q) ||
        item.chuNhiem.toLowerCase().includes(q) ||
        item.moTa.toLowerCase().includes(q)
    );
  }, [list, searchText]);

  const onFinish = (values: any) => {
    const model: CauLacBo = {
      id: editId || `clb-${Date.now()}`,
      anhDaiDien: values.anhDaiDien || "",
      ten: values.ten,
      ngayThanhLap: values.ngayThanhLap.format("YYYY-MM-DD"),
      moTa: values.moTa || "",
      chuNhiem: values.chuNhiem,
      hoatDong: values.hoatDong === "1",
    };

    if (editId) {
      setList((prev) => prev.map((item) => (item.id === editId ? model : item)));
      message.success("Cập nhật CLB thành công.");
      setEditId("");
    } else {
      setList((prev) => [...prev, model]);
      message.success("Thêm CLB thành công.");
    }
    form.resetFields();
  };

  const onEdit = (record: CauLacBo) => {
    setEditId(record.id);
    form.setFieldsValue({
      ...record,
      ngayThanhLap: dayjs(record.ngayThanhLap),
      hoatDong: record.hoatDong ? "1" : "0",
    });
  };

  const onDelete = (id: string) => {
    setList((prev) => prev.filter((item) => item.id !== id));
    message.success("Xóa CLB thành công.");
    if (editId === id) {
      setEditId("");
      form.resetFields();
    }
  };

  return (
    <div>
      <Card style={{ marginBottom: 16 }}>
        <Typography.Title level={4}>Bảng điều khiển CLB</Typography.Title>
        <Space size="large">
          <Typography.Text>Tổng CLB: {summary.total}</Typography.Text>
          <Typography.Text type="success">Đang hoạt động: {summary.active}</Typography.Text>
          <Typography.Text type="danger">Ngừng hoạt động: {summary.inactive}</Typography.Text>
        </Space>
      </Card>

      <Card title={editId ? "Chỉnh sửa CLB" : "Thêm CLB mới"} style={{ marginBottom: 16 }}>
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Row gutter={12}>
            <Col md={6} xs={24}>
              <Form.Item name="anhDaiDien" label="Ảnh đại diện (URL)">
                <Input placeholder="Nhập link ảnh..." />
              </Form.Item>
            </Col>
            <Col md={6} xs={24}>
              <Form.Item name="ten" label="Tên CLB" rules={[{ required: true, message: "Vui lòng nhập tên CLB" }]}>
                <Input placeholder="Tên câu lạc bộ" />
              </Form.Item>
            </Col>
            <Col md={6} xs={24}>
              <Form.Item name="ngayThanhLap" label="Ngày thành lập" rules={[{ required: true, message: "Vui lòng chọn ngày thành lập" }]}>
                <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
              </Form.Item>
            </Col>
            <Col md={6} xs={24}>
              <Form.Item name="chuNhiem" label="Chủ nhiệm" rules={[{ required: true, message: "Vui lòng nhập tên chủ nhiệm" }]}>
                <Input placeholder="Tên chủ nhiệm" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={12}>
            <Col md={16} xs={24}>
              <Form.Item name="moTa" label="Mô tả (HTML)">
                <ReactQuill theme="snow" placeholder="Nhập mô tả chi tiết bằng trình soạn thảo..." style={{ height: '100px', marginBottom: '40px' }} />
              </Form.Item>
            </Col>
            <Col md={8} xs={24}>
              <Form.Item name="hoatDong" label="Trạng thái" rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}>
                <Select options={[{ value: "1", label: "Đang hoạt động" }, { value: "0", label: "Ngừng hoạt động" }]} />
              </Form.Item>
              <Form.Item>
                <Space style={{ marginTop: 24 }}>
                  <Button type="primary" htmlType="submit">
                    {editId ? "Cập nhật CLB" : "Thêm CLB"}
                  </Button>
                  {editId && (
                    <Button onClick={() => { setEditId(""); form.resetFields(); }}>Hủy</Button>
                  )}
                </Space>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>

      <Card title="Danh sách CLB">
        <Row gutter={12} style={{ marginBottom: 16 }}>
          <Col span={8}>
            <Input.Search placeholder="Tìm theo tên, chủ nhiệm, mô tả" onSearch={(v) => setSearchText(v)} allowClear />
          </Col>
        </Row>

        <Table<CauLacBo>
          rowKey="id"
          dataSource={visibleData}
          pagination={{ pageSize: 8 }}
          columns={[
            {
              title: "Ảnh",
              dataIndex: "anhDaiDien",
              render: (src) => <Avatar src={src} shape="square" size="large" />
            },
            { title: "Tên CLB", dataIndex: "ten", sorter: (a, b) => a.ten.localeCompare(b.ten) },
            {
              title: "Ngày thành lập",
              dataIndex: "ngayThanhLap",
              sorter: (a, b) => dayjs(a.ngayThanhLap).unix() - dayjs(b.ngayThanhLap).unix(),
              render: (v) => dayjs(v).format("DD/MM/YYYY")
            },
            { title: "Chủ nhiệm", dataIndex: "chuNhiem" },
            {
              title: "Trạng thái",
              dataIndex: "hoatDong",
              render: (v: boolean) => (v ? <Tag color="green">Đang hoạt động</Tag> : <Tag color="volcano">Ngừng hoạt động</Tag>),
              filters: [
                { text: "Đang hoạt động", value: true },
                { text: "Ngừng hoạt động", value: false },
              ],
              onFilter: (value, record) => record.hoatDong === value,
            },
            {
              title: "Thao tác",
              render: (_, record) => (
                <Space>
                  <Button size="small" type="link" onClick={() => onEdit(record)}>Sửa</Button>
                  <Popconfirm title="Xác nhận xóa CLB?" onConfirm={() => onDelete(record.id)}>
                    <Button size="small" danger type="link">Xóa</Button>
                  </Popconfirm>
                  <Button size="small" type="dashed" onClick={() => message.info(`Đang chuyển tới danh sách thành viên của CLB: ${record.ten}`)}>
                    Xem thành viên
                  </Button>
                </Space>
              ),
            },
          ]}
        />
      </Card>
    </div>
  );
};

export default QuanLyCauLacBo;