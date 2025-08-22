import { useEffect, useState } from 'react';
import MainIndexStaffUI from '../component/IndexStaffUI';
import { AttendanceSummaryData } from '../../../store/types/attendanceType';
import { AttendanceService } from '../../../services/Attendance';
import { useOutletContext } from 'react-router-dom';
import moment, { Moment } from 'moment';
import { message } from 'antd';

const MainIndexStaff: React.FC = () => {
  const outlet = useOutletContext<{ myExternalId?: string } | undefined>();
  const { myExternalId } = outlet || {};

  const [startDate, setStartDate] = useState<Moment | null>(moment());
  const [endDate, setEndDate] = useState<Moment | null>(moment());
  const [attendancesSummary, setAttendancesSummary] = useState<AttendanceSummaryData[]>([]);

  useEffect(() => {
    getAttendancesSummary();
  }, []);

  const getAttendancesSummary = () => {
    if (!startDate || !endDate) return;
    AttendanceService.getAttendancesSummaryByUser(
      myExternalId || '',
      startDate.utc().format(),
      endDate.utc().format()
    )
      .then((attendancesSummaryData: AttendanceSummaryData[]) => {
        setAttendancesSummary(attendancesSummaryData);
      })
      .catch(e => {
        console.log('get profile catch: ', e);
      });
  };

  const handleStartDateOnChange = (date: Moment | null) => {
    setStartDate(date);
  };
  const handleEndDateOnChange = (date: Moment | null) => {
    setEndDate(date);
  };
  const handleSearch = () => {
    getAttendancesSummary();
  };
  const handleClockIn = () => {
    AttendanceService.clockIn({
      externalId: myExternalId || '',
    })
      .then(() => {
        message.info('Clock in success');
        getAttendancesSummary();
      })
      .catch(e => {
        console.log('get profile catch: ', e);
      });
  };
  const handleClockOut = () => {
    AttendanceService.clockOut({
      externalId: myExternalId || '',
    })
      .then(() => {
        message.info('Clock out success');
        getAttendancesSummary();
      })
      .catch(e => {
        console.log('get profile catch: ', e);
      });
  };

  return (
    <div className="panel">
      <MainIndexStaffUI
        attendanceSummary={attendancesSummary}
        onChangeStartDate={handleStartDateOnChange}
        onChangeEndDate={handleEndDateOnChange}
        onHandleSearch={handleSearch}
        onHandleClockIn={handleClockIn}
        onHandleClockOut={handleClockOut}
        startDateValue={startDate}
        endDateValue={endDate}
      />
    </div>
  );
};

export default MainIndexStaff;
