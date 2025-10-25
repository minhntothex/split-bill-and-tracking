import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post } from '@nestjs/common';

import { Requester } from '../../decorators/requester.decorator';

import { AddMembersBodyDto, CreateSpaceBodyDto, GetSpaceParamsDto, GetSpacesParamsDto, RemoveUserParamsDto, UpdateSpaceBodyDto } from './space.dtos';
import { SpaceService } from './space.service';

@Controller('spaces')
export class SpaceController 
{
    constructor(private readonly spacesService: SpaceService) { }

    @Get()
    async get(@Requester() requester: string, @Param() params: GetSpacesParamsDto)
    {
        return await this.spacesService.get(params, requester);
    }

    @Get(':spaceId')
    async getById(@Requester() requester: string, @Param() { spaceId }: GetSpaceParamsDto)
    {
        return await this.spacesService.getOne(spaceId, requester);
    }
        
    @Post()
    async create(@Requester() requester: string, @Body() body: CreateSpaceBodyDto)
    {
        return await this.spacesService.create(body, requester);
    }

    @Patch(':spaceId')
    async modify(@Requester() requester: string, @Param() { spaceId }: GetSpaceParamsDto, @Body() body: UpdateSpaceBodyDto)
    {
        return await this.spacesService.update(spaceId, body, requester);
    }

    @Post(':spaceId/close')
    @HttpCode(204)
    async close(@Requester() requester: string, @Param() { spaceId }: GetSpaceParamsDto)
    {
        return await this.spacesService.close(spaceId, requester);
    }

    @Post(':spaceId/reopen')
    @HttpCode(204)
    async reopen(@Requester() requester: string, @Param() { spaceId }: GetSpaceParamsDto)
    {
        return await this.spacesService.reopen(spaceId, requester);
    }

    @Post(':spaceId/leave')
    @HttpCode(204)
    async leave(@Requester() requester: string, @Param() { spaceId }: GetSpaceParamsDto)
    {
        return await this.spacesService.leave(spaceId, requester);
    }

    @Post(':spaceId/members')
    @HttpCode(204)
    async addMembers(@Requester() requester: string, @Param() { spaceId }: GetSpaceParamsDto, @Body() { emails }: AddMembersBodyDto)
    {
        return await this.spacesService.addMembers(spaceId, emails, requester);
    }

    @Delete(':spaceId/members/:memberEmail')
    @HttpCode(204)
    async removeMember(@Requester() requester: string, @Param() { spaceId, memberEmail }: RemoveUserParamsDto)
    {
        return await this.spacesService.removeMember(spaceId, memberEmail, requester);
    }

    @Post(':spaceId/invite-link')
    async generateInviteLink(@Requester() requester: string, @Param() { spaceId }: GetSpaceParamsDto)
    {
        return await this.spacesService.generateInviteToken(spaceId, requester);
    }

    @Get('join/:inviteToken')
    async join(@Requester() requester: string, @Param('inviteToken') inviteToken: string)
    {
        return await this.spacesService.join(inviteToken, requester);
    }
}
