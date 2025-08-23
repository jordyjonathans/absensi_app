import { connectMongoDB } from "./db/mongo/mongoDBConnection";
import mqConnection from "./lib/rmq/connection";
import { handleRecievedMessage } from "./lib/rmq/consumer";

async function main() {
  try {
    await connectMongoDB();

    await mqConnection.connect();
    await mqConnection.consume(handleRecievedMessage);
  } catch (ex) {
    console.error(`Failed to connect mongo : ${ex}`);
  }
}

main();
