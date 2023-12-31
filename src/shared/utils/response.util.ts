type ResponseCodeType = 'SUCCESS' | 'EMPTY_DATA';
type CommonErrorCodeType = 'BAD_REQUEST' | 'NETWORK_ERROR';
type TokenErrorCodeType = 'NULL_TOKEN' | 'EXPIRED_TOKEN' | 'INVALID_TOKEN';
type AuthErrorCodeType =
  | 'INVALID_USER'
  | 'IS_USED_CASE'
  | 'INVALID_CREDENTIALS';
type ErrorCodeType =
  | CommonErrorCodeType
  | AuthErrorCodeType
  | TokenErrorCodeType;

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

  NULL_TOKEN: 5000,
  INVALID_TOKEN: 5001,
  EXPIRED_TOKEN: 5002,
};
