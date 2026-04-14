import React from 'react';
import { Button, Card, Input, Popconfirm, Select, Space, Table, Tag, Tooltip } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { Course, CourseStatus } from './index';

interface CourseTableProps {
  filteredCourses: Course[];
  search: string;
  filterInstructor?: string;
  filterStatus?: CourseStatus;
  defaultInstructors: string[];
  onSearchChange: (value: string) => void;
  onInstructorFilterChange: (value?: string) => void;
  onStatusFilterChange: (value?: CourseStatus) => void;
  onOpenModal: (course?: Course) => void;
  onDeleteCourse: (course: Course) => void;
}

const CourseTable: React.FC<CourseTableProps> = ({
  filteredCourses,
  search,
  filterInstructor,
  filterStatus,
  defaultInstructors,
  onSearchChange,
  onInstructorFilterChange,
  onStatusFilterChange,
  onOpenModal,
  onDeleteCourse,
}) => {
  const columns: ColumnsType<Course> = [
    { title: 'ID khóa học', dataIndex: 'id', key: 'id', width: 180 },
    { title: 'Tên khóa học', dataIndex: 'name', key: 'name', render: (text) => <strong>{text}</strong> },
    { title: 'Giảng viên', dataIndex: 'instructor', key: 'instructor', width: 180 },
    {
      title: 'Số lượng học viên',
      dataIndex: 'students',
      key: 'students',
      sorter: (a, b) => a.students - b.students,
      render: (value) => value.toLocaleString('vi-VN'),
      width: 160,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const color = status === 'Đang mở' ? 'green' : status === 'Tạm dừng' ? 'orange' : 'default';
        return <Tag color={color}>{status}</Tag>;
      },
      width: 140,
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 210,
      render: (_, record) => (
        <Space split={<span style={{ color: '#f5222d' }}>|</span>}>
          <Button type="text" onClick={() => onOpenModal(record)}>
            Sửa
          </Button>
          {record.students > 0 ? (
            <Tooltip title="Không thể xóa khóa học đang có học viên">
              <Button type="text" danger disabled>
                Xóa
              </Button>
            </Tooltip>
          ) : (
            <Popconfirm
              title="Xác nhận xóa khóa học này?"
              onConfirm={() => onDeleteCourse(record)}
              okText="Xóa"
              cancelText="Hủy"
            >
              <Button type="text" danger>
                Xóa
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <Card
      title="Danh sách khóa học"
      bordered
      bodyStyle={{ padding: 20 }}
      style={{ borderRadius: 14, boxShadow: '0 12px 30px rgba(0,0,0,0.06)' }}
    >
      <Space wrap style={{ width: '100%', justifyContent: 'space-between', marginBottom: 16 }}>
        <Space wrap style={{ flex: 1, minWidth: 420 }}>
          <Input.Search
            placeholder="Tìm kiếm theo tên khóa học"
            value={search}
            allowClear
            onChange={(event) => onSearchChange(event.target.value)}
            style={{ minWidth: 240 }}
          />
          <Select
            allowClear
            placeholder="Giảng viên"
            value={filterInstructor}
            onChange={(value) => onInstructorFilterChange(value)}
            options={defaultInstructors.map((instructor) => ({ label: instructor, value: instructor }))}
            style={{ minWidth: 180 }}
          />
          <Select
            allowClear
            placeholder="Trạng thái"
            value={filterStatus}
            onChange={(value) => onStatusFilterChange(value as CourseStatus | undefined)}
            options={[
              { label: 'Đang mở', value: 'Đang mở' },
              { label: 'Đã kết thúc', value: 'Đã kết thúc' },
              { label: 'Tạm dừng', value: 'Tạm dừng' },
            ]}
            style={{ minWidth: 180 }}
          />
        </Space>
        <Button type="primary" danger onClick={() => onOpenModal()}>
          Thêm khóa học
        </Button>
      </Space>
      <Table<Course>
        rowKey="id"
        dataSource={filteredCourses}
        columns={columns}
        pagination={{ pageSize: 8 }}
        scroll={{ x: 1000 }}
        style={{ marginTop: 8 }}
        size="middle"
        rowClassName={() => 'course-row'}
      />
    </Card>
  );
};

export default CourseTable;
