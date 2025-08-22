import { env } from "src/env";
import RabbitMQConnection from "./connection";
import * as amqp from "amqplib";
import { QueueDataModel } from "src/types/queue";

const RABBITMQ_URL = `amqp://${env().RMQ_USER}:${env().RMQ_PASSWORD}@${
  env().RMQ_HOST
}:${env().RMQ_PORT}`;

export async function sendQueueMessage(message: QueueDataModel) {
  // 1. Connect
  const connection = await amqp.connect(RABBITMQ_URL);
  const channel = await connection.createChannel();

  // 2. Ensure queue exists
  await channel.assertQueue(env().QUEUE_NAME, { durable: true });

  // 3. Convert message
  const payload = Buffer.from(JSON.stringify(message));

  // 4. Send
  channel.sendToQueue(env().QUEUE_NAME, payload, {
    persistent: true,
  });

  // 5. Clean up
  await channel.close();
  await connection.close();
}
