import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { ZodExceptionFilter } from './filters/zod-exceptions.filter';

async function bootstrap() 
{
    const app = await NestFactory.create(AppModule);
    app.useGlobalFilters(new ZodExceptionFilter());
    await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
