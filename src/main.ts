import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    await app.listen(process.env.PORT ?? 3000);
}
// bootstrap().catch((err) => {
//     console.error(`app don't start smoothly...some err happen: ${err}`);
//     process.exit(1);
// });

void bootstrap();
