type ResponseCodeType = 'SUCCESS' | 'EMPTY_DATA';
type CommonErrorCodeType = 'BAD_REQUEST' | 'NETWORK_ERROR';
type TokenErrorCodeType =
  | 'NULL_TOKEN'
  | 'EXPIRED_TOKEN'
  | 'INVALID_TOKEN'
  | 'BLACKLIST_TOKEN'
  | 'EXPIRED_REFRESH_TOKEN';
type AuthErrorCodeType = 'INVALID_USER' | 'IS_USED_CASE' | 'INVALID_CREDENTIALS';
type UnknownErrorCodeType = 'UNKNOWN_ERROR';

type ErrorCodeType = CommonErrorCodeType | AuthErrorCodeType | TokenErrorCodeType | UnknownErrorCodeType;

export const RESPONSE_CODES: { [key in ResponseCodeType]: number } = {
  SUCCESS: 1000,
  EMPTY_DATA: 1001
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
  BLACKLIST_TOKEN: 5003,
  EXPIRED_REFRESH_TOKEN: 5004,

  UNKNOWN_ERROR: 9000
};
