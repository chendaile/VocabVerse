import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
            transformOptions: { enableImplicitConversion: true },
        }),
    );
    await app.listen(process.env.PORT ?? 3000);
}
// bootstrap().catch((err) => {
//     console.error(`app don't start smoothly...some err happen: ${err}`);
//     process.exit(1);
// });

void bootstrap();
