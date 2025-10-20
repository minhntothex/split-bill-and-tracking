import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
    imports: [
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (config: ConfigService) => ({
                uri: config.get('MONGODB_URI'),
            }),
            inject: [ConfigService],
        }),
    ],
    exports: [MongooseModule],
})
    
export class DatabaseModule {}
