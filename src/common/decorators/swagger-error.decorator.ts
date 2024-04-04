import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { ExceptionBody } from '../exceptions/exceptions';
import { generateErrorMessage } from '../response_messages/error-message.generator';

export function ApiErrorWrapper(exception: ExceptionBody) {
  const options = {
    status: exception.status,
    description: exception.description,
    schema: {
      example: generateErrorMessage(exception.message),
    },
  };

  return applyDecorators(ApiResponse(options));
}
