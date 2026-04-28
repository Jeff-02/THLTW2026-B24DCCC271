import React, { useEffect, useMemo, useState } from 'react';
import { Card, Col, Empty, Input, Pagination, Row, Select, Spin, Tag as AntTag } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useNavigate } from 'umi';
import type { Blog, Tag } from './types';
import { ITEMS_PER_PAGE, DEBOUNCE_DELAY } from './constants';
import { getPublishedBlogs, getTagsByIds, loadTags, searchBlogs, paginate, getTotalPages, formatDate } from './utils';
import styles from './BlogCaNhan.less';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    setLoading(true);
    const publishedBlogs = getPublishedBlogs();
    const allTags = loadTags();
    
    setBlogs(publishedBlogs);
    setTags(allTags);
    setCurrentPage(1);
    setLoading(false);
  }, []);

  const filteredBlogs = useMemo(() => {
    return searchBlogs(blogs, searchQuery, selectedTags.length > 0 ? selectedTags : undefined);
  }, [blogs, searchQuery, selectedTags]);

  const paginatedBlogs = useMemo(() => {
    return paginate(filteredBlogs, currentPage, ITEMS_PER_PAGE);
  }, [filteredBlogs, currentPage]);

  const totalPages = getTotalPages(filteredBlogs.length, ITEMS_PER_PAGE);

  const handleBlogClick = (slug: string) => {
    navigate(`/blog/post/${slug}`);
  };

  return (
    <div className={styles.homepage}>
      {/* Header */}
      <div className={styles.pageHeader}>
        <h1>Blog Cá Nhân</h1>
        <p>Chia sẻ kiến thức, kinh nghiệm và những suy nghĩ của tôi</p>
      </div>

      {/* Search & Filter */}
      <div className={styles.filterSection}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={24} md={12} lg={12}>
            <Input
              placeholder="Tìm kiếm bài viết..."
              prefix={<SearchOutlined />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={24} sm={24} md={12} lg={12}>
            <Select
              mode="multiple"
              placeholder="Lọc theo thẻ"
              value={selectedTags}
              onChange={setSelectedTags}
              options={tags.map(tag => ({
                label: tag.name,
                value: tag.id
              }))}
              allowClear
              maxTagCount="responsive"
            />
          </Col>
        </Row>
      </div>

      {/* Results Summary */}
      {filteredBlogs.length > 0 && (
        <div className={styles.resultSummary}>
          <p>Tìm thấy <strong>{filteredBlogs.length}</strong> bài viết</p>
        </div>
      )}

      {/* Blog Cards */}
      <Spin spinning={loading}>
        {paginatedBlogs.length > 0 ? (
          <Row gutter={[24, 24]}>
            {paginatedBlogs.map((blog) => {
              const blogTags = getTagsByIds(blog.tags);
              return (
                <Col key={blog.id} xs={24} sm={24} md={12} lg={8}>
                  <Card
                    hoverable
                    cover={
                      <div
                        className={styles.cardCover}
                        onClick={() => handleBlogClick(blog.slug)}
                      >
                        <img
                          alt={blog.title}
                          src={blog.coverImage}
                          style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                        />
                      </div>
                    }
                    onClick={() => handleBlogClick(blog.slug)}
                  >
                    <Card.Meta
                      title={<a>{blog.title}</a>}
                      description={
                        <>
                          {blog.excerpt && <p className={styles.excerpt}>{blog.excerpt}</p>}
                          <div className={styles.cardMeta}>
                            <span>{formatDate(blog.createDate)}</span>
                            <span>👁 {blog.views}</span>
                          </div>
                          <div className={styles.tags}>
                            {blogTags.map(tag => (
                              <AntTag key={tag.id} color={tag.color}>
                                {tag.name}
                              </AntTag>
                            ))}
                          </div>
                        </>
                      }
                    />
                  </Card>
                </Col>
              );
            })}
          </Row>
        ) : (
          <Empty description="Không có bài viết nào" />
        )}
      </Spin>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className={styles.paginationContainer}>
          <Pagination
            current={currentPage}
            total={filteredBlogs.length}
            pageSize={ITEMS_PER_PAGE}
            onChange={setCurrentPage}
            showSizeChanger={false}
            showTotal={(total) => `Tổng ${total} bài viết`}
          />
        </div>
      )}
    </div>
  );
};

export default HomePage;
