import { NextResponse } from 'next/server';

import { setSessionUserIdCookie } from '@/lib/auth/session';
import { createApiErrorResponse, createValidationErrorResponse } from '@/lib/errors/api-error';
import { userSessionSchema } from '@/lib/validation/userSchemas';
import { userRepository } from '@/server/repositories/userRepository';
import { createOrResumeUserSession } from '@/server/services/userSessionService';

export const runtime = 'nodejs';

export async function POST(request: Request): Promise<Response> {
    try {
        const body = await request.json();
        const parsedBody = userSessionSchema.safeParse(body);

        if (!parsedBody.success) {
            return createValidationErrorResponse(parsedBody.error);
        }

        const user = await createOrResumeUserSession(parsedBody.data, {
            userRepository,
        });
        const response = NextResponse.json({ user });

        setSessionUserIdCookie(response.cookies, user.id);

        return response;
    } catch (error) {
        if (error instanceof SyntaxError) {
            return createApiErrorResponse('VALIDATION_ERROR', 'Request body must be valid JSON.');
        }

        return createApiErrorResponse('INTERNAL_ERROR', 'An unexpected error occurred.');
    }
}
