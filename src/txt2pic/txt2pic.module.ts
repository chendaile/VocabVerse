import { Module } from '@nestjs/common';
import { txt2picController } from './txt2pic.controller';
import { TaskPrismaModule } from '../database/task-db/task-prisma.module';

@Module({
    imports: [TaskPrismaModule],
    controllers: [txt2picController],
})
export class txt2picModule {}
