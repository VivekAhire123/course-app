import { IResponse } from '../interfaces';
import {
  BadRequestException,
  ForbiddenException,
  HttpStatus,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

export class ResponseError implements IResponse {
  success: boolean;
  message: string;
  data: any[];

  constructor(data: any, message: string) {
    this.success = false;
    this.message = data.message;
    this.data = data;

    console.warn(
      new Date().toString() +
        ' - [Response]: ' +
        message +
        '-' +
        data.message +
        (data ? ' - ' + JSON.stringify(data) : ''),
    );
  }

  getResponse() {
    const { name }: any = this.data;

    if (name === 'forbidden') {
      throw new ForbiddenException(this.message);
    }
    if (name === 'badRequest') {
      throw new BadRequestException(this.message);
    }

    if (name === 'notFound') {
      throw new NotFoundException(this.message);
    }

    if (name === 'unauthorized') {
      throw new UnauthorizedException(this.message);
    }

    return {
      success: false,
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: this.message || 'Something went wrong. Please try again',
    };
  }
}

export class ResponseSuccess implements IResponse {
  success: boolean;
  message: string;
  data: any[];
  constructor(data: any, message: string) {
    this.success = true;
    this.message = message;
    this.data = data;
  }
  getResponse() {
    return {
      statusCode: 200,
      success: this.success,
      message: this.message,
      data: this.data,
    };
  }
}
