import React, { useEffect, useState } from 'react';
import { Avatar, Button, Card, Col, Row, Space, Tag, Typography, Divider, List, Modal, Form, Input } from 'antd';
import { UserOutlined, LinkedinOutlined, GithubOutlined, TwitterOutlined, FacebookOutlined, MailOutlined, EditOutlined } from '@ant-design/icons';
import type { AuthorInfo } from './types';
import { loadAuthorInfo, saveAuthorInfo } from './utils';
import styles from './BlogCaNhan.less';

const About: React.FC = () => {
  const [authorInfo, setAuthorInfo] = useState<AuthorInfo>(loadAuthorInfo());
  const [isEditMode, setIsEditMode] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue(authorInfo);
  }, [authorInfo, form]);

  const handleSaveAuthor = (values: AuthorInfo) => {
    saveAuthorInfo(values);
    setAuthorInfo(values);
    setIsEditMode(false);
  };

  return (
    <div className={styles.aboutPage}>
      {/* Header */}
      <div className={styles.pageHeader}>
        <h1>Giới thiệu</h1>
        <p>Tìm hiểu thêm về tôi và những điều tôi làm</p>
      </div>

      <Row gutter={[32, 32]}>
        {}
        <Col xs={24} md={8}>
          <Card style={{ textAlign: 'center' }}>
            <Avatar
              size={150}
              icon={<UserOutlined />}
              src={authorInfo?.avatar}
              style={{ marginBottom: 24 }}
            />
            <Typography.Title level={2}>{authorInfo?.name}</Typography.Title>
            <Typography.Paragraph type="secondary" style={{ fontSize: 16, marginBottom: 24 }}>
              {authorInfo?.bio}
            </Typography.Paragraph>

            {!isEditMode && (
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={() => setIsEditMode(true)}
                block
              >
                Chỉnh sửa thông tin
              </Button>
            )}
          </Card>

          {}
          <Card style={{ marginTop: 24 }}>
            <Typography.Title level={4}>Liên kết</Typography.Title>
            <Space direction="vertical" style={{ width: '100%' }}>
              {authorInfo?.socialLinks?.github && (
                <Button
                  block
                  icon={<GithubOutlined />}
                  onClick={() => window.open(authorInfo.socialLinks.github)}
                >
                  GitHub
                </Button>
              )}
              {authorInfo?.socialLinks?.linkedin && (
                <Button
                  block
                  icon={<LinkedinOutlined />}
                  onClick={() => window.open(authorInfo.socialLinks.linkedin)}
                >
                  LinkedIn
                </Button>
              )}
              {authorInfo?.socialLinks?.twitter && (
                <Button
                  block
                  icon={<TwitterOutlined />}
                  onClick={() => window.open(authorInfo.socialLinks.twitter)}
                >
                  Twitter
                </Button>
              )}
              {authorInfo?.socialLinks?.facebook && (
                <Button
                  block
                  icon={<FacebookOutlined />}
                  onClick={() => window.open(authorInfo.socialLinks.facebook)}
                >
                  Facebook
                </Button>
              )}
              {authorInfo?.socialLinks?.email && (
                <Button
                  block
                  icon={<MailOutlined />}
                  onClick={() => window.location.href = `mailto:${authorInfo.socialLinks.email}`}
                >
                  Email
                </Button>
              )}
            </Space>
          </Card>
        </Col>

        {/* Right Column - Skills & Details */}
        <Col xs={24} md={16}>
          {isEditMode ? (
            <Card title="Chỉnh sửa thông tin">
              <Form
                form={form}
                layout="vertical"
                onFinish={handleSaveAuthor}
              >
                <Form.Item
                  name="name"
                  label="Tên"
                  rules={[{ required: true, message: 'Vui lòng nhập tên' }]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  name="avatar"
                  label="URL ảnh đại diện"
                >
                  <Input placeholder="https://..." />
                </Form.Item>

                <Form.Item
                  name="bio"
                  label="Giới thiệu ngắn"
                  rules={[{ required: true, message: 'Vui lòng nhập giới thiệu' }]}
                >
                  <Input.TextArea rows={4} />
                </Form.Item>

                <Divider>Liên kết mạng xã hội</Divider>

                <Form.Item
                  name={['socialLinks', 'github']}
                  label="GitHub"
                >
                  <Input placeholder="https://github.com/..." />
                </Form.Item>

                <Form.Item
                  name={['socialLinks', 'linkedin']}
                  label="LinkedIn"
                >
                  <Input placeholder="https://linkedin.com/..." />
                </Form.Item>

                <Form.Item
                  name={['socialLinks', 'twitter']}
                  label="Twitter"
                >
                  <Input placeholder="https://twitter.com/..." />
                </Form.Item>

                <Form.Item
                  name={['socialLinks', 'facebook']}
                  label="Facebook"
                >
                  <Input placeholder="https://facebook.com/..." />
                </Form.Item>

                <Form.Item
                  name={['socialLinks', 'email']}
                  label="Email"
                >
                  <Input type="email" />
                </Form.Item>

                <Space>
                  <Button type="primary" htmlType="submit">
                    Lưu
                  </Button>
                  <Button onClick={() => setIsEditMode(false)}>
                    Hủy
                  </Button>
                </Space>
              </Form>
            </Card>
          ) : (
            <>
              {/* Skills */}
              <Card title="Kỹ năng" style={{ marginBottom: 24 }}>
                <Space wrap>
                  {authorInfo?.skills?.map((skill) => (
                    <Tag key={skill} color="blue" style={{ padding: '6px 12px', fontSize: 14 }}>
                      {skill}
                    </Tag>
                  ))}
                </Space>
              </Card>

              {/* About Section */}
              <Card title="Về tôi">
                <Typography.Paragraph>
                  Tôi là một lập trình viên Full Stack với kinh nghiệm trong việc xây dựng các ứng dụng web hiệu suất cao và có trải nghiệm người dùng tuyệt vời.
                </Typography.Paragraph>

                <Typography.Title level={4}>Thành tựu</Typography.Title>
                <List
                  dataSource={[
                    'Xây dựng và duy trì các ứng dụng web phục vụ hàng ngàn người dùng',
                    'Tối ưu hóa hiệu năng ứng dụng giảm 60% thời gian tải',
                    'Dẫn dắt các dự án từ khái niệm đến triển khai thành công',
                    'Mentoring cho các lập trình viên junior',
                    'Đóng góp cho các dự án mã nguồn mở'
                  ]}
                  renderItem={(item) => <List.Item>✓ {item}</List.Item>}
                />

                <Typography.Title level={4} style={{ marginTop: 24 }}>
                  Sở thích
                </Typography.Title>
                <Typography.Paragraph>
                  Ngoài lập trình, tôi yêu thích đọc sách, du lịch, tập thể dục, và học hỏi những công nghệ mới. Tôi tin rằng việc học tập liên tục là chìa khóa để thành công trong lĩnh vực công nghệ.
                </Typography.Paragraph>
              </Card>
            </>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default About;
