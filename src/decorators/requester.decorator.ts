import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import jwt from 'jsonwebtoken';

export const Requester = createParamDecorator(function (data: unknown, ctx: ExecutionContext)
{
    const req: Request & { jwt: string } = ctx.switchToHttp().getRequest();
    const authHeader = req.headers.authorization;
    const token = authHeader!.split(' ')[1]; // "Bearer <token>"
    const { email } = jwt.decode(token) as { email: string };

    return email;
});