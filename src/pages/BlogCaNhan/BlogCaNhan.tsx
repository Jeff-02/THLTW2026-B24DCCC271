import React, { useEffect, useMemo, useState } from 'react';
import { Card, Col, message, Row, Statistic, Typography } from 'antd';
import BlogModal from './BlogModal';
import BlogTable from './BlogTable';

export type BlogStatus = 'Nháp' | 'Công khai' | 'Ẩn';

export interface Blog {
  id: string;
  title: string;
  slug: string;
  content: string;
  coverImage: string;
  tags: string[];
  status: BlogStatus;
  createDate: string;
  views: number;
  author: string;
}

export interface BlogFormValues {
  title: string;
  slug: string;
  content: string;
  coverImage: string;
  tags: string[];
  status: BlogStatus;
}

const storageKey = 'blogCaNhanBlogs';

const defaultTags = [
  'Công nghệ',
  'Cuộc sống',
  'Du lịch',
  'Sức khỏe',
  'Giáo dục'
];

const loadBlogs = (): Blog[] => {
  try {
    const value = localStorage.getItem(storageKey);
    return value ? JSON.parse(value) : [];
  } catch {
    return [];
  }
};

const BlogCaNhan: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>(loadBlogs);
  const [search, setSearch] = useState('');
  const [filterTags, setFilterTags] = useState<string[] | undefined>(undefined);
  const [filterStatus, setFilterStatus] = useState<BlogStatus | undefined>(undefined);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(blogs));
  }, [blogs]);

  const filteredBlogs = useMemo(() => {
    return blogs.filter((blog) => {
      const matchSearch = blog.title.toLowerCase().includes(search.toLowerCase()) ||
                         blog.content.toLowerCase().includes(search.toLowerCase());
      // Thêm mảng rỗng làm fallback để tránh crash nếu tags bị undefined
      const matchTags = !filterTags || filterTags.length === 0 || 
                       filterTags.some(tag => (blog.tags || []).includes(tag));
      const matchStatus = !filterStatus || blog.status === filterStatus;
      return matchSearch && matchTags && matchStatus;
    });
  }, [blogs, search, filterTags, filterStatus]);

  const handleAddBlog = (values: BlogFormValues) => {
    const newBlog: Blog = {
      id: Date.now().toString(),
      ...values,
      createDate: new Date().toLocaleDateString('vi-VN'),
      views: 0,
      author: 'Nguyễn Đức Trường',
    };
    setBlogs([newBlog, ...blogs]);
    message.success('Thêm bài viết thành công');
    setIsModalVisible(false);
  };

  const handleUpdateBlog = (values: BlogFormValues) => {
    if (editingBlog) {
      setBlogs(blogs.map((b) => (b.id === editingBlog.id ? { ...editingBlog, ...values } : b)));
      message.success('Cập nhật bài viết thành công');
      setIsModalVisible(false);
      setEditingBlog(null);
    }
  };

  const handleDeleteBlog = (id: string) => {
    setBlogs(blogs.filter((b) => b.id !== id));
    message.success('Xóa bài viết thành công');
  };

  const handleEditBlog = (blog: Blog) => {
    setEditingBlog(blog);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setEditingBlog(null);
  };

  const availableTags = useMemo(() => {
    // Thêm mảng rỗng làm fallback
    const allTags = blogs.flatMap(blog => blog.tags || []);
    let storedTags: string[] = [];
    try {
      const s = localStorage.getItem('blogCaNhanTags');
      storedTags = s ? JSON.parse(s).map((t: any) => t.name) : [];
    } catch {
      storedTags = [];
    }
    return [...new Set([...defaultTags, ...allTags, ...storedTags])];
  }, [blogs]);

  const stats = {
    total: blogs.length,
    published: blogs.filter((b) => b.status === 'Công khai').length,
    draft: blogs.filter((b) => b.status === 'Nháp').length,
    totalViews: blogs.reduce((sum, b) => sum + (b.views || 0), 0),
  };

  return (
    <div>
      <Card>
        <Row gutter={16}>
          <Col xs={24} sm={12} md={6}>
            <Statistic title="Tổng bài viết" value={stats.total} valueStyle={{ color: '#1890ff' }} />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Statistic title="Công khai" value={stats.published} valueStyle={{ color: '#52c41a' }} />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Statistic title="Nháp" value={stats.draft} valueStyle={{ color: '#faad14' }} />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Statistic title="Lượt xem" value={stats.totalViews} valueStyle={{ color: '#f5222d' }} />
          </Col>
        </Row>
      </Card>

      <Card style={{ marginTop: 24 }}>
        <BlogTable
          blogs={filteredBlogs}
          search={search}
          onSearchChange={setSearch}
          filterTags={filterTags}
          onFilterTagsChange={setFilterTags}
          filterStatus={filterStatus}
          onFilterStatusChange={setFilterStatus}
          availableTags={availableTags}
          onAddBlog={() => setIsModalVisible(true)}
          onEditBlog={handleEditBlog}
          onDeleteBlog={handleDeleteBlog}
        />
      </Card>

      <BlogModal
        visible={isModalVisible}
        onClose={handleCloseModal}
        onSubmit={editingBlog ? handleUpdateBlog : handleAddBlog}
        editingBlog={editingBlog}
        categories={availableTags}
      />
    </div>
  );
};

export default BlogCaNhan;