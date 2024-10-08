import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import * as requestIp from 'request-ip';
import { Request } from 'express';


export const IpAddress = createParamDecorator(
  (data: any, ctx: ExecutionContext) => {
    const ip = requestIp.getClientIp(ctx.switchToHttp().getRequest() as Request)

    return ip?.slice(0, 7) === '::ffff:' ? ip.slice(7) : ip;
  }
)
