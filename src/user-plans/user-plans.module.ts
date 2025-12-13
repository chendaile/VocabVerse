import { Module } from '@nestjs/common';
import { UserPlansController } from './user-plans.controller';
import { UserPlansService } from './user-plans.service';
import { UserPrismaModule } from '../database';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [UserPrismaModule, AuthModule],
    controllers: [UserPlansController],
    providers: [UserPlansService],
})
export class UserPlansModule {}
