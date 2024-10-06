import { ArgumentsHost, BadRequestException, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';


@Catch()
export class BadRequestExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const responseBody: any = exception.getResponse();
    const errorsResponse: any = {
      errorsMessages: [],
    };
    // console.log(responseBody);
    if (Array.isArray(responseBody.message)) { // Bad Request
      responseBody.message.forEach((msg) => {
          errorsResponse.errorsMessages.push(msg);
        },
      );
      response.status(status).send(errorsResponse);
    } else {
      // errorsResponse.errorsMessages.push({ message: responseBody.message, field: "id" });
      // errorsResponse.errorsMessages.push(responseBody);
      response.status(status).send(responseBody);
    }
    // response.status(status).send(errorsResponse);
  }
}
