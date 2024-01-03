import { RESPONSE_CODES } from '../utils/response.util';

export class BaseResponse<T> {
  constructor(public result: T | T[], public code: number) {}

  static success<T>(
    data: T | T[],
    code = RESPONSE_CODES.SUCCESS,
  ): BaseResponse<T> {
    return new BaseResponse<T>(data, code);
  }

  static emptyData(
    data: [] | null,
    code = RESPONSE_CODES.EMPTY_DATA,
  ): BaseResponse<[] | null> {
    return new BaseResponse<[] | null>(data, code);
  }
}
