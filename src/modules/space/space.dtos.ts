import { createZodDto } from 'nestjs-zod';
import z from 'zod';

import { ObjectId, SystemFields } from '../database/database.types';

const SpaceMember = z.object({
    role: z.enum(['owner', 'member']),
    email: z.email(),
    addedBy: z.email(),
    joinedAt: z.date(),
});

export type SpaceMember = z.infer<typeof SpaceMember>

export const Space = SystemFields.extend({
    _id: ObjectId,
    name: z.string().min(3).max(20),
    description: z.string().optional(),
    icon: z.string(),
    categories: z.array(z.any()).min(1),
    members: z
        .array(SpaceMember)
        .refine(
            members => members.filter(member => member.role === 'owner').length === 1,
            { error: 'Members array must contain exactly 1 owner' },
        ),
    active: z.boolean(),
    closedAt: z.date().optional(),
    inviteToken: z.string().optional(),
});
export type Space = z.infer<typeof Space>

export const GetSpacesParams = Space
    .pick({ categories: true, active: true })
    .extend({ take: z.number(), nextToken: z.string().optional() })
    .partial();
export type GetSpacesParams = z.infer<typeof GetSpacesParams>
export class GetSpacesParamsDto extends createZodDto(GetSpacesParams) {}

export const GetSpaceParams = z.object({ spaceId: ObjectId });
export type GetSpaceParams = z.infer<typeof GetSpaceParams>
export class GetSpaceParamsDto extends createZodDto(GetSpaceParams) {}

export const CreateSpaceBody = Space
    .pick({ name: true, description: true, icon: true, categories: true })
    .extend({ members: z.array(z.email()).optional() });
export type CreateSpaceBody = z.infer<typeof CreateSpaceBody>
export class CreateSpaceBodyDto extends createZodDto(CreateSpaceBody) {}

export const UpdateSpaceBody = Space
    .pick({ name: true, description: true, icon: true, categories: true })
    .partial();
export type UpdateSpaceBody = z.infer<typeof UpdateSpaceBody>
export class UpdateSpaceBodyDto extends createZodDto(UpdateSpaceBody) {}

export const AddMembersBody = z.object({ emails: z.array(z.email()) });
export type AddMembersBody = z.infer<typeof AddMembersBody>
export class AddMembersBodyDto extends createZodDto(AddMembersBody) {}

export const RemoveUserParams = GetSpaceParams.extend({ memberEmail: z.email() });
export type RemoveUserParams = z.infer<typeof RemoveUserParams>
export class RemoveUserParamsDto extends createZodDto(RemoveUserParams) {}
