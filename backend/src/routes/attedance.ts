import { Router } from "express";
import {
  clockIn,
  clockOut,
  getAttendancesByUser,
  getAttendanceSummaryByUser,
} from "src/controllers/attendanceController";
import { isAuth } from "src/middleware/auth";

const attendanceRouter = Router();

attendanceRouter.get("/", isAuth, getAttendancesByUser);
attendanceRouter.get(
  "/summary/:externalId/:startDate/:endDate",
  isAuth,
  getAttendanceSummaryByUser
);
attendanceRouter.post("/clockin", isAuth, clockIn);
attendanceRouter.post("/clockout", isAuth, clockOut);

export default attendanceRouter;
