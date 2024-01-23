export interface HeaderToken {
  accessToken: string;
  refreshToken: string;
}
export interface BaseExceptionErrorStateInferface {
  code: number;
  result: {
    error: {
      message: string;
    };
  };
}
