export type AttendanceData = {
  userId: string;
  name: string;
  clockingType: string;
  createdAt: string;
};

export type AttendanceSummaryData = {
  userId: string;
  name: string;
  date: string;
  clockInTime: string;
  clockOutTime: string;
};
