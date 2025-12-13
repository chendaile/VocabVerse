import { Module } from '@nestjs/common';
import { TaskWorkerService } from './worker.service';
import { TaskPrismaModule } from '../database/task-db/task-prisma.module';
import { HttpModule } from '@nestjs/axios';

@Module({
    imports: [TaskPrismaModule, HttpModule],
    providers: [TaskWorkerService],
})
export class WorkerModule {}
