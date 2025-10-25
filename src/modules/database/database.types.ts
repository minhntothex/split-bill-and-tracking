import { Types } from 'mongoose';
import z from 'zod';

export const ObjectId = z
    .union([z.string().regex(/^[0-9a-fA-F]{24}$/), z.instanceof(Types.ObjectId)])
    .transform(value => value instanceof Types.ObjectId ? value : new Types.ObjectId(value));

export const SystemFields = z.object({
    createdAt: z.date(),
    updatedAt: z.date(),
});
export type SystemFields = z.infer<typeof SystemFields>