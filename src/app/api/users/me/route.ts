import { getCurrentUser } from '@/lib/auth/currentUser';
import { createApiErrorResponse } from '@/lib/errors/api-error';

export const runtime = 'nodejs';

export async function GET(): Promise<Response> {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return createApiErrorResponse('UNAUTHORIZED', 'Unauthorized.');
        }

        return Response.json({ user });
    } catch {
        return createApiErrorResponse('INTERNAL_ERROR', 'An unexpected error occurred.');
    }
}
