import dotenv from "dotenv";

dotenv.config();
export const env = () => {
  return {
    MONGO_DATABASE: process.env.MONGO_DATABASE || "",
    MONGO_HOST: process.env.MONGO_HOST || "",
    MONGO_PORT: process.env.MONGO_PORT || "",
    QUEUE_NAME: process.env.QUEUE_NAME || "",
    RMQ_HOST: process.env.RMQ_HOST || "",
    RMQ_PASSWORD: process.env.RMQ_PASSWORD || "",
    RMQ_PORT: process.env.RMQ_PORT || "",
    RMQ_USER: process.env.RMQ_USER || "",
  };
};
