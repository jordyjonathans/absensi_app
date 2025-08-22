import httpRequest from './http';
import { AttendanceData, AttendanceSummaryData } from '../store/types/attendanceType';
import Base from './Base';

const attendanceUrl = {
  attendances: '/attendance',
  attendanceSummaryByUser: '/attendance/summary',
  attendanceClockIn: '/attendance/clockin',
  attendanceClockOut: '/attendance/clockout',
};

class Attendance extends Base {
  getAttendances(): Promise<AttendanceData[]> {
    let attendancesUrl = this.getProxyUrl(attendanceUrl.attendances);
    return httpRequest.get<AttendanceData[]>(attendancesUrl, {});
  }

  getAttendancesSummaryByUser(
    externalId: string,
    startDate: string,
    endDate: string
  ): Promise<AttendanceSummaryData[]> {
    let attendancesSummaryUrl =
      this.getProxyUrl(attendanceUrl.attendanceSummaryByUser) +
      '/' +
      externalId +
      '/' +
      startDate +
      '/' +
      endDate;
    return httpRequest.get<AttendanceSummaryData[]>(attendancesSummaryUrl, {});
  }

  clockIn(clockInInfo: { externalId: string }): Promise<any> {
    let clockInUrl = this.getProxyUrl(attendanceUrl.attendanceClockIn);
    return httpRequest.post<any>(clockInUrl, {}, clockInInfo);
  }

  clockOut(clockOutInfo: { externalId: string }): Promise<any> {
    let clockOutUrl = this.getProxyUrl(attendanceUrl.attendanceClockOut);
    return httpRequest.post<any>(clockOutUrl, {}, clockOutInfo);
  }
}

export const AttendanceService = new Attendance();
