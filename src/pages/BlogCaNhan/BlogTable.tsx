import React from 'react';
import { Button, Input, Select, Space, Table, Tag, Popconfirm } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Blog, BlogStatus } from './BlogCaNhan';

interface BlogTableProps {
  blogs: Blog[];
  search: string;
  onSearchChange: (search: string) => void;
  filterTags?: string[];
  onFilterTagsChange: (tags: string[] | undefined) => void;
  filterStatus?: BlogStatus;
  onFilterStatusChange: (status: BlogStatus | undefined) => void;
  availableTags: string[];
  onAddBlog: () => void;
  onEditBlog: (blog: Blog) => void;
  onDeleteBlog: (id: string) => void;
}

const BlogTable: React.FC<BlogTableProps> = ({
  blogs,
  search,
  onSearchChange,
  filterTags,
  onFilterTagsChange,
  filterStatus,
  onFilterStatusChange,
  availableTags,
  onAddBlog,
  onEditBlog,
  onDeleteBlog,
}) => {
  const getStatusColor = (status: BlogStatus) => {
    const colors: Record<BlogStatus, string> = {
      'Công khai': 'green',
      'Nháp': 'orange',
      'Ẩn': 'red',
    };
    return colors[status] || 'blue';
  };

  const columns = [
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
      width: '25%',
      render: (text: string) => <span>{text}</span>,
    },
    {
      title: 'Slug',
      dataIndex: 'slug',
      key: 'slug',
      width: '20%',
      render: (text: string) => <span>{text}</span>,
    },
    {
      title: 'Thẻ',
      dataIndex: 'tags',
      key: 'tags',
      width: '20%',
      render: (tags: string[]) => (
        <>
          {/* BẢO VỆ MẢNG ĐỂ TRÁNH LỖI UNDEFINED */}
          {(tags || []).map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: '12%',
      render: (status: BlogStatus) => (
        <Tag color={getStatusColor(status)}>{status}</Tag>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createDate',
      key: 'createDate',
      width: '13%',
      render: (text: string) => <span>{text}</span>,
    },
    {
      title: 'Lượt xem',
      dataIndex: 'views',
      key: 'views',
      width: '10%',
      render: (views: number) => <span>{views}</span>,
    },
    {
      title: 'Hành động',
      key: 'action',
      width: '18%',
      render: (_: any, record: Blog) => (
        <Space size="small">
          <Button icon={<EditOutlined />} onClick={() => onEditBlog(record)} size="small" type="primary">
            Sửa
          </Button>
          <Popconfirm
            title="Xóa bài viết"
            description="Bạn có chắc chắn muốn xóa bài viết này?"
            onConfirm={() => onDeleteBlog(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button icon={<DeleteOutlined />} danger size="small">
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Space style={{ marginBottom: 16 }} wrap>
        <Input.Search placeholder="Tìm kiếm bài viết..." value={search} onChange={(e) => onSearchChange(e.target.value)} style={{ width: 250 }} />
        <Select mode="multiple" placeholder="Lọc theo thẻ" style={{ width: 200 }} value={filterTags} onChange={onFilterTagsChange} allowClear>
          {availableTags.map((tag) => (
            <Select.Option key={tag} value={tag}>
              {tag}
            </Select.Option>
          ))}
        </Select>
        <Select placeholder="Lọc theo trạng thái" style={{ width: 150 }} value={filterStatus} onChange={onFilterStatusChange} allowClear>
          <Select.Option value="Nháp">Nháp</Select.Option>
          <Select.Option value="Công khai">Công khai</Select.Option>
          <Select.Option value="Ẩn">Ẩn</Select.Option>
        </Select>
        <Button icon={<PlusOutlined />} type="primary" onClick={onAddBlog}>
          Thêm bài viết
        </Button>
      </Space>

      <Table columns={columns} dataSource={blogs} rowKey="id" pagination={{ pageSize: 10, showTotal: (total) => `Tổng ${total} bài viết` }} />
    </div>
  );
};

export default BlogTable;