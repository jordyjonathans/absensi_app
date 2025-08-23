import { RequestHandler } from "express";
import { MysqlConnection } from "src/db/mysql/mysqlConnection";
import { attendancesTable, employeesTable, usersTable } from "src/db/mysql";
import { and, desc, eq, gte, lte, ne, sql } from "drizzle-orm";
import { toYMD } from "src/helper/helper";
import { QueueDataModel } from "src/types/queue";
import { sendQueueMessage } from "src/services/producer";
import { sendPushNotificationToAdmins } from "src/services/firebaseMessaging";

export const clockIn: RequestHandler = async (req, res) => {
  const { externalId } = req.body;
  const userExternalId = req.user.externalId;

  try {
    if (!externalId)
      return res.status(400).json({ status: "N", message: "ID is empty" });

    const db = MysqlConnection.getDbInstance();

    const [user] = await db
      .select({
        userId: usersTable.id,
        nama: employeesTable.nama,
      })
      .from(usersTable)
      .innerJoin(employeesTable, eq(usersTable.id, employeesTable.userId))
      .where(eq(usersTable.externalId, externalId))
      .limit(1);

    if (!user)
      return res.status(401).json({ status: "N", message: "User not found" });

    const data = {
      clockingType: 0,
      userId: user.userId,
    };

    await db.insert(attendancesTable).values(data);

    const queueData: QueueDataModel = {
      event: "logging",
      data: {
        createdBy: userExternalId,
        userId: user.userId,
        message: "clockin",
        originalData: data,
      },
    };

    await sendPushNotificationToAdmins(`${user.nama} has clocked in`);

    await sendQueueMessage(queueData);

    return res.status(201).json({ status: "Y", message: "success" });
  } catch (e) {
    return res
      .status(400)
      .json({ status: "N", message: "Get user attendances failed" });
  }
};

export const clockOut: RequestHandler = async (req, res) => {
  const { externalId } = req.body;
  const user_external_id = req.user.externalId;

  try {
    if (!externalId)
      return res.status(400).json({ status: "N", message: "ID is empty" });

    const db = MysqlConnection.getDbInstance();

    const [user] = await db
      .select({
        userId: usersTable.id,
        nama: employeesTable.nama,
      })
      .from(usersTable)
      .innerJoin(employeesTable, eq(usersTable.id, employeesTable.userId))
      .where(eq(usersTable.externalId, externalId))
      .limit(1);

    if (!user)
      return res.status(401).json({ status: "N", message: "User not found" });

    const data = {
      clockingType: 1,
      userId: user.userId,
    };

    await db.insert(attendancesTable).values(data);

    const queueData: QueueDataModel = {
      event: "logging",
      data: {
        createdBy: user_external_id,
        userId: user.userId,
        message: "clockout",
        originalData: data,
      },
    };
    await sendPushNotificationToAdmins(`${user.nama} has clocked out`);

    await sendQueueMessage(queueData);

    return res.status(201).json({ status: "Y", message: "success" });
  } catch (e) {
    return res
      .status(400)
      .json({ status: "N", message: "Get user attendances failed" });
  }
};

export const getAttendancesByUser: RequestHandler = async (req, res) => {
  const { roleSlug } = req.user;

  if (roleSlug !== "admin")
    return res.status(401).json({ status: "N", message: "User unauthorized" });

  try {
    const db = MysqlConnection.getDbInstance();

    const attendances = await db
      .select({
        userId: usersTable.id,
        name: employeesTable.nama,
        clockingType:
          sql<string>`CASE WHEN ${attendancesTable.clockingType} = 0 THEN 'Clock In' ELSE 'Clock Out' END`.as(
            "clockingType"
          ),
        createdAt: attendancesTable.createdAt,
      })
      .from(attendancesTable)
      .innerJoin(usersTable, eq(attendancesTable.userId, usersTable.id))
      .innerJoin(employeesTable, eq(usersTable.id, employeesTable.userId))
      .orderBy(desc(attendancesTable.createdAt));

    if (attendances.length === 0)
      return res
        .status(400)
        .json({ status: "N", message: "No attendance of selected user found" });

    return res
      .status(200)
      .json({ status: "Y", message: "success", data: attendances });
  } catch (e) {
    return res
      .status(400)
      .json({ status: "N", message: "Get user attendances failed" });
  }
};

export const getAttendanceSummaryByUser: RequestHandler = async (req, res) => {
  const { externalId, startDate, endDate } = req.params;

  try {
    if (!startDate || !endDate) {
      return res
        .status(400)
        .json({ status: "N", message: "Start Date and End Date is Mandatory" });
    }
    if (!externalId)
      return res.status(400).json({ status: "N", message: "ID is empty" });

    const db = MysqlConnection.getDbInstance();

    const attendanceSummary = await db
      .select({
        date: sql<Date>`DATE(${attendancesTable.createdAt})`.as("date"),
        clockIn: sql<Date | null>`
        MIN(CASE WHEN ${attendancesTable.clockingType} = 0
                 THEN ${attendancesTable.createdAt} END)
      `.as("clockIn"),
        clockOut: sql<Date | null>`
        MAX(CASE WHEN ${attendancesTable.clockingType} = 1
                 THEN ${attendancesTable.createdAt} END)
      `.as("clockOut"),
      })
      .from(attendancesTable)
      .innerJoin(usersTable, eq(attendancesTable.userId, usersTable.id))
      .where(
        and(
          eq(usersTable.externalId, externalId),
          sql`DATE(${attendancesTable.createdAt}) >= ${toYMD(startDate)}`,
          sql`DATE(${attendancesTable.createdAt}) <= ${toYMD(endDate)}`
        )
      )
      .groupBy(
        attendancesTable.userId,
        sql<Date>`DATE(${attendancesTable.createdAt})`
      )
      .orderBy(
        attendancesTable.userId,
        sql<Date>`DATE(${attendancesTable.createdAt})`
      );

    if (attendanceSummary.length === 0)
      return res
        .status(400)
        .json({ status: "N", message: "No attendance of selected user found" });

    return res
      .status(200)
      .json({ status: "Y", message: "success", data: attendanceSummary });
  } catch (e) {
    return res
      .status(400)
      .json({ status: "N", message: "Get user attendances failed" });
  }
};
