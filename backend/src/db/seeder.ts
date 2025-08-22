import "dotenv/config";
import mysql from "mysql2";
import { drizzle } from "drizzle-orm/mysql2";
import { seed, reset } from "drizzle-seed";
import {
  attendancesTable,
  employeesTable,
  rolesTable,
  usersTable,
} from "./mysql";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { env } from "src/env";
import { getRandomSalt } from "src/helper/helper";
import { v7 as uuidV7 } from "uuid";

async function main() {
  const connection = mysql.createConnection({
    host: env().MYSQL_HOST,
    user: env().MYSQL_USER,
    password: env().MYSQL_PASSWORD,
    database: env().MYSQL_DATABASE,
  });
  const db = drizzle({ client: connection });

  await reset(db, {
    rolesTable,
    usersTable,
    employeesTable,
    attendancesTable,
  });

  // insert default ROLES
  const roles: (typeof rolesTable.$inferInsert)[] = [
    {
      id: 1,
      roleName: "Admin",
      roleSlug: "admin",
    },
    {
      id: 2,
      roleName: "Staff",
      roleSlug: "staff",
    },
  ];

  await db.insert(rolesTable).values(roles);

  const externalIdAdmin = uuidV7();
  const externalIdJordy = uuidV7();
  const saltAdmin = await getRandomSalt(10);
  const saltJordy = await getRandomSalt(10);
  const hashedPasswordAdmin = await bcrypt.hash("admin", saltAdmin);
  const hashedPasswordJordy = await bcrypt.hash("jordy", saltJordy);

  // insert default USERS
  const user: (typeof usersTable.$inferInsert)[] = [
    {
      id: 1,
      email: "admin@admin.com",
      externalId: externalIdAdmin,
      password: hashedPasswordAdmin,
      roleId: 1,
      salt: saltAdmin,
    },
    {
      id: 2,
      email: "jordyjonathan6@gmail.com",
      externalId: externalIdJordy,
      password: hashedPasswordJordy,
      roleId: 2,
      salt: saltJordy,
    },
  ];

  const employee: (typeof employeesTable.$inferInsert)[] = [
    {
      id: 1,
      fotoUrl: "",
      nama: "Admin HR",
      noHp: "08123457896",
      posisi: "Head HR",
      userId: 1,
    },
    {
      id: 2,
      fotoUrl: "",
      nama: "Jordy Jonathan Sjarif",
      noHp: "08170005859",
      posisi: "Fullstack Engineer",
      userId: 2,
    },
  ];

  await db.insert(usersTable).values(user);
  await db.insert(employeesTable).values(employee);

  // insert default ATTENDANCES
  const attendace: (typeof attendancesTable.$inferInsert)[] = [
    {
      id: 1,
      userId: 2,
      clockingType: 0,
      createdAt: new Date("2025-08-18T06:00:00Z"),
    },
    {
      id: 2,
      userId: 2,
      clockingType: 0,
      createdAt: new Date("2025-08-18T07:00:00Z"),
    },
    {
      id: 3,
      userId: 2,
      clockingType: 0,
      createdAt: new Date("2025-08-18T08:00:00Z"),
    },
    {
      id: 4,
      userId: 2,
      clockingType: 1,
      createdAt: new Date("2025-08-18T17:00:00Z"),
    },
    {
      id: 5,
      userId: 2,
      clockingType: 1,
      createdAt: new Date("2025-08-18T19:00:00Z"),
    },
  ];

  await db.insert(attendancesTable).values(attendace);
}

main()
  .then(() => {
    console.log("Seeding success:");
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  });
