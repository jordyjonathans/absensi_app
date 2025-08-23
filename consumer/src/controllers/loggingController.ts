import LoggingModel, { LoggingDocument } from "src/db/mongo/loggingModel";

export const createLog = async (loggingData: LoggingDocument) => {
  await LoggingModel.create(loggingData);
};
