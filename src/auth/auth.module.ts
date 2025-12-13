import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtService } from './jwt.service';
import { AuthGuard } from './auth.guard';
import { UserPrismaModule } from '../database';

@Module({
    imports: [UserPrismaModule],
    controllers: [AuthController],
    providers: [AuthService, JwtService, AuthGuard],
    exports: [JwtService, AuthGuard],
})
export class AuthModule {}
