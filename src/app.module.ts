import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ZodSerializerInterceptor, ZodValidationPipe } from 'nestjs-zod';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { BillsModule } from './modules/bills/bills.module';
import { DatabaseModule } from './modules/database/database.module';
import { SpacesModule } from './modules/spaces/spaces.module';
import { UsersModule } from './modules/users/users.module';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        DatabaseModule,
        SpacesModule, UsersModule, BillsModule,
    ],
    controllers: [AppController],
    providers: [
        {
            provide: APP_PIPE,
            useClass: ZodValidationPipe,
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: ZodSerializerInterceptor,
        },
        //         {
        //   provide: APP_FILTER,
        //   useClass: HttpExceptionFilter,
        // },
        AppService,
    ],
})
export class AppModule implements NestModule 
{
    configure(consumer: MiddlewareConsumer) 
    {
        // consumer.apply(JwtMiddleware).forRoutes('*');
    }

}
