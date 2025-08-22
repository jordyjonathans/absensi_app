import { foreignKey, integer } from "drizzle-orm/gel-core";
import {
  char,
  int,
  mysqlTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";
import { metaData } from "./metadata";
import { usersTable } from "./usersSchema";

export const attendancesTable = mysqlTable("attendances", {
  id: int({ unsigned: true }).autoincrement().primaryKey(),
  userId: int("user_id", { unsigned: true })
    .notNull()
    .references(() => usersTable.id),
  clockingType: int("clocking_type", { unsigned: true }).notNull(),
  ...metaData,
});
