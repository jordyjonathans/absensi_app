import { Document, model, Model, Schema } from "mongoose";
type Primitive = string | number | boolean;

interface LooseObject {
  [key: string]: Primitive | LooseObject | LooseObject[];
}

export interface LoggingDocument extends Document {
  createdBy: string;
  message: string;
  userId: number;
  originalData?: LooseObject;
  updatedData?: LooseObject;
}

const loggingSchema = new Schema<LoggingDocument>(
  {
    createdBy: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    userId: {
      type: Number,
      required: true,
    },
    originalData: {
      type: Schema.Types.Mixed,
    },
    updatedData: {
      type: Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
);

const LoggingModel: Model<LoggingDocument> = model("logging", loggingSchema);

export default LoggingModel;
