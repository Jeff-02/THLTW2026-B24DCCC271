import React, { useState } from 'react';
import { 
  Table, 
  Button, 
  Input, 
  Modal, 
  Form, 
  InputNumber, 
  Popconfirm, 
  message, 
  Space, 
  Card 
} from 'antd';
import { PlusOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

const INITIAL_DATA: Product[] = [
  { id: 1, name: 'Laptop Dell XPS 13', price: 25000000, quantity: 10 },
  { id: 2, name: 'iPhone 15 Pro Max', price: 30000000, quantity: 15 },
  { id: 3, name: 'Samsung Galaxy S24', price: 22000000, quantity: 20 },
  { id: 4, name: 'iPad Air M2', price: 18000000, quantity: 12 },
  { id: 5, name: 'MacBook Air M3', price: 28000000, quantity: 8 },
];

const ProductManager: React.FC = () => {
  const [dataSource, setDataSource] = useState<Product[]>(INITIAL_DATA);
  const [searchText, setSearchText] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [form] = Form.useForm();

  const handleAdd = async (values: any) => {
    try {
      if (!values.name || values.name.trim() === '') {
        message.error('Tên sản phẩm không được để trống!');
        return;
      }
      
      if (!values.price || values.price <= 0) {
        message.error('Giá phải là số dương!');
        return;
      }
      
      if (!values.quantity || values.quantity <= 0 || !Number.isInteger(values.quantity)) {
        message.error('Số lượng phải là số nguyên dương!');
        return;
      }

      const newProduct: Product = {
        id: Math.floor(Math.random() * 100000),
        name: values.name.trim(),
        price: values.price,
        quantity: values.quantity,
      };

      setDataSource([newProduct, ...dataSource]); 
      message.success('Thêm sản phẩm thành công');
      setIsModalOpen(false);
      form.resetFields(); 
    } catch (error) {
      message.error('Có lỗi');
    }
  };

  const handleModalOk = () => {
    form.validateFields()
      .then((values) => {
        handleAdd(values);
      })
      .catch((errorInfo) => {
        console.log('Failed:', errorInfo);
      });
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleDelete = (id: number) => {
    const newData = dataSource.filter((item) => item.id !== id);
    setDataSource(newData);
    message.success('Đã xóa sản phẩm!');
  };

  
  const filteredData = dataSource.filter((item) =>
    item.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns: ColumnsType<Product> = [
    {
      title: 'STT',
      key: 'index',
      width: 60,
      align: 'center',
      render: (_, __, index) => index + 1, 
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Giá (VNĐ)',
      dataIndex: 'price',
      key: 'price',
      render: (price) => `${price.toLocaleString('vi-VN')} đ`, 
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
      align: 'center',
    },
    {
      title: 'Thao tác',
      key: 'action',
      align: 'center',
      render: (_, record) => (
        <Popconfirm
          title="Bạn có chắc chắn muốn xóa sản phẩm này?"
          onConfirm={() => handleDelete(record.id)}
          okText="Có"
          cancelText="Không"
        >
          <Button danger icon={<DeleteOutlined />}>
            Xóa
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <Card title="Quản lý Sản phẩm" bordered={false}>
      {/* 4. Thanh công cụ: Tìm kiếm và Nút thêm */}
      <Space style={{ marginBottom: 16, justifyContent: 'space-between', width: '100%' }}>
        <Input.Search
          placeholder="Tìm kiếm theo tên sản phẩm..."
          allowClear
          onChange={(e) => setSearchText(e.target.value)} 
          style={{ width: 300 }}
          enterButton={<SearchOutlined />}
        />
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
          Thêm sản phẩm
        </Button>
      </Space>

      {/* 5. Bảng dữ liệu */}
      <Table 
        columns={columns} 
        dataSource={filteredData} 
        rowKey="id" 
        pagination={{ pageSize: 5 }} 
      />

      {/* 6. Modal Form Thêm mới */}
      <Modal
        title="Thêm sản phẩm mới"
        visible={isModalOpen}
        onCancel={handleModalClose}
        onOk={handleModalOk}
        okText="Thêm mới"
        cancelText="Hủy"
        destroyOnClose
        width={500}
      >
        <Form
          form={form}
          layout="vertical"
          autoComplete="off"
        >
          {}
          <Form.Item
            label="Tên sản phẩm"
            name="name"
            rules={[
              { 
                required: true, 
                message: 'Tên sản phẩm là bắt buộc!' 
              },
              {
                min: 3,
                message: 'Tên sản phẩm phải có ít nhất 3 ký tự!'
              },
              {
                max: 100,
                message: 'Tên sản phẩm không được vượt quá 100 ký tự!'
              }
            ]}
          >
            <Input 
              placeholder="Nhập tên sản phẩm" 
              size="large"
            />
          </Form.Item>

          {}
          <Form.Item
            label="Giá (VNĐ)"
            name="price"
            rules={[
              { 
                required: true, 
                message: 'Giá là bắt buộc!' 
              },
              {
                type: 'number',
                min: 1,
                message: 'Giá phải là số dương (tối thiểu 1)!'
              }
            ]}
          >
            <InputNumber 
              style={{ width: '100%' }} 
              placeholder="Nhập giá sản phẩm"
              size="large"
              min={1}
              step={1000}
            />
          </Form.Item>

          {}
          <Form.Item
            label="Số lượng"
            name="quantity"
            rules={[
              { 
                required: true, 
                message: 'Số lượng là bắt buộc!' 
              },
              {
                type: 'number',
                min: 1,
                message: 'Số lượng phải là số nguyên dương (tối thiểu 1)!'
              }
            ]}
          >
            <InputNumber 
              style={{ width: '100%' }} 
              placeholder="Nhập số lượng"
              size="large"
              min={1}
              precision={0}
              step={1}
            />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default ProductManager;