
import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { ZodValidationException } from 'nestjs-zod';
import z from 'zod';

@Catch(ZodValidationException)
export class ZodExceptionFilter implements ExceptionFilter 
{
    catch(exception: ZodValidationException, host: ArgumentsHost) 
    {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        const method = request.method;
        const BAD_REQUEST_METHODS = ['POST', 'PUT', 'PATCH', 'DELETE'];

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        if (BAD_REQUEST_METHODS.includes(method)) { status = HttpStatus.BAD_REQUEST; }
        
        const zodError = exception.getZodError() as z.ZodError;
        const issues = zodError.issues;

        response
            .status(status)
            .json({
                message: 'Validation failed',
                errors: issues.map(iss => ({
                    path: iss.path.join('.'),
                    message: iss.message,
                })),
                statusCode: status,
            });
    }
}
