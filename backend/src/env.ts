import path from "node:path";
import dotenv from "dotenv";

dotenv.config();
export const env = () => {
  return {
    MYSQL_HOST: process.env.MYSQL_HOST || "",
    MYSQL_USER: process.env.MYSQL_USER || "",
    MYSQL_PASSWORD: process.env.MYSQL_PASSWORD || "",
    MYSQL_DATABASE: process.env.MYSQL_DATABASE || "",
    PORT: process.env.PORT || "",
    JWT_SECRET: process.env.JWT_SECRET || "",
    API_VERSION: process.env.API_VERSION || "",
    QUEUE_NAME: process.env.QUEUE_NAME || "",
    RMQ_HOST: process.env.RMQ_HOST || "",
    RMQ_PASSWORD: process.env.RMQ_PASSWORD || "",
    RMQ_PORT: process.env.RMQ_PORT || "",
    RMQ_USER: process.env.RMQ_USER || "",
    UPLOAD_DIR: process.env.UPLOAD_DIR || "",
  };
};
