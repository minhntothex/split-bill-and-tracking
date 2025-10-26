import { BadRequestException, ConflictException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { Types } from 'mongoose';

import { SpaceModel } from '../../../database/schemas/space.schema';
import { SpaceService } from '../../space.service';

import { InviteToken } from '../../../../utils/inviteToken';
import { createRecord } from '../utils/space.test.fixture';

jest.mock('../../../../utils/nextToken', () => ({
    NextToken: {
        buildQueryFromToken: jest.fn(() => ({ $or: [] })),
        encode: jest.fn(() => 'mockToken'),
    },
}));

jest.mock('../../../../utils/inviteToken', () => ({
    InviteToken: {
        create: jest.fn(() => 'token'),
        verify: jest.fn(),
    },
}));

describe('SpaceService', () => 
{
    let service: {
        readSpaceOrThrow: SpaceService['readSpaceOrThrow'],
        get: SpaceService['get'],
        getOne: SpaceService['getOne'],
        create: SpaceService['create'],
        update: SpaceService['update'],
        leave: SpaceService['leave'],
        addMembers: SpaceService['addMembers'],
        removeMember: SpaceService['removeMember'],
        close: SpaceService['close'],
        reopen: SpaceService['reopen'],
        generateInviteToken: SpaceService['generateInviteToken'],
        join: SpaceService['join'],
    };

    let model = {
        findById: jest.fn(),
        find: jest.fn(),
        findOne: jest.fn(),
        create: jest.fn(),
    };

    beforeEach(async () => 
    {
        const module = await Test.createTestingModule({
            providers: [
                SpaceService,
                {
                    provide: getModelToken(SpaceModel.name),
                    useValue: model,
                },
            ],
        }).compile();

        service = module.get(SpaceService);
        model = module.get(getModelToken(SpaceModel.name));
    });

    afterEach(() => jest.clearAllMocks());

    // ===========================================================
    // ✅ service
    // ===========================================================
    it('service should be defined', () => 
    {
        expect(service).toBeDefined();
    });

    // ===========================================================
    // ✅ get()
    // ===========================================================
    describe('get', () => 
    {
        it('returns spaces and nextToken if > take', async () => 
        {
            const docs = [createRecord(), createRecord(), createRecord()];
            model.find.mockReturnValue({
                sort: () => ({ limit: () => Promise.resolve(docs) }),
            });

            const result = await service.get({ take: 2, categories: ['category_1'] }, 'a@b.com');
             
            expect(model.find).toHaveBeenCalledWith({
                active: true,
                'members.email': 'a@b.com',
                categories: { $in: ['category_1'] },
            });
            expect(result.items.length).toBe(2);
            expect(result.nextToken).toBe('mockToken');
        });

        it('returns spaces and no nextToken if <= take', async () => 
        {
            const docs = [createRecord(), createRecord(), createRecord()];
            model.find.mockReturnValue({
                sort: () => ({ limit: () => Promise.resolve(docs) }),
            });

            const result = await service.get({ take: 3 }, 'a@b.com');
             
            expect(model.find).toHaveBeenCalledWith({
                active: true,
                'members.email': 'a@b.com',
            });
            expect(result.items.length).toBe(3);
            expect(result.nextToken).toBeUndefined();
        });

        it('returns only items if <= take', async () => 
        {
            const docs = [createRecord()];
            model.find.mockReturnValue({
                sort: () => ({ limit: () => Promise.resolve(docs) }),
            });

            const result = await service.get({ take: 2 }, 'a@b.com');
            expect(result.nextToken).toBeUndefined();
        });

        it('returns paginated spaces based on nextToken', async () => 
        {
            const docs = [createRecord(), createRecord(), createRecord()];
            (model.find).mockReturnValue({
                sort: () => ({ limit: () => Promise.resolve(docs) }),
            });

            const result = await service.get({ nextToken: 'mockToken' }, 'a@b.com');
            expect(result.items.length).toBe(3);
        });
    });

    // ===========================================================
    // ✅ getOne()
    // ===========================================================
    describe('getOne', () => 
    {
        it('returns a space', async () => 
        {
            const doc = createRecord();
            model.findById.mockResolvedValue(doc);

            const result = await service.getOne(doc.toObject()._id, 'a@b.com');
            expect(result).toMatchObject(doc.toObject());
        });

        it('throws when getting a malformed space', async () => 
        {
            const doc = createRecord({ members: {} });
            model.findById.mockResolvedValue(doc);

            await expect(service.getOne(doc.toObject()._id, 'a@b.com')).rejects.toThrow(NotFoundException);
        });
    });

    // ===========================================================
    // ✅ create()
    // ===========================================================
    describe('create', () => 
    {
        it.each([undefined, ['b@b.com']])('#%# - creates and returns parsed space', async (members) => 
        {
            const doc = createRecord();
            model.create.mockResolvedValue(doc);
            
            const space = doc.toObject();
            const createSpaceBody = {
                name: space.name,
                description: space.description,
                icon: space.icon,
                categories: space.categories,
                members,
            };

            const result = await service.create(createSpaceBody, 'a@b.com');

            expect(result).toEqual(doc.toObject());
        });
    });

    // ===========================================================
    // ✅ update()
    // ===========================================================
    describe('update', () => 
    {
        it('throws when modifying a closed space', async () => 
        {
            const doc = createRecord({ active: false, closedAt: new Date() });
            model.findById.mockResolvedValue(doc);

            await expect(service.update(doc.toObject()._id, { name: 'New' }, 'a@b.com')).rejects.toThrow(BadRequestException);
        });

        it('updates and returns space', async () => 
        {
            const doc = createRecord();
            model.findById.mockResolvedValue(doc);

            const result = await service.update(doc.toObject()._id, { name: 'New' }, 'a@b.com');
            expect(doc.set).toHaveBeenCalledWith({ name: 'New' });
            expect(result).toMatchObject({ name: 'New' });
        });
    });

    // ===========================================================
    // ✅ leave()
    // ===========================================================
    describe('leave', () => 
    {
        it('throws if member not found', async () => 
        {
            const doc = createRecord({ members: [{ email: 'x@y.com', role: 'owner', addedBy: 'x@y.com', joinedAt: new Date() }] });
            model.findById.mockResolvedValue(doc);

            await expect(service.leave(doc.toObject()._id, 'a@b.com')).rejects.toThrow(ForbiddenException);
        });

        it('transfers ownership if owner leaves', async () => 
        {
            const doc = createRecord();
            model.findById.mockResolvedValue(doc);

            const space = doc.toObject();

            await service.leave(space._id, 'a@b.com');
            expect(doc.set).toHaveBeenCalledWith({
                members: [expect.objectContaining({
                    email: 'b@b.com',
                    role: 'owner',
                })],
            });
        });

        it('throws if owner leaves alone', async () => 
        {
            const doc = createRecord({ members: [{ email: 'a@b.com', role: 'owner', addedBy: 'a@b.com', joinedAt: new Date() }] });
            model.findById.mockResolvedValue(doc);

            await expect(service.leave(doc.toObject()._id, 'a@b.com')).rejects.toThrow(BadRequestException);
        });

        it('throws when leaving a closed space', async () => 
        {
            const doc = createRecord({ active: false, closedAt: new Date() });
            model.findById.mockResolvedValue(doc);

            await expect(service.leave(doc.toObject()._id, 'a@b.com')).rejects.toThrow(BadRequestException);
        });

        it('throws when leaving as a member', async () => 
        {
            const doc = createRecord();
            model.findById.mockResolvedValue(doc);

            await service.leave(doc.toObject()._id, 'b@b.com');
            expect(doc.set).toHaveBeenCalledWith({
                members: [expect.objectContaining({
                    email: 'a@b.com',
                    role: 'owner',
                })],
            });
        });
    });

    // ===========================================================
    // ✅ addMembers()
    // ===========================================================
    describe('addMembers', () => 
    {
        it('throws when user does not own the space', async () => 
        {
            model.findById.mockResolvedValue(null);
            await expect(service.addMembers(new Types.ObjectId(), ['a@b.com'], 'owner@b.com')).rejects.toThrow(NotFoundException);
        });

        it('throws when adding members to a closed space', async () => 
        {
            const doc = createRecord({ active: false, closedAt: new Date() });
            model.findById.mockResolvedValue(doc);
            await expect(service.addMembers(doc.toObject()._id, ['c@b.com'], 'a@b.com')).rejects.toThrow(BadRequestException);
        });

        it('throws when user tries to add themselves', async () => 
        {
            const doc = createRecord();
            model.findById.mockResolvedValue(doc);
            await expect(service.addMembers(doc.toObject()._id, ['a@b.com'], 'a@b.com')).rejects.toThrow(ConflictException);
        });

        it('throws when adding duplicate members', async () => 
        {
            const doc = createRecord();
            model.findById.mockResolvedValue(doc);
            await expect(service.addMembers(doc.toObject()._id, ['b@b.com'], 'a@b.com')).rejects.toThrow(ConflictException);
        });

        it('adds new members and saves', async () => 
        {
            const doc = createRecord();
            model.findById.mockResolvedValue(doc);

            await service.addMembers(doc.toObject()._id, ['c@b.com', 'd@b.com'], 'a@b.com');
            expect(doc.set).toHaveBeenCalledWith({
                members: [
                    expect.objectContaining({ email: 'a@b.com', role: 'owner' }),
                    expect.objectContaining({ email: 'b@b.com', role: 'member' }),
                    expect.objectContaining({ email: 'c@b.com', role: 'member' }),
                    expect.objectContaining({ email: 'd@b.com', role: 'member' }),
                ],
            });
        });
    });

    // ===========================================================
    // ✅ removeMember()
    // ===========================================================
    describe('removeMember', () => 
    {
        it('throws when user does not own the space', async () => 
        {
            model.findById.mockResolvedValue(null);
            await expect(service.removeMember(new Types.ObjectId(), 'b@b.com', 'a@b.com')).rejects.toThrow(NotFoundException);
        });

        it('throws when user tries to remove themselves', async () => 
        {
            const spaceId = new Types.ObjectId();
            await expect(service.removeMember(spaceId, 'a@b.com', 'a@b.com')).rejects.toThrow(ConflictException);
        });

        it('throws when removing members to a closed space', async () => 
        {
            const doc = createRecord({ active: false, closedAt: new Date() });
            model.findById.mockResolvedValue(doc);

            await expect(service.removeMember(doc.toObject()._id, 'b@b.com', 'a@b.com')).rejects.toThrow(BadRequestException);
        });

        it('throws when trying to remove a member is not in a space.', async () => 
        {
            const doc = createRecord();
            model.findById.mockResolvedValue(doc);

            await expect(service.removeMember(doc.toObject()._id, 'c@b.com', 'a@b.com')).rejects.toThrow(BadRequestException);
        });

        it('removes a member and saves', async () => 
        {
            const doc = createRecord();
            model.findById.mockResolvedValue(doc);

            await service.removeMember(doc.toObject()._id, 'b@b.com', 'a@b.com');
            expect(doc.set).toHaveBeenCalledWith({ members: [expect.objectContaining({ email: 'a@b.com', role: 'owner' })] });
        });
    });

    // ===========================================================
    // ✅ close() and reopen()
    // ===========================================================
    describe('close and reopen', () => 
    {
        it.each(['close', 'reopen'] as const)('throws when %sing a space not own', async (fn) =>
        {
            const doc = createRecord();
            model.findById.mockResolvedValue(doc);
            
            await expect(service[fn](doc.toObject()._id, 'x@y.com')).rejects.toThrow(ForbiddenException);
        });

        it('closes a space', async () => 
        {
            const doc = createRecord();
            model.findById.mockResolvedValue(doc);

            await service.close(doc.toObject()._id, 'a@b.com');
            expect(doc.set).toHaveBeenCalledWith({ active: false, closedAt: expect.any(Date) });
            expect(doc.toObject()).toMatchObject({ active: false, closedAt: expect.any(Date) });
        });

        it('Reopens a space', async () => 
        {
            const doc = createRecord();
            model.findById.mockResolvedValue(doc);

            await service.reopen(doc.toObject()._id, 'a@b.com');
            expect(doc.set).toHaveBeenCalledWith({ active: true });
            expect(doc).toMatchObject({ active: true });
            expect(doc.toObject().closedAt).toBe(undefined);
        });
    });

    // ===========================================================
    // ✅ generateInviteToken()
    // ===========================================================
    describe('generateInviteToken', () => 
    {
        it('throws when the space does not exist', async () => 
        {
            model.findById.mockResolvedValue(null);
            await expect(service.generateInviteToken(new Types.ObjectId(), 'a@b.com')).rejects.toThrow(NotFoundException);
        });

        it('throws when user does not own the space', async () => 
        {
            const doc = createRecord();
            model.findById.mockResolvedValue(doc);
            await expect(service.generateInviteToken(doc.toObject()._id, 'b@b.com')).rejects.toThrow(ForbiddenException);
        });

        it('throws when user is not a member of the space', async () => 
        {
            const doc = createRecord();
            model.findById.mockResolvedValue(doc);
            await expect(service.generateInviteToken(doc.toObject()._id, 'c@b.com')).rejects.toThrow(ForbiddenException);
        });

        it('throws when generating an invite token for a closed space', async () => 
        {
            const doc = createRecord({ active: false, closedAt: new Date() });
            model.findById.mockResolvedValue(doc);
            await expect(service.generateInviteToken(doc.toObject()._id, 'a@b.com')).rejects.toThrow(BadRequestException);
        });

        it('generates an invite token', async () => 
        {
            const doc = createRecord();
            model.findById.mockResolvedValue(doc);
            
            await service.generateInviteToken(doc.toObject()._id, 'a@b.com');
            expect(doc.set).toHaveBeenCalledWith({
                inviteToken: expect.any(String),
            });
        });
    });

    // ===========================================================
    // ✅ join()
    // ===========================================================
    describe('join', () => 
    {
        it('throws when the space does not exist', async () => 
        {
            (InviteToken.verify as jest.Mock).mockReturnValue({ spaceId: new Types.ObjectId() });
            model.findById.mockResolvedValue(null);

            await expect(service.join('token', 'a@b.com')).rejects.toThrow(NotFoundException);
        });

        it('throws when the space is malformed', async () => 
        {
            const doc = createRecord({ name: 1 });
            (InviteToken.verify as jest.Mock).mockReturnValue({ spaceId: doc.toObject()._id });
            model.findById.mockResolvedValue(doc);

            await expect(service.join('token', 'a@b.com')).rejects.toThrow(NotFoundException);
        });

        it('throws when the space is not active', async () => 
        {
            const doc = createRecord({ active: false, closedAt: new Date() });
            (InviteToken.verify as jest.Mock).mockReturnValue({ spaceId: doc.toObject()._id });
            model.findById.mockResolvedValue(doc);

            await expect(service.join('token', 'a@b.com')).rejects.toThrow(BadRequestException);
        });

        it('throws when the user is already a member', async () => 
        {
            const doc = createRecord();
            (InviteToken.verify as jest.Mock).mockReturnValue({ spaceId: doc.toObject()._id });
            model.findById.mockResolvedValue(doc);

            await expect(service.join('token', 'b@b.com')).rejects.toThrow(ConflictException);
        });

        it('joins the space', async () => 
        {
            const doc = createRecord();
            (InviteToken.verify as jest.Mock).mockReturnValue({ spaceId: doc.toObject()._id });
            model.findById.mockResolvedValue(doc);

            await service.join('token', 'c@b.com');
            expect(doc.set).toHaveBeenCalledWith({
                members: expect.arrayContaining([{ email: 'c@b.com', role: 'member', addedBy: 'a@b.com', joinedAt: expect.any(Date) }]),
            });
        });
    });
});
