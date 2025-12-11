
import { Module } from '@nestjs/common';
import { TaskWorkerService } from './worker.service';
import { PrismaModule } from '../prisma/prisma.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [PrismaModule, HttpModule],
  providers: [TaskWorkerService],
})
export class WorkerModule {}
