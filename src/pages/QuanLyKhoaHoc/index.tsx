import React, { useEffect, useMemo, useState } from 'react';
import { Card, Col, message, Row, Statistic, Typography } from 'antd';
import CourseModal from './CourseModal';
import CourseTable from './CourseTable';

export type CourseStatus = 'Đang mở' | 'Đã kết thúc' | 'Tạm dừng';

export interface Course {
  id: string;
  name: string;
  instructor: string;
  students: number;
  status: CourseStatus;
  description: string;
}

export interface CourseFormValues {
  name: string;
  instructor: string;
  students: number;
  status: CourseStatus;
  description: string;
}

const storageKey = 'onlineCourseManagementCourses';

const defaultInstructors = [
  'Nguyễn Văn A', 
  'Nguyễn Đức Trường', 
  'Nguyễn Việt Dũng', 
  'Phan Quang Thành', 
  'Ngô Văn Nhậm'
];

const loadCourses = (): Course[] => {
  try {
    const value = localStorage.getItem(storageKey);
    return value ? JSON.parse(value) : [];
  } catch {
    return [];
  }
};

const QuanLyKhoaHoc: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>(loadCourses);
  const [search, setSearch] = useState('');
  const [filterInstructor, setFilterInstructor] = useState<string | undefined>(undefined);
  const [filterStatus, setFilterStatus] = useState<CourseStatus | undefined>(undefined);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(courses));
  }, [courses]);

  const filteredCourses = useMemo(
    () =>
      courses
        .filter((course) => course.name.toLowerCase().includes(search.toLowerCase()))
        .filter((course) => (filterInstructor ? course.instructor === filterInstructor : true))
        .filter((course) => (filterStatus ? course.status === filterStatus : true)),
    [courses, search, filterInstructor, filterStatus],
  );

  const stats = useMemo(
    () => ({
      total: courses.length,
      open: courses.filter((course) => course.status === 'Đang mở').length,
      paused: courses.filter((course) => course.status === 'Tạm dừng').length,
      finished: courses.filter((course) => course.status === 'Đã kết thúc').length,
    }),
    [courses],
  );

  const openModal = (course?: Course) => {
    setEditingCourse(course || null);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setEditingCourse(null);
  };

  const handleSaveCourse = (values: CourseFormValues) => {
    const duplicate = courses.find(
      (course) => course.name.trim().toLowerCase() === values.name.trim().toLowerCase() && course.id !== editingCourse?.id,
    );

    if (duplicate) {
      message.error('Tên khóa học đã tồn tại. Vui lòng nhập tên khác.');
      return;
    }

    if (editingCourse) {
      setCourses((prev) =>
        prev.map((course) =>
          course.id === editingCourse.id
            ? { ...course, ...values, name: values.name.trim(), instructor: values.instructor }
            : course,
        ),
      );
      message.success('Cập nhật khóa học thành công.');
    } else {
      setCourses((prev) => [
        ...prev,
        {
          id: `KH-${Date.now()}`,
          name: values.name.trim(),
          instructor: values.instructor,
          students: values.students,
          status: values.status,
          description: values.description,
        },
      ]);
      message.success('Thêm khóa học mới thành công.');
    }

    closeModal();
  };

  const handleDeleteCourse = (course: Course) => {
    if (course.students > 0) {
      message.warning('Không thể xóa khóa học đang có học viên.');
      return;
    }
    setCourses((prev) => prev.filter((item) => item.id !== course.id));
    message.success('Đã xóa khóa học.');
  };

  return (
    <div style={{ padding: '16px 0' }}>
      <Typography.Title level={3} style={{ marginBottom: 8 }}>
        Quản lý khóa học online
      </Typography.Title>
      <Typography.Text type="secondary">
        Quản lý danh sách khóa học, giảng viên, học viên và trạng thái.
      </Typography.Text>

      <Row gutter={[16, 16]} style={{ marginTop: 24, marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card bodyStyle={{ padding: 18, borderRadius: 12 }} style={{ borderColor: '#f0f0f0' }}>
            <Statistic title="Tổng khóa học" value={stats.total} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card bodyStyle={{ padding: 18, borderRadius: 12 }} style={{ borderColor: '#f0f0f0' }}>
            <Statistic title="Đang mở" value={stats.open} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card bodyStyle={{ padding: 18, borderRadius: 12 }} style={{ borderColor: '#f0f0f0' }}>
            <Statistic title="Tạm dừng" value={stats.paused} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card bodyStyle={{ padding: 18, borderRadius: 12 }} style={{ borderColor: '#f0f0f0' }}>
            <Statistic title="Đã kết thúc" value={stats.finished} />
          </Card>
        </Col>
      </Row>

      <CourseTable
        filteredCourses={filteredCourses}
        search={search}
        filterInstructor={filterInstructor}
        filterStatus={filterStatus}
        defaultInstructors={defaultInstructors}
        onSearchChange={setSearch}
        onInstructorFilterChange={setFilterInstructor}
        onStatusFilterChange={setFilterStatus}
        onOpenModal={openModal}
        onDeleteCourse={handleDeleteCourse}
      />

      <CourseModal
        visible={isModalVisible}
        editingCourse={editingCourse}
        defaultInstructors={defaultInstructors}
        onClose={closeModal}
        onSave={handleSaveCourse}
      />
    </div>
  );
};

export default QuanLyKhoaHoc;