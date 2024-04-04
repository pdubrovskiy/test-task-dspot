import { HttpException, HttpStatus } from '@nestjs/common';

export class LogicException extends HttpException {
  constructor(message: string, statusCode: HttpStatus, errors?: string) {
    super(message, statusCode, { cause: errors });
  }
}
