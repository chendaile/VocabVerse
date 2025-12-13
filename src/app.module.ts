import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WorkerModule } from './worker/worker.module';
import { txt2picModule } from './txt2pic/txt2pic.module';
import { ConfigModule } from '@nestjs/config';
import { TaskPrismaModule } from './database/task-db/task-prisma.module';
import { WordModule } from './words/words.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true, // 使配置在全局可用
        }),
        TaskPrismaModule,
        WorkerModule,
        txt2picModule,
        WordModule
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
