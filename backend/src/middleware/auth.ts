import { RequestHandler } from "express";
import { verify } from "jsonwebtoken";
import { MysqlConnection } from "src/db/mysql/mysqlConnection";
import { rolesTable, usersTable } from "src/db/mysql";
import { eq } from "drizzle-orm";
import { env } from "src/env";

interface User {
  externalId: string;
  email: string;
  roleName: string;
  roleSlug: string;
}

declare global {
  namespace Express {
    interface Request {
      user: User;
    }
  }
}

export const isAuth: RequestHandler = async (req, res, next) => {
  const bearer = req.headers.authorization;

  if (!bearer)
    return res
      .status(401)
      .json({ status: "N", message: "Access Denied, token missing" });

  const token = bearer.split("Bearer ")[1];

  let payload;
  try {
    payload = verify(token, env().JWT_SECRET) as {
      externalId: string;
    };
  } catch (e) {
    return res
      .status(401)
      .json({ status: "N", message: "Access Denied, token invalid" });
  }

  const db = MysqlConnection.getDbInstance();

  const [user] = await db
    .select({
      externalId: usersTable.externalId,
      email: usersTable.email,
      roleName: rolesTable.roleName,
      roleSlug: rolesTable.roleSlug,
    })
    .from(usersTable)
    .innerJoin(rolesTable, eq(usersTable.roleId, rolesTable.id))
    .where(eq(usersTable.externalId, payload.externalId))
    .limit(1);

  if (!user)
    return res
      .status(401)
      .json({ status: "N", message: "Access Denied, user not found" });

  req.user = {
    externalId: user.externalId,
    email: user.email,
    roleName: user.roleName,
    roleSlug: user.roleSlug,
  };

  next();
};
