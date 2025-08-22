import { createLog } from "src/controllers/loggingController";
import { LoggingDocument } from "src/db/mongo/loggingModel";
import { QueueDataModel } from "src/types/queue";

export const handleRecievedMessage = (message: string) => {
  try {
    const parsedMessage: QueueDataModel = JSON.parse(message);
    console.log("terima" + parsedMessage);
    switch (parsedMessage.event) {
      case "logging":
        createLog(parsedMessage.data as LoggingDocument);
        break;
      default:
        break;
    }
  } catch (error) {
    console.error(`Error While Parsing the message`);
  }
};
