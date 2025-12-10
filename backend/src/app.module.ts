import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { WorkerModule } from './worker/worker.module';
import { txt2picModule } from './txt2pic/txt2pic.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 使配置在全局可用
    }),
    PrismaModule,
    WorkerModule,
    txt2picModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
