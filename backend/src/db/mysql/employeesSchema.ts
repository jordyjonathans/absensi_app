import { char, int, mysqlTable, varchar } from "drizzle-orm/mysql-core";
import { metaData } from "./metadata";
import { usersTable } from "./usersSchema";

export const employeesTable = mysqlTable("employees", {
  id: int({ unsigned: true }).autoincrement().primaryKey(),
  userId: int("user_id", { unsigned: true })
    .notNull()
    .references(() => usersTable.id),
  fotoUrl: varchar("foto_url", { length: 255 }).notNull(),
  nama: varchar({ length: 100 }).notNull(),
  posisi: varchar({ length: 100 }).notNull(),
  noHp: varchar("no_hp", { length: 15 }).notNull(),
  ...metaData,
});
