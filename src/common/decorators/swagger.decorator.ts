import { applyDecorators } from '@nestjs/common';
import { ApiResponse, ApiResponseOptions, getSchemaPath, ApiExtraModels } from '@nestjs/swagger';

interface ApiResponseWrapperOptions {
  withMeta?: boolean;
  options: ApiResponseOptions;
}

export function ApiResponseWrapper(options: ApiResponseWrapperOptions, type: any) {
  const wrapperOptions: ApiResponseOptions = options.withMeta
    ? {
        ...options.options,
        schema: {
          properties: {
            success: { type: 'boolean', example: 'true' },
            data: {
              type: 'array',
              items: {
                $ref: getSchemaPath(type),
              },
            },
            meta: {
              type: 'array',
              default: [],
            },
          },
        },
      }
    : {
        ...options.options,
        schema: {
          properties: {
            success: { type: 'boolean', example: 'true' },
            data: {
              $ref: getSchemaPath(type),
            },
          },
        },
      };

  return applyDecorators(ApiExtraModels(type), ApiResponse(wrapperOptions));
}
