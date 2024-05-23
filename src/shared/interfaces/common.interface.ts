import { Request, Response } from 'express';

export type ExpressRequest = Request;
export type ExpressResponse = Response;

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
export interface ValidateUserInfo {
  userSeq: string;
}
