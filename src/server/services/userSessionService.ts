import type { UserSessionInput } from '@/lib/validation/userSchemas';
import type { SessionUser } from '@/server/repositories/userRepository';

export type { SessionUser };

export type UserRepository = {
    findByPhoneNumber: (phoneNumber: string) => Promise<SessionUser | null>;
    createUser: (input: { phoneNumber: string; displayName: string }) => Promise<SessionUser>;
    updateDisplayName: (userId: string, displayName: string) => Promise<SessionUser>;
    findById: (userId: string) => Promise<SessionUser | null>;
};

type UserSessionDependencies = {
    userRepository: UserRepository;
};

export function normalizePhoneNumber(phoneNumber: string): string {
    return phoneNumber.trim().replace(/[\s-]+/g, '');
}

function normalizeDisplayName(displayName: string): string {
    return displayName.trim();
}

export async function createOrResumeUserSession(
    input: UserSessionInput,
    dependencies: UserSessionDependencies,
): Promise<SessionUser> {
    const phoneNumber = normalizePhoneNumber(input.phoneNumber);
    const displayName = normalizeDisplayName(input.displayName);
    const existingUser = await dependencies.userRepository.findByPhoneNumber(phoneNumber);

    if (!existingUser) {
        return dependencies.userRepository.createUser({
            phoneNumber,
            displayName,
        });
    }

    if (existingUser.displayName !== displayName) {
        return dependencies.userRepository.updateDisplayName(existingUser.id, displayName);
    }

    return existingUser;
}

export async function getCurrentUserBySessionUserId(
    sessionUserId: string | null,
    dependencies: UserSessionDependencies,
): Promise<SessionUser | null> {
    if (!sessionUserId) {
        return null;
    }

    return dependencies.userRepository.findById(sessionUserId);
}
