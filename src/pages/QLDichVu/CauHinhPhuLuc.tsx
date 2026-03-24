import React, { useEffect, useState } from 'react';
import { Button, Card, Form, Input, message, Popconfirm, Select, Space, Table } from 'antd';

type FieldType = 'String' | 'Number' | 'Date';
interface FieldConfig { id: string; ten: string; kieu: FieldType; batBuoc: boolean; }

const getStorage = <T,>(key: string, defaultValue: T): T => {
  try { const v = localStorage.getItem(key); return v ? (JSON.parse(v) as T) : defaultValue; } catch { return defaultValue; }
};

const CauHinhPhuLuc: React.FC = () => {
  const [data, setData] = useState<FieldConfig[]>(() => getStorage('fieldConfigs', [
    { id: 'f1', ten: 'Điểm trung bình', kieu: 'Number', batBuoc: false },
    { id: 'f2', ten: 'Xếp hạng', kieu: 'String', batBuoc: false },
  ]));
  const [form] = Form.useForm();
  const [editId, setEditId] = useState<string | null>(null);

  useEffect(() => { localStorage.setItem('fieldConfigs', JSON.stringify(data)); }, [data]);

  const save = () => {
    form.validateFields().then(values => {
      if (editId) {
        setData(prev => prev.map(item => item.id === editId ? { ...item, ten: values.ten, kieu: values.kieu, batBuoc: values.batBuoc } : item));
        message.success('Cập nhật cấu hình thành công');
      } else {
        setData(prev => [...prev, { id: `f-${Date.now()}`, ten: values.ten, kieu: values.kieu, batBuoc: values.batBuoc }]);
        message.success('Thêm cấu hình thành công');
      }
      form.resetFields(); setEditId(null);
    });
  };

  const edit = (item: FieldConfig) => { setEditId(item.id); form.setFieldsValue(item); };
  const remove = (id: string) => setData(prev => prev.filter(x => x.id !== id));

  return (
    <Card title="Cấu hình biểu mẫu phụ lục văn bằng">
      <Form form={form} layout="vertical" onFinish={save}>
        <Form.Item name="ten" label="Thông tin" rules={[{ required: true }]}><Input /></Form.Item>
        <Form.Item name="kieu" label="Kiểu" rules={[{ required: true }]}>
          <Select options={[{label:'String', value:'String'}, {label:'Number', value:'Number'}, {label:'Date', value:'Date'}]} />
        </Form.Item>
        <Form.Item name="batBuoc" label="Bắt buộc" rules={[{ required: true }]}>
          <Select options={[{label:'Không', value:false}, {label:'Có', value:true}]} />
        </Form.Item>
        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">{editId ? 'Cập nhật' : 'Thêm'}</Button>
            <Button onClick={() => { form.resetFields(); setEditId(null); }}>Làm mới</Button>
          </Space>
        </Form.Item>
      </Form>
      <Table<FieldConfig> rowKey="id" dataSource={data} pagination={{ pageSize: 8 }} columns={[
        { title: 'Tên trường', dataIndex: 'ten' },
        { title: 'Kiểu', dataIndex: 'kieu' },
        { title: 'Bắt buộc', dataIndex: 'batBuoc', render: v => v ? 'Có' : 'Không' },
        { title: 'Thao tác', render: (_, item) => (
          <Space>
            <Button type="link" onClick={() => edit(item)}>Sửa</Button>
            <Popconfirm title="Xóa trường?" onConfirm={() => remove(item.id)}>
              <Button type="link" danger>Xóa</Button>
            </Popconfirm>
          </Space>
        ) }
      ]} />
    </Card>
  );
};

export default CauHinhPhuLuc;
