import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ZodSerializerInterceptor, ZodValidationPipe } from 'nestjs-zod';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { JwtMiddleware } from './middlewares/jwt.middleware';
import { BillsModule } from './modules/bills/bills.module';
import { DatabaseModule } from './modules/database/database.module';
import { SpaceModule } from './modules/space/space.module';
import { UsersModule } from './modules/users/users.module';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        DatabaseModule,
        SpaceModule, UsersModule, BillsModule,
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
        consumer.apply(JwtMiddleware).forRoutes('*');
    }

}
