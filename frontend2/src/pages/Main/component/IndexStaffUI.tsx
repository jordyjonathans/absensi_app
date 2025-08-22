import {
  UnorderedListOutlined,
  HddOutlined,
  DesktopOutlined,
  CodeOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import {
  Alert,
  Button,
  Card,
  Col,
  DatePicker,
  DatePickerProps,
  List,
  Row,
  Space,
  Table,
} from 'antd';
import { Moment } from 'moment';
import Marquee from 'react-fast-marquee';
import { AttendanceSummaryData } from '../../../store/types/attendanceType';
import { getDateTime } from '../../../utils/dateTime';

interface MainIndexStaffUIProps {
  attendanceSummary: AttendanceSummaryData[];
  onChangeStartDate: DatePickerProps['onChange'];
  onChangeEndDate: DatePickerProps['onChange'];
  onHandleSearch: () => void;
  onHandleClockIn: () => void;
  onHandleClockOut: () => void;
  startDateValue?: Moment | null;
  endDateValue?: Moment | null;
}

const columns = [
  {
    title: 'Date',
    dataIndex: 'date',
    key: 'date',
  },
  {
    title: 'Clock In',
    dataIndex: 'clockIn',
    key: 'clockIn',
    render: (value: string) => getDateTime(value),
  },
  {
    title: 'Clock Out',
    dataIndex: 'clockOut',
    key: 'clockOut',
    render: (value: string) => getDateTime(value),
  },
];

const cardStyle: React.CSSProperties = {
  marginBottom: 16,
};

const MainIndexStaffUI = (props: MainIndexStaffUIProps) => {
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
          <Col span={8}>
            <Card
              title={
                <Space>
                  <CodeOutlined />
                  Attendace Clock
                </Space>
              }
              style={cardStyle}
              type="inner"
            >
              <List>
                <List.Item>
                  <Button
                    type="primary"
                    icon={<DesktopOutlined />}
                    size="large"
                    onClick={props.onHandleClockIn}
                    block
                  >
                    Clock In
                  </Button>
                </List.Item>
                <List.Item>
                  <Button
                    type="default"
                    icon={<HddOutlined />}
                    size="large"
                    onClick={props.onHandleClockOut}
                    block
                  >
                    Clock Out
                  </Button>
                </List.Item>
              </List>
            </Card>
          </Col>
          <Col span={16}>
            <Card
              title={
                <Space>
                  <UnorderedListOutlined />
                  My Attendances
                </Space>
              }
              bordered={true}
              style={cardStyle}
              type="inner"
            >
              <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <Row gutter={24} align="middle" style={{ marginBottom: 24 }}>
                  <Col span={10}>
                    <div
                      style={{
                        padding: '16px 20px',
                        backgroundColor: '#fafafa',
                        borderRadius: '8px',
                        border: '1px solid #f0f0f0',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.06)',
                      }}
                    >
                      <Space direction="vertical" size={8} style={{ width: '100%' }}>
                        <span
                          style={{
                            color: '#262626',
                            fontSize: '13px',
                            fontWeight: 600,
                            letterSpacing: '0.3px',
                          }}
                        >
                          📅 Start Date
                        </span>
                        <DatePicker
                          value={props.startDateValue}
                          onChange={props.onChangeStartDate}
                          style={{
                            width: '100%',
                            borderRadius: '6px',
                          }}
                          placeholder="Select start date"
                          size="middle"
                        />
                      </Space>
                    </div>
                  </Col>
                  <Col span={10}>
                    <div
                      style={{
                        padding: '16px 20px',
                        backgroundColor: '#fafafa',
                        borderRadius: '8px',
                        border: '1px solid #f0f0f0',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.06)',
                      }}
                    >
                      <Space direction="vertical" size={8} style={{ width: '100%' }}>
                        <span
                          style={{
                            color: '#262626',
                            fontSize: '13px',
                            fontWeight: 600,
                            letterSpacing: '0.3px',
                          }}
                        >
                          📅 End Date
                        </span>
                        <DatePicker
                          value={props.endDateValue}
                          onChange={props.onChangeEndDate}
                          style={{
                            width: '100%',
                            borderRadius: '6px',
                          }}
                          placeholder="Select end date"
                          size="middle"
                        />
                      </Space>
                    </div>
                  </Col>
                  <Col span={4}>
                    <Button
                      type="primary"
                      onClick={props.onHandleSearch}
                      size="large"
                      style={{
                        width: '100%',
                        height: '48px',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: 600,
                        boxShadow: '0 2px 8px rgba(24, 144, 255, 0.3)',
                        border: 'none',
                      }}
                      icon={<SearchOutlined />}
                    >
                      Search
                    </Button>
                  </Col>
                </Row>

                <div style={{ marginTop: 4 }} />
                <Table
                  dataSource={props.attendanceSummary}
                  columns={columns}
                  pagination={false}
                  size="middle"
                  bordered
                  rowKey="date"
                />
              </Space>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default MainIndexStaffUI;
