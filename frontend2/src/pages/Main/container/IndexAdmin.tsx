import { useEffect, useState } from 'react';
import MainIndexAdminUI from '../component/IndexAdminUI';
import { AttendanceData } from '../../../store/types/attendanceType';
import { AttendanceService } from '../../../services/Attendance';

const MainIndexAdmin: React.FC = () => {
  const [attendances, setAttendances] = useState<AttendanceData[]>([]);

  useEffect(() => {
    getAttendances();
  }, []);

  const getAttendances = () => {
    AttendanceService.getAttendances()
      .then((attendanceData: AttendanceData[]) => {
        setAttendances(attendanceData);
      })
      .catch(e => {
        console.error('Error get attendance: ', e);
      });
  };

  return (
    <div className="panel">
      <MainIndexAdminUI attendances={attendances} />
    </div>
  );
};

export default MainIndexAdmin;
