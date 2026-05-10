import { userSessionSchema } from './userSchemas';

describe('userSessionSchema', () => {
    test('accepts valid session input', () => {
        const result = userSessionSchema.safeParse({
            phoneNumber: ' 090-123 4567 ',
            displayName: 'Minh',
        });

        expect(result.success).toBe(true);
    });

    test('rejects an empty phone number', () => {
        const result = userSessionSchema.safeParse({
            phoneNumber: '   ',
            displayName: 'Minh',
        });

        expect(result.success).toBe(false);
        if (result.success) {
            throw new Error('Expected schema parsing to fail.');
        }

        expect(result.error.issues[0]?.path).toEqual(['phoneNumber']);
    });

    test('rejects a display name longer than 50 characters', () => {
        const result = userSessionSchema.safeParse({
            phoneNumber: '0901234567',
            displayName: 'a'.repeat(51),
        });

        expect(result.success).toBe(false);
        if (result.success) {
            throw new Error('Expected schema parsing to fail.');
        }

        expect(result.error.issues[0]?.path).toEqual(['displayName']);
    });
});
