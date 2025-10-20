import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { NextFunction } from 'express';
import jwt from 'jsonwebtoken';

@Injectable()
export class JwtMiddleware implements NestMiddleware 
{
    use(req: Request, res: Response, next: NextFunction)
    {
        next();

        // const authHeader: string | undefined = req.headers['authorization'];
        // if (!authHeader) { throw new UnauthorizedException(); }

        // const token = authHeader.split(' ')[1]; // "Bearer <token>"
        // if (!token) throw new UnauthorizedException();
        
        // try
        // {
        //     const payload = jwt.verify(token, process.env.JWT_SECRET!);
        //     req['jwt'] = payload;
        // }
        // catch (error: unknown)
        // {
        //     console.log(error);
        //     throw new UnauthorizedException();
        // }

        // next();
    }
}