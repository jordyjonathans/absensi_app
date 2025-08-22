import { RequestHandler } from "express";
import { MysqlConnection } from "src/db/mysql/mysqlConnection";
import { employeesTable, rolesTable, usersTable } from "src/db/mysql";
import bcrypt, { compare } from "bcrypt";
import { asc, eq, ne } from "drizzle-orm";
import { sign } from "jsonwebtoken";
import { env } from "src/env";
import { v7 as uuidV7 } from "uuid";
import {
  getRandomSalt,
  imageToBase64,
  UPLOAD_FOLDER_PATH,
} from "src/helper/helper";
import multer from "multer";
import path from "path";
import fs from "fs";
import { QueueDataModel } from "src/types/queue";
import { sendQueueMessage } from "src/lib/rmq/producer";

interface UserUpdateData {
  email?: string;
  password?: string;
  salt?: string;
  noHp?: string;
  fotoUrl?: string;
  roleId?: number;
  nama?: string;
  posisi?: string;
}

export const registerUser: RequestHandler = async (req, res) => {
  const { email, password, role_id, nama, posisi, no_hp } = req.body;
  const { roleSlug } = req.user;
  const uploadedFile = req.file;

  if (roleSlug !== "admin")
    return res.status(401).json({ status: "N", message: "User unauthorized" });
  console.log("filename:" + req.file?.filename);
  try {
    if (!email || !password || !uploadedFile || !nama || !posisi || !no_hp)
      return res
        .status(400)
        .json({ status: "N", message: "All fields required" });

    const db = MysqlConnection.getDbInstance();

    const existingUser = await db
      .select({ email: usersTable.email })
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .limit(1);

    if (existingUser.length > 0)
      return res
        .status(401)
        .json({ status: "N", message: "User already registered" });

    const salt = await getRandomSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await db.transaction(async (trx) => {
      const externalId = uuidV7();
      const resultTrx1 = await trx
        .insert(usersTable)
        .values({
          email,
          password: hashedPassword,
          externalId,
          roleId: role_id,
          salt: salt,
        })
        .$returningId();
      console.log("resultTrx1" + resultTrx1);

      await trx.insert(employeesTable).values({
        userId: resultTrx1[0].id,
        fotoUrl: uploadedFile.filename,
        nama,
        posisi,
        noHp: no_hp,
      });
    });

    return res.status(201).json({ status: "Y", message: "Sign up success" });
  } catch (e) {
    return res
      .status(400)
      .json({ status: "N", message: `Register new user failed: ${e}` });
  }
};

export const updateUser: RequestHandler = async (req, res) => {
  const body = Object.assign({}, req.body);
  const external_id = req.params.external_id;
  const user_external_id = req.user.externalId;
  const { email, password, role_id, nama, posisi, no_hp } = body;
  console.log("email", email);
  console.log("password", role_id);
  console.log("nama", nama);
  console.log("posisi", posisi);
  console.log("email", email);

  const session_role_slug = req.user.roleSlug;
  const uploadedFile = req.file as Express.Multer.File | undefined;
  console.log("req.params:" + external_id);
  const db = MysqlConnection.getDbInstance();

  const existingUser = await db
    .select()
    .from(usersTable)
    .innerJoin(employeesTable, eq(usersTable.id, employeesTable.userId))
    .where(eq(usersTable.externalId, external_id))
    .limit(1);

  if (existingUser.length === 0) {
    return res.status(404).json({ status: "N", message: "User not found" });
  }

  const userUpdateData: UserUpdateData = {};
  if (password) {
    const salt = await getRandomSalt(10);
    userUpdateData.password = await bcrypt.hash(password, salt);
    userUpdateData.salt = salt;
  }
  if (no_hp) userUpdateData.noHp = no_hp;

  if (uploadedFile) {
    // Hapus file lama jika ada dan file baru diunggah
    if (existingUser.length > 0 && existingUser[0].employees.fotoUrl) {
      try {
        console.log("cwd:" + process.cwd());
        console.log(
          "existingUser[0].employees.fotoUrl:" +
            existingUser[0].employees.fotoUrl
        );
        const oldFilePath = path.join(
          UPLOAD_FOLDER_PATH,
          existingUser[0].employees.fotoUrl
        );
        console.log("hapusing:" + oldFilePath);
        fs.unlinkSync(oldFilePath);
        console.log(`Foto lama berhasil dihapus: ${oldFilePath}`);
      } catch (err) {
        console.error(`Gagal menghapus foto lama ${err}`);
      }
    }
    userUpdateData.fotoUrl = uploadedFile.filename;
  }

  if (session_role_slug === "admin") {
    if (email && email !== existingUser[0].users.email) {
      const [existingEmail] = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.email, email))
        .limit(1);

      if (existingEmail)
        return res
          .status(400)
          .json({ status: "N", message: `Duplicate E-mail` });

      userUpdateData.email = email;
    }
    if (role_id) userUpdateData.roleId = role_id;
    if (role_id) userUpdateData.roleId = role_id;
    if (nama) userUpdateData.nama = nama;
    if (posisi) userUpdateData.posisi = posisi;
  }
  console.log("AAAAAAAAuserUpdateData", userUpdateData);
  try {
    // 3. Jalankan pembaruan dalam satu transaksi
    await db.transaction(async (trx) => {
      if (Object.keys(userUpdateData).length > 0) {
        if (
          userUpdateData.email ||
          userUpdateData.password ||
          userUpdateData.salt ||
          userUpdateData.roleId
        )
          await trx
            .update(usersTable)
            .set({
              email: userUpdateData.email,
              password: userUpdateData.password,
              salt: userUpdateData.salt,
              roleId: userUpdateData.roleId,
            })
            .where(eq(usersTable.externalId, external_id));
        if (
          userUpdateData.fotoUrl ||
          userUpdateData.nama ||
          userUpdateData.posisi ||
          userUpdateData.noHp
        )
          await trx
            .update(employeesTable)
            .set({
              fotoUrl: userUpdateData.fotoUrl,
              nama: userUpdateData.nama,
              posisi: userUpdateData.posisi,
              noHp: userUpdateData.noHp,
            })
            .where(eq(employeesTable.userId, existingUser[0].users.id));
      }
    });

    const queueData: QueueDataModel = {
      event: "logging",
      data: {
        createdBy: user_external_id,
        userId: existingUser[0].users.id,
        message: "update profile",
        originalData: existingUser[0],
        updatedData: userUpdateData,
      },
    };

    sendQueueMessage(queueData);

    return res.status(204).json({ status: "Y", message: "Update success" });
  } catch (e) {
    console.log("error updating data:", e);
    return res
      .status(400)
      .json({ status: "N", message: `update data failed: ${e}` });
  }
};

export const getUsers: RequestHandler = async (req, res) => {
  const { roleSlug } = req.user;

  if (roleSlug !== "admin")
    return res.status(401).json({ status: "N", message: "User unauthorized" });

  const db = MysqlConnection.getDbInstance();

  const users = await db
    .select({
      externalId: usersTable.externalId,
      nama: employeesTable.nama,
      roleName: rolesTable.roleName,
    })
    .from(usersTable)
    .innerJoin(rolesTable, eq(usersTable.roleId, rolesTable.id))
    .innerJoin(employeesTable, eq(usersTable.id, employeesTable.userId))
    .where(ne(rolesTable.roleSlug, "admin"))
    .orderBy(asc(employeesTable.nama));

  if (users.length === 0)
    return res.status(200).json({ status: "N", message: "Data is empty" });

  return res.status(200).json({
    status: "Y",
    message: "success",
    data: users,
  });
};

export const getUser: RequestHandler = async (req, res) => {
  const { external_id } = req.params;
  console.log("getuser:", external_id);

  const db = MysqlConnection.getDbInstance();

  const user = await db
    .select({
      userId: usersTable.id,
      email: usersTable.email,
      roleId: usersTable.roleId,
      nama: employeesTable.nama,
      noHp: employeesTable.noHp,
      posisi: employeesTable.posisi,
      fotoUrl: employeesTable.fotoUrl,
    })
    .from(usersTable)
    .innerJoin(employeesTable, eq(usersTable.id, employeesTable.userId))
    .where(eq(usersTable.externalId, external_id))
    .limit(1);

  if (user.length === 0)
    return res.status(401).json({ status: "N", message: "User not found" });

  const selectedUser = user[0];
  if (selectedUser.fotoUrl) {
    const filePath = path.join(__dirname, "../uploads", user[0].fotoUrl);
    console.log("PATH!!", filePath);
    if (filePath) selectedUser.fotoUrl = imageToBase64(filePath);
  }

  return res.status(200).json({
    status: "Y",
    message: "success",
    data: selectedUser,
  });
};

export const getRoles: RequestHandler = async (req, res) => {
  console.log("getroles triggered!!");
  const db = MysqlConnection.getDbInstance();

  const roles = await db
    .select({
      id: rolesTable.id,
      roleName: rolesTable.roleName,
    })
    .from(rolesTable);

  if (roles.length === 0)
    return res.status(400).json({ status: "N", message: "Roles not found" });

  return res.status(200).json({
    status: "Y",
    message: "success",
    data: roles,
  });
};

export const uploadProfile: RequestHandler = async (req, res) => {};
