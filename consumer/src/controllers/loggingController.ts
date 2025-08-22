import LoggingModel, { LoggingDocument } from "src/db/mongo/loggingModel";

export const createLog = async (loggingData: LoggingDocument) => {
  console.log("inserting to mongo:", loggingData);
  await LoggingModel.create(loggingData);
};
