import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { Methods } from '../constants/methods';
import { Request } from 'express';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const request: Request = context.switchToHttp().getRequest();
    const requestMethod = request.method;

    return next.handle().pipe(
      map((data) => {
        switch (requestMethod) {
          case Methods.GET: {
            if (data?.content) {
              const host = request.get('host');
              const path = `${request.protocol}://${host}${request.url}`;
              const { content, meta } = data;

              return {
                success: true,
                data: content,
                meta: {
                  ...meta,
                  path,
                },
              };
            }

            return {
              success: true,
              data,
            };
          }
          case Methods.DELETE: {
            return {
              success: true,
              ...data,
            };
          }
          default: {
            return {
              success: true,
              data,
            };
          }
        }
      }),
    );
  }
}
