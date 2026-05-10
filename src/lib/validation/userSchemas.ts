import { z } from 'zod';

export const userSessionSchema = z.object({
    phoneNumber: z.string().trim().min(1, 'Phone number is required.'),
    displayName: z.string().trim().min(1, 'Display name is required.').max(50, 'Display name must be 50 characters or fewer.'),
});

export type UserSessionInput = z.infer<typeof userSessionSchema>;
