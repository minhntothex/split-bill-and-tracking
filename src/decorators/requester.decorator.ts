import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Requester = createParamDecorator(function (data: unknown, ctx: ExecutionContext)
{
    // TODO: verify and get email from JWT then validating it.
    
    // const request: Request & { jwt: string } = ctx.switchToHttp().getRequest();
    // const result = jwt.decode(request.jwt)

    return 'minhntothex@gmail.com';
});