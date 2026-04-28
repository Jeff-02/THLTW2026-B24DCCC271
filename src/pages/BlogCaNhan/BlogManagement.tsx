import React, { useEffect, useState } from 'react';
import { Button, Card, Form, Input, Modal, Popconfirm, Space, Table, Tag, message, Select, Row, Col } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import type { Blog, BlogFormValues, BlogStatus } from './types';
import { loadBlogs, saveBlogs, generateSlug, getTagsByIds, loadTags, formatDate } from './utils';
import { BLOG_STATUS_OPTIONS, BLOG_STATUS_COLORS } from './constants';
import MarkdownRenderer from './MarkdownRenderer';
import styles from './BlogCaNhan.less';

const BlogManagement: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [tags, setTags] = useState<any[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewContent, setPreviewContent] = useState('');

  const loadData = () => {
    setBlogs(loadBlogs());
    setTags(loadTags());
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredBlogs = blogs.filter(blog =>
    blog.title.toLowerCase().includes(searchText.toLowerCase()) ||
    blog.slug.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleAddBlog = () => {
    setEditingBlog(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEditBlog = (blog: Blog) => {
    setEditingBlog(blog);
    form.setFieldsValue(blog);
    setIsModalVisible(true);
  };

  const handleDeleteBlog = (id: string) => {
    const updatedBlogs = blogs.filter(blog => blog.id !== id);
    setBlogs(updatedBlogs);
    saveBlogs(updatedBlogs);
    message.success('Xóa bài viết thành công');
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      const formValues: BlogFormValues = values;

      if (editingBlog) {
        // Update
        const updatedBlogs = blogs.map(blog =>
          blog.id === editingBlog.id
            ? {
                ...blog,
                ...formValues,
                updateDate: new Date().toISOString(),
              }
            : blog
        );
        setBlogs(updatedBlogs);
        saveBlogs(updatedBlogs);
        message.success('Cập nhật bài viết thành công');
      } else {
        // Add
        const newBlog: Blog = {
          id: Date.now().toString(),
          ...formValues,
          createDate: new Date().toISOString(),
          views: 0,
          author: 'Nguyễn Đức Trường',
        };
        const updatedBlogs = [newBlog, ...blogs];
        setBlogs(updatedBlogs);
        saveBlogs(updatedBlogs);
        message.success('Thêm bài viết thành công');
      }

      setIsModalVisible(false);
      form.resetFields();
    } catch (error: any) {
      message.error(error.message);
    }
  };

  const handleSlugGenerate = () => {
    const title = form.getFieldValue('title');
    if (title) {
      const slug = generateSlug(title);
      form.setFieldValue('slug', slug);
    }
  };

  const columns = [
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
      width: 200,
      ellipsis: true,
      render: (text: string) => <strong>{text}</strong>,
    },
    {
      title: 'Slug',
      dataIndex: 'slug',
      key: 'slug',
      width: 150,
      ellipsis: true,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: BlogStatus) => (
        <Tag color={BLOG_STATUS_COLORS[status]}>{status}</Tag>
      ),
    },
    {
      title: 'Thẻ',
      dataIndex: 'tags',
      key: 'tags',
      render: (tagIds: string[]) => {
        const blogTags = getTagsByIds(tagIds);
        return (
          <Space size="small" wrap>
            {blogTags.map(tag => (
              <Tag key={tag.id} color={tag.color}>{tag.name}</Tag>
            ))}
          </Space>
        );
      },
    },
    {
      title: 'Lượt xem',
      dataIndex: 'views',
      key: 'views',
      width: 80,
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createDate',
      key: 'createDate',
      width: 120,
      render: (date: string) => formatDate(date),
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 120,
      fixed: 'right',
      render: (_, record: Blog) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEditBlog(record)}
            title="Chỉnh sửa"
          />
          <Popconfirm
            title="Xóa bài viết"
            description="Bạn có chắc chắn muốn xóa bài viết này?"
            onConfirm={() => handleDeleteBlog(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              title="Xóa"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className={styles.blogManagement}>
      {/* Header */}
      <div className={styles.pageHeader}>
        <h1>Quản lý bài viết</h1>
      </div>

      {/* Toolbar */}
      <Card style={{ marginBottom: 24 }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={12}>
            <Input.Search
              placeholder="Tìm kiếm theo tiêu đề hoặc slug..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={24} sm={12} md={12} style={{ textAlign: 'right' }}>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAddBlog}>
              Thêm bài viết
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={filteredBlogs}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Tổng ${total} bài viết`,
          }}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* Modal */}
      <Modal
        title={editingBlog ? 'Chỉnh sửa bài viết' : 'Thêm bài viết'}
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
          setEditingBlog(null);
        }}
        width={900}
        bodyStyle={{ maxHeight: '70vh', overflow: 'auto' }}
      >
        <Form
          form={form}
          layout="vertical"
          autoComplete="off"
        >
          <Form.Item
            name="title"
            label="Tiêu đề"
            rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
          >
            <Input placeholder="Nhập tiêu đề bài viết" onBlur={handleSlugGenerate} />
          </Form.Item>

          <Form.Item
            name="slug"
            label="Slug"
            rules={[{ required: true, message: 'Vui lòng nhập slug' }]}
          >
            <Input placeholder="Slug sẽ được tạo tự động từ tiêu đề" />
          </Form.Item>

          <Form.Item
            name="excerpt"
            label="Mô tả ngắn"
          >
            <Input.TextArea rows={2} placeholder="Mô tả ngắn cho bài viết" />
          </Form.Item>

          <Form.Item
            name="content"
            label="Nội dung (Markdown)"
            rules={[{ required: true, message: 'Vui lòng nhập nội dung' }]}
          >
            <Input.TextArea
              rows={8}
              placeholder="Nhập nội dung bài viết (hỗ trợ Markdown)"
            />
          </Form.Item>

          <Button onClick={() => {
            const content = form.getFieldValue('content');
            setPreviewContent(content);
            setPreviewVisible(true);
          }} style={{ marginBottom: 16 }}>
            Xem trước Markdown
          </Button>

          <Form.Item
            name="coverImage"
            label="URL ảnh bìa"
            rules={[{ required: true, message: 'Vui lòng nhập URL ảnh bìa' }]}
          >
            <Input placeholder="https://..." />
          </Form.Item>

          <Form.Item
            name="tags"
            label="Thẻ"
            rules={[{ required: true, message: 'Vui lòng chọn ít nhất một thẻ' }]}
          >
            <Select
              mode="multiple"
              placeholder="Chọn thẻ"
              options={tags.map(tag => ({
                label: tag.name,
                value: tag.id,
              }))}
            />
          </Form.Item>

          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
          >
            <Select
              placeholder="Chọn trạng thái"
              options={BLOG_STATUS_OPTIONS}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* Preview Modal */}
      <Modal
        title="Xem trước Markdown"
        visible={previewVisible}
        onCancel={() => setPreviewVisible(false)}
        width={800}
        footer={null}
      >
        <MarkdownRenderer content={previewContent} className={styles.markdownContent} />
      </Modal>
    </div>
  );
};

export default BlogManagement;
