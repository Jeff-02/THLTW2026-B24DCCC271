import React from 'react';
import { Button, Form, Input, InputNumber, Modal, Select, Space } from 'antd';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; 
import type { Course, CourseFormValues } from './index';

interface CourseModalProps {
  visible: boolean;
  defaultInstructors: string[];
  editingCourse: Course | null;
  onSave: (values: CourseFormValues) => void;
  onClose: () => void;
}

const CourseModal: React.FC<CourseModalProps> = ({
  visible,
  defaultInstructors,
  editingCourse,
  onSave,
  onClose,
}) => {
  const [form] = Form.useForm<CourseFormValues>();

  React.useEffect(() => {
    if (editingCourse) {
      form.setFieldsValue({
        name: editingCourse.name,
        instructor: editingCourse.instructor,
        students: editingCourse.students,
        status: editingCourse.status,
        description: editingCourse.description,
      });
    } else {
      form.resetFields();
    }
  }, [editingCourse, form]);

  const handleFinish = (values: CourseFormValues) => {
    onSave(values);
  };

  return (
    <Modal
      title={editingCourse ? 'Chỉnh sửa khóa học' : 'Thêm mới khóa học'}
      visible={visible}
      onCancel={onClose}
      footer={null}
      destroyOnClose
      width={700} 
    >
      <Form<CourseFormValues>
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{ students: 0, status: 'Đang mở' }}
      >
        <Form.Item
          name="name"
          label="Tên khóa học"
          rules={[
            { required: true, message: 'Vui lòng nhập tên khóa học' },
            { max: 100, message: 'Tối đa 100 ký tự' },
          ]}
        >
          <Input placeholder="Nhập tên khóa học" />
        </Form.Item>

        <Form.Item name="instructor" label="Giảng viên" rules={[{ required: true, message: 'Vui lòng chọn giảng viên' }]}> 
          <Select placeholder="Chọn giảng viên có sẵn" options={defaultInstructors.map((teacher) => ({ label: teacher, value: teacher }))} />
        </Form.Item>

        <Form.Item name="students" label="Số lượng học viên" rules={[{ required: true, message: 'Vui lòng nhập số học viên' }]}> 
          <InputNumber min={0} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item name="status" label="Trạng thái" rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}> 
          <Select
            options={['Đang mở', 'Đã kết thúc', 'Tạm dừng'].map((status) => ({ label: status, value: status }))}
          />
        </Form.Item>

        {}
        <Form.Item 
          name="description" 
          label="Mô tả khóa học" 
          rules={[
            { required: true, message: 'Vui lòng nhập mô tả' },
            { 
              validator: async (_, value) => {
                if (!value || value === '<p><br></p>') {
                  return Promise.reject(new Error('Vui lòng nhập mô tả'));
                }
              }
            }
          ]}
        > 
          <ReactQuill theme="snow" placeholder="Nhập nội dung HTML..." style={{ height: '150px', marginBottom: '40px' }} />
        </Form.Item>

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">
              {editingCourse ? 'Cập nhật' : 'Thêm mới'}
            </Button>
            <Button onClick={onClose}>Hủy</Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CourseModal;