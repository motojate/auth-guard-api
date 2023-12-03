type ResponseCodeType = 'SUCCESS' | 'EMPTY_DATA';
type ErrorCodeType =
  | 'INVALID_USER'
  | 'BAD_REQUEST'
  | 'IS_USED_CASE'
  | 'INVALID_CREDENTIALS'
  | 'NETWORK_ERROR';

export const RESPONSE_CODES: { [key in ResponseCodeType]: number } = {
  SUCCESS: 1000,
  EMPTY_DATA: 1001,
};

export const ERROR_CODES: { [key in ErrorCodeType]: number } = {
  BAD_REQUEST: 2000,
  NETWORK_ERROR: 2001,

  IS_USED_CASE: 3000,
  INVALID_USER: 3001,
  INVALID_CREDENTIALS: 3002,
};
