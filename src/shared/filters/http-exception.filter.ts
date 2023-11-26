import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';
import { ERROR_CODES } from '../utils/response.util';

@Catch(BadRequestException)
export class BadRequestExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();
    let message = 'Bad Request';
    if (typeof exceptionResponse !== 'string') {
      message =
        'message' in exceptionResponse
          ? exceptionResponse.message
          : exceptionResponse['error'];
    }

    response.status(status).json({
      code: ERROR_CODES.BAD_REQUEST,
      result: {
        error: message,
      },
    });
  }
}
