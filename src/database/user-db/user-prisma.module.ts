import { Module } from '@nestjs/common';
import { UserPrismaService } from './user-prisma.service';

@Module({
    providers: [UserPrismaService],
    exports: [UserPrismaService],
})
export class UserPrismaModule {}
