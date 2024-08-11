import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseResponse } from '../responses/base.response';

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, BaseResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<BaseResponse<T | null>> {
    return next.handle().pipe(map((data) => this.createResponse(data)));
  }

  private createResponse(data?: T): BaseResponse<T | null> {
    return this.isEmpty(data)
      ? BaseResponse.createEmptyResponse()
      : BaseResponse.createSuccessResponse(data);
  }

  private isEmpty(data: unknown): boolean {
    if (data === null || data === undefined) return true;
    if (Array.isArray(data) && data.length === 0) return true;
    if (typeof data === 'object' && Object.keys(data).length === 0) return true;

    return false;
  }
}
