import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { SpaceModel, SpaceSchema } from '../database/schemas/spaces.schema';
import { SpacesController } from './spaces.controller';
import { SpacesService } from './spaces.service';

@Module({
    imports: [MongooseModule.forFeature([{ name: SpaceModel.name, schema: SpaceSchema }])],
    controllers: [SpacesController],
    providers: [SpacesService],
})
export class SpacesModule {}
