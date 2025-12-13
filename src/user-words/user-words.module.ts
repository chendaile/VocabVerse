import { Module } from '@nestjs/common';
import { UserWordsController } from './user-words.controller';
import { UserWordsService } from './user-words.service';
import { UserPrismaModule, WordPrismaModule } from '../database';
import { AuthModule } from '../auth/auth.module';
import { ReviewStrategyModule } from '../review-strategy/review-strategy.module';

@Module({
    imports: [
        UserPrismaModule,
        WordPrismaModule,
        AuthModule,
        ReviewStrategyModule,
    ],
    controllers: [UserWordsController],
    providers: [UserWordsService],
})
export class UserWordsModule {}
