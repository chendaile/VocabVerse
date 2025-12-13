import { Module } from '@nestjs/common';
import { WordPrismaService } from './word-prisma.service';

@Module({
    providers: [WordPrismaService],
    exports: [WordPrismaService],
})
export class WordPrismaModule {}
