import { HttpException, HttpStatus } from '@nestjs/common';

export class BaseException extends HttpException {
  constructor(
    private readonly _code: number,
    message: string,
    status: HttpStatus,
  ) {
    super({ code: _code, message }, status);
  }

  get code(): number {
    return this._code;
  }
}
