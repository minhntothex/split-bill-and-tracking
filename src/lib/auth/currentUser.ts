import 'server-only';

import { cookies } from 'next/headers';

import { getSessionUserId } from './session';
import { userRepository } from '@/server/repositories/userRepository';
import { getCurrentUserBySessionUserId, type SessionUser } from '@/server/services/userSessionService';

export async function getCurrentUser(): Promise<SessionUser | null> {
    const cookieStore = await cookies();
    const sessionUserId = getSessionUserId(cookieStore);

    return getCurrentUserBySessionUserId(sessionUserId, {
        userRepository,
    });
}
