import { Module } from '@nestjs/common';
import { WordsController } from './words.controller';
import { WordPrismaModule } from '../database';

@Module({
    imports: [WordPrismaModule],
    controllers: [WordsController],
})
export class WordsModule {}
