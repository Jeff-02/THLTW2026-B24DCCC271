import React, { useState, useMemo } from 'react';
import { useModel } from 'umi';
import {
  Tabs,
  Card,
  Row,
  Col,
  Statistic,
  Space,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  DatePicker,
  Table,
  Tag,
  Popconfirm,
  message,
  Drawer,
} from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import {
  generateOrderId,
  validatePhone,
  calculateProductStatus,
  calculateTotalInventoryValue,
  calculateTotalRevenue,
} from '@/services/OrderAndProduct';
import { OrderAndProduct } from '@/models/ordersandproducts';

dayjs.extend(isBetween);

const QuanLyDonHang: React.FC = () => {
  const { products, setProducts, orders, setOrders } = useModel('ordersandproducts');

  
  const [searchProduct, setSearchProduct] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>();
  const [filterPriceRange, setFilterPriceRange] = useState<[number, number]>([0, 50000000]);
  const [filterProductStatus, setFilterProductStatus] = useState<string>();
  const [sortProduct, setSortProduct] = useState<string>('');
  const [editingProduct, setEditingProduct] = useState<OrderAndProduct.Product | null>(null);
  const [productModalVisible, setProductModalVisible] = useState(false);
  const [productForm] = Form.useForm();

 
  const [orderModalVisible, setOrderModalVisible] = useState(false);
  const [orderForm] = Form.useForm();
  const [filterOrderStatus, setFilterOrderStatus] = useState<string>();
  const [filterOrderCustomer, setFilterOrderCustomer] = useState('');
  const [filterOrderDateRange, setFilterOrderDateRange] = useState<[any, any] | null>(null);
  const [sortOrder, setSortOrder] = useState<string>('');
  const [selectedOrder, setSelectedOrder] = useState<OrderAndProduct.Order | null>(null);
  const [orderDetailVisible, setOrderDetailVisible] = useState(false);
  const [selectedProductIds, setSelectedProductIds] = useState<number[]>([]);
  const [productQuantities, setProductQuantities] = useState<Record<number, number>>({});

  
  const categories = useMemo(() => {
    return Array.from(new Set(products.map(p => p.category)));
  }, [products]);


  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(searchProduct.toLowerCase());
      const matchCategory = !filterCategory || p.category === filterCategory;
      const matchPrice = p.price >= filterPriceRange[0] && p.price <= filterPriceRange[1];
      const pStatus = calculateProductStatus(p.quantity);
      const matchStatus = !filterProductStatus || pStatus === filterProductStatus;

      return matchSearch && matchCategory && matchPrice && matchStatus;
    });

    
    if (sortProduct === 'nameAZ') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortProduct === 'priceASC') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortProduct === 'priceDESC') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortProduct === 'quantityASC') {
      filtered.sort((a, b) => a.quantity - b.quantity);
    } else if (sortProduct === 'quantityDESC') {
      filtered.sort((a, b) => b.quantity - a.quantity);
    }

    return filtered;
  }, [products, searchProduct, filterCategory, filterPriceRange, filterProductStatus, sortProduct]);


  const filteredAndSortedOrders = useMemo(() => {
    let filtered = orders.filter(o => {
      const matchCustomer =
        o.customerName.toLowerCase().includes(filterOrderCustomer.toLowerCase()) ||
        o.id.toLowerCase().includes(filterOrderCustomer.toLowerCase());
      const matchStatus = !filterOrderStatus || o.status === filterOrderStatus;

      let matchDate = true;
      if (filterOrderDateRange) {
        const orderDate = dayjs(o.createdAt);
        const [startDate, endDate] = filterOrderDateRange;
        matchDate = orderDate.isBetween(startDate, endDate, null, '[]');
      }

      return matchCustomer && matchStatus && matchDate;
    });


    if (sortOrder === 'dateASC') {
      filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    } else if (sortOrder === 'dateDESC') {
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortOrder === 'amountASC') {
      filtered.sort((a, b) => a.totalAmount - b.totalAmount);
    } else if (sortOrder === 'amountDESC') {
      filtered.sort((a, b) => b.totalAmount - a.totalAmount);
    }

    return filtered;
  }, [orders, filterOrderCustomer, filterOrderStatus, filterOrderDateRange, sortOrder]);


  const handleEditProduct = (product: OrderAndProduct.Product) => {
    setEditingProduct(product);
    productForm.setFieldsValue({
      name: product.name,
      category: product.category,
      price: product.price,
      quantity: product.quantity,
    });
    setProductModalVisible(true);
  };

  const handleProductModalOk = async () => {
    try {
      const values = await productForm.validateFields();
      if (editingProduct) {
        setProducts(
          products.map(p =>
            p.id === editingProduct.id
              ? { ...p, ...values }
              : p
          )
        );
        message.success('Cập nhật sản phẩm thành công');
      }
      setProductModalVisible(false);
      setEditingProduct(null);
      productForm.resetFields();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleDeleteProduct = (id: number) => {
    setProducts(products.filter(p => p.id !== id));
    message.success('Xóa sản phẩm thành công');
  };


  const handleCreateOrder = async () => {
    try {
      const values = await orderForm.validateFields();

     
      if (selectedProductIds.length === 0) {
        message.error('Vui lòng chọn ít nhất 1 sản phẩm');
        return;
      }

     
      let totalAmount = 0;
      const orderProducts: OrderAndProduct.OrderItem[] = [];

      for (const productId of selectedProductIds) {
        const product = products.find(p => p.id === productId);
        if (!product) continue;

        const quantity = productQuantities[productId];
        if (!quantity || quantity <= 0) {
          message.error(`Vui lòng nhập số lượng hợp lệ cho sản phẩm: ${product.name}`);
          return;
        }

        if (quantity > product.quantity) {
          message.error(
            `Số lượng đặt của "${product.name}" vượt quá số lượng tồn kho (${product.quantity})`
          );
          return;
        }

        orderProducts.push({
          productId,
          productName: product.name,
          quantity,
          price: product.price,
        });

        totalAmount += product.price * quantity;
      }

    
      if (!validatePhone(values.phone)) {
        message.error('Số điện thoại phải đúng định dạng (10-11 số bắt đầu bằng 0)');
        return;
      }

      const newOrder: OrderAndProduct.Order = {
        id: generateOrderId(),
        customerName: values.customerName,
        phone: values.phone,
        address: values.address,
        products: orderProducts,
        totalAmount,
        status: 'Chờ xử lý',
        createdAt: dayjs().format('YYYY-MM-DD'),
      };

      setOrders([newOrder, ...orders]);
      message.success('Tạo đơn hàng thành công');
      setOrderModalVisible(false);
      setSelectedProductIds([]);
      setProductQuantities({});
      orderForm.resetFields();
    } catch (error) {
      console.error('Create order failed:', error);
    }
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;


    if (newStatus === 'Hoàn thành' && order.status !== 'Hoàn thành') {
      const updatedProducts = [...products];
      for (const item of order.products) {
        const product = updatedProducts.find(p => p.id === item.productId);
        if (product) {
          product.quantity -= item.quantity;
        }
      }
      setProducts(updatedProducts);
    }

  
    if (order.status === 'Hoàn thành' && newStatus !== 'Hoàn thành') {
      const updatedProducts = [...products];
      for (const item of order.products) {
        const product = updatedProducts.find(p => p.id === item.productId);
        if (product) {
          product.quantity += item.quantity;
        }
      }
      setProducts(updatedProducts);
    }


    if (newStatus === 'Đã hủy' && order.status !== 'Đã hủy') {
      const updatedProducts = [...products];
      for (const item of order.products) {
        const product = updatedProducts.find(p => p.id === item.productId);
        if (product) {
          product.quantity += item.quantity;
        }
      }
      setProducts(updatedProducts);
    }

    setOrders(
      orders.map(o =>
        o.id === orderId ? { ...o, status: newStatus as any } : o
      )
    );
    message.success('Cập nhật trạng thái đơn hàng thành công');
  };

 
  const productColumns: ColumnsType<OrderAndProduct.Product> = [
    {
      title: 'STT',
      key: 'index',
      width: 50,
      align: 'center',
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Danh mục',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: 'Giá (VNĐ)',
      dataIndex: 'price',
      key: 'price',
      render: (price) => price.toLocaleString('vi-VN'),
    },
    {
      title: 'Số lượng tồn kho',
      dataIndex: 'quantity',
      key: 'quantity',
      align: 'center',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'quantity',
      key: 'status',
      align: 'center',
      render: (quantity) => {
        const status = calculateProductStatus(quantity);
        let color = 'green';
        if (status === 'Sắp hết') color = 'orange';
        if (status === 'Hết hàng') color = 'red';
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: 'Thao tác',
      key: 'action',
      align: 'center',
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEditProduct(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa sản phẩm này?"
            onConfirm={() => handleDeleteProduct(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button danger size="small" icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const orderColumns: ColumnsType<OrderAndProduct.Order> = [
    {
      title: 'Mã đơn hàng',
      dataIndex: 'id',
      key: 'id',
      width: 120,
    },
    {
      title: 'Tên khách hàng',
      dataIndex: 'customerName',
      key: 'customerName',
    },
    {
      title: 'Số sản phẩm',
      dataIndex: 'products',
      key: 'productCount',
      align: 'center',
      render: (products) => products.length,
    },
    {
      title: 'Tổng tiền (VNĐ)',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount) => amount.toLocaleString('vi-VN'),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      render: (status) => {
        let color = 'blue';
        if (status === 'Đang giao') color = 'cyan';
        if (status === 'Hoàn thành') color = 'green';
        if (status === 'Đã hủy') color = 'red';
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => dayjs(date).format('DD/MM/YYYY'),
    },
    {
      title: 'Thao tác',
      key: 'action',
      align: 'center',
      width: 200,
      render: (_, record) => (
        <Space>
          <Button
            size="small"
            icon={<EyeOutlined />}
            onClick={() => {
              setSelectedOrder(record);
              setOrderDetailVisible(true);
            }}
          >
            Chi tiết
          </Button>
          <Select
            size="small"
            value={record.status}
            onChange={(newStatus) => handleUpdateOrderStatus(record.id, newStatus)}
            style={{ width: 130 }}
          >
            <Select.Option value="Chờ xử lý">Chờ xử lý</Select.Option>
            <Select.Option value="Đang giao">Đang giao</Select.Option>
            <Select.Option value="Hoàn thành">Hoàn thành</Select.Option>
            <Select.Option value="Đã hủy">Đã hủy</Select.Option>
          </Select>
        </Space>
      ),
    },
  ];


  return (
    <div style={{ padding: '20px' }}>
      {}
      <Card style={{ marginBottom: 24 }}>
        <Row gutter={16}>
          <Col xs={24} sm={12} lg={6}>
            <Statistic
              title="Tổng số sản phẩm"
              value={products.length}
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Statistic
              title="Tổng giá trị tồn kho"
              value={calculateTotalInventoryValue(products).toLocaleString('vi-VN')}
              suffix="đ"
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Statistic
              title="Tổng số đơn hàng"
              value={orders.length}
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Statistic
              title="Doanh thu"
              value={calculateTotalRevenue(orders).toLocaleString('vi-VN')}
              suffix="đ"
            />
          </Col>
        </Row>
      </Card>

      {}
      <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="Quản lý Sản phẩm" key="1">
                <Card style={{ marginBottom: 16 }}>
                  <Row gutter={16}>
                    <Col xs={24} sm={12} lg={6}>
                      <Input.Search
                        placeholder="Tìm kiếm sản phẩm..."
                        value={searchProduct}
                        onChange={(e) => setSearchProduct(e.target.value)}
                      />
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                      <Select
                        placeholder="Chọn danh mục"
                        allowClear
                        value={filterCategory}
                        onChange={setFilterCategory}
                      >
                        {categories.map(cat => (
                          <Select.Option key={cat} value={cat}>{cat}</Select.Option>
                        ))}
                      </Select>
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                      <Select
                        placeholder="Chọn trạng thái"
                        allowClear
                        value={filterProductStatus}
                        onChange={setFilterProductStatus}
                      >
                        <Select.Option value="Còn hàng">Còn hàng</Select.Option>
                        <Select.Option value="Sắp hết">Sắp hết</Select.Option>
                        <Select.Option value="Hết hàng">Hết hàng</Select.Option>
                      </Select>
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                      <Select
                        placeholder="Sắp xếp"
                        value={sortProduct}
                        onChange={setSortProduct}
                      >
                        <Select.Option value="">Mặc định</Select.Option>
                        <Select.Option value="nameAZ">Tên (A-Z)</Select.Option>
                        <Select.Option value="priceASC">Giá (thấp-cao)</Select.Option>
                        <Select.Option value="priceDESC">Giá (cao-thấp)</Select.Option>
                        <Select.Option value="quantityASC">Số lượng (tăng)</Select.Option>
                        <Select.Option value="quantityDESC">Số lượng (giảm)</Select.Option>
                      </Select>
                    </Col>
                  </Row>
                  <Row gutter={16} style={{ marginTop: 16 }}>
                    <Col xs={24} sm={12} lg={6}>
                      <label style={{ display: 'block', marginBottom: 8 }}>Giá từ (VNĐ)</label>
                      <InputNumber
                        placeholder="Giá tối thiểu"
                        value={filterPriceRange[0]}
                        onChange={(value) => setFilterPriceRange([value || 0, filterPriceRange[1]])}
                        style={{ width: '100%' }}
                        min={0}
                      />
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                      <label style={{ display: 'block', marginBottom: 8 }}>Giá đến (VNĐ)</label>
                      <InputNumber
                        placeholder="Giá tối đa"
                        value={filterPriceRange[1]}
                        onChange={(value) => setFilterPriceRange([filterPriceRange[0], value || 50000000])}
                        style={{ width: '100%' }}
                        min={0}
                      />
                    </Col>
                  </Row>
                </Card>

                {}
                <Table
                  columns={productColumns}
                  dataSource={filteredAndSortedProducts}
                  rowKey="id"
                  pagination={{ pageSize: 5 }}
                />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Quản lý Đơn hàng" key="2">
                <div style={{ marginBottom: 16 }}>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    size="large"
                    onClick={() => {
                      setSelectedProductIds([]);
                      setProductQuantities({});
                      orderForm.resetFields();
                      setOrderModalVisible(true);
                    }}
                  >
                    Tạo đơn hàng mới
                  </Button>
                </div>

                        {}
                <Card style={{ marginBottom: 16 }}>
                  <Row gutter={16}>
                    <Col xs={24} sm={12} lg={6}>
                      <Input.Search
                        placeholder="Tìm kiếm khách hàng/mã đơn"
                        value={filterOrderCustomer}
                        onChange={(e) => setFilterOrderCustomer(e.target.value)}
                      />
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                      <Select
                        placeholder="Chọn trạng thái"
                        allowClear
                        value={filterOrderStatus}
                        onChange={setFilterOrderStatus}
                      >
                        <Select.Option value="Chờ xử lý">Chờ xử lý</Select.Option>
                        <Select.Option value="Đang giao">Đang giao</Select.Option>
                        <Select.Option value="Hoàn thành">Hoàn thành</Select.Option>
                        <Select.Option value="Đã hủy">Đã hủy</Select.Option>
                      </Select>
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                      <DatePicker.RangePicker
                        style={{ width: '100%' }}
                        onChange={(dates) => setFilterOrderDateRange(dates as any)}
                      />
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                      <Select
                        placeholder="Sắp xếp"
                        value={sortOrder}
                        onChange={setSortOrder}
                      >
                        <Select.Option value="">Mặc định</Select.Option>
                        <Select.Option value="dateASC">Ngày (cũ-mới)</Select.Option>
                        <Select.Option value="dateDESC">Ngày (mới-cũ)</Select.Option>
                        <Select.Option value="amountASC">Tiền (thấp-cao)</Select.Option>
                        <Select.Option value="amountDESC">Tiền (cao-thấp)</Select.Option>
                      </Select>
                    </Col>
                  </Row>
                </Card>

                {}
                <Table
                  columns={orderColumns}
                  dataSource={filteredAndSortedOrders}
                  rowKey="id"
                  pagination={{ pageSize: 5 }}
                />
        </Tabs.TabPane>
      </Tabs>

      {}
      <Modal
        title="Sửa sản phẩm"
        visible={productModalVisible}
        onOk={handleProductModalOk}
        onCancel={() => {
          setProductModalVisible(false);
          setEditingProduct(null);
          productForm.resetFields();
        }}
        okText="Cập nhật"
        cancelText="Hủy"
      >
        <Form form={productForm} layout="vertical">
          <Form.Item
            label="Tên sản phẩm"
            name="name"
            rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Danh mục"
            name="category"
            rules={[{ required: true, message: 'Vui lòng chọn danh mục' }]}
          >
            <Select>
              {categories.map(cat => (
                <Select.Option key={cat} value={cat}>{cat}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Giá (VNĐ)"
            name="price"
            rules={[
              { required: true, message: 'Vui lòng nhập giá' },
              { type: 'number', min: 1, message: 'Giá phải lớn hơn 0' },
            ]}
          >
            <InputNumber style={{ width: '100%' }} min={1} />
          </Form.Item>
          <Form.Item
            label="Số lượng"
            name="quantity"
            rules={[
              { required: true, message: 'Vui lòng nhập số lượng' },
              { type: 'number', min: 0, message: 'Số lượng không được âm' },
            ]}
          >
            <InputNumber style={{ width: '100%' }} min={0} />
          </Form.Item>
        </Form>
      </Modal>

      {}
      <Modal
        title="Tạo đơn hàng mới"
        visible={orderModalVisible}
        onOk={handleCreateOrder}
        onCancel={() => {
          setOrderModalVisible(false);
          setSelectedProductIds([]);
          setProductQuantities({});
          orderForm.resetFields();
        }}
        okText="Tạo đơn"
        cancelText="Hủy"
        width={700}
      >
        <Form form={orderForm} layout="vertical">
          <Form.Item
            label="Chọn sản phẩm"
            required
          >
            <Select
              mode="multiple"
              placeholder="Chọn các sản phẩm"
              value={selectedProductIds}
              onChange={setSelectedProductIds}
            >
              {products
                .filter(p => p.quantity > 0)
                .map(p => (
                  <Select.Option key={p.id} value={p.id}>
                    {p.name} (Còn: {p.quantity})
                  </Select.Option>
                ))}
            </Select>
          </Form.Item>

          {selectedProductIds.map(productId => {
            const product = products.find(p => p.id === productId);
            if (!product) return null;

            return (
              <Form.Item key={productId} label={`Số lượng - ${product.name}`}>
                <InputNumber
                  min={1}
                  max={product.quantity}
                  value={productQuantities[productId] || undefined}
                  onChange={(value) => {
                    setProductQuantities({
                      ...productQuantities,
                      [productId]: value || 0,
                    });
                  }}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            );
          })}

          <Form.Item
            label="Tên khách hàng"
            name="customerName"
            rules={[{ required: true, message: 'Vui lòng nhập tên khách hàng' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Số điện thoại"
            name="phone"
            rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
          >
            <Input placeholder="0912345678" />
          </Form.Item>

          <Form.Item
            label="Địa chỉ"
            name="address"
            rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>

          {selectedProductIds.length > 0 && (
            <div style={{
              padding: 12,
              backgroundColor: '#f0f2f5',
              borderRadius: 4,
              marginBottom: 16,
            }}>
              <strong>Tổng tiền đơn hàng: </strong>
              <span style={{ fontSize: 16, color: '#1890ff' }}>
                {selectedProductIds
                  .reduce((total, productId) => {
                    const product = products.find(p => p.id === productId);
                    const quantity = productQuantities[productId] || 0;
                    return total + (product?.price || 0) * quantity;
                  }, 0)
                  .toLocaleString('vi-VN')}
                đ
              </span>
            </div>
          )}
        </Form>
      </Modal>

      {}
      <Drawer
        title="Chi tiết đơn hàng"
        onClose={() => setOrderDetailVisible(false)}
        visible={orderDetailVisible}
        width={600}
      >
        {selectedOrder && (
          <Space direction="vertical" style={{ width: '100%' }} size="large">
            <div>
              <strong>Mã đơn hàng:</strong> {selectedOrder.id}
            </div>
            <div>
              <strong>Khách hàng:</strong> {selectedOrder.customerName}
            </div>
            <div>
              <strong>Số điện thoại:</strong> {selectedOrder.phone}
            </div>
            <div>
              <strong>Địa chỉ:</strong> {selectedOrder.address}
            </div>
            <div>
              <strong>Ngày tạo:</strong> {dayjs(selectedOrder.createdAt).format('DD/MM/YYYY')}
            </div>
            <div>
              <strong>Trạng thái:</strong>{' '}
              <Tag color="blue">{selectedOrder.status}</Tag>
            </div>

            <div>
              <strong>Danh sách sản phẩm:</strong>
              <Table
                columns={[
                  { title: 'Tên sản phẩm', dataIndex: 'productName', key: 'productName' },
                  { title: 'Số lượng', dataIndex: 'quantity', key: 'quantity', align: 'center' },
                  {
                    title: 'Giá (VNĐ)',
                    dataIndex: 'price',
                    key: 'price',
                    render: (price) => price.toLocaleString('vi-VN'),
                  },
                  {
                    title: 'Thành tiền (VNĐ)',
                    key: 'total',
                    render: (_, record: OrderAndProduct.OrderItem) =>
                      (record.price * record.quantity).toLocaleString('vi-VN'),
                  },
                ]}
                dataSource={selectedOrder.products}
                rowKey="productId"
                pagination={false}
              />
            </div>

            <div style={{ fontSize: 16, color: '#1890ff' }}>
              <strong>Tổng tiền:</strong> {selectedOrder.totalAmount.toLocaleString('vi-VN')}đ
            </div>
          </Space>
        )}
      </Drawer>
    </div>
  );
};

export default QuanLyDonHang;