import {
    createOrResumeUserSession,
    getCurrentUserBySessionUserId,
    type SessionUser,
    type UserRepository,
} from './userSessionService';

function createUser(overrides: Partial<SessionUser> = {}): SessionUser {
    return {
        id: '507f1f77bcf86cd799439011',
        phoneNumber: '0901234567',
        displayName: 'Minh',
        createdAt: '2026-05-10T00:00:00.000Z',
        updatedAt: '2026-05-10T00:00:00.000Z',
        ...overrides,
    };
}

function createRepository(overrides: Partial<UserRepository> = {}): UserRepository {
    return {
        findByPhoneNumber: jest.fn(async () => null),
        createUser: jest.fn(async ({ phoneNumber, displayName }) =>
            createUser({
                phoneNumber,
                displayName,
            }),
        ),
        updateDisplayName: jest.fn(async (userId, displayName) =>
            createUser({
                id: userId,
                displayName,
                updatedAt: '2026-05-11T00:00:00.000Z',
            }),
        ),
        findById: jest.fn(async () => null),
        ...overrides,
    };
}

describe('createOrResumeUserSession', () => {
    test('creates a new user with a normalized phone number when none exists', async () => {
        const repository = createRepository();

        const user = await createOrResumeUserSession(
            {
                phoneNumber: ' 090-123 4567 ',
                displayName: ' Minh ',
            },
            {
                userRepository: repository,
            },
        );

        expect(repository.findByPhoneNumber).toHaveBeenCalledWith('0901234567');
        expect(repository.createUser).toHaveBeenCalledWith({
            phoneNumber: '0901234567',
            displayName: 'Minh',
        });
        expect(user).toMatchObject({
            phoneNumber: '0901234567',
            displayName: 'Minh',
        });
    });

    test('returns an existing user found by normalized phone number', async () => {
        const existingUser = createUser();
        const repository = createRepository({
            findByPhoneNumber: jest.fn(async () => existingUser),
        });

        const user = await createOrResumeUserSession(
            {
                phoneNumber: '090 123-4567',
                displayName: 'Minh',
            },
            {
                userRepository: repository,
            },
        );

        expect(repository.findByPhoneNumber).toHaveBeenCalledWith('0901234567');
        expect(repository.createUser).not.toHaveBeenCalled();
        expect(user).toBe(existingUser);
    });

    test('updates the display name when an existing user submits a different one', async () => {
        const existingUser = createUser({
            displayName: 'Old Name',
        });
        const repository = createRepository({
            findByPhoneNumber: jest.fn(async () => existingUser),
        });

        const user = await createOrResumeUserSession(
            {
                phoneNumber: '0901234567',
                displayName: 'New Name',
            },
            {
                userRepository: repository,
            },
        );

        expect(repository.updateDisplayName).toHaveBeenCalledWith(existingUser.id, 'New Name');
        expect(user.displayName).toBe('New Name');
    });
});

describe('getCurrentUserBySessionUserId', () => {
    test('returns null when the session is missing', async () => {
        const repository = createRepository();

        const user = await getCurrentUserBySessionUserId(null, {
            userRepository: repository,
        });

        expect(user).toBeNull();
        expect(repository.findById).not.toHaveBeenCalled();
    });

    test('returns the current user when the session user id exists', async () => {
        const existingUser = createUser();
        const repository = createRepository({
            findById: jest.fn(async () => existingUser),
        });

        const user = await getCurrentUserBySessionUserId(existingUser.id, {
            userRepository: repository,
        });

        expect(repository.findById).toHaveBeenCalledWith(existingUser.id);
        expect(user).toBe(existingUser);
    });
});
