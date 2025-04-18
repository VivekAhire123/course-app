import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = this.getStatus(exception);
    const message = this.getMessage(exception);

    response.status(status).json({
      success: false,
      statusCode: status,
      message: typeof message === 'string' ? message : message.message,
      path: request.url,
    });
  }

  private getStatus(exception: unknown): number {
    return exception instanceof HttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;
  }

  private getMessage(exception: unknown): any {
    if (exception instanceof HttpException) {
      const response = exception;
      if (
        exception instanceof BadRequestException &&
        typeof response === 'object'
      ) {
        return this.handleValidationErrors(response);
      }
      return response;
    }
    console.error(exception instanceof Error ? exception.stack : exception);
    return 'Internal server error';
  }

  private handleValidationErrors(response: any): any {
    if (
      typeof response === 'object' &&
      'message' in response &&
      Array.isArray(response.message) &&
      response.message[0]
    ) {
      return response.message[0];
    } else if (response.message) {
      return response.message;
    } else {
      return typeof response === 'string' ? response : JSON.stringify(response);
    }
  }
}
