import "dotenv/config";
import amqp, { Channel, ChannelModel } from "amqplib";
import { env } from "../../env";

type HandlerCB = (msg: string) => any;

const RABBITMQ_URL = `amqp://${env().RMQ_USER}:${env().RMQ_PASSWORD}@${
  env().RMQ_HOST
}:${env().RMQ_PORT}`;
const QUEUE_NAME = env().QUEUE_NAME;

class RabbitMQConnection {
  connection!: ChannelModel;
  channel!: Channel;
  private connected: boolean = false;

  async connect() {
    if (this.connected && this.channel) return;
    try {
      console.log("⌛️ Connecting to Rabbit-MQ Server");

      this.connection = await amqp.connect(RABBITMQ_URL);

      this.connection.on("close", () => {
        this.connected = false;
        console.error("RabbitMQ connection closed");
      });
      this.connection.on("error", (err) => {
        this.connected = false;
        console.error("RabbitMQ connection error", err);
      });

      console.log("✅ Rabbit MQ Connection is ready");

      this.channel = await this.connection.createChannel();
      await this.channel.assertQueue(QUEUE_NAME, { durable: true });
      await this.channel.prefetch(1);

      console.log("🛸 Created RabbitMQ Channel successfully");
      this.connected = true;
    } catch (error) {
      console.error(error);
      console.error("Not connected to MQ Server");
      throw error;
    }
  }

  async consume(handleIncomingNotification: HandlerCB) {
    if (!this.connected) {
      await this.connect();
    }

    return this.channel.consume(
      QUEUE_NAME,
      (msg) => {
        if (!msg) {
          return console.error("Invalid incoming message");
        }
        handleIncomingNotification(msg.content.toString());
        this.channel.ack(msg);
      },
      { noAck: false }
    );
  }
}

const mqConnection = new RabbitMQConnection();

export default mqConnection;
