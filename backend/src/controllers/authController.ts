import { RequestHandler } from "express";
import { MysqlConnection } from "src/db/mysql/mysqlConnection";
import { rolesTable, usersTable } from "src/db/mysql";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { sign } from "jsonwebtoken";
import { env } from "src/env";
import mqConnection from "src/lib/rmq/connection";
import { sendQueueMessage } from "src/lib/rmq/producer";

export const singIn: RequestHandler = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res
      .status(400)
      .json({ status: "N", message: "All fields required" });

  const db = MysqlConnection.getDbInstance();

  const [user] = await db
    .select({
      id: usersTable.id,
      externalId: usersTable.externalId,
      email: usersTable.email,
      password: usersTable.password,
      salt: usersTable.salt,
      roleName: rolesTable.roleName,
      roleSlug: rolesTable.roleSlug,
    })
    .from(usersTable)
    .innerJoin(rolesTable, eq(usersTable.roleId, rolesTable.id))
    .where(eq(usersTable.email, email))
    .limit(1);

  if (!user)
    return res.status(401).json({ status: "N", message: "User not found" });

  const hashedPassword = await bcrypt.hash(password, user.salt);

  const isValid = hashedPassword === user.password;

  if (!isValid)
    return res
      .status(401)
      .json({ status: "N", message: "Email/password is wrong" });

  const jwtToken = sign(
    {
      externalId: user.externalId,
      email: user.email,
      roleName: user.roleName,
      roleSlug: user.roleSlug,
    },
    env().JWT_SECRET,
    { expiresIn: "1h" }
  );

  return res.status(200).json({
    status: "Y",
    data: {
      token: jwtToken,
      user: {
        externalId: user.externalId,
        email: user.email,
        roleName: user.roleName,
        roleSlug: user.roleSlug,
      },
    },
  });
};
