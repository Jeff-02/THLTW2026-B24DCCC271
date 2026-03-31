import React, { useMemo } from 'react';
import { Card, Statistic, Row, Col, Table } from 'antd';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, Legend, ResponsiveContainer } from 'recharts';

interface CountItem { name: string; value: number; }

const BaoCaoThongKe: React.FC = () => {
  const clbList = JSON.parse(localStorage.getItem('clbList') || '[]');
  const donDKList = JSON.parse(localStorage.getItem('donDKList') || '[]');
  
  // Tính số lượng thành viên (đơn Approved)
  const thanhVienList = donDKList.filter((item: any) => item.trangThai === 'Approved');

  // Thống kê trạng thái chung
  const statusCount = useMemo(() => {
    const counts: Record<string, number> = { Pending: 0, Approved: 0, Rejected: 0 };
    (donDKList as any[]).forEach(item => { if (counts[item.trangThai] !== undefined) counts[item.trangThai] += 1; });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [donDKList]);

  // Xử lý data cho biểu đồ cột Recharts
  const chartData = useMemo(() => {
    const dataMap: Record<string, any> = {};
    
    // Tạo data gốc cho tất cả các CLB
    clbList.forEach((c: any) => {
      dataMap[c.ten] = { name: c.ten, Pending: 0, Approved: 0, Rejected: 0 };
    });

    // Gom đơn vào các CLB
    donDKList.forEach((don: any) => {
      const clbName = don.cauLacBo;
      // Nếu đơn đăng ký vào một CLB chưa có trong danh sách gốc thì tạo mới key
      if (!dataMap[clbName]) {
        dataMap[clbName] = { name: clbName, Pending: 0, Approved: 0, Rejected: 0 };
      }
      if (dataMap[clbName][don.trangThai] !== undefined) {
        dataMap[clbName][don.trangThai] += 1;
      }
    });

    return Object.values(dataMap);
  }, [clbList, donDKList]);

  return (
    <div>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={8}><Card><Statistic title="Tổng số Câu lạc bộ" value={clbList.length} /></Card></Col>
        <Col span={8}><Card><Statistic title="Tổng số Đơn đăng ký" value={donDKList.length} /></Card></Col>
        <Col span={8}><Card><Statistic title="Tổng số Thành viên (Approved)" value={thanhVienList.length} valueStyle={{ color: '#3f8600' }} /></Card></Col>
      </Row>

      <Row gutter={16}>
        <Col span={8}>
          <Card title="Thống kê chung theo trạng thái" style={{ height: '100%' }}>
            <Table<CountItem>
              dataSource={statusCount}
              rowKey="name"
              pagination={false}
              columns={[
                { title: 'Trạng thái', dataIndex: 'name' },
                { title: 'Số lượng đơn', dataIndex: 'value' },
              ]}
            />
          </Card>
        </Col>

        <Col span={16}>
          <Card title="Biểu đồ số đơn đăng ký theo từng Câu lạc bộ">
            <div style={{ width: '100%', height: 350 }}>
              <ResponsiveContainer>
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <ChartTooltip cursor={{ fill: '#f5f5f5' }} />
                  <Legend />
                  <Bar dataKey="Pending" fill="#faad14" name="Chờ duyệt (Pending)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Approved" fill="#52c41a" name="Đã duyệt (Approved)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Rejected" fill="#ff4d4f" name="Từ chối (Rejected)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default BaoCaoThongKe;