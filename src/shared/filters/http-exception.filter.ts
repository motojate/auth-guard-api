import { ExceptionFilter, Catch, ArgumentsHost, HttpException, Logger } from '@nestjs/common';
import { Response } from 'express';
import { ERROR_CODES } from 'src/shared/utils/response.util';
import { BaseExceptionErrorStateInferface } from 'src/shared/interfaces/common.interface';

@Catch(HttpException)
export class GlobalHttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalHttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const httpContext = host.switchToHttp();
    const response = httpContext.getResponse<Response>();
    const request = httpContext.getRequest<Request>();
    const { method, url } = request;
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();
    const { code, message } = this.getExceptionMessage(exceptionResponse);

    this.logger.error(`${method} ${url} ${status} - ERROR CODE: ${code} ${message}`);

    response.status(status).json({
      code: code,
      result: {
        error: {
          message: code === 2001 ? 'NETWORK_ERROR' : message
        }
      }
    });
  }

  private getExceptionMessage(
    exceptionResponse:
      | string
      | BaseExceptionErrorStateInferface
      | { statusCode?: number; message?: string; error?: string }
  ): { code: number; message: string } {
    if (typeof exceptionResponse === 'string') return { code: ERROR_CODES.BAD_REQUEST, message: exceptionResponse };
    if ('code' in exceptionResponse && 'result' in exceptionResponse)
      return {
        code: exceptionResponse.code,
        message: exceptionResponse.result.error.message
      };
    if ('statusCode' in exceptionResponse && exceptionResponse.statusCode === 400)
      return {
        code: ERROR_CODES.BAD_REQUEST,
        message: exceptionResponse.message || exceptionResponse.error || 'BAD_REQUEST'
      };
    const message = exceptionResponse.message || exceptionResponse.error || 'UNKNOWN_ERROR';
    return { code: ERROR_CODES.UNKNOWN_ERROR, message: message };
  }
}
