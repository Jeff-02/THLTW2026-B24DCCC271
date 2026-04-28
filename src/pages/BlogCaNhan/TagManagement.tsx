import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Form, Input, Modal, Popconfirm, Row, Space, Table, Tag, message, ColorPicker, Tooltip } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import type { Tag as TagType } from './types';
import { loadTags, saveTags } from './utils';
import styles from './BlogCaNhan.less';

const TagManagement: React.FC = () => {
  const [tags, setTags] = useState<TagType[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTag, setEditingTag] = useState<TagType | null>(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');

  const loadData = () => {
    setTags(loadTags());
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredTags = tags.filter(tag =>
    tag.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleAddTag = () => {
    setEditingTag(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEditTag = (tag: TagType) => {
    setEditingTag(tag);
    form.setFieldsValue({
      ...tag,
      color: tag.color || '#1890ff'
    });
    setIsModalVisible(true);
  };

  const handleDeleteTag = (id: string) => {
    const updatedTags = tags.filter(tag => tag.id !== id);
    setTags(updatedTags);
    saveTags(updatedTags);
    message.success('Xóa thẻ thành công');
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();

      if (editingTag) {
        const updatedTags = tags.map(tag =>
          tag.id === editingTag.id
            ? { ...tag, ...values }
            : tag
        );
        setTags(updatedTags);
        saveTags(updatedTags);
        message.success('Cập nhật thẻ thành công');
      } else {
        // Add
        const newTag: TagType = {
          id: Date.now().toString(),
          ...values,
        };
        const updatedTags = [...tags, newTag];
        setTags(updatedTags);
        saveTags(updatedTags);
        message.success('Thêm thẻ thành công');
      }

      setIsModalVisible(false);
      form.resetFields();
    } catch (error: any) {
      message.error(error.message);
    }
  };

  const columns = [
    {
      title: 'Tên thẻ',
      dataIndex: 'name',
      key: 'name',
      width: 150,
      render: (text: string, record: TagType) => (
        <Tag color={record.color}>{text}</Tag>
      ),
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'Màu sắc',
      dataIndex: 'color',
      key: 'color',
      width: 120,
      render: (color: string) => (
        <div
          style={{
            display: 'inline-block',
            width: 30,
            height: 30,
            backgroundColor: color,
            border: '1px solid #d9d9d9',
            borderRadius: 4,
          }}
          title={color}
        />
      ),
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 100,
      fixed: 'right',
      render: (_, record: TagType) => (
        <Space size="small">
          <Tooltip title="Chỉnh sửa">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEditTag(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Xóa thẻ"
            description="Bạn có chắc chắn muốn xóa thẻ này?"
            onConfirm={() => handleDeleteTag(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className={styles.tagManagement}>
      {/* Header */}
      <div className={styles.pageHeader}>
        <h1>Quản lý thẻ</h1>
      </div>

      {/* Toolbar */}
      <Card style={{ marginBottom: 24 }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={12}>
            <Input.Search
              placeholder="Tìm kiếm thẻ..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={24} sm={12} md={12} style={{ textAlign: 'right' }}>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAddTag}>
              Thêm thẻ
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={filteredTags}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Tổng ${total} thẻ`,
          }}
        />
      </Card>

      {/* Modal */}
      <Modal
        title={editingTag ? 'Chỉnh sửa thẻ' : 'Thêm thẻ mới'}
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
          setEditingTag(null);
        }}
      >
        <Form
          form={form}
          layout="vertical"
          autoComplete="off"
        >
          <Form.Item
            name="name"
            label="Tên thẻ"
            rules={[{ required: true, message: 'Vui lòng nhập tên thẻ' }]}
          >
            <Input placeholder="Ví dụ: Công nghệ, Cuộc sống, v.v..." />
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô tả (tùy chọn)"
          >
            <Input.TextArea rows={3} placeholder="Mô tả thẻ" />
          </Form.Item>

          <Form.Item
            name="color"
            label="Màu sắc"
            initialValue="#1890ff"
          >
            <Input type="color" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TagManagement;
