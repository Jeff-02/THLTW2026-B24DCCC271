import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Divider, Empty, Row, Spin, Tag as AntTag, Typography, Space, Avatar, Tooltip } from 'antd';
import { ArrowLeftOutlined, EyeOutlined, CalendarOutlined, UserOutlined, ShareAltOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'umi';
import { Blog } from './types';
import { getBlogBySlug, getTagsByIds, loadAuthorInfo, getRelatedBlogs, incrementViewCount, formatDate } from './utils';
import MarkdownRenderer from './MarkdownRenderer';
import styles from './BlogCaNhan.less';

const PostDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [relatedBlogs, setRelatedBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [authorInfo, setAuthorInfo] = useState(loadAuthorInfo());

  useEffect(() => {
    setLoading(true);
    if (slug) {
      const foundBlog = getBlogBySlug(slug);
      if (foundBlog) {
        incrementViewCount(slug);
        setBlog(foundBlog);
        
        // Get related blogs
        const related = getRelatedBlogs(foundBlog, 3);
        setRelatedBlogs(related);
      }
    }
    setLoading(false);
  }, [slug]);

  if (loading) {
    return <Spin />;
  }

  if (!blog) {
    return (
      <div className={styles.postDetail}>
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/blog')}
        >
          Quay lại
        </Button>
        <Empty description="Bài viết không tìm thấy" />
      </div>
    );
  }

  const blogTags = getTagsByIds(blog.tags);

  return (
    <div className={styles.postDetail}>
      {/* Back Button */}
      <Button
        type="text"
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate('/blog')}
        style={{ marginBottom: 24 }}
      >
        Quay lại
      </Button>

      {/* Main Content */}
      <Row gutter={[32, 32]}>
        <Col xs={24} lg={16}>
          <Card>
            {/* Cover Image */}
            {blog.coverImage && (
              <img
                alt={blog.title}
                src={blog.coverImage}
                style={{ width: '100%', borderRadius: 8, marginBottom: 24 }}
              />
            )}

            {/* Title */}
            <Typography.Title level={1}>{blog.title}</Typography.Title>

            {/* Meta Information */}
            <Space size="large" wrap style={{ marginBottom: 24 }}>
              <Space size="small">
                <CalendarOutlined />
                <span>{formatDate(blog.createDate)}</span>
              </Space>
              <Space size="small">
                <EyeOutlined />
                <span>{blog.views} lượt xem</span>
              </Space>
              {blog.updateDate && (
                <Tooltip title="Ngày cập nhật">
                  <span>Cập nhật: {formatDate(blog.updateDate)}</span>
                </Tooltip>
              )}
            </Space>

            {/* Tags */}
            <div style={{ marginBottom: 24 }}>
              {blogTags.map(tag => (
                <AntTag key={tag.id} color={tag.color}>
                  {tag.name}
                </AntTag>
              ))}
            </div>

            <Divider />

            {/* Content */}
            <MarkdownRenderer content={blog.content} className={styles.markdownContent} />

            <Divider />

            {/* Share & Actions */}
            <Space>
              <Button icon={<ShareAltOutlined />}>Chia sẻ</Button>
            </Space>
          </Card>
        </Col>

        {/* Sidebar */}
        <Col xs={24} lg={8}>
          {/* Author Info */}
          <Card style={{ marginBottom: 24 }}>
            <div style={{ textAlign: 'center' }}>
              <Avatar
                size={80}
                icon={<UserOutlined />}
                src={authorInfo?.avatar}
                style={{ marginBottom: 16 }}
              />
              <Typography.Title level={4}>{authorInfo?.name}</Typography.Title>
              <Typography.Paragraph type="secondary">
                {authorInfo?.bio}
              </Typography.Paragraph>
              <Button
                type="primary"
                onClick={() => navigate('/blog/about')}
                block
              >
                Xem thêm thông tin
              </Button>
            </div>
          </Card>

          {/* Related Posts */}
          {relatedBlogs.length > 0 && (
            <Card title="Bài viết liên quan">
              <Space direction="vertical" style={{ width: '100%' }} size="large">
                {relatedBlogs.map(relatedBlog => (
                  <Card
                    key={relatedBlog.id}
                    hoverable
                    size="small"
                    onClick={() => {
                      navigate(`/blog/post/${relatedBlog.slug}`);
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    {relatedBlog.coverImage && (
                      <img
                        alt={relatedBlog.title}
                        src={relatedBlog.coverImage}
                        style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 4, marginBottom: 8 }}
                      />
                    )}
                    <Typography.Title level={5} style={{ margin: 0 }}>
                      {relatedBlog.title}
                    </Typography.Title>
                    <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                      {formatDate(relatedBlog.createDate)}
                    </Typography.Text>
                  </Card>
                ))}
              </Space>
            </Card>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default PostDetail;
