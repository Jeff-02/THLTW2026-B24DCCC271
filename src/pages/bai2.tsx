import React, { useState, useEffect } from 'react';
import { 
  Card, Tabs, Button, Form, Input, InputNumber, Select, Table, Modal, 
  DatePicker, Popconfirm, message, Space, Progress, Typography
} from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import moment from 'moment';

const { Title } = Typography;

interface Subject { id: string; name: string; }
interface StudySession {
  id: string;
  subjectId: string;
  date: string;
  duration: number; 
  content: string;
  notes?: string;
}
interface Goal { id: string; subjectId: string; targetHours: number; }

const Bai2: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);

  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);

  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [editingSession, setEditingSession] = useState<StudySession | null>(null);

  const [formSubject] = Form.useForm();
  const [formSession] = Form.useForm();
  const [formGoal] = Form.useForm();

  useEffect(() => {
    let duLieuMonHoc = localStorage.getItem('b2_subjects');
    let duLieuTienDo = localStorage.getItem('b2_sessions');
    let duLieuMucTieu = localStorage.getItem('b2_goals');

    if (duLieuMonHoc) {
      setSubjects(JSON.parse(duLieuMonHoc));
    } else {
      let dataMau = [
        { id: '1', name: 'Toán' }, 
        { id: '2', name: 'Văn' }, 
        { id: '3', name: 'Anh' }
      ];
      setSubjects(dataMau);
      localStorage.setItem('b2_subjects', JSON.stringify(dataMau));
    }

    if (duLieuTienDo) {
      setSessions(JSON.parse(duLieuTienDo));
    }
    if (duLieuMucTieu) {
      setGoals(JSON.parse(duLieuMucTieu));
    }
  }, []);

  const luuMonHoc = (values: any) => {
    let mangMoi = [...subjects];

    if (editingSubject !== null) {
      for (let i = 0; i < mangMoi.length; i++) {
        if (mangMoi[i].id === editingSubject.id) {
          mangMoi[i].name = values.name;
        }
      }
      message.success('Cập nhật thành công!');
    } else {
      let monHocMoi = {
        id: Date.now().toString(),
        name: values.name
      };
      mangMoi.push(monHocMoi);
      message.success('Thêm môn học thành công!');
    }

    setSubjects(mangMoi);
    localStorage.setItem('b2_subjects', JSON.stringify(mangMoi)); 
    dongModalMonHoc();
  };

  const xoaMonHoc = (id: string) => {
    let mangMoi = subjects.filter(item => item.id !== id);
    setSubjects(mangMoi);
    localStorage.setItem('b2_subjects', JSON.stringify(mangMoi));
    message.success('Đã xóa môn học');
  };

  const moModalSuaMon = (record: Subject) => {
    setEditingSubject(record);
    formSubject.setFieldsValue({ name: record.name });
    setIsSubjectModalOpen(true);
  };

  const dongModalMonHoc = () => {
    setIsSubjectModalOpen(false);
    setEditingSubject(null);
    formSubject.resetFields();
  };


  const luuTienDo = (values: any) => {
    let mangMoi = [...sessions];
    
    let banGhiMoi: StudySession = {
      id: editingSession ? editingSession.id : Date.now().toString(),
      subjectId: values.subjectId,
      date: values.date.format('YYYY-MM-DD HH:mm'),
      duration: values.duration,
      content: values.content,
      notes: values.notes,
    };

    if (editingSession !== null) {
      for (let i = 0; i < mangMoi.length; i++) {
        if (mangMoi[i].id === editingSession.id) {
          mangMoi[i] = banGhiMoi;
        }
      }
      message.success('Đã cập nhật tiến độ');
    } else {
      mangMoi.unshift(banGhiMoi);
      message.success('Đã ghi nhận học tập');
    }

    setSessions(mangMoi);
    localStorage.setItem('b2_sessions', JSON.stringify(mangMoi));
    dongModalTienDo();
  };

  const xoaTienDo = (id: string) => {
    let mangMoi = sessions.filter(item => item.id !== id);
    setSessions(mangMoi);
    localStorage.setItem('b2_sessions', JSON.stringify(mangMoi));
    message.success('Đã xóa tiến độ');
  };

  const moModalSuaTienDo = (record: StudySession) => {
    setEditingSubject(null);
    setEditingSession(record);
    formSession.setFieldsValue({
      ...record,
      date: moment(record.date)
    });
    setIsSessionModalOpen(true);
  };

  const dongModalTienDo = () => {
    setIsSessionModalOpen(false);
    setEditingSession(null);
    formSession.resetFields();
  };


  const thietLapMucTieu = (values: any) => {
    let mangMoi = [...goals];
    let daCoMucTieuNayChua = false;

    for (let i = 0; i < mangMoi.length; i++) {
      if (mangMoi[i].subjectId === values.subjectId) {
        mangMoi[i].targetHours = values.targetHours;
        daCoMucTieuNayChua = true;
      }
    }

    if (daCoMucTieuNayChua === false) {
      mangMoi.push({
        id: Date.now().toString(),
        subjectId: values.subjectId,
        targetHours: values.targetHours
      });
    }
    
    setGoals(mangMoi);
    localStorage.setItem('b2_goals', JSON.stringify(mangMoi));
    setIsGoalModalOpen(false);
    formGoal.resetFields();
    message.success('Đã cập nhật mục tiêu tháng');
  };

  const xoaMucTieu = (id: string) => {
    let mangMoi = goals.filter(item => item.id !== id);
    setGoals(mangMoi);
    localStorage.setItem('b2_goals', JSON.stringify(mangMoi));
    message.success('Đã xóa mục tiêu');
  };

  const layTenMonHoc = (id: string) => {
    for (let i = 0; i < subjects.length; i++) {
      if (subjects[i].id === id) {
        return subjects[i].name;
      }
    }
    return 'Không rõ';
  };

  const tinhToanTienDo = () => {
    let bangKetQua = [];

    for (let i = 0; i < goals.length; i++) {
      let mucTieu = goals[i];
      let tongSoPhut = 0;

      for (let j = 0; j < sessions.length; j++) {
        let buoiHoc = sessions[j];
        if (mucTieu.subjectId === 'ALL') {
          tongSoPhut = tongSoPhut + buoiHoc.duration;
        } else if (buoiHoc.subjectId === mucTieu.subjectId) {
          tongSoPhut = tongSoPhut + buoiHoc.duration;
        }
      }
      let tongGioHoc = tongSoPhut / 60;
      let phanTram = (tongGioHoc / mucTieu.targetHours) * 100;
      
      if (phanTram > 100) {
        phanTram = 100;
      }
      let tenHienThi = "";
      if (mucTieu.subjectId === 'ALL') {
        tenHienThi = "Tất cả các môn học";
      } else {
        tenHienThi = layTenMonHoc(mucTieu.subjectId);
      }

      bangKetQua.push({
        key: mucTieu.id,
        subjectName: tenHienThi,
        target: mucTieu.targetHours,
        achieved: tongGioHoc.toFixed(1),
        percent: Math.round(phanTram)
      });
    }

    return bangKetQua;
  };

  return (
    <Card title={<Title level={3} style={{ margin: 0 }}>Bài 2: Quản lý học tập</Title>} bordered={false}>
      <Tabs defaultActiveKey="1">
        
        <Tabs.TabPane tab="1. Danh mục môn học" key="1">
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsSubjectModalOpen(true)} style={{ marginBottom: 16 }}>
            Thêm môn học
          </Button>
          <Table 
            dataSource={subjects} 
            rowKey="id" 
            pagination={{ pageSize: 5 }}
            columns={[
              { title: 'Tên môn học', dataIndex: 'name' },
              {
                title: 'Thao tác',
                width: 150,
                render: (_, record) => (
                  <Space>
                    <Button size="small" icon={<EditOutlined />} onClick={() => moModalSuaMon(record)}>Sửa</Button>
                    <Popconfirm title="Xóa môn này?" onConfirm={() => xoaMonHoc(record.id)}>
                      <Button danger size="small" icon={<DeleteOutlined />} />
                    </Popconfirm>
                  </Space>
                )
              }
            ]} 
          />
        </Tabs.TabPane>

        <Tabs.TabPane tab="2. Tiến độ học tập" key="2">
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsSessionModalOpen(true)} style={{ marginBottom: 16 }}>
            Ghi nhận học tập
          </Button>
          <Table 
            dataSource={sessions} 
            rowKey="id" 
            pagination={{ pageSize: 5 }}
            columns={[
              { title: 'Môn học', dataIndex: 'subjectId', render: (id: string) => layTenMonHoc(id) },
              { title: 'Thời gian', dataIndex: 'date' },
              { title: 'Thời lượng (phút)', dataIndex: 'duration' },
              { title: 'Nội dung', dataIndex: 'content' },
              { title: 'Ghi chú', dataIndex: 'notes' },
              {
                title: 'Thao tác',
                render: (_: any, record: StudySession) => (
                  <Space>
                    <Button size="small" icon={<EditOutlined />} onClick={() => moModalSuaTienDo(record)}>Sửa</Button>
                    <Popconfirm title="Xóa tiến độ này?" onConfirm={() => xoaTienDo(record.id)}>
                      <Button danger size="small" icon={<DeleteOutlined />} />
                    </Popconfirm>
                  </Space>
                ),
              },
            ]} 
          />
        </Tabs.TabPane>

        
        <Tabs.TabPane tab="3. Mục tiêu & Thống kê" key="3">
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsGoalModalOpen(true)} style={{ marginBottom: 16 }}>
            Thiết lập mục tiêu
          </Button>
          <Table 
            dataSource={tinhToanTienDo()} 
            rowKey="key"
            pagination={false}
            columns={[
              { title: 'Môn học', dataIndex: 'subjectName' },
              { title: 'Mục tiêu (Giờ)', dataIndex: 'target' },
              { title: 'Đã học (Giờ)', dataIndex: 'achieved' },
              {
                title: 'Tiến độ hoàn thành',
                dataIndex: 'percent',
                render: (percent) => <Progress percent={percent} status={percent >= 100 ? 'success' : 'active'} />
              },
              {
                title: 'Thao tác',
                render: (_, record) => (
                  <Popconfirm title="Xóa mục tiêu này?" onConfirm={() => xoaMucTieu(record.key)}>
                    <Button danger size="small" icon={<DeleteOutlined />} />
                  </Popconfirm>
                )
              }
            ]} 
          />
        </Tabs.TabPane>

      </Tabs>

      
      <Modal 
        title={editingSubject ? "Sửa môn học" : "Thêm môn học mới"} 
        visible={isSubjectModalOpen} 
        onCancel={dongModalMonHoc} 
        onOk={() => formSubject.submit()} 
        destroyOnClose
      >
        <Form form={formSubject} onFinish={luuMonHoc} layout="vertical">
          <Form.Item name="name" label="Tên môn học" rules={[{ required: true, message: 'Nhập tên môn học' }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      <Modal 
        title={editingSession ? "Sửa tiến độ" : "Ghi nhận tiến độ"} 
        visible={isSessionModalOpen} 
        onCancel={dongModalTienDo} 
        onOk={() => formSession.submit()} 
        destroyOnClose
      >
        <Form form={formSession} onFinish={luuTienDo} layout="vertical">
          <Form.Item name="subjectId" label="Môn học" rules={[{ required: true, message: 'Chọn môn học' }]}>
            <Select options={subjects.map(s => ({ label: s.name, value: s.id }))} />
          </Form.Item>
          <Form.Item name="date" label="Thời gian học" rules={[{ required: true, message: 'Chọn thời gian' }]}>
            <DatePicker showTime style={{ width: '100%' }} format="YYYY-MM-DD HH:mm" />
          </Form.Item>
          <Form.Item name="duration" label="Thời lượng (Phút)" rules={[{ required: true, message: 'Nhập số phút học' }]}>
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="content" label="Nội dung đã học" rules={[{ required: true, message: 'Nhập nội dung đã học' }]}>
            <Input.TextArea />
          </Form.Item>
          <Form.Item name="notes" label="Ghi chú">
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      <Modal 
        title="Thiết lập mục tiêu" 
        visible={isGoalModalOpen} 
        onCancel={() => setIsGoalModalOpen(false)} 
        onOk={() => formGoal.submit()} 
        destroyOnClose
      >
        <Form form={formGoal} onFinish={thietLapMucTieu} layout="vertical">
          <Form.Item name="subjectId" label="Môn học" rules={[{ required: true, message: 'Vui lòng chọn môn' }]}>
            <Select>
              <Select.Option value="ALL" style={{ fontWeight: 'bold' }}>Tất cả các môn (Tổng thời gian)</Select.Option>
              {subjects.map(s => <Select.Option key={s.id} value={s.id}>{s.name}</Select.Option>)}
            </Select>
          </Form.Item>
          <Form.Item name="targetHours" label="Mục tiêu (Giờ/Tháng)" rules={[{ required: true, message: 'Nhập số giờ' }]}>
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>

    </Card>
  );
};

export default Bai2;