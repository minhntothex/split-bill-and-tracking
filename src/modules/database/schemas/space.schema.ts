import { Prop, Schema } from '@nestjs/mongoose';

import { createSchema } from '../../../utils/createSchema';
import type { SpaceMember as IMember, Space as ISpace } from '../../space/space.dtos';

@Schema({ _id: false })
class MemberSchema
{
    @Prop({ type: String, required: true })
        email: IMember['email'];
    
    @Prop({ type: String, required: true, enum: ['owner', 'member'] })
        role: IMember['role'];

    @Prop({ type: String, required: true })
        addedBy: IMember['addedBy'];

    @Prop({ type: Date, required: true })
        joinedAt: IMember['joinedAt'];
}

@Schema({ timestamps: true })
export class SpaceModel
{
    @Prop({ type: String, unique: true, required: true, minLength: 3, maxLength: 20 })
        name: ISpace['name'];
    @Prop({ type: String })
        description?: ISpace['description'];
    @Prop({ type: String, required: true })
        icon: ISpace['icon'];
    @Prop({ type: [String], required: true, validate: [(arr: any[]) => arr.length > 0, 'At least one category required'] })
        categories: ISpace['categories'];
    @Prop({ type: [MemberSchema], required: true, validate: [(arr: any[]) => arr.length > 0 && !!arr.find(m => m.role === 'owner'), 'At least one member required'] })
        members: ISpace['members'];
    @Prop({ type: Boolean, required: true, default: true })
        active: ISpace['active'];
    @Prop({ type: Date })
        closedAt: ISpace['closedAt'];
    
    readonly createdAt: ISpace['createdAt'];
    readonly updatedAt: ISpace['updatedAt'];
}

export const SpaceSchema = createSchema(SpaceModel);

SpaceSchema.index({ _id: 1, 'members.email': 1 }, { unique: true, sparse: true });
