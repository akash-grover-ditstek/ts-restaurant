import { NextFunction, Request, Response } from 'express';
import HttpException from '../exceptions/HttpException';

function errorMiddleware(error: HttpException, request: Request, response: Response, next: NextFunction) {
  const status = error.status || 400;
  const message = error.message || 'Bad Request';
  response
    .status(status)
    .send({
      message,
      status,
    });
}

export default errorMiddleware;
