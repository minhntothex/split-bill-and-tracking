import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';
import z from 'zod';

import { SpaceModel } from '../database/schemas/space.schema';
import { CreateSpaceBody, GetSpacesParams, Space, SpaceMember, UpdateSpaceBody } from './space.dtos';

import { flatMapParseOrDiscard } from '../../utils/flatMapParseOrDiscard';
import { InviteToken } from '../../utils/inviteToken';
import { NextToken } from '../../utils/nextToken';

@Injectable()
export class SpaceService 
{
    constructor(@InjectModel(SpaceModel.name) private spaceModel: Model<SpaceModel>) { }

    private async readSpaceOrThrow({ spaceId, requester, owned }: { spaceId: Types.ObjectId, requester: string, owned?: boolean }) 
    {
        const requesterEmail = z.email().parse(requester);

        const doc = await this.spaceModel.findById(spaceId);
        const { success } = Space.safeParse(doc?.toObject());
        if (!doc || !success) { throw new NotFoundException('Space not found'); }

        const member = doc.toObject().members.find(member => member.email === requesterEmail);
        const isOwner = owned ? member?.role === 'owner' : true;
        if (!member) { throw new ForbiddenException('You are not a member of this space'); }
        if (!isOwner) { throw new ForbiddenException('You are not the owner of this space'); }

        return doc;
    }

    async get(params: GetSpacesParams, requester: string)
    {
        const requesterEmail = z.email().parse(requester);

        const { categories, active = true, take = 10, nextToken } = params;

        const query: FilterQuery<Space> = { active, 'members.email': requesterEmail };
        if (nextToken) 
        {
            const { $or } = NextToken.buildQueryFromToken<Space>(nextToken);
            query.$or = $or;
        }

        if (categories) { query.categories = { $in: categories }; }

        const docs = await this.spaceModel.find(query).sort({ updatedAt: -1 }).limit(take + 1);

        const hasNextPage = docs.length > take;
        const results = hasNextPage ? docs.slice(0, take) : docs;
        
        const lastDoc = docs[docs.length - 1];
        const newNextToken = hasNextPage ? NextToken.encode(lastDoc) : undefined;

        const spaces = results.flatMap(doc => flatMapParseOrDiscard(Space)(doc.toObject()));
        const result: { items: Space[], nextToken?: string } = { items: spaces };
        if (newNextToken) { result.nextToken = newNextToken; }

        return result;
    }

    async getOne(spaceId: Types.ObjectId, requester: string)
    {
        const doc = await this.readSpaceOrThrow({ spaceId, requester });
        return Space.parse(doc.toObject());
    }

    async create(input: CreateSpaceBody, requester: string)
    {
        const owner = z.email().parse(requester);
        const data = CreateSpaceBody.parse(input);
        const addedBy = owner;
        const joinedAt = new Date();

        const members = [{ role: 'owner', email: owner, addedBy, joinedAt }];
        if (data.members) 
        {
            members.push(...data.members.map(email =>
                ({ role: 'member', email, addedBy, joinedAt } as SpaceMember),
            ));
        }
    
        const doc = await this.spaceModel.create({ ...data, members });

        const space = Space.parse(doc.toObject());
        return space;
    }

    async update(spaceId: Types.ObjectId, body: UpdateSpaceBody, requester: string)
    {
        const data = UpdateSpaceBody.parse(body);

        const doc = await this.readSpaceOrThrow({ spaceId, requester, owned: true });
        if (!doc.toObject().active) { throw new BadRequestException('Cannot modify a closed space.'); }

        doc.set(data);
        await doc.validate();
        await doc.save();

        const space = Space.parse(doc.toObject());
        return space;
    }

    async close(spaceId: Types.ObjectId, requester: string)
    {
        const doc = await this.readSpaceOrThrow({ spaceId, requester, owned: true });

        doc.set({ active: false, closedAt: new Date() });
        await doc.validate();
        await doc.save();
    }

    async reopen(spaceId: Types.ObjectId, requester: string)
    {
        const doc = await this.readSpaceOrThrow({ spaceId, requester, owned: true });

        doc.set({ active: true, closedAt: undefined });
        doc.markModified('closedAt');
        await doc.validate();
        await doc.save();
    }

    async leave(spaceId: Types.ObjectId, requester: string)
    {
        const requesterEmail = z.email().parse(requester);

        const doc = await this.readSpaceOrThrow({ spaceId, requester });
        if (!doc.toObject().active) { throw new BadRequestException('Cannot leave a closed space'); }

        const members = doc.members;
        const myIndex = members.findIndex(member => member.email === requesterEmail);
        const currentMember = members[myIndex];
        const amIOwner = currentMember.role === 'owner';
        if (amIOwner) 
        {
            const newOwner = members.find(m => m.role === 'member');
            if (!newOwner) { throw new BadRequestException('Owner cannot leave when no other members remain'); }
            
            newOwner.role = 'owner';
        }

        members.splice(myIndex, 1);

        doc.set({ members });
        await doc.validate();
        await doc.save();
    }

    async addMembers(spaceId: Types.ObjectId, users: string[], requester: string)
    {
        //FIXME: Ensure users are existing in db.
        const EmailSchema = z.email();
        const requesterEmail = EmailSchema.parse(requester);
        const memberEmails = z.array(EmailSchema).parse(users);

        if (memberEmails.includes(requesterEmail)) { throw new ConflictException(`${requesterEmail} is already a member`); }

        const doc = await this.readSpaceOrThrow({ spaceId, requester });
        if (!doc.toObject().active) { throw new BadRequestException('Cannot add members to a closed space'); }
        
        const joinedAt = new Date();
        const members = doc.members;
        const memberSet = new Set(doc.members.map(({ email }) => email));
        for (const email of memberEmails)
        {
            if (memberSet.has(email)) { throw new ConflictException(`${email} is already a member`); }
            const member: Space['members'][number] = { role: 'member', email, addedBy: requesterEmail, joinedAt };
            members.push(member);
            memberSet.add(email);
        }

        doc.set({ members });
        await doc.validate();
        await doc.save();
    }

    async removeMember(spaceId: Types.ObjectId, target: string, requester: string)
    {
        const targetEmail = z.email().parse(target);
        if (targetEmail === requester) { throw new ConflictException('Cannot remove yourself'); }

        const doc = await this.readSpaceOrThrow({ spaceId, requester, owned: true });
        if (!doc.toObject().active) { throw new BadRequestException('Cannot remove members from a closed space'); }

        const members = doc.toObject().members;
        const targetIndex = members.findIndex(member => member.email === targetEmail);
        if (targetIndex === -1) { throw new BadRequestException('Member not found'); }
        
        members.splice(targetIndex, 1);
        doc.set({ members });
        await doc.validate();
        await doc.save();
    }

    async generateInviteToken(spaceId: Types.ObjectId, requester: string)
    {
        const doc = await this.readSpaceOrThrow({ spaceId, requester, owned: true });
        if (!doc.toObject().active) { throw new BadRequestException('Cannot generate an invite token for a closed space'); }

        const inviteToken = InviteToken.create(spaceId);
        doc.set({ inviteToken });
        await doc.validate();
        await doc.save();

        return inviteToken;
    }

    async join(inviteToken: string, requester: string) 
    {
        const requesterEmail = z.email().parse(requester);

        const { spaceId } = InviteToken.verify(inviteToken);

        const doc = await this.spaceModel.findById(spaceId);
        const { success } = Space.safeParse(doc?.toObject());
        if (!doc || !success) { throw new NotFoundException('Space not found'); }

        if (!doc.toObject().active) { throw new BadRequestException('Cannot join a closed space'); }

        const members = doc.toObject().members;
        const existingMember = members.find(m => m.email === requesterEmail);
        if (existingMember) { throw new ConflictException('Already a member'); }

        const owner = members.find(m => m.role === 'owner') as SpaceMember;
        members.push({ role: 'member', email: requesterEmail, addedBy: owner.email, joinedAt: new Date() });

        doc.set({ members });
        await doc.validate();
        await doc.save();
    }
}
