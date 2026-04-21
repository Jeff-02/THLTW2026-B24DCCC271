import React from 'react';
import { Form, Input, Modal, Select, Button } from 'antd';
import { Blog, BlogFormValues, BlogStatus } from './BlogCaNhan';

interface BlogModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (values: BlogFormValues) => void;
  editingBlog?: Blog | null;
  categories: string[];
}

const BlogModal: React.FC<BlogModalProps> = ({
  visible,
  onClose,
  onSubmit,
  editingBlog,
  categories,
}) => {
  const [form] = Form.useForm();

  React.useEffect(() => {
    if (editingBlog) {
      form.setFieldsValue({
        title: editingBlog.title,
        slug: editingBlog.slug,
        content: editingBlog.content,
        coverImage: editingBlog.coverImage,
        tags: editingBlog.tags || [],
        status: editingBlog.status,
      });
    } else {
      form.resetFields();
    }
  }, [editingBlog, visible, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      onSubmit(values);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  return (
    <Modal
      title={editingBlog ? 'Sửa bài viết' : 'Thêm bài viết mới'}
      open={visible}
      visible={visible}
      onCancel={onClose}
      width={600}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Hủy
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>
          {editingBlog ? 'Cập nhật' : 'Thêm'}
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item label="Tiêu đề" name="title" rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}>
          <Input placeholder="Nhập tiêu đề bài viết" />
        </Form.Item>

        <Form.Item label="Slug" name="slug" rules={[{ required: true, message: 'Vui lòng nhập slug' }]}>
          <Input placeholder="nhap-tieu-de-bai-viet" />
        </Form.Item>

        <Form.Item label="Nội dung" name="content" rules={[{ required: true, message: 'Vui lòng nhập nội dung' }]}>
          <Input.TextArea rows={6} placeholder="Nhập nội dung bài viết" />
        </Form.Item>

        <Form.Item label="Ảnh đại diện (URL)" name="coverImage" rules={[{ required: true, message: 'Vui lòng nhập URL ảnh đại diện' }]}>
          <Input placeholder="https://example.com/image.jpg" />
        </Form.Item>

        <Form.Item label="Thẻ (Tags)" name="tags" rules={[{ required: true, message: 'Vui lòng chọn ít nhất một thẻ' }]}>
          <Select mode="tags" placeholder="Chọn hoặc nhập thẻ mới" style={{ width: '100%' }}>
            {categories.map((tag) => (
              <Select.Option key={tag} value={tag}>
                {tag}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Trạng thái" name="status" rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]} initialValue="Nháp">
          <Select placeholder="Chọn trạng thái">
            <Select.Option value="Nháp">Nháp</Select.Option>
            <Select.Option value="Công khai">Công khai</Select.Option>
            <Select.Option value="Ẩn">Ẩn</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default BlogModal;