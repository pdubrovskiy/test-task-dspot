import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { Response } from 'express';
import { LogicException } from '../exceptions/logic.exception';
import { WINSTON_MODULE_PROVIDER, WinstonLogger } from 'nest-winston';
import { formatValidationErrors } from '../utils/validation-errors-formatter';
import { JsonResponse } from '../types/json-response.type';
import { ExceptionMessages } from '../exceptions/exception-messages';
import { QueryFailedError } from 'typeorm';
import { ErrorMessages } from '../response_messages/error-messages';
import { Methods } from '../constants/methods';
import { PostgresErrorCodes } from 'src/database/constants/postgres-error-codes';
import { DatabaseErrorMessageParser } from 'src/database/utils/database-error-message-parser';

interface ErrorResponse {
  message?: string[];
}

@Catch()
export class ValidationExceptionFilter implements ExceptionFilter {
  constructor(@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: WinstonLogger) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();

    const jsonResponse: JsonResponse = {
      success: false,
      message: exception.message,
    };

    this.logger.error(exception);

    if (exception instanceof QueryFailedError) {
      // вынести обработку ошибок бд
      if (exception.driverError.code === PostgresErrorCodes.UniqueViolation) {
        const fieldName = DatabaseErrorMessageParser.parseMessage(exception);
        jsonResponse.message = `${fieldName}: ${ErrorMessages.DUPLICATE_VALUE}`;
        return response.status(HttpStatus.UNPROCESSABLE_ENTITY).json(jsonResponse);
      }

      if (
        exception.driverError.code === PostgresErrorCodes.ForeignKeyViolation &&
        response.req.method === Methods.DELETE
      ) {
        jsonResponse.message = ErrorMessages.HAS_RELATIONS;
        return response.status(HttpStatus.UNPROCESSABLE_ENTITY).json(jsonResponse);
      }

      if (
        (exception.driverError.code === PostgresErrorCodes.ForeignKeyViolation &&
          response.req.method === Methods.POST) ||
        response.req.method === Methods.PUT
      ) {
        const fieldName = DatabaseErrorMessageParser.parseMessage(exception);
        jsonResponse.message = `${fieldName}: ${ErrorMessages.FK_NOT_EXIST}`;
        return response.status(HttpStatus.UNPROCESSABLE_ENTITY).json(jsonResponse);
      }

      jsonResponse.message = ErrorMessages.UNPROCESSABLE_CONTENT;

      return response.status(HttpStatus.UNPROCESSABLE_ENTITY).json(jsonResponse);
    }

    if (!(exception instanceof HttpException)) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(jsonResponse);
    }

    const status = exception.getStatus();

    if (exception instanceof LogicException) {
      if (exception.cause) {
        jsonResponse.errors = (exception.cause as string).split(';');
      }

      return response.status(status).json(jsonResponse);
    }

    if (exception instanceof BadRequestException) {
      const errorResponse: ErrorResponse = exception.getResponse() as ErrorResponse;

      const messages: string[] = errorResponse?.message || [];
      delete jsonResponse.message;

      jsonResponse.errors = { ...formatValidationErrors(messages, this.logger) };

      return response.status(status).json(jsonResponse);
    }

    jsonResponse.message = ExceptionMessages.ERROR_RESPONSE;

    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(jsonResponse);
  }
}
