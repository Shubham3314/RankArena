import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    let httpStatus;
    let responseBody;

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof HttpException) {
      httpStatus = exception.getStatus();
      responseBody = exception.getResponse();
    } else if (exception instanceof Error) {
      console.log(exception)
      switch (exception.name) {
        case 'NotFoundError':
          httpStatus = HttpStatus.NOT_FOUND;
          break;

        case 'ConflictError':
          httpStatus = HttpStatus.CONFLICT;
          break;

        case 'BadRequestError':
          httpStatus = HttpStatus.BAD_REQUEST;
          break;

        case 'InvalidValueError':
          httpStatus = HttpStatus.BAD_REQUEST;
          break;

        case 'ForbiddenError':
          httpStatus = HttpStatus.FORBIDDEN;
          break;

        case 'UnauthorizedError':
          httpStatus = HttpStatus.UNAUTHORIZED;
          break;

        default:
          httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
          break;
      }

      responseBody = {
        statusCode: httpStatus,
        message: exception.message ?? 'Internal server error',
        error: exception.name ?? 'Error',
      };
    } else {
      httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
      responseBody = {
        statusCode: 500,
        message: 'Internal server error',
        error: 'Unknown',
      };
    }

    response.status(httpStatus ?? 500).json(responseBody);
  }
}
