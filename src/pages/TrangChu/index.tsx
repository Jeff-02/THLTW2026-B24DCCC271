import React, { useEffect, useMemo, useState } from 'react';
import { Card, Col, Row, Input, Select, Pagination, Tag, Typography, Image } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { Blog } from '../BlogCaNhan/BlogCaNhan';

const { Title, Text, Paragraph } = Typography;
const { Meta } = Card;

const TrangChu: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [search, setSearch] = useState('');
  const [filterTags, setFilterTags] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const pageSize = 9;

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
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  const availableTags = useMemo(() => {
    const allTags = blogs.flatMap(blog => blog.tags || []);
    let storedTags: string[] = [];
    try {
      const s = localStorage.getItem('blogCaNhanTags');
      storedTags = s ? JSON.parse(s).map((t: any) => t.name) : [];
    } catch {
      storedTags = [];
    }
    return [...new Set([...allTags, ...storedTags])];
  }, [blogs]);  

  const filteredBlogs = useMemo(() => {
    return blogs.filter((blog) => {
      const isPublished = blog.status === 'Công khai';
      const matchSearch = blog.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                         blog.content.toLowerCase().includes(debouncedSearch.toLowerCase());
      const matchTags = filterTags.length === 0 || 
                       filterTags.some(tag => blog.tags.includes(tag));
      return isPublished && matchSearch && matchTags;
    });
  }, [blogs, debouncedSearch, filterTags]);

  const paginatedBlogs = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredBlogs.slice(startIndex, startIndex + pageSize);
  }, [filteredBlogs, currentPage, pageSize]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleTagClick = (tag: string) => {
    if (filterTags.includes(tag)) {
      setFilterTags(filterTags.filter(t => t !== tag));
    } else {
      setFilterTags([...filterTags, tag]);
    }
    setCurrentPage(1); 
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: '32px' }}>
        Blog Cá Nhân
      </Title>

      {/* Search and Filter */}
      <div style={{ marginBottom: '24px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        <Input
          placeholder="Tìm kiếm bài viết..."
          prefix={<SearchOutlined />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 1, minWidth: '200px' }}
        />
        <Select
          mode="multiple"
          placeholder="Lọc theo thẻ"
          style={{ minWidth: '200px' }}
          value={filterTags}
          onChange={setFilterTags}
          allowClear
        >
          {availableTags.map((tag) => (
            <Select.Option key={tag} value={tag}>
              {tag}
            </Select.Option>
          ))}
        </Select>
      </div>

      {/* Tag Filter Buttons */}
      {availableTags.length > 0 && (
        <div style={{ marginBottom: '24px' }}>
          <Text strong style={{ marginRight: '12px' }}>Thẻ phổ biến:</Text>
          {availableTags.slice(0, 10).map((tag) => (
            <Tag
              key={tag}
              color={filterTags.includes(tag) ? 'blue' : 'default'}
              style={{ cursor: 'pointer', marginBottom: '4px' }}
              onClick={() => handleTagClick(tag)}
            >
              {tag}
            </Tag>
          ))}
        </div>
      )}

      {/* Blog Cards */}
      <Row gutter={[24, 24]}>
        {paginatedBlogs.map((blog) => (
          <Col xs={24} sm={12} lg={8} key={blog.id}>
            <Card
              hoverable
              cover={
                <Image
                  alt={blog.title}
                  src={blog.coverImage}
                  style={{ height: '200px', objectFit: 'cover' }}
                  fallback="https://via.placeholder.com/400x200?text=No+Image"
                />
              }
              onClick={() => window.location.href = `/post/${blog.slug}`}
              style={{ height: '100%' }}
            >
              <Meta
                title={<Title level={4} ellipsis={{ rows: 2 }}>{blog.title}</Title>}
                description={
                  <div>
                    <Paragraph ellipsis={{ rows: 3 }} style={{ marginBottom: '8px' }}>
                      {blog.content}
                    </Paragraph>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        {blog.tags.slice(0, 2).map((tag) => (
                          <Tag key={tag} size="small">{tag}</Tag>
                        ))}
                        {blog.tags.length > 2 && <Tag size="small">+{blog.tags.length - 2}</Tag>}
                      </div>
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        {blog.createDate}
                      </Text>
                    </div>
                    <div style={{ marginTop: '8px' }}>
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        👁 {blog.views} lượt xem
                      </Text>
                    </div>
                  </div>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* Pagination */}
      {filteredBlogs.length > pageSize && (
        <div style={{ textAlign: 'center', marginTop: '32px' }}>
          <Pagination
            current={currentPage}
            total={filteredBlogs.length}
            pageSize={pageSize}
            onChange={handlePageChange}
            showSizeChanger={false}
          />
        </div>
      )}

      {/* Empty State */}
      {filteredBlogs.length === 0 && (
        <div style={{ textAlign: 'center', padding: '48px' }}>
          <Title level={4} type="secondary">
            Không tìm thấy bài viết nào
          </Title>
          <Text type="secondary">
            Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc
          </Text>
        </div>
      )}
    </div>
  );
};

export default TrangChu;