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
      console.log(exception);
      httpStatus = exception.getStatus();
      responseBody = exception.getResponse();
    } else if (exception instanceof Error) {
      console.log(exception);
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
          exception.message = 'Something went wrong!';
          break;
      }

      responseBody = {
        statusCode: httpStatus,
        message: exception.message,
        error: exception.name,
      };
    }

    response.status(httpStatus).json(responseBody);
  }
}
