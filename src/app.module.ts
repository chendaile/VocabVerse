import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WorkerModule } from './worker/worker.module';
import { txt2picModule } from './txt2pic/txt2pic.module';
import { ConfigModule } from '@nestjs/config';
import { TaskPrismaModule } from './database/task-db/task-prisma.module';
import { AuthModule } from './auth/auth.module';
import { UserPlansModule } from './user-plans/user-plans.module';
import { UserWordsModule } from './user-words/user-words.module';
import { ReviewStrategyModule } from './review-strategy/review-strategy.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true, // 使配置在全局可用
        }),
        TaskPrismaModule,
        WorkerModule,
        txt2picModule,
        AuthModule,
        UserPlansModule,
        UserWordsModule,
        ReviewStrategyModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
