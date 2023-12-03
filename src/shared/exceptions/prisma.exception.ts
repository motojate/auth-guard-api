import { HttpStatus } from '@nestjs/common';
import { BaseException } from './base.exception';
import { ERROR_CODES } from '../utils/response.util';

export class PrismaException extends BaseException {
  constructor() {
    super(
      ERROR_CODES.NETWORK_ERROR,
      'NETWORK_ERROR',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
