import { HttpStatus } from '@nestjs/common';
import { BaseException } from './base.exception';

export class PrismaException extends BaseException {
  constructor() {
    super(3000, 'PRISMA_EXCEPTION', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
