import React, { useEffect, useState, useMemo } from 'react';
import { Card, Typography, Tag, Divider, Avatar, Row, Col, Image, message } from 'antd';
import { marked } from 'marked';
import { UserOutlined, CalendarOutlined, EyeOutlined } from '@ant-design/icons';
import { Blog } from '../BlogCaNhan/BlogCaNhan';

const { Title, Text, Paragraph } = Typography;

interface PostDetailProps {
  slug: string;
}

const PostDetail: React.FC<PostDetailProps> = ({ slug }) => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [currentBlog, setCurrentBlog] = useState<Blog | null>(null);
  const [relatedBlogs, setRelatedBlogs] = useState<Blog[]>([]);

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
    if (blogs.length > 0 && slug) {
      const blog = blogs.find(b => b.slug === slug && b.status === 'Công khai');
      if (blog) {
        const updatedBlogs = blogs.map(b =>
          b.id === blog.id ? { ...b, views: (b.views || 0) + 1 } : b
        );
        setBlogs(updatedBlogs);
        localStorage.setItem('blogCaNhanBlogs', JSON.stringify(updatedBlogs));

        const updatedBlog = updatedBlogs.find(b => b.id === blog.id) || { ...blog, views: (blog.views || 0) + 1 };
        setCurrentBlog(updatedBlog);

        const related = updatedBlogs
          .filter(b => b.id !== blog.id && b.status === 'Công khai')
          .filter(b => (b.tags || []).some(tag => (blog.tags || []).includes(tag)))
          .slice(0, 3);
        setRelatedBlogs(related);
      }
    }
  }, [blogs, slug]);

  if (!currentBlog) {
    return (
      <div style={{ textAlign: 'center', padding: '48px' }}>
        <Title level={3} type="secondary">
          Không tìm thấy bài viết
        </Title>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      {/* Article Header */}
      <Card style={{ marginBottom: '24px' }}>
        <Title level={1} style={{ marginBottom: '16px' }}>
          {currentBlog.title}
        </Title>

        {/* Author and Meta Info */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Avatar size="large" icon={<UserOutlined />} style={{ marginRight: '12px' }} />
            <div>
              <Text strong>{currentBlog.author}</Text>
              <br />
              <Text type="secondary" style={{ fontSize: '12px' }}>
                <CalendarOutlined style={{ marginRight: '4px' }} />
                {currentBlog.createDate}
              </Text>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <EyeOutlined style={{ marginRight: '4px' }} />
            <Text type="secondary">{currentBlog.views + 1} lượt xem</Text>
          </div>
        </div>

        {/* Tags */}
        <div style={{ marginBottom: '24px' }}>
          {currentBlog.tags.map((tag) => (
            <Tag key={tag} color="blue" style={{ marginBottom: '4px' }}>
              {tag}
            </Tag>
          ))}
        </div>

        {/* Cover Image */}
        {currentBlog.coverImage && (
          <div style={{ marginBottom: '24px' }}>
            <Image
              src={currentBlog.coverImage}
              alt={currentBlog.title}
              style={{ width: '100%', maxHeight: '400px', objectFit: 'cover', borderRadius: '8px' }}
              fallback="https://via.placeholder.com/800x400?text=No+Image"
            />
          </div>
        )}
      </Card>

      {/* Article Content */}
      <Card>
        <div style={{ lineHeight: '1.8', fontSize: '16px' }}>
          <div dangerouslySetInnerHTML={{ __html: marked.parse(currentBlog.content || '') }} />
        </div>
      </Card>

      {/* Related Articles */}
      {relatedBlogs.length > 0 && (
        <Card style={{ marginTop: '24px' }}>
          <Title level={3} style={{ marginBottom: '16px' }}>
            Bài viết liên quan
          </Title>
          <Row gutter={[16, 16]}>
            {relatedBlogs.map((blog) => (
              <Col xs={24} sm={8} key={blog.id}>
                <Card
                  hoverable
                  size="small"
                  cover={
                    <Image
                      alt={blog.title}
                      src={blog.coverImage}
                      style={{ height: '120px', objectFit: 'cover' }}
                      fallback="https://via.placeholder.com/200x120?text=No+Image"
                    />
                  }
                  onClick={() => window.location.href = `/post/${blog.slug}`}
                >
                  <Card.Meta
                    title={<Text ellipsis={{ rows: 2 }} style={{ fontSize: '14px' }}>{blog.title}</Text>}
                    description={
                      <div>
                        {blog.tags.slice(0, 2).map((tag) => (
                          <Tag key={tag} size="small" style={{ fontSize: '10px' }}>{tag}</Tag>
                        ))}
                        <br />
                        <Text type="secondary" style={{ fontSize: '11px' }}>
                          {blog.createDate}
                        </Text>
                      </div>
                    }
                  />
                </Card>
              </Col>
            ))}
          </Row>
        </Card>
      )}
    </div>
  );
};

export default PostDetail;
