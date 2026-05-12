import { SuccessResponse } from '../types/response.type';

export class ResponseHelper {
  static success<T>(message: string, data?: T): SuccessResponse<T> {
    return data === undefined
      ? { success: true, message }
      : { success: true, message, data };
  }
}
