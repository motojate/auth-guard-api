import { HttpStatus } from '@nestjs/common';
import { BaseException } from './base.exception';
import { ERROR_CODES } from '../utils/response.util';

export class InvalidUserException extends BaseException {
  constructor() {
    super(ERROR_CODES.INVALID_USER, 'INVALID_USER', HttpStatus.UNAUTHORIZED);
  }
}

export class InUsedUserException extends BaseException {
  constructor() {
    super(ERROR_CODES.IS_USED_CASE, 'IS_USED_CASE', HttpStatus.BAD_REQUEST);
  }
}

export class AuthMismatchException extends BaseException {
  constructor() {
    super(ERROR_CODES.INVALID_CREDENTIALS, 'INVALID_CREDENTIALS', HttpStatus.UNPROCESSABLE_ENTITY);
  }
}
