import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';

import { SpaceController } from '../../space.controller';
import { SpaceService } from '../../space.service';

describe('SpaceController', () => 
{
    let controller: SpaceController;
    let service = {
        get: jest.fn(),
        getOne: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        close: jest.fn(),
        reopen: jest.fn(),
        leave: jest.fn(),
        addMembers: jest.fn(),
        removeMember: jest.fn(),
        generateInviteToken: jest.fn(),
        join: jest.fn(),
    };

    beforeEach(async () => 
    {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [SpaceController],
            providers: [
                {
                    provide: SpaceService,
                    useValue: {
                        get: jest.fn(),
                        getOne: jest.fn(),
                        create: jest.fn(),
                        update: jest.fn(),
                        close: jest.fn(),
                        reopen: jest.fn(),
                        leave: jest.fn(),
                        addMembers: jest.fn(),
                        removeMember: jest.fn(),
                        generateInviteToken: jest.fn(),
                        join: jest.fn(),
                    },
                },
            ],
        }).compile();

        controller = module.get<SpaceController>(SpaceController);
        service = module.get(SpaceService);
    });

    // ===========================================================
    // ✅ controller
    // ===========================================================
    it('should be defined', () => 
    {
        expect(controller).toBeDefined();
        expect(service).toBeDefined();
    });

    describe('get', () => 
    {
        it('calls service.get with correct params', async () => 
        {
            const mockResult = [{ id: '1' }];
            service.get.mockResolvedValue(mockResult);

            const params = { nextToken: 'abc' };
            const result = await controller.get('user@a.com', params);

            expect(service.get).toHaveBeenCalledWith(params, 'user@a.com');
            expect(result).toEqual(mockResult);
        });
    });

    describe('getById', () => 
    {
        it('calls service.getOne with correct params', async () => 
        {
            const mockResult = { id: '1' };
            service.getOne.mockResolvedValue(mockResult);

            const spaceId = new Types.ObjectId();
            const result = await controller.getById('user@a.com', { spaceId });

            expect(service.getOne).toHaveBeenCalledWith(spaceId, 'user@a.com');
            expect(result).toEqual(mockResult);
        });
    });

    describe('create', () => 
    {
        it('calls service.create', async () => 
        {
            const body = { name: 'Test Space', categories: ['category1', 'category2'], icon: 'icon1' };
            const mockResult = { id: '123', name: 'Test Space' };
            service.create.mockResolvedValue(mockResult);

            const result = await controller.create('user@a.com', body);

            expect(service.create).toHaveBeenCalledWith(body, 'user@a.com');
            expect(result).toEqual(mockResult);
        });
    });

    describe('modify', () => 
    {
        it('calls service.update', async () => 
        {
            const body = { name: 'Updated' };
            const spaceId = new Types.ObjectId();
            const mockResult = { id: '1', name: 'Updated' };
            service.update.mockResolvedValue(mockResult);

            const result = await controller.modify('user@a.com', { spaceId }, body);

            expect(service.update).toHaveBeenCalledWith(spaceId, body, 'user@a.com');
            expect(result).toEqual(mockResult);
        });
    });

    describe('close', () => 
    {
        it('calls service.close', async () => 
        {
            const spaceId = new Types.ObjectId();
            await controller.close('user@a.com', { spaceId });

            expect(service.close).toHaveBeenCalledWith(spaceId, 'user@a.com');
        });
    });

    describe('reopen', () => 
    {
        it('calls service.reopen', async () => 
        {
            const spaceId = new Types.ObjectId();
            await controller.reopen('user@a.com', { spaceId });

            expect(service.reopen).toHaveBeenCalledWith(spaceId, 'user@a.com');
        });
    });

    describe('leave', () => 
    {
        it('calls service.leave', async () => 
        {
            const spaceId = new Types.ObjectId();
            await controller.leave('user@a.com', { spaceId });

            expect(service.leave).toHaveBeenCalledWith(spaceId, 'user@a.com');
        });
    });

    describe('addMembers', () => 
    {
        it('calls service.addMembers', async () => 
        {
            const spaceId = new Types.ObjectId();
            const emails = ['b@b.com'];
            await controller.addMembers('user@a.com', { spaceId }, { emails });

            expect(service.addMembers).toHaveBeenCalledWith(spaceId, emails, 'user@a.com');
        });
    });

    describe('removeMember', () => 
    {
        it('calls service.removeMember', async () => 
        {
            const spaceId = new Types.ObjectId();
            const memberEmail = 'b@b.com';
            await controller.removeMember('user@a.com', { spaceId, memberEmail });

            expect(service.removeMember).toHaveBeenCalledWith(spaceId, memberEmail, 'user@a.com');
        });
    });

    describe('generateInviteLink', () => 
    {
        it('calls service.generateInviteToken', async () => 
        {
            const spaceId = new Types.ObjectId();
            const mockResult = { token: 'abc' };
            service.generateInviteToken.mockResolvedValue(mockResult);

            const result = await controller.generateInviteLink('user@a.com', { spaceId });
            expect(service.generateInviteToken).toHaveBeenCalledWith(spaceId, 'user@a.com');
            expect(result).toEqual(mockResult);
        });
    });

    describe('join', () => 
    {
        it('calls service.join', async () => 
        {
            const inviteToken = 'token123';
            const mockResult = { joined: true };
            service.join.mockResolvedValue(mockResult);

            const result = await controller.join('user@a.com', inviteToken);
            expect(service.join).toHaveBeenCalledWith(inviteToken, 'user@a.com');
            expect(result).toEqual(mockResult);
        });
    });
});
