import React, { useState, useEffect } from 'react';
import { Card, InputNumber, Button, List, Typography, Space, Alert, message } from 'antd';
import { ReloadOutlined, SendOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface GuessRecord {
  number: number;
  feedback: string;
  type: 'success' | 'warning' | 'danger' | 'secondary'; 
}

const Bai1: React.FC = () => {
  const [targetNumber, setTargetNumber] = useState<number>(0);
  const [currentGuess, setCurrentGuess] = useState<number | null>(null);
  const [history, setHistory] = useState<GuessRecord[]>([]);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [gameWon, setGameWon] = useState<boolean>(false);

  const initGame = () => {
    setTargetNumber(Math.floor(Math.random() * 100) + 1);
    setCurrentGuess(null);
    setHistory([]);
    setGameOver(false);
    setGameWon(false);
  };

  useEffect(() => {
    initGame();
  }, []);

  const handleGuess = () => {
    if (currentGuess === null) {
      message.warning('Vui lòng nhập một số!');
      return;
    }

    if (currentGuess < 1 || currentGuess > 100) {
      message.warning('Vui lòng nhập số từ 1 đến 100!');
      return;
    }

    const currentAttempts = history.length + 1;
    let feedback = '';
    let type: GuessRecord['type'] = 'secondary';
    let isWin = false;

    if (currentGuess === targetNumber) {
      feedback = 'Chúc mừng! Bạn đã đoán đúng!';
      type = 'success';
      isWin = true;
      setGameWon(true);
      setGameOver(true);
    } else if (currentGuess < targetNumber) {
      feedback = 'Bạn đoán quá thấp!';
      type = 'warning';
    } else {
      feedback = 'Bạn đoán quá cao!';
      type = 'danger'; 
    }

    const newRecord: GuessRecord = { number: currentGuess, feedback, type };
    const newHistory = [newRecord, ...history];
    setHistory(newHistory);
    setCurrentGuess(null);

    if (!isWin && currentAttempts >= 10) {
      setGameOver(true);
      message.error(`Bạn đã hết lượt! Số đúng là ${targetNumber}`);
    }
  };

  return (
    <Card 
      title={<Title level={3} style={{ margin: 0 }}>Bài 1: Trò chơi đoán số</Title>} 
      bordered={false}
      style={{ maxWidth: 600, margin: '0 auto' }}
    >
      <Alert
        message="Luật chơi"
        description="Hệ thống đã chọn một số ngẫu nhiên từ 1 đến 100. Bạn có 10 lượt để đoán số đó."
        type="info"
        showIcon
        style={{ marginBottom: 20 }}
      />

      {gameOver && !gameWon && (
        <Alert
          message="Bạn đã thua cuộc!"
          description={`Bạn đã hết lượt! Số đúng là ${targetNumber}.`}
          type="error"
          showIcon
          style={{ marginBottom: 20 }}
        />
      )}

      {gameWon && (
        <Alert
          message="Tuyệt vời!"
          description={`Chúc mừng! Bạn đã đoán đúng số ${targetNumber} trong ${history.length} lượt.`}
          type="success"
          showIcon
          style={{ marginBottom: 20 }}
        />
      )}

      <Space style={{ marginBottom: 24, display: 'flex', width: '100%' }}>
        <InputNumber
          placeholder="Nhập số từ 1 - 100"
          min={1}
          max={100}
          value={currentGuess}
          onChange={(val) => setCurrentGuess(val)}
          onPressEnter={handleGuess}
          disabled={gameOver}
          style={{ width: 200 }}
          size="large"
        />
        <Button 
          type="primary" 
          icon={<SendOutlined />} 
          size="large"
          onClick={handleGuess}
          disabled={gameOver || currentGuess === null}
        >
          Đoán
        </Button>
        <Button 
          icon={<ReloadOutlined />} 
          size="large"
          onClick={initGame}
        >
          Chơi lại
        </Button>
      </Space>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <Text strong>Lịch sử dự đoán:</Text>
        <Text type={history.length >= 8 ? 'danger' : 'secondary'}>
          Đã dùng: {history.length} / 10 lượt
        </Text>
      </div>

      <List
        bordered
        dataSource={history}
        renderItem={(item, index) => (
          <List.Item>
            <Space>
              <Text strong>Lần {history.length - index}:</Text>
              <Text code>{item.number}</Text>
              <Text type={item.type}>{item.feedback}</Text>
            </Space>
          </List.Item>
        )}
      />
    </Card>
  );
};

export default Bai1;