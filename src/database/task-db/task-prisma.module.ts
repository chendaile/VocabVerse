import { Module } from '@nestjs/common';
import { TaskPrismaService } from './task-prisma.service';

@Module({
    providers: [TaskPrismaService],
    exports: [TaskPrismaService],
})
export class TaskPrismaModule {}
