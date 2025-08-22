import "dotenv/config";
import amqp, { Channel, ChannelModel, Connection } from "amqplib";
import { env } from "../../env";

type HandlerCB = (msg: string) => any;

const RABBITMQ_URL = `amqp://${env().RMQ_USER}:${env().RMQ_PASSWORD}@${
  env().RMQ_HOST
}:${env().RMQ_PORT}`;

class RabbitMQConnection {
  private static instance: RabbitMQConnection;
  private connection!: ChannelModel;
  private channel!: Channel;

  private constructor() {}

  public static async getInstance(): Promise<RabbitMQConnection> {
    if (!RabbitMQConnection.instance) {
      RabbitMQConnection.instance = new RabbitMQConnection();
      await RabbitMQConnection.instance.init();
    }
    return RabbitMQConnection.instance;
  }

  private async init() {
    this.connection = await amqp.connect(RABBITMQ_URL);
    this.channel = await this.connection.createChannel();
    console.log("✅ Connected to RabbitMQ");
  }

  public getChannel(): Channel {
    if (!this.channel) throw new Error("RabbitMQ channel not initialized.");
    return this.channel;
  }

  public async close() {
    await this.channel.close();
    await this.connection.close();
    console.log("❌ RabbitMQ connection closed");
  }
}

export default RabbitMQConnection;
