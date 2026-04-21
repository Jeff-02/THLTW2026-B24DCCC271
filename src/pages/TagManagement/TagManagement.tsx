import React, { useEffect, useState, useMemo } from 'react';
import { Card, Table, Button, Modal, Form, Input, message, Popconfirm, Tag, Statistic, Row, Col, Typography } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined, TagOutlined } from '@ant-design/icons';
import { Blog } from '../BlogCaNhan/BlogCaNhan';

const { Title } = Typography;
const TAGS_KEY = 'blogCaNhanTags';

interface TagData {
  id: string;
  name: string;
  blogCount: number;
  createdDate: string;
}

const TagManagement: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [tags, setTags] = useState<TagData[]>([]);
  const [persistedTags, setPersistedTags] = useState<{ name: string; createdDate: string }[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTag, setEditingTag] = useState<TagData | null>(null);
  const [form] = Form.useForm();
  
  useEffect(() => {
    const loadBlogs = () => {
      try {
        const value = localStorage.getItem('blogCaNhanBlogs');
        return value ? JSON.parse(value) : [];
      } catch {
        return [];
      }
    };
    setBlogs(loadBlogs());
    try {
      const s = localStorage.getItem(TAGS_KEY);
      setPersistedTags(s ? JSON.parse(s) : []);
    } catch {
      setPersistedTags([]);
    }
  }, []);

  const calculatedTags = useMemo(() => {
    const tagMap = new Map<string, number>();

    blogs.forEach(blog => {
      (blog.tags || []).forEach(tag => {
        tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
      });
    });

    const combined = new Map<string, { blogCount: number; createdDate: string }>();

    persistedTags.forEach(t => {
      combined.set(t.name, { blogCount: tagMap.get(t.name) || 0, createdDate: t.createdDate });
    });

    tagMap.forEach((count, name) => {
      if (!combined.has(name)) {
        combined.set(name, { blogCount: count, createdDate: new Date().toLocaleDateString('vi-VN') });
      } else {
        const cur = combined.get(name)!;
        cur.blogCount = count;
        combined.set(name, cur);
      }
    });

    return Array.from(combined.entries()).map(([name, info], index) => ({
      id: `tag-${index}`,
      name,
      blogCount: info.blogCount,
      createdDate: info.createdDate,
    })).sort((a, b) => b.blogCount - a.blogCount);
  }, [blogs, persistedTags]);

  useEffect(() => {
    setTags(calculatedTags);
  }, [calculatedTags]);

  const handleAddTag = () => {
    setEditingTag(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEditTag = (tag: TagData) => {
    setEditingTag(tag);
    form.setFieldsValue({ name: tag.name });
    setIsModalVisible(true);
  };

  const handleDeleteTag = (tagName: string) => {
    const updatedBlogs = blogs.map(blog => ({
      ...blog,
      tags: blog.tags.filter(tag => tag !== tagName)
    }));
    
    setBlogs(updatedBlogs);
    localStorage.setItem('blogCaNhanBlogs', JSON.stringify(updatedBlogs));
    const newPersisted = persistedTags.filter(t => t.name !== tagName);
    setPersistedTags(newPersisted);
    localStorage.setItem(TAGS_KEY, JSON.stringify(newPersisted));
    message.success(`Đã xóa thẻ "${tagName}" khỏi tất cả bài viết`);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const { name } = values;

      if (editingTag) {
        const updatedBlogs = blogs.map(blog => ({
          ...blog,
          tags: blog.tags.map(tag => tag === editingTag.name ? name : tag)
        }));
        
        setBlogs(updatedBlogs);
        localStorage.setItem('blogCaNhanBlogs', JSON.stringify(updatedBlogs));
        const existsIndex = persistedTags.findIndex(t => t.name === editingTag.name);
        let newPersisted = [...persistedTags];
        if (existsIndex >= 0) {
          newPersisted[existsIndex] = { name, createdDate: newPersisted[existsIndex].createdDate };
        } else if (!persistedTags.some(t => t.name === name)) {
          newPersisted.push({ name, createdDate: new Date().toLocaleDateString('vi-VN') });
        }
        setPersistedTags(newPersisted);
        localStorage.setItem(TAGS_KEY, JSON.stringify(newPersisted));
        message.success(`Đổi tên thẻ thành công`);
      } else {
        if (tags.some(tag => tag.name === name)) {
          message.error('Thẻ đã tồn tại');
          return;
        }
        const newPersisted = [...persistedTags, { name, createdDate: new Date().toLocaleDateString('vi-VN') }];
        setPersistedTags(newPersisted);
        localStorage.setItem(TAGS_KEY, JSON.stringify(newPersisted));
        message.success('Thêm thẻ thành công');
      }

      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const columns = [
    {
      title: 'Tên thẻ',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: 'Số bài viết',
      dataIndex: 'blogCount',
      key: 'blogCount',
      sorter: (a: TagData, b: TagData) => a.blogCount - b.blogCount,
      render: (count: number) => <span>{count}</span>,
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdDate',
      key: 'createdDate',
      render: (text: string) => <span>{text}</span>,
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: TagData) => (
        <div>
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEditTag(record)}
            size="small"
            style={{ marginRight: 8 }}
          >
            Sửa
          </Button>
          <Popconfirm
            title={`Xóa thẻ "${record.name}"?`}
            description={`Thẻ này sẽ bị xóa khỏi ${record.blogCount} bài viết. Bạn có chắc chắn?`}
            onConfirm={() => handleDeleteTag(record.name)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button
              icon={<DeleteOutlined />}
              danger
              size="small"
            >
              Xóa
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  const stats = {
    totalTags: tags.length,
    totalBlogs: blogs.length,
    usedTags: tags.filter(tag => tag.blogCount > 0).length,
    unusedTags: tags.filter(tag => tag.blogCount === 0).length,
  };

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2} style={{ marginBottom: '24px' }}>
        <TagOutlined style={{ marginRight: '12px' }} />
        Quản lý thẻ
      </Title>

      {/* Statistics */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Tổng số thẻ"
              value={stats.totalTags}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Thẻ đang dùng"
              value={stats.usedTags}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Thẻ chưa dùng"
              value={stats.unusedTags}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Tổng bài viết"
              value={stats.totalBlogs}
              valueStyle={{ color: '#f5222d' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Tag Management Table */}
      <Card>
        <div style={{ marginBottom: '16px' }}>
          <Button
            icon={<PlusOutlined />}
            type="primary"
            onClick={handleAddTag}
          >
            Thêm thẻ mới
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={tags}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showTotal: (total) => `Tổng ${total} thẻ`,
          }}
        />
      </Card>

      {/* Add/Edit Tag Modal */}
      <Modal
        title={editingTag ? 'Sửa thẻ' : 'Thêm thẻ mới'}
        open={isModalVisible}
        visible={isModalVisible} 
        onCancel={handleCloseModal}
        footer={[
          <Button key="cancel" onClick={handleCloseModal}>
            Hủy
          </Button>,
          <Button key="submit" type="primary" onClick={handleSubmit}>
            {editingTag ? 'Cập nhật' : 'Thêm'}
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Tên thẻ"
            name="name"
            rules={[
              { required: true, message: 'Vui lòng nhập tên thẻ' },
              { min: 2, message: 'Tên thẻ phải có ít nhất 2 ký tự' },
              { max: 20, message: 'Tên thẻ không được vượt quá 20 ký tự' }
            ]}
          >
            <Input placeholder="Nhập tên thẻ" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TagManagement;