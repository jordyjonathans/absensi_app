import { char, int, mysqlTable, varchar } from "drizzle-orm/mysql-core";
import { metaData } from "./metadata";

export const usersTable = mysqlTable("users", {
  id: int({ unsigned: true }).autoincrement().primaryKey(),
  externalId: char("external_id", { length: 36 }).notNull().unique(),
  email: varchar({ length: 100 }).notNull().unique(),
  password: varchar({ length: 100 }).notNull(),
  salt: char({ length: 32 }).notNull(),
  roleId: int("role_id", { unsigned: true })
    .notNull()
    .references(() => rolesTable.id),
  ...metaData,
});

export const rolesTable = mysqlTable("roles", {
  id: int({ unsigned: true }).autoincrement().primaryKey(),
  roleName: varchar("role_name", { length: 100 }).notNull(),
  roleSlug: varchar("role_slug", { length: 100 }).notNull().unique(),
  ...metaData,
});

export const fcmTokensTable = mysqlTable("fcmTokens", {
  id: int({ unsigned: true }).autoincrement().primaryKey(),
  userId: int("user_id", { unsigned: true })
    .notNull()
    .references(() => usersTable.id),
  fcmToken: varchar("fcm_token", { length: 255 }).notNull(),
  ...metaData,
});
