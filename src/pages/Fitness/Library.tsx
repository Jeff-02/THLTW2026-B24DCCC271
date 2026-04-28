import React, { useEffect, useMemo, useState } from 'react';
import { Card, Col, Input, Modal, Row, Select, Space, Tag, Typography, message } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

interface ExerciseItem {
  id: string;
  name: string;
  group: string;
  difficulty: 'Dễ' | 'Trung bình' | 'Khó';
  description: string;
  calories: number;
}

const STORAGE_KEY = 'fitnessExerciseLibrary';
const EXERCISE_GROUPS = ['Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core', 'Full Body'];
const INITIAL_EXERCISES: ExerciseItem[] = [
  {
    id: 'ex-1',
    name: 'Push Up',
    group: 'Chest',
    difficulty: 'Trung bình',
    description: 'Bài tập tay không giúp tăng sức mạnh ngực và vai.',
    calories: 80,
  },
  {
    id: 'ex-2',
    name: 'Squat',
    group: 'Legs',
    difficulty: 'Trung bình',
    description: 'Bài tập chân cơ bản giúp tăng cơ đùi và mông.',
    calories: 100,
  },
  {
    id: 'ex-3',
    name: 'Plank',
    group: 'Core',
    difficulty: 'Dễ',
    description: 'Bài tập giữ thăng bằng giúp tăng sức mạnh cơ bụng.',
    calories: 45,
  },
  {
    id: 'ex-4',
    name: 'Deadlift',
    group: 'Back',
    difficulty: 'Khó',
    description: 'Bài tập nâng tạ với mục tiêu lưng dưới và hông.',
    calories: 140,
  },
  {
    id: 'ex-5',
    name: 'Bench Press',
    group: 'Chest',
    difficulty: 'Khó',
    description: 'Bài tập tạ ngực giúp phát triển sức mạnh phần trên cơ thể.',
    calories: 130,
  },
];

const Library: React.FC = () => {
  const [exercises, setExercises] = useState<ExerciseItem[]>([]);
  const [search, setSearch] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string | undefined>(undefined);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | undefined>(undefined);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<ExerciseItem | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setExercises(JSON.parse(stored));
    } else {
      setExercises(INITIAL_EXERCISES);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_EXERCISES));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(exercises));
  }, [exercises]);

  const filtered = useMemo(() => {
    return exercises.filter((item) => {
      const matchSearch = item.name.toLowerCase().includes(search.toLowerCase()) || item.description.toLowerCase().includes(search.toLowerCase());
      const matchGroup = !selectedGroup || item.group === selectedGroup;
      const matchDifficulty = !selectedDifficulty || item.difficulty === selectedDifficulty;
      return matchSearch && matchGroup && matchDifficulty;
    });
  }, [exercises, search, selectedGroup, selectedDifficulty]);

  const openDetail = (item: ExerciseItem) => {
    setSelectedExercise(item);
    setViewModalVisible(true);
  };

  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Title level={3}>Thư viện bài tập</Title>
      </Row>

      <Card style={{ marginBottom: 24 }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={10}>
            <Input
              placeholder="Tìm kiếm bài tập"
              prefix={<SearchOutlined />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Col>
          <Col xs={24} md={7}>
            <Select
              allowClear
              placeholder="Nhóm cơ"
              style={{ width: '100%' }}
              value={selectedGroup}
              onChange={setSelectedGroup}
            >
              {EXERCISE_GROUPS.map((group) => (
                <Select.Option key={group} value={group}>
                  {group}
                </Select.Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} md={7}>
            <Select
              allowClear
              placeholder="Mức độ khó"
              style={{ width: '100%' }}
              value={selectedDifficulty}
              onChange={setSelectedDifficulty}
            >
              {['Dễ', 'Trung bình', 'Khó'].map((difficulty) => (
                <Select.Option key={difficulty} value={difficulty}>
                  {difficulty}
                </Select.Option>
              ))}
            </Select>
          </Col>
        </Row>
      </Card>

      <Row gutter={[24, 24]}>
        {filtered.map((item) => (
          <Col xs={24} sm={12} lg={8} key={item.id}>
            <Card
              hoverable
              title={item.name}
              onClick={() => openDetail(item)}
              style={{ cursor: 'pointer' }}
            >
              <Space direction="vertical" size="small">
                <Text>
                  <strong>Nhóm cơ:</strong> {item.group}
                </Text>
                <Text>
                  <strong>Mức độ:</strong> {item.difficulty}
                </Text>
                <Text>
                  <strong>Calo / 30 phút:</strong> {item.calories}
                </Text>
                <Paragraph ellipsis={{ rows: 3 }}>{item.description}</Paragraph>
              </Space>
            </Card>
          </Col>
        ))}
      </Row>

      {filtered.length === 0 && (
        <Card style={{ textAlign: 'center', marginTop: 24 }}>
          <Text type="secondary">Không tìm thấy bài tập phù hợp.</Text>
        </Card>
      )}

      <Modal
        title={selectedExercise?.name}
        visible={viewModalVisible}
        footer={null}
        onCancel={() => setViewModalVisible(false)}
      >
        {selectedExercise && (
          <Space direction="vertical" style={{ width: '100%' }}>
            <Text>
              <strong>Nhóm cơ:</strong> {selectedExercise.group}
            </Text>
            <Text>
              <strong>Mức độ:</strong> {selectedExercise.difficulty}
            </Text>
            <Text>
              <strong>Calo dự kiến:</strong> {selectedExercise.calories}
            </Text>
            <Paragraph>{selectedExercise.description}</Paragraph>
          </Space>
        )}
      </Modal>
    </div>
  );
};

export default Library;
