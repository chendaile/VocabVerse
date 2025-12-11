
import { Module } from '@nestjs/common';
import { txt2picController } from './txt2pic.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [txt2picController],
})
export class txt2picModule {}
