
import { Module } from '@nestjs/common';
import { TaskWorkerService } from './worker.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [TaskWorkerService],
})
export class WorkerModule {}
