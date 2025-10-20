import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Jwt = createParamDecorator(function (data: unknown, ctx: ExecutionContext)
{
    const request: Request & { jwt: string } = ctx.switchToHttp().getRequest();
    return request.jwt;
});