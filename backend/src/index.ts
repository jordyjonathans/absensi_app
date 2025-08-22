import "dotenv/config";
import express from "express";
import morgan from "morgan";
import cors from "cors";

import { MysqlConnection } from "./db/mysql/mysqlConnection";
import { env } from "./env";
import userRouter from "./routes/user";
import attendanceRouter from "./routes/attedance";
import authRouter from "./routes/auth";
import fs from "fs";
import path from "path";

async function main() {
  try {
    const UPLOAD_DIR = path.join(__dirname, env().UPLOAD_DIR);
    if (!fs.existsSync(UPLOAD_DIR)) {
      fs.mkdirSync(UPLOAD_DIR);
    }

    await MysqlConnection.connect();

    const app = express();

    // Middleware
    app.use(morgan("dev"));
    app.use(cors());
    app.use(express.json());

    // Routers
    app.use(`/${env().API_VERSION}/api/auth`, authRouter);
    app.use(`/${env().API_VERSION}/api/user`, userRouter);
    app.use(`/${env().API_VERSION}/api/attendance`, attendanceRouter);

    app.listen(env().PORT, () => {
      console.log(`Server is running on Port : ${env().PORT}`);
    });
  } catch (ex) {
    console.log(`Failed to connect : ${ex}`);
  }
}

main();
