import { Injectable } from '@nestjs/common';

@Injectable()
export class CommonService {
  constructor() {}

  sendSuccessResponse(statusCode: number, message: string, data: any = null) {
    return {
      status: statusCode,
      message,
      data,
    };
  }

  sendErrorResponse(statusCode: number, message: string) {
    return {
      status: statusCode,
      message,
    };
  }
}
