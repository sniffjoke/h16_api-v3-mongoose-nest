import { ArgumentsHost, Catch, ExceptionFilter, NotFoundException } from "@nestjs/common";
import { Response } from "express";


@Catch()
export class NotFoundExceptionFilter implements ExceptionFilter {
  catch(exception: NotFoundException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const responseBody: any = exception.getResponse();
    // console.log(responseBody);
    const errorsResponse: any = {
      errorsMessages: []
    };
    if (Array.isArray(responseBody.message)) { // Bad Request
      responseBody.message.forEach((msg) => {
          errorsResponse.errorsMessages.push(msg);
        }
      );
    } else {
      errorsResponse.errorsMessages.push({ message: responseBody.message, field: "id" });
    }
    response.status(status).send(errorsResponse);

  }
}
