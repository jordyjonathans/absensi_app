export interface QueueDataModel {
  event: string;
  data: {
    createdBy: string;
    userId: number;
    message: string;
    originalData?: object;
    updatedData?: object;
  };
}
