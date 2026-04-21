import React from 'react';
import { Card, Typography, Avatar, Row, Col, Divider } from 'antd';
import { UserOutlined, MailOutlined, GithubOutlined, LinkedinOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

const About: React.FC = () => {
  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: '32px' }}>
        Giới thiệu
      </Title>

      <Card>
        <Row gutter={[32, 32]} align="middle">
          <Col xs={24} md={8}>
            <div style={{ textAlign: 'center' }}>
              <Avatar
                size={120}
                icon={<UserOutlined />}
                style={{ marginBottom: '16px' }}
              />
              <Title level={3} style={{ marginBottom: '8px' }}>
                Nguyễn Đức Trường
              </Title>
              <Text type="secondary">Frontend Developer</Text>
            </div>
          </Col>

          <Col xs={24} md={16}>
            <Title level={4}>Về tôi</Title>
            <Paragraph style={{ fontSize: '16px', lineHeight: '1.8' }}>
              Xin chào! Tôi là Nguyễn Đức Trường, một lập trình viên frontend với niềm đam mê
              phát triển các ứng dụng web hiện đại và thân thiện với người dùng.
            </Paragraph>

            <Paragraph style={{ fontSize: '16px', lineHeight: '1.8' }}>
              Blog cá nhân này là nơi tôi chia sẻ kiến thức, kinh nghiệm và những bài học
              thú vị trong quá trình làm việc với các công nghệ frontend như React, TypeScript,
              và Ant Design.
            </Paragraph>

            <Paragraph style={{ fontSize: '16px', lineHeight: '1.8' }}>
              Tôi tin rằng việc học hỏi và chia sẻ kiến thức là cách tốt nhất để phát triển
              bản thân và cộng đồng. Hy vọng những bài viết trên blog sẽ mang lại giá trị
              cho bạn!
            </Paragraph>

            <Divider />

            <Title level={4}>Kỹ năng</Title>
            <Row gutter={[8, 8]}>
              <Col span={12}>
                <Text strong>• React & TypeScript</Text>
              </Col>
              <Col span={12}>
                <Text strong>• Ant Design</Text>
              </Col>
              <Col span={12}>
                <Text strong>• JavaScript/ES6+</Text>
              </Col>
              <Col span={12}>
                <Text strong>• HTML/CSS</Text>
              </Col>
              <Col span={12}>
                <Text strong>• Node.js</Text>
              </Col>
              <Col span={12}>
                <Text strong>• Git</Text>
              </Col>
            </Row>

            <Divider />

            <Title level={4}>Liên hệ</Title>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <MailOutlined style={{ marginRight: '8px' }} />
                <Text>nguyenductruong@example.com</Text>
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <GithubOutlined style={{ marginRight: '8px' }} />
                <Text>github.com/nguyenductruong</Text>
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <LinkedinOutlined style={{ marginRight: '8px' }} />
                <Text>linkedin.com/in/nguyenductruong</Text>
              </div>
            </div>
          </Col>
        </Row>
      </Card>

      <Card style={{ marginTop: '24px' }}>
        <Title level={4}>Sở thích cá nhân</Title>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={8}>
            <Card size="small" style={{ textAlign: 'center' }}>
              <Title level={5}>📚 Đọc sách</Title>
              <Text type="secondary">
                Thích đọc sách về công nghệ, khoa học và phát triển cá nhân
              </Text>
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card size="small" style={{ textAlign: 'center' }}>
              <Title level={5}>💻 Coding</Title>
              <Text type="secondary">
                Luôn tìm tòi và học hỏi các công nghệ mới trong lĩnh vực lập trình
              </Text>
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card size="small" style={{ textAlign: 'center' }}>
              <Title level={5}>🏃 Thể thao</Title>
              <Text type="secondary">
                Thích chạy bộ và chơi thể thao để duy trì sức khỏe
              </Text>
            </Card>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default About;
