export interface BaseResponse<T> {
  status: string;
  data: T;
  message?: string;
}
