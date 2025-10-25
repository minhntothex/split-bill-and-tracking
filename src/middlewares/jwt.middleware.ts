import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET ?? 'sb&t-app-secret';

@Injectable()
export class JwtMiddleware implements NestMiddleware 
{
    use(req: Request, res: Response, next: NextFunction)
    {
        const authHeader = req.headers.authorization;
        if (!authHeader) { throw new UnauthorizedException(); }

        const token = authHeader.split(' ')[1]; // "Bearer <token>"
        if (!token) { throw new UnauthorizedException(); }
        
        try
        {
            jwt.verify(token, SECRET);
        }
        catch (error: unknown)
        {
            console.error(error);
            throw new UnauthorizedException();
        }

        next();
    }
}