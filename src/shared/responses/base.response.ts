import { RESPONSE_CODES } from '../utils/response.util';

export class BaseResponse<T> {
  constructor(private readonly code: number, private readonly data?: T) {}

  static createSuccessResponse<T>(data: T, code = RESPONSE_CODES.SUCCESS): BaseResponse<T> {
    return new BaseResponse<T>(code, data);
  }

  static createEmptyResponse(code = RESPONSE_CODES.EMPTY_DATA): BaseResponse<null> {
    return new BaseResponse<null>(code, null);
  }

  getCode(): number {
    return this.code;
  }

  getData(): T | undefined {
    return this.data;
  }
}
