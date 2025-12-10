import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { WorkerModule } from './worker/worker.module';
import { txt2picModule } from './txt2pic/txt2pic.module';

@Module({
  imports: [PrismaModule, WorkerModule],
  controllers: [AppController, txt2picModule],
  providers: [AppService],
})
export class AppModule {}
