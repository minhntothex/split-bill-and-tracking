import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Req } from '@nestjs/common';

import { Requester } from '../../decorators/requester.decorator';

import { AddMembersBodyDto, CreateSpaceBodyDto, GetSpaceParamsDto, GetSpacesParamsDto, RemoveUserParamsDto, UpdateSpaceBodyDto } from './spaces.dtos';
import { SpacesService } from './spaces.service';

@Controller('spaces')
export class SpacesController 
{
    constructor(private readonly spacesService: SpacesService) { }

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

    @Post(':spaceId/add-members')
    @HttpCode(204)
    async addMembers(@Requester() requester: string, @Param() { spaceId }: GetSpaceParamsDto, @Body() { emails }: AddMembersBodyDto)
    {
        return await this.spacesService.addMembers(spaceId, emails, requester);
    }

    @Delete(':spaceId/member/:memberEmail/remove')
    @HttpCode(204)
    async removeMember(@Requester() requester: string, @Param() { spaceId, memberEmail }: RemoveUserParamsDto)
    {
        return await this.spacesService.removeMember(spaceId, memberEmail, requester);
    }

    @Post(':spaceId/invite-link')
    async generateInviteLink(@Requester() requester: string, @Param() { spaceId }: GetSpaceParamsDto)
    {

    }
}
