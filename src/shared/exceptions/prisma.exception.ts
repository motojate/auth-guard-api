import { HttpStatus } from '@nestjs/common';
import { BaseException } from './base.exception';
import { ERROR_CODES } from '../utils/response.util';

export class PrismaException extends BaseException {
  constructor(err: any) {
    super(ERROR_CODES.NETWORK_ERROR, err, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
