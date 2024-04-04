import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { generateErrorMessage } from '../response_messages/error-message.generator';
import { ResponseBody } from '../response_messages/responses';

export function ApiMessageResponse(response: ResponseBody) {
  const options = {
    status: response.status,
    description: response.description,
    schema: {
      example: generateErrorMessage(response.message),
    },
  };

  return applyDecorators(ApiResponse(options));
}
