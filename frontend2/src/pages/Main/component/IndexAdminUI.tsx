import { Alert, Card, Col, Row, Space, Table } from 'antd';
import { AttendanceData } from '../../../store/types/attendanceType';
import { getDateTime } from '../../../utils/dateTime';
import Marquee from 'react-fast-marquee';

interface MainIndexAdminUIProps {
  attendances: AttendanceData[];
}

const columns = [
  {
    title: 'User ID',
    dataIndex: 'userId',
    key: 'userId',
  },
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Type',
    dataIndex: 'clockingType',
    key: 'clockingType',
  },
  {
    title: 'Date Time',
    dataIndex: 'createdAt',
    key: 'createdAt',
    render: (value: string) => getDateTime(value),
  },
];

const cardStyle: React.CSSProperties = {
  marginBottom: 16,
};

const MainIndexAdminUI = (props: MainIndexAdminUIProps) => {
  return (
    <div>
      <div className="panel-body">
        <Alert
          showIcon
          type="info"
          message={
            <Marquee pauseOnHover gradient={false} speed={60}>
              Notification will be here.
            </Marquee>
          }
        />
      </div>
      <div className="panel-body">
        <Row gutter={16}>
          <Col span={16}>
            <Card
              title={<Space>Data Absensi</Space>}
              bordered={true}
              type="inner"
              style={cardStyle}
              bodyStyle={{ padding: 16 }}
            >
              <Table dataSource={props.attendances} columns={columns} pagination={false} />
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default MainIndexAdminUI;
